import FlexyCanvas from "@/components/shared/FlexyCanvas.tsx";
import SpinningCube from "@/components/three/SpinningCube.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TrackballControls} from "@react-three/drei";

export default function LandingPage() {

  return (
    <div className="relative py-0 flex p-0 min-h-[100dv] overflow-hidden h-screen w-full flex-col bg-secondary">
      <div className="flex flex-row justify-center py-3">
        <h1 className="text-4xl font-light">IOU Calculator</h1>
      </div>

      <FlexyCanvas className="flex-grow"
        overlay={<div className="w-full flex flex-row justify-center h-full items-center">
          <Button className="pointer-events-auto shadow-lg cursor-pointer" variant={"outline"} size="lg" asChild>
            <a href={"/workspace"}>
              Open Workspace
            </a>
          </Button>
        </div>}
      >
        <SpinningCube></SpinningCube>
        <TrackballControls />
        <ambientLight intensity={0.1} color="blue"/>
        <directionalLight position={[0, 0, 5]} color="#CCC" />
        <orthographicCamera position={[0, 0, 1]} ></orthographicCamera>
      </FlexyCanvas>
    </div>
  );
}