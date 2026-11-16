"use client";

import { useEffect, useState } from "react";
import type { FolderId } from "@/lib/portfolioContent";

export type IPhoneAppAction =
  | { type: "folder"; id: FolderId }
  | { type: "app"; id: string };

type HomeApp = {
  id: string;
  label: string;
  src: string;
  action: IPhoneAppAction;
};

const IOS = "/icons/ios";

/** Apple-style home apps — titles match real iOS apps, wired to portfolio actions */
const HOME_APPS: HomeApp[] = [
  {
    id: "contacts",
    label: "Contacts",
    src: `${IOS}/Contacts.png`,
    action: { type: "folder", id: "about" },
  },
  {
    id: "files",
    label: "Files",
    src: `${IOS}/Files.png`,
    action: { type: "folder", id: "projects" },
  },
  {
    id: "shortcuts",
    label: "Shortcuts",
    src: `${IOS}/Shortcuts.png`,
    action: { type: "folder", id: "skills" },
  },
  {
    id: "pages",
    label: "Pages",
    src: `${IOS}/Pages.png`,
    action: { type: "folder", id: "resume" },
  },
  {
    id: "notes",
    label: "Notes",
    src: `${IOS}/Notes.png`,
    action: { type: "app", id: "notes" },
  },
  {
    id: "mail",
    label: "Mail",
    src: `${IOS}/Mail.png`,
    action: { type: "app", id: "gmail" },
  },
  {
    id: "safari",
    label: "Safari",
    src: `${IOS}/Safari.png`,
    action: { type: "app", id: "github" },
  },
  {
    id: "music",
    label: "Music",
    src: `${IOS}/Music.png`,
    action: { type: "app", id: "spotify" },
  },
  {
    id: "facetime",
    label: "FaceTime",
    src: `${IOS}/FaceTime.png`,
    action: { type: "app", id: "linkedin" },
  },
  {
    id: "appstore",
    label: "App Store",
    src: `${IOS}/AppStore.png`,
    action: { type: "app", id: "notion" },
  },
  {
    id: "maps",
    label: "Maps",
    src: `${IOS}/Maps.png`,
    action: { type: "app", id: "x" },
  },
  {
    id: "reminders",
    label: "Reminders",
    src: `${IOS}/Reminders.png`,
    action: { type: "app", id: "terminal" },
  },
];

const DOCK_APPS: HomeApp[] = [
  {
    id: "phone",
    label: "Phone",
    src: `${IOS}/Phone.png`,
    action: { type: "folder", id: "about" },
  },
  {
    id: "safari-dock",
    label: "Safari",
    src: `${IOS}/Safari.png`,
    action: { type: "app", id: "github" },
  },
  {
    id: "messages",
    label: "Messages",
    src: `${IOS}/Messages.png`,
    action: { type: "app", id: "notes" },
  },
  {
    id: "music-dock",
    label: "Music",
    src: `${IOS}/Music.png`,
    action: { type: "app", id: "spotify" },
  },
];

function AppIcon({
  app,
  onOpen,
  showLabel = true,
}: {
  app: HomeApp;
  onOpen: (action: IPhoneAppAction) => void;
  showLabel?: boolean;
}) {
  return (
    <button
      type="button"
      className="ios-app"
      data-ui-sound="click"
      onClick={() => onOpen(app.action)}
    >
      <span className="ios-app__icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={app.src} alt="" draggable={false} />
      </span>
      {showLabel ? <span className="ios-app__label">{app.label}</span> : null}
    </button>
  );
}

type IPhoneHomeProps = {
  onOpen: (action: IPhoneAppAction) => void;
  onStatusTap?: () => void;
};

export default function IPhoneHome({ onOpen, onStatusTap }: IPhoneHomeProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="ios-shell" aria-label="iPhone home screen">
      <header className="ios-status">
        <button
          type="button"
          className="ios-status__time"
          data-ui-sound="click"
          onClick={onStatusTap}
          aria-label="Open notifications"
        >
          {time}
        </button>
        <div className="ios-status__pill" aria-hidden>
          <span className="ios-status__pill-cam" />
        </div>
        <div className="ios-status__right" aria-hidden>
          <span className="ios-status__bars">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span className="ios-status__wifi" />
          <span className="ios-status__battery">
            <span />
          </span>
        </div>
      </header>

      <div className="ios-home">
        <div className="ios-home__grid">
          {HOME_APPS.map((app) => (
            <AppIcon key={app.id} app={app} onOpen={onOpen} />
          ))}
        </div>
      </div>

      <nav className="ios-dock" aria-label="iPhone dock">
        <div className="ios-dock__glass">
          {DOCK_APPS.map((app) => (
            <AppIcon key={app.id} app={app} onOpen={onOpen} showLabel={false} />
          ))}
        </div>
        <div className="ios-home-indicator" aria-hidden />
      </nav>
    </div>
  );
}
