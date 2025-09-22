import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {ConvexHull} from "three/examples/jsm/math/ConvexHull.js";
import * as THREE from "three";

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export interface ConvexHullResult {
  normals: number[],
  vertices: number[],
  edges: [Vec3, Vec3][]
}

// Worker code, runs the quick hull algorithm
self.onmessage = async (event: MessageEvent<Vec3[]>) => {
  const vertices = event.data;
  const vectors = vertices.map(v => new THREE.Vector3(...v));

  if (vertices.length < 3) {
    // Special case for lines and points
    self.postMessage({
      vertices: [],
      normals: []
    });
    return;
  }
  else if (vertices.length === 3) {
    // Special case for triangles
    // Get reverse vertices to draw a triangle on the other side of the shape
    const reversedVertices = [...vertices].reverse();

    // Get the normal vector for the front face
    const norm = (vectors[1].sub(vectors[0])).cross(vectors[2].sub(vectors[0])).normalize();
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

  const edgesSet = new Set<[Vec3, Vec3]>();

  for (let i = 0; i < faces.length; i ++ ) {
    const face = faces[ i ];
    let edge = face.edge;

    // we move along a doubly-connected edge list to access all face points (see HalfEdge docs)
    do {
      const point = edge.head().point;

      outputVertices.push( point.x, point.y, point.z );
      outputNormals.push( face.normal.x, face.normal.y, face.normal.z );

      edge = edge.next;

      edgesSet.add([
        [edge.prev.vertex.point.x, edge.prev.vertex.point.y, edge.prev.vertex.point.z],
        [edge.vertex.point.x, edge.vertex.point.y, edge.vertex.point.z]
      ])

    } while ( edge !== face.edge );
  }

  // You can test simulated lag like this:
  // await sleep(100);

  self.postMessage({
    vertices: outputVertices,
    normals: outputNormals,
    edges: [...edgesSet]
  });
};
