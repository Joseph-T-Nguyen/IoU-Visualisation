import type { Vec2 } from "@/hooks/workspace/workspaceTypes.ts";
import martinez from "martinez-polygon-clipping";

// Define the expected input from the main thread
export interface WorkerInput {
  shapes: Vec2[][];
}

// Define the structure of the reply message
export interface IntersectionWorkerReply {
  iou?: number;
}

/**
 * Calculate the area of a simple polygon.
 */
function polygonArea(polygon: Vec2[]): number {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i][0] * polygon[j][1];
    area -= polygon[j][0] * polygon[i][1];
  }
  return Math.abs(area / 2);
}

/**
 * Handle messages from the main thread.
 */
self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { shapes } = event.data;

  if (shapes.length < 2) {
    self.postMessage({ iou: undefined });
    return;
  }

  // Wrap the polygons to match the GeoJSON format
  const geoJSONPolygon1 = [shapes[0]];
  const geoJSONPolygon2 = [shapes[1]];

  // Perform intersection and union operations
  const intersection = martinez.intersection(geoJSONPolygon1, geoJSONPolygon2);
  const union = martinez.union(geoJSONPolygon1, geoJSONPolygon2);

  // Calculate the area of the resulting shapes
  const intersectionArea = intersection ? polygonArea(intersection[0][0] as Vec2[]) : 0;
  const unionArea = union ? polygonArea(union[0][0] as Vec2[]) : 0;

  // Calculate and post the IoU
  const iou = unionArea > 0 ? intersectionArea / unionArea : 0;
  self.postMessage({ iou });
};