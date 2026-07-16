#!/usr/bin/env bash
set -Eeuo pipefail

: "${AWS_REGION:?AWS_REGION is required}"
: "${EKS_CLUSTER:?EKS_CLUSTER is required}"
: "${K8S_NAMESPACE:?K8S_NAMESPACE is required}"

echo "========================================"
echo " AWS Identity"
echo "========================================"
aws sts get-caller-identity

echo ""
echo "========================================"
echo " EKS Cluster"
echo "========================================"
aws eks describe-cluster \
  --name "$EKS_CLUSTER" \
  --region "$AWS_REGION" \
  --query 'cluster.{Name:name, Status:status, Endpoint:endpoint}' \
  --output table

KUBECONFIG="${KUBECONFIG:-${WORKSPACE:-$HOME}/.kube/config}"
mkdir -p "$(dirname "$KUBECONFIG")"
rm -f "$KUBECONFIG"

aws eks update-kubeconfig \
  --name "$EKS_CLUSTER" \
  --region "$AWS_REGION" \
  --kubeconfig "$KUBECONFIG"

export KUBECONFIG

SERVER=$(kubectl config view --minify \
  -o jsonpath='{.clusters[0].cluster.server}')

case "$SERVER" in
  https://*.eks.amazonaws.com|https://*.eks.amazonaws.com.cn)
    echo "Valid EKS endpoint: $SERVER"
    ;;
  *)
    echo "ERROR: kubeconfig does not point to EKS: $SERVER" >&2
    exit 1
    ;;
esac

echo ""
echo "========================================"
echo " Kubernetes Permissions"
echo "========================================"
kubectl auth can-i get nodes
kubectl auth can-i create deployments -n "$K8S_NAMESPACE"
kubectl get nodes
