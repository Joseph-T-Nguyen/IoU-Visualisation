
export type Dimensions = "2d" | "3d";

export type Vec3 = [number, number, number];
export type Vec2 = [number, number, 0];

// The return type for useWorkspace
export interface WorkspaceMetadata {
  name: string;
  dimensions: Dimensions;
}

// The data type held for each shape in the workspace store
export interface Shape {
  vertices: number[][];
  faces: number[][];

  // Extra data for managing workers calculating faces using the convex hull algorithm
  isPending: boolean;
  currentJobId?: number;
}

// The return type for useWorkspaceStore
export interface WorkspaceState extends WorkspaceMetadata {
  setDimensions: (dimensions: Dimensions) => void;

  shapes: Map<string, Shape>;
  setVertices: (id: string, vertices: number[][]) => void;
}


