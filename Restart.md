# CommerSync ECS Fargate - Complete Restart Guide

**Last Updated:** December 2025
**Estimated Time:** 30-45 minutes  
**Current State:** Services scaled to 0, ALB deleted  
**Target State:** All services running and accessible

---

## 📋 Prerequisites Checklist

Before starting, verify you have:

- [ ] AWS CLI installed and configured
- [ ] Access to AWS Console (https://console.aws.amazon.com)
- [ ] GitHub repository with workflow files
- [ ] Task definitions still exist in ECS
- [ ] Docker images still exist in ECR
- [ ] Secrets still exist in Secrets Manager

### Quick Verification

```bash
# Verify task definitions exist
aws ecs list-task-definitions --region us-east-1 --family-prefix commersync

# Verify Docker images exist
aws ecr describe-repositories --region us-east-1 --query 'repositories[*].repositoryName'

# Verify secrets exist
aws secretsmanager list-secrets --region us-east-1 --query 'SecretList[?contains(Name,`commersync`)].Name'
```

**Expected Results:**

- ✅ 4 task definition families
- ✅ 4 ECR repositories (auth-service, product-service, order-service, client-web)
- ✅ 2 secrets (/commersync/dev/database-url, /commersync/dev/jwt-secret)

---

## 🎯 Restart Overview

### What We'll Do:

1. **Recreate ECS Cluster** (2 min)
2. **Create Security Groups** (5 min)
3. **Create Application Load Balancer** (10 min)
4. **Create Target Groups** (5 min)
5. **Configure ALB Routing** (5 min)
6. **Recreate ECS Services** (10 min)
7. **Verify Everything Works** (3 min)

**Total Time:** ~30-45 minutes

---

## STEP 1: Recreate ECS Cluster

### Via AWS Console

1. **Go to ECS Console:** https://console.aws.amazon.com/ecs/
2. Click **"Clusters"** → **"Create cluster"**
3. **Configure:**
   - Cluster name: `commersync-dev-cluster`
   - Infrastructure: ✅ AWS Fargate (serverless)
   - Monitoring: ✅ Use Container Insights
4. **Tags:**
   - Key: `Environment`, Value: `development`
   - Key: `Project`, Value: `CommerSync`
5. Click **"Create"**

### Via AWS CLI

```bash
aws ecs create-cluster \
    --cluster-name commersync-dev-cluster \
    --capacity-providers FARGATE FARGATE_SPOT \
    --default-capacity-provider-strategy \
        capacityProvider=FARGATE,weight=1,base=1 \
        capacityProvider=FARGATE_SPOT,weight=4 \
    --settings name=containerInsights,value=enabled \
    --tags key=Environment,value=development key=Project,value=CommerSync \
    --region us-east-1
```

### Verification

```bash
aws ecs describe-clusters \
    --clusters commersync-dev-cluster \
    --region us-east-1 \
    --query 'clusters[0].{Name:clusterName,Status:status}'
```

**Expected:** Status should be `ACTIVE`

---

## STEP 2: Create Security Groups

### A. ALB Security Group

#### Via Console

1. **EC2 Console** → **Security Groups** → **Create security group**
2. **Basic details:**
   - Name: `commersync-alb-sg`
   - Description: `Security group for CommerSync ALB`
   - VPC: Select your default VPC
3. **Inbound rules:**
   - Click **"Add rule"**
   - Type: HTTP
   - Port: 80
   - Source: 0.0.0.0/0
   - Description: `Allow HTTP from internet`
4. **Outbound rules:**
   - Leave default (All traffic to 0.0.0.0/0)
5. **Tags:**
   - Key: `Name`, Value: `commersync-alb-sg`
6. Click **"Create security group"**
7. **📝 IMPORTANT: Copy the Security Group ID** (e.g., `sg-xxxxx`)

#### Via CLI

```bash
# Get VPC ID
VPC_ID=$(aws ec2 describe-vpcs \
    --filters "Name=isDefault,Values=true" \
    --query "Vpcs[0].VpcId" \
    --output text \
    --region us-east-1)

echo "VPC ID: $VPC_ID"

# Create ALB security group
ALB_SG_ID=$(aws ec2 create-security-group \
    --group-name commersync-alb-sg \
    --description "Security group for CommerSync ALB" \
    --vpc-id $VPC_ID \
    --region us-east-1 \
    --output text \
    --query 'GroupId')

echo "ALB Security Group ID: $ALB_SG_ID"

# Add HTTP inbound rule
aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region us-east-1

# Tag the security group
aws ec2 create-tags \
    --resources $ALB_SG_ID \
    --tags Key=Name,Value=commersync-alb-sg \
    --region us-east-1
```

### B. ECS Tasks Security Group

#### Via Console

1. **Create security group**
   - Name: `commersync-ecs-tasks-sg`
   - Description: `Security group for CommerSync ECS tasks`
   - VPC: Same as ALB
2. **Inbound rules:**
   - Type: Custom TCP
   - Port range: `3000-4003`
   - Source: **Custom** → Paste the ALB security group ID from above
   - Description: `Traffic from ALB`
3. **Outbound rules:**
   - ✅ Verify it shows: Type=All traffic, Destination=0.0.0.0/0
4. Click **"Create security group"**
5. **📝 Copy this Security Group ID too**

#### Via CLI

```bash
# Create ECS tasks security group
ECS_SG_ID=$(aws ec2 create-security-group \
    --group-name commersync-ecs-tasks-sg \
    --description "Security group for CommerSync ECS tasks" \
    --vpc-id $VPC_ID \
    --region us-east-1 \
    --output text \
    --query 'GroupId')

echo "ECS Security Group ID: $ECS_SG_ID"

# Allow traffic from ALB to ECS tasks
aws ec2 authorize-security-group-ingress \
    --group-id $ECS_SG_ID \
    --protocol tcp \
    --port 3000-4003 \
    --source-group $ALB_SG_ID \
    --region us-east-1

# Tag the security group
aws ec2 create-tags \
    --resources $ECS_SG_ID \
    --tags Key=Name,Value=commersync-ecs-tasks-sg \
    --region us-east-1
```

### Verification

```bash
# List security groups
aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=commersync-*" \
    --region us-east-1 \
    --query 'SecurityGroups[*].[GroupName,GroupId]' \
    --output table
```

**Expected:** 2 security groups listed

---

## STEP 3: Create Target Groups

Create one target group for each service.

### A. Auth Service Target Group

#### Via Console

1. **EC2** → **Target Groups** → **"Create target group"**
2. **Choose target type:**
   - ✅ Select **"IP addresses"** (required for Fargate)
   - Click **"Next"**
3. **Basic configuration:**
   - Target group name: `commersync-auth-tg`
   - Protocol: HTTP
   - Port: `4001`
   - VPC: Your default VPC
   - Protocol version: HTTP1
4. **Health checks:**
   - Health check protocol: HTTP
   - Health check path: `/`
   - Advanced health check settings:
     - Healthy threshold: `2`
     - Unhealthy threshold: `3`
     - Timeout: `5` seconds
     - Interval: `30` seconds
     - Success codes: `200-499`
5. **Tags:**
   - Key: `Service`, Value: `auth`
6. Click **"Next"**
7. **Don't register any targets** (ECS will do this)
8. Click **"Create target group"**

#### Via CLI

```bash
# Auth service target group
AUTH_TG_ARN=$(aws elbv2 create-target-group \
    --name commersync-auth-tg \
    --protocol HTTP \
    --port 4001 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --health-check-enabled \
    --health-check-path / \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --matcher HttpCode=200-499 \
    --region us-east-1 \
    --tags Key=Service,Value=auth \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

echo "Auth Target Group ARN: $AUTH_TG_ARN"
```

### B. Product Service Target Group

#### Via Console

Repeat same steps as Auth, but change:

- Target group name: `commersync-product-tg`
- Port: `4002`
- Tag Value: `product`

#### Via CLI

```bash
PRODUCT_TG_ARN=$(aws elbv2 create-target-group \
    --name commersync-product-tg \
    --protocol HTTP \
    --port 4002 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --health-check-path / \
    --matcher HttpCode=200-499 \
    --region us-east-1 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

echo "Product Target Group ARN: $PRODUCT_TG_ARN"
```

### C. Order Service Target Group

#### Via Console

Repeat with:

- Target group name: `commersync-order-tg`
- Port: `4003`
- Tag Value: `order`

#### Via CLI

```bash
ORDER_TG_ARN=$(aws elbv2 create-target-group \
    --name commersync-order-tg \
    --protocol HTTP \
    --port 4003 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --health-check-path / \
    --matcher HttpCode=200-499 \
    --region us-east-1 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

echo "Order Target Group ARN: $ORDER_TG_ARN"
```

### D. Client Web Target Group

#### Via Console

Repeat with:

- Target group name: `commersync-client-tg`
- Port: `3000`
- Tag Value: `client`

#### Via CLI

```bash
CLIENT_TG_ARN=$(aws elbv2 create-target-group \
    --name commersync-client-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id $VPC_ID \
    --target-type ip \
    --health-check-path / \
    --matcher HttpCode=200-499 \
    --region us-east-1 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

echo "Client Target Group ARN: $CLIENT_TG_ARN"
```

### Verification

```bash
# List all target groups
aws elbv2 describe-target-groups \
    --region us-east-1 \
    --query 'TargetGroups[?contains(TargetGroupName,`commersync`)].{Name:TargetGroupName,Port:Port}' \
    --output table
```

**Expected:** 4 target groups listed

---

## STEP 4: Create Application Load Balancer

### Via Console

1. **EC2** → **Load Balancers** → **"Create load balancer"**
2. Select **"Application Load Balancer"** → Click **"Create"**
3. **Basic configuration:**
   - Name: `commersync-dev-alb`
   - Scheme: **Internet-facing** ⚠️ IMPORTANT!
   - IP address type: IPv4
4. **Network mapping:**
   - VPC: Your default VPC
   - Mappings: ✅ **Select ALL available availability zones** (minimum 2)
5. **Security groups:**
   - ❌ Remove the default security group
   - ✅ Select `commersync-alb-sg` only
6. **Listeners and routing:**
   - Protocol: HTTP
   - Port: 80
   - Default action: Forward to → `commersync-client-tg`
7. **Tags:**
   - Key: `Environment`, Value: `development`
   - Key: `Project`, Value: `CommerSync`
8. Click **"Create load balancer"**
9. **⏳ Wait 2-3 minutes** for ALB to become "Active"
10. **📝 IMPORTANT: Copy the DNS name**
    - Example: `commersync-dev-alb-123456789.us-east-1.elb.amazonaws.com`

### Via CLI

```bash
# Get subnet IDs (need at least 2 in different AZs)
SUBNET_IDS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$VPC_ID" \
    --query "Subnets[0:2].SubnetId" \
    --output text \
    --region us-east-1)

SUBNET1=$(echo $SUBNET_IDS | cut -d' ' -f1)
SUBNET2=$(echo $SUBNET_IDS | cut -d' ' -f2)

echo "Subnet 1: $SUBNET1"
echo "Subnet 2: $SUBNET2"

# Create ALB
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name commersync-dev-alb \
    --subnets $SUBNET1 $SUBNET2 \
    --security-groups $ALB_SG_ID \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --region us-east-1 \
    --tags Key=Environment,Value=development Key=Project,Value=CommerSync \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)

echo "ALB ARN: $ALB_ARN"

# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].DNSName' \
    --output text \
    --region us-east-1)

echo "ALB DNS: $ALB_DNS"
echo "Save this DNS name! You'll use it to access your services."

# Create HTTP listener with default action (client-web)
LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$CLIENT_TG_ARN \
    --region us-east-1 \
    --query 'Listeners[0].ListenerArn' \
    --output text)

echo "Listener ARN: $LISTENER_ARN"
```

### Verification

```bash
# Check ALB status
aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].{State:State.Code,DNS:DNSName,Scheme:Scheme}' \
    --region us-east-1
```

**Expected:** State should be `active`, Scheme should be `internet-facing`

---

## STEP 5: Configure ALB Routing Rules

Add path-based routing rules to direct traffic to correct services.

### Via Console

1. **Load Balancers** → Click `commersync-dev-alb`
2. Click **"Listeners and rules"** tab
3. Click on **HTTP:80** (the listener link)
4. Click **"Manage rules"** (or the **"+"** icon to insert rule)

#### Add Auth Service Rule

1. Click **"Insert rule"** (before the default rule)
2. **Add condition:**
   - Select **"Path"**
   - Enter: `/api/auth/*`
   - Click ✓
3. **Add action:**
   - Select **"Forward to"**
   - Target group: `commersync-auth-tg`
   - Click ✓
4. **Priority:** `1`
5. Click **"Save"**

#### Add Product Service Rule

1. Click **"Insert rule"**
2. Condition: Path = `/api/products/*`
3. Action: Forward to `commersync-product-tg`
4. Priority: `2`
5. Save

#### Add Order Service Rule

1. Click **"Insert rule"**
2. Condition: Path = `/api/orders/*`
3. Action: Forward to `commersync-order-tg`
4. Priority: `3`
5. Save

**Final Rules Order:**

```
Priority 1: /api/auth/*     → commersync-auth-tg
Priority 2: /api/products/* → commersync-product-tg
Priority 3: /api/orders/*   → commersync-order-tg
Default:    *               → commersync-client-tg
```

### Via CLI

```bash
# Add rule for /api/auth/*
aws elbv2 create-rule \
    --listener-arn $LISTENER_ARN \
    --priority 1 \
    --conditions Field=path-pattern,Values='/api/auth/*' \
    --actions Type=forward,TargetGroupArn=$AUTH_TG_ARN \
    --region us-east-1

# Add rule for /api/products/*
aws elbv2 create-rule \
    --listener-arn $LISTENER_ARN \
    --priority 2 \
    --conditions Field=path-pattern,Values='/api/products/*' \
    --actions Type=forward,TargetGroupArn=$PRODUCT_TG_ARN \
    --region us-east-1

# Add rule for /api/orders/*
aws elbv2 create-rule \
    --listener-arn $LISTENER_ARN \
    --priority 3 \
    --conditions Field=path-pattern,Values='/api/orders/*' \
    --actions Type=forward,TargetGroupArn=$ORDER_TG_ARN \
    --region us-east-1

echo "✅ All routing rules created"
```

### Verification

```bash
# List all rules
aws elbv2 describe-rules \
    --listener-arn $LISTENER_ARN \
    --region us-east-1 \
    --query 'Rules[*].{Priority:Priority,Condition:Conditions[0].Values[0]}' \
    --output table
```

**Expected:** 4 rules (3 path-based + 1 default)

---

## STEP 6: Recreate ECS Services

Now create the ECS services that will run your containers.

### A. Auth Service

#### Via Console

1. **ECS** → **Clusters** → `commersync-dev-cluster`
2. Click **"Services"** tab → **"Create"**
3. **Environment:**
   - Compute options: Launch type
   - Launch type: FARGATE
4. **Deployment configuration:**
   - Application type: Service
   - Family: `commersync-auth-service-task`
   - Service name: `commersync-auth-service`
   - Desired tasks: `2`
5. **Networking:**
   - VPC: Your default VPC
   - Subnets: ✅ **Select ALL available subnets**
   - Security group:
     - ✅ Use existing
     - ❌ Remove default
     - ✅ Select `commersync-ecs-tasks-sg`
   - Public IP: ✅ **TURN ON** (Critical!)
6. **Load balancing:**
   - Load balancer type: Application Load Balancer
   - Load balancer: `commersync-dev-alb`
   - Container: `auth-service 4001:4001`
   - Listener: HTTP:80
   - Target group: `commersync-auth-tg`
   - Health check grace period: `60` seconds
7. Click **"Create"**
8. **⏳ Wait 2-3 minutes** for tasks to start

#### Via CLI

```bash
# Create network configuration file
cat > network-config.json << EOF
{
  "awsvpcConfiguration": {
    "subnets": ["$SUBNET1", "$SUBNET2"],
    "securityGroups": ["$ECS_SG_ID"],
    "assignPublicIp": "ENABLED"
  }
}
EOF

# Create auth service
aws ecs create-service \
    --cluster commersync-dev-cluster \
    --service-name commersync-auth-service \
    --task-definition commersync-auth-service-task \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration file://network-config.json \
    --load-balancers "targetGroupArn=$AUTH_TG_ARN,containerName=auth-service,containerPort=4001" \
    --health-check-grace-period-seconds 60 \
    --region us-east-1

echo "✅ Auth service created"
```

### B. Product Service

#### Via Console

Repeat same steps, but change:

- Task definition: `commersync-product-service-task`
- Service name: `commersync-product-service`
- Container: `product-service 4002:4002`
- Target group: `commersync-product-tg`

#### Via CLI

```bash
aws ecs create-service \
    --cluster commersync-dev-cluster \
    --service-name commersync-product-service \
    --task-definition commersync-product-service-task \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration file://network-config.json \
    --load-balancers "targetGroupArn=$PRODUCT_TG_ARN,containerName=product-service,containerPort=4002" \
    --health-check-grace-period-seconds 60 \
    --region us-east-1

echo "✅ Product service created"
```

### C. Order Service

#### Via Console

Change:

- Task definition: `commersync-order-service-task`
- Service name: `commersync-order-service`
- Container: `order-service 4003:4003`
- Target group: `commersync-order-tg`

#### Via CLI

```bash
aws ecs create-service \
    --cluster commersync-dev-cluster \
    --service-name commersync-order-service \
    --task-definition commersync-order-service-task \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration file://network-config.json \
    --load-balancers "targetGroupArn=$ORDER_TG_ARN,containerName=order-service,containerPort=4003" \
    --health-check-grace-period-seconds 60 \
    --region us-east-1

echo "✅ Order service created"
```

### D. Client Web Service

#### Via Console

Change:

- Task definition: `commersync-client-web-task`
- Service name: `commersync-client-web-service`
- Container: `client-web 3000:3000`
- Target group: `commersync-client-tg`

#### Via CLI

```bash
aws ecs create-service \
    --cluster commersync-dev-cluster \
    --service-name commersync-client-web-service \
    --task-definition commersync-client-web-task \
    --desired-count 2 \
    --launch-type FARGATE \
    --network-configuration file://network-config.json \
    --load-balancers "targetGroupArn=$CLIENT_TG_ARN,containerName=client-web,containerPort=3000" \
    --health-check-grace-period-seconds 60 \
    --region us-east-1

echo "✅ Client web service created"
```

### Monitor Service Startup

```bash
# Watch all services
watch -n 5 'aws ecs describe-services \
    --cluster commersync-dev-cluster \
    --services commersync-auth-service commersync-product-service commersync-order-service commersync-client-web-service \
    --region us-east-1 \
    --query "services[*].{Service:serviceName,Running:runningCount,Desired:desiredCount}" \
    --output table'
```

**Wait until all services show: Running=2, Desired=2**

This takes **2-3 minutes** per service.

---

## STEP 7: Verify Everything Works

### A. Check Service Status

```bash
# All services should show 2/2 running
aws ecs describe-services \
    --cluster commersync-dev-cluster \
    --services commersync-auth-service commersync-product-service commersync-order-service commersync-client-web-service \
    --region us-east-1 \
    --query 'services[*].[serviceName,status,runningCount,desiredCount]' \
    --output table
```

**Expected Output:**

```
commersync-auth-service        ACTIVE    2    2
commersync-product-service     ACTIVE    2    2
commersync-order-service       ACTIVE    2    2
commersync-client-web-service  ACTIVE    2    2
```

### B. Check Target Health

```bash
# All targets should show "healthy"
aws elbv2 describe-target-health \
    --target-group-arn $AUTH_TG_ARN \
    --region us-east-1 \
    --query 'TargetHealthDescriptions[*].TargetHealth.State'
```

**Expected:** `["healthy", "healthy"]` for each target group

Repeat for all target groups or check in console:

- **EC2** → **Target Groups** → Select each one → **Targets** tab

### C. Test Endpoints

Replace `YOUR_ALB_DNS` with your actual ALB DNS name from Step 4.

```bash
# Set your ALB DNS
ALB_DNS="commersync-dev-alb-123456789.us-east-1.elb.amazonaws.com"

# Test client web (frontend)
curl http://$ALB_DNS/

# Test auth service
curl http://$ALB_DNS/api/auth/

# Test product service
curl http://$ALB_DNS/api/products/

# Test order service
curl http://$ALB_DNS/api/orders/
```

**Expected:** Each should return a response (not connection timeout)

### D. Test in Browser

Open these URLs in your browser:

```
http://YOUR_ALB_DNS/
http://YOUR_ALB_DNS/api/auth/
http://YOUR_ALB_DNS/api/products/
http://YOUR_ALB_DNS/api/orders/
```

### E. Check CloudWatch Logs

```bash
# View recent logs for auth service
aws logs tail /ecs/commersync/auth-service \
    --since 5m \
    --region us-east-1

# Follow logs in real-time
aws logs tail /ecs/commersync/auth-service \
    --follow \
    --region us-east-1
```

---

## 🎉 Success Checklist

After completing all steps, verify:

- [ ] ECS Cluster is Active
- [ ] All 4 services show 2/2 running tasks
- [ ] All 4 target groups show 2 healthy targets
- [ ] ALB is in "active" state
- [ ] All 4 endpoints return responses
- [ ] CloudWatch logs show containers starting successfully
- [ ] No error messages in ECS service events

---

## 📊 Cost Estimate (After Restart)

Your monthly costs will be:

```
ALB:                ~$16/month
8 Fargate tasks:    ~$35/month
Data transfer:      ~$5/month
CloudWatch Logs:    ~$3/month
ECR Images:         ~$0.50/month
Secrets Manager:    ~$0.80/month
────────────────────────────────
TOTAL:              ~$60/month
```

---

## 🔧 Troubleshooting

### Services Won't Start

**Check security groups:**

```bash
# ECS tasks need outbound access to 0.0.0.0/0
aws ec2 describe-security-groups \
    --group-ids $ECS_SG_ID \
    --query 'SecurityGroups[0].IpPermissionsEgress'
```

**Expected:** Should allow all outbound traffic

**Check public IP:**

- ECS tasks MUST have "Assign public IP" enabled
- Check: ECS → Service → Networking tab

### Targets Stay Unhealthy

**Check health check settings:**

```bash
aws elbv2 describe-target-groups \
    --target-group-arns $AUTH_TG_ARN \
    --query 'TargetGroups[0].HealthCheckPath'
```

**Fix if needed:**

```bash
# Update health check to accept broader status codes
aws elbv2 modify-target-group \
    --target-group-arn $AUTH_TG_ARN \
    --matcher HttpCode=200-499 \
    --region us-east-1
```

### Can't Access ALB from Internet

**Check ALB scheme:**

```bash
aws elbv2 describe-load-balancers \
    --load-balancer-arns $ALB_ARN \
    --query 'LoadBalancers[0].Scheme'
```

**Must be:** `internet-facing` (not `internal`)

**If internal:** Delete and recreate ALB with correct scheme

### Tasks Immediately Stop

**Check CloudWatch logs:**

```bash
aws logs tail /ecs/commersync/auth-service --region us-east-1
```

**Common issues:**

- Missing environment variables
- Database connection failures
- Application crashes on startup

---

## 📝 Quick Reference Commands

### Stop Services (Scale to 0)

```bash
for SERVICE in commersync-auth-service commersync-product-service commersync-order-service commersync-client-web-service; do
    aws ecs update-service \
        --cluster commersync-dev-cluster \
        --service $SERVICE \
        --desired-count 0 \
        --region us-east-1
done
```

### Restart Services (Scale Back Up)

```bash
for SERVICE in commersync-auth-service commersync-product-service commersync-order-service commersync-client-web-service; do
    aws ecs update-service \
        --cluster commersync-dev-cluster \
        --service $SERVICE \
        --desired-
```

### Force New Deployment

```bash
aws ecs update-service \
    --cluster commersync-dev-cluster \
    --service commersync-auth-service \
    --force-new-deployment \
    --region us-east-1
```

### View Service Events

```bash
aws ecs describe-services \
    --cluster commersync-dev-cluster \
    --services commersync-auth-service \
    --query 'services[0].events[0:5]' \
    --region us-east-1
```

---

## 📞 Support

If you encounter issues:

1. **Check CloudWatch Logs** first
2. **Review service events** in ECS console
3. **Verify security groups** allow required traffic
4. **Check target health** in target groups
5. **Test connectivity** from ECS tasks to external services

---

## 🔄 Auto-Scaling (Optional)

If you want to re-enable auto-scaling:

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/commersync-dev-cluster/commersync-auth-service \
    --min-capacity 2 \
    --max-capacity 10 \
    --region us-east-1

# Add CPU-based scaling
aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/commersync-dev-cluster/commersync-auth-service \
    --policy-name auth-service-cpu-scaling \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration '{
        "TargetValue": 70.0,
        "PredefinedMetricSpecification": {
            "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
        },
        "ScaleOutCooldown": 60,
        "ScaleInCooldown": 120
    }' \
    --region us-east-1
```

Repeat for all services.

---

## ✅ Completion

You've successfully restarted all CommerSync services!

**Your application is now:**

- ✅ Running on AWS Fargate
- ✅ Load balanced with ALB
- ✅ Auto-healing (ECS restarts failed tasks)
- ✅ Accessible via HTTP at your ALB DNS
- ✅ Logging to CloudWatch
- ✅ Ready for production traffic

**Next steps:**

- Set up auto-scaling (optional)
- Configure custom domain with Route 53
- Add HTTPS with ACM certificate
- Set up CloudWatch alarms
- Enable CI/CD deployments via GitHub Actions

---

**Document Version:** 1.0  
**Last Updated:** December 2025
**Maintained By:** Tarun
