# Use Node.js LTS version
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat bash
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
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
COPY apps/api/package*.json ./apps/api/
COPY turbo.json ./
COPY apps/api ./apps/api

# Install all dependencies (including devDependencies)
RUN npm ci --ignore-scripts

# Generate Prisma client
RUN cd apps/api && npx prisma generate

# Build the application
RUN cd apps/api && npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/apps/api/prisma ./prisma

USER nodejs

EXPOSE 8002

ENV PORT=8002
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "serve"]
