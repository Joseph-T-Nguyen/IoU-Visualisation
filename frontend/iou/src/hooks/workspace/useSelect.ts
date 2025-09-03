import {useCallback} from "react";
import useSelectionStore from "@/hooks/workspace/stores/useSelectionStore.ts";
import useKeyPressed from "@/hooks/input/useKeyPressed.ts";


/**
 * A hook that provides a method to select and deselect an object. The first function arg is the id of the object to change selection for, and the second (optional) arg is for any child ids to set selection for
 * @param id The id of the object to track the selection of
 */
export default function useSelect() {
  const select = useSelectionStore(s => s.select);
  const deselect = useSelectionStore(s => s.deselect);
  const selectChild = useSelectionStore(s => s.selectChild);
  const toggleSelection = useSelectionStore(s => s.toggleSelection);
  const toggleChildSelection = useSelectionStore(s => s.toggleChildSelection);

  const toggleMode = useKeyPressed("Shift");

  /**
   * Toggles or replaces selection for a given id and children when called.
   */
  return useCallback((id?: string, children?: number[]) => {
    console.log("select(", id, children, "), toggleMode: ", toggleMode,)
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