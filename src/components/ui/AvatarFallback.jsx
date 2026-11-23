import { useState } from "react";
import { profile } from "../../data/profile";
import { asset } from "../../lib/device";

/**
 * Shown instead of a 3D scene when WebGL is unavailable / the device is low-end.
 * Uses the pre-rendered avatar PNG, falling back to the photo in /public.
 */
export default function AvatarFallback({ className = "", pose = "hero" }) {
  const [src, setSrc] = useState(asset(profile.avatar.fallbackImage));
  const isPhoto = src.endsWith(".jpg");
  return (
    <div className={`flex h-full w-full items-end justify-center ${className}`}>
      <img
        src={src}
        onError={() => setSrc(asset("Me.jpg"))}
        alt=""
        loading={pose === "hero" ? "eager" : "lazy"}
        className={`max-h-[88%] w-auto object-contain ${isPhoto ? "max-w-[78%] object-cover grayscale contrast-125" : ""}`}
      />
    </div>
  );
}
