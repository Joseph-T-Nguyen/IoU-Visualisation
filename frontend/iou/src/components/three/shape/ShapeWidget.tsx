import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import useShape from "@/hooks/workspace/useShape.ts";
import useSelect from "@/hooks/workspace/useSelect.ts";
import useSelection from "@/hooks/workspace/useSelection.ts";
import useSetCameraInteraction from "@/hooks/workspace/useSetCameraInteration.ts";
import useShapeGeometry from "@/hooks/workspace/useShapeGeometry.ts";
import useShapeColorVariants from "@/hooks/useShapeColorVariants.ts";


export interface ShapeWidgetProps {
  uuid: string
}


export default function ShapeWidget(props: ShapeWidgetProps) {
  const { vertices, color: shapeColor } = useShape(props.uuid);

  const { beginInteraction, endInteraction } = useSetCameraInteraction(props.uuid);
  const select = useSelect();
  const selection = useSelection(props.uuid);
  const wholeShapeIsSelected = selection && !selection?.children;

  const {
    color,
    baseColor,
    secondaryBaseColor,
    hoverColor,
    secondaryHoverColor,
    hoverFresnelColor,
    selectedEdgeColor,
  } = useShapeColorVariants(shapeColor, wholeShapeIsSelected);

  const [geometry, edges] = useShapeGeometry(props.uuid, vertices);

  return (
    <ShapeRenderer
      vertices={vertices}
      edges={edges}
      geometry={geometry}

      vertexColor={wholeShapeIsSelected ? selectedEdgeColor : color}

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


