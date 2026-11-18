"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Folder from "@/components/ui/folder";
import MacOSDock from "@/components/ui/mac-os-dock";
import MacOSMenuBar from "@/components/ui/mac-os-menu-bar";
import SpotlightSearch, {
  type SpotlightItem,
} from "@/components/SpotlightSearch";
import NotesApp from "@/components/NotesApp";
import NotionApp from "@/components/NotionApp";
import MailApp from "@/components/MailApp";
import SpotifyApp from "@/components/SpotifyApp";
import ClaudeMascot from "@/components/ClaudeMascot";
import NotificationCentre from "@/components/NotificationCentre";
import ToastNotifications from "@/components/ToastNotifications";
import SectionWindow from "@/components/SectionWindow";
import { AnnotatedText } from "@/components/ui/annotated-text";
import TextRotate from "@/components/ui/text-rotate";
import type { StackNotification } from "@/components/ui/notification-stack";
import { initUiSound, playClick, playFolderClick } from "@/lib/uiSound";
import { LINKS, type FolderId } from "@/lib/portfolioContent";
import {
  SECTIONS,
  SECTION_IDS,
  getSection,
  type SectionId,
} from "@/lib/sectionContent";
import { SECTION_ICON_SRC } from "@/components/finder/FinderIcons";
import { resolveFolderTarget, resolveMenuAction } from "@/lib/entryPoints";
import {
  DEFAULT_APP_NAME,
  initialState,
  reducer,
  topVisible,
  type Point,
} from "@/lib/windowManager";
import { LayoutGroup, motion } from "motion/react";
import { cn } from "@/lib/utils";

const DOCK_APPS = [
  {
    id: "notes",
    name: "Notes",
    icon: "https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png",
  },
  {
    id: "notion",
    name: "Notion",
    icon: "/icons/dock/notion.png",
  },
  {
    id: "gmail",
    name: "Gmail",
    icon: "/icons/dock/gmail.png",
  },
  {
    id: "spotify",
    name: "Spotify",
    icon: "/icons/dock/spotify.png",
  },
  {
    id: "claude",
    name: "Claude",
    icon: "/icons/dock/claude.png",
  },
  {
    id: "dock-separator",
    name: "",
    icon: "",
    separator: true,
  },
  {
    id: "github",
    name: "GitHub",
    icon: "/icons/dock/github.png",
  },
  {
    id: "x",
    name: "X",
    icon: "/icons/dock/x.png",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "/icons/dock/linkedin.png",
  },
];

const DESKTOP_FOLDERS: { id: SectionId; label: string }[] = SECTIONS.map(
  (section) => ({ id: section.id, label: section.name }),
);

const INITIAL_Z = 49;

type Frame = { x: number; y: number; w: number; h: number };

/**
 * Where About Me (Notes) and Experience sit when the desktop first loads.
 * Keeps clear of the folder column on the left and the dock at the bottom,
 * puts Notes top-right and Experience lower-left, and only overlaps them
 * when the screen is too narrow to fit both side by side.
 * Returns null on phones, where windows open full-screen instead.
 */
function computeLanding(): { notes: Frame; experience: Frame } | null {
  if (typeof window === "undefined") return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw <= 720 || vh < 560) return null;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, Math.round(v)));

  const left = 140; // clear of the desktop folder column
  const right = vw - 16;
  const top = 44; // just under the menu bar
  const bottom = vh - 108; // clear of the dock
  const areaW = right - left;
  const areaH = bottom - top;
  const gap = 20;

  const notesW = clamp(areaW * 0.42, 420, 620);
  const notesH = clamp(areaH * 0.62, 320, 500);

  const sideBySide = areaW - notesW - gap >= 560;
  const expW = sideBySide
    ? clamp(areaW - notesW - gap, 560, 900)
    : clamp(areaW * 0.62, 520, 900);
  const expY = top + (sideBySide ? 28 : Math.min(140, Math.round(areaH * 0.22)));
  const expH = Math.max(320, bottom - expY);

  return {
    notes: { x: right - notesW, y: top, w: notesW, h: notesH },
    experience: { x: left, y: expY, w: expW, h: expH },
  };
}

/** Where a newly opened section window starts (before cascade offset). */
function computeBase(): Point {
  if (typeof window === "undefined") return { x: 120, y: 70 };
  const w = Math.min(760, window.innerWidth - 32);
  return {
    x: Math.max(12, Math.round((window.innerWidth - w) / 2) - 60),
    y: 70,
  };
}

