# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# ---- Production Stage ----
FROM node:18-alpine

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose the application port
EXPOSE 3333

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=3333

# Start the server
CMD ["node", "src/server.js"]
