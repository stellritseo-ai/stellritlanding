import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useState } from "react";

/**
 * Calm, scroll-reactive atmosphere — 100% CSS Scroll-Driven Animation version.
 *
 * Preserves all 5 exact base gradients and all 6 blob color stops while running
 * entirely on the GPU compositor via `animation-timeline: scroll(root)` — zero
 * JavaScript scroll listeners and zero Framer Motion ticks during scroll.
 */

const BASES = [
  "radial-gradient(120% 100% at 50% 35%, #2a0a5a 0%, #180230 55%, #0d0220 100%)",
  "radial-gradient(125% 105% at 55% 40%, #2e1670 0%, #170a3a 55%, #0a0520 100%)",
  "radial-gradient(130% 110% at 45% 50%, #1a2a78 0%, #0e1640 55%, #060a20 100%)",
  "radial-gradient(135% 115% at 50% 55%, #0e1f48 0%, #07112c 60%, #03060f 100%)",
  "radial-gradient(130% 110% at 50% 45%, #3a0e80 0%, #1a0440 55%, #0a0220 100%)",
];

const BLOBS_A = ["#6a22b8", "#264fa8", "#7820c8"];
const BLOBS_B = ["#3a0a6a", "#0f2880", "#5018b8"];

export default function ScrollBackground() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (reduced || isMobile) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        style={{ contain: "strict" }}
      >
        <div className="absolute inset-0" style={{ background: BASES[0] }} />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    );
  }
  return <FullScrollBackground />;
}

function FullScrollBackground() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const playState = paused ? "paused" : "running";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict", isolation: "isolate" }}
    >
      {/* All 5 exact base color stops — crossfaded 100% on GPU compositor via scroll(root) */}
      {BASES.map((bg, i) => (
        <div
          key={i}
          className={`absolute inset-0 sb-base-${i}`}
          style={{ background: bg }}
        />
      ))}

      {/* Two slow drifting blobs — isolated mix-blend-screen, compositor-only scroll crossfade */}
      <div className="absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh] mix-blend-screen">
        <div
          className="relative h-full w-full sb-drift-a"
          style={{ animationPlayState: playState }}
        >
          {BLOBS_A.map((c, i) => (
            <div
              key={i}
              className={`absolute inset-0 rounded-full sb-blob-${i}`}
              style={{
                background: `radial-gradient(circle at center, ${c} 0%, transparent 75%)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="absolute top-1/4 -right-1/4 h-[80vh] w-[80vh] mix-blend-screen">
        <div
          className="relative h-full w-full sb-drift-b"
          style={{ animationPlayState: playState }}
        >
          {BLOBS_B.map((c, i) => (
            <div
              key={i}
              className={`absolute inset-0 rounded-full sb-blob-${i}`}
              style={{
                background: `radial-gradient(circle at center, ${c} 0%, transparent 75%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Subtle bottom haze */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />

      <style>{`
        /* Progressive enhancement fallback for browsers without scroll-driven animations */
        .sb-base-0 { opacity: 1; }
        .sb-base-1, .sb-base-2, .sb-base-3, .sb-base-4 { opacity: 0; }
        .sb-blob-0 { opacity: 1; }
        .sb-blob-1, .sb-blob-2 { opacity: 0; }

        @supports ((animation-timeline: scroll()) and (animation-range: 0% 100%)) {
          @keyframes sb-base-0-kf { 0% { opacity: 1; } 25% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes sb-base-1-kf { 0% { opacity: 0; } 25% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes sb-base-2-kf { 0% { opacity: 0; } 25% { opacity: 0; } 50% { opacity: 1; } 75% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes sb-base-3-kf { 0% { opacity: 0; } 50% { opacity: 0; } 75% { opacity: 1; } 100% { opacity: 0; } }
          @keyframes sb-base-4-kf { 0% { opacity: 0; } 75% { opacity: 0; } 100% { opacity: 1; } }

          @keyframes sb-blob-0-kf { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 0; } }
          @keyframes sb-blob-1-kf { 0% { opacity: 0; } 50% { opacity: 1; } 100% { opacity: 0; } }
          @keyframes sb-blob-2-kf { 0% { opacity: 0; } 50% { opacity: 0; } 100% { opacity: 1; } }

          .sb-base-0 { animation: sb-base-0-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
          .sb-base-1 { animation: sb-base-1-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
          .sb-base-2 { animation: sb-base-2-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
          .sb-base-3 { animation: sb-base-3-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
          .sb-base-4 { animation: sb-base-4-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }

          .sb-blob-0 { animation: sb-blob-0-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
          .sb-blob-1 { animation: sb-blob-1-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
          .sb-blob-2 { animation: sb-blob-2-kf linear both; animation-timeline: scroll(root); animation-range: 0% 100%; }
        }

        @keyframes sb-drift-a {
          0%, 100% { transform: translate3d(-4%, -3%, 0); }
          50% { transform: translate3d(6%, 5%, 0); }
        }
        @keyframes sb-drift-b {
          0%, 100% { transform: translate3d(3%, 3%, 0); }
          50% { transform: translate3d(-5%, -3%, 0); }
        }
        .sb-drift-a {
          @media (prefers-reduced-motion: no-preference) {
            animation: sb-drift-a 50s ease-in-out infinite;
          }
        }
        .sb-drift-b {
          @media (prefers-reduced-motion: no-preference) {
            animation: sb-drift-b 60s ease-in-out infinite;
          }
        }
      `}</style>
    </div>
  );
}
