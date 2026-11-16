"use client";

import { HighlightText } from "@/components/ui/highlight-text";
import { LINKS } from "@/lib/portfolioContent";

export const ABOUT_BIO_TEXT = [
  "I’m Shivam Mittal.",
  "I’m into product and GTM, and honestly, I think they’re the same thing at some point. Building something people want and getting it to them are one problem, just seen from two ends. What will people like? What will work? Why did the obvious thing fail? I could think about this all day, which is probably why I’m leaning towards growth.",
  "As a CS student, my other side is applied AI. I love building automations and agents that take a boring, messy problem off someone’s plate. My rule is simple: solve the problem first, optimise it later. A working ugly solution beats a beautiful plan.",
  "I take my work seriously. I take myself less seriously.",
  "Outside of work, I’m a mountain person: cold mornings, long drives, bad network, perfect. There’s always music playing, wherever I am. And give me a good conversation or a debate about work, ideas or why something went viral, and I’ll stay for hours.",
  "And yes, this portfolio looks like a MacBook. Not a design trend. I just love my device a little too much.",
  "Find me interesting? Let’s connect. lol, I mean it.",
].join("\n\n");

type AboutBioProps = {
  /** Show GitHub / LinkedIn / X row (Finder folder) */
  showLinks?: boolean;
  className?: string;
};

export default function AboutBio({
  showLinks = false,
  className,
}: AboutBioProps) {
  return (
    <div className={className}>
      <h2 className="about-bio__title">
        I’m{" "}
        <HighlightText variant="yellow" delay={40}>
          Shivam Mittal
        </HighlightText>
      </h2>
      <p>
        I’m into{" "}
        <HighlightText variant="yellow" delay={80}>
          product and GTM
        </HighlightText>
        , and honestly, I think they’re the same thing at some point. Building
        something people want and getting it to them are one problem, just seen
        from two ends. What will people like? What will work? Why did the
        obvious thing fail? I could think about this all day, which is probably
        why I’m leaning towards{" "}
        <HighlightText variant="lime" delay={180}>
          growth
        </HighlightText>
        .
      </p>
      <p>
        As a CS student, my other side is{" "}
        <HighlightText variant="cyan" delay={260}>
          applied AI
        </HighlightText>
        . I love building automations and agents that take a boring, messy
        problem off someone’s plate. My rule is simple:{" "}
        <HighlightText variant="orange" delay={340}>
          solve the problem first, optimise it later
        </HighlightText>
        . A working ugly solution beats a beautiful plan.
      </p>
      <p>
        I take my work seriously. I take myself{" "}
        <HighlightText variant="pink" delay={420}>
          less seriously
        </HighlightText>
        .
      </p>
      <p>
        Outside of work, I’m a{" "}
        <HighlightText variant="lime" delay={500}>
          mountain person
        </HighlightText>
        : cold mornings, long drives, bad network, perfect. There’s always music
        playing, wherever I am. And give me a good conversation or a debate
        about work, ideas or why something went viral, and I’ll stay for hours.
      </p>
      <p>
        And yes, this portfolio looks like a MacBook. Not a design trend. I just
        love my device a little too much.
      </p>
      <p>
        Find me interesting?{" "}
        <HighlightText variant="yellow" delay={580}>
          Let’s connect
        </HighlightText>
        . lol, I mean it.
      </p>
      {showLinks ? (
        <p className="about-bio__links">
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {" · "}
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {" · "}
          <a href={LINKS.x} target="_blank" rel="noopener noreferrer">
            X
          </a>
        </p>
      ) : null}
    </div>
  );
}
