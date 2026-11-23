import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { profile } from "../../data/profile";
import { theme } from "../../config/theme";
import { asset } from "../../lib/device";
import { mouse } from "../../hooks/useMousePosition";
import { makeClay, toneToColor } from "./materials";

const cfg = profile.avatar;
const MODEL_URL = asset(cfg.url);
const FADE = 0.45;

/**
 * The 3D avatar.
 *
 *  sequence     – clip keys from profile.avatar.clips, played in order.
 *                 Each plays once; the last one loops (unless listed in holdClips).
 *  sequenceKey  – change it to restart the sequence (e.g. when a section scrolls into view).
 *  followMouse  – head (clamped) and body (slightly) turn toward the cursor.
 *  headPitch    – constant head tilt in radians (+ looks down), e.g. at the desk.
 */
export default function Avatar({ sequence = ["idle"], sequenceKey = "default", followMouse = false, headPitch = 0, ...props }) {
  const gltf = useGLTF(MODEL_URL, false, true);

  // Independent copy (skinned meshes need SkeletonUtils.clone), clay materials, auto-scale.
  const model = useMemo(() => {
    const root = cloneSkinned(gltf.scene);
    const cache = new Map();
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.frustumCulled = false;
      const src = o.material;
      const key = src.name || src.uuid;
      if (!cache.has(key)) {
        const tone = cfg.recolor?.[src.name];
        // "Glow*" parts stay unlit, in the active theme's accent colour
        const material = src.name?.startsWith("Glow")
          ? new THREE.MeshBasicMaterial({ color: theme.accent, toneMapped: false })
          : makeClay({
              color: tone ? toneToColor(tone) : src.color,
              map: tone ? null : src.map,
              rimStrength: tone === "dark" ? 0.12 : 0.2,
            });
        material.side = src.side;
        cache.set(key, material);
      }
      o.material = cache.get(key);
    });

    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const height = box.max.y - box.min.y || 1;
    const s = cfg.height / height;
    root.scale.multiplyScalar(s);
    root.position.set(
      -((box.min.x + box.max.x) / 2) * s,
      -box.min.y * s,
      -((box.min.z + box.max.z) / 2) * s
    );
    return root;
  }, [gltf.scene]);

  const { actions, mixer } = useAnimations(gltf.animations, model);

  // Head bone (GLTFLoader may suffix duplicates: Head_1 …)
  const head = useMemo(() => {
    const re = new RegExp(`^${cfg.headBone}(_\\d+)?$`);
    // Prefer a skinned bone; fall back to a plain node for rigid-part rigs.
    let bone = null;
    let nodeMatch = null;
    model.traverse((o) => {
      if (!re.test(o.name)) return;
      if (!bone && o.isBone) bone = o;
      if (!nodeMatch && !o.isMesh) nodeMatch = o;
    });
    return bone || nodeMatch;
  }, [model]);
  const headRest = useMemo(() => head?.quaternion.clone(), [head]);

  // ---- Clip sequencing -------------------------------------------------------
  useEffect(() => {
    const names = sequence.map((k) => cfg.clips[k]).filter((n) => n && actions[n]);
    if (!names.length) return;
    const holds = new Set((cfg.holdClips || []).map((k) => cfg.clips[k]));
    let index = 0;
    let current = null;

    const play = () => {
      const name = names[index];
      const action = actions[name];
      const last = index === names.length - 1;
      action.reset();
      action.setLoop(last && !holds.has(name) ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
      action.clampWhenFinished = true;
      action.setEffectiveWeight(1);
      action.fadeIn(FADE).play();
      Object.values(actions).forEach((a) => {
        if (a && a !== action && a.isRunning()) a.fadeOut(FADE);
      });
      current = action;
    };

    const onFinished = (e) => {
      if (e.action !== current || index >= names.length - 1) return;
      index += 1;
      play();
    };

    mixer.addEventListener("finished", onFinished);
    play();
    return () => mixer.removeEventListener("finished", onFinished);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequenceKey, actions, mixer]);

  // ---- Head / body follow ----------------------------------------------------
  const body = useRef(null);
  const look = useRef({ yaw: 0, pitch: 0 });
  const tmp = useMemo(() => ({ euler: new THREE.Euler(0, 0, 0, "YXZ"), quat: new THREE.Quaternion() }), []);

  // Before the mixer runs: restore the rest pose so offsets never accumulate.
  useFrame(() => {
    if (head && headRest) head.quaternion.copy(headRest);
  }, -1);

  // After the mixer (useAnimations subscribed first): add the look offset.
  useFrame((_, dt) => {
    const targetYaw = followMouse ? THREE.MathUtils.clamp(mouse.x * 0.7, -0.6, 0.6) : 0;
    const targetPitch = (followMouse ? THREE.MathUtils.clamp(-mouse.y * 0.35, -0.3, 0.3) : 0) + headPitch;
    look.current.yaw = THREE.MathUtils.damp(look.current.yaw, targetYaw, 5, dt);
    look.current.pitch = THREE.MathUtils.damp(look.current.pitch, targetPitch, 5, dt);

    if (head) {
      tmp.euler.set(look.current.pitch, look.current.yaw, 0);
      tmp.quat.setFromEuler(tmp.euler);
      head.quaternion.multiply(tmp.quat);
    }
    if (body.current) {
      const bodyYaw = followMouse ? mouse.x * 0.22 : 0;
      body.current.rotation.y = THREE.MathUtils.damp(body.current.rotation.y, bodyYaw, 3, dt);
    }
  });

  return (
    <group {...props}>
      <group ref={body}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL, false, true);
