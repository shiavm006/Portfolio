"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";

export type MacWindowVariant = "light" | "dark";

type MacWindowChrome = {
  zoomed: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onToggleZoom: () => void;
};

const MacWindowChromeContext = createContext<MacWindowChrome | null>(null);

export function useMacWindowChrome() {
  return useContext(MacWindowChromeContext);
}

export type MacWindowProps = {
  open: boolean;
  minimized?: boolean;
  title: string;
  children: ReactNode;
  variant?: MacWindowVariant;
  /** Starting width in px (capped by viewport) */
  width?: number;
  /** Starting height in px */
  height?: number;
  /** Stacking order — higher = in front */
  zIndex?: number;
  className?: string;
  bodyClassName?: string;
  /** default = titlebar chrome; none = child supplies unified chrome (Finder) */
  chrome?: "default" | "none";
  /** Minimum width while resizing (default 360) */
  minWidth?: number;
  /** Minimum height while resizing (default 240) */
  minHeight?: number;
  /** Start here instead of centering (desktop only) */
  initialPosition?: { x: number; y: number };
  /** false renders the window as inactive (default true) */
  focused?: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

type Point = { x: number; y: number };
type Size = { w: number; h: number };

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_W = 360;
const MIN_H = 240;

const RESIZE_CURSORS: Record<ResizeEdge, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
};

/**
 * Reusable macOS-style window: draggable titlebar, corner/edge resize, minimize, zoom.
 */
