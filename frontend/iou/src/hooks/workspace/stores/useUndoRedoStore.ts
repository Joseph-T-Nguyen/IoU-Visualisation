import { create } from 'zustand';
import { temporal } from 'zundo';
import createSelectionSlice from '@/hooks/workspace/stores/createSelectionSlice.ts';
import { createShapeSlice, type ShapesStore } from '@/hooks/workspace/stores/useShapesStore.ts';

// Global state to track drag operations
let isDragOperation = false;

// Create the temporal store with undo/redo functionality
export const useUndoRedoStore = create<ShapesStore>()(
  temporal(
    (...args) => ({
      ...createSelectionSlice(...args),
      ...createShapeSlice(...args),
    }),
    {
      // Limit history to 50 actions to prevent memory issues
      limit: 50,
      // Only save the shapes data to history
      partialize: (state) => ({
        shapes: state.shapes,
        colorQueue: state.colorQueue,
        createdShapeCount: state.createdShapeCount,
        yellowUsed: state.yellowUsed,
      }),
      // Simple equality function to group drag operations
      equality: (_a, _b) => {
        // During drag operations, don't create new history entries
        if (isDragOperation) {
          return true;
        }
        // For all other operations, use default equality (let zundo decide)
        return false;
      },
    }
  )
);

// Functions to manage drag operations
export const startDragOperation = () => {
  isDragOperation = true;
  console.log("Drag operation started - grouping vertex movements");
};

export const endDragOperation = () => {
  isDragOperation = false;
  console.log("Drag operation ended - creating single undo step");
};

// Hook to access undo/redo functionality
export const useUndoRedo = () => {
  const undo = () => {
    const currentState = useUndoRedoStore.getState();
    console.log("Before undo - shapes:", Object.keys(currentState.shapes));
    const shapeId = Object.keys(currentState.shapes)[0];
    if (shapeId) {
      console.log("Before undo - first shape vertices:", JSON.stringify(currentState.shapes[shapeId].vertices));
    }
    
    const temporal = useUndoRedoStore.temporal.getState();
    console.log("Past states:", temporal.pastStates.length);
    console.log("Future states:", temporal.futureStates.length);
    
    // Debug: Check what's in the past states
    if (temporal.pastStates.length > 0) {
      const pastState = temporal.pastStates[temporal.pastStates.length - 1];
      console.log("Last past state shapes:", Object.keys(pastState.shapes || {}));
      const pastShapeId = Object.keys(pastState.shapes || {})[0];
      if (pastShapeId && pastState.shapes) {
        console.log("Last past state vertices:", JSON.stringify(pastState.shapes[pastShapeId].vertices));
      }
    }
    
    temporal.undo();
    
    const newState = useUndoRedoStore.getState();
    console.log("After undo - shapes:", Object.keys(newState.shapes));
    if (shapeId && newState.shapes[shapeId]) {
      console.log("After undo - first shape vertices:", JSON.stringify(newState.shapes[shapeId].vertices));
    }
    
    // Clear selections when undoing
    useUndoRedoStore.getState().deselect();
  };
  
  const redo = () => {
    console.log("Before redo - shapes:", Object.keys(useUndoRedoStore.getState().shapes));
    const temporal = useUndoRedoStore.temporal.getState();
    console.log("Past states:", temporal.pastStates.length);
    console.log("Future states:", temporal.futureStates.length);
    temporal.redo();
    console.log("After redo - shapes:", Object.keys(useUndoRedoStore.getState().shapes));
    // Clear selections when redoing
    useUndoRedoStore.getState().deselect();
  };
  
  const temporal = useUndoRedoStore.temporal.getState();
  return {
    undo,
    redo,
    canUndo: temporal.pastStates.length > 0,
    canRedo: temporal.futureStates.length > 0,
  };
};

export default useUndoRedoStore;
