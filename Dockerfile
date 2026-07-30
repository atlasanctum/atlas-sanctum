# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install deps separately so this layer is cached unless package.json changes
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.27-alpine AS production

# Run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure nginx can write its temp/pid files as non-root
RUN chown -R appuser:appgroup /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

USER appuser

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]