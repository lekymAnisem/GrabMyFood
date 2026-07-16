FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 4002
CMD ["node", "src/server.js"]
