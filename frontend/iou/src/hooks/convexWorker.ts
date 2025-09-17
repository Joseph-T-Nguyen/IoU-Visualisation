import type { Vec3 } from "@/hooks/workspace/workspaceTypes.ts";
import { ConvexHull } from "three/examples/jsm/math/ConvexHull";
import * as THREE from "three";

export interface ConvexHullResult {
  positions: number[];   // flat xyz array of unique vertices
  normals?: number[];     // flat xyz array, per face-vertex
  indices?: number[];     // triangle indices into positions
  edges: [Vec3, Vec3][]; // optional for rendering edges
}

const FLAT_THRESHOLD = 1e-4; // adjust: smaller = stricter flat detection

self.onmessage = (event: MessageEvent<Vec3[]>) => {
  const vertices = event.data;
  const vectors = vertices.map((v) => new THREE.Vector3(...v));

  if (vertices.length < 3) {
    self.postMessage({ positions: [], normals: [], indices: [] });
    return;
  }

  // Special case: triangle
  if (vertices.length === 3) {
    const [a, b, c] = vectors;
    const norm = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    const negNorm = new THREE.Vector3().copy(norm).negate();

    return self.postMessage({
      positions: [
        ...a.toArray(), ...b.toArray(), ...c.toArray(),
        ...a.toArray(), ...c.toArray(), ...b.toArray()
      ],
      normals: [
        ...norm.toArray(), ...norm.toArray(), ...norm.toArray(),
        ...negNorm.toArray(), ...negNorm.toArray(), ...negNorm.toArray()
      ],
      // indices: [0, 1, 2, 0, 2, 1],
      edges: [
        [a.toArray() as Vec3, b.toArray() as Vec3],
        [b.toArray() as Vec3, c.toArray() as Vec3],
        [c.toArray() as Vec3, a.toArray() as Vec3],
      ],
    });
  }

  // Convex hull
  const convexHull = new ConvexHull().setFromPoints(vectors);
  const faces = convexHull.faces;

  // Collect unique vertices
  const vertexMap = new Map<string, number>();
  const uniqueVertices: Vec3[] = [];
  const normals : number[] = [];
  const positions : number[] = [];
  // const indices: number[] = [];

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

    // faceIndices.forEach((idx) => {
    //   if (!normalsMap.has(idx))
    //     normalsMap.set(idx, []);
    //
    //   if (points.length >= 3) {
    //     const normal = new THREE.Vector3().subVectors(points[1], points[0]).cross(new THREE.Vector3().subVectors(points[2], points[0])).normalize();
    //     normalsMap.get(idx)!.push(normal);
    //   }
    // })

    // Triangulate the polygonal face (fan triangulation)
    for (let j = 1; j < faceIndices.length - 1; j++) {
      positions.push(...[faceIndices[0], faceIndices[j], faceIndices[j + 1]].flatMap(x => uniqueVertices[x]));

      const normal = face.normal.toArray();
      normals.push(...normal, ...normal, ...normal);
      // indices.push(faceIndices[0], faceIndices[j], faceIndices[j + 1]);
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

  // Flatten positions from unique vertices
  // const positions: number[] = [];
  // for (const v of uniqueVertices) {
  //   positions.push(...v);
  // }

  // const allNormals = uniqueVertices
  //   .map((_, i) => (normalsMap.has(i) ? normalsMap.get(i) : [new THREE.Vector3()]));
  //
  // const normals = allNormals
  //   .map(vNormals => {
  //     const accumulatedNormal = vNormals!.reduce((acc, current) => {
  //       const normal = new THREE.Vector3();
  //       normal.addVectors(acc, current);
  //       return normal;
  //     });
  //     const normal = accumulatedNormal.multiplyScalar(1.0 / (vNormals?.length ?? 0));
  //     return normal
  //   })
  //   .flatMap(normal => [normal.x, normal.y, normal.z]);

  self.postMessage({
    positions,
    normals,
    // indices,
    edges: edgeOutput,
  } as ConvexHullResult);
};