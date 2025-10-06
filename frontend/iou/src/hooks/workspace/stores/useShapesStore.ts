import {create} from "zustand/react";
import type {ShapeData, Vec3} from "@/hooks/workspace/workspaceTypes.ts";
import createSelectionSlice, {type SelectionSlice} from "@/hooks/workspace/stores/createSelectionSlice.ts";
import type {StateCreator} from "zustand/vanilla";
import * as THREE from 'three';
import * as UUID from "uuid";
import { temporal } from 'zundo';

export type Shapes = {[key: string]: ShapeData}
export interface ShapesSlice {
  shapes: Shapes;
  setAllShapes: (shapes: Shapes) => void;
  colorQueue: string[];
  createdShapeCount: number;

  setVertices: (id: string, vertices: Vec3[]) => void;
  addShape: () => void;
  duplicateShape: (id: string) => void;
  centerShape: (id: string) => void;
  createCustomShape: (vertexData: Vec3[]) => void;
  toggleShapeVisibility: (id: string) => void;
  toggleShapeColor: (id: string) => void;
  setShapeName: (id: string, name: string) => void;
  setShapeColor: (id: string, name: string) => void;

  toggleSelectionVisibility: () => void;
  unhideAllShapes: () => void;
  deleteSelections: () => void;
  setManyVertices: (mods: [string, Vec3[]][]) => void;
  matrixMultiplySelection: (matrix: THREE.Matrix4) => void;
}

// We assemble the store from multiple slices! See: https://zustand.docs.pmnd.rs/guides/typescript#slices-pattern
export type ShapesStore = SelectionSlice & ShapesSlice;

export const defaultColors = [
  "#ef4444",
  "#10b981",
  "#0ea5e9",
  "#db2777",
  "#84cc16",
  "#14b8a6",
  "#ea580c",
  "#9333ea",
  "#16a34a",
  "#4f46e5",
];
export const intersectionColor = "#f59e0b";

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

