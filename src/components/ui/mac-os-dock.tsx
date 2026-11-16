"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

export interface DockApp {
  id: string;
  name: string;
  icon: string;
  /** Renders the macOS dock divider instead of an app icon */
  separator?: boolean;
}

interface MacOSDockProps {
  apps: DockApp[];
  onAppClick: (appId: string) => void;
  openApps?: string[];
  className?: string;
}

type DockConfig = {
  baseIconSize: number;
  maxScale: number;
  effectWidth: number;
};

const DEFAULT_CONFIG: DockConfig = {
  baseIconSize: 64,
  maxScale: 1.6,
  effectWidth: 240,
};

function getResponsiveConfig(): DockConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;

  const smallerDimension = Math.min(window.innerWidth, window.innerHeight);

  if (smallerDimension < 480) {
    return {
      baseIconSize: Math.max(40, smallerDimension * 0.08),
      maxScale: 1.4,
      effectWidth: smallerDimension * 0.4,
    };
  }
  if (smallerDimension < 768) {
    return {
      baseIconSize: Math.max(48, smallerDimension * 0.07),
      maxScale: 1.5,
      effectWidth: smallerDimension * 0.35,
    };
  }
  if (smallerDimension < 1024) {
    return {
      baseIconSize: Math.max(56, smallerDimension * 0.06),
      maxScale: 1.6,
      effectWidth: smallerDimension * 0.3,
    };
  }
  return {
    baseIconSize: Math.max(64, Math.min(80, smallerDimension * 0.05)),
    maxScale: 1.8,
    effectWidth: 300,
  };
}

function getItemWidth(
  apps: DockApp[],
  index: number,
  scale: number,
  baseIconSize: number,
  separatorWidth: number,
) {
  return apps[index]?.separator ? separatorWidth : baseIconSize * scale;
}

function getRestPositions(
  apps: DockApp[],
  baseIconSize: number,
  separatorWidth: number,
  baseSpacing: number,
) {
  let currentX = 0;
  return apps.map((app) => {
    const width = app.separator ? separatorWidth : baseIconSize;
    const centerX = currentX + width / 2;
    currentX += width + baseSpacing;
    return centerX;
  });
}

/**
 * Smooth macOS-style dock.
 * Magnify runs on rAF + direct DOM writes (no React re-render per frame).
 */
