import {type BufferGeometry} from "three";
import {ConvexGeometry} from "three/examples/jsm/geometries/ConvexGeometry";
import {vec3ToVector3} from "@/components/three/shape/vertexHelpers.ts";
import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {ConvexHull} from "three/examples/jsm/math/ConvexHull";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ConvexHullResult {
  normals: number[],
  vertices: number[]
}

// Worker code
self.onmessage = (event: MessageEvent<Vec3[]>) => {
  const vertices = event.data;

  const vectors = vertices.map(vec3ToVector3)

  if (vertices.length < 3) {
    self.postMessage({
      vertices: [],
      normals: []
    });
    return;
  }
  else if (vertices.length === 3) {
    // Special case for triangles
    const norm = (vectors[1].sub(vectors[0])).cross(vectors[2].sub(vectors[0])).normalize();
    const reversedVertices = [...vertices].reverse();

    const normals = vertices.map(() => [norm.x, norm.y, norm.z]).flat();
    const reversedNormals = vertices.map(() => [-norm.x, -norm.y, -norm.z]).flat();

    const result = {
      vertices: [...vertices.flat(), ...reversedVertices.flat()],
      normals: [...normals, ...reversedNormals],
    }
    self.postMessage(result);
    return;
  }

  // Otherwise use the convex hull algorithm:
  const convexHull = new ConvexHull().setFromPoints( vectors );
  const faces = convexHull.faces;

  const outputVertices: number[] = [];
  const outputNormals: number[] = [];

  for (let i = 0; i < faces.length; i ++ ) {
    const face = faces[ i ];
    let edge = face.edge;

    // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)
    do {
      const point = edge.head().point;

      outputVertices.push( point.x, point.y, point.z );
      outputNormals.push( face.normal.x, face.normal.y, face.normal.z );

      edge = edge.next;

    } while ( edge !== face.edge );
  }

  self.postMessage({
    vertices: outputVertices,
    normals: outputNormals,
  });
};
