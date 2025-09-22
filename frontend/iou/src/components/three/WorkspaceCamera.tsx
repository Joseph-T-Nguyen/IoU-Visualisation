import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import {
  CameraControls,
  CameraControlsImpl,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import useKeyPressed from "@/hooks/input/useKeyPressed.ts";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
const { ACTION } = CameraControlsImpl;

export default function WorkspaceCamera() {
  // const [dimensions] = ["3d", ""];
  const [dimensions] = useDimensions();
  const cameraInteraction = useCameraInteraction();
  const shiftPressed = useKeyPressed("Shift");
  const cameraControlsRef = useRef<CameraControlsImpl>(null);

  const [cam2dRef, setCam2dRef] = useState<THREE.OrthographicCamera | null>();
  const [cam3dRef, setCam3dRef] = useState<THREE.PerspectiveCamera | null>();

  const camera3d = (
    <>
      <PerspectiveCamera ref={setCam3dRef} makeDefault position={[0, 1.5, 5]} />
    </>
  );

  const camera2d = (
    <OrthographicCamera
      ref={setCam2dRef}
      makeDefault
      zoom={200}
      position={[0, 1.5, 100]}
    />
  );

  const mouseControls = {
    left: shiftPressed || dimensions === "2d" ? ACTION.TRUCK : ACTION.ROTATE,
    middle: dimensions === "3d" ? ACTION.DOLLY : ACTION.NONE,
    right: ACTION.TRUCK,
    wheel: dimensions === "3d" ? ACTION.DOLLY : ACTION.ZOOM,
  };

  const touchControls = {
    one:
      shiftPressed || dimensions === "2d"
        ? ACTION.TOUCH_TRUCK
        : ACTION.TOUCH_ROTATE,
    two:
      dimensions === "2d" ? ACTION.TOUCH_ZOOM_TRUCK : ACTION.TOUCH_DOLLY_TRUCK,
    three:
      dimensions === "2d" ? ACTION.TOUCH_ZOOM_TRUCK : ACTION.TOUCH_DOLLY_TRUCK,
  };

  // Reset 2D camera orientation
  useEffect(() => {
    if (dimensions === "3d") return;
    if (!cameraControlsRef.current) return;
    cameraControlsRef.current?.rotateTo(0, Math.PI / 2, true);
  }, [dimensions, cam2dRef]);

  return (
    <>
      {dimensions === "2d" ? camera2d : camera3d}
      <CameraControls
        ref={cameraControlsRef}
        enabled={cameraInteraction === undefined}
        mouseButtons={mouseControls}
        camera={(dimensions === "3d" ? cam3dRef : cam2dRef)!}
        touches={touchControls}
      />
    </>
  );
}
