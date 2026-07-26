import urllib.request, json
d = json.dumps({
    "receiver": "ai-kubernetes-agent",
    "status": "firing",
    "alerts": [{
        "status": "firing",
        "labels": {
            "alertname": "KubernetesPodCrashLooping",
            "severity": "critical",
            "namespace": "gourmet-flow",
            "deployment": "payment-service",
            "pod": "payment-service-xyz",
            "container": "payment-service"
        },
        "annotations": {
            "summary": "Pod crash looping",
            "description": "Container restarted 12 times"
        },
        "startsAt": "2026-07-26T12:00:00Z",
        "endsAt": "0001-01-01T00:00:00Z",
        "generatorURL": "http://prometheus:9090/graph",
        "fingerprint": "abc123"
    }],
    "groupLabels": {"alertname": "KubernetesPodCrashLooping", "namespace": "gourmet-flow"},
    "commonLabels": {"deployment": "payment-service", "namespace": "gourmet-flow"},
    "commonAnnotations": {},
    "externalURL": "http://alertmanager:9093"
})
req = urllib.request.Request(
    "http://54.252.6.66:8081/webhooks/alertmanager",
    data=d.encode(),
    headers={"Content-Type": "application/json"}
)
resp = json.loads(urllib.request.urlopen(req).read())
print(json.dumps(resp, indent=2))
