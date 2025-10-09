import type {Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import {ConvexHull} from "three/examples/jsm/math/ConvexHull.js";
import * as THREE from "three";

export interface ConvexHullResult {
  positions: number[],    // flat xyz array of unique vertices
  normals?: number[],     // flat xyz array, per face-vertex
  edges: [Vec3, Vec3][],  // optional for rendering edges
}

const FLAT_THRESHOLD = 1e-4; // adjust: smaller = stricter flat detection

// Worker code, runs the quick hull algorithm
self.onmessage = async (event: MessageEvent<Vec3[]>) => {
  const vertices = event.data;
  const vectors = vertices.map(v => new THREE.Vector3(...v));

  if (vertices.length < 2) {
    // Special case for points
    self.postMessage({
      positions: [],
      normals: [],
      edges: []
    });
    return;
  }
  if (vertices.length === 2) {
    // Special case for lines and points
    self.postMessage({
      positions: [],
      normals: [],
      edges: [[vertices[0], vertices[1]]]
    });
    return;
  }
  else if (vertices.length === 3) {
    // Special case for triangles
    // Get reverse vertices to draw a triangle on the other side of the shape
    const reversedVertices = [...vertices].reverse();

    // Get the normal vector for the front face
    const norm = (vectors[1].clone().sub(vectors[0])).cross(vectors[2].clone().sub(vectors[0])).normalize();
    const normals = vertices.map(() => [norm.x, norm.y, norm.z]).flat();
    const reversedNormals = vertices.map(() => [-norm.x, -norm.y, -norm.z]).flat();
    const edges: [Vec3, Vec3][] = [
        [vertices[0], vertices[1]],
        [vertices[1], vertices[2]],
        [vertices[2], vertices[0]],
    ];

    const result = {
      positions: [...vertices.flat(), ...reversedVertices.flat()],
      normals: [...normals, ...reversedNormals],
      edges: edges
    }
    self.postMessage(result);
    return;
  }

  // Convex hull
  const convexHull = new ConvexHull().setFromPoints(vectors);
  const faces = convexHull.faces;

  // Collect unique vertices
  const vertexMap = new Map<string, number>();
  const uniqueVertices: Vec3[] = [];
  const normals : number[] = [];
  const positions : number[] = [];

  const getVertexIndex = (p: THREE.Vector3): number => {
    const key = `${p.x},${p.y},${p.z}`;
    if (!vertexMap.has(key)) {
      const idx = uniqueVertices.length;
      vertexMap.set(key, idx);
      uniqueVertices.push([p.x, p.y, p.z]);
      return idx;
    }
    return vertexMap.get(key)!;
  };

  // Maps vertex ids to all normals
  // const normalsMap = new Map<number, THREE.Vector3[]>();

  type FaceEdge = { faceIdx: number; v1: number; v2: number };
  const edgeMap = new Map<string, FaceEdge[]>();
  const encodeEdge = (a: number, b: number) => (a < b ? `${a}_${b}` : `${b}_${a}`);

  for (let i = 0; i < faces.length; i++) {
    const face = faces[i];
    let edge = face.edge;

    // const points: THREE.Vector3[] = [];
    const faceIndices: number[] = [];
    // For every edge:
    do {
      const point = edge.head().point;
      // points.push(point);
      const idx = getVertexIndex(point);
      faceIndices.push(idx);

      edge = edge.next;
    } while (edge !== face.edge);

    // Vertex id pairs for every edge on the face
    const faceIdxEdges = faceIndices
      .map((vIdx, j) => [vIdx, faceIndices[(j+1) % faceIndices.length]] as [number, number]);

    faceIdxEdges.forEach(([v1, v2]) => {
      const key = encodeEdge(v1, v2);
      if (!edgeMap.has(key)) edgeMap.set(key, []);
      edgeMap.get(key)?.push({ faceIdx: i, v1, v2 });
    });

    // Triangulate the polygonal face (fan triangulation)
    for (let j = 1; j < faceIndices.length - 1; j++) {
      positions.push(...[faceIndices[0], faceIndices[j], faceIndices[j + 1]].flatMap(x => uniqueVertices[x]));

      const normal = face.normal.toArray();
      normals.push(...normal, ...normal, ...normal);
    }
  }

  // Collect only sharp edges
  const edgeOutput: [Vec3, Vec3][] = [];
  for (const edges of edgeMap.values()) {
    if (edges.length === 1) {
      // Border edge → always include
      const { v1, v2 } = edges[0];
      edgeOutput.push([
        uniqueVertices[v1],
        uniqueVertices[v2]
      ]);
    } else if (edges.length >= 2) {
      // Shared edge → compare normals
      const n1 = faces[edges[0].faceIdx].normal;
      const n2 = faces[edges[1].faceIdx].normal;
      const dot = n1.dot(n2); // cos(theta)

      if (dot < 1 - FLAT_THRESHOLD) {
        // angle > threshold → keep edge
        const { v1, v2 } = edges[0];
        edgeOutput.push([
          uniqueVertices[v1],
          uniqueVertices[v2]
        ]);
      }
    }
  }

  self.postMessage({
    positions,
    normals,
    edges: edgeOutput,
  } as ConvexHullResult);
};