"use client";

import { useCallback, useRef, useState } from "react";
import gsap from "gsap";
import CrowdCanvas from "@/components/CrowdCanvas";
import HelloSplash from "@/components/HelloSplash";
import MacDesktop from "@/components/MacDesktop";
import "./mac-desktop.css";

export default function Home() {
  const [phase, setPhase] = useState<"splash" | "desktop">("splash");
  const splashRef = useRef<HTMLDivElement>(null);
  const leavingRef = useRef(false);

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
      <MacDesktop />

      {phase === "splash" ? (
        <div
          ref={splashRef}
          className="splash-stage"
          onClick={goToDesktop}
          role="presentation"
        >
          <HelloSplash onComplete={onHelloComplete} />
          <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
        </div>
      ) : null}
    </main>
  );
}
