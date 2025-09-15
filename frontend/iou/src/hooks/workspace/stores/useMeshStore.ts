import type {StateCreator} from "zustand/vanilla";
import type {Mesh} from "three";
import {create} from "zustand/react";
import { CSG } from 'three-csg-ts';

export type Meshes = {[shapeId: string]: Mesh}
export interface MeshSlice {
  meshes: Meshes;
  intersection?: Mesh;

  setMesh: (shapeId: string, mesh: Mesh) => void;
  deleteMesh: (shapeId: string) => void;
}

const calculateNewIntersection = (meshesObject: Meshes) => {
  const ids = Object.keys(meshesObject);
  const meshes = ids.map((id) => meshesObject[id]);

  if (meshes.length < 2)
    return undefined;

  return meshes
    .slice(1)
    .reduce((acc: Mesh, value: Mesh) => CSG.intersect(acc, value), meshes[0]);
}

/**
 * This is another store, separate to the shapes store, to just store the ThreeJS convex hulls. We need to access them
 * from multiple places to do intersections.
 */
export const createMeshSlice: StateCreator<MeshSlice, [], [], MeshSlice> = ((set) => ({
  meshes: {
    // No meshes to begin with!
  },
  intersection: undefined,

  setMesh: (shapeId: string, mesh: Mesh) => set((state: MeshSlice) => {
    const newMeshes = {
      ...state.meshes,
      [shapeId]: mesh,
    };

    return ({
      meshes: newMeshes,
      intersection: calculateNewIntersection(newMeshes),
    });
  }),

  deleteMesh: (shapeId: string) => set((state: MeshSlice) => {
    const {[shapeId]: _, ...newMeshes} = state.meshes;

    return ({
      meshes: newMeshes,
      intersection: calculateNewIntersection(newMeshes),
    });
  }),
}));

/**
 * This is another store, separate to the shapes store, to just store the ThreeJS convex hulls. We need to access them
 * from multiple places to do intersections.
 */
const useMeshStore = create<MeshSlice>()((...a) => ({
  ...createMeshSlice(...a),
}));
export default useMeshStore;