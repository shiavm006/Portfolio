"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import github from "@/data/github.json";

const RAMP = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"] as const;
const SWEEP_MS = 2400;
const SETTLE_MS = 700;

type Frame = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
};

function clamp(n: number, a = 0, b = 1) {
  return Math.max(a, Math.min(b, n));
}

function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3);
}

function easeOutBack(p: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

function mixHex(a: string, b: string, t: number) {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ] as const;
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

function drawRing({ ctx, w, h, t }: Frame) {
  const levels = github.levels as number[];
  const weeks = github.weeks;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) * 0.46;
  const minR = maxR * 0.3;
  const ringGap = (maxR - minR) / 7;
  const pad = ringGap * 0.16;
  const weekAngle = (Math.PI * 2) / weeks;
  const startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, w, h);

  // faint empty ring track
  for (let dow = 0; dow < 7; dow++) {
    const outer = minR + (dow + 1) * ringGap - pad;
    const inner = minR + dow * ringGap + pad;
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fill();
  }

  const handT = clamp(t / SWEEP_MS);
  const handAngle = startAngle + handT * Math.PI * 2;

  for (let i = 0; i < levels.length; i++) {
    const week = Math.floor(i / 7);
    const dow = i % 7;
    // reveal when the sweeping hand reaches this week's spoke
    const revealAt = (week / weeks) * SWEEP_MS;
    const local = clamp((t - revealAt) / 420);
    if (local <= 0) continue;

    const pop = easeOutBack(Math.min(local, 1));
    const gap = weekAngle * 0.12;
    const a0 = startAngle + week * weekAngle + gap * 0.5;
    const a1 = startAngle + (week + 1) * weekAngle - gap * 0.5;
    const outerBase = minR + (dow + 1) * ringGap - pad;
    const innerBase = minR + dow * ringGap + pad;
    const grow = 0.55 + 0.45 * pop;
    const mid = (outerBase + innerBase) / 2;
    const half = ((outerBase - innerBase) / 2) * grow;
    const outer = mid + half;
    const inner = mid - half;

    const level = levels[i] ?? 0;
    const color =
      local < 1
        ? mixHex("#9be9a8", RAMP[level]!, easeOutCubic(local))
        : RAMP[level]!;

    ctx.beginPath();
    ctx.arc(cx, cy, outer, a0, a1);
    ctx.arc(cx, cy, inner, a1, a0, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4 + 0.6 * Math.min(local, 1);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // sweeping hand
  if (handT < 1) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(handAngle);

    // soft wedge trail
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, maxR + 4, -0.12, 0.02);
    ctx.closePath();
    const wedge = ctx.createRadialGradient(0, 0, minR * 0.5, 0, 0, maxR);
    wedge.addColorStop(0, "rgba(155,233,168,0)");
    wedge.addColorStop(1, "rgba(48,161,78,0.18)");
    ctx.fillStyle = wedge;
    ctx.fill();

    const grad = ctx.createLinearGradient(0, 0, maxR, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.4, "rgba(155,233,168,0.25)");
    grad.addColorStop(1, "rgba(48,161,78,0.95)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.25;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(minR * 0.55, 0);
    ctx.lineTo(maxR + 2, 0);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(maxR + 1, 0, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#30a14e";
    ctx.beginPath();
    ctx.arc(maxR + 1, 0, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // center badge — land on GitHub's total as the hand finishes
  const display = Number.isFinite(t)
    ? Math.round(
        github.total *
          easeOutCubic(clamp((t - 60) / (SWEEP_MS + SETTLE_MS * 0.6))),
      )
    : github.total;

  ctx.fillStyle = "rgba(22,22,24,0.78)";
  ctx.beginPath();
  ctx.arc(cx, cy, minR * 0.78, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#f5f5f7";
  ctx.font = `600 ${Math.max(18, Math.floor(minR * 0.4))}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(display), cx, cy - minR * 0.06);
  ctx.fillStyle = "rgba(235,235,245,0.55)";
  ctx.font = `500 ${Math.max(9, Math.floor(minR * 0.15))}px -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillText("commits", cx, cy + minR * 0.26);
}

type GithubContributionRingProps = {
  className?: string;
  size?: number;
};

export default function GithubContributionRing({
  className,
  size = 236,
}: GithubContributionRingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const [replayKey, setReplayKey] = useState(0);

  const replay = () => {
    startRef.current = 0;
    setReplayKey((k) => k + 1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const paintSize = () => {
      const side = Math.min(size, wrap.clientWidth || size);
      canvas.width = Math.floor(side * dpr);
      canvas.height = Math.floor(side * dpr);
      canvas.style.width = `${side}px`;
      canvas.style.height = `${side}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return side;
    };

    let side = paintSize();
    let visible = true;
    startRef.current = 0;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const t = reduced ? Number.POSITIVE_INFINITY : now - startRef.current;
      drawRing({ ctx, w: side, h: side, t });
      if (!reduced && t < SWEEP_MS + SETTLE_MS + 200 && visible) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) {
          if (!startRef.current) startRef.current = performance.now();
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafRef.current);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(wrap);

    const onResize = () => {
      side = paintSize();
      const t = reduced
        ? Number.POSITIVE_INFINITY
        : performance.now() - (startRef.current || performance.now());
      drawRing({ ctx, w: side, h: side, t });
    };
    window.addEventListener("resize", onResize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [replayKey, size]);

  return (
    <div
      ref={wrapRef}
      className={cn("mac-contrib-ring", className)}
      aria-label={`GitHub contribution ring for @${github.login}: ${github.total} contributions`}
    >
      <canvas ref={canvasRef} />
      <button
        type="button"
        className="mac-contrib-ring__replay"
        aria-label="Replay contribution animation"
        data-ui-sound="click"
        onClick={replay}
      >
        <RotateCcw className="size-3.5" strokeWidth={2.25} />
      </button>
      <p className="mac-contrib-ring__caption">
        @{github.login} · last year
      </p>
    </div>
  );
}
