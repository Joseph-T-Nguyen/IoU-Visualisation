import { useUndoRedoStore } from './useUndoRedoStore';

/**
 * This is a wrapper hook that provides the same interface as the original useShapesStore
 * but uses the undo/redo-enabled store instead. This allows us to gradually migrate
 * components to use undo/redo functionality.
 */
export default function useShapesStoreWithUndo() {
  return useUndoRedoStore();
}

// Re-export the types for compatibility
export type { ShapesStore, ShapesSlice } from './useShapesStore';

