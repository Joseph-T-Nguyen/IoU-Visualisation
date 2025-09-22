import {Grid} from "@react-three/drei";
import useDimensions from "@/hooks/workspace/useDimensions.ts";
import {Euler} from "three";


export default function WorkspaceGrid() {
  const [dimensions, ] = useDimensions();

  return <></>
  return (
    <Grid
      infiniteGrid={true}

      cellSize={1}
      cellThickness={dimensions === "2d" ? 1 : 0.6}
      sectionSize={10}
      sectionThickness={dimensions === "2d" ? 1.66666667 : 1}
      fadeDistance={10}
      fadeStrength={1}
      followCamera={true}
      sectionColor={"#94a3b8"}
      cellColor={"#94a3b8"}
      rotation={dimensions === "2d" ? new Euler(3.14159/2, 0, 0) : new Euler(0, 0, 0)}


    />
  );
}