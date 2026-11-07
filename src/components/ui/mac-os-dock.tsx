"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
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

const MacOSDock: React.FC<MacOSDockProps> = ({
  apps,
  onAppClick,
  openApps = [],
  className = "",
}) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  // Stable default on SSR + first paint so icons never start at x=0
  const [config, setConfig] = useState<DockConfig>(DEFAULT_CONFIG);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);
  const separatorWidth = Math.max(10, baseIconSize * 0.18);

  const restScales = useMemo(() => apps.map(() => minScale), [apps, minScale]);
  const restPositions = useMemo(
    () => getRestPositions(apps, baseIconSize, separatorWidth, baseSpacing),
    [apps, baseIconSize, separatorWidth, baseSpacing],
  );

  const [currentScales, setCurrentScales] = useState<number[]>(restScales);
  const [currentPositions, setCurrentPositions] =
    useState<number[]>(restPositions);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMouseMoveTime = useRef<number>(0);

  const itemWidth = useCallback(
    (index: number, scale = 1) =>
      getItemWidth(apps, index, scale, baseIconSize, separatorWidth),
    [apps, baseIconSize, separatorWidth],
  );

  useEffect(() => {
    setConfig(getResponsiveConfig());
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateTargetMagnification = useCallback(
    (mousePosition: number | null) => {
      if (mousePosition === null) {
        return apps.map(() => minScale);
      }

      // Layout centers as if unmagnified, same as position calc at rest
      let x = 0;
      const centers = apps.map((_, index) => {
        const w = itemWidth(index, 1);
        const center = x + w / 2;
        x += w + baseSpacing;
        return center;
      });

      return apps.map((app, index) => {
        if (app.separator) return minScale;

        const normalIconCenter = centers[index];
        const minX = mousePosition - effectWidth / 2;
        const maxX = mousePosition + effectWidth / 2;

        if (normalIconCenter < minX || normalIconCenter > maxX) {
          return minScale;
        }

        const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
        const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
        const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;

        return minScale + scaleFactor * (maxScale - minScale);
      });
    },
    [apps, baseSpacing, effectWidth, itemWidth, maxScale, minScale],
  );

  const calculatePositions = useCallback(
    (scales: number[]) => {
      let currentX = 0;

      return scales.map((scale, index) => {
        const scaledWidth = itemWidth(index, scale);
        const centerX = currentX + scaledWidth / 2;
        currentX += scaledWidth + baseSpacing;
        return centerX;
      });
    },
    [baseSpacing, itemWidth],
  );

  // Keep layout in sync when icon size / app list changes (no empty-frame flash)
  useEffect(() => {
    setCurrentScales(restScales);
    setCurrentPositions(restPositions);
  }, [restScales, restPositions]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales((prevScales) =>
      targetScales.map((target, index) => {
        const current = prevScales[index] ?? target;
        return current + (target - current) * lerpFactor;
      }),
    );

    setCurrentPositions((prevPositions) =>
      targetPositions.map((target, index) => {
        const current = prevPositions[index] ?? target;
        return current + (target - current) * lerpFactor;
      }),
    );

    const scalesNeedUpdate = targetScales.some(
      (scale, index) => Math.abs((currentScales[index] ?? scale) - scale) > 0.002,
    );
    const positionsNeedUpdate = targetPositions.some(
      (pos, index) => Math.abs((currentPositions[index] ?? pos) - pos) > 0.1,
    );

    if (scalesNeedUpdate || positionsNeedUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [
    mouseX,
    calculateTargetMagnification,
    calculatePositions,
    currentScales,
    currentPositions,
  ]);

  useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateToTarget);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateToTarget]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = performance.now();

      if (now - lastMouseMoveTime.current < 16) {
        return;
      }

      lastMouseMoveTime.current = now;

      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        const padding = Math.max(8, baseIconSize * 0.12);
        setMouseX(e.clientX - rect.left - padding);
      }
    },
    [baseIconSize],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  const handleAppClick = (appId: string, index: number) => {
    if (apps[index]?.separator) return;

    if (iconRefs.current[index]) {
      const bounceHeight =
        currentScales[index] > 1.3
          ? -baseIconSize * 0.2
          : -baseIconSize * 0.15;

      gsap.to(iconRefs.current[index], {
        y: bounceHeight,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        transformOrigin: "bottom center",
      });
    }

    onAppClick(appId);
  };

  const layoutPositions =
    currentPositions.length === apps.length ? currentPositions : restPositions;
  const layoutScales =
    currentScales.length === apps.length ? currentScales : restScales;

  const contentWidth = Math.max(
    ...layoutPositions.map(
      (pos, index) => pos + itemWidth(index, layoutScales[index] ?? 1) / 2,
    ),
    0,
  );

  const padding = Math.max(8, baseIconSize * 0.12);

  return (
    <div
      ref={dockRef}
      className={`backdrop-blur-md ${className}`}
      style={{
        width: `${contentWidth + padding * 2}px`,
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
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative"
        style={{
          height: `${baseIconSize}px`,
          width: "100%",
        }}
      >
        {apps.map((app, index) => {
          const scale = layoutScales[index] ?? 1;
          const position = layoutPositions[index] ?? restPositions[index] ?? 0;
          const scaledSize = itemWidth(index, scale);

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
                zIndex: Math.round(scale * 10),
              }}
            >
              <img
                src={app.icon}
                alt={app.name}
                width={scaledSize}
                height={scaledSize}
                className="object-contain"
                draggable={false}
                style={{
                  filter: `drop-shadow(0 ${scale > 1.2 ? Math.max(2, baseIconSize * 0.05) : Math.max(1, baseIconSize * 0.03)}px ${scale > 1.2 ? Math.max(4, baseIconSize * 0.1) : Math.max(2, baseIconSize * 0.06)}px rgba(0,0,0,${0.2 + (scale - 1) * 0.15}))`,
                }}
              />

              {openApps.includes(app.id) && (
                <div
                  className="absolute"
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
