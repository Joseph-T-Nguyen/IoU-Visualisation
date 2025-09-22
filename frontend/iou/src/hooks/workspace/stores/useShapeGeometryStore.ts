import type {StateCreator} from "zustand/vanilla";
import {create} from "zustand/react";
import * as THREE from 'three';
import {BufferGeometry, Float32BufferAttribute} from "three";
import type {
  IntersectionWorkerReply,
  WorkerGeometryInput,
  WorkerInput
} from "@/hooks/workspace/stores/intersection.worker.ts";

export type ShapeGeometries = {[shapeId: string]: THREE.BufferGeometry};

export interface ShapeGeometrySlice {
  meshes: ShapeGeometries,
  intersection?: THREE.BufferGeometry,
  iou?: number,

  setGeometry: (shapeId: string, geometry: THREE.BufferGeometry) => void,
  deleteGeometry: (shapeId: string) => void,
}

interface Ref<T> {
  current: T;
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

  const pendingDataRef : Ref<ShapeGeometries | null> = {current: null};
  const runningRef : Ref<boolean> = {current: false};

  const workerUrl = new URL("./intersection.worker.ts", import.meta.url);
  const worker = new Worker(workerUrl, { type: "module" });

  const sendToWorker = (input: WorkerInput) => {
    runningRef.current = true;
    worker.postMessage(input);
  }

  const onDataReceived = (reply: IntersectionWorkerReply) => {
    if (reply.position === undefined) {
      setRaw(() => ({
        intersection: undefined,
        iou: reply.iou, //< the position buffer being undefined should also mean this is undefined, but why not add this
      }));
      return;
    }

    // Apply result from worker
    const buffer = new BufferGeometry();

    // TODO: Use FloatArrays instead when transferring data between the worker and the main thread
    buffer.setAttribute( 'position', new Float32BufferAttribute(reply.position, 3));
    buffer.setAttribute( 'normal', new Float32BufferAttribute(reply.normal!, 3));

    setRaw(() => ({
      intersection: buffer,
      iou: reply.iou
    }));
  }

  const storeGeometryToWorkerGeometry = (geometries: ShapeGeometries) => {
    const shapeIds = Object.keys(geometries);
    const meshes = shapeIds
      .map(id => geometries[id])
      .map(geo => ({
        position: geo.getAttribute("position").array,
        normal: geo.getAttribute("normal").array,
      }) as WorkerGeometryInput);

    return {
      meshes: meshes,
    } as WorkerInput;
  }

  worker.onmessage = (e) => {
    onDataReceived(e.data as IntersectionWorkerReply);

    if (pendingDataRef.current === null) {
      runningRef.current = false;
      return;
    }

    // Service next bit of data
    sendToWorker(storeGeometryToWorkerGeometry(pendingDataRef.current));
    pendingDataRef.current = null;
  }

  const calculateNewIntersection = (geometries: ShapeGeometries) => {
    if (runningRef.current) {
      pendingDataRef.current = geometries;
      return;
    }

    sendToWorker(storeGeometryToWorkerGeometry(geometries));
  }

  // We modify the 'set' function to have the side effect of calculating intersection geometry in a web worker
  const set = (partial: Partial<ShapeGeometrySlice> | ((state: ShapeGeometrySlice) => Partial<ShapeGeometrySlice>)) => {
    setRaw(partial);

    // Manually get the current state of the store to work with
    const state = get();
    calculateNewIntersection(state.meshes);
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