# Implementation Plan: PostHog-Style Section Windows

## Overview

Replace the Finder window with five independent Section Windows. The language is TypeScript/React (Next.js App Router, client components). Pure logic comes first (`sectionContent`, `windowGeometry`, `windowManager`, `entryPoints`). Then `MacWindow` gets its optional props, `SectionWindow` and its styles are built, and `MacDesktop` is wired to them. Finder code is removed last, once nothing references it, so the build stays green after each step.

## Tasks

- [ ] 1. Prerequisites and checks
  - [ ] 1.1 Read the relevant Next.js docs before writing any code
    - Per `AGENTS.md`, read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` and `11-css.md`
    - Note any deprecations or breaking changes that affect client components, `"use client"` boundaries or global CSS imports
    - _Requirements: Introduction (AGENTS.md constraint), 9.5_

  - [ ] 1.2 Check `src/components/IPhoneHome.tsx` for a Finder app action
    - Search for `id: "finder"` and any `type: "app"` action that points to Finder. A grep during planning found no `finder` match in this file
    - If one exists, convert it to `{ type: "folder", id: "about" }`; if none exists, make no change and record that in the task notes
    - Confirm `type: "folder"` actions only use Section_Ids or `"notes"`
    - _Requirements: 8.5, 8.6, 8.8_

  - [ ]* 1.3 Set up vitest and fast-check
    - Add `vitest`, `fast-check`, `jsdom` and `@testing-library/react` as dev dependencies
    - Add `"test": "vitest --run"` to `package.json` and a `vitest.config.ts` with the `@` path alias and tests under `src/**/*.test.ts(x)`
    - _Requirements: 9.5_

- [ ] 2. Shared section content
  - [ ] 2.1 Create `src/lib/sectionContent.ts`
    - Move `SECTIONS` and the item, group and section types out of `FinderApp.tsx` (renamed without "Finder"), keeping the data unchanged
    - Export `SectionId`, `SECTION_IDS`, `getSection`, `sectionItemsOf`, `experienceInfoRows` and `isSectionId`
    - Make `FinderApp.tsx` import `SECTIONS` from this module so the build keeps passing until Finder is removed
    - No JSX and no React import in the module
    - _Requirements: 1.1, 6.1, 6.4_

  - [ ]* 2.2 Write property test for section coverage
    - **Property 10: Sections cover every id exactly once and keep their items**
    - **Validates: Requirements 1.1, 6.1**

  - [ ]* 2.3 Write property test for experience info rows
    - **Property 11: Experience details show every field**
    - **Validates: Requirements 6.1**

- [ ] 3. Pure window logic
  - [ ] 3.1 Create `src/lib/windowGeometry.ts`
    - Extract the clamp and resize math from `MacWindow` as `clampPos` and `resizeFrame`
    - Export `MIN_W`, `MIN_H`, `MENUBAR_H`, `TITLEBAR_H` and the `Point`, `Size`, `Viewport` and `ResizeEdge` types
    - Accept an optional `min` size so Section Windows can use 360 x 280
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 3.2 Write property tests for geometry
    - **Property 8: Dragging keeps the title bar visible**
    - **Property 9: Resizing respects the minimum size and the viewport**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

  - [ ] 3.3 Create `src/lib/windowManager.ts`
    - Implement `reducer` with the `open`, `focus`, `minimize`, `close` and `blur` actions, plus `initialState`, `menuName`, `topVisible`, `CASCADE_STEP` and `DEFAULT_APP_NAME = "Portfolio"`
    - Follow the slot and cascade rules in the design: reopening an open window keeps its origin and slot, and a closed window gets a new slot-derived origin
    - Ignore `focus`, `minimize` and `close` for windows that are closed
    - _Requirements: 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 3.6, 5.1, 5.2, 5.6, 5.7, 5.8, 8.7_

  - [ ]* 3.4 Write property tests for the window manager
    - **Property 1: Opening a section focuses exactly one window for it**
    - **Property 2: Focus raises above everything, including other apps**
    - **Property 3: Menu bar name follows the focused window**
    - **Property 4: Cascade keeps every open title bar visible**
    - **Property 5: Closing refocuses the topmost visible window**
    - **Property 6: Minimize then open round trip keeps the frame**
    - **Property 7: Close then open resets the window**
    - Write each property as its own `it` block
    - **Validates: Requirements 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 3.6, 5.1, 5.2, 5.6, 5.7, 5.8, 8.7, 9.2, 9.3**

  - [ ] 3.5 Create `src/lib/entryPoints.ts`
    - Implement `resolveFolderTarget` and `resolveMenuAction` as specified: `about` to the about section, `new-finder` to projects, `find`, `search-help` and `open-location` to Spotlight, anything else to `none`
    - Return `notes` only for the `"notes"` folder id
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.8_

  - [ ]* 3.6 Write property test for entry point resolution
    - **Property 12: Entry points resolve to the matching window**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.8**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Window frame and icons
  - [ ] 5.1 Add optional props to `MacWindow.tsx`
    - Add `minWidth` (default 360), `minHeight` (default 240), `initialPosition` and `focused` (default true; `false` adds `is-inactive`)
    - Use `initialPosition` instead of centering on first open when not on mobile
    - Replace the inline clamp and resize code with `windowGeometry`, and change the root `onMouseDown` to `onPointerDown`
    - Keep existing callers (Notes, Notion, Gmail) working unchanged
    - _Requirements: 3.1, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5, 4.7, 5.2, 5.3, 5.4, 5.8_

  - [ ] 5.2 Add `SECTION_ICON_SRC` to `FinderIcons.tsx`
    - Export a `Record<SectionId, string>` with the five `/icons/finder/sidebar-*.png` paths
    - Leave the existing icons and view-mode icons in place for now
    - _Requirements: 2.4, 6.3_

  - [ ]* 5.3 Write unit tests for `MacWindow` behavior
    - Test that `focused={false}` adds `is-inactive`, that zooming twice restores the frame, that closing resets zoom on reopen, that `innerWidth = 700` opens zoomed, and that a zoomed window has no resize handles
    - _Requirements: 3.5, 4.5, 4.7, 5.3, 5.4, 5.8_

- [ ] 6. Section window component and styles
  - [ ] 6.1 Create `src/components/SectionWindow.tsx`
    - Wrap `MacWindow` with `chrome="none"`, `minWidth={360}`, `minHeight={280}`, `initialPosition` from the window state and the `ph-window` class names
    - Add `SectionChrome`, which uses `useMacWindowChrome()` and has a `data-mac-drag` title bar with the section icon, the title, and minimize, maximize/restore and close buttons (`data-no-drag`, `data-ui-sound="click"`, `aria-label`)
    - Toggle zoom on title-bar double-click, ignoring events from inside `[data-no-drag]`
    - Render the fixed layout per section: about (`AboutBio` with links), experience (list plus detail pane using `experienceInfoRows`), projects and resume (card list), skills (grouped tile grid with a detail strip)
    - Carry over select on click, `window.open(link)` on double-click, and the `IconFolderLarge` fallback for missing icons
    - _Requirements: 1.2, 1.6, 2.1, 2.2, 2.3, 2.4, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.5, 9.4_

  - [ ] 6.2 Add PostHog-inspired styles to `mac-desktop.css`
    - Add the `.ph-window` custom properties, hard-offset shadow, inactive state, title bar, controls and per-section layout rules
    - Add `.ph-window__content { overflow-y: auto; min-height: 0 }` so the title bar stays fixed
    - Add `.mac-desktop__windows` with `z-index: 45` and `pointer-events: none`, and `pointer-events: auto` on its children
    - Use no PostHog logo, mascot or asset
    - _Requirements: 2.1, 2.2, 2.3, 3.4, 3.5, 6.5_

  - [ ]* 6.3 Write component tests for `SectionWindow`
    - Test the title text, section icon, three controls, `data-ui-sound="click"` on controls and items, `AboutBio` with the links row in the about window, no drag start when a control is pressed, and zoom toggle on title-bar double-click
    - _Requirements: 2.1, 2.4, 4.6, 5.5, 6.2, 9.4_

- [ ] 7. Wire the desktop
  - [ ] 7.1 Update `MacDesktop.tsx` to use the Section Windows
    - Replace `topZ`/`bumpZ` with a `zRef` counter, and make `focusNotes`, `focusNotion` and `focusMail` call it and dispatch `blur`
    - Add `useReducer(reducer, ...)` with `about` open and focused, plus `openSection(id)` that dispatches `open` and sets `activeApp`
    - Derive `activeApp` from `wm.focused` in a `useEffect`, set the initial `activeApp` to `"About Me"`, and use `DEFAULT_APP_NAME` in place of `"Finder"` when closing Notes, Notion, Gmail and Spotify (refocus the top visible section if any)
    - Remove `openFolder`, `folderMinimized`, `folderZ`, the `finder` entry in `DOCK_APPS`, the `FinderApp` element and the `finder` branch in `openApp`
    - Derive `DESKTOP_FOLDERS` from `SECTIONS` and use `SECTION_ICON_SRC` for Spotlight folder results
    - Route Desktop folder icons, Spotlight (`handleSpotlightSelect`, closing Spotlight for folders), Menu_Bar (`handleMenuAction`) and iPhone_Home (`handleIPhoneOpen`) through `resolveFolderTarget`/`resolveMenuAction`
    - Render `SectionWindow` x5, Notes, Notion and Mail inside one `.mac-desktop__windows` container, keeping Spotify outside it
    - _Requirements: 1.3, 1.4, 1.5, 3.1, 3.2, 3.3, 3.4, 5.6, 5.7, 7.1, 7.3, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 9.1, 9.2, 9.3_

  - [ ] 7.2 Update the menu bar default name
    - Change the `appName` default in `ui/mac-os-menu-bar.tsx` from `"Finder"` to `DEFAULT_APP_NAME`; leave menu item labels unchanged
    - _Requirements: 7.4, 8.7_

  - [ ] 7.3 Update user-facing Finder text
    - `NotesApp.tsx` (line ~31): "Folders on the right open Finder windows." becomes "Folders on the right open section windows."
    - `NotionApp.tsx` (lines ~87, 166, 251): replace each Finder reference with section windows wording
    - _Requirements: 7.5_

  - [ ] 7.4 Remove Finder code and styles
    - Delete `FinderApp.tsx`, and remove `FOLDER_WINDOWS` and its `AboutBio` import from `portfolioContent.tsx` (keep `LINKS` and `FolderId`)
    - Remove `IconViewIcons`, `IconViewList`, `IconViewColumns` and `IconViewGallery` from `FinderIcons.tsx`
    - Remove `.mac-window--finder`, `.mac-finder*` and `.mac-finder-body` rules from `mac-desktop.css`, keeping `.mac-window--chrome-none .mac-window__body`
    - Search `src` for remaining "finder" references and keep only the allowed ones: the `new-finder` action id, `/icons/finder` asset paths, the `FinderIcons` file name
    - _Requirements: 6.4, 7.2, 7.4_

  - [ ]* 7.5 Write unit tests for the desktop wiring
    - Test that the initial state has only `about` open and focused, and that `DOCK_APPS` ids equal the previous list minus `finder` in the same order
    - _Requirements: 7.1, 7.3, 8.7_

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Run `npm run lint` and `npm run build` and confirm no new errors; ensure all tests pass, ask the user if questions arise.
  - _Requirements: 9.5_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Task 1.3 (vitest and fast-check setup) is optional because it only supports the optional tests; do it before any `*` test task
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Finder-only code is removed in 7.4, after `MacDesktop` stops referencing it, so the build passes after every wave

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "3.1", "5.2"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.2", "3.3", "3.5", "5.1"] },
    { "id": 3, "tasks": ["3.4", "3.6", "5.3", "6.1", "6.2", "7.2", "7.3"] },
    { "id": 4, "tasks": ["6.3", "7.1"] },
    { "id": 5, "tasks": ["7.4", "7.5"] }
  ]
}
```
