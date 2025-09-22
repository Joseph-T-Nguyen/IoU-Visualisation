import { useUndoRedo } from "@/hooks/workspace/stores/useUndoRedoStore.ts";

/**
 * Test hook to verify undo/redo functionality is working
 * This can be used for debugging and testing purposes
 */
export default function useWorkspaceUndoRedoTest() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const testUndoRedo = () => {
    console.log("Undo/Redo Test:");
    console.log("Can Undo:", canUndo);
    console.log("Can Redo:", canRedo);
    
    if (canUndo) {
      console.log("Testing undo...");
      undo();
    } else {
      console.log("No actions to undo");
    }
    
    if (canRedo) {
      console.log("Testing redo...");
      redo();
    } else {
      console.log("No actions to redo");
    }
  };

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    testUndoRedo,
  };
}

