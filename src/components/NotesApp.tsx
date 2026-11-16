"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import MacWindow from "@/components/MacWindow";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  title: string;
  preview: string;
  body: string;
  date: string;
};

const NOTES: Note[] = [
  {
    id: "tips",
    title: "Desktop tips",
    preview: "⌘K Spotlight · clock opens Notification Centre",
    body: "⌘K opens Spotlight.\nClick the clock for Notification Centre.\nTerminal understands help, whoami, about, projects.\nFolders on the right open Finder windows.\nDock Notes opens this app.",
    date: "Today",
  },
  {
    id: "about",
    title: "About Shivam",
    preview: "Product, GTM, Applied AI, Growth engineer.",
    body: "Shivam Mittal\n\nProduct · GTM · Applied AI · Growth engineer.\n\nShips playful interfaces and Mac-inspired product details.\nOpen to collabs and interesting problems.",
    date: "Yesterday",
  },
  {
    id: "stack",
    title: "What I build with",
    preview: "Next.js, React, TypeScript, GSAP, Motion",
    body: "Frontend — Next.js, React, TypeScript, GSAP, Motion\nApplied AI — agent UX, prompts, tooling workflows\nProduct & GTM — discovery, narrative, shipping loops\nCraft — interaction design, sound, micro-animation",
    date: "Monday",
  },
];

type NotesAppProps = {
  open: boolean;
  minimized?: boolean;
  zIndex?: number;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

export default function NotesApp({
  open,
  minimized = false,
  zIndex = 47,
  onClose,
  onMinimize,
  onFocus,
}: NotesAppProps) {
  const [selectedId, setSelectedId] = useState(NOTES[0]!.id);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NOTES;
    return NOTES.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q),
    );
  }, [query]);

  const selected =
    filtered.find((n) => n.id === selectedId) ?? filtered[0] ?? null;

  return (
    <MacWindow
      open={open}
      minimized={minimized}
      title="Notes"
      variant="light"
      width={820}
      height={520}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      bodyClassName="mac-notes-body"
      className="mac-window--notes"
    >
      <div className="mac-notes">
        <div className="mac-notes__shell">
          <aside className="mac-notes__sidebar">
            <label className="mac-notes__search">
              <Search className="size-3.5 opacity-45" strokeWidth={2.25} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search notes"
              />
            </label>

            <ul className="mac-notes__list" aria-label="Notes">
              {filtered.map((note) => {
                const active = note.id === selected?.id;
                return (
                  <li key={note.id}>
                    <button
                      type="button"
                      className={cn("mac-notes__item", active && "is-active")}
                      data-ui-sound="click"
                      onClick={() => setSelectedId(note.id)}
                    >
                      <span className="mac-notes__item-title">{note.title}</span>
                      <span className="mac-notes__item-meta">
                        <span className="mac-notes__item-date">{note.date}</span>
                        <span className="mac-notes__item-preview">
                          {note.preview}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 ? (
                <li className="mac-notes__list-empty">No Results</li>
              ) : null}
            </ul>
          </aside>

          <section className="mac-notes__editor" aria-label="Note">
            {selected ? (
              <>
                <p className="mac-notes__date">{selected.date}</p>
                <div className="mac-notes__paper">
                  <h2 className="mac-notes__title">{selected.title}</h2>
                  {selected.body.split("\n").map((line, i) => (
                    <p key={`${selected.id}-${i}`}>{line || "\u00A0"}</p>
                  ))}
                </div>
              </>
            ) : (
              <p className="mac-notes__empty">No Notes</p>
            )}
          </section>
        </div>
      </div>
    </MacWindow>
  );
}