const APP_NAMES: Record<string, string> = Object.fromEntries(
  DOCK_APPS.map((app) => [app.id, app.name]),
);

const EXTERNAL_LINKS: Record<string, string> = {
  x: LINKS.x,
  github: LINKS.github,
  linkedin: LINKS.linkedin,
  claude: LINKS.claude,
};

export default function MacDesktop() {
  const zRef = useRef(INITIAL_Z);
  const nextZ = () => {
    zRef.current += 1;
    return zRef.current;
  };
  // Landing layout: About Me (Notes) and Experience open on arrival.
  const [landing] = useState(computeLanding);
  const [wm, dispatch] = useReducer(reducer, undefined, () =>
    initialState(INITIAL_Z, computeBase()),
  );
  // Set once the visitor opens anything, so the timed landing never
  // pops windows over something they chose themselves.
  const userOpenedRef = useRef(false);
  const [activeApp, setActiveApp] = useState(DEFAULT_APP_NAME);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesMinimized, setNotesMinimized] = useState(false);
  const [notionOpen, setNotionOpen] = useState(false);
  const [notionMinimized, setNotionMinimized] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [mailMinimized, setMailMinimized] = useState(false);
  const [mailZ, setMailZ] = useState(49);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [absorbedToasts, setAbsorbedToasts] = useState<StackNotification[]>([]);
  const [notesZ, setNotesZ] = useState(INITIAL_Z);
  const [notionZ, setNotionZ] = useState(48);

  /** After a non-section app closes, hand focus back to the top section window. */
  const refocusSections = () => {
    const top = topVisible(wm);
    if (top) {
      dispatch({ type: "focus", id: top, z: nextZ() });
      setActiveApp(getSection(top).name);
    } else {
      setActiveApp(DEFAULT_APP_NAME);
    }
  };

  const openSection = (id: SectionId) => {
    userOpenedRef.current = true;
    dispatch({ type: "open", id, z: nextZ(), base: computeBase() });
    setActiveApp(getSection(id).name);
  };

  const focusSection = (id: SectionId) => {
    dispatch({ type: "focus", id, z: nextZ() });
    setActiveApp(getSection(id).name);
  };

  const minimizeSection = (id: SectionId) => {
    const next = reducer(wm, { type: "minimize", id });
    dispatch({ type: "minimize", id });
    setActiveApp(
      next.focused ? getSection(next.focused).name : DEFAULT_APP_NAME,
    );
  };

  const closeSection = (id: SectionId) => {
    const next = reducer(wm, { type: "close", id });
    dispatch({ type: "close", id });
    setActiveApp(
      next.focused ? getSection(next.focused).name : DEFAULT_APP_NAME,
    );
  };

  const focusNotes = () => {
    setNotesZ(nextZ());
    dispatch({ type: "blur" });
    setActiveApp("Notes");
  };

  const focusNotion = () => {
    setNotionZ(nextZ());
    dispatch({ type: "blur" });
    setActiveApp("Notion");
  };

  const focusMail = () => {
    setMailZ(nextZ());
    dispatch({ type: "blur" });
    setActiveApp("Gmail");
  };

  const closeMail = () => {
    setMailOpen(false);
    setMailMinimized(false);
    setOpenApps((prev) => prev.filter((id) => id !== "gmail"));
    refocusSections();
  };

  const openNotesWindow = () => {
    markOpen("notes");
    setNotesOpen(true);
    setNotesMinimized(false);
    focusNotes();
  };

  const openNotionWindow = () => {
    markOpen("notion");
    setNotionOpen(true);
    setNotionMinimized(false);
    focusNotion();
  };

  const closeNotes = () => {
    setNotesOpen(false);
    setNotesMinimized(false);
    setOpenApps((prev) => prev.filter((id) => id !== "notes"));
    refocusSections();
  };

  const closeNotion = () => {
    setNotionOpen(false);
    setNotionMinimized(false);
    setOpenApps((prev) => prev.filter((id) => id !== "notion"));
    refocusSections();
  };

  const closeSpotify = () => {
    setSpotifyOpen(false);
    setOpenApps((prev) => prev.filter((id) => id !== "spotify"));
    refocusSections();
  };

  const spotlightItems = useMemo<SpotlightItem[]>(() => {
    const apps = DOCK_APPS.filter((app) => !app.separator).map((app) => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      kind: "Application" as const,
    }));
    const folders = DESKTOP_FOLDERS.map((folder) => ({
      id: `folder-${folder.id}`,
      name: folder.label,
      icon: SECTION_ICON_SRC[folder.id],
      kind: "Folder" as const,
    }));
    return [...apps, ...folders];
  }, []);

  // Landing: 3 s after the desktop appears, open Experience, then About Me
  // (Notes) in front of it. Skipped if the visitor already opened something.
  useEffect(() => {
    if (!landing) return;
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        if (userOpenedRef.current) return;
        const { x, y } = landing.experience;
        zRef.current += 1;
        dispatch({ type: "open", id: "experience", z: zRef.current, base: { x, y } });
        dispatch({ type: "blur" });

        timers.push(
          window.setTimeout(() => {
            if (userOpenedRef.current) return;
            zRef.current += 1;
            setNotesZ(zRef.current);
            setNotesMinimized(false);
            setNotesOpen(true);
            setOpenApps((prev) => (prev.includes("notes") ? prev : [...prev, "notes"]));
            setActiveApp("Notes");
          }, 450),
        );
      }, 3000),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [landing]);

  useEffect(() => {
    initUiSound();

    const onKeyDown = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setNotificationsOpen(false);
        setSpotlightOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as Element | null;
      if (!target?.closest) return;

      if (target.closest('[data-ui-sound="folder"]')) {
        playFolderClick();
        return;
      }

      const clickable = target.closest(
        'button, a, [role="button"], [data-ui-sound], .mac-dock [title], .mac-menubar-wrap .cursor-pointer',
      );
      if (!clickable) return;
      playClick();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  const markOpen = (appId: string, label?: string) => {
    userOpenedRef.current = true;
    setActiveApp(label ?? APP_NAMES[appId] ?? DEFAULT_APP_NAME);
    setOpenApps((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
  };

  const openFolderTarget = (id: FolderId | string) => {
    const target = resolveFolderTarget(id);
    if (target.kind === "section") openSection(target.id);
    else if (target.kind === "notes") openNotesWindow();
  };

  const openApp = (appId: string) => {
    if (appId === "dock-separator") return;

    if (appId === "notes") {
      if (notesOpen && notesMinimized) {
        setNotesMinimized(false);
        focusNotes();
        return;
      }
      openNotesWindow();
      return;
    }

    if (appId === "notion") {
      if (notionOpen && notionMinimized) {
        setNotionMinimized(false);
        focusNotion();
        return;
      }
      openNotionWindow();
      return;
    }

    if (appId === "gmail") {
      markOpen("gmail");
      setMailOpen(true);
      setMailMinimized(false);
      focusMail();
      return;
    }

    if (appId === "spotify") {
      if (spotifyOpen) {
        closeSpotify();
        return;
      }
      markOpen("spotify");
      setSpotifyOpen(true);
      return;
    }

    const link = EXTERNAL_LINKS[appId];
    if (link) {
      markOpen(appId);
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const handleSpotlightSelect = (item: SpotlightItem) => {
    if (item.kind === "Application") {
      openApp(item.id);
      return;
    }
    setSpotlightOpen(false);
    openFolderTarget(item.id.replace(/^folder-/, ""));
  };

  const handleMenuAction = (action: string) => {
    const target = resolveMenuAction(action);
    if (target.kind === "spotlight") setSpotlightOpen(true);
    else if (target.kind === "notes") openNotesWindow();
    else if (target.kind === "section") openSection(target.id);
  };

  return (
    <div className="mac-desktop" aria-label="macOS desktop">
      <div className="mac-desktop__wallpaper" aria-hidden />

      <header className="mac-menubar-wrap mac-desktop-only">
        <MacOSMenuBar
          appName={activeApp}
          onMenuAction={handleMenuAction}
          clockActive={notificationsOpen}
          notificationCount={4 + absorbedToasts.length}
          onClockClick={() => setNotificationsOpen((v) => !v)}
        />
      </header>

      <div className="mac-desktop__icons mac-desktop-only">
        {DESKTOP_FOLDERS.map((folder) => (
          <Folder
            key={folder.id}
            label={folder.label}
            onOpen={() => openFolderTarget(folder.id)}
          />
        ))}
      </div>

      <div
        className="mac-desktop__hero mac-desktop-only"
        aria-label="Product engineer"
      >
        <div className="mac-desktop__hero-stack">
          <p className="mac-desktop__hero-kicker">
            Can&apos;t pick{" "}
            <AnnotatedText variant="circle" animate delay={120}>
              one title
            </AnnotatedText>
            , so I{" "}
            <AnnotatedText variant="highlight" animate delay={420}>
              rotate
            </AnnotatedText>{" "}
            between.
          </p>
          <LayoutGroup>
            <motion.div
              className="mac-desktop__hero-line"
              layout
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
            >
              <TextRotate
                as="span"
                texts={["Product", "GTM", "Applied AI", "Growth"]}
                mainClassName="mac-desktop__hero-rotate"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2200}
              />
              <motion.span
                className="mac-desktop__hero-role"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                engineer
              </motion.span>
            </motion.div>
          </LayoutGroup>
        </div>
      </div>

      <div className="mac-desktop-only">
        <ClaudeMascot onClick={() => openApp("claude")} />
      </div>

      <ToastNotifications
        paused={
          notificationsOpen || spotlightOpen || notesOpen || notionOpen
        }
        onOpenCentre={() => setNotificationsOpen(true)}
        onAbsorbIntoCentre={(notes) => setAbsorbedToasts(notes)}
      />

      <NotificationCentre
        open={notificationsOpen}
        absorbed={absorbedToasts}
        onClose={() => {
          setNotificationsOpen(false);
          setAbsorbedToasts([]);
        }}
      />

      <div className="mac-desktop__windows has-tabs">
        {/* Phone navigation: one tab per section, replaces the desktop folders */}
        <nav className="ph-tabs" aria-label="Sections">
          {SECTION_IDS.map((id) => {
            const state = wm.windows[id];
            const active = wm.focused === id && !state.minimized;
            return (
              <button
                key={id}
                type="button"
                aria-current={active ? "page" : undefined}
                data-ui-sound="click"
                className={cn(
                  "ph-tab",
                  active && "is-active",
                  state.open && !active && "is-open",
                )}
                onClick={() => openFolderTarget(id)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SECTION_ICON_SRC[id]} alt="" draggable={false} />
                {getSection(id).name}
              </button>
            );
          })}
        </nav>
        {SECTION_IDS.map((id) => (
          <SectionWindow
            key={id}
            section={getSection(id)}
            windowState={wm.windows[id]}
            focused={wm.focused === id}
            zIndex={wm.windows[id].z}
            frameSize={
              id === "experience" && landing
                ? { w: landing.experience.w, h: landing.experience.h }
                : undefined
            }
            onClose={() => closeSection(id)}
            onMinimize={() => minimizeSection(id)}
            onFocus={() => {
              if (wm.focused !== id) focusSection(id);
            }}
          />
        ))}

        <NotesApp
          open={notesOpen}
          minimized={notesMinimized}
          zIndex={notesZ}
          focused={activeApp === "Notes"}
          initialPosition={
            landing ? { x: landing.notes.x, y: landing.notes.y } : undefined
          }
          width={landing?.notes.w}
          height={landing?.notes.h}
          onClose={closeNotes}
          onMinimize={() => setNotesMinimized(true)}
          onFocus={focusNotes}
        />

        <NotionApp
          open={notionOpen}
          minimized={notionMinimized}
          zIndex={notionZ}
          onClose={closeNotion}
          onMinimize={() => setNotionMinimized(true)}
          onFocus={focusNotion}
        />

        <MailApp
          open={mailOpen}
          minimized={mailMinimized}
          zIndex={mailZ}
          onClose={closeMail}
          onMinimize={() => setMailMinimized(true)}
          onFocus={focusMail}
        />
      </div>

      <SpotifyApp open={spotifyOpen} onClose={closeSpotify} />

      <SpotlightSearch
        open={spotlightOpen}
        onOpenChange={setSpotlightOpen}
        items={spotlightItems}
        onSelect={handleSpotlightSelect}
      />

      <nav className="mac-dock mac-desktop-only" aria-label="Dock">
        <MacOSDock
          apps={DOCK_APPS}
          onAppClick={openApp}
          openApps={openApps}
        />
      </nav>
    </div>
  );
}
