import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import {CameraControls, OrthographicCamera, PerspectiveCamera} from "@react-three/drei";
import useDimensions from "@/hooks/workspace/useDimensions.ts";

export default function WorkspaceCamera() {
  const [dimensions, ] = useDimensions();
  const cameraInteraction = useCameraInteraction();

  const camera3d = (<>
    <PerspectiveCamera
      makeDefault
      position={[0, 1.5, 5]}
    />
    <CameraControls
      enabled={cameraInteraction === undefined}
    ></CameraControls>
  </>);

  const camera2d = (
    <OrthographicCamera
      makeDefault
      zoom={200}
      position={[0, 1.5, 100]}
    />
  )

  return dimensions === "2d" ? camera2d : camera3d;
}