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
 *
 * Note: if you add anything to this slice, any time you call set, a new intersection geometry will be calculated as a
 * side effect. If you want to add data to this, but changes to that data shouldn't change the result of the
 * intersection calculation, you should probably make a new slice to contain that data
 */
export const createShapeGeometrySlice: StateCreator<ShapeGeometrySlice, [], [], ShapeGeometrySlice> = (setRaw, get) => {
  // This a function body, not a returned object! We set up some useful helper functions here

  // We modify the 'set' function to have the side effect of calculating intersection geometry in a web worker
  const set = (partial: Partial<ShapeGeometrySlice> | ((state: ShapeGeometrySlice) => Partial<ShapeGeometrySlice>)) => {
    setRaw(partial);

    // Manually get the current state of the store to work with
    const state = get();

    // TODO: Do this in a web worker somehow
    const intersectionGeometry = calculateNewIntersectionGeometry(state.meshes);
    setRaw(() => ({
      intersection: intersectionGeometry,
    }));
  };

  // This is the actual initial store definition:
  return ({
    meshes: {
      // No meshes to begin with!
    },
    intersection: undefined,

    setGeometry: (shapeId: string, geometry: THREE.BufferGeometry) => set((state: ShapeGeometrySlice) => {
      return {
        meshes: {
          ...state.meshes,
          [shapeId]: geometry,
        }
      };
    }),

    deleteGeometry: (shapeId: string) => set((state: ShapeGeometrySlice) => {
      const {[shapeId]: _, ...newMeshes} = state.meshes;

      return ({
        meshes: newMeshes,
        intersection: calculateNewIntersectionGeometry(newMeshes),
      });
    }),
  });
};

/**
 * This is another store, separate to the shapes store, to just store the ThreeJS convex hulls. We need to access them
 * from multiple places to do intersections.
 */
const useShapeGeometryStore = create<ShapeGeometrySlice>()((...a) => ({
  ...createShapeGeometrySlice(...a),
}));
export default useShapeGeometryStore;