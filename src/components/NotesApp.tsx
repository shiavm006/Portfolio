"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import AboutBio, { ABOUT_BIO_TEXT } from "@/components/AboutBio";
import MacWindow from "@/components/MacWindow";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  title: string;
  preview: string;
  body: string;
  content?: ReactNode;
  date: string;
};

const NOTES: Note[] = [
  {
    id: "about",
    title: "I’m Shivam Mittal",
    preview: "Product, GTM, applied AI — let’s connect.",
    body: ABOUT_BIO_TEXT,
    content: <AboutBio />,
    date: "Today",
  },
  {
    id: "tips",
    title: "Desktop tips",
    preview: "⌘K Spotlight · clock opens Notification Centre",
    body: "⌘K opens Spotlight.\nClick the clock for Notification Centre.\nFolders on the right open Finder windows.\nDock Notes opens this app.",
    date: "Yesterday",
  },
  {
    id: "stack",
    title: "What I build with",
    preview: "Motion, agents, product + GTM — tools in Skills.",
    body: "Interfaces with motion and sound.\nAgents and automations that clear messy work.\nProduct + GTM as one loop: find what people want, then get it to them.\n\nFull tool list lives in Skills.",
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

function NoteBody({ note }: { note: Note }) {
  if (note.content) return <>{note.content}</>;

  return (
    <>
      {note.body
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, i) => (
          <p key={`${note.id}-${i}`}>
            {block.split("\n").map((line, j, arr) => (
              <span key={`${note.id}-${i}-${j}`}>
                {line}
                {j < arr.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        ))}
    </>
  );
}

export default function NotesApp({
  open,
  minimized = false,
  zIndex = 47,
  onClose,
  onMinimize,
  onFocus,
}: NotesAppProps) {
  const [selectedId, setSelectedId] = useState("about");
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
                <div className="mac-notes__paper" key={selected.id}>
                  {selected.id === "about" ? null : (
                    <h2 className="mac-notes__title">{selected.title}</h2>
                  )}
                  <NoteBody note={selected} />
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
