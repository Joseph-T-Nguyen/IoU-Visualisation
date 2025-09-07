import useCameraInteraction from "@/hooks/workspace/useCameraInteraction.ts";
import {CameraControls, OrthographicCamera, PerspectiveCamera} from "@react-three/drei";
import useDimensions from "@/hooks/workspace/useDimensions.ts";

export default function WorkspaceCamera() {
  const [dimensions, ] = useDimensions();
  const cameraInteraction = useCameraInteraction();

  const camera = dimensions === "2d" ? (
    <OrthographicCamera
      makeDefault
      zoom={200}
      position={[0, 1.5, 100]}
    />
  ) : (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 1.5, 5]}
      />
      <CameraControls enabled={cameraInteraction === undefined}></CameraControls>
    </>
  );

  return (<>
    {camera}
  </>);
}