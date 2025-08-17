import {useWorkspaceStore} from "@/hooks/workspace/useWorkspaceStore.ts";
import {useShallow} from "zustand/react/shallow";
import type {WorkspaceMetadata} from "@/hooks/workspace/workspaceTypes.ts";

/**
 * Hook to get metadata about a workspace
 */
function useWorkspace() {
  const store: WorkspaceMetadata = useWorkspaceStore(useShallow((state) => ({
    name: state.name,
    dimensions: state.dimensions,
  })));

  return store;
}

export default useWorkspace;