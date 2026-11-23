import * as THREE from "three";
import { theme } from "../../config/theme";

/**
 * Matte clay material with a soft fresnel rim light in the accent colour.
 * It's a MeshStandardMaterial with a few lines injected into the shader,
 * so it still receives normal scene lighting and environment light.
 */
export function makeClay({
  color = theme.clay,
  roughness = 0.94,
  rim = theme.accent,
  rimStrength = 0.2,
  rimPower = 2.8,
  map = null,
  emissive = null,
  emissiveIntensity = 1,
  flatShading = false,
} = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
    map,
    flatShading,
  });
  if (emissive) {
    material.emissive = new THREE.Color(emissive);
    material.emissiveIntensity = emissiveIntensity;
  }

  const uniforms = {
    uRimColor: { value: new THREE.Color(rim) },
    uRimStrength: { value: rimStrength },
    uRimPower: { value: rimPower },
  };

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
uniform vec3 uRimColor;
uniform float uRimStrength;
uniform float uRimPower;`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
{
  vec3 viewDir = normalize(vViewPosition);
  float rimTerm = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), uRimPower);
  totalEmissiveRadiance += uRimColor * rimTerm * uRimStrength;
}`
      );
  };
  material.customProgramCacheKey = () => "clay-rim-v1";
  material.userData.rim = uniforms;
  return material;
}

/** Resolves a palette tone name to a colour. */
export const toneToColor = (tone) =>
  ({
    accent: theme.accent,
    accent2: theme.accentSecondary,
    ink: theme.clay,
    muted: theme.textMuted,
    dark: theme.clayDark,
    clay: theme.clay,
  })[tone] || tone;
