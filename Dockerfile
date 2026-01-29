# Stage 1: Build Frontend
FROM node:20-alpine as builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm ci

# Copy frontend source code
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production

# Copy backend source code
COPY backend/ ./

# Copy built frontend assets from builder stage
# backend/server.js expects ../dist relative to itself, so we put dist in /app/dist
COPY --from=builder /app/dist ../dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
