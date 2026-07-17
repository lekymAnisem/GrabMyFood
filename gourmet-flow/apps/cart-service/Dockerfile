FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .


FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 4005

CMD ["node", "src/server.js"]
