import type { FolderId } from "@/lib/portfolioContent";
import { isSectionId, type SectionId } from "@/lib/sectionContent";

export type FolderTarget =
  | { kind: "section"; id: SectionId }
  | { kind: "notes" }
  | { kind: "none" };

export function resolveFolderTarget(id: FolderId | string): FolderTarget {
  // "About Me" lives in the Notes app (its first note is the bio).
  if (id === "notes" || id === "about") return { kind: "notes" };
  if (isSectionId(id)) return { kind: "section", id };
  return { kind: "none" };
}

export type MenuTarget =
  | { kind: "section"; id: SectionId }
  | { kind: "notes" }
  | { kind: "spotlight" }
  | { kind: "none" };

export function resolveMenuAction(action: string): MenuTarget {
  switch (action) {
    case "about":
      return { kind: "notes" };
    case "new-finder":
      return { kind: "section", id: "projects" };
    case "find":
    case "search-help":
    case "open-location":
      return { kind: "spotlight" };
    default:
      return { kind: "none" };
  }
}
