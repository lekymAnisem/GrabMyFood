#!/usr/bin/env bash
set -euo pipefail

AGENT_DIR="${DEVOPS_AI_AGENT_PATH:-/Users/admin/Documents/Ai Agent/devops-ai-command-center}"
AGENT_FRONTEND_PORT="${DEVOPS_AI_FRONTEND_PORT:-5174}"

if [ ! -d "$AGENT_DIR" ]; then
  echo "DevOps AI agent directory not found: $AGENT_DIR" >&2
  exit 1
fi

cd "$AGENT_DIR"

export PORT="${DEVOPS_AI_BACKEND_PORT:-5001}"
export FRONTEND_URL="${DEVOPS_AI_FRONTEND_URL:-http://localhost:${AGENT_FRONTEND_PORT}}"
export PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
export GRAFANA_BASE_URL="${GRAFANA_BASE_URL:-http://localhost:3000}"

npm run dev:backend &
BACKEND_PID=$!

cleanup() {
  kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

npm run dev:frontend -- --port "$AGENT_FRONTEND_PORT"
