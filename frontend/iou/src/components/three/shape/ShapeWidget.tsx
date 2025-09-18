import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import useShape from "@/hooks/workspace/useShape.ts";
import Color, {type ColorInstance} from "color";
import {useMemo} from "react";
import useSelect from "@/hooks/workspace/useSelect.ts";
import useSelection from "@/hooks/workspace/useSelection.ts";
import useSetCameraInteraction from "@/hooks/workspace/useSetCameraInteration.ts";
import useShapeGeometry from "@/hooks/workspace/useShapeGeometry.ts";

export interface ShapeWidgetProps {
  uuid: string
}

/**
 * Rotates the hue of a function towards blue
 * @param col the color to get a rotated version of
 * @param step the number of degrees to move towards blue by
 */
function rotateTowardsBlue(col: ColorInstance | string, step: number) {
  if (typeof col === "string")
    col = Color(col);
  const h = col.hue();
  return col.rotate(h < 50 ? -step : h > 230 ? -step : step)
}

const selectionColor = "#00D3F2";
const hoverFresnelColor = Color(selectionColor).saturate(0.5).lighten(0.99).hex();

export default function ShapeWidget(props: ShapeWidgetProps) {
  const { vertices, color } = useShape(props.uuid);

  const baseColor = useMemo<string>(() => (
    Color(color).lighten(0.4).hex()
  ), [color]);

  const secondaryBaseColor = useMemo<string>(() => {
    const col = Color(baseColor);
    const step = 10; //< How much to rotate the secondary hue towards 230 degrees by
    return rotateTowardsBlue(col.saturate(0.025).darken(0.20), step).hex()
  }, [baseColor])

  const hoverColor = useMemo<string>(() => {
    return rotateTowardsBlue(baseColor, 2.5).hex()
  }, [baseColor]);

  const secondaryHoverColor = useMemo<string>(() => {
    const col = Color(baseColor).saturate(0.035).darken(0.15);
    return rotateTowardsBlue(col, 10).hex()
  }, [baseColor]);

  const { beginInteraction, endInteraction } = useSetCameraInteraction(props.uuid);
  const select = useSelect();
  const selection = useSelection(props.uuid);
  const wholeShapeIsSelected = selection && !selection?.children;

  const [geometry, edges] = useShapeGeometry(props.uuid, vertices);

  return (
    <ShapeRenderer
      vertices={vertices}
      edges={edges}
      geometry={geometry}

      vertexColor={color}

      baseColor={baseColor}
      secondaryBaseColor={secondaryBaseColor}

      hoverColor={hoverColor}
      secondaryHoverColor={secondaryHoverColor}

      fresnelColor={"#FFFFFF"}
      hoverFresnelColor={hoverFresnelColor}

      onPress={(vertexId?: number) => {
        if (vertexId === undefined)
          select(props.uuid)
        else
          select(props.uuid, [vertexId])
      }}
      maxVertexSelectionDistance={0.2}
      selectedIds={selection?.children ?? new Set<number>()}
      wholeShapeSelected={wholeShapeIsSelected}
      onPointerDown={() => {
        beginInteraction();
      }}
      onPointerUp={endInteraction}
      captureMovement={true}

      renderOrder={0}
    />
  )
}


