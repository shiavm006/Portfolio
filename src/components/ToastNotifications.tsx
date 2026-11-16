"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { playNotify } from "@/lib/uiSound";
import { cn } from "@/lib/utils";
import type { StackNotification } from "@/components/ui/notification-stack";

export type ToastNote = {
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
    body: "Product · GTM · Applied AI · Growth engineer.",
    icon: "/icons/dock/claude.png",
  },
  {
    app: "Projects",
    title: "Desktop tip",
    body: "Open the Projects folder on the right.",
    icon: "https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png",
  },
  {
    app: "GitHub",
    title: "shiavm006",
    body: "Public repos live on GitHub — dock icon opens them.",
    icon: "/icons/dock/github.png",
  },
  {
    app: "LinkedIn",
    title: "Connect",
    body: "Say hi on LinkedIn via the dock.",
    icon: "/icons/dock/linkedin.png",
  },
  {
    app: "Mail",
    title: "Collabs welcome",
    body: "Gmail in the dock opens a mail draft.",
    icon: "/icons/dock/gmail.png",
  },
  {
    app: "Notes",
    title: "Craft note",
    body: "Loves Mac UI details and tiny mascots.",
    icon: "https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png",
  },
  {
    app: "Spotlight",
    title: "Quick tip",
    body: "Press ⌘K to open Spotlight.",
    icon: "/icons/dock/spotlight.png",
  },
  {
    app: "X",
    title: "@Shivammitt2312",
    body: "Thoughts and updates on X.",
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

export function toastToStackNote(toast: ToastNote): StackNotification {
  return {
    id: toast.id,
    app: toast.app,
    title: toast.title,
    body: toast.body,
    time: "now",
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={toast.icon}
        alt=""
        width={32}
        height={32}
        className="size-8 rounded-lg object-contain bg-black/5 p-0.5"
        draggable={false}
      />
    ),
  };
}

type ToastNotificationsProps = {
  paused?: boolean;
  onOpenCentre?: () => void;
  /** Called when centre opens — live toasts are handed off to live inside NC */
  onAbsorbIntoCentre?: (notes: StackNotification[]) => void;
};

export default function ToastNotifications({
  paused = false,
  onOpenCentre,
  onAbsorbIntoCentre,
}: ToastNotificationsProps) {
  const [toasts, setToasts] = useState<ToastNote[]>([]);
  const [absorbing, setAbsorbing] = useState(false);
  const timers = useRef<number[]>([]);
  const sounded = useRef(new Set<string>());
  const dismissTimers = useRef(new Map<string, number>());
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;
  const wasPaused = useRef(paused);

  useEffect(() => {
    return () => {
      for (const id of timers.current) window.clearTimeout(id);
      for (const id of dismissTimers.current.values()) window.clearTimeout(id);
    };
  }, []);

  // When Notification Centre opens, suck visible toasts into the panel.
  useEffect(() => {
    const justOpened = paused && !wasPaused.current;
    wasPaused.current = paused;

    if (!justOpened) {
      if (!paused) setAbsorbing(false);
      return;
    }

    const live = toastsRef.current.filter((t) => !t.leaving);
    if (live.length === 0) {
      setToasts([]);
      return;
    }

    setAbsorbing(true);
    onAbsorbIntoCentre?.(live.map(toastToStackNote));

    const id = window.setTimeout(() => {
      setToasts([]);
      setAbsorbing(false);
    }, 380);
    timers.current.push(id);
  }, [paused, onAbsorbIntoCentre]);

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
    <div
      className={cn(
        "mac-toast-rail",
        paused && "is-paused",
        absorbing && "is-absorbing",
      )}
      aria-live="polite"
      aria-hidden={paused || undefined}
    >
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className={cn("mac-toast", toast.leaving && "is-leaving")}
          role="status"
          data-ui-sound="click"
          onClick={() => {
            onOpenCentre?.();
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
