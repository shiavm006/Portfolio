"use client";

import { useEffect, useMemo } from "react";
import { GitBranch, Mail, NotebookPen, Sparkles, X } from "lucide-react";
import NotificationStack, {
  type StackNotification,
} from "@/components/ui/notification-stack";
import { cn } from "@/lib/utils";

const BASE_NOTIFICATIONS: StackNotification[] = [
  {
    id: "nc-about",
    time: "now",
    app: "About Me",
    title: "Shivam Mittal",
    body: "Product, GTM, applied AI. Find me interesting? Let’s connect.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-[#DD775B] text-white">
        <Sparkles className="size-4" />
      </span>
    ),
  },
  {
    id: "nc-projects",
    time: "2m",
    app: "Projects",
    title: "Open the Projects folder",
    body: "See shipped work and experiments on the desktop.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500 text-white">
        <NotebookPen className="size-4" />
      </span>
    ),
  },
  {
    id: "nc-github",
    time: "9:50",
    app: "GitHub",
    title: "shiavm006",
    body: "Public repos and portfolio source live here.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
        <GitBranch className="size-4" />
      </span>
    ),
  },
  {
    id: "nc-mail",
    time: "8:31",
    app: "Mail",
    title: "Say hi",
    body: "Open to collabs, freelance, and interesting product problems.",
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg bg-sky-500 text-white">
        <Mail className="size-4" />
      </span>
    ),
  },
];

type NotificationCentreProps = {
  open: boolean;
  onClose: () => void;
  /** Live toast popovers absorbed into this panel when it opens */
  absorbed?: StackNotification[];
};

export default function NotificationCentre({
  open,
  onClose,
  absorbed = [],
}: NotificationCentreProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const notifications = useMemo(() => {
    const seen = new Set<string>();
    const merged: StackNotification[] = [];
    for (const note of [...absorbed, ...BASE_NOTIFICATIONS]) {
      if (seen.has(note.id)) continue;
      seen.add(note.id);
      merged.push(note);
    }
    return merged.slice(0, 6);
  }, [absorbed]);

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
          {open ? (
            <NotificationStack
              key={`nc-${absorbed.map((n) => n.id).join("|") || "base"}`}
              notifications={notifications}
              className="mac-nc__stack"
            />
          ) : null}
        </div>
      </aside>
    </>
  );
}
