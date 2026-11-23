import { Float, ContactShadows } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { theme } from "../../config/theme";
import { mouse, useMousePosition } from "../../hooks/useMousePosition";
import { scrollState } from "../../hooks/useLenis";
import SceneCanvas from "./SceneCanvas";
import { useQuality } from "./quality";
import Avatar from "./Avatar";
import { Backdrop, Platform, TechOrbit } from "./props";

/** Shared lighting for the clay look: soft key, cool fill, accent rim from behind. */
export function ClayLights({ rimIntensity = 0.9 }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={[theme.clay, theme.background, 0.55]} />
      <directionalLight position={[3, 5, 4]} intensity={1.7} />
      <directionalLight position={[-3.5, 1.2, -4]} intensity={rimIntensity} color={theme.accent} />
      {/* soft frontal fill — replaces an environment map, much cheaper */}
      <directionalLight position={[0, 2, 6]} intensity={0.55} />
      <directionalLight position={[-5, 1, 0]} intensity={0.25} />
    </>
  );
}

function Rig({ isMobile, reduced, focusX }) {
  const { camera } = useThree();
  useMousePosition();
  useFrame((_, dt) => {
    const vh = window.innerHeight || 1;
    const p = Math.min(scrollState.y / vh, 1.2); // 0 at top of page → 1 one screen down
    const mx = reduced ? 0 : mouse.x;
    const my = reduced ? 0 : mouse.y;
    const baseZ = isMobile ? 8.2 : 7.9;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, mx * 0.45, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.45 + my * 0.22 + p * 0.9, 3, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ + p * 2.2, 3, dt);
    camera.lookAt(focusX * 0.55, 1.05 - p * 0.35, 0);
  });
  return null;
}

function Scene({ play, isMobile, reduced }) {
  const quality = useQuality();
  const { viewport, camera } = useThree();
  const vw = viewport.getCurrentViewport(camera, [0, 0, 0]).width;
  // Desktop: avatar sits in the right part of the frame; mobile: centred.
  const x = isMobile ? 0 : Math.min(vw * 0.27, 3.1);

  return (
    <>
      <Backdrop center={[x, 1.3]} radius={isMobile ? 2.6 : 3.4} />
      <ClayLights />
      <Rig isMobile={isMobile} reduced={reduced} focusX={x} />

      <group position={[x, -0.1, 0]}>
        <Float speed={reduced ? 0 : 1.2} rotationIntensity={0} floatIntensity={reduced ? 0 : 0.5} floatingRange={[-0.05, 0.05]}>
          <Platform radius={0.95} />
          <Avatar
            sequence={play ? ["wave", "idle"] : ["idle"]}
            sequenceKey={play ? "intro" : "waiting"}
            followMouse={!reduced}
          />
        </Float>
        <TechOrbit count={isMobile ? 2 : 4} radius={isMobile ? 1.2 : 1.25} reduced={reduced} />
        <ContactShadows position={[0, -0.42, 0]} opacity={0.6} scale={5} blur={2.8} far={1.6} resolution={256} frames={90} color="#000000" />
      </group>

      {quality === "high" && !isMobile && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.2} intensity={0.55} radius={0.55} />
          <Vignette offset={0.3} darkness={0.4} />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene({ play, isMobile, reduced, fallback, className }) {
  return (
    <SceneCanvas
      className={className}
      camera={{ position: [0, 1.45, isMobile ? 8.2 : 7.9], fov: isMobile ? 34 : 30, near: 0.1, far: 60 }}
      maxDpr={isMobile ? 1.25 : 1.5}
      fallback={fallback}
    >
      <Scene play={play} isMobile={isMobile} reduced={reduced} />
    </SceneCanvas>
  );
}
