"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import MacWindow, { useMacWindowChrome } from "@/components/MacWindow";
import {
  IconAbout,
  IconExperience,
  IconFolderLarge,
  IconProjects,
  IconRecents,
  IconResume,
  IconSkills,
  IconViewColumns,
  IconViewGallery,
  IconViewIcons,
  IconViewList,
} from "@/components/finder/FinderIcons";
import { LINKS, type FolderId } from "@/lib/portfolioContent";
import { cn } from "@/lib/utils";

type FinderItem = {
  id: string;
  name: string;
  kind: "folder" | "file";
  detail: string;
  link?: string;
  /** Optional brand icon under /public/icons/stack or /experience */
  icon?: string;
  /** Gallery / Get Info fields (Experience) */
  role?: string;
  dates?: string;
  location?: string;
  highlights?: string[];
};

type FinderGroup = {
  title: string;
  items: FinderItem[];
};

type FinderSection = {
  id: FolderId;
  name: string;
  items: FinderItem[];
  groups?: FinderGroup[];
};

const SECTIONS: FinderSection[] = [
  {
    id: "about",
    name: "About Me",
    items: [
      {
        id: "bio",
        name: "Bio",
        kind: "folder",
        detail:
          "Product, GTM, Applied AI, and Growth engineer. Ships playful interfaces and Mac-inspired product details.",
      },
      {
        id: "focus",
        name: "Focus Areas",
        kind: "folder",
        detail:
          "Product discovery, GTM narrative, applied AI UX, and interaction craft.",
      },
      {
        id: "links",
        name: "Links",
        kind: "folder",
        detail: "GitHub, LinkedIn, and X — open from the dock or here.",
        link: LINKS.github,
      },
    ],
  },
  {
    id: "experience",
    name: "Experience",
    items: [
      {
        id: "parsewave",
        name: "Parsewave",
        kind: "file",
        detail: "Frontier AI Researcher · June 2026 – July 2026 · Remote",
        icon: "/icons/experience/parsewave.png",
        link: "https://parsewave.ai/",
        role: "Frontier AI Researcher",
        dates: "June 2026 – July 2026",
        location: "Remote",
        highlights: [
          "Reviewed 1,000+ multimodal and command-line agent tasks for LLM training datasets.",
          "Contributed to ShellBench, improving the quality of command-line tasks used to benchmark AI agents.",
          "Built review pipelines and refined multimodal tasks, improving data quality and how well task difficulty was calibrated.",
        ],
      },
      {
        id: "blinkmoney",
        name: "BlinkMoney",
        kind: "file",
        detail: "AI Product Intern · March 2026 – July 2026 · Remote",
        icon: "/icons/experience/blinkmoney.svg",
        link: "https://www.blinkmoney.in/",
        role: "AI Product Intern",
        dates: "March 2026 – July 2026",
        location: "Remote",
        highlights: [
          "Scaled app downloads 20× (500 to 10K+) through marketing campaigns, SEO, and onboarding optimisation.",
          "Launched a financial health check tool that evaluates users’ financial stability, reaching 500K+ views.",
          "Improved retention via automated Google Analytics–triggered messaging and feedback-driven product flow redesigns.",
        ],
      },
      {
        id: "omegaup",
        name: "OmegaUp",
        kind: "file",
        detail: "Collaborator · February 2026 – Present · Remote",
        icon: "/icons/experience/omegaup.svg",
        link: "https://omegaup.com/",
        role: "Collaborator",
        dates: "February 2026 – Present",
        location: "Remote",
        highlights: [
          "Led omegaUp’s end-to-end Vue 2 to Vue 3 migration as project maintainer.",
          "Managed contributors by triaging issues, prioritising the backlog, assigning tasks, and guiding implementation.",
        ],
      },
      {
        id: "vidhyalay",
        name: "Vidhyalay Udhyam",
        kind: "file",
        detail: "Product Intern · June 2025 – August 2025 · Remote",
        icon: "/icons/experience/vidhyalay.png",
        role: "Product Intern",
        dates: "June 2025 – August 2025",
        location: "Remote",
        highlights: [
          "Ran user discovery with daily-wage labourers in Tier-3 India, mapping core pain points.",
          "Converted field research into product specs and prioritised features for the MVP.",
          "Shipped an MVP and validated the solution with labourers and local stakeholders.",
        ],
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    items: [
      {
        id: "portfolio",
        name: "Portfolio",
        kind: "folder",
        detail:
          "Interactive macOS-style portfolio — dock, Spotlight, Terminal, notifications, Claude mascot.",
        link: LINKS.portfolioRepo,
      },
      {
        id: "experiments",
        name: "Experiments",
        kind: "folder",
        detail: "Motion, Web Audio, and UI prototypes on github.com/shiavm006.",
        link: LINKS.github,
      },
    ],
  },
  {
    id: "skills",
    name: "Skills",
    items: [],
    groups: [
      {
        title: "Languages",
        items: [
          {
            id: "typescript",
            name: "TypeScript",
            kind: "file",
            detail: "Product UI and tooling — typed, safer shipping.",
            icon: "/icons/stack/typescript.svg",
          },
          {
            id: "python",
            name: "Python",
            kind: "file",
            detail: "APIs, automation, and applied AI scripts.",
            icon: "/icons/stack/python.svg",
          },
          {
            id: "databases",
            name: "Databases",
            kind: "file",
            detail: "SQL, warehouses, and product data modeling.",
            icon: "/icons/stack/databases.png",
          },
        ],
      },
      {
        title: "Full stack",
        items: [
          {
            id: "react",
            name: "React",
            kind: "file",
            detail: "Interactive UIs and component systems.",
            icon: "/icons/stack/react.svg",
          },
          {
            id: "nextjs",
            name: "Next.js",
            kind: "file",
            detail: "Full web products — App Router and polish.",
            icon: "/icons/stack/nextjs.svg",
          },
          {
            id: "tailwind",
            name: "Tailwind",
            kind: "file",
            detail: "Fast layout with intentional UI systems.",
            icon: "/icons/stack/tailwind.svg",
          },
          {
            id: "fastapi",
            name: "FastAPI",
            kind: "file",
            detail: "Python APIs — fast, typed, production-ready.",
            icon: "/icons/stack/fastapi.png",
          },
          {
            id: "sanity",
            name: "Sanity",
            kind: "file",
            detail: "Headless CMS for structured content.",
            icon: "/icons/stack/sanity.png",
          },
          {
            id: "docker",
            name: "Docker",
            kind: "file",
            detail: "Containers — local and prod stay close.",
            icon: "/icons/stack/docker.svg",
          },
          {
            id: "kubernetes",
            name: "Kubernetes",
            kind: "file",
            detail: "Cloud-native orchestration and deploys.",
            icon: "/icons/stack/kubernetes.svg",
          },
          {
            id: "cloudflare",
            name: "Cloudflare",
            kind: "file",
            detail: "Edge, DNS, Workers, and CDN delivery.",
            icon: "/icons/stack/cloudflare.png",
          },
          {
            id: "github-actions",
            name: "GitHub Actions",
            kind: "file",
            detail: "CI/CD pipelines and automated shipping.",
            icon: "/icons/stack/github-actions.png",
          },
          {
            id: "git",
            name: "Git",
            kind: "file",
            detail: "Everyday version control and shipping.",
            icon: "/icons/stack/git.svg",
          },
        ],
      },
      {
        title: "Product",
        items: [
          {
            id: "posthog",
            name: "PostHog",
            kind: "file",
            detail: "Analytics, funnels, and product experiments.",
            icon: "/icons/stack/posthog.png",
          },
          {
            id: "excel",
            name: "Excel",
            kind: "file",
            detail: "Models, analysis, and GTM / ops spreadsheets.",
            icon: "/icons/stack/excel.png",
          },
        ],
      },
      {
        title: "Applied AI",
        items: [
          {
            id: "openai",
            name: "OpenAI",
            kind: "file",
            detail: "Prompts, agents, and AI product surfaces.",
            icon: "/icons/stack/openai.svg",
          },
          {
            id: "claude",
            name: "Claude",
            kind: "file",
            detail: "Agents, writing, and product reasoning.",
            icon: "/icons/stack/claude.png",
          },
          {
            id: "langchain",
            name: "LangChain",
            kind: "file",
            detail: "LLM apps, chains, and tool orchestration.",
            icon: "/icons/stack/langchain.png",
          },
          {
            id: "langgraph",
            name: "LangGraph",
            kind: "file",
            detail: "Stateful agent graphs and durable workflows.",
            icon: "/icons/stack/langgraph.png",
          },
          {
            id: "mcp",
            name: "MCP",
            kind: "file",
            detail: "Model Context Protocol — tools wired into agents.",
            icon: "/icons/stack/mcp.png",
          },
          {
            id: "huggingface",
            name: "Hugging Face",
            kind: "file",
            detail: "Models, datasets, and ML community tooling.",
            icon: "/icons/stack/huggingface.png",
          },
          {
            id: "jupyter",
            name: "Jupyter",
            kind: "file",
            detail: "Notebooks for exploration and prototyping.",
            icon: "/icons/stack/jupyter.png",
          },
          {
            id: "googlecolab",
            name: "Google Colab",
            kind: "file",
            detail: "Cloud notebooks for experiments and training.",
            icon: "/icons/stack/googlecolab.png",
          },
          {
            id: "firecrawl",
            name: "Firecrawl",
            kind: "file",
            detail: "Web scraping and crawl pipelines for AI.",
            icon: "/icons/stack/firecrawl.png",
          },
          {
            id: "n8n",
            name: "n8n",
            kind: "file",
            detail: "Workflow automation and agent pipelines.",
            icon: "/icons/stack/n8n.png",
          },
          {
            id: "zapier",
            name: "Zapier",
            kind: "file",
            detail: "No-code automations across the stack.",
            icon: "/icons/stack/zapier.png",
          },
        ],
      },
      {
        title: "GTM",
        items: [
          {
            id: "clay",
            name: "Clay",
            kind: "file",
            detail: "Enrichment and outbound GTM workflows.",
            icon: "/icons/stack/clay.png",
          },
          {
            id: "apollo",
            name: "Apollo.io",
            kind: "file",
            detail: "Prospecting, sequences, and outreach.",
            icon: "/icons/stack/apollo-io.png",
          },
          {
            id: "hubspot",
            name: "HubSpot",
            kind: "file",
            detail: "CRM, pipelines, and lifecycle marketing.",
            icon: "/icons/stack/hubspot.png",
          },
          {
            id: "clevertap",
            name: "CleverTap",
            kind: "file",
            detail: "Engagement, journeys, and retention campaigns.",
            icon: "/icons/stack/clevertap.png",
          },
        ],
      },
    ],
  },
  {
    id: "resume",
    name: "Resume",
    items: [
      {
        id: "resume-summary",
        name: "Summary",
        kind: "folder",
        detail:
          "Product / GTM / Applied AI / Growth engineer. Email for a PDF, or browse GitHub / LinkedIn.",
        link: LINKS.gmail,
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        kind: "folder",
        detail: "Connect for product and GTM chats.",
        link: LINKS.linkedin,
      },
    ],
  },
  {
    id: "notes",
    name: "Recents",
    items: [
      {
        id: "tips",
        name: "Desktop tips",
        kind: "folder",
        detail:
          "⌘K Spotlight · clock opens Notification Centre · Terminal: help, whoami, about, projects.",
      },
    ],
  },
];

const FAVORITES: {
  id: FolderId;
  label: string;
  icon: (props: { className?: string }) => ReactNode;
}[] = [
  { id: "about", label: "About Me", icon: IconAbout },
  { id: "experience", label: "Experience", icon: IconExperience },
  { id: "projects", label: "Projects", icon: IconProjects },
  { id: "skills", label: "Skills", icon: IconSkills },
  { id: "resume", label: "Resume", icon: IconResume },
  { id: "notes", label: "Recents", icon: IconRecents },
];

function sectionItemsOf(section: FinderSection): FinderItem[] {
  if (section.groups?.length) {
    return section.groups.flatMap((g) => g.items);
  }
  return section.items;
}

type FinderAppProps = {
  open: boolean;
  initialSection: FolderId;
  minimized?: boolean;
  zIndex?: number;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  onSectionChange?: (id: FolderId) => void;
};

export default function FinderApp({
  open,
  initialSection,
  minimized = false,
  zIndex = 45,
  onClose,
  onMinimize,
  onFocus,
  onSectionChange,
}: FinderAppProps) {
  const [sectionId, setSectionId] = useState<FolderId>(initialSection);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconScale, setIconScale] = useState(0.72);

  useEffect(() => {
    if (!open) return;
    setSectionId(initialSection);
    const next = SECTIONS.find((s) => s.id === initialSection) ?? SECTIONS[0]!;
    setSelectedItemId(sectionItemsOf(next)[0]?.id ?? null);
  }, [open, initialSection]);

  const section = useMemo(
    () => SECTIONS.find((s) => s.id === sectionId) ?? SECTIONS[0]!,
    [sectionId],
  );

  const sectionItems = useMemo(() => sectionItemsOf(section), [section]);
  const selected = sectionItems.find((i) => i.id === selectedItemId) ?? null;

  const selectSection = (id: string) => {
    if (!SECTIONS.some((s) => s.id === id)) return;
    const next = id as FolderId;
    const nextSection = SECTIONS.find((s) => s.id === next) ?? SECTIONS[0]!;
    setSectionId(next);
    setSelectedItemId(sectionItemsOf(nextSection)[0]?.id ?? null);
    onSectionChange?.(next);
  };

  return (
    <MacWindow
      open={open}
      minimized={minimized}
      title={section.name}
      variant="dark"
      chrome="none"
      width={920}
      height={560}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      bodyClassName="mac-finder-body"
      className="mac-window--finder"
    >
      <FinderChrome
        sectionName={section.name}
        sectionId={sectionId}
        sectionItems={sectionItems}
        groups={section.groups}
        selectedItemId={selectedItemId}
        selected={selected}
        iconScale={iconScale}
        onIconScale={setIconScale}
        onSelectSection={selectSection}
        onSelectItem={setSelectedItemId}
      />
    </MacWindow>
  );
}

function ExperienceGallery({
  items,
  selectedItemId,
  selected,
  onSelectItem,
}: {
  items: FinderItem[];
  selectedItemId: string | null;
  selected: FinderItem | null;
  onSelectItem: (id: string) => void;
}) {
  const infoRows = selected
    ? [
        { label: "Role", value: selected.role },
        { label: "Company", value: selected.name },
        { label: "Dates", value: selected.dates },
        { label: "Location", value: selected.location },
      ].filter((row) => Boolean(row.value))
    : [];

  const websiteHost = selected?.link
    ? selected.link.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : null;

  return (
    <div className="mac-finder__gallery">
      <ul className="mac-finder__gallery-list" aria-label="Experience">
        {items.map((item) => {
          const active = item.id === selectedItemId;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={cn(
                  "mac-finder__gallery-item",
                  active && "is-active",
                )}
                data-ui-sound="click"
                onClick={() => onSelectItem(item.id)}
                onDoubleClick={() => {
                  if (item.link) {
                    window.open(item.link, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <span className="mac-finder__gallery-thumb" aria-hidden>
                  {item.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.icon} alt="" draggable={false} />
                  ) : null}
                </span>
                <span className="mac-finder__gallery-name">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mac-finder__gallery-pane" aria-live="polite">
        {selected ? (
          <>
            <div className="mac-finder__gallery-preview">
              {selected.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.icon} alt="" draggable={false} />
              ) : null}
            </div>
            <h2 className="mac-finder__gallery-title">
              {selected.role ?? selected.name}
            </h2>
            <p className="mac-finder__gallery-sub">
              {[selected.name, selected.location].filter(Boolean).join(" · ")}
            </p>

            <div className="mac-finder__info">
              <p className="mac-finder__info-heading">Information</p>
              <dl className="mac-finder__info-list">
                {infoRows.map((row) => (
                  <div key={row.label} className="mac-finder__info-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
                {selected.link && websiteHost ? (
                  <div className="mac-finder__info-row">
                    <dt>Website</dt>
                    <dd>
                      <a
                        href={selected.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mac-finder__info-link"
                        data-ui-sound="click"
                      >
                        {websiteHost}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            {selected.highlights?.length ? (
              <div className="mac-finder__info mac-finder__info--work">
                <p className="mac-finder__info-heading">Work</p>
                <ul className="mac-finder__work-list">
                  {selected.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mac-finder__gallery-empty">Select a role</p>
        )}
      </div>
    </div>
  );
}

function FinderIconButton({
  item,
  active,
  onSelect,
}: {
  item: FinderItem;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={cn("mac-finder__icon-item", active && "is-active")}
      data-ui-sound="click"
      onClick={() => onSelect(item.id)}
      onDoubleClick={() => {
        if (item.link) {
          window.open(item.link, "_blank", "noopener,noreferrer");
        }
      }}
      title={item.detail}
    >
      <span className="mac-finder__icon-art" aria-hidden>
        {item.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt=""
            className="mac-finder__stack-img"
            draggable={false}
          />
        ) : (
          <IconFolderLarge className="mac-finder__folder-img" />
        )}
      </span>
      <span className="mac-finder__icon-label">{item.name}</span>
    </button>
  );
}

function FinderChrome({
  sectionName,
  sectionId,
  sectionItems,
  groups,
  selectedItemId,
  selected,
  iconScale,
  onIconScale,
  onSelectSection,
  onSelectItem,
}: {
  sectionName: string;
  sectionId: FolderId;
  sectionItems: FinderItem[];
  groups?: FinderGroup[];
  selectedItemId: string | null;
  selected: FinderItem | null;
  iconScale: number;
  onIconScale: (v: number) => void;
  onSelectSection: (id: string) => void;
  onSelectItem: (id: string) => void;
}) {
  const chrome = useMacWindowChrome();

  const statusLeft = selected
    ? `1 of ${sectionItems.length} selected, 42.05 GB available`
    : `${sectionItems.length} item${sectionItems.length === 1 ? "" : "s"}, 42.05 GB available`;

  return (
    <div className="mac-finder">
      <div className="mac-finder__unified" data-mac-drag>
        <div className="mac-window__traffic" data-no-drag>
          <button
            type="button"
            className="mac-window__dot mac-window__dot--close"
            aria-label="Close"
            data-ui-sound="click"
            onClick={() => chrome?.onClose()}
          />
          <button
            type="button"
            className="mac-window__dot mac-window__dot--min"
            aria-label="Minimize"
            data-ui-sound="click"
            onClick={() => chrome?.onMinimize?.()}
          />
          <button
            type="button"
            className="mac-window__dot mac-window__dot--zoom"
            aria-label={chrome?.zoomed ? "Restore" : "Zoom"}
            data-ui-sound="click"
            onClick={() => chrome?.onToggleZoom()}
          />
        </div>

        <div className="mac-finder__nav" data-no-drag>
          <button type="button" className="mac-finder__tool" aria-label="Back" disabled>
            <ChevronLeft className="size-4" strokeWidth={2.25} />
          </button>
          <button type="button" className="mac-finder__tool" aria-label="Forward" disabled>
            <ChevronRight className="size-4" strokeWidth={2.25} />
          </button>
        </div>

        <p className="mac-finder__toolbar-title">{sectionName}</p>

        <div className="mac-finder__views" role="group" aria-label="View mode" data-no-drag>
          <button
            type="button"
            className="mac-finder__tool is-active"
            aria-label="Icons"
            aria-pressed
          >
            <IconViewIcons active />
          </button>
          <button type="button" className="mac-finder__tool" aria-label="List" disabled>
            <IconViewList />
          </button>
          <button type="button" className="mac-finder__tool" aria-label="Columns" disabled>
            <IconViewColumns />
          </button>
          <button type="button" className="mac-finder__tool" aria-label="Gallery" disabled>
            <IconViewGallery />
          </button>
        </div>

        <div className="mac-finder__actions" data-no-drag>
          <button type="button" className="mac-finder__tool" aria-label="Search" disabled>
            <Search className="size-3.5" strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <div className="mac-finder__shell">
        <aside className="mac-finder__sidebar">
          <p className="mac-finder__group">Favourites</p>
          {FAVORITES.map((item) => {
            const active = item.id === sectionId;
            return (
              <button
                key={item.id}
                type="button"
                className={cn("mac-finder__side-item", active && "is-active")}
                data-ui-sound="click"
                onClick={() => onSelectSection(item.id)}
              >
                <span className="mac-finder__side-icon">{item.icon({ className: "size-4" })}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <div className="mac-finder__content">
          {sectionId === "experience" ? (
            <ExperienceGallery
              items={sectionItems}
              selectedItemId={selectedItemId}
              selected={selected}
              onSelectItem={onSelectItem}
            />
          ) : (
            <>
              <div className="mac-finder__content-bar">
                <p className="mac-finder__content-title">{sectionName}</p>
                <button
                  type="button"
                  className="mac-finder__content-add"
                  aria-label="New"
                  disabled
                >
                  <Plus className="size-3.5" strokeWidth={2.5} />
                </button>
              </div>

              <div
                className={cn(
                  "mac-finder__icons",
                  groups?.length && "mac-finder__icons--grouped",
                )}
                style={
                  {
                    "--finder-icon-scale": String(iconScale),
                  } as CSSProperties
                }
              >
                {groups?.length
                  ? groups.map((group) => (
                      <div key={group.title} className="mac-finder__group-block">
                        <p className="mac-finder__group-title">{group.title}</p>
                        <div className="mac-finder__group-grid">
                          {group.items.map((item) => (
                            <FinderIconButton
                              key={item.id}
                              item={item}
                              active={item.id === selectedItemId}
                              onSelect={onSelectItem}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  : sectionItems.map((item) => (
                      <FinderIconButton
                        key={item.id}
                        item={item}
                        active={item.id === selectedItemId}
                        onSelect={onSelectItem}
                      />
                    ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mac-finder__status">
        <span>{statusLeft}</span>
        <label className="mac-finder__size-slider">
          <span className="sr-only">Icon size</span>
          <input
            type="range"
            min={0.45}
            max={1}
            step={0.01}
            value={iconScale}
            onChange={(e) => onIconScale(Number(e.target.value))}
            aria-label="Icon size"
          />
        </label>
      </div>
    </div>
  );
}
