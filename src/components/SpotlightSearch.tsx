"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

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

function SpotlightPlaceholder({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "absolute inset-y-0 left-0 flex items-center pointer-events-none z-10 text-gray-500",
        className,
      )}
    >
      <AnimatePresence mode="popLayout">
        <motion.p
          key={text}
          layoutId={`spotlight-placeholder-${text}`}
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="m-0"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}

function SpotlightInput({
  placeholder,
  hidePlaceholder,
  value,
  onChange,
  placeholderClassName,
}: {
  placeholder: string;
  hidePlaceholder: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholderClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="flex items-center w-full justify-start gap-2 px-6 h-16">
      <motion.div layoutId="spotlight-search-icon" className="shrink-0">
        <Search className="size-7 stroke-[1.4]" />
      </motion.div>
      <div className="flex-1 relative text-2xl">
        {!hidePlaceholder ? (
          <SpotlightPlaceholder
            text={placeholder}
            className={placeholderClassName}
          />
        ) : null}
        <motion.input
          ref={inputRef}
          layout="position"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none border-0 p-0 text-black caret-black"
          aria-label="Spotlight Search"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function SearchResultRow({
  item,
  active,
  isLast,
  onHover,
  onChoose,
}: {
  item: SpotlightItem;
  active: boolean;
  isLast: boolean;
  onHover: () => void;
  onChoose: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onChoose}
      className={cn(
        "flex items-center text-black justify-start gap-3 py-2 px-2 rounded-xl w-full appearance-none border-0 bg-transparent text-left cursor-default",
        active && "bg-white shadow-md",
        isLast && "rounded-b-3xl",
      )}
    >
      <span className="size-8 aspect-square flex items-center justify-center shrink-0">
        {item.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt=""
            width={28}
            height={28}
            className="size-7 object-contain"
            draggable={false}
          />
        ) : (
          <span className="size-7 rounded-md bg-neutral-300" />
        )}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="font-medium truncate">{item.name}</span>
        <span className="text-xs opacity-50">{item.kind}</span>
      </span>
      <span
        className={cn(
          "flex-1 flex items-center justify-end transition-opacity duration-200",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        <ChevronRight className="size-6" />
      </span>
    </button>
  );
}

export default function SpotlightSearch({
  open,
  onOpenChange,
  items,
  onSelect,
}: SpotlightSearchProps) {
  const [query, setQuery] = useState("");
  const [hoveredResult, setHoveredResult] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [items, query]);

  const close = useCallback(() => {
    setQuery("");
    setHoveredResult(null);
    setActiveIndex(0);
    onOpenChange(false);
  }, [onOpenChange]);

  const choose = useCallback(
    (item: SpotlightItem) => {
      onSelect(item);
      close();
    },
    [close, onSelect],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setHoveredResult(null);
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (!results.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        choose(results[activeIndex]!);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, choose, close, open, results]);

  const placeholder =
    hoveredResult !== null && results[hoveredResult]
      ? results[hoveredResult]!.name
      : "Search";

  return (
    <AnimatePresence mode="popLayout">
      {open ? (
        <div
          className="mac-spotlight absolute inset-0 z-[80] flex flex-col items-center justify-start pt-[25vh] pointer-events-auto"
          onClick={close}
          role="presentation"
        >
          <div
            className="w-full flex flex-col max-w-xl px-4 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{
                opacity: 0,
                filter: "blur(16px)",
                scaleX: 1.18,
                scaleY: 1.08,
                y: -10,
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                scaleX: 1,
                scaleY: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                filter: "blur(16px)",
                scaleX: 1.18,
                scaleY: 1.08,
                y: 10,
              }}
              transition={{ stiffness: 550, damping: 50, type: "spring" }}
              className="w-full flex items-center justify-center z-20"
            >
              <motion.div
                layout
                transition={{
                  layout: { duration: 0.45, type: "spring", bounce: 0.2 },
                }}
                style={{ borderRadius: query.trim() ? 28 : 999 }}
                className="h-full w-full flex flex-col items-center justify-start z-10 relative shadow-[0_12px_40px_rgba(0,0,0,0.28)] overflow-hidden border border-white/40 bg-neutral-100/95 text-black backdrop-blur-xl"
                role="dialog"
                aria-modal="true"
                aria-label="Spotlight Search"
              >
                <SpotlightInput
                  placeholder={placeholder}
                  placeholderClassName={
                    hoveredResult !== null
                      ? "text-black"
                      : "text-gray-500"
                  }
                  hidePlaceholder={!(hoveredResult !== null || !query)}
                  value={query}
                  onChange={setQuery}
                />

                <AnimatePresence initial={false}>
                  {query.trim() ? (
                    <motion.div
                      key="results"
                      layout
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="w-full overflow-hidden border-t border-black/10 bg-neutral-100"
                    >
                      <div
                        className="px-2 flex flex-col max-h-80 overflow-y-auto w-full py-2"
                        onMouseLeave={() => setHoveredResult(null)}
                      >
                        {results.length > 0 ? (
                          results.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{
                                delay: index * 0.04,
                                duration: 0.2,
                                ease: "easeOut",
                              }}
                            >
                              <SearchResultRow
                                item={item}
                                active={
                                  index === activeIndex ||
                                  index === hoveredResult
                                }
                                isLast={index === results.length - 1}
                                onHover={() => {
                                  setHoveredResult(index);
                                  setActiveIndex(index);
                                }}
                                onChoose={() => choose(item)}
                              />
                            </motion.div>
                          ))
                        ) : (
                          <p className="m-0 px-3 py-4 text-center text-sm text-black/40">
                            No Results
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
