"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import gsap from "gsap";

export type SpotlightItem = {
  id: string;
  name: string;
  icon: string;
  kind: "Application" | "Folder";
};

type SpotlightSearchProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SpotlightItem[];
  onSelect: (item: SpotlightItem) => void;
};

function MagnifierIcon() {
  return (
    <svg
      className="mac-spotlight__magnifier"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M15.4 15.4 L20.2 20.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SpotlightSearch({
  open,
  onOpenChange,
  items,
  onSelect,
}: SpotlightSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 6);
    return items
      .filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [items, query]);

  const showResults = query.trim().length > 0 || results.length > 0;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }
    setActiveIndex(0);
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Smooth result-list reveal whenever results change
  useEffect(() => {
    if (!open || !resultsRef.current) return;
    const rows = resultsRef.current.querySelectorAll(".mac-spotlight__row");
    gsap.fromTo(
      rows,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.035,
        ease: "power2.out",
        overwrite: true,
      },
    );
  }, [open, results]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const choose = useCallback(
    (item: SpotlightItem) => {
      const panel = panelRef.current;
      if (panel) {
        gsap.fromTo(
          panel,
          { scale: 1 },
          {
            scale: 0.985,
            duration: 0.08,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            onComplete: () => {
              onSelect(item);
              close();
            },
          },
        );
        return;
      }
      onSelect(item);
      close();
    },
    [close, onSelect],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        choose(results[activeIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, choose, close, open, results]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="mac-spotlight"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.button
            type="button"
            className="mac-spotlight__backdrop"
            aria-label="Close Spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={close}
          />

          <motion.div
            ref={panelRef}
            className="mac-spotlight__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Spotlight Search"
            initial={{ opacity: 0, y: -18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.85,
            }}
          >
            <div className="mac-spotlight__search">
              <MagnifierIcon />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Spotlight Search"
                className="mac-spotlight__input"
                aria-controls={listId}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              {showResults ? (
                <motion.div
                  key={query.trim() ? "filtered" : "suggestions"}
                  className="mac-spotlight__body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      type: "spring",
                      stiffness: 380,
                      damping: 34,
                    },
                    opacity: { duration: 0.18 },
                  }}
                >
                  {results.length > 0 ? (
                    <>
                      {!query.trim() ? (
                        <p className="mac-spotlight__section">Top Hit</p>
                      ) : null}
                      <ul
                        ref={resultsRef}
                        id={listId}
                        className="mac-spotlight__results"
                        role="listbox"
                      >
                        {results.map((item, index) => {
                          const selected = index === activeIndex;
                          return (
                            <li
                              key={item.id}
                              role="option"
                              aria-selected={selected}
                            >
                              <button
                                type="button"
                                className={`mac-spotlight__row${selected ? " is-active" : ""}`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => choose(item)}
                              >
                                <span className="mac-spotlight__icon-wrap">
                                  <img
                                    src={item.icon}
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="mac-spotlight__icon"
                                    draggable={false}
                                  />
                                </span>
                                <span className="mac-spotlight__meta">
                                  <span className="mac-spotlight__name">
                                    {item.name}
                                  </span>
                                  <span className="mac-spotlight__kind">
                                    {item.kind}
                                  </span>
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="mac-spotlight__empty">No Results</p>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
