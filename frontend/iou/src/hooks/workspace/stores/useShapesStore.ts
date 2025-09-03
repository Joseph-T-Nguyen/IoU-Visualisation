import {create} from "zustand/react";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import createSelectionSlice, {type SelectionSlice} from "@/hooks/workspace/stores/createSelectionSlice.ts";
import type {StateCreator} from "zustand/vanilla";

export interface ShapesSlice {
  shapes: {[key: string]: ShapeData};
  setVertices: (id: string, vertices: Vec3[]) => void;
  addShape: () => void;
  setShapeName: (id: string, name: string) => void;
  setShapeColor: (id: string, name: string) => void;

  deleteSelections: () => void;
}

// We assemble the store from multiple slices! See: https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern
export type ShapesStore = SelectionSlice & ShapesSlice;

const defaultColors = [
  "#ef4444",
  "#10b981",
  "#0ea5e9",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
  "#eab308",
  "#f43f5e",
  "#f97316",
  "#84cc16",
  "#a855f7",
  "#22c55e",
];

/**
 * A zustand store to store the internal data of the workspace. Used to define other hooks. Do not use directly in your
 * react components!
 */
export const createShapeSlice: StateCreator<ShapesStore, [], [], ShapesSlice> = ((set, get) => ({
  shapes: {
    default_shape_uuid: {
      vertices: [[2, 0, 0], [0, 2, 0], [-2, 0, 0], [2, 2, 0], [0, 1, 2]],
      faces: [],
      name: "Default Shape",
      color: "#ef4444",
    }
  },

  // TODO: Calculate shape face data using the convex hull algorithm
  setVertices: (id: string, vertices: Vec3[]) => set((state: ShapesSlice) => ({
    shapes: {
      ...state.shapes,
      // Replace data with the vertices
      [id]: {
        ...state.shapes[id],
        vertices: vertices
      }
    }
  })),

  addShape: () => set((state: ShapesSlice) => {
    const count = Object.keys(state.shapes).length;

    return ({
      shapes: {
        ...state.shapes,
        [crypto.randomUUID().toString()]: {
          name: `Shape ${count + 1}`,
          color: defaultColors[count % defaultColors.length],
          vertices: [
            [0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0],
            [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]
          ],
          // TODO: Face generation from convex hull algorithm
          faces: [],
        }
      }
    });
  }),

  setShapeName: (id: string, name: string) => set((state: ShapesSlice) => ({
    shapes: {
      ...state.shapes,
      [id]: {
        ...state.shapes[id],
        name: name
      }
    }
  })),

  setShapeColor: (id: string, color: string) => set((state: ShapesSlice) => ({
    shapes: {
      ...state.shapes,
      [id]: {
        ...state.shapes[id],
        color: color
      }
    }
  })),

  deleteSelections: () => set((state: ShapesSlice) => {
    const newShapes = {...state.shapes};

    // Gets the current selections from the selection slice
    const selection = get().selections;

    // Filter out shapes based on elements in selection
    for (const key in selection) {
      // If no specific children (vertices) are defined in the selection, delete the whole shape
      if (selection[key].children === undefined)
        delete newShapes[key]
      else if (state.shapes[key] !== undefined) {
        // Otherwise filter out specified children (vertices)
        const newVertices = state.shapes[key].vertices.filter((_, i) => !selection[key]?.children?.has(i));

        if (newVertices.length === 0)
          delete newShapes[key];
        else {
          newShapes[key] = {
            ...state.shapes[key],
            vertices: newVertices
          }
        }
      }
    }

    return {
      selections: {},
      shapes: newShapes,
    }
  }),
}))

const useShapesStore = create<ShapesSlice & SelectionSlice>()((...a) => ({
  ...createSelectionSlice(...a),
  ...createShapeSlice(...a),
}));

export default useShapesStore;
