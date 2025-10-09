import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import type { Vec3 } from "@/hooks/workspace/workspaceTypes.ts";
import { useState, useEffect } from "react";

export default function VertexInfo() {
  const [dimensions] = useDimensions();
  const selections = useShapesStore((s) => s.selections);
  const shapes = useShapesStore((s) => s.shapes);
  const setVertices = useShapesStore((s) => s.setVertices);
  const deleteSelections = useShapesStore((s) => s.deleteSelections);

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

  const vertex = selectedVertexInfo?.vertex ?? [0, 0, 0];
  const [x, y, z] = vertex;

  // Local state for input values
  const [inputX, setInputX] = useState(x.toFixed(1));
  const [inputY, setInputY] = useState(y.toFixed(1));
  const [inputZ, setInputZ] = useState(z.toFixed(1));

  // Update local state when vertex changes (e.g., different vertex selected)
  useEffect(() => {
    setInputX(x.toFixed(1));
    setInputY(y.toFixed(1));
    setInputZ(z.toFixed(1));
  }, [x, y, z]);

  // Only show if exactly one vertex is selected
  if (!selectedVertexInfo) {
    return null;
  }

  const { shapeKey, vertexIndex } = selectedVertexInfo;

  const commitValue = (field: "x" | "y" | "z", value: string, original: number) => {
    const numValue = parseFloat(value);

    // If invalid or empty, revert to original
    if (isNaN(numValue)) {
      if (field === "x") setInputX(original.toFixed(1));
      if (field === "y") setInputY(original.toFixed(1));
      if (field === "z") setInputZ(original.toFixed(1));
      return;
    }

    // Update the actual vertex
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "x" | "y" | "z",
    original: number
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      commitValue(field, e.currentTarget.value, original);
    }
  };

  const handleInputChange = (value: string, setter: (value: string) => void) => {
    // Allow empty string, numbers, decimal point, and minus sign
    if (value === "" || value === "-" || value === "." || value === "-." || /^-?\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const duplicateVertex = () => {
    const currentVertices = shapes[shapeKey].vertices;
    const updatedVertices = [...currentVertices];

    // Create a duplicate vertex with a small offset to make it visible
    const [currentX, currentY, currentZ] = vertex;
    const offset = 0.1;
    const duplicatedVertex: Vec3 = [
      currentX + offset,
      currentY + offset,
      dimensions === "3d" ? currentZ + offset : currentZ,
    ];

    // Insert the duplicated vertex right after the current vertex
    updatedVertices.splice(vertexIndex + 1, 0, duplicatedVertex);
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
            type="text"
            value={inputX}
            onChange={(e) => handleInputChange(e.target.value, setInputX)}
            onBlur={(e) => commitValue("x", e.target.value, x)}
            onKeyDown={(e) => handleKeyDown(e, "x", x)}
            className="h-8 text-sm flex-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="vertex-y" className="text-sm font-medium w-4">
            Y
          </label>
          <Input
            id="vertex-y"
            type="text"
            value={inputY}
            onChange={(e) => handleInputChange(e.target.value, setInputY)}
            onBlur={(e) => commitValue("y", e.target.value, y)}
            onKeyDown={(e) => handleKeyDown(e, "y", y)}
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
              type="text"
              value={inputZ}
              onChange={(e) => handleInputChange(e.target.value, setInputZ)}
              onBlur={(e) => commitValue("z", e.target.value, z)}
              onKeyDown={(e) => handleKeyDown(e, "z", z)}
              className="h-8 text-sm flex-1"
            />
          </div>
        )}
        <div className="pt-2 flex gap-2">
          <Button
            onClick={duplicateVertex}
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-sm"
          >
            Duplicate
          </Button>
          <Button
            onClick={deleteSelections}
            variant="destructive"
            size="sm"
            className="flex-1 h-8 text-sm"
            disabled={shapes[shapeKey].vertices.length <= 3}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
