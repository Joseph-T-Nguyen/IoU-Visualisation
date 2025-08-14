import {useRef} from "react";
import {Mesh} from "three";
import {useFrame} from "@react-three/fiber";

export default function SpinningCube() {
  // This lets us interact with the underlying three.js object,
  // like a useRef would normally let us interact with the underlying HTML element!
  // The (null!) thing is a bodge to make typscript happy, but is effectively the same as just useRef<Mesh>();
  const animatedCubeRef = useRef<Mesh>(null!);

  // This animates the rotation of the cube!
  useFrame(({ clock }) => {
    animatedCubeRef.current.rotation.y = clock.elapsedTime;
  });

  return (
    <mesh ref={animatedCubeRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial />
    </mesh>
  );
}
