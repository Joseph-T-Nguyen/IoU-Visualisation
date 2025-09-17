import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import ShapesMenuItem from "@/components/widgets/workspace/context/shapes-menu/ShapesMenuItem.tsx";
import CreateCustomShapeDialog from "@/components/widgets/workspace/context/shapes-menu/CreateCustomShapeDialog.tsx";

export default function ShapesMenu() {
  const shapeUUIDs = useShapeUUIDs();
  const addShape = useShapesStore((s) => s.addShape);

  return (
    <Card className="w-full max-w-sm pointer-events-auto py-3 gap-1.5 px-0 shadow-lg">
      <CardHeader className="px-3">
        <CardTitle>Shapes</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="px-3 mt-1.5 flex flex-col gap-3">
        {shapeUUIDs.map((uuid: string) => (
          <ShapesMenuItem uuid={uuid} key={uuid} />
        ))}

        {/* Shape creation buttons */}
        <div className="flex gap-2">
          <Button
            onClick={addShape}
            size="sm"
            className="cursor-pointer data-[disabled]:cursor-default pointer-events-auto flex-1"
          >
            <Plus className="mr-2 h-4 w-4" />
            Cube
          </Button>
          <CreateCustomShapeDialog />
        </div>
      </CardContent>
    </Card>
  );
}