// So I can randomize colours
function shuffleArray(arr: string[]) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function getRandomDefaultColors() {
  // Keep these colors the same every time:
  const start = defaultColors.slice(0, 3);

  // Vary everything else
  const shuffled = shuffleArray(defaultColors.slice(3));
  return [...start, ...shuffled];
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

  setAllShapes: (shapes: Shapes) => set(() => ({
    shapes,
  })),

  // We use this to determine what the next shape's colour should be, and what the colour of the intersection should be
  colorQueue: getRandomDefaultColors(),
  // Used to figure out what number to give the shape in the shape name
  createdShapeCount: 0,

  // TODO: Calculate shape face data using the convex hull algorithm
  setVertices: applyReducerAux(set, fixPartialShapesReducer(setVerticesAux)),

  addShape: () => set((state: ShapesSlice) => {
    return ({
      shapes: {
        ...state.shapes,
        [UUID.v4().toString()]: {
          name: `Shape ${state.createdShapeCount + 1}`,
          color: state.colorQueue[0],
          vertices: [
            [0, 0, 0], [0, 1, 0], [1, 0, 0], [1, 1, 0],
            [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]
          ],
          faces: [],
          visible: true, // Set default visibility
        }
      },

      // Pop this color in the color queue
      colorQueue: state.colorQueue.length > 1 ? [...state.colorQueue.slice(1)] : shuffleArray(defaultColors),
      createdShapeCount: state.createdShapeCount + 1,
    });
  }),

  duplicateShape: (id: string) => set((state: ShapesSlice) => {
    const originalShape = state.shapes[id];
    if (!originalShape) return {};

    return ({
      shapes: {
        ...state.shapes,
        [UUID.v4().toString()]: {
          ...originalShape,
          name: `${originalShape.name} Copy`,
          color: state.colorQueue[0],
          // Create a copy of vertices with slight offset to make it visible
          vertices: originalShape.vertices.map(([x, y, z]) => [x + 0.5, y + 0.5, z + 0.5] as Vec3),
        }
      },

      // Pop this color in the color queue
      colorQueue: state.colorQueue.length > 1 ? [...state.colorQueue.slice(1)] : shuffleArray(defaultColors),
      createdShapeCount: state.createdShapeCount + 1,
    });
  }),

  centerShape: (id: string) => set((state: ShapesSlice) => {
    const shape = state.shapes[id];
    if (!shape) return {};

    // Calculate the centroid (center point) of the shape
    const vertices = shape.vertices;
    const centroid: Vec3 = vertices.reduce(
      (sum, vertex) => [sum[0] + vertex[0], sum[1] + vertex[1], sum[2] + vertex[2]],
      [0, 0, 0] as Vec3
    ).map(coord => coord / vertices.length) as Vec3;

    // Translate all vertices so the centroid becomes the origin
    const centeredVertices: Vec3[] = vertices.map(([x, y, z]) => [
      x - centroid[0],
      y - centroid[1],
      z - centroid[2]
    ]);

    return {
      shapes: {
        ...state.shapes,
        [id]: {
          ...shape,
          vertices: centeredVertices
        }
      }
    };
  }),

  createCustomShape: (vertexData: Vec3[]) => set((state) => ({
    shapes: {
      ...state.shapes,
      [UUID.v4().toString()]: {
        name: `Custom Shape ${state.createdShapeCount + 1}`,
        color: state.colorQueue[0],
        vertices: vertexData,
        faces: [],
        visible: true,
      },
    },

    // Pop this color in the color queue
    colorQueue: state.colorQueue.length > 1 ? [...state.colorQueue.slice(1)] : shuffleArray(defaultColors),
    createdShapeCount: state.createdShapeCount + 1,
  })),

  toggleShapeVisibility: (id: string) => set((state) => {
    const shape = state.shapes[id];
    if (shape === undefined)
      return {};

    return {
      shapes: {
        ...state.shapes,
        [id]: {
          ...shape,
          visible: !shape.visible,
        }
      },
    }
  }),

  toggleShapeColor: (id: string) => set((state) => {
    const shape = state.shapes[id];
    if (shape === undefined)
      return {};

    return {
      colorQueue: [...state.colorQueue.slice(1), shape.color],
      shapes: {
        ...state.shapes,
        [id]: {
          ...shape,
          color: state.colorQueue[0]
        }
      },
    }
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

    // Check for vertex deletion safety before processing
    let blockedDeletion = false;
    for (const key in selection) {
      if (selection[key].children !== undefined && state.shapes[key] !== undefined) {
        const currentVertices = state.shapes[key].vertices;
        const verticiesToDelete = Array.from(selection[key].children!);
        const remainingVertices = currentVertices.length - verticiesToDelete.length;

        // If deletion would result in fewer than 3 vertices, block it
        if (remainingVertices < 3 && remainingVertices > 0) {
          blockedDeletion = true;
          break;
        }
      }
    }

    // Show alert if deletion is blocked
    if (blockedDeletion) {
      alert("Cannot delete vertex: A shape must have at least 3 vertices to remain valid.");
      return {}; // Return empty state change to prevent deletion
    }

    const deletedColors: string[] = [];

    // Filter out shapes based on elements in selection
    for (const key in selection) {
      // If no specific children (vertices) are defined in the selection, delete the whole shape
      if (selection[key].children === undefined) {
        // Put the shape's color back into the colorQueue
        if (state.shapes[key])
          deletedColors.push(state.shapes[key].color);
        // Delete the shape
        delete newShapes[key];
      }
      else if (state.shapes[key] !== undefined) {
        // Otherwise filter out specified children (vertices)
        const newVertices = state.shapes[key].vertices.filter((_, i) => !selection[key]?.children?.has(i));

        if (newVertices.length === 0) {
          // Put the shape's color back into the colorQueue
          if (state.shapes[key])
            deletedColors.push(state.shapes[key].color);
          // Delete the shape
          delete newShapes[key];
        }
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
      colorQueue: [...deletedColors, ...state.colorQueue]
    }
  }),

  toggleSelectionVisibility: () => set((state: ShapesSlice) => {
    // Gets the current selections from the selection slice
    const selection = get().selections;

    const newShapes = Object.keys(selection)
      .filter((selection) => selection in state.shapes)
      .reduce((acc, selection) => {
        return {
          ...acc,
          [selection]: {
            ...acc[selection],
            visible: !acc[selection].visible
          }
        } as Shapes;
      }, state.shapes);

    return {
      selections: {},
      shapes: newShapes
    }
  }),

  unhideAllShapes: () => set((state) => {
    const newShapes = Object.keys(state.shapes)
      .reduce((acc, selection) => {
        return {
          ...acc,
          [selection]: {
            ...acc[selection],
            visible: true
          }
        } as Shapes;
      }, state.shapes);

    return {
      shapes: newShapes
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

const useShapesStore = create<ShapesSlice & SelectionSlice>()(
  temporal(
    (...a) => ({
      ...createSelectionSlice(...a),
      ...createShapeSlice(...a),
    })
  )
);

export default useShapesStore;
