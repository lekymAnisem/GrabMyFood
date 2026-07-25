import { describe, expect, it } from "vitest";
import { renderQuery } from "../src/prometheus/queries.js";

describe("renderQuery", () => {
  it("replaces PromQL template variables", () => {
    expect(renderQuery('metric{namespace="$namespace",pod=~"$workload.*"}', {
      namespace: "gourmet-flow",
      workload: "payment-service"
    })).toBe('metric{namespace="gourmet-flow",pod=~"payment-service.*"}');
  });
});
