"use client";

import { useEffect, useMemo, useState } from "react";
import Folder from "@/components/ui/folder";
import MacOSDock from "@/components/ui/mac-os-dock";
import MacOSMenuBar from "@/components/ui/mac-os-menu-bar";
import SpotlightSearch, {
  type SpotlightItem,
} from "@/components/SpotlightSearch";
import NotesApp from "@/components/NotesApp";
import NotionApp from "@/components/NotionApp";
import SpotifyApp from "@/components/SpotifyApp";
import ClaudeMascot from "@/components/ClaudeMascot";
import NotificationCentre from "@/components/NotificationCentre";
import ToastNotifications from "@/components/ToastNotifications";
import FinderApp from "@/components/FinderApp";
import IPhoneHome, { type IPhoneAppAction } from "@/components/IPhoneHome";
import { AnnotatedText } from "@/components/ui/annotated-text";
import TextRotate from "@/components/ui/text-rotate";
import type { StackNotification } from "@/components/ui/notification-stack";
import { initUiSound, playClick, playFolderClick } from "@/lib/uiSound";
import {
  FOLDER_WINDOWS,
  LINKS,
  type FolderId,
} from "@/lib/portfolioContent";
import { LayoutGroup, motion } from "motion/react";

const DOCK_APPS = [
  {
    id: "finder",
    name: "Finder",
    icon: "https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png",
  },
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

const DESKTOP_FOLDERS: { id: FolderId; label: string }[] = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
];

const APP_NAMES: Record<string, string> = Object.fromEntries(
  DOCK_APPS.map((app) => [app.id, app.name]),
);

const EXTERNAL_LINKS: Record<string, string> = {
  x: LINKS.x,
  github: LINKS.github,
  linkedin: LINKS.linkedin,
  claude: LINKS.claude,
  gmail: LINKS.gmail,
};

export default function MacDesktop() {
  const [activeApp, setActiveApp] = useState("Finder");
  const [openApps, setOpenApps] = useState<string[]>(["finder"]);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesMinimized, setNotesMinimized] = useState(false);
  const [notionOpen, setNotionOpen] = useState(false);
  const [notionMinimized, setNotionMinimized] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [absorbedToasts, setAbsorbedToasts] = useState<StackNotification[]>([]);
  const [openFolder, setOpenFolder] = useState<FolderId | null>(null);
  const [folderMinimized, setFolderMinimized] = useState(false);
  const [folderZ, setFolderZ] = useState(45);
  const [notesZ, setNotesZ] = useState(47);
  const [notionZ, setNotionZ] = useState(48);
  const [topZ, setTopZ] = useState(48);

  const bumpZ = () => {
    const next = topZ + 1;
    setTopZ(next);
    return next;
  };

  const focusFolder = (id?: FolderId | null) => {
    setFolderZ(bumpZ());
    const key =
      typeof id === "string" && id in FOLDER_WINDOWS ? id : openFolder;
    const win = key ? FOLDER_WINDOWS[key] : undefined;
    if (win) setActiveApp(win.title);
  };

  const focusNotes = () => {
    setNotesZ(bumpZ());
    setActiveApp("Notes");
  };

  const focusNotion = () => {
    setNotionZ(bumpZ());
    setActiveApp("Notion");
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
    setActiveApp("Finder");
  };

  const closeNotion = () => {
    setNotionOpen(false);
    setNotionMinimized(false);
    setOpenApps((prev) => prev.filter((id) => id !== "notion"));
    setActiveApp("Finder");
  };

  const closeSpotify = () => {
    setSpotifyOpen(false);
    setOpenApps((prev) => prev.filter((id) => id !== "spotify"));
    setActiveApp("Finder");
  };

  const spotlightItems = useMemo<SpotlightItem[]>(() => {
    const apps = DOCK_APPS.filter((app) => !app.separator).map((app) => ({
      id: app.id,
      name: app.name,
      icon: app.icon,
      kind: "Application" as const,
    }));
    const finderIcon =
      DOCK_APPS.find((app) => app.id === "finder")?.icon ?? "";
    const folders = DESKTOP_FOLDERS.map((folder) => ({
      id: `folder-${folder.id}`,
      name: folder.label,
      icon: finderIcon,
      kind: "Folder" as const,
    }));
    return [...apps, ...folders];
  }, []);

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
    setActiveApp(label ?? APP_NAMES[appId] ?? "Finder");
    setOpenApps((prev) => (prev.includes(appId) ? prev : [...prev, appId]));
  };

  const openFolderWindow = (id: FolderId) => {
    // Re-clicking the same open folder just focuses / unminimizes it
    if (openFolder === id) {
      setFolderMinimized(false);
      focusFolder(id);
      return;
    }
    setOpenFolder(id);
    setFolderMinimized(false);
    markOpen("finder", FOLDER_WINDOWS[id].title);
    focusFolder(id);
  };

  const closeFolderWindow = () => {
    setOpenFolder(null);
    setFolderMinimized(false);
    setActiveApp("Finder");
  };

  const openApp = (appId: string) => {
    if (appId === "dock-separator") return;

    if (appId === "finder") {
      if (openFolder && folderMinimized) {
        setFolderMinimized(false);
        focusFolder();
        return;
      }
      openFolderWindow("about");
      return;
    }

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
    const folderId = item.id.replace(/^folder-/, "") as FolderId;
    if (folderId === "notes") {
      openNotesWindow();
      return;
    }
    if (folderId in FOLDER_WINDOWS) openFolderWindow(folderId);
  };

  const handleMenuAction = (action: string) => {
    if (
      action === "find" ||
      action === "search-help" ||
      action === "open-location"
    ) {
      setSpotlightOpen(true);
      return;
    }
    if (action === "about") {
      openFolderWindow("about");
      return;
    }
    if (action === "new-finder") {
      openFolderWindow("projects");
    }
  };

  const handleIPhoneOpen = (action: IPhoneAppAction) => {
    if (action.type === "folder") {
      openFolderWindow(action.id);
      return;
    }
    openApp(action.id);
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
            onOpen={() => openFolderWindow(folder.id)}
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

      <IPhoneHome
        onOpen={handleIPhoneOpen}
        onStatusTap={() => setNotificationsOpen(true)}
      />

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

      <FinderApp
        open={!!openFolder}
        initialSection={openFolder ?? "about"}
        minimized={folderMinimized}
        zIndex={folderZ}
        onClose={closeFolderWindow}
        onMinimize={() => setFolderMinimized(true)}
        onFocus={() => focusFolder()}
        onSectionChange={(id) => {
          setOpenFolder(id);
          focusFolder(id);
        }}
      />

      <NotesApp
        open={notesOpen}
        minimized={notesMinimized}
        zIndex={notesZ}
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
