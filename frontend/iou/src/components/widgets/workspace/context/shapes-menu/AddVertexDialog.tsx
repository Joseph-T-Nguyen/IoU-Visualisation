import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import type { Vec3 } from "@/hooks/workspace/workspaceTypes.ts";

interface AddVertexDialogProps {
  shapeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddVertexDialog({
  shapeId,
  open,
  onOpenChange,
}: AddVertexDialogProps) {
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");
  const [z, setZ] = useState("0");
  const [dimensions] = useDimensions();

  const shapes = useShapesStore((s) => s.shapes);
  const setVertices = useShapesStore((s) => s.setVertices);

  const handleAddVertex = () => {
    const shape = shapes[shapeId];
    if (!shape) return;

    const newVertex: Vec3 = [
      parseFloat(x) || 0,
      parseFloat(y) || 0,
      parseFloat(z) || 0,
    ];

    const updatedVertices = [...shape.vertices, newVertex];
    setVertices(shapeId, updatedVertices);

    // Reset form and close dialog
    setX("0");
    setY("0");
    setZ("0");
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setX("0");
    setY("0");
    setZ("0");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Vertex</DialogTitle>
          <DialogDescription>
            Enter the coordinates for the new vertex. It will be added to the
            selected shape.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="x-coord" className="text-right text-sm font-medium">
              X
            </label>
            <Input
              id="x-coord"
              type="number"
              step="0.1"
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="y-coord" className="text-right text-sm font-medium">
              Y
            </label>
            <Input
              id="y-coord"
              type="number"
              step="0.1"
              value={y}
              onChange={(e) => setY(e.target.value)}
              className="col-span-3"
            />
          </div>
          {dimensions === "3d" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label
                htmlFor="z-coord"
                className="text-right text-sm font-medium"
              >
                Z
              </label>
              <Input
                id="z-coord"
                type="number"
                step="0.1"
                value={z}
                onChange={(e) => setZ(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleAddVertex}>Add Vertex</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
