import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {Vector3} from "three";

export function vec3ToVector3(vec3: Vec3, is2d: boolean): Vector3 {
  if (is2d)
    return new Vector3(vec3[0], vec3[1], 0);
  return new Vector3(vec3[0], vec3[1], vec3[2]);
}

/**
 * Given a point and a set of vertices, gets the index of the closest vertex in vertices to the given point
 */
export function findClosestVertexId(point: Vector3, vertices: Vec3[], is2d: boolean): number {
  let closest: number = 0;
  let minDist = Infinity;

  if (is2d)
    point.z = 0;

  for (let i = 0; i < vertices.length; i++) {
    const vertex = vec3ToVector3(vertices[i], is2d);

    const dist = vertex.distanceToSquared(point);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }

  return closest;
}
