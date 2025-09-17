import {Card, CardContent} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import useShapeGeometryStore from "@/hooks/workspace/stores/useShapeGeometryStore.ts";

export default function IOUWidget() {

  const iou = useShapeGeometryStore(state => state.iou);

  return (
    <Card className="pointer-events-auto gap-1.5 px-0 shadow-lg justify-stretch pt-1.5 pb-3">
      <CardContent className="px-5 mt-1.5 flex flex-row gap-5 text-xl items-center h-7.5">
        <div className="">
          IOU

        </div>
        <Separator orientation="vertical"

        />

        <div className="grow font-mono font-light">
          {iou?.toFixed(10) ?? "???"}
        </div>
      </CardContent>
    </Card>

  )
}