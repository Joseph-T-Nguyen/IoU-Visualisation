import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Plus, Minus, Shapes } from "lucide-react";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import type { Vec3 } from "@/hooks/workspace/workspaceTypes.ts";
import * as UUID from "uuid";

interface VertexInput {
  id: string;
  x: string;
  y: string;
  z: string;
}

export default function CreateCustomShapeDialog() {
  const [dimensions] = useDimensions();
  const [open, setOpen] = useState(false);

  // Always get default cube vertices (3D shape)
  const getDefaultVertices = (): VertexInput[] => {
    // Default cube vertices - always in 3D
    return [
      { id: UUID.v4(), x: "0", y: "0", z: "0" },
      { id: UUID.v4(), x: "0", y: "1", z: "0" },
      { id: UUID.v4(), x: "1", y: "0", z: "0" },
      { id: UUID.v4(), x: "1", y: "1", z: "0" },
      { id: UUID.v4(), x: "0", y: "0", z: "1" },
      { id: UUID.v4(), x: "0", y: "1", z: "1" },
      { id: UUID.v4(), x: "1", y: "0", z: "1" },
      { id: UUID.v4(), x: "1", y: "1", z: "1" },
    ];
  };

  const [vertices, setVertices] = useState<VertexInput[]>(getDefaultVertices());
  const [shapeName, setShapeName] = useState("");

  const shapes = useShapesStore((s) => s.shapes);

  const addVertex = () => {
    setVertices([...vertices, { id: UUID.v4(), x: "0", y: "0", z: "0" }]);
  };

  const removeVertex = (id: string) => {
    const minVertices = 4; // Always minimum 4 vertices for 3D shapes (tetrahedron)
    if (vertices.length > minVertices) {
      setVertices(vertices.filter((v) => v.id !== id));
    }
  };

  const updateVertex = (id: string, field: "x" | "y" | "z", value: string) => {
    setVertices(
      vertices.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  // Volume validation for 3D shapes
  const hasVolume = (vertices: Vec3[]): boolean => {
    if (vertices.length < 4) return false;

    // Simple check: if we have vertices with different Z values, we have volume
    const zValues = vertices.map((v) => v[2]);
    const uniqueZ = new Set(zValues);

    // If we have at least 2 different Z values, we likely have volume
    if (uniqueZ.size >= 2) {
      return true;
    }

    // If all Z values are the same, check if it's a 2D shape (all Z = 0)
    return false;
  };

  const createShape = () => {
    // Convert input vertices to Vec3 format (always 3D)
    const vertexData: Vec3[] = vertices.map((v) => [
      parseFloat(v.x) || 0,
      parseFloat(v.y) || 0,
      parseFloat(v.z) || 0,
    ]);

    // Validate volume for 3D shapes
    if (!hasVolume(vertexData)) {
      return; // Don't create shape if it has no volume
    }

    // Create new shape UUID
    const newShapeId = UUID.v4().toString();
    const count = Object.keys(shapes).length;

    // Add shape to store (using the same pattern as addShape)
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

    // Manually add the shape since we need custom vertices
    useShapesStore.setState((state) => ({
      ...state,
      shapes: {
        ...state.shapes,
        [newShapeId]: {
          name: shapeName || `Custom Shape ${count + 1}`,
          color: defaultColors[count % defaultColors.length],
          vertices: vertexData,
          faces: [],
        },
      },
    }));

    // Reset form and close dialog
    setVertices(getDefaultVertices());
    setShapeName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer pointer-events-auto"
        >
          <Shapes className="w-4 h-4 mr-2" />
          Custom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Custom Shape</DialogTitle>
          <DialogDescription>
            Add vertices to create your custom 3D shape. Minimum 4 vertices
            required for 3D shapes with volume.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Shape name input */}
          <div className="space-y-2">
            <label htmlFor="shape-name" className="text-sm font-medium">
              Shape Name (optional)
            </label>
            <Input
              id="shape-name"
              value={shapeName}
              onChange={(e) => setShapeName(e.target.value)}
              placeholder="Enter shape name"
              className="h-8"
            />
          </div>

          {/* Vertices section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Vertices</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVertex}
                className="h-7 px-2"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {vertices.map((vertex, index) => (
                <div
                  key={vertex.id}
                  className="flex items-center gap-2 p-2 border rounded-md"
                >
                  <span className="text-xs font-medium w-6 text-center text-muted-foreground">
                    {index + 1}
                  </span>

                  <div className="flex items-center gap-1 flex-1">
                    <div className="flex items-center gap-1">
                      <label className="text-xs font-medium w-3">X</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={vertex.x}
                        onChange={(e) =>
                          updateVertex(vertex.id, "x", e.target.value)
                        }
                        className="h-7 w-16 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <label className="text-xs font-medium w-3">Y</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={vertex.y}
                        onChange={(e) =>
                          updateVertex(vertex.id, "y", e.target.value)
                        }
                        className="h-7 w-16 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <label className="text-xs font-medium w-3">Z</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={vertex.z}
                        onChange={(e) =>
                          updateVertex(vertex.id, "z", e.target.value)
                        }
                        className="h-7 w-16 text-xs"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeVertex(vertex.id)}
                    disabled={vertices.length <= 4}
                    className="h-7 w-7 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={createShape}
            disabled={
              vertices.length < 4 ||
              !hasVolume(
                vertices.map((v) => [
                  parseFloat(v.x) || 0,
                  parseFloat(v.y) || 0,
                  parseFloat(v.z) || 0,
                ])
              )
            }
          >
            Create Shape
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
