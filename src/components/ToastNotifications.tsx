"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { playNotify } from "@/lib/uiSound";
import { cn } from "@/lib/utils";

type ToastNote = {
  id: string;
  app: string;
  title: string;
  body: string;
  icon: string;
  leaving?: boolean;
};

const TOAST_POOL: Omit<ToastNote, "id">[] = [
  {
    app: "About Me",
    title: "Shivam Mittal",
    body: "Builder · designer-minded engineer.",
    icon: "/icons/dock/claude.png",
  },
  {
    app: "Projects",
    title: "Fresh work dropped",
    body: "Something new landed in Projects.",
    icon: "https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png",
  },
  {
    app: "GitHub",
    title: "Activity on shiavm006",
    body: "New commits just showed up.",
    icon: "/icons/dock/github.png",
  },
  {
    app: "LinkedIn",
    title: "Profile views",
    body: "Someone checked your profile.",
    icon: "/icons/dock/linkedin.png",
  },
  {
    app: "Mail",
    title: "Say hi",
    body: "Open to collabs and product work.",
    icon: "/icons/dock/gmail.png",
  },
  {
    app: "Notes",
    title: "Random fact",
    body: "Loves Mac UI details and tiny mascots.",
    icon: "https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png",
  },
  {
    app: "Spotify",
    title: "Focus mode",
    body: "Late-night coding playlist is on.",
    icon: "/icons/dock/spotify.png",
  },
  {
    app: "X",
    title: "@Shivammitt2312",
    body: "A new thought just posted.",
    icon: "/icons/dock/x.png",
  },
];

function randomToast(): ToastNote {
  const base = TOAST_POOL[Math.floor(Math.random() * TOAST_POOL.length)]!;
  return {
    ...base,
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
}

type ToastNotificationsProps = {
  paused?: boolean;
  onOpenCentre?: () => void;
};

export default function ToastNotifications({
  paused = false,
  onOpenCentre,
}: ToastNotificationsProps) {
  const [toasts, setToasts] = useState<ToastNote[]>([]);
  const timers = useRef<number[]>([]);
  const sounded = useRef(new Set<string>());
  const dismissTimers = useRef(new Map<string, number>());

  useEffect(() => {
    return () => {
      for (const id of timers.current) window.clearTimeout(id);
      for (const id of dismissTimers.current.values()) window.clearTimeout(id);
    };
  }, []);

  // Chime after the toast has started sliding in (not before it's visible).
  useEffect(() => {
    for (const toast of toasts) {
      if (toast.leaving || sounded.current.has(toast.id)) continue;
      sounded.current.add(toast.id);

      const soundId = window.setTimeout(() => {
        playNotify();
      }, 160);
      timers.current.push(soundId);

      const auto = window.setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === toast.id ? { ...t, leaving: true } : t)),
        );
        const clearId = window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          dismissTimers.current.delete(toast.id);
        }, 420);
        dismissTimers.current.set(toast.id, clearId);
      }, 5200);
      dismissTimers.current.set(toast.id, auto);
    }
  }, [toasts]);

  useEffect(() => {
    if (paused) return;

    let cancelled = false;
    let timeoutId = 0;

    const scheduleNext = (delay: number) => {
      timeoutId = window.setTimeout(pushOne, delay);
      timers.current.push(timeoutId);
    };

    const pushOne = () => {
      if (cancelled) return;
      setToasts((prev) => {
        if (prev.filter((t) => !t.leaving).length >= 2) return prev;
        return [randomToast(), ...prev].slice(0, 3);
      });
      scheduleNext(9000 + Math.random() * 11000);
    };

    scheduleNext(3500 + Math.random() * 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [paused]);

  const dismissNow = (id: string) => {
    const existing = dismissTimers.current.get(id);
    if (existing) window.clearTimeout(existing);
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    const clearId = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      dismissTimers.current.delete(id);
    }, 420);
    dismissTimers.current.set(id, clearId);
  };

  return (
    <div className="mac-toast-rail" aria-live="polite">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className={cn("mac-toast", toast.leaving && "is-leaving")}
          role="status"
          data-ui-sound="click"
          onClick={() => {
            onOpenCentre?.();
            dismissNow(toast.id);
          }}
        >
          <div className="mac-toast__icon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={toast.icon} alt="" width={28} height={28} draggable={false} />
          </div>
          <div className="mac-toast__body">
            <div className="mac-toast__row">
              <p className="mac-toast__app">{toast.app}</p>
              <span className="mac-toast__time">now</span>
            </div>
            <p className="mac-toast__title">{toast.title}</p>
            <p className="mac-toast__text">{toast.body}</p>
          </div>
          <button
            type="button"
            className="mac-toast__close"
            aria-label={`Dismiss ${toast.title}`}
            data-ui-sound="click"
            onClick={(e) => {
              e.stopPropagation();
              dismissNow(toast.id);
            }}
          >
            <X className="size-3" />
          </button>
        </article>
      ))}
    </div>
  );
}
