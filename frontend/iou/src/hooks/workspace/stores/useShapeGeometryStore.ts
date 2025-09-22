import type { StateCreator } from "zustand/vanilla";
import { create } from "zustand/react";
import * as THREE from 'three';
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { IntersectionWorkerReply as IntersectionWorkerReply3D, WorkerGeometryInput, WorkerInput as WorkerInput3D } from "@/hooks/workspace/stores/intersection.worker.ts";
// NOTE: 2D worker imports are removed for now as it is not implemented yet.
import { useDimensionsStore, type DimensionsStore } from "@/hooks/workspace/stores/useDimensionsStore.ts";

export type ShapeGeometries = { [shapeId: string]: THREE.BufferGeometry };

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

export const createShapeGeometrySlice: StateCreator<ShapeGeometrySlice, [], [], ShapeGeometrySlice> = (setRaw, get) => {
  const pendingDataRef: Ref<ShapeGeometries | null> = { current: null };
  const runningRef: Ref<boolean> = { current: false };

  let worker: Worker | null = null;

  const onDataReceived = (reply: IntersectionWorkerReply3D) => {
    if (reply.position) {
      const buffer = new BufferGeometry();
      buffer.setAttribute('position', new Float32BufferAttribute(reply.position, 3));
      if (reply.normal) {
        buffer.setAttribute('normal', new Float32BufferAttribute(reply.normal, 3));
      }
      setRaw({ intersection: buffer, iou: reply.iou });
    } else {
      setRaw({ intersection: undefined, iou: reply.iou });
    }

    runningRef.current = false;
    if (pendingDataRef.current) {
      const data = pendingDataRef.current;
      pendingDataRef.current = null;
      calculateNewIntersection(data);
    }
  };

  const getOrCreateWorker = (): Worker => {
    if (worker) {
      return worker;
    }
    const workerUrl = new URL("./intersection.worker.ts", import.meta.url);
    const newWorker = new Worker(workerUrl, { type: "module" });
    newWorker.onmessage = (e) => onDataReceived(e.data);
    worker = newWorker;
    return worker;
  };

  const calculateNewIntersection = (geometries: ShapeGeometries) => {
    const dimensions = useDimensionsStore.getState().dimensions;
    if (dimensions === '2d') {
        // If we are in 2D, just clear the intersection and do nothing.
        setRaw({ intersection: undefined, iou: undefined });
        return;
    }
      
    if (runningRef.current) {
      pendingDataRef.current = geometries;
      return;
    }

    const worker = getOrCreateWorker();
    runningRef.current = true;

    const shapeIds = Object.keys(geometries);
    const meshes = shapeIds
      .map(id => geometries[id])
      .map(geo => ({
        position: geo.getAttribute("position").array as Float32Array,
        normal: geo.getAttribute("normal").array as Float32Array,
      }) as WorkerGeometryInput);
    worker.postMessage({ meshes } as WorkerInput3D);
  };

  const set = (partial: Partial<ShapeGeometrySlice> | ((state: ShapeGeometrySlice) => Partial<ShapeGeometrySlice>)) => {
    setRaw(partial);
    const state = get();
    calculateNewIntersection(state.meshes);
  };

  // Subscribe to dimension changes to clear intersection state
  useDimensionsStore.subscribe((state: DimensionsStore) => {
    if (state.dimensions === '2d') {
        setRaw({ intersection: undefined, iou: undefined });
    }
    calculateNewIntersection(get().meshes);
  });

  return ({
    meshes: {},
    intersection: undefined,
    setGeometry: (shapeId: string, geometry: THREE.BufferGeometry) => set((state: ShapeGeometrySlice) => ({
      meshes: { ...state.meshes, [shapeId]: geometry }
    })),
    deleteGeometry: (shapeId: string) => set((state: ShapeGeometrySlice) => {
      const { [shapeId]: _, ...newMeshes } = state.meshes;
      return ({ meshes: newMeshes });
    }),
  });
};

const useShapeGeometryStore = create<ShapeGeometrySlice>()((...a) => ({
  ...createShapeGeometrySlice(...a),
}));

export default useShapeGeometryStore;