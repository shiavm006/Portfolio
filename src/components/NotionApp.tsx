"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import MacWindow from "@/components/MacWindow";
import { cn } from "@/lib/utils";
import { LINKS } from "@/lib/portfolioContent";

type NotionSection = "favorites" | "projects" | "case-studies" | "blog";

type NotionPage = {
  id: string;
  title: string;
  icon: string;
  section: NotionSection;
  type: string;
  tags: string[];
  status?: string;
  summary: string;
  content: (go: (id: string) => void) => ReactNode;
};

function Callout({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mac-notion__callout">
      <span className="mac-notion__callout-icon" aria-hidden>
        {icon}
      </span>
      <div>
        <strong>{title}</strong>
        <div className="mac-notion__callout-body">{children}</div>
      </div>
    </div>
  );
}

function PageLink({
  icon,
  title,
  meta,
  onOpen,
}: {
  icon: string;
  title: string;
  meta: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className="mac-notion__card"
      data-ui-sound="click"
      onClick={onOpen}
    >
      <span className="mac-notion__card-icon" aria-hidden>
        {icon}
      </span>
      <span className="mac-notion__card-copy">
        <span className="mac-notion__card-title">{title}</span>
        <span className="mac-notion__card-meta">{meta}</span>
      </span>
    </button>
  );
}

