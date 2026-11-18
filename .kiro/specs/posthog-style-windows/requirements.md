# Requirements Document

## Introduction

The portfolio desktop currently shows About, Experience, Projects, Skills and Resume inside a single Finder window (`FinderApp`) that has a sidebar, a view-mode switcher and a Get Info panel. This feature replaces that Finder window with five independent Section Windows, one per section. Each Section Window has PostHog-inspired chrome implemented in this codebase, without PostHog branding or mascot. Several Section Windows can be open at the same time, with focus, stacking, drag, resize, minimize and maximize. All existing content is reused. All other desktop features stay unchanged. Every entry point that previously opened Finder opens the matching Section Window instead.

Implementation constraint from `AGENTS.md`: the relevant guides in `node_modules/next/dist/docs/` must be read before any Next.js code is written.

## Glossary

- **Desktop**: The `MacDesktop` component that hosts the menu bar, dock, desktop folder icons, windows, Spotlight, notifications and the iPhone home screen.
- **Section_Window**: A window that shows exactly one of the five sections: about, experience, projects, skills or resume.
- **Section_Id**: One of the identifiers `about`, `experience`, `projects`, `skills`, `resume`.
- **Section_Content**: The data and rendering for a section, taken from the `SECTIONS` array in `FinderApp`, the `AboutBio` component and the icons in `FinderIcons`.
- **Window_Manager**: The Desktop logic that tracks the open, minimized, maximized, position, size and stacking state of all Section_Windows.
- **Focused_Window**: The Section_Window (or other app window) that holds the highest stacking order and receives keyboard focus.
- **Window_Chrome**: The title bar, window controls and frame of a Section_Window.
- **Window_Controls**: The close, minimize and maximize buttons in the Window_Chrome.
- **Dock**: The `MacOSDock` component showing application icons.
- **Menu_Bar**: The `MacOSMenuBar` component at the top of the Desktop.
- **Spotlight**: The `SpotlightSearch` component.
- **Desktop_Folder_Icon**: A folder icon on the Desktop that opened Finder windows before this feature.
- **iPhone_Home**: The `IPhoneHome` component and its `handleIPhoneOpen` handler.
- **Finder_Window**: The existing `FinderApp` window that this feature removes.
- **Other_Apps**: Notes, Notion, Gmail, Spotify and Claude in the Dock, and the Claude mascot.

## Requirements

### Requirement 1: Independent section windows

**User Story:** As a visitor, I want each portfolio section in its own window, so that I can read several sections side by side.

#### Acceptance Criteria

1. THE Desktop SHALL provide one Section_Window for each Section_Id.
2. WHEN a Section_Window is opened, THE Desktop SHALL render the Section_Content of the matching Section_Id.
3. WHILE one Section_Window is open, THE Desktop SHALL allow a Section_Window for a different Section_Id to be opened.
4. THE Desktop SHALL allow all five Section_Windows to be open at the same time.
5. WHEN a Section_Window is opened for a Section_Id whose Section_Window is already open, THE Window_Manager SHALL focus the existing Section_Window and SHALL NOT create a second one.
6. THE Section_Window SHALL display a single fixed layout for its section.

### Requirement 2: PostHog-inspired chrome

**User Story:** As a visitor, I want the section windows to look like a PostHog-style app, so that the desktop has a distinct and modern feel.

#### Acceptance Criteria

1. THE Section_Window SHALL render Window_Chrome that has a title bar showing the section name, the Window_Controls, and a content area, styled with PostHog-inspired colors, typography and borders defined in this codebase.
2. THE Section_Window SHALL omit PostHog names, logos, the hedgehog mascot and any other PostHog trademarked assets.
3. THE Section_Window SHALL implement the Window_Chrome with components and styles in this repository and SHALL NOT import PostHog packages or load PostHog assets.
4. THE Section_Window SHALL display a section-specific icon from `FinderIcons` in the title bar.

### Requirement 3: Focus and stacking

**User Story:** As a visitor, I want to focus and stack windows, so that I can bring the window I am reading to the front.

#### Acceptance Criteria

1. WHEN a visitor presses the pointer on a Section_Window, THE Window_Manager SHALL make that Section_Window the Focused_Window and place it above all other Section_Windows.
2. WHEN a Section_Window is opened, THE Window_Manager SHALL make that Section_Window the Focused_Window.
3. WHEN the Focused_Window changes, THE Desktop SHALL update the Menu_Bar application name to the title of the new Focused_Window.
4. THE Window_Manager SHALL keep every Section_Window above the Desktop_Folder_Icons and below the Menu_Bar and the Dock.
5. WHILE a Section_Window is not the Focused_Window, THE Section_Window SHALL show an inactive visual state that differs from the focused state.
6. WHEN a Section_Window is opened for the first time, THE Window_Manager SHALL place it at an initial position offset from the other open Section_Windows so that the title bars of the other open Section_Windows remain visible.

### Requirement 4: Drag and resize

**User Story:** As a visitor, I want to drag and resize windows, so that I can arrange my workspace.

#### Acceptance Criteria

1. WHEN a visitor drags the title bar of a Section_Window, THE Window_Manager SHALL move the Section_Window by the pointer displacement.
2. WHILE a Section_Window is being dragged, THE Window_Manager SHALL keep the title bar within the visible Desktop area below the Menu_Bar.
3. WHEN a visitor drags a resize handle on an edge or corner of a Section_Window, THE Window_Manager SHALL resize the Section_Window to follow the pointer.
4. THE Window_Manager SHALL enforce a minimum Section_Window size of 360 px wide and 280 px tall.
5. WHILE a Section_Window is maximized, THE Window_Manager SHALL disable dragging and resizing of that Section_Window.
6. WHEN a visitor presses a Window_Control, THE Window_Manager SHALL start no drag on the Section_Window.
7. WHERE the viewport width is below the mobile breakpoint already used by the Desktop, THE Desktop SHALL show Section_Windows maximized and SHALL disable dragging and resizing.