const MacOSDock: React.FC<MacOSDockProps> = ({
  apps,
  onAppClick,
  openApps = [],
  className = "",
}) => {
  const [config, setConfig] = useState<DockConfig>(DEFAULT_CONFIG);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);
  const separatorWidth = Math.max(10, baseIconSize * 0.18);
  const padding = Math.max(8, baseIconSize * 0.12);

  const restPositions = useMemo(
    () => getRestPositions(apps, baseIconSize, separatorWidth, baseSpacing),
    [apps, baseIconSize, separatorWidth, baseSpacing],
  );

  const restWidth = useMemo(() => {
    const last = restPositions[restPositions.length - 1] ?? 0;
    const lastW = apps[apps.length - 1]?.separator
      ? separatorWidth
      : baseIconSize;
    return last + lastW / 2;
  }, [apps, restPositions, separatorWidth, baseIconSize]);

  const dockRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mouseXRef = useRef<number | null>(null);
  const scalesRef = useRef<number[]>(apps.map(() => 1));
  const positionsRef = useRef<number[]>(restPositions);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);
  const configRef = useRef({
    apps,
    baseIconSize,
    maxScale,
    effectWidth,
    baseSpacing,
    separatorWidth,
    padding,
    minScale,
  });

  configRef.current = {
    apps,
    baseIconSize,
    maxScale,
    effectWidth,
    baseSpacing,
    separatorWidth,
    padding,
    minScale,
  };

  useEffect(() => {
    scalesRef.current = apps.map(() => 1);
    positionsRef.current = restPositions;
  }, [apps, restPositions]);

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paint = useCallback(() => {
    const {
      apps: list,
      baseIconSize: size,
      separatorWidth: sepW,
      padding: pad,
    } = configRef.current;

    const scales = scalesRef.current;
    const positions = positionsRef.current;

    let contentRight = 0;
    for (let i = 0; i < list.length; i += 1) {
      const el = iconRefs.current[i];
      if (!el) continue;

      const scale = scales[i] ?? 1;
      const pos = positions[i] ?? 0;
      const width = list[i]?.separator ? sepW : size * scale;
      const left = pos - width / 2;

      el.style.left = `${left}px`;
      el.style.width = `${width}px`;
      el.style.height = list[i]?.separator ? `${size}px` : `${width}px`;
      el.style.zIndex = String(Math.round(scale * 10));

      const img = imgRefs.current[i];
      if (img) {
        img.style.width = `${width}px`;
        img.style.height = `${width}px`;
        const shadowY = scale > 1.2 ? Math.max(2, size * 0.05) : Math.max(1, size * 0.03);
        const shadowBlur =
          scale > 1.2 ? Math.max(4, size * 0.1) : Math.max(2, size * 0.06);
        img.style.filter = `drop-shadow(0 ${shadowY}px ${shadowBlur}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`;
      }

      contentRight = Math.max(contentRight, pos + width / 2);
    }

    if (dockRef.current) {
      dockRef.current.style.width = `${contentRight + pad * 2}px`;
    }
    if (stageRef.current) {
      stageRef.current.style.width = `${contentRight}px`;
    }
  }, []);

  const tick = useCallback(() => {
    const {
      apps: list,
      baseIconSize: size,
      maxScale: max,
      effectWidth: band,
      baseSpacing: gap,
      separatorWidth: sepW,
      minScale: min,
    } = configRef.current;

    const mouseX = mouseXRef.current;
    const lerp = mouseX !== null ? 0.28 : 0.16;

    let restX = 0;
    const centers = list.map((app) => {
      const w = app.separator ? sepW : size;
      const center = restX + w / 2;
      restX += w + gap;
      return center;
    });

    // Target scales from cosine falloff around cursor
    const targets = list.map((app, index) => {
      if (app.separator || mouseX === null) return min;

      const center = centers[index] ?? 0;
      const minX = mouseX - band / 2;
      const maxX = mouseX + band / 2;
      if (center < minX || center > maxX) return min;

      const theta = ((center - minX) / band) * 2 * Math.PI;
      const capped = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const factor = (1 - Math.cos(capped)) / 2;
      return min + factor * (max - min);
    });

    let moved = false;
    const nextScales = targets.map((target, i) => {
      const cur = scalesRef.current[i] ?? target;
      const next = cur + (target - cur) * lerp;
      if (Math.abs(next - target) > 0.001) moved = true;
      return next;
    });
    scalesRef.current = nextScales;

    let currentX = 0;
    const nextPositions = nextScales.map((scale, index) => {
      const width = getItemWidth(list, index, scale, size, sepW);
      const centerX = currentX + width / 2;
      currentX += width + gap;
      return centerX;
    });
    positionsRef.current = nextPositions;

    paint();

    if (moved || mouseX !== null) {
      rafRef.current = requestAnimationFrame(tick);
      runningRef.current = true;
    } else {
      runningRef.current = false;
      rafRef.current = 0;
    }
  }, [paint]);

  const ensureLoop = useCallback(() => {
    if (runningRef.current) return;
    runningRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    // Initial paint + restart loop when layout config changes
    positionsRef.current = restPositions;
    scalesRef.current = apps.map(() => 1);
    paint();
    ensureLoop();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, [apps, restPositions, paint, ensureLoop]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    mouseXRef.current = e.clientX - rect.left - padding;
    ensureLoop();
  };

  const handleMouseLeave = () => {
    mouseXRef.current = null;
    ensureLoop();
  };

  const handleAppClick = (appId: string, index: number) => {
    if (apps[index]?.separator) return;

    const el = iconRefs.current[index];
    if (el) {
      const scale = scalesRef.current[index] ?? 1;
      const bounceHeight = scale > 1.3 ? -baseIconSize * 0.22 : -baseIconSize * 0.16;
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: bounceHeight,
          duration: 0.18,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
          transformOrigin: "bottom center",
          overwrite: true,
        },
      );
    }

    onAppClick(appId);
  };

  return (
    <div
      ref={dockRef}
      className={`backdrop-blur-md ${className}`}
      style={{
        width: `${restWidth + padding * 2}px`,
        background: "rgba(45, 45, 45, 0.75)",
        borderRadius: `${Math.max(12, baseIconSize * 0.4)}px`,
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow: `
          0 ${Math.max(4, baseIconSize * 0.1)}px ${Math.max(16, baseIconSize * 0.4)}px rgba(0, 0, 0, 0.4),
          0 ${Math.max(2, baseIconSize * 0.05)}px ${Math.max(8, baseIconSize * 0.2)}px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.15),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `,
        padding: `${padding}px`,
        willChange: "width",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={stageRef}
        className="relative"
        style={{
          height: `${baseIconSize}px`,
          width: `${restWidth}px`,
        }}
      >
        {apps.map((app, index) => {
          const position = restPositions[index] ?? 0;
          const scaledSize = app.separator ? separatorWidth : baseIconSize;

          if (app.separator) {
            const lineHeight = baseIconSize * 0.55;
            return (
              <div
                key={app.id}
                ref={(el) => {
                  iconRefs.current[index] = el;
                }}
                className="absolute flex items-center justify-center pointer-events-none"
                aria-hidden
                style={{
                  left: `${position - scaledSize / 2}px`,
                  bottom: "0px",
                  width: `${scaledSize}px`,
                  height: `${baseIconSize}px`,
                }}
              >
                <div
                  style={{
                    width: "1px",
                    height: `${lineHeight}px`,
                    borderRadius: "1px",
                    background:
                      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.35), transparent)",
                  }}
                />
              </div>
            );
          }

          return (
            <div
              key={app.id}
              ref={(el) => {
                iconRefs.current[index] = el;
              }}
              className="absolute cursor-pointer flex flex-col items-center justify-end"
              title={app.name}
              onClick={() => handleAppClick(app.id, index)}
              style={{
                left: `${position - scaledSize / 2}px`,
                bottom: "0px",
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
                transformOrigin: "bottom center",
                willChange: "left, width, height",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={(el) => {
                  imgRefs.current[index] = el;
                }}
                src={app.icon}
                alt={app.name}
                width={scaledSize}
                height={scaledSize}
                className="object-contain pointer-events-none"
                draggable={false}
              />

              {openApps.includes(app.id) && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    bottom: `${Math.max(-2, -baseIconSize * 0.05)}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: `${Math.max(3, baseIconSize * 0.06)}px`,
                    height: `${Math.max(3, baseIconSize * 0.06)}px`,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacOSDock;
