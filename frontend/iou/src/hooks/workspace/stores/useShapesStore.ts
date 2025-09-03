import {create} from "zustand/react";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";

export interface ShapesStore {
  shapes: {[key: string]: ShapeData};

  setVertices: (id: string, vertices: Vec3[]) => void;
  addShape: () => void;
  setShapeName: (id: string, name: string) => void;
  setShapeColor: (id: string, name: string) => void;
}

const defaultColors = [
  "#ef4444",
  "#10b981",
  "#0ea5e9",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
  "#eab308",
  "#f43f5e",
  "#f97316",
  "#84cc16",
  "#a855f7",
  "#22c55e",
];

/**
 * A zustand store to store the internal data of the workspace. Used to define other hooks. Do not use directly in your
 * react components!
 */
export const useShapesStore = create<ShapesStore>((set) => ({
  shapes: {},

  // TODO: Calculate shape face data using the convex hull algorithm
  setVertices: (id: string, vertices: Vec3[]) => set((state: ShapesStore) => ({
    shapes: {
      ...state.shapes,
      // Replace data with the vertices
      [id]: {
        ...state.shapes[id],
        vertices: vertices
      }
    }
  })),

  addShape: () => set((state: ShapesStore) => {
    const count = Object.keys(state.shapes).length;

    return ({
      shapes: {
        ...state.shapes,
        [crypto.randomUUID().toString()]: {
          name: `Shape ${count + 1}`,
          color: defaultColors[count % defaultColors.length],
          vertices: [
            [0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0],
            [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]
          ],
          // TODO: Face generation from convex hull algorithm
          faces: [],
        }
      }
    });
  }),

  setShapeName: (id: string, name: string) => set((state: ShapesStore) => ({
    shapes: {
      ...state.shapes,
      [id]: {
        ...state.shapes[id],
        name: name
      }
    }
  })),

  setShapeColor: (id: string, color: string) => set((state: ShapesStore) => ({
    shapes: {
      ...state.shapes,
      [id]: {
        ...state.shapes[id],
         color: color
      }
    }
  })),
}))

// export const useShapesStore = create<ShapesStore>((set) => {
//   const worker = new Worker(new URL("./facesWorker.ts", import.meta.url));
//
//   let jobCounter = 0;
//   const pendingJobs = new Map<number, string>(); // jobId -> shapeId
//
//   // Listen to worker messages
//   worker.onmessage = (e: MessageEvent) => {
//     const { id, faces } = e.data as { id: string; faces: number[][] };
//
//     // find jobId for this shape
//     const jobId = Array.from(pendingJobs.entries()).find(([_, shapeId]) => shapeId === id)?.[0];
//     if (jobId == null) return; // no pending job (probably stale)
//
//     // Remove job from pending
//     pendingJobs.delete(jobId);
//
//     // Update shape if still exists
//     set((state) => {
//       const next = new Map(state.shapes);
//       const shape = next.get(id);
//       if (!shape || shape.currentJobId !== jobId) return state; // stale
//       next.set(id, { ...shape, faces, isPending: false, currentJobId: undefined });
//       return { shapes: next };
//     });
//   };
//
//   return {
//     // Shape data
//     shapes: new Map(),
//
//     setVertices: (id, vertices) => set((state) => {
//       const next = new Map(state.shapes);
//       const oldShape = next.get(id) ?? { vertices: [], faces: [], isPending: false };
//       const jobId = ++jobCounter;
//
//       // mark as pending
//       next.set(id, { ...oldShape, vertices, isPending: true, currentJobId: jobId });
//       pendingJobs.set(jobId, id);
//
//       // send async job to worker
//       worker.postMessage({ id, vertices });
//
//       return { shapes: next };
//     }),
//   };
// });
