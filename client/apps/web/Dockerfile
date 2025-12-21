# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++
RUN npm i -g pnpm

# Copy workspace configuration files from root
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json turbo.json ./

# Copy client source files
COPY client/ ./client/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build the web app and its dependencies
RUN pnpm --filter web build

# Stage 2: Runtime for Next.js
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create node user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Install pnpm in runner stage
RUN npm i -g pnpm

# Copy workspace configuration for proper module resolution
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy root node_modules (contains workspace-linked packages)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy the entire client directory (includes built Next.js app and all packages)
COPY --from=builder --chown=nextjs:nodejs /app/client ./client

# Set working directory to the Next.js app
WORKDIR /app/client/apps/web

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Start Next.js
CMD ["pnpm", "start"]