
export type Dimensions = "2d" | "3d";

export type Vec3 = [number, number, number];
export type Vec2 = [number, number, 0];

// The return type for useWorkspace
export interface WorkspaceMetadata {
  name: string;
}

// The data type held for each shape in the workspace store
export interface ShapeData {
  vertices: Vec3[],
  faces: [number, number, number][],

  name: string,
  color: string,
  visible: boolean,

  // Extra data for managing workers calculating faces using the convex hull algorithm
  // isPending: boolean;
  // currentJobId?: number;
}