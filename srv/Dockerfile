# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (using npm install to update lock file if needed)
RUN npm install --no-audit --no-fund

# Fix permissions for node_modules/.bin
RUN chmod -R +x node_modules/.bin || true

# Generate Prisma Client
RUN node node_modules/prisma/build/index.js generate

# Copy application code
COPY . .

# Remove .env file if it exists (use environment variables from docker-compose instead)
RUN rm -f .env .env.local .env.*.local || true

# Create uploads directory
RUN mkdir -p public/uploads/categories public/uploads/services

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]

# Start server
CMD ["sh", "-c", "npm run db:generate && npm run db:deploy && npm start"]

