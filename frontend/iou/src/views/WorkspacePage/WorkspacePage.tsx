import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import SpinningCube from "@/components/three/SpinningCube.tsx";

export default function WorkspacePage() {

  // Add these props to the camera to make it orthographic:
  // orthographic camera={{ zoom: 50, position: [0, 0, 100] }}

  const overlay = (
    <div className="flex flex-col justify-center py-3">
      <h1 className="text-4xl w-full text-center font-light">IOU Calculator</h1>
    </div>
  );

  return (
    <FlexyCanvas
      className="flex-grow w-screen h-screen overflow-clip"
      overlay={overlay}
    >
      {/* Add 3D content here: */}
      <SpinningCube></SpinningCube>

      <ambientLight intensity={0.125} color="blue"/>
      <directionalLight position={[0, 0, 5]} color="#CCC" />
      <orthographicCamera position={[0, 0, 1]} ></orthographicCamera>
    </FlexyCanvas>
  );
}




