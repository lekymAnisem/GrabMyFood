# ==========================================
# Build stage
# ==========================================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --no-audit --no-fund

COPY . .


# ==========================================
# Production runtime (non-root, prod deps only)
# ==========================================
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Create a dedicated non-root user
RUN groupadd --system appgroup \
    && useradd --system --gid appgroup --no-create-home appuser

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Remove build/dev dependencies and hand over ownership to the non-root user
RUN npm prune --omit=dev --no-audit --no-fund \
    && npm cache clean --force \
    && chown -R appuser:appgroup /app

USER appuser

EXPOSE 4006

CMD ["node", "src/server.js"]