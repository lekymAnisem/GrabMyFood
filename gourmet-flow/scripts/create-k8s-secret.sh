#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${NAMESPACE:-gourmet-flow}"
SECRET_NAME="${SECRET_NAME:-gourmet-flow-secrets}"

required_vars=(
  JWT_SECRET
  JWT_REFRESH_SECRET
  AUTH_DATABASE_URL
  USER_DATABASE_URL
  RESTAURANT_DATABASE_URL
  MENU_DATABASE_URL
  CART_DATABASE_URL
  ORDER_DATABASE_URL
  PAYMENT_DATABASE_URL
  DELIVERY_DATABASE_URL
)

missing_vars=()
for var_name in "${required_vars[@]}"; do
  if [ -z "${!var_name:-}" ]; then
    missing_vars+=("$var_name")
  fi
done

if [ "${#missing_vars[@]}" -gt 0 ]; then
  echo "Missing required environment variables:" >&2
  printf '  - %s\n' "${missing_vars[@]}" >&2
  echo "" >&2
  echo "Export them first, or source a local env file that is not committed." >&2
  exit 1
fi

kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

kubectl create secret generic "$SECRET_NAME" \
  --namespace "$NAMESPACE" \
  --from-literal JWT_SECRET="$JWT_SECRET" \
  --from-literal JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET" \
  --from-literal AUTH_DATABASE_URL="$AUTH_DATABASE_URL" \
  --from-literal USER_DATABASE_URL="$USER_DATABASE_URL" \
  --from-literal RESTAURANT_DATABASE_URL="$RESTAURANT_DATABASE_URL" \
  --from-literal MENU_DATABASE_URL="$MENU_DATABASE_URL" \
  --from-literal CART_DATABASE_URL="$CART_DATABASE_URL" \
  --from-literal ORDER_DATABASE_URL="$ORDER_DATABASE_URL" \
  --from-literal PAYMENT_DATABASE_URL="$PAYMENT_DATABASE_URL" \
  --from-literal DELIVERY_DATABASE_URL="$DELIVERY_DATABASE_URL" \
  --dry-run=client \
  -o yaml | kubectl apply -f -

kubectl get secret "$SECRET_NAME" --namespace "$NAMESPACE"
