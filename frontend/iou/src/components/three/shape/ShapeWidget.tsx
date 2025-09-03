import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import useShape from "@/hooks/workspace/useShape.ts";
import Color from "color";
import {useEffect, useMemo} from "react";
import useSelect from "@/hooks/workspace/useSelect.ts";
import useSelection from "@/hooks/workspace/useSelection.ts";

export interface ShapeWidgetProps {
  uuid: string
}

export default function ShapeWidget(props: ShapeWidgetProps) {
  const { vertices, color } = useShape(props.uuid);
  const baseColor = useMemo<string>(() => (
    Color(color).lighten(0.4).hex()
  ), [color])

  const select = useSelect();
  const selection = useSelection(props.uuid);

  useEffect(() => {
    console.log("selection: ", selection);
  }, [selection]);

  return (
    <ShapeRenderer
      vertices={vertices}
      baseColor={baseColor}
      vertexColor={color}
      onPress={(vertexId: number) => select(props.uuid, [vertexId])}
      selectedIds={selection?.children ?? new Set<number>()}
    />
  )
}