export default function MacWindow({
  open,
  minimized = false,
  title,
  children,
  variant = "light",
  width = 560,
  height = 420,
  zIndex = 45,
  className,
  bodyClassName,
  chrome = "default",
  minWidth = MIN_W,
  minHeight = MIN_H,
  initialPosition,
  focused = true,
  onClose,
  onMinimize,
  onFocus,
}: MacWindowProps) {
  const reactId = useId();
  const winRef = useRef<HTMLDivElement>(null);
  const posRef = useRef<Point>({ x: 0, y: 0 });
  const sizeRef = useRef<Size>({ w: width, h: height });
  const dragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const resizeRef = useRef<{
    pointerId: number;
    edge: ResizeEdge;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startW: number;
    startH: number;
  } | null>(null);

  const [zoomed, setZoomed] = useState(false);
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ w: width, h: height });
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const centeredFor = useRef<string | null>(null);
  const minRef = useRef({ w: minWidth, h: minHeight });
  const initialPosRef = useRef(initialPosition);
  useEffect(() => {
    minRef.current = { w: minWidth, h: minHeight };
    initialPosRef.current = initialPosition;
  });

  const applyFrame = useCallback((nextPos: Point, nextSize: Size) => {
    posRef.current = nextPos;
    sizeRef.current = nextSize;
    const el = winRef.current;
    if (!el) return;
    el.style.left = `${nextPos.x}px`;
    el.style.top = `${nextPos.y}px`;
    el.style.width = `${nextSize.w}px`;
    el.style.height = `${nextSize.h}px`;
  }, []);

  const clampPos = useCallback((x: number, y: number, w: number, h: number) => {
    const maxX = Math.max(8, window.innerWidth - w - 8);
    const maxY = Math.max(
      36,
      window.innerHeight - Math.min(h, window.innerHeight - 44) - 8,
    );
    return {
      x: Math.min(Math.max(8, x), maxX),
      y: Math.min(Math.max(36, y), maxY),
    };
  }, []);

  // Center when a window identity first opens
  useEffect(() => {
    if (!open) {
      centeredFor.current = null;
      setZoomed(false);
      setReady(false);
      setDragging(false);
      setResizing(false);
      dragRef.current = null;
      resizeRef.current = null;
      return;
    }

    const key = `${title || "window"}-${reactId}`;
    if (centeredFor.current === key) {
      setReady(true);
      return;
    }
    centeredFor.current = key;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const isMobile = vw <= 720;
    if (isMobile) {
      setZoomed(true);
      posRef.current = { x: 0, y: 0 };
      setPos({ x: 0, y: 0 });
      setReady(true);
      return;
    }

    const w = Math.min(width, vw - 32);
    const h = Math.min(height, vh - 140);
    const start = initialPosRef.current;
    const next = start
      ? clampPos(start.x, start.y, w, h)
      : {
          x: Math.round((vw - w) / 2),
          y: Math.max(44, Math.round((vh - h) / 2 - 20)),
        };
    posRef.current = next;
    sizeRef.current = { w, h };
    setPos(next);
    setSize({ w, h });
    setReady(true);
  }, [open, title, reactId, width, height, clampPos]);

  // Document-level drag + resize listeners
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag && drag.pointerId === e.pointerId) {
        e.preventDefault();
        const next = clampPos(
          e.clientX - drag.offsetX,
          e.clientY - drag.offsetY,
          sizeRef.current.w,
          sizeRef.current.h,
        );
        applyFrame(next, sizeRef.current);
        return;
      }

      const resize = resizeRef.current;
      if (!resize || resize.pointerId !== e.pointerId) return;
      e.preventDefault();

      const dx = e.clientX - resize.startX;
      const dy = e.clientY - resize.startY;
      const edge = resize.edge;

      let left = resize.startLeft;
      let top = resize.startTop;
      let w = resize.startW;
      let h = resize.startH;

      if (edge.includes("e")) w = resize.startW + dx;
      if (edge.includes("s")) h = resize.startH + dy;
      if (edge.includes("w")) {
        w = resize.startW - dx;
        left = resize.startLeft + dx;
      }
      if (edge.includes("n")) {
        h = resize.startH - dy;
        top = resize.startTop + dy;
      }

      const maxW = window.innerWidth - 16;
      const maxH = window.innerHeight - 44;
      const minW = minRef.current.w;
      const minH = minRef.current.h;

      if (edge.includes("w")) {
        const maxGrowLeft = resize.startLeft + resize.startW - minW;
        left = Math.min(Math.max(8, left), maxGrowLeft);
        w = resize.startLeft + resize.startW - left;
      } else {
        w = Math.min(Math.max(minW, w), maxW);
        left = Math.min(left, window.innerWidth - w - 8);
      }

      if (edge.includes("n")) {
        const maxGrowTop = resize.startTop + resize.startH - minH;
        top = Math.min(Math.max(36, top), maxGrowTop);
        h = resize.startTop + resize.startH - top;
      } else {
        h = Math.min(Math.max(minH, h), maxH);
        top = Math.min(top, window.innerHeight - Math.min(h, maxH) - 8);
      }

      w = Math.min(Math.max(minW, w), maxW);
      h = Math.min(Math.max(minH, h), maxH);

      applyFrame({ x: left, y: top }, { w: Math.round(w), h: Math.round(h) });
    };

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (drag && drag.pointerId === e.pointerId) {
        dragRef.current = null;
        setDragging(false);
        setPos(posRef.current);
        document.body.style.removeProperty("user-select");
        document.body.style.removeProperty("cursor");
        return;
      }

      const resize = resizeRef.current;
      if (!resize || resize.pointerId !== e.pointerId) return;
      resizeRef.current = null;
      setResizing(false);
      setPos(posRef.current);
      setSize(sizeRef.current);
      document.body.style.removeProperty("user-select");
      document.body.style.removeProperty("cursor");
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [applyFrame, clampPos]);

  const beginDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, input, [data-no-drag]")) {
      return;
    }
    if (zoomed || resizeRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    onFocus?.();

    const el = winRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    setDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  const beginResize = (edge: ResizeEdge) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || zoomed) return;
    e.preventDefault();
    e.stopPropagation();
    onFocus?.();

    const current = posRef.current;
    const currentSize = sizeRef.current;
    resizeRef.current = {
      pointerId: e.pointerId,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: current.x,
      startTop: current.y,
      startW: currentSize.w,
      startH: currentSize.h,
    };
    setResizing(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = RESIZE_CURSORS[edge];
  };

  const chromeValue = useMemo<MacWindowChrome>(
    () => ({
      zoomed,
      onClose,
      onMinimize,
      onToggleZoom: () => {
        onFocus?.();
        setZoomed((z) => !z);
      },
    }),
    [zoomed, onClose, onMinimize, onFocus],
  );

  if (!open) return null;

  const visible = !minimized && ready;
  const edges: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  return (
    <MacWindowChromeContext.Provider value={chromeValue}>
      <div
        ref={winRef}
        role="dialog"
        aria-label={title}
        aria-hidden={!visible}
        className={cn(
          "mac-window",
          variant === "dark" && "mac-window--dark",
          chrome === "none" && "mac-window--chrome-none",
          zoomed && "is-zoomed",
          minimized && "is-minimized",
          !focused && "is-inactive",
          dragging && "is-dragging",
          resizing && "is-resizing",
          className,
        )}
        style={
          zoomed
            ? { zIndex }
            : {
                zIndex,
                left: pos.x,
                top: pos.y,
                width: size.w,
                height: size.h,
                maxHeight: "none",
                transform: "none",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
              }
        }
        onMouseDown={onFocus}
      >
        {chrome === "default" ? (
          <div className="mac-window__titlebar" onPointerDown={beginDrag}>
            <div className="mac-window__traffic">
              <button
                type="button"
                className="mac-window__dot mac-window__dot--close"
                aria-label="Close"
                data-ui-sound="click"
                onClick={onClose}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className="mac-window__dot mac-window__dot--min"
                aria-label="Minimize"
                data-ui-sound="click"
                onClick={() => onMinimize?.()}
                onPointerDown={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                className="mac-window__dot mac-window__dot--zoom"
                aria-label={zoomed ? "Restore" : "Zoom"}
                data-ui-sound="click"
                onClick={() => {
                  onFocus?.();
                  setZoomed((z) => !z);
                }}
                onPointerDown={(e) => e.stopPropagation()}
              />
            </div>
            <span className="mac-window__title">{title}</span>
          </div>
        ) : null}
        <div
          className={cn("mac-window__body", bodyClassName)}
          onPointerDown={(e) => {
            if (chrome !== "none") return;
            const handle = (e.target as HTMLElement).closest("[data-mac-drag]");
            if (handle) beginDrag(e);
          }}
        >
          {children}
        </div>

        {!zoomed
          ? edges.map((edge) => (
              <div
                key={edge}
                className={cn("mac-window__resize", `mac-window__resize--${edge}`)}
                data-no-drag
                onPointerDown={beginResize(edge)}
                aria-hidden
              />
            ))
          : null}
      </div>
    </MacWindowChromeContext.Provider>
  );
}
