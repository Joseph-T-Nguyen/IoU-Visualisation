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

  const selectionKeys = Object.keys(selections);

  // Get all selected vertices
  const selectedVertexSets = selectionKeys.map((key) => {
    const vertices = shapes[key]?.vertices ?? [];
    const children = selections[key]?.children;

    if (!children) return vertices;
    return vertices.filter((_, i) => children.has(i));
  });

  const selectedVertices = selectedVertexSets.flat();

  // Only show if exactly one vertex is selected
  if (selectedVertices.length !== 1) {
    return null;
  }

  const vertex = selectedVertices[0] as Vec3;
  const [x, y, z] = vertex;

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
            value={x.toFixed(1)}
            readOnly
            className="h-8 text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="vertex-y" className="text-sm font-medium w-4">
            Y
          </label>
          <Input
            id="vertex-y"
            value={y.toFixed(1)}
            readOnly
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
              value={z.toFixed(1)}
              readOnly
              className="h-8 text-sm flex-1"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
