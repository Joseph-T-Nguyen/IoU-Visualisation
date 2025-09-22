import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import type { Vec3 } from "@/hooks/workspace/workspaceTypes.ts";

export default function VertexInfo() {
  const [dimensions] = useDimensions();
  const selections = useShapesStore((s) => s.selections);
  const shapes = useShapesStore((s) => s.shapes);
  const setVertices = useShapesStore((s) => s.setVertices);

  const selectionKeys = Object.keys(selections);

  // Get selected vertex info (shape key, vertex index, and vertex data)
  let selectedVertexInfo: {
    shapeKey: string;
    vertexIndex: number;
    vertex: Vec3;
  } | null = null;

  for (const key of selectionKeys) {
    const vertices = shapes[key]?.vertices ?? [];
    const children = selections[key]?.children;

    if (children) {
      const selectedIndices = Array.from(children);
      if (selectedIndices.length === 1) {
        const vertexIndex = selectedIndices[0];
        selectedVertexInfo = {
          shapeKey: key,
          vertexIndex,
          vertex: vertices[vertexIndex],
        };
        break;
      }
    }
  }

  // Only show if exactly one vertex is selected
  if (!selectedVertexInfo) {
    return null;
  }

  const { shapeKey, vertexIndex, vertex } = selectedVertexInfo;
  const [x, y, z] = vertex;

  const updateVertex = (field: "x" | "y" | "z", value: string) => {
    const numValue = parseFloat(value) || 0;
    const currentVertices = shapes[shapeKey].vertices;
    const updatedVertices = [...currentVertices];
    const [currentX, currentY, currentZ] = updatedVertices[vertexIndex];

    updatedVertices[vertexIndex] = [
      field === "x" ? numValue : currentX,
      field === "y" ? numValue : currentY,
      field === "z" ? numValue : currentZ,
    ];
    setVertices(shapeKey, updatedVertices);
  };

  return (
    <Card className="w-full max-w-sm pointer-events-auto py-3 gap-1.5 px-0 shadow-lg">
      <CardHeader className="px-3">
        <CardTitle>Vertex</CardTitle>
      </CardHeader>
      <CardContent className="px-3 mt-1.5 space-y-3">
        <div className="flex items-center gap-3">
          <label htmlFor="vertex-x" className="text-sm font-medium w-4">
            X
          </label>
          <Input
            id="vertex-x"
            type="number"
            step="0.1"
            value={x.toFixed(1)}
            onChange={(e) => updateVertex("x", e.target.value)}
            className="h-8 text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="vertex-y" className="text-sm font-medium w-4">
            Y
          </label>
          <Input
            id="vertex-y"
            type="number"
            step="0.1"
            value={y.toFixed(1)}
            onChange={(e) => updateVertex("y", e.target.value)}
            className="h-8 text-sm flex-1"
          />
        </div>
        {dimensions === "3d" && (
          <div className="flex items-center gap-3">
            <label htmlFor="vertex-z" className="text-sm font-medium w-4">
              Z
            </label>
            <Input
              id="vertex-z"
              type="number"
              step="0.1"
              value={z.toFixed(1)}
              onChange={(e) => updateVertex("z", e.target.value)}
              className="h-8 text-sm flex-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
