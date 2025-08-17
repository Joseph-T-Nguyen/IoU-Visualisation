import {useWorkspaceStore} from "@/hooks/workspace/useWorkspaceStore.ts";
import {useShallow} from "zustand/react/shallow";

export default function useDimensions() {
  return useWorkspaceStore(
    useShallow((state) => [state.dimensions, state.setDimensions]),
  )
}