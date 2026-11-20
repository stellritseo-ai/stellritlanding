import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks whether an element is near/inside the viewport AND the page tab is visible.
 * Uses `IntersectionObserver` plus `contentvisibilityautostatechange` (when the element
 * or an ancestor uses `content-visibility: auto`) and `visibilitychange` so off-screen
 * or backgrounded animations, canvases, and videos consume zero CPU/GPU.
 */
export function useInViewActive(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "200px"
): boolean {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onVisibilityChange = () => {
      setTabVisible(document.visibilityState !== "hidden");
    };
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const el = ref.current;
    if (!el) {
      return () => {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { rootMargin }
    );
    observer.observe(el);

    // Also listen for contentvisibilityautostatechange on the element or nearest ancestor
    const onCvState = (e: Event) => {
      const skipped = (e as Event & { skipped?: boolean }).skipped;
      if (typeof skipped === "boolean" && e.target instanceof Node && e.target.contains(el)) {
        if (skipped) setInView(false);
      }
    };
    document.addEventListener("contentvisibilityautostatechange", onCvState, { capture: true });

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("contentvisibilityautostatechange", onCvState, { capture: true });
    };
  }, [ref, rootMargin]);

  return inView && tabVisible;
}

