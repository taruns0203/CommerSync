# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++
RUN npm i -g pnpm

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json turbo.json ./

# Copy server source
COPY server/ ./server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the service
RUN pnpm --filter @server/product-service build

# Verify build output
RUN echo "=== Build output ===" && ls -la /app/server/services/product-service/dist/

# Stage 2: Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install runtime utilities
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeuser

RUN npm i -g pnpm

# Copy workspace files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy server code
COPY --from=builder --chown=nodeuser:nodejs /app/server ./server

WORKDIR /app/server/services/product-service

EXPOSE 4002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4002/health || exit 1

USER nodeuser

# Run server.js instead of index.js
CMD ["node", "dist/server.js"]