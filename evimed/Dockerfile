# Stage 1: Build the React app
FROM node:18-alpine AS builder
WORKDIR /app

# Accept build arguments
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ARG REACT_APP_YANDEX_MAPS_API_KEY
ENV REACT_APP_YANDEX_MAPS_API_KEY=$REACT_APP_YANDEX_MAPS_API_KEY

COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Debug: show environment variables
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL"
RUN echo "REACT_APP_YANDEX_MAPS_API_KEY is set: $([ -n "$REACT_APP_YANDEX_MAPS_API_KEY" ] && echo 'yes' || echo 'no')"
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html
# Expose port
EXPOSE 80
# Default command
CMD ["nginx", "-g", "daemon off;"]
