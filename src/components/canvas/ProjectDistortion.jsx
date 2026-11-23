import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { mouse, useMousePosition } from "../../hooks/useMousePosition";

import { distortionStore, distortionState as state } from "./distortionStore";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane;
  uniform vec2 uImage;
  uniform vec2 uMouse;
  uniform vec2 uVel;
  uniform float uStrength;
  uniform float uTime;
  varying vec2 vUv;

  // object-fit: cover
  vec2 coverUv(vec2 uv) {
    vec2 ratio = vec2(
      min((uPlane.x / uPlane.y) / (uImage.x / uImage.y), 1.0),
      min((uPlane.y / uPlane.x) / (uImage.y / uImage.x), 1.0)
    );
    return vec2(uv.x * ratio.x + (1.0 - ratio.x) * 0.5, uv.y * ratio.y + (1.0 - ratio.y) * 0.5);
  }

  void main() {
    vec2 uv = vUv;
    float d = distance(uv * uPlane / uPlane.y, uMouse * uPlane / uPlane.y);
    float falloff = smoothstep(0.65, 0.0, d);

    // ripple around the cursor + drag in the direction of movement
    float ripple = sin(d * 30.0 - uTime * 5.0) * 0.008 * falloff;
    uv += normalize(uv - uMouse + 1e-4) * ripple * uStrength;
    uv -= uVel * 0.0012 * falloff * uStrength;

    // slight zoom-in while hovered
    uv = (uv - 0.5) * (1.0 - 0.06 * uStrength) + 0.5;
    vec2 c = coverUv(uv);

    float shift = (0.003 + length(uVel) * 0.00035) * uStrength;
    vec4 col;
    col.r = texture2D(uTex, c + vec2(shift, 0.0)).r;
    col.g = texture2D(uTex, c).g;
    col.b = texture2D(uTex, c - vec2(shift, 0.0)).b;
    col.a = 1.0;

    gl_FragColor = vec4(col.rgb, smoothstep(0.0, 0.35, uStrength));
    #include <colorspace_fragment>
  }
`;

const loader = new THREE.TextureLoader();
const textures = new Map();
function getTexture(url, onLoad) {
  if (textures.has(url)) return textures.get(url);
  const tex = loader.load(url, onLoad);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  textures.set(url, tex);
  return tex;
}

function Plane() {
  const mesh = useRef(null);
  const { size, invalidate } = useThree();
  const strength = useRef(0);
  const vel = useRef(new THREE.Vector2());
  useMousePosition();

  const uniforms = useMemo(
    () => ({
      uTex: { value: null },
      uPlane: { value: new THREE.Vector2(1, 1) },
      uImage: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVel: { value: new THREE.Vector2() },
      uStrength: { value: 0 },
      uTime: { value: 0 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms]
  );

  // A quad whose 4 corners are rewritten every frame (tl, tr, br, bl).
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(12), 3));
    g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 0]), 2));
    g.setIndex([0, 3, 1, 1, 3, 2]);
    return g;
  }, []);

  useEffect(() => distortionStore.subscribe(() => invalidate()), [invalidate]);

  // Pre-compile the shader so the first hover doesn't stutter.
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const m = mesh.current;
    if (!m || !gl.compileAsync) return;
    m.visible = true;
    gl.compileAsync(scene, camera).finally(() => {
      if (!state.active) m.visible = false;
    });
  }, [gl, scene, camera]);

  useFrame((three, dt) => {
    const m = mesh.current;
    const el = state.el;
    const target = state.active ? 1 : 0;
    strength.current = THREE.MathUtils.damp(strength.current, target, state.active ? 5 : 7, dt);
    uniforms.uStrength.value = strength.current;
    uniforms.uTime.value = three.clock.elapsedTime;
    if (el) el.style.opacity = String(1 - Math.min(1, strength.current * 3));

    if (!m || !el || strength.current < 0.002) {
      if (m) m.visible = false;
      if (el && strength.current < 0.002) el.style.opacity = "";
      return;
    }

    if (state.url) {
      const tex = getTexture(state.url, () => invalidate());
      if (uniforms.uTex.value !== tex) uniforms.uTex.value = tex;
      if (tex.image?.width) uniforms.uImage.value.set(tex.image.width, tex.image.height);
    }

    const r = el.getBoundingClientRect();
    const quad = state.getQuad?.() || [
      [r.left, r.top],
      [r.right, r.top],
      [r.right, r.bottom],
      [r.left, r.bottom],
    ];
    const pos = m.geometry.attributes.position;
    quad.forEach(([x, y], i) => pos.setXYZ(i, x - size.width / 2, size.height / 2 - y, 0));
    pos.needsUpdate = true;
    m.visible = true;
    uniforms.uPlane.value.set(el.offsetWidth || r.width, el.offsetHeight || r.height);

    const mu = (mouse.px - r.left) / r.width;
    const mv = 1 - (mouse.py - r.top) / r.height;
    uniforms.uMouse.value.lerp(new THREE.Vector2(mu, mv), 0.2);
    vel.current.lerp(new THREE.Vector2(mouse.vx, -mouse.vy), 0.15);
    mouse.vx *= 0.85;
    mouse.vy *= 0.85;
    uniforms.uVel.value.copy(vel.current);

    invalidate();
  });

  return (
    <mesh ref={mesh} visible={false} geometry={geometry} material={material} frustumCulled={false} />
  );
}

/** One fixed, full-screen, click-through canvas that renders the hovered preview with a WebGL distortion. */
export default function ProjectDistortion() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[40]" aria-hidden="true">
      <Canvas
        frameloop="demand"
        style={{ pointerEvents: "none" }}
        orthographic
        flat
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], zoom: 1, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: false }}
      >
        <Plane />
      </Canvas>
    </div>
  );
}
