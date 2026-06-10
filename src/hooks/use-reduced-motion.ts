import { useEffect, useState } from "react";

/**
 * Returns true when the user prefers reduced motion OR the device looks
 * low-powered (few logical cores or low device memory). SSR-safe: defaults
 * to false on the server and re-evaluates on mount.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    const lowEnd = cores <= 2 && memory <= 2;

    const update = () => setReduced(mq.matches || lowEnd);
    update();

    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}
