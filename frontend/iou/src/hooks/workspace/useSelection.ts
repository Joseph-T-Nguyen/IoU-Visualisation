import type {WorkspaceObjectSelection} from "@/hooks/workspace/stores/createSelectionSlice.ts";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";

/**
 * A hook that provides the selection state for some object
 * @param id The id of the object to track the selection of
 */
export default function useSelection(id: string): WorkspaceObjectSelection | undefined {
  return useShapesStore(state => state.selections[id]);
}