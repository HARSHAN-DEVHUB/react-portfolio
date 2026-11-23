import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { theme } from "../../config/theme";
import SceneCanvas from "./SceneCanvas";
import { makeClay } from "./materials";

/**
 * The timeline spine: a clay tube that coils between the timeline nodes and
 * draws itself as you scroll. Orthographic camera, 1 world unit = 1 CSS pixel,
 * so `nodes` (pixel offsets from the top) line up with the DOM exactly.
 */
function Spine({ nodes, height, progressRef, reduced }) {
  const group = useRef(null);
  const tubeRef = useRef(null);
  const nodeRefs = useRef([]);

  const { geometry, nodeT, total } = useMemo(() => {
    const top = height / 2;
    const pts = [new THREE.Vector3(0, top, 0)];
    const ys = nodes.map((y) => top - y);
    ys.forEach((y, i) => {
      const prev = i === 0 ? top : ys[i - 1];
      const mid = (prev + y) / 2;
      const a = i * 1.9;
      pts.push(new THREE.Vector3(Math.cos(a) * 18, mid, Math.sin(a) * 18));
      pts.push(new THREE.Vector3(0, y, 0));
    });
    pts.push(new THREE.Vector3(0, -top, 0));
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    const tubular = Math.max(64, nodes.length * 60);
    const geo = new THREE.TubeGeometry(curve, tubular, 2.4, 10, false);
    // Map each node to its fraction of the drawn length (by height – the tube is mostly vertical)
    const t = ys.map((y) => (top - y) / height);
    return { geometry: geo, nodeT: t, total: geo.index.count };
  }, [nodes, height]);

  const tubeMat = useMemo(() => makeClay({ color: theme.clay, rimStrength: 0.5, rimPower: 2 }), []);
  const nodeMat = useMemo(() => makeClay({ color: theme.clayDark, rimStrength: 0.3 }), []);
  const nodeOnMat = useMemo(() => makeClay({ color: theme.accent, rimStrength: 0.1 }), []);
  const shown = useRef(0);

  useFrame((state, dt) => {
    const target = progressRef.current ?? 0;
    shown.current = reduced ? target : THREE.MathUtils.damp(shown.current, target, 6, dt);
    const count = Math.floor((shown.current * total) / 6) * 6;
    geometry.setDrawRange(0, Math.max(0, count));

    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      const on = shown.current >= nodeT[i] - 0.004;
      const s = THREE.MathUtils.damp(m.scale.x, on ? 1 : 0.55, 10, dt);
      m.scale.setScalar(s);
      m.material = on ? nodeOnMat : nodeMat;
    });

    if (group.current && !reduced) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.9;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={tubeRef} geometry={geometry} material={tubeMat} />
      {nodes.map((y, i) => (
        <mesh key={i} ref={(el) => (nodeRefs.current[i] = el)} position={[0, height / 2 - y, 0]} material={nodeMat}>
          <icosahedronGeometry args={[8, 1]} />
        </mesh>
      ))}
    </group>
  );
}

export default function Experience3D({ nodes, height, progressRef, reduced, className }) {
  if (!height || !nodes.length) return null;
  return (
    <SceneCanvas
      className={className}
      orthographic
      camera={{ position: [0, 0, 400], zoom: 1, near: 0.1, far: 1000 }}
      maxDpr={1.5}
      rootMargin="20% 0px"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[200, 300, 400]} intensity={2} />
      <directionalLight position={[-300, -100, -200]} intensity={1.2} color={theme.accent} />
      <Spine nodes={nodes} height={height} progressRef={progressRef} reduced={reduced} />
    </SceneCanvas>
  );
}
