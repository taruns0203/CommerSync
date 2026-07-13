# CommerSync

**CommerSync** is a production-grade, enterprise-scale ecommerce platform designed to serve millions of users with sub-200ms read latency and 99.95% availability.

This repository is a monorepo managed with **pnpm workspaces** and **Turborepo**, containing both the frontend applications and backend microservices.

## 🏗 Architecture & Tech Stack

### Architecture

- **Monorepo**: pnpm workspaces + Turborepo
- **Frontend**: Next.js 16 (App Router), React 19, Material-UI (MUI), Atomic Design principles
- **Backend**: Microservices architecture (Node.js/Express)
- **Infrastructure**: Docker, AWS ECS Fargate, ECR, Application Load Balancer
- **CI/CD**: GitHub Actions with OIDC AWS authentication

### Core Tech Stack

- **Languages**: TypeScript, Node.js
- **Frontend**: Next.js 16, React 19, MUI
- **Backend Framework**: Express
- **Database**: PostgreSQL (Relational Data)
- **Caching**: Redis
- **Message Broker**: Kafka (Event-Driven Architecture)
- **Containerization**: Docker, Docker Compose
- **Cloud**: AWS

## 📂 Project Structure

```
CommerSync/
├── client/                 # Frontend Workspace
│   ├── apps/
│   │   ├── web/            # Main Storefront (Next.js)
│   │   └── dashboard/      # Admin Dashboard
│   └── packages/           # Shared Frontend Packages (design-system, ui, types)
├── server/                 # Backend Workspace
│   ├── services/
│   │   ├── auth-service/   # Authentication & Authorization
│   │   ├── users/          # User Management
│   │   ├── products/       # Product Catalog
│   │   └── ...             # Other microservices (cart, orders, payments, etc.)
├── packages/               # Shared Full-stack Packages (config, logger, event-bus)
├── docs/                   # System Design & Architecture Documentation
├── documentation/          # Engineering Handbooks (Contributing, Branch Strategy, etc.)
└── awsData/                # AWS ECS Task Definitions & Infrastructure Configs
```

## 🚀 Quick Start (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [pnpm](https://pnpm.io/) (v10+)
- [Docker](https://www.docker.com/) & Docker Compose

### Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/CommerSync.git
   cd CommerSync
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start local infrastructure (Databases, Redis, Kafka):**

   ```bash
   docker-compose up -d
   ```

4. **Run the development servers (Frontend & Backend):**
   ```bash
   pnpm run dev
   ```

## 📖 Documentation & Engineering Standards

CommerSync is built on strict engineering excellence principles, mirroring FAANG-scale best practices.
Please refer to the extensive documentation before contributing:

### System Design

- [Backend Implementation Roadmap](docs/backend/MASTER_IMPLEMENTATION_ROADMAP.md)
- [Frontend System Design](docs/frontend/PROJECT_ARCHITECTURE.md)
- [CQRS Architecture](docs/backend/VOLUME_2_CHAPTER_1_CQRS.md)

### Engineering Guidelines

- [Branch Strategy & Git Workflow](documentation/contributing/BRANCH_STRATEGY.md)
- [Commit Convention](documentation/contributing/COMMIT_CONVENTION.md)
- [Pull Request Guidelines](documentation/contributing/PULL_REQUEST_TEMPLATE.md)
- [Code Owners](documentation/contributing/CODEOWNERS.md)

## 🛡 License

This project is proprietary and confidential.
