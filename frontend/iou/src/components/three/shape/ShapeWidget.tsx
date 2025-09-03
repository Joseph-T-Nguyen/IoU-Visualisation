import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import useShape from "@/hooks/workspace/useShape.ts";
import Color from "color";
import {useMemo} from "react";


export interface ShapeWidgetProps {
  uuid: string
}


export default function ShapeWidget(props: ShapeWidgetProps) {
  const { vertices, color } = useShape(props.uuid);
  const baseColor = useMemo<string>(() => (
    Color(color).lighten(0.4).hex()
  ), [color])

  return (
    <ShapeRenderer
      vertices={vertices}
      baseColor={baseColor}
      vertexColor={color}
    />
  )
}


