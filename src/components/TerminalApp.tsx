"use client";

import { useEffect, useRef, useState } from "react";

type Line = { type: "in" | "out" | "sys"; text: string };

const WELCOME: Line[] = [
  { type: "sys", text: "Last login: Mon Nov 16 01:43:00 on ttys001" },
  { type: "out", text: "shivam@portfolio ~ % type `help` for commands" },
];

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
        text: "Shivam Mittal — building products, design systems, and playful UIs.",
      },
    ];
  }
  if (cmd === "projects") {
    return [
      {
        type: "out",
        text: "portfolio  blinkmoney  experiments  — open the Projects folder for more.",
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
  onClose: () => void;
  onFocus?: () => void;
};

export default function TerminalApp({ open, onClose, onFocus }: TerminalAppProps) {
  const [lines, setLines] = useState<Line[]>(WELCOME);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  if (!open) return null;

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
    <div
      className="mac-terminal"
      role="dialog"
      aria-label="Terminal"
      onMouseDown={onFocus}
    >
      <div className="mac-terminal__titlebar">
        <div className="mac-terminal__traffic">
          <button
            type="button"
            className="mac-terminal__dot mac-terminal__dot--close"
            aria-label="Close"
            onClick={onClose}
          />
          <button
            type="button"
            className="mac-terminal__dot mac-terminal__dot--min"
            aria-label="Minimize"
            onClick={onClose}
          />
          <button
            type="button"
            className="mac-terminal__dot mac-terminal__dot--zoom"
            aria-label="Zoom"
          />
        </div>
        <span className="mac-terminal__title">shivam — zsh — 80×24</span>
      </div>

      <div
        ref={bodyRef}
        className="mac-terminal__body"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div key={`${i}-${line.text.slice(0, 12)}`} className={`mac-terminal__line mac-terminal__line--${line.type}`}>
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
    </div>
  );
}
