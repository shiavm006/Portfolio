"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type TextRevealBlockProps = {
  text: string;
  className?: string;
  /** Wipe color behind each word */
  blockColor?: string;
  delay?: number;
};

/**
 * Line / word reveal with a colored block wipe (21st.dev Text Reveal Block style).
 * Uses GSAP only — no Club SplitText dependency.
 */
export function TextRevealBlock({
  text,
  className,
  blockColor = "#ff5941",
  delay = 0.15,
}: TextRevealBlockProps) {
  const rootRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = root.querySelectorAll<HTMLElement>("[data-reveal-word]");
    const blocks = root.querySelectorAll<HTMLElement>("[data-reveal-block]");

    if (reduced) {
      gsap.set(words, { opacity: 1, y: 0 });
      gsap.set(blocks, { scaleX: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0, y: "0.35em" });
      gsap.set(blocks, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ delay });
      words.forEach((word, i) => {
        const block = blocks[i];
        if (!block) return;
        tl.to(
          block,
          { scaleX: 1, duration: 0.28, ease: "power2.inOut" },
          i * 0.08,
        )
          .to(word, { opacity: 1, y: 0, duration: 0.01 }, ">-0.02")
          .to(
            block,
            {
              scaleX: 0,
              transformOrigin: "right center",
              duration: 0.32,
              ease: "power2.inOut",
            },
            ">-0.02",
          );
      });
    }, root);

    return () => ctx.revert();
  }, [text, delay]);

  const parts = text.trim().split(/\s+/);

  return (
    <p ref={rootRef} className={cn("text-reveal-block", className)}>
      {parts.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="text-reveal-block__word-wrap">
            <span
              className="text-reveal-block__block"
              data-reveal-block
              style={{ backgroundColor: blockColor }}
              aria-hidden
            />
            <span className="text-reveal-block__word" data-reveal-word>
              {word}
            </span>
          </span>
          {i < parts.length - 1 ? " " : null}
        </span>
      ))}
    </p>
  );
}

export default TextRevealBlock;
