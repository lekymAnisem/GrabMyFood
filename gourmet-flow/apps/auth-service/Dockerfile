# ==========================================
# Build stage
# ==========================================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# openssl is required by the Prisma query engine (binary engine)
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .

RUN npx prisma generate


# ==========================================
# Production runtime (non-root, prod deps only)
# ==========================================
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# openssl is required by the Prisma query engine at runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create a dedicated non-root user
RUN groupadd --system appgroup \
    && useradd --system --gid appgroup --no-create-home appuser

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Remove build/dev dependencies and hand over ownership to the non-root user
RUN npm prune --omit=dev --no-audit --no-fund \
    && npm cache clean --force \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 4001

CMD ["node", "src/server.js"]