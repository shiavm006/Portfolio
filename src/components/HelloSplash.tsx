"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type HelloSplashProps = {
  onComplete?: () => void;
};

/**
 * Official Apple "hello" lettering paths
 * Source: https://www.figma.com/community/file/1414773009964314315/official-apple-hello-lettering
 */
const PATH_H =
  "M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356";

const PATH_ELLO =
  "M55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C184.197 191.348 219.189 173.523 237.097 145.915C243.198 136.509 245.68 128.073 245.928 119.884C246.176 104.996 237.739 93.8296 222.851 93.8296C203.992 93.8296 189.6 115.17 189.6 142.465C189.6 171.745 205.481 192.341 239.208 192.341C285.066 192.341 335.86 137.292 359.199 75.8585C365.788 58.513 368.26 42.4065 368.26 31.1512C368.26 17.8057 364.042 7.55823 352.131 7.55823C340.469 7.55823 332.777 16.6141 325.829 30.9129C317.688 47.4967 311.667 71.4162 309.203 98.4549C303 166.301 316.896 191.348 349.936 191.348C390 191.348 434.542 135.534 457.286 75.6686C463.803 58.513 466.275 42.4065 466.275 31.1512C466.275 17.8057 462.057 7.55823 450.146 7.55823C438.484 7.55823 430.792 16.6141 423.844 30.9129C415.703 47.4967 409.682 71.4162 407.218 98.4549C401.015 166.301 414.911 191.348 444.416 191.348C473.874 191.348 489.877 165.67 499.471 138.402C508.955 111.447 520.618 94.8221 544.935 94.8221C565.035 94.8221 580.916 109.71 580.916 137.75C580.916 168.768 560.792 192.093 535.362 192.341C512.984 192.589 498.285 174.475 499.774 147.179C501.511 116.907 519.873 94.8221 543.943 94.8221C557.839 94.8221 569.51 100.999 578.682 107.725C603.549 125.866 622.709 114.656 630.047 96.7186";

/** Flag-waving Claude beside hello */
function SplashFlagClaude() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let ctx: gsap.Context | null = null;

    fetch("/claude-mascot/flag.svg")
      .then((r) => r.text())
      .then((text) => {
        if (cancelled || !hostRef.current) return;
        host.innerHTML = text;
        const svg = host.querySelector("svg");
        if (!svg) return;
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");

        const bodyGroup = svg.querySelector(":scope > g") as SVGGElement | null;
        const leftHand = svg.querySelector("#left-hand") as SVGRectElement | null;
        const hand =
          (svg.querySelector("#right-hand")?.parentElement as SVGGElement | null) ??
          null;
        const flagFrames = hand
          ? ([...hand.children].filter((n) => n.tagName.toLowerCase() === "g") as SVGGElement[])
          : [];

        // Hide every flag frame before GSAP starts (prevents stacked flash).
        flagFrames.forEach((el, i) => {
          el.style.display = i === 0 ? "inline" : "none";
        });

        const swayX = [0, 0, -5, -5, 0, 4, 4, 4, 0, 0, -5, -5];
        const handExtraX = [0, -6, -12, -14, -8, -2, 0, 0, -4, -10, -16, -18];
        const leftHandY = [0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 4, 4];
        const first = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const loop = [3, 4, 5, 6, 7, 8, 9, 10, 11];

        const applyFrame = (tl: gsap.core.Timeline, frame: number, time: number) => {
          if (bodyGroup) tl.set(bodyGroup, { x: swayX[frame] }, time);
          if (hand) tl.set(hand, { x: handExtraX[frame] }, time);
          if (leftHand) tl.set(leftHand, { attr: { y: 90 + leftHandY[frame]! } }, time);
          flagFrames.forEach((el, i) => {
            tl.set(el, { display: i === frame ? "inline" : "none" }, time);
          });
        };

        ctx = gsap.context(() => {
          const intro = gsap.timeline();
          first.forEach((frame, i) => applyFrame(intro, frame, 0.07 * i));
          const loopTl = gsap.timeline({ repeat: -1 });
          loop.forEach((frame, i) => applyFrame(loopTl, frame, 0.07 * i));
          loopTl.set({}, {}, 0.07 * loop.length);
          intro.add(loopTl, 0.07 * first.length);

          gsap.fromTo(
            host,
            { opacity: 0, y: 12, scale: 0.92 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out", delay: 0.45 },
          );
        }, host);
      })
      .catch(() => {
        if (!cancelled && hostRef.current) host.innerHTML = "";
      });

    return () => {
      cancelled = true;
      ctx?.revert();
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="hello-splash__claude"
      aria-hidden="true"
    />
  );
}

export default function HelloSplash({ onComplete }: HelloSplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const paths = Array.from(svg.querySelectorAll("path"));
    if (paths.length === 0) return;

    const finish = () => {
      onCompleteRef.current?.();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      paths.forEach((p) => {
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
        p.style.opacity = "1";
      });
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: 0,
        });
      });

      const tl = gsap.timeline({ onComplete: finish });

      tl.to({}, { duration: 0.4 });

      tl.to(paths[0], {
        opacity: 1,
        duration: 0.25,
        ease: "power1.out",
      });
      tl.to(
        paths[0],
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power1.inOut",
        },
        "<",
      );

      tl.to(
        paths[1],
        {
          opacity: 1,
          duration: 0.35,
          ease: "power1.out",
        },
        "-=0.1",
      );
      tl.to(
        paths[1],
        {
          strokeDashoffset: 0,
          duration: 2.8,
          ease: "power1.inOut",
        },
        "<",
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="hello-splash"
      role="img"
      aria-label="hello"
    >
      <div className="hello-splash__row">
        <div className="hello-splash__stack">
          <svg
            ref={svgRef}
            className="hello-splash__svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 638 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="14.8883"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={PATH_H} />
            <path d={PATH_ELLO} />
          </svg>
        </div>
        <SplashFlagClaude />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/chess-king.png"
        alt=""
        aria-hidden="true"
        className="hello-splash__chess"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/headphones.png"
        alt=""
        aria-hidden="true"
        className="hello-splash__headphones"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/bmw.png"
        alt=""
        aria-hidden="true"
        className="hello-splash__car"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hikers.png"
        alt=""
        aria-hidden="true"
        className="hello-splash__hikers"
      />
    </div>
  );
}
