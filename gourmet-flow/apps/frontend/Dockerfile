FROM node:20-alpine AS builder

ARG VITE_API_GATEWAY_URL

WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN VITE_API_GATEWAY_URL=${VITE_API_GATEWAY_URL} npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
