#!/bin/bash
curl -X POST http://54.252.6.66:8081/webhooks/alertmanager \
  -H "Content-Type: application/json" \
  -d @ai-kubernetes-agent/examples/alertmanager-crashloop.json
