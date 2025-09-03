import type {Dimensions} from "@/hooks/workspace/workspaceTypes.ts";
import {create} from "zustand/react";

export type DimensionsMutator = (dimensions: Dimensions) => void;

export interface DimensionsStore {
  setDimensions: DimensionsMutator;
  dimensions: Dimensions;
}

export const useDimensionsStore = create<DimensionsStore>((set) => ({
  dimensions: "3d",
  setDimensions: (dimensions: Dimensions) => {
    set({ dimensions: dimensions });
  },
}))
