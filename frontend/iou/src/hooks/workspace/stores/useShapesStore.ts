import {create} from "zustand/react";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import createSelectionSlice, {type SelectionSlice} from "@/hooks/workspace/stores/createSelectionSlice.ts";
import type {StateCreator} from "zustand/vanilla";
import * as THREE from 'three';
import monkey from "@/hooks/workspace/mokey.ts";

export type Shapes = {[key: string]: ShapeData}
export interface ShapesSlice {
  shapes: Shapes;
  setVertices: (id: string, vertices: Vec3[]) => void;
  addShape: () => void;
  setShapeName: (id: string, name: string) => void;
  setShapeColor: (id: string, name: string) => void;

  deleteSelections: () => void;
  setManyVertices: (mods: [string, Vec3[]][]) => void;
  matrixMultiplySelection: (matrix: THREE.Matrix4) => void;
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

const setVerticesAux = (id: string, vertices: Vec3[]) => (state: ShapesSlice) => ({
  shapes: {
    // Replace data with the vertices
    [id]: {
      ...state.shapes[id],
      vertices: vertices
    }
  }
});

const setManyVerticesAux = (mods: [string, Vec3[]][]) => (state: ShapesSlice) => ({
  shapes: mods
    .map(([...args]) => setVerticesAux(...args))
    .reduce((previousValue, currentValue) => ({...previousValue, ...currentValue(state).shapes} as Shapes), state.shapes as Shapes)
});

function fixPartialShapesReducer<T extends unknown[]>(f: (...args: T) => ((state: ShapesStore) => Partial<ShapesStore> & {shapes: {[key: string]: ShapeData}})) {
  return (...args: T) => (state: ShapesStore) => {
    const partial=  f(...args)(state);

    return {
      ...partial,
      shapes: {
        ...state.shapes,
        ...partial.shapes
      }
    };
  }
}

function applyReducerAux<T extends unknown[], Store>(set: (partial: Partial<Store> | ((state: Store) => Partial<Store>)) => void, reducer: (...args: T) => ((state: Store) => Partial<Store>) | Partial<Store>) {
  return (...args: T) => set(reducer(...args))
}

/**
 * A zustand store to store the internal data of the workspace. Used to define other hooks. Do not use directly in your
 * react components!
 */
export const createShapeSlice: StateCreator<ShapesStore, [], [], ShapesSlice> = ((set, get) => ({
  shapes: {
    // default_shape_uuid: {
    //   vertices: monkey as Vec3[], //[[2, 0, -1], [0, 2, -1], [-2, 0, -1], [2, 2, -1], [0, 1, 1]],
    //   faces: [],
    //   name: "Default Shape",
    //   color: "#ef4444",
    // }
  },

  // TODO: Calculate shape face data using the convex hull algorithm
  setVertices: applyReducerAux(set, fixPartialShapesReducer(setVerticesAux)),

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

  setManyVertices: applyReducerAux(set, fixPartialShapesReducer(setManyVerticesAux)),

  matrixMultiplySelection: (matrix: THREE.Matrix4) => set((state) => {
    // Gets the current selections from the selection slice
    const selection = get().selections;
    const selectedKeys = Object.keys(selection);

    const multiplyVec3 = (v: Vec3) => {
      const vector3 = new THREE.Vector3(...v);
      vector3.applyMatrix4(matrix);
      return [vector3.x, vector3.y, vector3.z];
    }

    const mods = selectedKeys
      .filter(key => key in state.shapes)
      .map((key) => (
        [key, (
          state.shapes[key].vertices.map((v, i) => (
            (selection[key]!.children?.has(i) ?? true) ? multiplyVec3(v) : v )
          ) as Vec3[]
        )]
      ) as [string, Vec3[]]);

    return fixPartialShapesReducer(setManyVerticesAux)(mods)(state)
  }),
}))

const useShapesStore = create<ShapesSlice & SelectionSlice>()((...a) => ({
  ...createSelectionSlice(...a),
  ...createShapeSlice(...a),
}));

export default useShapesStore;
