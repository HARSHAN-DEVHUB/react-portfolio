import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { theme } from "../../config/theme";
import SceneCanvas from "./SceneCanvas";
import Avatar from "./Avatar";
import { Backdrop } from "./props";
import { ClayLights } from "./HeroScene";
import { makeClay } from "./materials";

/** Glowing laptop screen: dark panel with lines of "code" in accent + bone. */
function Screen() {
  const lines = useMemo(() => {
    const out = [];
    let y = 0.12;
    for (let i = 0; i < 9; i++) {
      const indent = [0, 0.04, 0.08, 0.04, 0.08, 0.12, 0.04, 0, 0.04][i];
      const w = 0.08 + ((i * 37) % 11) / 40;
      out.push({ x: -0.19 + indent + w / 2, y, w, accent: i === 2 || i === 6 });
      y -= 0.028;
    }
    return out;
  }, []);
  const group = useRef(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    // "typing": lines flicker in one after another
    const t = clock.elapsedTime * 2.2;
    group.current.children.forEach((m, i) => {
      m.scale.x = 0.35 + 0.65 * Math.min(1, Math.max(0, ((t - i * 0.35) % 4) / 0.4));
    });
  });
  return (
    <group>
      <mesh>
        <planeGeometry args={[0.46, 0.3]} />
        <meshBasicMaterial color="#10140a" toneMapped={false} />
      </mesh>
      <group ref={group} position={[0, 0, 0.002]}>
        {lines.map((l, i) => (
          <mesh key={i} position={[l.x, l.y, 0]}>
            <planeGeometry args={[l.w, 0.011]} />
            <meshBasicMaterial color={l.accent ? theme.accent : theme.textPrimary} toneMapped={false} transparent opacity={l.accent ? 1 : 0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Desk() {
  const mats = useMemo(
    () => ({
      wood: makeClay({ color: theme.clay, rimStrength: 0.25 }),
      dark: makeClay({ color: theme.clayDark, rimStrength: 0.15 }),
      laptop: makeClay({ color: "#4a4a46", rimStrength: 0.2 }),
    }),
    []
  );
  const legs = [
    [-0.72, 0.36, -0.32],
    [0.72, 0.36, -0.32],
    [-0.72, 0.36, 0.32],
    [0.72, 0.36, 0.32],
  ];
  return (
    <group>
      {/* top */}
      <mesh material={mats.wood} position={[0, 0.74, 0]}>
        <boxGeometry args={[1.62, 0.05, 0.8]} />
      </mesh>
      {legs.map((p, i) => (
        <mesh key={i} material={mats.dark} position={p}>
          <boxGeometry args={[0.05, 0.72, 0.05]} />
        </mesh>
      ))}
      {/* laptop — hinge on the far side, display facing the avatar (−z) */}
      <group position={[0, 0.765, -0.05]}>
        <mesh material={mats.laptop} position={[0, 0.01, 0]}>
          <boxGeometry args={[0.52, 0.02, 0.36]} />
        </mesh>
        <group position={[0, 0.02, 0.17]} rotation-x={0.3}>
          <mesh material={mats.laptop} position={[0, 0.17, 0]}>
            <boxGeometry args={[0.52, 0.34, 0.012]} />
          </mesh>
          <group position={[0, 0.17, -0.0075]} rotation-y={Math.PI}>
            <Screen />
          </group>
        </group>
      </group>
      {/* mug */}
      <mesh material={mats.dark} position={[0.55, 0.82, 0.12]}>
        <cylinderGeometry args={[0.045, 0.04, 0.11, 20]} />
      </mesh>
      {/* stool */}
      <group position={[0, 0, -0.62]}>
        <mesh material={mats.dark} position={[0, 0.44, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />
        </mesh>
        <mesh material={mats.dark} position={[0, 0.21, 0]}>
          <cylinderGeometry args={[0.03, 0.05, 0.42, 12]} />
        </mesh>
      </group>
      {/* screen light spilling onto the avatar */}
      <pointLight position={[0, 1.0, -0.25]} color="#e6f2ff" intensity={0.45} distance={1.4} decay={2} />
    </group>
  );
}

function Rig({ progressRef, reduced }) {
  const group = useRef(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    const p = progressRef?.current ?? 0;
    const target = reduced ? -0.35 : -0.75 + p * 0.8;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 3, dt);
    // tiny breathing on the camera
    if (!reduced) state.camera.position.y = 2.05 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    state.camera.lookAt(0, 0.85, 0);
  });
  return (
    <group ref={group}>
      <Desk />
      <Avatar
        sequence={["typing"]}
        sequenceKey="desk"
        headPitch={0.28}
        position={[0, 0, -0.62]}
        scale={0.74}
      />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={4} blur={2.4} far={1.2} resolution={256} frames={90} color="#000000" />
    </group>
  );
}

/** Sticky About scene: the avatar at a desk, typing, lit by the laptop. */
export default function DeskScene({ progressRef, reduced, className, fallback }) {
  return (
    <SceneCanvas className={className} camera={{ position: [0, 2.05, 5.2], fov: 32 }} maxDpr={1.25} fallback={fallback}>
      <Backdrop center={[0, 1]} radius={2.8} z={-3} />
      <ClayLights rimIntensity={0.6} />
      <Rig progressRef={progressRef} reduced={reduced} />
    </SceneCanvas>
  );
}
