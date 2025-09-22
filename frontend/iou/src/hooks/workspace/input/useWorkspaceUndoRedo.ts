import useOnKeyDown from "@/hooks/input/useOnKeyDown.ts";
import { useUndoRedo } from "@/hooks/workspace/stores/useUndoRedoStore.ts";

/**
 * Hook that provides undo/redo functionality via keyboard shortcuts
 * - Ctrl+Z (or Cmd+Z on macOS) for undo
 * - Ctrl+Y (or Cmd+Y on macOS) for redo
 */
export default function useWorkspaceUndoRedo() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const undoCallback = () => {
    if (canUndo) {
      console.log("Undo");
      undo();
    }
  };

  const redoCallback = () => {
    if (canRedo) {
      console.log("Redo");
      redo();
    }
  };

  // Handle Ctrl+Z (Windows/Linux) and Cmd+Z (macOS) for undo
  useOnKeyDown({ key: "z", ctrl: true }, undoCallback, [undo, canUndo]);
  useOnKeyDown({ key: "z", meta: true }, undoCallback, [undo, canUndo]); // macOS Cmd+Z
  
  // Handle Ctrl+Y (Windows/Linux) and Cmd+Y (macOS) for redo
  useOnKeyDown({ key: "y", ctrl: true }, redoCallback, [redo, canRedo]);
  useOnKeyDown({ key: "y", meta: true }, redoCallback, [redo, canRedo]); // macOS Cmd+Y

  return {
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