const PAGES: NotionPage[] = [
  {
    id: "home",
    title: "Projects & writing",
    icon: "◇",
    section: "favorites",
    type: "Workspace",
    tags: ["Home"],
    status: "Live",
    summary: "Long-form work: projects, case studies, and notes on craft.",
    content: (go) => (
      <>
        <p className="mac-notion__lead">
          The section windows are the quick map. This space is where the work is written up —
          projects, case studies, and short essays on product, GTM, and applied
          AI.
        </p>
        <Callout icon="💡" title="How to read this">
          <p>
            Start with a case study if you want the story. Open Projects for
            what shipped. Blog is opinion, short and sharp.
          </p>
        </Callout>

        <h3 className="mac-notion__h3">Projects</h3>
        <div className="mac-notion__cards">
          <PageLink
            icon="⌘"
            title="Portfolio desktop"
            meta="Next.js · React · GSAP"
            onOpen={() => go("proj-portfolio")}
          />
          <PageLink
            icon="◎"
            title="Experiments"
            meta="Motion · Web Audio · prototypes"
            onOpen={() => go("proj-experiments")}
          />
        </div>

        <h3 className="mac-notion__h3">Case studies</h3>
        <div className="mac-notion__cards">
          <PageLink
            icon="▣"
            title="Building a Mac portfolio that feels native"
            meta="Product / Frontend"
            onOpen={() => go("cs-portfolio")}
          />
          <PageLink
            icon="⬡"
            title="Applied AI that ops teams finish"
            meta="Applied AI / GTM"
            onOpen={() => go("cs-ai")}
          />
          <PageLink
            icon="⚡"
            title="BlinkMoney growth loops"
            meta="Product / Growth"
            onOpen={() => go("cs-blink")}
          />
        </div>

        <h3 className="mac-notion__h3">Blog</h3>
        <div className="mac-notion__cards">
          <PageLink
            icon="✎"
            title="Own the first 5 seconds"
            meta="Product craft"
            onOpen={() => go("blog-first-5")}
          />
          <PageLink
            icon="▤"
            title="GTM without spreadsheet energy"
            meta="GTM / Systems"
            onOpen={() => go("blog-gtm")}
          />
        </div>
      </>
    ),
  },
  {
    id: "proj-portfolio",
    title: "Portfolio desktop",
    icon: "⌘",
    section: "projects",
    type: "Project",
    tags: ["Next.js", "React", "GSAP"],
    status: "Shipped",
    summary: "Interactive macOS-style portfolio with real apps, not decoys.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          A desktop you can use: dock, Spotlight, section windows, Notes, Notion,
          notifications — plus an iPhone home on mobile.
        </p>
        <Callout icon="🎯" title="Goal">
          <p>
            Prove craft in the first five seconds. If it feels like a theme, it
            failed. If it feels like a product, it worked.
          </p>
        </Callout>
        <h3 className="mac-notion__h3">What shipped</h3>
        <ul className="mac-notion__bullets">
          <li>Menu bar, folders, resizable / draggable windows</li>
          <li>Apps with real behaviour — Notes, Notion, Spotify</li>
          <li>Mobile as iPhone home, not a squashed desktop</li>
          <li>UI sound, motion, and focus stacking</li>
        </ul>
        <h3 className="mac-notion__h3">Stack</h3>
        <ul className="mac-notion__bullets">
          <li>Next.js, React, TypeScript</li>
          <li>GSAP + Motion for presence</li>
          <li>Web Audio for soft UI feedback</li>
        </ul>
        <h3 className="mac-notion__h3">Links</h3>
        <ul className="mac-notion__links">
          <li>
            <a
              href={LINKS.portfolioRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
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
    type: "Project",
    tags: ["Prototypes", "Motion", "AI UX"],
    status: "Ongoing",
    summary: "Small public bets that feed bigger product work.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          Motion, Web Audio, and agent UX sketches — short loops that teach
          something before they become a feature.
        </p>
        <h3 className="mac-notion__h3">Themes</h3>
        <ul className="mac-notion__bullets">
          <li>Interaction and micro-animation</li>
          <li>Sound as interface feedback</li>
          <li>Agent / applied AI UX without the demo tax</li>
        </ul>
        <Callout icon="🧪" title="Rule">
          <p>Ship ugly if it works. Pretty comes after the lesson.</p>
        </Callout>
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
    title: "Building a Mac portfolio that feels native",
    icon: "▣",
    section: "case-studies",
    type: "Case study",
    tags: ["Product", "Frontend"],
    status: "Published",
    summary: "From generic engineer site to a believable desktop product.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          Turning a personal site into a macOS desktop — dock, Spotlight,
          section windows, Notes, Notion — without making it a gimmick.
        </p>
        <h3 className="mac-notion__h3">Problem</h3>
        <p>
          Most engineer portfolios look the same: hero, cards, resume PDF. I
          wanted something that shows craft the moment you land, while staying
          usable on a phone.
        </p>
        <h3 className="mac-notion__h3">Approach</h3>
        <ul className="mac-notion__bullets">
          <li>Desktop shell first: menu bar, dock, folders, real windows</li>
          <li>Apps that earn their keep — no dead chrome</li>
          <li>Mobile as iPhone home, not a compressed desktop</li>
          <li>Experience gallery with real company logos and write-ups</li>
        </ul>
        <h3 className="mac-notion__h3">Outcome</h3>
        <p>
          A portfolio that reads as a product demo. Source on{" "}
          <a
            href={LINKS.portfolioRepo}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "cs-ai",
    title: "Applied AI that ops teams finish",
    icon: "⬡",
    section: "case-studies",
    type: "Case study",
    tags: ["Applied AI", "GTM"],
    status: "Published",
    summary: "Agent workflows that survive past the Loom demo.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          Designing agent-assisted workflows that sales and product teams
          actually complete — not just watch once.
        </p>
        <h3 className="mac-notion__h3">Problem</h3>
        <p>
          AI demos win meetings; ops tools win weeks. The gap is trust, review
          loops, and a clear handoff back into Clay / HubSpot / CRM.
        </p>
        <h3 className="mac-notion__h3">Approach</h3>
        <ul className="mac-notion__bullets">
          <li>Human-in-the-loop where judgment matters</li>
          <li>Structured outputs that land in existing GTM systems</li>
          <li>Instrumentation so you see where the agent stalls</li>
        </ul>
        <Callout icon="📌" title="Lesson">
          <p>
            Solve the messy handoff first. Model quality is useless if nobody
            finishes the run.
          </p>
        </Callout>
        <h3 className="mac-notion__h3">Outcome</h3>
        <p>
          Faster research → outreach loops with fewer copy-paste steps — a
          pattern I reuse across applied AI projects, including work around
          Parsewave-style evaluation pipelines.
        </p>
      </>
    ),
  },
  {
    id: "cs-blink",
    title: "BlinkMoney growth loops",
    icon: "⚡",
    section: "case-studies",
    type: "Case study",
    tags: ["Growth", "Product"],
    status: "Published",
    summary: "20× downloads and a financial health tool that hit half a million views.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          AI Product Intern at BlinkMoney — scaling acquisition and shipping a
          financial health check people actually opened.
        </p>
        <h3 className="mac-notion__h3">Problem</h3>
        <p>
          Early traction was thin. Downloads sat around 500; retention needed
          clearer onboarding and a reason to come back.
        </p>
        <h3 className="mac-notion__h3">What we did</h3>
        <ul className="mac-notion__bullets">
          <li>
            Scaled downloads 20× (500 → 10K+) via campaigns, SEO, and onboarding
            fixes
          </li>
          <li>
            Launched a financial health check that reached 500K+ views
          </li>
          <li>
            Improved retention with Analytics-triggered messaging and flow
            redesigns
          </li>
        </ul>
        <h3 className="mac-notion__h3">Takeaway</h3>
        <p>
          Growth and product were the same loop: remove friction, give a sharp
          first win, then message people when the data says they stalled.
        </p>
      </>
    ),
  },
  {
    id: "blog-first-5",
    title: "Own the first 5 seconds",
    icon: "✎",
    section: "blog",
    type: "Blog",
    tags: ["Product craft"],
    status: "Draft → live",
    summary: "Why product engineers should own the opening beat.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          People decide whether a product feels serious almost immediately —
          before features, before onboarding copy.
        </p>
        <p>
          Sound, latency, empty states, and the first interactive affordance do
          more work than a feature list. On this portfolio that meant: splash →
          desktop, a dock that responds, windows that drag and resize, and no
          fake buttons.
        </p>
        <Callout icon="✍️" title="Point">
          <p>Craft is the pitch. The first five seconds are the resume.</p>
        </Callout>
      </>
    ),
  },
  {
    id: "blog-gtm",
    title: "GTM without spreadsheet energy",
    icon: "▤",
    section: "blog",
    type: "Blog",
    tags: ["GTM", "Systems"],
    status: "Draft → live",
    summary: "GTM systems that feel like products, not tab piles.",
    content: () => (
      <>
        <p className="mac-notion__lead">
          Clay, Apollo, HubSpot, CleverTap are powerful — the operator
          experience is usually duct tape.
        </p>
        <p>
          The job is sequencing: enrichment → qualification → message →
          feedback, with one obvious next step. Good GTM engineering looks
          boring from the outside: fewer tools, clearer states, and logs you can
          trust when something breaks at 11pm.
        </p>
      </>
    ),
  },
];

