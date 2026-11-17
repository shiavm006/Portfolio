"use client";

import { useState, type FormEvent } from "react";
import MacWindow from "@/components/MacWindow";

type MailAppProps = {
  open: boolean;
  minimized?: boolean;
  zIndex?: number;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full bg-transparent px-4 py-2.5 text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400";

export default function MailApp({
  open,
  minimized = false,
  zIndex = 49,
  onClose,
  onMinimize,
  onFocus,
}: MailAppProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't send. Try again.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send.");
      setStatus("error");
    }
  };

  return (
    <MacWindow
      open={open}
      minimized={minimized}
      title="New Message"
      variant="light"
      width={560}
      height={460}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
    >
      {status === "sent" ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-neutral-900">Message sent ✓</p>
          <p className="text-sm text-neutral-500">Thanks! I&apos;ll reply to your email soon.</p>
          <button
            type="button"
            className="mt-2 rounded-md bg-neutral-100 px-4 py-1.5 text-sm text-neutral-800 hover:bg-neutral-200"
            onClick={() => setStatus("idle")}
          >
            Write another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex h-full flex-col bg-white">
          <div className="divide-y divide-neutral-200 border-b border-neutral-200">
            <input name="name" required maxLength={100} placeholder="Your name" aria-label="Your name" className={field} />
            <input name="email" type="email" required maxLength={200} placeholder="Your email" aria-label="Your email" className={field} />
            <div className="flex items-center px-4 py-2.5 text-[14px] text-neutral-400">
              To:&nbsp;<span className="text-neutral-700">Shivam Mittal</span>
            </div>
          </div>
          {/* honeypot — hidden from humans */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <textarea
            name="message"
            required
            minLength={3}
            maxLength={5000}
            placeholder="Say hi, pitch an idea, or just roast my portfolio…"
            aria-label="Message"
            className={`${field} flex-1 resize-none`}
          />
          <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
            <span className="text-xs text-red-600">{status === "error" ? error : ""}</span>
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md bg-blue-600 px-5 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      )}
    </MacWindow>
  );
}
