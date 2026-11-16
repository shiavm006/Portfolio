"use client";

import { useMemo, useState, type ReactNode } from "react";
import MacWindow from "@/components/MacWindow";
import { cn } from "@/lib/utils";
import { LINKS } from "@/lib/portfolioContent";

type NotionPage = {
  id: string;
  title: string;
  icon: string;
  section: "library" | "projects" | "case-studies" | "blog";
  meta?: string;
  content: ReactNode;
};

const PAGES: NotionPage[] = [
  {
    id: "library",
    title: "Library",
    icon: "◇",
    section: "library",
    content: (
      <>
        <p className="mac-notion__lead">
          Projects, case studies, and blog posts — the long-form side of the
          portfolio. Finder is the quick map; Notion is where the work is
          written up.
        </p>
        <h3 className="mac-notion__h3">Projects</h3>
        <ul className="mac-notion__bullets">
          <li>Portfolio desktop — interactive macOS portfolio</li>
          <li>Experiments — motion, Web Audio, UI prototypes</li>
        </ul>
        <h3 className="mac-notion__h3">Case studies</h3>
        <ul className="mac-notion__bullets">
          <li>Portfolio desktop — building a Mac OS portfolio that feels native</li>
          <li>Applied AI workflows — shipping agent UX without the demo tax</li>
        </ul>
        <h3 className="mac-notion__h3">Blog</h3>
        <ul className="mac-notion__bullets">
          <li>Why product engineers should own the first 5 seconds</li>
          <li>GTM systems that don&apos;t feel like spreadsheets</li>
        </ul>
      </>
    ),
  },
  {
    id: "proj-portfolio",
    title: "Portfolio desktop",
    icon: "⌘",
    section: "projects",
    meta: "Project · Next.js / React / GSAP",
    content: (
      <>
        <p className="mac-notion__meta">Project · Next.js / React / GSAP</p>
        <p className="mac-notion__lead">
          Interactive macOS-style portfolio with dock, Spotlight, Finder,
          Notes, Notion, Terminal, and notifications.
        </p>
        <h3 className="mac-notion__h3">What it is</h3>
        <ul className="mac-notion__bullets">
          <li>Desktop shell: menu bar, folders, resizable windows</li>
          <li>Apps that work — not decorative icons</li>
          <li>iPhone home layout on mobile</li>
          <li>UI sound, motion, and stacking focus</li>
        </ul>
        <h3 className="mac-notion__h3">Links</h3>
        <ul className="mac-notion__links">
          <li>
            <a href={LINKS.portfolioRepo} target="_blank" rel="noopener noreferrer">
              GitHub repo
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "proj-experiments",
    title: "Experiments",
    icon: "◎",
    section: "projects",
    meta: "Project · Prototypes",
    content: (
      <>
        <p className="mac-notion__meta">Project · Prototypes</p>
        <p className="mac-notion__lead">
          Motion, Web Audio, and UI prototypes living in public repos — small
          bets that feed bigger product work.
        </p>
        <h3 className="mac-notion__h3">Themes</h3>
        <ul className="mac-notion__bullets">
          <li>Interaction and micro-animation</li>
          <li>Sound as interface feedback</li>
          <li>Agent / Applied AI UX sketches</li>
        </ul>
        <h3 className="mac-notion__h3">Links</h3>
        <ul className="mac-notion__links">
          <li>
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
              github.com/shiavm006
            </a>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cs-portfolio",
    title: "Portfolio desktop",
    icon: "▣",
    section: "case-studies",
    meta: "Case study · Product / Frontend",
    content: (
      <>
        <p className="mac-notion__meta">Case study · Product / Frontend</p>
        <p className="mac-notion__lead">
          Turning a personal site into a believable macOS desktop — dock,
          Spotlight, Finder, Notes, Terminal — without making it a gimmick.
        </p>
        <h3 className="mac-notion__h3">Problem</h3>
        <p>
          Most engineer portfolios look the same: hero, cards, resume PDF.
          I wanted something that shows craft the moment you land — motion,
          sound, windowing — while still being usable on a phone.
        </p>
        <h3 className="mac-notion__h3">Approach</h3>
        <ul className="mac-notion__bullets">
          <li>Desktop shell first: menu bar, dock, folders, real windows</li>
          <li>Apps that earn their keep — Notes, Notion, Terminal, Spotify</li>
          <li>Mobile as iPhone home, not a squashed desktop</li>
          <li>Only interactive controls; no dead chrome</li>
        </ul>
        <h3 className="mac-notion__h3">Outcome</h3>
        <p>
          A portfolio that reads as a product demo. Source lives on{" "}
          <a href={LINKS.portfolioRepo} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "cs-ai",
    title: "Applied AI workflows",
    icon: "⬡",
    section: "case-studies",
    meta: "Case study · Applied AI / GTM",
    content: (
      <>
        <p className="mac-notion__meta">Case study · Applied AI / GTM</p>
        <p className="mac-notion__lead">
          Designing agent-assisted workflows that sales and product teams
          actually finish — not just watch in a Loom.
        </p>
        <h3 className="mac-notion__h3">Problem</h3>
        <p>
          AI demos win meetings; ops tools win weeks. The gap is trust,
          review loops, and clear handoff back into Clay / HubSpot / CRM.
        </p>
        <h3 className="mac-notion__h3">Approach</h3>
        <ul className="mac-notion__bullets">
          <li>Human-in-the-loop steps where judgment matters</li>
          <li>Structured outputs that land in existing GTM systems</li>
          <li>Instrumentation so you can see where the agent stalls</li>
        </ul>
        <h3 className="mac-notion__h3">Outcome</h3>
        <p>
          Faster research → outreach loops with fewer copy-paste steps, and
          a pattern I reuse across Applied AI projects.
        </p>
      </>
    ),
  },
  {
    id: "blog-first-5",
    title: "The first 5 seconds",
    icon: "✎",
    section: "blog",
    meta: "Blog · Product craft",
    content: (
      <>
        <p className="mac-notion__meta">Blog · Product craft</p>
        <p className="mac-notion__lead">
          Why product engineers should own the first five seconds of an
          experience — before features, before onboarding copy.
        </p>
        <p>
          People decide whether a product feels serious almost immediately.
          Sound, latency, empty states, and the first interactive affordance
          do more work than a feature list.
        </p>
        <p>
          On this portfolio that meant: splash → desktop, dock that responds,
          windows that drag and resize, and no fake buttons. Craft is the
          pitch.
        </p>
      </>
    ),
  },
  {
    id: "blog-gtm",
    title: "GTM without spreadsheet energy",
    icon: "▤",
    section: "blog",
    meta: "Blog · GTM / Systems",
    content: (
      <>
        <p className="mac-notion__meta">Blog · GTM / Systems</p>
        <p className="mac-notion__lead">
          Building GTM systems that feel like products — not a pile of tabs
          and CSV exports.
        </p>
        <p>
          Clay, Apollo, HubSpot, and CleverTap are powerful, but the operator
          experience is usually duct tape. The job is sequencing: enrichment
          → qualification → message → feedback — with one obvious next step.
        </p>
        <p>
          Good GTM engineering looks boring from the outside: fewer tools,
          clearer states, and logs you can trust when something breaks at
          11pm.
        </p>
      </>
    ),
  },
];

const SECTIONS: { id: NotionPage["section"]; label: string }[] = [
  { id: "library", label: "Library" },
  { id: "projects", label: "Projects" },
  { id: "case-studies", label: "Case studies" },
  { id: "blog", label: "Blog" },
];

type NotionAppProps = {
  open: boolean;
  minimized?: boolean;
  zIndex?: number;
  onClose: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
};

export default function NotionApp({
  open,
  minimized = false,
  zIndex = 48,
  onClose,
  onMinimize,
  onFocus,
}: NotionAppProps) {
  const [pageId, setPageId] = useState(PAGES[0]!.id);
  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0]!;

  const grouped = useMemo(
    () =>
      SECTIONS.map((section) => ({
        ...section,
        pages: PAGES.filter((p) => p.section === section.id),
      })).filter((s) => s.pages.length > 0),
    [],
  );

  return (
    <MacWindow
      open={open}
      minimized={minimized}
      title="Notion"
      variant="light"
      width={900}
      height={580}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      bodyClassName="mac-notion-body"
      className="mac-window--notion"
    >
      <div className="mac-notion">
        <aside className="mac-notion__sidebar">
          <div className="mac-notion__workspace">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/dock/notion.png"
              alt=""
              className="mac-notion__workspace-icon"
              draggable={false}
            />
            <span>Projects &amp; writing</span>
          </div>

          {grouped.map((section) => (
            <div key={section.id} className="mac-notion__group">
              <p className="mac-notion__section">{section.label}</p>
              <ul className="mac-notion__nav">
                {section.pages.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        "mac-notion__nav-item",
                        item.id === page.id && "is-active",
                      )}
                      data-ui-sound="click"
                      onClick={() => setPageId(item.id)}
                    >
                      <span className="mac-notion__nav-icon" aria-hidden>
                        {item.icon}
                      </span>
                      <span className="mac-notion__nav-title">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        <section className="mac-notion__page" aria-label={page.title}>
          <div className="mac-notion__page-inner">
            <div className="mac-notion__page-icon" aria-hidden>
              {page.icon}
            </div>
            <h1 className="mac-notion__title">{page.title}</h1>
            <div className="mac-notion__content">{page.content}</div>
          </div>
        </section>
      </div>
    </MacWindow>
  );
}
