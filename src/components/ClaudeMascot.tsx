"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type ClaudeMascotProps = {
  onClick?: () => void;
};

/**
 * Walking Claude — Codrops / Ayotomiwa Wale-Durojaye.
 * Walks left→right along a path just above the dock.
 */
export default function ClaudeMascot({ onClick }: ClaudeMascotProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const leftHandRef = useRef<SVGRectElement>(null);
  const rightHandRef = useRef<SVGRectElement>(null);
  const leg1Ref = useRef<SVGRectElement>(null);
  const leg2Ref = useRef<SVGRectElement>(null);
  const leg3Ref = useRef<SVGRectElement>(null);
  const leg4Ref = useRef<SVGRectElement>(null);

  // Pin strip just above the dock and match dock width/position.
  useEffect(() => {
    const root = rootRef.current;
    const dock = document.querySelector(".mac-dock") as HTMLElement | null;
    if (!root || !dock) return;

    const place = () => {
      const rect = dock.getBoundingClientRect();
      const dockBottom = window.innerHeight - rect.bottom;
      const gap = 10;
      root.style.left = `${Math.round(rect.left)}px`;
      root.style.right = "auto";
      root.style.width = `${Math.round(rect.width)}px`;
      root.style.bottom = `${Math.round(dockBottom + rect.height + gap)}px`;
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(dock);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    const body = bodyRef.current;
    const eyes = eyesRef.current;
    const leftHand = leftHandRef.current;
    const rightHand = rightHandRef.current;
    const legs = [
      leg1Ref.current,
      leg2Ref.current,
      leg3Ref.current,
      leg4Ref.current,
    ];
    const stage = stageRef.current;
    if (!group || !body || !eyes || !leftHand || !rightHand || !stage) return;
    if (legs.some((l) => !l)) return;

    const svg = stage.querySelector("svg");
    const svgW = svg?.clientWidth || 96;

    const build = () => {
      const stageW = stage.getBoundingClientRect().width;
      // Walk across the dock strip.
      const walkDist = Math.max(120, stageW - svgW - 8);
      const jumpDist = walkDist * 0.4;
      const walkBack = walkDist - jumpDist;

      gsap.set(group, { x: 0, y: 0 });
      gsap.set(eyes, { x: 0, y: 0 });
      gsap.set(body, { x: 0, y: 0, rotation: 0 });
      gsap.set([leftHand, rightHand], { y: 0 });
      gsap.set(legs, { rotation: 0, scaleY: 1 });

      gsap.set(leg1Ref.current, { svgOrigin: "16.5 86" });
      gsap.set(leg2Ref.current, { svgOrigin: "37.5 86" });
      gsap.set(leg3Ref.current, { svgOrigin: "69.5 86" });
      gsap.set(leg4Ref.current, { svgOrigin: "90.5 86" });

      const tl = gsap.timeline({ repeat: -1 });

      tl.to(eyes, { x: -3, duration: 0.4, ease: "power2.out" })
        .to(
          body,
          {
            rotation: -3,
            x: -3,
            y: -5,
            svgOrigin: "53 65",
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          legs,
          {
            rotation: (i) => [-7, -8, -8, -9][i]!,
            scaleY: (i) => [1.35, 1.3, 1.2, 1.15][i]!,
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        );

      tl.to(eyes, { x: 4, y: 12, duration: 0.4, ease: "power2.out", delay: 1.5 })
        .to(
          body,
          {
            rotation: 3,
            x: 3,
            y: -5,
            svgOrigin: "53 65",
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          legs,
          {
            rotation: (i) => [9, 8, 8, 7][i]!,
            scaleY: (i) => [1.15, 1.2, 1.3, 1.35][i]!,
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        );

      tl.to(eyes, { x: 0, y: 23, duration: 0.2, ease: "power2.out", delay: 1.2 })
        .to(body, { rotation: 0, x: 0, y: 0, duration: 0.2, ease: "power2.out" }, "<")
        .to(legs, { rotation: 0, scaleY: 1, duration: 0.2, ease: "power2.out" }, "<")
        .to(group, { y: -18, duration: 0.18, ease: "power2.out" })
        .to(group, { y: 0, duration: 0.15, ease: "power3.in" });

      tl.call(() => {
        gsap.set(leg1Ref.current, { svgOrigin: "16.5 60" });
        gsap.set(leg2Ref.current, { svgOrigin: "37.5 60" });
        gsap.set(leg3Ref.current, { svgOrigin: "69.5 60" });
        gsap.set(leg4Ref.current, { svgOrigin: "90.5 60" });
      }).addLabel("walk");

      // Scale walk duration with distance so pace stays similar.
      const walkDur = Math.max(2.2, walkBack / 90);
      const steps = Math.max(20, Math.round(walkDur / 0.1));

      tl.to(group, { x: walkBack, duration: walkDur, ease: "linear" }, "walk");
      tl.to(eyes, { x: 4, y: 0, duration: 0.2, ease: "power2.out" }, "walk");

      for (let step = 0; step < steps; step += 1) {
        const t = `walk+=${(step * 0.1).toFixed(1)}`;
        const first =
          step % 2 === 0
            ? [leg1Ref.current, leg3Ref.current]
            : [leg2Ref.current, leg4Ref.current];
        tl.to(first, { scaleY: 0.45, duration: 0.1, ease: "power2.out" }, t).to(
          first,
          { scaleY: 1, duration: 0.1, ease: "power2.in" },
          `walk+=${(step * 0.1 + 0.1).toFixed(1)}`,
        );
      }

      tl.to(legs, { scaleY: 1, duration: 0.08, ease: "power2.in" }, `walk+=${(walkDur - 0.1).toFixed(1)}`);

      tl.call(() => {
        gsap.set(leg1Ref.current, { svgOrigin: "16.5 86" });
        gsap.set(leg2Ref.current, { svgOrigin: "37.5 86" });
        gsap.set(leg3Ref.current, { svgOrigin: "69.5 86" });
        gsap.set(leg4Ref.current, { svgOrigin: "90.5 86" });
      });

      tl.to(eyes, { y: 12, duration: 0.4, ease: "power2.out", delay: 0.3 })
        .to(
          body,
          {
            rotation: 3,
            x: 3,
            y: -5,
            svgOrigin: "53 65",
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        )
        .to(
          legs,
          {
            rotation: (i) => [9, 8, 8, 7][i]!,
            scaleY: (i) => [1.15, 1.2, 1.3, 1.35][i]!,
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        )
        .to(eyes, { y: 23, duration: 0.3, ease: "power2.out", delay: 0.6 })
        .to(eyes, { x: 4, y: 0, duration: 0.4, ease: "power2.out", delay: 1 })
        .to(body, { rotation: 0, x: 0, y: 0, duration: 0.4, ease: "power2.out" }, "<")
        .to(legs, { rotation: 0, scaleY: 1, duration: 0.4, ease: "power2.out" }, "<");

      const jumpDur = Math.max(0.7, jumpDist / 140);
      tl.to(body, { y: 8, duration: 0.1, ease: "power3.in", delay: 0.2 })
        .to([leftHand, rightHand], { y: 10, duration: 0.1, ease: "power3.in" }, "<")
        .addLabel("jump")
        .to(group, { x: `+=${jumpDist}`, duration: jumpDur, ease: "power1.inOut" }, "jump")
        .to(group, { y: -90, duration: jumpDur * 0.5, ease: "sine.out" }, "jump")
        .to(body, { y: 0, duration: jumpDur * 0.5, ease: "sine.out" }, "jump")
        .to([leftHand, rightHand], { y: -12, duration: jumpDur * 0.5, ease: "sine.out" }, "jump")
        .to(group, { y: 0, duration: 0.2, ease: "power3.in" }, `jump+=${(jumpDur * 0.7).toFixed(2)}`)
        .to(
          [leftHand, rightHand],
          { y: 0, duration: 0.2, ease: "power3.in" },
          `jump+=${(jumpDur * 0.7).toFixed(2)}`,
        )
        .to([leftHand, rightHand], { y: 6, duration: 0.05, ease: "power2.in" })
        .to([leftHand, rightHand], { y: 0, duration: 0.08, ease: "power2.out" });

      tl.call(
        () => {
          gsap.set(group, { x: 0 });
          gsap.set(eyes, { x: 0, y: 0 });
        },
        undefined,
        "+=1",
      );

      return tl;
    };

    let ctx = gsap.context(() => {
      build();
    }, stageRef);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ctx.revert();
        ctx = gsap.context(() => {
          build();
        }, stageRef);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="claude-mascot">
      <button
        type="button"
        className="claude-mascot__hit"
        aria-label="Claude mascot"
        data-ui-sound="click"
        onClick={onClick}
      >
        <div ref={stageRef} className="claude-mascot__stage">
          <svg
            viewBox="0 0 107 86"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="claude-mascot__svg"
            overflow="visible"
          >
            <defs>
              <clipPath id="claude-ground-clip">
                <rect x="-20" y="-50" width="160" height="136" />
              </clipPath>
            </defs>
            <g ref={groupRef}>
              <g className="claude-mascot__chat" transform="translate(98 -52)">
                <rect x="0" y="0" width="148" height="46" fill="#DD775B" />
                <rect x="6" y="6" width="136" height="34" fill="#FFF4EC" />
                <rect x="10" y="46" width="10" height="10" fill="#DD775B" />
                <rect x="0" y="46" width="10" height="10" fill="#DD775B" />
                <text
                  x="74"
                  y="28"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="claude-mascot__chat-text"
                >
                  hello from shivam
                </text>
              </g>
              <g clipPath="url(#claude-ground-clip)">
                <rect ref={leg4Ref} x="85" y="60" width="11" height="26" fill="#DD775B" />
                <rect ref={leg3Ref} x="64" y="60" width="11" height="26" fill="#DD775B" />
                <rect ref={leg2Ref} x="32" y="60" width="11" height="26" fill="#DD775B" />
                <rect ref={leg1Ref} x="11" y="60" width="11" height="26" fill="#DD775B" />
              </g>
              <g ref={bodyRef}>
                <rect x="11" width="85" height="65" fill="#DD775B" />
                <rect ref={rightHandRef} x="85" y="21" width="22" height="23" fill="#DD775B" />
                <rect ref={leftHandRef} y="21" width="22" height="23" fill="#DD775B" />
                <g ref={eyesRef}>
                  <rect x="75" y="11" width="11" height="11" fill="black" />
                  <rect x="21" y="11" width="11" height="11" fill="black" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}
