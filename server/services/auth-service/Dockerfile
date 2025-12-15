# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++
RUN npm i -g pnpm

# Copy workspace configuration files
COPY ../../../package.json ./package.json
COPY ../../../pnpm-lock.yaml ./pnpm-lock.yaml
COPY ../../../pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ../../../tsconfig.base.json ./tsconfig.base.json
COPY ../../../turbo.json ./turbo.json

# Copy server source files
COPY ../../ ./server/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build the auth service and its dependencies
RUN pnpm --filter @server/auth-service build

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create node user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

# Install pnpm in runner stage
RUN npm i -g pnpm

# Copy workspace configuration
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy root node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy the entire server directory
COPY --from=builder --chown=nodeuser:nodejs /app/server ./server

# Set working directory to the auth service
WORKDIR /app/server/services/auth-service

# Expose port (adjust based on your service)
EXPOSE 4001

# Switch to non-root user
USER nodeuser

# Start the service
CMD ["node", "dist/index.js"]