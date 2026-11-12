"use client";

import { useEffect, useMemo, useState } from "react";
import { GitBranch, Mail, NotebookPen, Sparkles, UserRound, X } from "lucide-react";
import NotificationStack, {
  type StackNotification,
} from "@/components/ui/notification-stack";
import { cn } from "@/lib/utils";

const ABOUT_POOL: Omit<StackNotification, "id" | "time">[] = [
  {
    app: "About Me",
    title: "Shivam Mittal",
    body: "Builder · designer-minded engineer. Shipping playful interfaces.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-[#DD775B] text-white">
        <Sparkles className="size-4" />
      </span>
    ),
  },
  {
    app: "Projects",
    title: "New drop in the folder",
    body: "Open Projects to see the latest experiments and shipped work.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-white">
        <NotebookPen className="size-4" />
      </span>
    ),
  },
  {
    app: "GitHub",
    title: "shiavm006 is active",
    body: "Recent commits landed. Peek the repos when you have a minute.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
        <GitBranch className="size-4" />
      </span>
    ),
  },
  {
    app: "LinkedIn",
    title: "Profile views",
    body: "A few people checked your profile this week. Nice signal.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
        <UserRound className="size-4" />
      </span>
    ),
  },
  {
    app: "Mail",
    title: "Say hi",
    body: "Open to collabs, freelance, and interesting product problems.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-white">
        <Mail className="size-4" />
      </span>
    ),
  },
  {
    app: "Notes",
    title: "Random fact",
    body: "Loves Mac-style UI details, clicky key sounds, and tiny mascots.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
        <NotebookPen className="size-4" />
      </span>
    ),
  },
];

function pickNotes(count = 4): StackNotification[] {
  const shuffled = [...ABOUT_POOL].sort(() => Math.random() - 0.5);
  const stamps = ["now", "2m", "9:50", "8:31"];
  return shuffled.slice(0, count).map((note, i) => ({
    ...note,
    id: `nc-${i}-${Math.random().toString(36).slice(2, 7)}`,
    time: stamps[i] ?? "earlier",
  }));
}

type NotificationCentreProps = {
  open: boolean;
  onClose: () => void;
};

export default function NotificationCentre({ open, onClose }: NotificationCentreProps) {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (open) setSeed((n) => n + 1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const notifications = useMemo(() => pickNotes(4), [seed]);

  return (
    <>
      <button
        type="button"
        className={cn("mac-nc__scrim", open && "is-open")}
        aria-label="Close notifications"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside
        className={cn("mac-nc", open && "is-open")}
        aria-hidden={!open}
        aria-label="Notifications"
      >
        <div className="mac-nc__panel">
          <button
            type="button"
            className="mac-nc__close"
            aria-label="Close"
            data-ui-sound="click"
            onClick={onClose}
          >
            <X className="size-3.5" />
          </button>
          {seed > 0 ? (
            <NotificationStack
              key={seed}
              notifications={notifications}
              className="mac-nc__stack"
            />
          ) : null}
        </div>
      </aside>
    </>
  );
}
