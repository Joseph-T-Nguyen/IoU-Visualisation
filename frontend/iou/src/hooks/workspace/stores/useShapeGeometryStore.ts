import type { StateCreator } from "zustand/vanilla";
import { create } from "zustand/react";
import * as THREE from 'three';
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { IntersectionWorkerReply as IntersectionWorkerReply3D, WorkerGeometryInput, WorkerInput as WorkerInput3D } from "@/hooks/workspace/stores/intersection.worker.ts";
import type { IntersectionWorkerReply2D, WorkerGeometryInput2D, WorkerInput2D } from "@/hooks/workspace/stores/2d-intersection.worker.ts";
import { useDimensionsStore } from "@/hooks/workspace/stores/useDimensionsStore.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

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

  let worker3D: Worker | null = null;
  let worker2D: Worker | null = null;

  const onDataReceived = (reply: IntersectionWorkerReply3D | IntersectionWorkerReply2D) => {
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

  const getOrCreateWorker = (dimensions: '2d' | '3d'): Worker => {
    if (dimensions === '3d') {
      if (worker3D) {
        return worker3D;
      }
      const workerUrl = new URL("./intersection.worker.ts", import.meta.url);
      const newWorker = new Worker(workerUrl, { type: "module" });
      newWorker.onmessage = (e) => onDataReceived(e.data);
      worker3D = newWorker;
      return worker3D;
    } else {
      if (worker2D) {
        return worker2D;
      }
      const workerUrl = new URL("./2d-intersection.worker.ts", import.meta.url);
      const newWorker = new Worker(workerUrl, { type: "module" });
      newWorker.onmessage = (e) => onDataReceived(e.data);
      worker2D = newWorker;
      return worker2D;
    }
  };

  const calculateNewIntersection = (geometries: ShapeGeometries) => {
    const dimensions = useDimensionsStore.getState().dimensions;

    if (runningRef.current) {
      pendingDataRef.current = geometries;
      return;
    }

    const worker = getOrCreateWorker(dimensions);
    runningRef.current = true;

    // Filter out hidden shapes before calculating intersection
    const shapes = useShapesStore.getState().shapes;
    const shapeIds = Object.keys(geometries).filter(id => shapes[id]?.visible !== false);
    const meshes = shapeIds
      .map(id => geometries[id])
      .map(geo => ({
        position: geo.getAttribute("position").array as Float32Array,
        normal: geo.getAttribute("normal").array as Float32Array,
      }));

    if (dimensions === '3d') {
      worker.postMessage({ meshes } as WorkerInput3D);
    } else {
      worker.postMessage({ meshes } as WorkerInput2D);
    }
  };

  const set = (partial: Partial<ShapeGeometrySlice> | ((state: ShapeGeometrySlice) => Partial<ShapeGeometrySlice>)) => {
    setRaw(partial);
    const state = get();
    calculateNewIntersection(state.meshes);
  };

  // Subscribe to dimension changes to recalculate intersection
  useDimensionsStore.subscribe(() => {
    calculateNewIntersection(get().meshes);
  });

  // Subscribe to shape visibility changes to recalculate intersection
  useShapesStore.subscribe((state, prevState) => {
    // Check if any shape's visibility has changed
    const shapeIds = new Set([...Object.keys(state.shapes), ...Object.keys(prevState.shapes)]);
    let visibilityChanged = false;

    for (const id of shapeIds) {
      if (state.shapes[id]?.visible !== prevState.shapes[id]?.visible) {
        visibilityChanged = true;
        break;
      }
    }

    if (visibilityChanged) {
      calculateNewIntersection(get().meshes);
    }
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