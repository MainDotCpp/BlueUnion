# ---- Base ----
FROM node:20-alpine AS base
RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/website/package.json ./apps/website/package.json
COPY apps/admin/package.json ./apps/admin/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
RUN pnpm install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
ARG APP_NAME
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/website/node_modules ./apps/website/node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules
COPY . .

# Generate Prisma client
RUN cd packages/database && pnpm db:generate

# Build the target app
RUN pnpm build:${APP_NAME}

# Ensure public dir exists (admin may not have one)
RUN mkdir -p /app/apps/${APP_NAME}/public

# ---- Runner ----
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

USER nextjs

EXPOSE 3000

# standalone server.js always listens on 3000
CMD node apps/${APP_NAME}/server.js
