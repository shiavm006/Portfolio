import { SECTION_IDS, type SectionId } from "@/lib/sectionContent";

export type Point = { x: number; y: number };

export const DEFAULT_APP_NAME = "Portfolio";
export const TITLEBAR_H = 40;
export const CASCADE_STEP: Point = { x: 32, y: TITLEBAR_H };

export type SectionWindowState = {
  open: boolean;
  minimized: boolean;
  z: number;
  origin: Point;
  slot: number;
};

export type WindowManagerState = {
  windows: Record<SectionId, SectionWindowState>;
  focused: SectionId | null;
};

export type WindowAction =
  | { type: "open"; id: SectionId; z: number; base: Point }
  | { type: "focus"; id: SectionId; z: number }
  | { type: "minimize"; id: SectionId }
  | { type: "close"; id: SectionId }
  | { type: "blur" };

const closedWindow = (): SectionWindowState => ({
  open: false,
  minimized: false,
  z: 0,
  origin: { x: 0, y: 0 },
  slot: 0,
});

export function initialState(z: number, base: Point): WindowManagerState {
  const windows = Object.fromEntries(
    SECTION_IDS.map((id) => [id, closedWindow()]),
  ) as Record<SectionId, SectionWindowState>;
  // Nothing open on load. (About Me opens the Notes app, not a section window.)
  void z;
  void base;
  return { windows, focused: null };
}

export function topVisible(s: WindowManagerState): SectionId | null {
  let best: SectionId | null = null;
  for (const id of SECTION_IDS) {
    const w = s.windows[id];
    if (!w.open || w.minimized) continue;
    if (best === null || w.z > s.windows[best].z) best = id;
  }
  return best;
}

export function reducer(
  s: WindowManagerState,
  a: WindowAction,
): WindowManagerState {
  switch (a.type) {
    case "open": {
      const cur = s.windows[a.id];
      if (cur.open) {
        return {
          windows: {
            ...s.windows,
            [a.id]: { ...cur, minimized: false, z: a.z },
          },
          focused: a.id,
        };
      }
      const used = new Set(
        SECTION_IDS.filter((id) => s.windows[id].open).map(
          (id) => s.windows[id].slot,
        ),
      );
      let slot = 0;
      while (used.has(slot)) slot += 1;
      return {
        windows: {
          ...s.windows,
          [a.id]: {
            open: true,
            minimized: false,
            z: a.z,
            slot,
            origin: {
              x: a.base.x + slot * CASCADE_STEP.x,
              y: a.base.y + slot * CASCADE_STEP.y,
            },
          },
        },
        focused: a.id,
      };
    }
    case "focus": {
      const cur = s.windows[a.id];
      if (!cur.open || cur.minimized) return s;
      if (s.focused === a.id && cur.z === a.z) return s;
      return {
        windows: { ...s.windows, [a.id]: { ...cur, z: a.z } },
        focused: a.id,
      };
    }
    case "minimize": {
      const cur = s.windows[a.id];
      if (!cur.open || cur.minimized) return s;
      const next: WindowManagerState = {
        windows: { ...s.windows, [a.id]: { ...cur, minimized: true } },
        focused: s.focused,
      };
      if (s.focused === a.id) next.focused = topVisible(next);
      return next;
    }
    case "close": {
      const cur = s.windows[a.id];
      if (!cur.open) return s;
      const next: WindowManagerState = {
        windows: {
          ...s.windows,
          [a.id]: { ...cur, open: false, minimized: false },
        },
        focused: s.focused,
      };
      if (s.focused === a.id) next.focused = topVisible(next);
      return next;
    }
    case "blur":
      return s.focused === null ? s : { ...s, focused: null };
  }
}
