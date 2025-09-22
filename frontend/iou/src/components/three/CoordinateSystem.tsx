import { GizmoHelper, GizmoViewport } from "@react-three/drei";

/**
 * A component that displays a coordinate system gizmo in the bottom-left corner of the viewport.
 * This helps the user to identify the orientation of the axes and their point of view.
 */
export default function CoordinateSystem() {
  return (
    <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
      <GizmoViewport
        axisColors={["#ef4444", "#10b981", "#0ea5e9"]}
        labelColor="black"
        hideNegativeAxes={true}
        axisHeadScale={1.0}
      />
    </GizmoHelper>
  );
}
