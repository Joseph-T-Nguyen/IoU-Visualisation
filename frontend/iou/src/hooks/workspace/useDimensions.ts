import {useShallow} from "zustand/react/shallow";
import type {Dimensions} from "@/hooks/workspace/workspaceTypes.ts";
import {useDimensionsStore, type DimensionsMutator} from "@/hooks/workspace/stores/useDimensionsStore.ts";

export default function useDimensions(): [Dimensions, DimensionsMutator] {
  return useDimensionsStore(
    useShallow((state) => [state.dimensions, state.setDimensions]),
  ) as [Dimensions, DimensionsMutator];
}