"use client";

import { useEffect, useMemo, useState } from "react";
import Folder from "@/components/ui/folder";
import MacOSDock from "@/components/ui/mac-os-dock";
import MacOSMenuBar from "@/components/ui/mac-os-menu-bar";
import SpotlightSearch, {
  type SpotlightItem,
} from "@/components/SpotlightSearch";
import TerminalApp from "@/components/TerminalApp";
import ClaudeMascot from "@/components/ClaudeMascot";
import NotificationCentre from "@/components/NotificationCentre";
import ToastNotifications from "@/components/ToastNotifications";
import TextRotate from "@/components/ui/text-rotate";
import { initUiSound, playClick, playFolderClick } from "@/lib/uiSound";
import { LayoutGroup, motion } from "motion/react";

const APP_LINKS: Record<string, string> = {
  x: "https://x.com/Shivammitt2312",
  github: "https://github.com/shiavm006",
  linkedin: "https://www.linkedin.com/in/shivam-mittal-464a9031a/",
  claude: "https://claude.ai/",
};

const DOCK_APPS = [
  {
    id: "finder",
    name: "Finder",
    icon: "https://cdn.21st.dev/assets/mirror/99/9963f31f43cd77b0c28981ba7bac04db749a5749019f554d1afb75225a3e9151.png",
  },
  {
    id: "terminal",
    name: "Terminal",
    icon: "https://cdn.21st.dev/assets/mirror/11/11d8587bae8852b8232d1f37e318c4b0fbbd2b0f2b61c71a79dbae327b4fa0c1.webp",
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

const DESKTOP_FOLDERS = [
  { id: "about", label: "About Me" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "resume", label: "Resume" },
];

const APP_NAMES: Record<string, string> = Object.fromEntries(
  DOCK_APPS.map((app) => [app.id, app.name]),
);

export default function MacDesktop() {
  const [activeApp, setActiveApp] = useState("Finder");
  const [openApps, setOpenApps] = useState<string[]>(["finder"]);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
      // ⌘K always works in browser; ⌘Space may be taken by system Spotlight
      if (meta && (e.key === "k" || e.key === "K" || e.code === "Space")) {
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
      // Only primary button / touch
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as Element | null;
      if (!target?.closest) return;

      // Folders get their own sound
      if (target.closest('[data-ui-sound="folder"]')) {
        playFolderClick();
        return;
      }

      // Only real controls — not empty desktop / wallpaper
      const clickable = target.closest(
        'button, a, [role="button"], [data-ui-sound], .mac-dock [title], .mac-menubar-wrap .cursor-pointer',
      );
      if (!clickable) return;
      playClick();
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  const openApp = (appId: string) => {
    setActiveApp(APP_NAMES[appId] ?? "Finder");
    setOpenApps((prev) => (prev.includes(appId) ? prev : [...prev, appId]));

    if (appId === "terminal") {
      setTerminalOpen(true);
      return;
    }

    const link = APP_LINKS[appId];
    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  const closeTerminal = () => {
    setTerminalOpen(false);
    setOpenApps((prev) => prev.filter((id) => id !== "terminal"));
    setActiveApp("Finder");
  };

  const handleAppClick = (appId: string) => {
    if (appId === "dock-separator") return;
    openApp(appId);
  };

  const handleSpotlightSelect = (item: SpotlightItem) => {
    if (item.kind === "Application") {
      openApp(item.id);
      return;
    }
    setActiveApp(item.name);
  };

  const handleMenuAction = (action: string) => {
    if (
      action === "find" ||
      action === "search-help" ||
      action === "open-location"
    ) {
      setSpotlightOpen(true);
    }
  };

  return (
    <div className="mac-desktop" aria-label="macOS desktop">
      <div className="mac-desktop__wallpaper" aria-hidden />

      <header className="mac-menubar-wrap">
        <MacOSMenuBar
          appName={activeApp}
          onMenuAction={handleMenuAction}
          clockActive={notificationsOpen}
          notificationCount={5}
          onClockClick={() => setNotificationsOpen((v) => !v)}
        />
      </header>

      <div className="mac-desktop__icons">
        {DESKTOP_FOLDERS.map((folder) => (
          <Folder
            key={folder.id}
            label={folder.label}
            onOpenChange={(open) => {
              if (open) setActiveApp(folder.label);
            }}
          />
        ))}
      </div>

      <div className="mac-desktop__hero" aria-label="Product engineer">
        <LayoutGroup>
          <motion.p
            className="mac-desktop__hero-line"
            layout
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            <TextRotate
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
          </motion.p>
        </LayoutGroup>
      </div>

      <ClaudeMascot onClick={() => openApp("claude")} />

      <ToastNotifications
        paused={notificationsOpen || spotlightOpen || terminalOpen}
        onOpenCentre={() => setNotificationsOpen(true)}
      />

      <NotificationCentre
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <TerminalApp
        open={terminalOpen}
        onClose={closeTerminal}
        onFocus={() => setActiveApp("Terminal")}
      />

      <SpotlightSearch
        open={spotlightOpen}
        onOpenChange={setSpotlightOpen}
        items={spotlightItems}
        onSelect={handleSpotlightSelect}
      />

      <nav className="mac-dock" aria-label="Dock">
        <MacOSDock
          apps={DOCK_APPS}
          onAppClick={handleAppClick}
          openApps={openApps}
        />
      </nav>
    </div>
  );
}
