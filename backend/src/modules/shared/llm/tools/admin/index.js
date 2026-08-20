import { getPlatformMetricsSchema, executeGetPlatformMetrics } from "./getPlatformMetrics.tool.js";

export const adminTools = [
  getPlatformMetricsSchema
];

export const adminExecutors = {
  getPlatformMetrics: executeGetPlatformMetrics
};
