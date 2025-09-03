import {useCallback} from "react";
import useKeyPressed from "@/hooks/input/useKeyPressed.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

/**
 * A hook that provides a method to select and deselect an object. The first function arg is the id of the object to change selection for, and the second (optional) arg is for any child ids to set selection for
 * @param id The id of the object to track the selection of
 */
export default function useSelect() {
  const select = useShapesStore(s => s.select);
  const deselect = useShapesStore(s => s.deselect);
  const selectChild = useShapesStore(s => s.selectChild);
  const toggleSelection = useShapesStore(s => s.toggleSelection);
  const toggleChildSelection = useShapesStore(s => s.toggleChildSelection);

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