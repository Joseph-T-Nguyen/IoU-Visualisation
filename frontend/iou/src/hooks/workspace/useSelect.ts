import {useCallback} from "react";
import useKeyPressed from "@/hooks/input/useKeyPressed.ts";
import { useUndoRedoStore } from "@/hooks/workspace/stores/useUndoRedoStore.ts";

/**
 * A hook that provides a method to select and deselect an object. The first function arg is the id of the object to change selection for, and the second (optional) arg is for any child ids to set selection for
 * @param id The id of the object to track the selection of
 */
export default function useSelect() {
  const select = useUndoRedoStore(s => s.select);
  const deselect = useUndoRedoStore(s => s.deselect);
  const selectChild = useUndoRedoStore(s => s.selectChild);
  const toggleSelection = useUndoRedoStore(s => s.toggleSelection);
  const toggleChildSelection = useUndoRedoStore(s => s.toggleChildSelection);

  const toggleMode = useKeyPressed("Shift");

  /**
   * Toggles or replaces selection for a given id and children when called.
   */
  return useCallback((id?: string, children?: number[]) => {
    if (id === undefined) {
      deselect();
      return;
    }

    if (children) {
      if (toggleMode)
        toggleChildSelection(id, children);
      else
        selectChild(id, children);
    }
    else {
      if (toggleMode)
        toggleSelection(id);
      else
        select(id);
    }
  }, [select, deselect, selectChild, toggleSelection, toggleChildSelection, toggleMode])
}