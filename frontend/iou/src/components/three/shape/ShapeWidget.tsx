import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import useShape from "@/hooks/workspace/useShape.ts";
import Color from "color";
import {useMemo} from "react";
import useSelect from "@/hooks/workspace/useSelect.ts";
import useSelection from "@/hooks/workspace/useSelection.ts";
import useSetCameraInteraction from "@/hooks/workspace/useSetCameraInteration.ts";
import useShapeGeometry from "@/hooks/workspace/useShapeGeometry.ts";

export interface ShapeWidgetProps {
  uuid: string
}


export default function ShapeWidget(props: ShapeWidgetProps) {
  const { vertices, color, name } = useShape(props.uuid);
  const baseColor = useMemo<string>(() => (
    Color(color).lighten(0.4).hex()
  ), [color])
  const secondaryBaseColor = useMemo<string>(() => {
    const col = Color(baseColor);
    const h = col.hue();
    const step = 10; //< How much to rotate the secondary hue towards 230degrees by
    return col.saturate(0.025).darken(0.20).rotate(h < 50 ? -step : h > 230 ? -step : step).hex()
  }, [baseColor])

  const { beginInteraction, endInteraction } = useSetCameraInteraction(props.uuid);
  const select = useSelect();
  const selection = useSelection(props.uuid);

  const [geometry, edges] = useShapeGeometry(props.uuid, vertices);

  return (
    <ShapeRenderer
      vertices={vertices}
      edges={edges}
      geometry={geometry}

      baseColor={baseColor}
      vertexColor={color}
      onPress={(vertexId?: number) => {
        if (vertexId === undefined)
          select(props.uuid)
        else
          select(props.uuid, [vertexId])

        console.log("selected ", name, vertexId);
      }}
      maxVertexSelectionDistance={0.2}
      selectedIds={selection?.children ?? new Set<number>()}
      wholeShapeSelected={selection && !selection?.children}
      onPointerDown={() => {
        beginInteraction();
        console.log("begin interaction ", name);
      }}
      onPointerUp={endInteraction}
      secondaryBaseColor={secondaryBaseColor}
      captureMovement={true}

      renderOrder={0}
    />
  )
}


