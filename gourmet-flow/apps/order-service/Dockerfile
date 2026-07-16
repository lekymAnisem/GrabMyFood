FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 4006
CMD ["node", "src/server.js"]
