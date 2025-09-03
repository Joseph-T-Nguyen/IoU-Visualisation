import useSelectionStore, {type WorkspaceSelection} from "@/hooks/workspace/stores/useSelectionStore.ts";

/**
 * A hook that helps provides information about the selection state for some object
 * @param id The id of the object to track the selection of
 */
export default function useSelection(id: string) {
  const selection: WorkspaceSelection | undefined = useSelectionStore(state => state.selections[id]);
  return selection;
}