const SIDEBAR_SECTIONS: { id: NotionSection; label: string }[] = [
  { id: "favorites", label: "Favorites" },
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
  const [pageId, setPageId] = useState("home");
  const [query, setQuery] = useState("");
  const page = PAGES.find((p) => p.id === pageId) ?? PAGES[0]!;

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (p: NotionPage) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));

    return SIDEBAR_SECTIONS.map((section) => ({
      ...section,
      pages: PAGES.filter((p) => p.section === section.id && match(p)),
    })).filter((s) => s.pages.length > 0);
  }, [query]);

  const go = (id: string) => setPageId(id);

  return (
    <MacWindow
      open={open}
      minimized={minimized}
      title="Notion"
      variant="light"
      width={940}
      height={600}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
      bodyClassName="mac-notion-body"
      className="mac-window--notion"
    >
      <div className="mac-notion">
        <aside className="mac-notion__sidebar">
          <button
            type="button"
            className="mac-notion__workspace"
            data-ui-sound="click"
            onClick={() => go("home")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/dock/notion.png"
              alt=""
              className="mac-notion__workspace-icon"
              draggable={false}
            />
            <span>Shivam’s workspace</span>
          </button>

          <label className="mac-notion__search">
            <Search className="size-3.5 opacity-45" strokeWidth={2.25} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search pages"
            />
          </label>

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
                      onClick={() => go(item.id)}
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
          {grouped.length === 0 ? (
            <p className="mac-notion__empty-nav">No pages match</p>
          ) : null}
        </aside>

        <section className="mac-notion__page" aria-label={page.title}>
          <div className="mac-notion__topbar">
            <nav className="mac-notion__crumbs" aria-label="Breadcrumb">
              <button
                type="button"
                className="mac-notion__crumb"
                data-ui-sound="click"
                onClick={() => go("home")}
              >
                Projects &amp; writing
              </button>
              {page.id !== "home" ? (
                <>
                  <span className="mac-notion__crumb-sep" aria-hidden>
                    /
                  </span>
                  <span className="mac-notion__crumb is-current">{page.title}</span>
                </>
              ) : null}
            </nav>
          </div>

          <div className="mac-notion__scroll">
            <div className="mac-notion__cover" aria-hidden />
            <div className="mac-notion__page-inner" key={page.id}>
              <div className="mac-notion__page-icon" aria-hidden>
                {page.icon}
              </div>
              <h1 className="mac-notion__title">{page.title}</h1>

              <dl className="mac-notion__props">
                <div className="mac-notion__prop">
                  <dt>Type</dt>
                  <dd>{page.type}</dd>
                </div>
                <div className="mac-notion__prop">
                  <dt>Tags</dt>
                  <dd className="mac-notion__tags">
                    {page.tags.map((tag) => (
                      <span key={tag} className="mac-notion__tag">
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
                {page.status ? (
                  <div className="mac-notion__prop">
                    <dt>Status</dt>
                    <dd>
                      <span className="mac-notion__status">{page.status}</span>
                    </dd>
                  </div>
                ) : null}
              </dl>

              <p className="mac-notion__summary">{page.summary}</p>
              <div className="mac-notion__content">{page.content(go)}</div>
            </div>
          </div>
        </section>
      </div>
    </MacWindow>
  );
}
