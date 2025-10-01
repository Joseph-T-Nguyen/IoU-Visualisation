import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";

/**
 * Computes the convex hull of a set of 2D points using Andrew's monotone chain.
 * @param vertices array of [x, y, 0] vertices
 * @returns flattened array [x1, y1, z1, x2, y2, z2, ...] of all triangles, NOT a CCW winding order.
 */
export function convexPolygonHull(vertices: Vec3[]): Vec3[] {
  if (vertices.length <= 1)
    return vertices as Vec3[];

  // Sort by x, then y
  const points = [...vertices].sort((a, b) =>
    a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]
  );

  // Cross product of OA × OB
  const cross = (o: Vec3, a: Vec3, b: Vec3) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower: Vec3[] = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Vec3[] = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  // Concatenate lower and upper, removing duplicate endpoints
  // array [[x1, y1, z1], [x2, y2, z2], ...] in CCW order. Not yet as faces
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  return hull;
}

const ccwToFaces = (ccw: Vec3[]) => {
  // Special case for triangle. The CCW winding order happens to already be a triangle.
  if (ccw.length <= 3)
    return ccw.flat();

  // Manually construct individual triangles from the winding
  return [
    ...ccw.slice(0, 3).flat(),
    ...ccw.slice(3).flatMap((v, i) => [...ccw[0], ...ccw[i+2], ...v]),
  ];
}

// Worker code, runs the quick hull algorithm
self.onmessage = async (event: MessageEvent<Vec3[]>) => {
  const vertices = event.data;

  const hull = convexPolygonHull(vertices);
  const faces = ccwToFaces(hull);

  self.postMessage({
    positions: faces,
    normals: Array(hull.length).fill([0,0,1]).flat(),
    edges: [...hull.slice(1).map((v, i) => [hull[i], v]), [hull[hull.length-1], hull[0]]],
  });
};
