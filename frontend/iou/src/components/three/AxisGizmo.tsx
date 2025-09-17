import { Text } from "@react-three/drei";

/**
 * A custom gizmo component that displays coordinate axes using arrows and labels (X, Y, Z).
 * This version is carefully sized to fit within the GizmoHelper's viewport.
 */
export default function AxisGizmo() {
  const axisColors = {
    x: "#ef4444",
    y: "#10b981",
    z: "#0ea5e9",
  };
  const lineRadius = 0.025;
  const coneRadius = 0.05;
  const coneHeight = 0.2;
  const lineHeight = 0.8;

  return (
    <group>
      {/* X Axis - Rotated from Y axis */}
      <group rotation={[0, 0, -Math.PI / 2]}>
        <mesh position={[0, lineHeight / 2, 0]}>
          <cylinderGeometry args={[lineRadius, lineRadius, lineHeight, 5]} />
          <meshBasicMaterial color={axisColors.x} toneMapped={false} />
        </mesh>
        <mesh position={[0, lineHeight, 0]}>
          <coneGeometry args={[coneRadius, coneHeight, 5]} />
          <meshBasicMaterial color={axisColors.x} toneMapped={false} />
        </mesh>
        <Text
          position={[0, lineHeight + coneHeight + 0.15, 0]}
          fontSize={0.25}
          color={axisColors.x}
          anchorX="center"
          anchorY="middle"
        >
          X
        </Text>
      </group>

      {/* Y Axis - Default orientation */}
      <group>
        <mesh position={[0, lineHeight / 2, 0]}>
          <cylinderGeometry args={[lineRadius, lineRadius, lineHeight, 5]} />
          <meshBasicMaterial color={axisColors.y} toneMapped={false} />
        </mesh>
        <mesh position={[0, lineHeight, 0]}>
          <coneGeometry args={[coneRadius, coneHeight, 5]} />
          <meshBasicMaterial color={axisColors.y} toneMapped={false} />
        </mesh>
        <Text
          position={[0, lineHeight + coneHeight + 0.15, 0]}
          fontSize={0.25}
          color={axisColors.y}
          anchorX="center"
          anchorY="middle"
        >
          Y
        </Text>
      </group>

      {/* Z Axis - Rotated from Y axis */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, lineHeight / 2, 0]}>
          <cylinderGeometry args={[lineRadius, lineRadius, lineHeight, 5]} />
          <meshBasicMaterial color={axisColors.z} toneMapped={false} />
        </mesh>
        <mesh position={[0, lineHeight, 0]}>
          <coneGeometry args={[coneRadius, coneHeight, 5]} />
          <meshBasicMaterial color={axisColors.z} toneMapped={false} />
        </mesh>
        <Text
          position={[0, lineHeight + coneHeight + 0.15, 0]}
          fontSize={0.25}
          color={axisColors.z}
          anchorX="center"
          anchorY="middle"
        >
          Z
        </Text>
      </group>
    </group>
  );
}
