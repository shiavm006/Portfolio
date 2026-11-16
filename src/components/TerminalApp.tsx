"use client";

import { useEffect, useRef, useState } from "react";
import MacWindow from "@/components/MacWindow";

type Line = { type: "in" | "out" | "sys"; text: string };

function welcomeLines(): Line[] {
  return [
    {
      type: "sys",
      text: `Last login: ${new Date().toString()} on ttys001`,
    },
    { type: "out", text: "shivam@portfolio ~ % type `help` for commands" },
  ];
}

function runCommand(raw: string): Line[] {
  const input = raw.trim();
  const cmd = input.toLowerCase();
  if (!cmd) return [];

  if (cmd === "help") {
    return [
      {
        type: "out",
        text: "commands: help, whoami, ls, about, projects, clear, date, echo",
      },
    ];
  }
  if (cmd === "whoami") return [{ type: "out", text: "shivam" }];
  if (cmd === "ls") {
    return [
      {
        type: "out",
        text: "About Me/  Projects/  Resume/  Desktop/  Documents/",
      },
    ];
  }
  if (cmd === "about") {
    return [
      {
        type: "out",
        text: "Shivam Mittal — Product, GTM, Applied AI, and Growth engineer.",
      },
    ];
  }
  if (cmd === "projects") {
    return [
      {
        type: "out",
        text: "portfolio  experiments  — open the Projects folder for more.",
      },
    ];
  }
  if (cmd === "date") return [{ type: "out", text: new Date().toString() }];
  if (cmd.startsWith("echo ")) {
    return [{ type: "out", text: input.slice(5) }];
  }
  if (cmd === "clear") return [{ type: "sys", text: "__CLEAR__" }];

  return [{ type: "out", text: `zsh: command not found: ${input.split(/\s+/)[0]}` }];
}

type TerminalAppProps = {
  open: boolean;
  minimized?: boolean;
  zIndex?: number;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

export default function TerminalApp({
  open,
  minimized = false,
  zIndex = 46,
  onClose,
  onMinimize,
  onFocus,
}: TerminalAppProps) {
  const [lines, setLines] = useState<Line[]>(() => welcomeLines());
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || minimized) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open, minimized]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const submit = () => {
    const trimmed = value;
    const next: Line[] = [...lines, { type: "in", text: `shivam@portfolio ~ % ${trimmed}` }];
    const result = runCommand(trimmed);
    if (result.some((l) => l.text === "__CLEAR__")) {
      setLines([]);
    } else {
      setLines([...next, ...result]);
    }
    setValue("");
  };

  return (
    <MacWindow
      open={open}
      minimized={minimized}
      title="shivam — zsh — 80×24"
      variant="dark"
      width={720}
      height={420}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      bodyClassName="mac-window__body--terminal"
    >
      <div
        ref={bodyRef}
        className="mac-terminal__scroll"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={`${i}-${line.text.slice(0, 12)}`}
            className={`mac-terminal__line mac-terminal__line--${line.type}`}
          >
            {line.text}
          </div>
        ))}
        <div className="mac-terminal__prompt">
          <span className="mac-terminal__ps1">shivam@portfolio ~ %</span>
          <input
            ref={inputRef}
            className="mac-terminal__input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </MacWindow>
  );
}
