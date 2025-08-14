import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import SpinningCube from "@/components/three/SpinningCube.tsx";

export default function LandingPage() {


  // Add these props to the camera to make it orthographic:
  // orthographic camera={{ zoom: 50, position: [0, 0, 100] }}

  return (
    <div className="py-0 flex p-0 min-h-screen w-full flex-col">
      <div className="flex flex-row justify-center py-3">
        <h1 className="text-4xl font-light">IOU Calculator</h1>
      </div>

      <FlexyCanvas className="flex-grow">
        <SpinningCube></SpinningCube>
        <ambientLight intensity={0.1} color="blue"/>
        <directionalLight position={[0, 0, 5]} color="#CCC" />
        <orthographicCamera position={[0, 0, 1]} ></orthographicCamera>
      </FlexyCanvas>
    </div>
  );
}