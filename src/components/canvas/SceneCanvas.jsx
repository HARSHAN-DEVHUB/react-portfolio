import { Component, Suspense, useEffect, useState } from "react";
import { QualityContext } from "./quality";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useInView } from "../../hooks/useInView";


class CanvasBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.warn("3D scene failed, showing fallback:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}

/**
 * Compiles every shader in the scene off the main thread (KHR_parallel_shader_compile)
 * before the first frame is drawn, so a scene scrolling into view never freezes.
 */
function Warmup({ onReady }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let alive = true;
    const done = () => alive && onReady();
    if (gl.compileAsync) gl.compileAsync(scene, camera).then(done, done);
    else done();
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, onReady]);
  return null;
}

/**
 * Shared R3F canvas:
 *  - mounts only when its container approaches the viewport (lazy)
 *  - pre-compiles its shaders before drawing the first frame
 *  - stops rendering (frameloop "never") while offscreen
 *  - PerformanceMonitor lowers DPR and quality on slow devices
 *  - falls back to `fallback` if WebGL throws
 */
export default function SceneCanvas({
  children,
  className = "",
  camera,
  orthographic = false,
  maxDpr = 1.5,
  fallback = null,
  interactive = false,
  rootMargin = "90% 0px", // start preparing about a screen before it is visible
  style,
  gl,
}) {
  const [ref, inView, entered] = useInView({ rootMargin });
  const [dpr, setDpr] = useState(maxDpr);
  const [quality, setQuality] = useState("high");
  const [ready, setReady] = useState(false);
  const [markReady] = useState(() => () => setReady(true));

  return (
    <div
      ref={ref}
      className={className}
      style={{ pointerEvents: interactive ? "auto" : "none", ...style }}
      aria-hidden="true"
    >
      {entered && (
        <CanvasBoundary fallback={fallback}>
          <Canvas
            frameloop={inView && ready ? "always" : "never"}
            // R3F sets pointer-events:auto on its own wrapper; keep decorative scenes click-through
            style={{ pointerEvents: interactive ? "auto" : "none" }}
            dpr={[1, dpr]}
            camera={camera}
            orthographic={orthographic}
            flat
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance", ...gl }}
          >
            <PerformanceMonitor
              flipflops={3}
              onDecline={() => {
                setDpr(1);
                setQuality("low");
              }}
              onIncline={() => setDpr(maxDpr)}
              onFallback={() => {
                setDpr(1);
                setQuality("low");
              }}
            >
              <QualityContext.Provider value={quality}>
                <Suspense fallback={null}>
                  {children}
                  <Warmup onReady={markReady} />
                </Suspense>
              </QualityContext.Provider>
            </PerformanceMonitor>
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
