import * as k8s from "@kubernetes/client-node";

export class KubernetesReader {
  private readonly core: k8s.CoreV1Api;
  private readonly apps: k8s.AppsV1Api;

  constructor() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    this.core = kc.makeApiClient(k8s.CoreV1Api);
    this.apps = kc.makeApiClient(k8s.AppsV1Api);
  }

  async listPods(namespace: string, labelSelector?: string) {
    const response = await this.core.listNamespacedPod({ namespace, labelSelector });
    return response.items.map((pod: k8s.V1Pod) => ({
      name: pod.metadata?.name,
      phase: pod.status?.phase,
      nodeName: pod.spec?.nodeName,
      ownerReferences: pod.metadata?.ownerReferences ?? [],
      containers: pod.status?.containerStatuses?.map((container: k8s.V1ContainerStatus) => ({
        name: container.name,
        ready: container.ready,
        restartCount: container.restartCount,
        image: container.image,
        waitingReason: container.state?.waiting?.reason,
        terminatedReason: container.lastState?.terminated?.reason,
        exitCode: container.lastState?.terminated?.exitCode
      }))
    }));
  }

  async listEvents(namespace: string, fieldSelector?: string) {
    const response = await this.core.listNamespacedEvent({ namespace, fieldSelector });
    return response.items.slice(-25).map((event: k8s.CoreV1Event) => ({
      type: event.type,
      reason: event.reason,
      message: event.message,
      involvedObject: event.involvedObject?.name,
      lastTimestamp: event.lastTimestamp
    }));
  }

  async readDeployment(namespace: string, name: string) {
    const response = await this.apps.readNamespacedDeployment({ namespace, name });
    const deployment = response;
    return {
      name: deployment.metadata?.name,
      generation: deployment.metadata?.generation,
      replicas: deployment.spec?.replicas ?? 0,
      availableReplicas: deployment.status?.availableReplicas ?? 0,
      unavailableReplicas: deployment.status?.unavailableReplicas ?? 0,
      image: deployment.spec?.template.spec?.containers.map((container: k8s.V1Container) => container.image)
    };
  }
}
