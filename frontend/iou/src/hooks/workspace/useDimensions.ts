import {useWorkspaceStore} from "@/hooks/workspace/useWorkspaceStore.ts";
import {useShallow} from "zustand/react/shallow";
import type {Dimensions} from "@/hooks/workspace/workspaceTypes.ts";

export default function useDimensions(): [Dimensions, (dimensions: Dimensions | ((dimensions: Dimensions) => Dimensions)) => void] {
  return useWorkspaceStore(
    useShallow((state) => [state.dimensions, state.setDimensions]),
  ) as [Dimensions, (dimensions: Dimensions | ((dimensions: Dimensions) => Dimensions)) => void]
}