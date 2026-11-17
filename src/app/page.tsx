"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HelloSplash from "@/components/HelloSplash";
import MacDesktop from "@/components/MacDesktop";
import "./mac-desktop.css";

function shouldSkipSplash() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("skip");
}

export default function Home() {
  const [phase, setPhase] = useState<"splash" | "desktop">("splash");
  const splashRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);

  useEffect(() => {
    if (shouldSkipSplash()) {
      leavingRef.current = true;
      setPhase("desktop");
    }
  }, []);

  const goToDesktop = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;

    const root = splashRef.current;
    if (!root) {
      setPhase("desktop");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase("desktop");
      return;
    }

    gsap.to(root, {
      opacity: 0,
      duration: 0.85,
      ease: "power2.inOut",
      onComplete: () => setPhase("desktop"),
    });
  }, []);

  const onHelloComplete = useCallback(() => {
    window.setTimeout(goToDesktop, 1200);
  }, [goToDesktop]);

  return (
    <main className="home-root">
      {phase === "desktop" ? <MacDesktop /> : null}

      {phase === "splash" ? (
        <div
          ref={splashRef}
          className="splash-stage"
          onClick={goToDesktop}
          role="presentation"
        >
          <HelloSplash onComplete={onHelloComplete} />
        </div>
      ) : null}
    </main>
  );
}
