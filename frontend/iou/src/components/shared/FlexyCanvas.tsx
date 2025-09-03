import {Canvas, type CanvasProps} from "@react-three/fiber";
import {cn} from "@/lib/utils.ts";
import type {ReactElement} from "react";

export interface FlexyCanvasProps extends CanvasProps {
  overlay?: ReactElement
  underlay?: ReactElement
}

/**
 * A helper component that lets us easily resize a react-three-fibre, by allowing us to actually give a className prop
 * to a wrapper div.
 * @param props
 * @constructor
 */
export default function FlexyCanvas(props: FlexyCanvasProps) {
  const { className, overlay, underlay, ...canvasProps } = props;

  const createOverlayDiv = (element?: ReactElement) => (
    element != undefined && (
      <div className="absolute top-0 left-0 right-0 bottom-0">
        {element}
      </div>
    )
  );

  const overlayDiv = createOverlayDiv(overlay);
  const underlayDiv = createOverlayDiv(underlay);

  return (
    <div className={cn("relative pointer-events-none", className)}>
      {underlayDiv}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <Canvas {...canvasProps} className="select-none">
        </Canvas>
      </div>
      {overlayDiv}
    </div>
  )
}