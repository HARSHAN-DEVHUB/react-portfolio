import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { theme } from "../../config/theme";
import { makeClay } from "./materials";

/* ------------------------------------------------------------------ */
/* Floating platform                                                    */
/* ------------------------------------------------------------------ */
export function Platform({ radius = 1, glow = true }) {
  const mats = useMemo(
    () => ({
      base: makeClay({ color: theme.clayDark, rimStrength: 0.2 }),
      top: makeClay({ color: "#3a3a36", rimStrength: 0.1 }),
    }),
    []
  );
  return (
    <group>
      <mesh material={mats.base} position={[0, -0.07, 0]}>
        <cylinderGeometry args={[radius, radius * 0.92, 0.14, 64]} />
      </mesh>
      <mesh material={mats.top} position={[0, 0.001, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[radius * 0.97, 64]} />
      </mesh>
      {glow && (
        <mesh rotation-x={Math.PI / 2} position={[0, 0.002, 0]}>
          <torusGeometry args={[radius * 0.985, 0.006, 8, 128]} />
          <meshBasicMaterial color={theme.accent} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Low-poly tech objects                                                */
/* ------------------------------------------------------------------ */
function Atom({ material }) {
  return (
    <group scale={0.95}>
      {[0, Math.PI / 3, -Math.PI / 3].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, r, 0]} material={material}>
          <torusGeometry args={[0.24, 0.018, 8, 48]} />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.055, 1]} />
        <meshBasicMaterial color={theme.accent} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Hexagon({ material }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} material={material}>
      <cylinderGeometry args={[0.22, 0.22, 0.09, 6]} />
    </mesh>
  );
}

function useExtruded(build, depth = 0.08) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    build(shape);
    const g = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 6,
    });
    g.center();
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function Shield({ material }) {
  const geo = useExtruded((s) => {
    s.moveTo(0, 0.26);
    s.lineTo(0.2, 0.19);
    s.lineTo(0.19, -0.02);
    s.quadraticCurveTo(0.15, -0.18, 0, -0.27);
    s.quadraticCurveTo(-0.15, -0.18, -0.19, -0.02);
    s.lineTo(-0.2, 0.19);
    s.closePath();
  });
  return <mesh geometry={geo} material={material} />;
}

function CodeBrackets({ material }) {
  const chevron = useExtruded((s) => {
    s.moveTo(0.1, 0.16);
    s.lineTo(-0.05, 0);
    s.lineTo(0.1, -0.16);
    s.lineTo(0.06, -0.2);
    s.lineTo(-0.13, 0);
    s.lineTo(0.06, 0.2);
    s.closePath();
  }, 0.06);
  const slash = useExtruded((s) => {
    s.moveTo(0.04, 0.22);
    s.lineTo(0.09, 0.22);
    s.lineTo(-0.04, -0.22);
    s.lineTo(-0.09, -0.22);
    s.closePath();
  }, 0.06);
  return (
    <group scale={0.9}>
      <mesh geometry={chevron} material={material} position={[-0.2, 0, 0]} />
      <mesh geometry={slash} material={material} />
      <mesh geometry={chevron} material={material} position={[0.2, 0, 0]} rotation-z={Math.PI} />
    </group>
  );
}

const OBJECTS = [
  { C: Atom, y: 1.55, phase: 0 },
  { C: CodeBrackets, y: 0.65, phase: Math.PI * 0.5 },
  { C: Shield, y: 1.2, phase: Math.PI },
  { C: Hexagon, y: 0.35, phase: Math.PI * 1.5 },
];

/** Tech objects orbiting the avatar on a tilted ring. */
export function TechOrbit({ count = 4, radius = 1.45, reduced = false }) {
  const group = useRef(null);
  const material = useMemo(() => makeClay({ color: theme.clay, flatShading: true }), []);
  const items = OBJECTS.slice(0, count);

  useFrame((state, dt) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += dt * 0.22;
    group.current.children.forEach((child) => {
      child.rotation.y -= dt * 0.22; // keep objects facing roughly forward
    });
  });

  return (
    <group ref={group} rotation-x={0.08}>
      {items.map(({ C, y, phase }, i) => (
        <group key={i} position={[Math.cos(phase) * radius, y, Math.sin(phase) * radius]}>
          <Float speed={reduced ? 0 : 1.6} rotationIntensity={reduced ? 0 : 0.9} floatIntensity={reduced ? 0 : 0.6}>
            <C material={material} />
          </Float>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Backdrop: the page background with a soft radial light behind 3D     */
/* ------------------------------------------------------------------ */
export function Backdrop({ center = [0, 1], radius = 3.2, z = -2.5, strength = 1 }) {
  const uniforms = useMemo(
    () => ({
      uBg: { value: new THREE.Color(theme.background) },
      uGlow: { value: new THREE.Color(theme.surface).lerp(new THREE.Color(theme.textMuted), 0.12) },
      uCenter: { value: new THREE.Vector2(...center) },
      uRadius: { value: radius },
      uStrength: { value: strength },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  uniforms.uCenter.value.set(center[0], center[1]);
  uniforms.uRadius.value = radius;

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms,
        vertexShader: `
          varying vec2 vPos;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vPos = world.xy;
            gl_Position = projectionMatrix * viewMatrix * world;
          }`,
        fragmentShader: `
          uniform vec3 uBg;
          uniform vec3 uGlow;
          uniform vec2 uCenter;
          uniform float uRadius;
          uniform float uStrength;
          varying vec2 vPos;
          void main() {
            float d = length(vPos - uCenter) / uRadius;
            float g = smoothstep(1.0, 0.0, d) * uStrength;
            gl_FragColor = vec4(mix(uBg, uGlow, g), 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [uniforms]
  );

  return (
    <mesh position={[0, 0, z]} renderOrder={-1} material={material}>
      <planeGeometry args={[60, 40]} />
    </mesh>
  );
}
