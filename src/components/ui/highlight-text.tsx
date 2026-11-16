"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  children: ReactNode;
  className?: string;
  variant?: "lime" | "yellow" | "pink" | "cyan" | "orange";
  /** Stagger delay for the marker draw-in (ms) */
  delay?: number;
}

const highlightVariants: Record<
  NonNullable<HighlightTextProps["variant"]>,
  string
> = {
  lime: "bg-accent-green",
  yellow: "bg-yellow-300",
  pink: "bg-pink-300",
  cyan: "bg-cyan-300",
  orange: "bg-orange-300",
};

export function HighlightText({
  children,
  className,
  variant = "lime",
  delay = 0,
}: HighlightTextProps) {
  return (
    <span className="relative inline-block">
      <span
        className={cn(
          "mac-highlight absolute inset-0 -z-0 scale-x-110 scale-y-90 -skew-y-1 origin-left",
          highlightVariants[variant],
          className,
        )}
        style={{ animationDelay: `${delay}ms` }}
        aria-hidden="true"
      />
      <span className="relative z-[1]">{children}</span>
    </span>
  );
}

export default HighlightText;
