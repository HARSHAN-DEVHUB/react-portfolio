import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { mouse } from "../../hooks/useMousePosition";
import SceneCanvas from "./SceneCanvas";
import Avatar from "./Avatar";
import { Backdrop, Platform } from "./props";
import { ClayLights } from "./HeroScene";

function Rig({ reduced }) {
  useFrame((state, dt) => {
    const mx = reduced ? 0 : mouse.x;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, -0.6 + mx * 0.3, 3, dt);
    state.camera.lookAt(0, 1.0, 0);
  });
  return null;
}

/** Contact avatar: waves, then gives a thumbs-up toward the form each time the section enters view. */
export default function ContactScene({ visits, reduced, className, fallback }) {
  return (
    <SceneCanvas className={className} camera={{ position: [-0.6, 1.4, 5.6], fov: 30 }} maxDpr={1.25} fallback={fallback}>
      <Backdrop center={[0, 1.2]} radius={2.6} z={-2.5} />
      <ClayLights />
      <Rig reduced={reduced} />
      <group rotation-y={-0.35}>
        <Float speed={reduced ? 0 : 1.2} rotationIntensity={0} floatIntensity={reduced ? 0 : 0.4} floatingRange={[-0.04, 0.04]}>
          <Platform radius={0.85} />
          <Avatar
            sequence={visits > 0 ? ["wave", "point", "idle"] : ["idle"]}
            sequenceKey={`contact-${visits}`}
            followMouse={!reduced}
          />
        </Float>
        <ContactShadows position={[0, -0.32, 0]} opacity={0.55} scale={4} blur={2.6} far={1.4} resolution={256} frames={90} color="#000000" />
      </group>
    </SceneCanvas>
  );
}
