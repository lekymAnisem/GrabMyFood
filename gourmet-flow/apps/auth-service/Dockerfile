FROM node:20-slim AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npx prisma generate

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 4001
CMD ["node", "src/server.js"]
