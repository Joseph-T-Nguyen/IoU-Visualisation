import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";
import useShapesStore from "@/hooks/workspace/stores/useShapesStore.ts";
import ShapesMenuItem from "@/components/widgets/workspace/context/shapes-menu/ShapesMenuItem.tsx";

export default function ShapesMenu() {
  const shapeUUIDs = useShapeUUIDs();
  const addShape = useShapesStore(s => s.addShape);

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

        {/* New shape button */}
        <Button
          onClick={addShape}
          size="sm"
          className="cursor-pointer data-[disabled]:cursor-default pointer-events-auto"
        >
          <Plus/>
        </Button>
      </CardContent>
    </Card>
  )
}