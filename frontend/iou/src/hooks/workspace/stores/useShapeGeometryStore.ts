import type {StateCreator} from "zustand/vanilla";
import {create} from "zustand/react";
import { CSG } from 'three-csg-ts';
import * as THREE from 'three';

export type BufferGeometryMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>
export type ShapeGeometries = {[shapeId: string]: THREE.BufferGeometry};

export interface ShapeGeometrySlice {
  meshes: ShapeGeometries;
  intersection?: THREE.BufferGeometry;

  setGeometry: (shapeId: string, geometry: THREE.BufferGeometry) => void;
  deleteGeometry: (shapeId: string) => void;
}

/**
 * Uses three-csg-ts to calculate the intersection of all the given shape geometries, by first creating meshes with the
 * geometries.
 * @param geometries The current registered geometries
 */
const calculateNewIntersectionGeometry = (geometries: ShapeGeometries) => {
  const shapeIds = Object.keys(geometries);
  const meshes = shapeIds
    .map(id => geometries[id])
    .map(mesh => new THREE.Mesh(mesh) as BufferGeometryMesh);

  if (meshes.length < 2)
    return undefined;

  const intersectionMesh = meshes
    .slice(1)
    .reduce((acc: THREE.Mesh, value: THREE.Mesh) => CSG.intersect(acc, value), meshes[0]);

  return intersectionMesh.geometry as THREE.BufferGeometry;
}

/**
 * This is another store, separate to the shapes store, to just store the ThreeJS convex hulls. We need to access them
 * from multiple places to do intersections.
 */
export const createShapeGeometrySlice: StateCreator<ShapeGeometrySlice, [], [], ShapeGeometrySlice> = ((set) => ({
  meshes: {
    // No meshes to begin with!
  },
  intersection: undefined,

  setGeometry: (shapeId: string, geometry: THREE.BufferGeometry) => set((state: ShapeGeometrySlice) => {
    const newMeshes = {
      ...state.meshes,
      [shapeId]: geometry,
    };

    return ({
      meshes: newMeshes,
      intersection: calculateNewIntersectionGeometry(newMeshes),
    });
  }),

  deleteGeometry: (shapeId: string) => set((state: ShapeGeometrySlice) => {
    const {[shapeId]: _, ...newMeshes} = state.meshes;

    return ({
      meshes: newMeshes,
      intersection: calculateNewIntersectionGeometry(newMeshes),
    });
  }),
}));

/**
 * This is another store, separate to the shapes store, to just store the ThreeJS convex hulls. We need to access them
 * from multiple places to do intersections.
 */
const useShapeGeometryStore = create<ShapeGeometrySlice>()((...a) => ({
  ...createShapeGeometrySlice(...a),
}));
export default useShapeGeometryStore;