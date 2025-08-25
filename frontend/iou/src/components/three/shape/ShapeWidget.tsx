import ShapeRenderer from "@/components/three/shape/ShapeRenderer.tsx";
import useShape from "@/hooks/workspace/useShape";


export interface ShapeWidgetProps {
  uuid: string
}


export default function ShapeWidget(props: ShapeWidgetProps) {
  const { vertices } = useShape(props.uuid);

  return (
    <ShapeRenderer
      vertices={vertices}
    />
  )
}


