# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - use npm install to ensure all packages are resolved
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Create data directory for SQLite database before build
RUN mkdir -p /app/data

# Set production environment (blocks admin routes via middleware)
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# No Chromium/Puppeteer needed in production - screenshots are pre-generated

# Add non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder /app/node_modules/libsql ./node_modules/libsql

# Copy package.json for reference
COPY --from=builder /app/package.json ./package.json

# Install sharp for image optimization
RUN npm install sharp --legacy-peer-deps --production

# Copy data directory structure (create if doesn't exist)
RUN mkdir -p /app/data
RUN mkdir -p /app/public/screenshots

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]