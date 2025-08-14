import {Canvas, type CanvasProps} from "@react-three/fiber";
import {cn} from "@/lib/utils.ts";

export interface FlexyCanvasProps extends CanvasProps {
  className?: string
}

/**
 * A helper component that lets us easily resize a react-three-fibre, by allowing us to actually give a className prop
 * to a wrapper div.
 * @param props
 * @constructor
 */
export default function FlexyCanvas(props: FlexyCanvasProps) {
  const { className, ...canvasProps } = props;

  return (
    <div className={cn("relative pointer-events-none", className)}>
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <Canvas {...canvasProps}>
        </Canvas>
      </div>
    </div>
  )
}