FROM node:20-alpine AS build

ARG VITE_API_GATEWAY_URL=/api
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build


FROM nginxinc/nginx-unprivileged:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

USER 101

CMD ["nginx", "-g", "daemon off;"]
