FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npx prisma generate


FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 4001

CMD ["node", "src/server.js"]
