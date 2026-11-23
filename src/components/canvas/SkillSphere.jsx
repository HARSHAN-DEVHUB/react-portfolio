import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { allSkills } from "../../data/skills";
import { theme } from "../../config/theme";
import SceneCanvas from "./SceneCanvas";
import { ClayLights } from "./HeroScene";
import { makeClay, toneToColor } from "./materials";

const RADIUS = 2.25;
// One shared rounded-tile geometry for every skill (instead of one per tile).
const TILE = new RoundedBoxGeometry(0.4, 0.4, 0.1, 3, 0.045);

/** Even points on a sphere (Fibonacci lattice). */
function fibonacciSphere(n, r) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r));
  }
  return pts;
}

function Tile({ skill, position, material, hovered, dimmed, onHover }) {
  const ref = useRef(null);
  const quat = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(position.clone().multiplyScalar(2), position, new THREE.Vector3(0, 1, 0));
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, [position]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const s = hovered ? 1.75 : dimmed ? 0.62 : 1;
    const k = THREE.MathUtils.damp(ref.current.scale.x, s, 9, dt);
    ref.current.scale.setScalar(k);
  });

  return (
    <group position={position} quaternion={quat}>
      <group ref={ref}>
        <mesh
          geometry={TILE}
          material={material}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(skill.name);
          }}
          onPointerOut={() => onHover(null)}
        />
      </group>
      {hovered && (
        <Html position={[0, 0, 0.42]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="w-max min-w-40 border border-line-strong bg-bg/90 px-3 py-2 backdrop-blur-sm">
            <div className="font-display text-xl font-medium leading-tight tracking-[-0.02em] text-ink">{skill.name}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="label !text-[0.62rem]">{skill.groupLabel}</span>
              <span className="ml-auto font-mono text-[0.7rem] text-accent">{skill.level}</span>
            </div>
            <div className="mt-1.5 h-px w-full bg-line">
              <div className="h-px bg-accent" style={{ width: `${skill.level}%` }} />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Sphere({ hovered, setHovered, activeGroup, drag, reduced }) {
  const group = useRef(null);
  const points = useMemo(() => fibonacciSphere(allSkills.length, RADIUS), []);
  const materials = useMemo(() => {
    const map = {};
    allSkills.forEach((s) => {
      if (!map[s.tone]) {
        map[s.tone] = makeClay({
          color: toneToColor(s.tone),
          rimStrength: s.tone === "accent" ? 0.15 : 0.32,
        });
      }
    });
    return map;
  }, []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    if (!d.down) {
      // inertia decays back to a slow idle spin
      d.vx = THREE.MathUtils.damp(d.vx, reduced ? 0 : 0.12, 1.6, dt);
      d.vy = THREE.MathUtils.damp(d.vy, 0, 2.5, dt);
    }
    if (hovered && !d.down) {
      d.vx = THREE.MathUtils.damp(d.vx, 0, 6, dt);
    }
    g.rotation.y += d.vx * dt;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.vy * dt, -0.7, 0.7);
  });

  return (
    <group ref={group}>
      {allSkills.map((skill, i) => (
        <Tile
          key={skill.name}
          skill={skill}
          position={points[i]}
          material={materials[skill.tone]}
          hovered={hovered === skill.name}
          dimmed={activeGroup && activeGroup !== skill.group}
          onHover={setHovered}
        />
      ))}
      <mesh raycast={() => null}>
        <sphereGeometry args={[RADIUS * 0.55, 32, 32]} />
        <meshStandardMaterial color={theme.surface} roughness={1} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

/**
 * Interactive skill cloud. Drag to spin (with inertia), hover a tile to enlarge
 * it and show name + level. `activeGroup` dims every other group.
 */
export default function SkillSphere({ hovered, setHovered, activeGroup, reduced, className, fallback }) {
  const drag = useRef({ down: false, x: 0, y: 0, vx: 0.12, vy: 0 });
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const down = (e) => {
      drag.current.down = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      const d = drag.current;
      if (!d.down) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.x = e.clientX;
      d.y = e.clientY;
      d.vx = dx * 0.35;
      d.vy = e.pointerType === "mouse" ? dy * 0.2 : 0;
    };
    const up = () => {
      drag.current.down = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} data-cursor="drag" style={{ touchAction: "pan-y" }}>
      <SceneCanvas className="h-full w-full" camera={{ position: [0, 0, 8.6], fov: 38 }} interactive maxDpr={1.5} fallback={fallback}>
        <ClayLights rimIntensity={0.7} />
        <Sphere hovered={hovered} setHovered={setHovered} activeGroup={activeGroup} drag={drag} reduced={reduced} />
      </SceneCanvas>
    </div>
  );
}
