# Use Node.js LTS version
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat bash
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY turbo.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install bash for npm scripts
RUN apk add --no-cache bash

# Copy package files and source code
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY turbo.json ./
COPY apps/web ./apps/web

# Install all dependencies (including devDependencies)
RUN npm ci --ignore-scripts

# Build the Next.js application
RUN cd apps/web && npm run build

# Production image, copy all the files and run Next.js
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set environment
ENV NODE_ENV=production
ENV PORT=3002

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3002

# Start the Next.js application
CMD ["npm", "run", "serve"]