### Requirement 5: Close, minimize and maximize

**User Story:** As a visitor, I want to close, minimize and maximize windows, so that I can manage the screen space.

#### Acceptance Criteria

1. WHEN a visitor presses the close Window_Control, THE Window_Manager SHALL close that Section_Window.
2. WHEN a visitor presses the minimize Window_Control, THE Window_Manager SHALL hide that Section_Window and keep its position, size and scroll state.
3. WHEN a visitor presses the maximize Window_Control on a Section_Window that is not maximized, THE Window_Manager SHALL expand it to fill the Desktop area between the Menu_Bar and the Dock.
4. WHEN a visitor presses the maximize Window_Control on a maximized Section_Window, THE Window_Manager SHALL restore the previous position and size.
5. WHEN a visitor double-clicks the title bar of a Section_Window, THE Window_Manager SHALL toggle the maximized state of that Section_Window.
6. WHEN a Section_Window is closed, THE Window_Manager SHALL focus the open, non-minimized Section_Window with the highest stacking order, or SHALL set the Menu_Bar application name to the default name if none remains.
7. WHEN a minimized Section_Window is requested to open from any entry point, THE Window_Manager SHALL restore it and focus it.
8. WHEN a Section_Window is closed and reopened, THE Window_Manager SHALL open it at its initial position and size, not maximized.

### Requirement 6: Content reuse

**User Story:** As a visitor, I want to see the same portfolio content as before, so that no information is lost.

#### Acceptance Criteria

1. THE Section_Window SHALL render the item names, details, links and ordering defined in the `SECTIONS` data of `FinderApp` for the matching Section_Id.
2. THE Section_Window for `about` SHALL render the `AboutBio` component with the social links row.
3. THE Section_Window SHALL render item icons using the components in `FinderIcons`.
4. THE Desktop SHALL source Section_Content from a single shared module that Section_Windows import, so that the content is not duplicated.
5. IF the Section_Content of a Section_Id exceeds the visible content area, THEN THE Section_Window SHALL show a vertical scrollbar in the content area and keep the Window_Chrome fixed.

### Requirement 7: Finder removal

**User Story:** As a site owner, I want the Finder window and its extras removed, so that the desktop has one consistent window model.

#### Acceptance Criteria

1. THE Dock SHALL omit the Finder icon.
2. THE Desktop SHALL omit the Finder_Window, the sidebar section switcher, the view-mode switcher and the Get Info panel.
3. THE Dock SHALL display the Other_Apps, the dock separator and every other icon that was present before this change, in their previous order.
4. THE Desktop SHALL remove code and styles used only by the Finder_Window, including the unused `finder` entry in the application state and the Finder rules in `mac-desktop.css`.
5. THE Desktop SHALL update user-facing text that refers to Finder windows, in `NotesApp` and `NotionApp`, to refer to section windows.

### Requirement 8: Entry points

**User Story:** As a visitor, I want every way of opening a section to open its window, so that navigation works from all places.

#### Acceptance Criteria

1. WHEN a visitor activates a Desktop_Folder_Icon for a Section_Id, THE Desktop SHALL open the Section_Window for that Section_Id.
2. WHEN a visitor selects a Spotlight result of kind Folder for a Section_Id, THE Desktop SHALL open the Section_Window for that Section_Id and close Spotlight.
3. WHEN the Menu_Bar action `about` is triggered, THE Desktop SHALL open the Section_Window for `about`.
4. WHEN the Menu_Bar action `new-finder` is triggered, THE Desktop SHALL open the Section_Window for `projects`.
5. WHEN `handleIPhoneOpen` receives an action of type `folder` with a Section_Id, THE Desktop SHALL open the Section_Window for that Section_Id.
6. WHEN `handleIPhoneOpen` receives an action for an app other than a section, THE Desktop SHALL open that app as before.
7. WHEN the Desktop first loads, THE Desktop SHALL set the default `activeApp` to a name that is not Finder and SHALL display the same initial window state as before, with the `about` Section_Window as the only open Section_Window.
8. IF an entry point supplies a `notes` folder identifier, THEN THE Desktop SHALL open the Notes app as it did before this change.

### Requirement 9: Preserved features

**User Story:** As a visitor, I want all other desktop features to keep working, so that the portfolio experience stays intact.

#### Acceptance Criteria

1. THE Desktop SHALL keep the behavior of the Menu_Bar, Spotlight, Notification Centre, toast notifications, the Claude mascot, iPhone_Home, Notes, Notion, Gmail and Spotify apps, the Desktop_Folder_Icons, UI sounds and the hero text as they were before this change.
2. WHEN a visitor opens Notes, Notion, Gmail or Spotify while Section_Windows are open, THE Window_Manager SHALL place the opened app window above the Section_Windows and make it the Focused_Window.
3. WHEN a visitor presses a Section_Window, THE Window_Manager SHALL place that Section_Window above Notes, Notion, Gmail and Spotify windows.
4. WHEN a Window_Control or a Section_Window item is pressed, THE Desktop SHALL play the same click sound as other clickable Desktop elements.
5. THE Desktop SHALL pass `npm run lint` and `npm run build` with no new errors.
