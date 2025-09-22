import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {ConvexHull} from "three/examples/jsm/math/ConvexHull.js";
import * as THREE from "three";

export interface ConvexHullResult {
  normals: number[],
  vertices: number[],
  edges: [Vec3, Vec3][]
}

self.onmessage = async (event: MessageEvent<Vec3[]>) => {
  const vertices = event.data;
  const vectors = vertices.map(v => new THREE.Vector3(...v));

  if (vertices.length < 3) {
    self.postMessage({
      vertices: [],
      normals: [],
      edges: []
    });
    return;
  }
  else if (vertices.length === 3) {
    const reversedVertices = [...vertices].reverse();
    const norm = (vectors[1].clone().sub(vectors[0])).cross(vectors[2].clone().sub(vectors[0])).normalize();
    const normals = vertices.map(() => [norm.x, norm.y, norm.z]).flat();
    const reversedNormals = vertices.map(() => [-norm.x, -norm.y, -norm.z]).flat();
    const edges: [Vec3, Vec3][] = [
        [vertices[0], vertices[1]],
        [vertices[1], vertices[2]],
        [vertices[2], vertices[0]],
    ];

    const result = {
      vertices: [...vertices.flat(), ...reversedVertices.flat()],
      normals: [...normals, ...reversedNormals],
      edges: edges
    }
    self.postMessage(result);
    return;
  }

  const convexHull = new ConvexHull().setFromPoints( vectors );
  const faces = convexHull.faces;

  const outputVertices: number[] = [];
  const outputNormals: number[] = [];
  const edges: [Vec3, Vec3][] = [];
  const visitedEdges = new Set<string>();

  for (let i = 0; i < faces.length; i ++ ) {
    const face = faces[ i ];
    let edge = face.edge;
    do {
      const point = edge.head().point;
      outputVertices.push( point.x, point.y, point.z );
      outputNormals.push( face.normal.x, face.normal.y, face.normal.z );
      
      const v1 = edge.tail().point;
      const v2 = edge.head().point;
      const v1Str = `${v1.x},${v1.y},${v1.z}`;
      const v2Str = `${v2.x},${v2.y},${v2.z}`;
      const edgeKey = v1Str < v2Str ? `${v1Str}|${v2Str}` : `${v2Str}|${v1Str}`;

      if (!visitedEdges.has(edgeKey)) {
          visitedEdges.add(edgeKey);
          edges.push([
              [v1.x, v1.y, v1.z],
              [v2.x, v2.y, v2.z]
          ]);
      }
      edge = edge.next;
    } while ( edge !== face.edge );
  }

  self.postMessage({
    vertices: outputVertices,
    normals: outputNormals,
    edges: edges
  });
};