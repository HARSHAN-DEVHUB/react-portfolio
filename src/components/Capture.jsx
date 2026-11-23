import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { profile } from "../data/profile";
import { theme } from "../config/theme";
import Avatar from "./canvas/Avatar";
import { ClayLights } from "./canvas/HeroScene";
import { Platform } from "./canvas/props";
import { projects } from "../data/projects";
import { makeCover } from "../lib/cover";

/**
 * DEV-ONLY render targets used to generate static images with headless Chrome:
 *   /?capture=avatar → transparent avatar render (WebGL fallback PNG)
 *   /?capture=og     → 1200×630 Open Graph card
 * See README → "Regenerating images".
 */
const params = new URLSearchParams(window.location.search);
const CAM_Y = Number(params.get("y") ?? 1.0); // dev: ?capture=avatar&d=2&y=1.9 for a face close-up
const CAM_YAW = Number(params.get("yaw") ?? -0.25);
const CLIP = params.get("clip") || "wave";

function AvatarCanvas({ withPlatform = true, distance = 5.4 }) {
  const d = Number(params.get("d") ?? distance);
  return (
    <Canvas flat dpr={2} camera={{ position: [0, CAM_Y + 0.35, d], fov: 30 }} gl={{ alpha: true, preserveDrawingBuffer: true }}>
      <Suspense fallback={null}>
        <ClayLights />
        <group position={[0, -0.05, 0]} rotation-y={CAM_YAW}>
          {withPlatform && <Platform radius={0.95} />}
          <Avatar sequence={[CLIP]} sequenceKey="capture" />
          <ContactShadows position={[0, -0.16, 0]} opacity={0.5} scale={5} blur={2.6} far={1.6} color="#000000" />
        </group>
        <LookAt />
      </Suspense>
    </Canvas>
  );
}

function LookAt() {
  const camera = useThree((s) => s.camera);
  useEffect(() => camera.lookAt(0, CAM_Y, 0), [camera]);
  return null;
}

export default function Capture({ mode }) {
  // /?capture=covers → renders every project cover and exposes them on window.__covers
  useEffect(() => {
    if (mode !== "covers") return;
    Promise.all(projects.map((p, i) => makeCover({ ...p, image: undefined }, i))).then((urls) => {
      window.__covers = projects.map((p, i) => ({ slug: p.slug, url: urls[i] }));
    });
  }, [mode]);

  useEffect(() => {
    if (mode === "covers") return <p className="label p-8">Generating covers…</p>;

  if (mode === "avatar") {
      document.documentElement.style.background = "transparent";
      document.body.style.background = "transparent";
    }
  }, [mode]);

  if (mode === "covers") return <p className="label p-8">Generating covers…</p>;

  if (mode === "avatar") {
    return (
      <div style={{ position: "fixed", inset: 0 }}>
        <AvatarCanvas distance={7.6} />
      </div>
    );
  }

  // Open Graph card
  return (
    <div
      className="grid-lines relative flex overflow-hidden bg-bg"
      style={{ width: 1200, height: 630, ["--gutter"]: "56px" }}
    >
      <div className="relative z-10 flex w-[640px] flex-col justify-between py-14 pl-14">
        <div className="flex items-center gap-3">
          <span className="block size-3 bg-accent" />
          <span className="label !text-ink">{profile.siteUrl.replace("https://", "")}</span>
        </div>
        <div>
          <p className="font-display text-[150px] font-semibold leading-[0.82] tracking-[-0.045em] text-ink">
            {profile.shortName}
          </p>
          <p className="mt-6 max-w-[30rem] font-display text-[34px] font-medium leading-[1.05] tracking-[-0.02em] text-muted">
            {profile.title}
          </p>
        </div>
        <p className="label">
          {profile.location} — {profile.availability}
        </p>
      </div>
      <div className="absolute inset-y-0 right-0 w-[620px]">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(closest-side at 50% 55%, ${theme.surface}, ${theme.background})` }}
        />
        <AvatarCanvas distance={6.9} />
      </div>
    </div>
  );
}
