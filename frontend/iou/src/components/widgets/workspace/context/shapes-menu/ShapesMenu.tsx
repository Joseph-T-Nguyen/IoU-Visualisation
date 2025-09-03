import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Ellipsis, Plus} from "lucide-react";
import useShapeUUIDs from "@/hooks/workspace/useShapeUUIDs.tsx";
import {useShapesStore} from "@/hooks/workspace/stores/useShapesStore.ts";
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
        <div className="flex flex-row gap-1.5 justify-center items-center">
          <Button className="bg-emerald-500 w-6 h-6" size="icon"></Button>
          <Input
            className="h-6 px-1.5 flex-grow text-sm text-left align-middle border-none shadow-none"
            value="Shape 2"
          />
          <Button size="icon" variant="ghost" className="h-6 cursor-pointer data-[disabled]:cursor-default">
            <Ellipsis />
          </Button>
        </div>

        {shapeUUIDs.map((uuid: string) => (
          <ShapesMenuItem uuid={uuid} />
        ))}

        {/* New shape button */}
        <Button
          onClick={addShape}
          size="sm"
          className="cursor-pointer data-[disabled]:cursor-default"
        >
          <Plus/>
        </Button>
      </CardContent>
    </Card>
  )
}