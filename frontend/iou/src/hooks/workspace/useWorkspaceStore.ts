import {create} from "zustand/react";
import type {WorkspaceState} from "@/hooks/workspace/workspaceTypes.ts";

/**
 * A zustand store to store the internal data of the workspace. Used to define other hooks. Do not use directly in your
 * react components!
 */
export const useWorkspaceStore = create<WorkspaceState>((set) => {
  const worker = new Worker(new URL("./facesWorker.ts", import.meta.url));

  let jobCounter = 0;
  const pendingJobs = new Map<number, string>(); // jobId -> shapeId

  // Listen to worker messages
  worker.onmessage = (e: MessageEvent) => {
    const { id, faces } = e.data as { id: string; faces: number[][] };

    // find jobId for this shape
    const jobId = Array.from(pendingJobs.entries()).find(([_, shapeId]) => shapeId === id)?.[0];
    if (jobId == null) return; // no pending job (probably stale)

    // Remove job from pending
    pendingJobs.delete(jobId);

    // Update shape if still exists
    set((state) => {
      const next = new Map(state.shapes);
      const shape = next.get(id);
      if (!shape || shape.currentJobId !== jobId) return state; // stale
      next.set(id, { ...shape, faces, isPending: false, currentJobId: undefined });
      return { shapes: next };
    });
  };

  return {
    // Metadata
    name: "Workspace",

    // Shape data
    shapes: new Map(),

    setVertices: (id, vertices) => {
      set((state) => {
        const next = new Map(state.shapes);
        const oldShape = next.get(id) ?? { vertices: [], faces: [], isPending: false };
        const jobId = ++jobCounter;

        // mark as pending
        next.set(id, { ...oldShape, vertices, isPending: true, currentJobId: jobId });
        pendingJobs.set(jobId, id);

        // send async job to worker
        worker.postMessage({ id, vertices });

        return { shapes: next };
      });
    },
  };
});