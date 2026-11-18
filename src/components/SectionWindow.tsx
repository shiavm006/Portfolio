"use client";

import { useMemo, useState } from "react";
import {
  MousePointerClick,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import MacWindow, { useMacWindowChrome } from "@/components/MacWindow";
import AboutBio from "@/components/AboutBio";
import { IconFolderLarge } from "@/components/finder/FinderIcons";
import {
  sectionItemsOf,
  type Section,
  type SectionId,
  type SectionItem,
} from "@/lib/sectionContent";
import type { SectionWindowState } from "@/lib/windowManager";
import { cn } from "@/lib/utils";

type SectionWindowProps = {
  section: Section;
  windowState: SectionWindowState;
  focused: boolean;
  zIndex: number;
  /** Optional size override (used for the landing layout) */
  frameSize?: { w: number; h: number };
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
};

const SUBTITLES: Record<SectionId, string> = {
  about: "Product, GTM and applied AI. Who I am and what I care about.",
  experience: "Where I've worked and what I shipped there.",
  projects: "Things I've built and keep tinkering with.",
  skills: "Tools and stack I use across product, GTM and applied AI.",
  resume: "A short summary and the best ways to reach me.",
};

/** Accent colours for the left stripe on list cards. */
const STRIPES = ["#ff5941", "#0f6f6c", "#e0a526", "#3a8f8b", "#d9774f"];

export default function SectionWindow({
  section,
  windowState,
  focused,
  zIndex,
  frameSize,
  onClose,
  onMinimize,
  onFocus,
}: SectionWindowProps) {
  return (
    <MacWindow
      open={windowState.open}
      minimized={windowState.minimized}
      focused={focused}
      title={section.name}
      chrome="none"
      width={frameSize?.w ?? (section.id === "about" ? 760 : 880)}
      height={frameSize?.h ?? (section.id === "about" ? 540 : 580)}
      minWidth={360}
      minHeight={280}
      initialPosition={windowState.origin}
      zIndex={zIndex}
      className={`ph-window ph-window--${section.id}`}
      bodyClassName="ph-window__body"
      onClose={onClose}
      onMinimize={onMinimize}
      onFocus={onFocus}
    >
      <SectionChrome section={section} />
    </MacWindow>
  );
}

function openLink(item: SectionItem) {
  if (item.link) window.open(item.link, "_blank", "noopener,noreferrer");
}

function SectionChrome({ section }: { section: Section }) {
  const chrome = useMacWindowChrome();
  const items = useMemo(() => sectionItemsOf(section), [section]);

  return (
    <div className="ph-window__frame">
      <div
        className="ph-titlebar"
        data-mac-drag
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
          chrome?.onToggleZoom();
        }}
      >
        {/* macOS traffic lights: close, minimize, zoom */}
        <div className="mac-window__traffic ph-titlebar__traffic" data-no-drag>
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
      </div>

      <div className="ph-window__content">
        <div className="ph-page">
          {section.id === "experience" ? null : (
          <header className="ph-head">
            <h1 className="ph-head__title">{section.name}</h1>
            <p className="ph-head__sub">{SUBTITLES[section.id]}</p>
          </header>
          )}

          {section.id === "about" ? (
            <div className="ph-panel ph-about">
              <AboutBio showLinks className="ph-about__bio" />
            </div>
          ) : section.id === "experience" ? (
            <ExperienceLayout items={items} />
          ) : section.id === "skills" ? (
            <SkillsLayout section={section} />
          ) : (
            <CardList items={items} />
          )}
        </div>
      </div>
    </div>
  );
}

function ItemIcon({ item, className }: { item: SectionItem; className: string }) {
  return item.icon ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.icon} alt="" className={className} draggable={false} />
  ) : (
    <IconFolderLarge className={className} />
  );
}

/** Projects and Resume: stacked cards with a coloured left stripe. */
function CardList({ items }: { items: SectionItem[] }) {
  return (
    <ul className="ph-cards">
      {items.map((item, i) => (
        <li key={item.id}>
          <button
            type="button"
            className="ph-card"
            style={{ borderLeftColor: STRIPES[i % STRIPES.length] }}
            data-ui-sound="click"
            onClick={() => openLink(item)}
          >
            <span className="ph-card__name">{item.name}</span>
            <span className="ph-card__detail">{item.detail}</span>
            {item.link ? (
              <span className="ph-card__meta">
                {item.link.replace(/^(https?:\/\/|mailto:)/, "").replace(/\/$/, "")}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Hero bullet points: bold lead sentence, then the detail. */
const HERO_POINTS = [
  {
    Icon: TrendingUp,
    color: "#ff5941",
    lead: "Grew a fintech app 20×.",
    text: "500 → 10K+ downloads at BlinkMoney.",
  },
  {
    Icon: MousePointerClick,
    color: "#0f6f6c",
    lead: "Fixed where users dropped off.",
    text: "Reworked key screens and their copy for retention.",
  },
  {
    Icon: Sparkles,
    color: "#e0a526",
    lead: "Improved the data that trains AI agents.",
    text: "Reviewed 1,000+ agent tasks at Parsewave.",
  },
];

/** Tab colours for the role switcher (one per role, in order). */
const TAB_COLORS = ["#0f6f6c"];

/**
 * Experience, built from PostHog homepage patterns:
 * hero + CTA card, coloured role tabs with a framed panel,
 * a tools marquee, a big-number results list, and leadership cards.
 */
function ExperienceLayout({ items }: { items: SectionItem[] }) {
  const roles = items.filter((item) => item.kind === "file");
  const fests = items.find((item) => item.id === "fests");
  const [active, setActive] = useState(0);
  const role = roles[active] ?? roles[0];
  const color = TAB_COLORS[active % TAB_COLORS.length];

  const tools = Array.from(new Set(roles.flatMap((r) => r.tools ?? [])));

  const results: { text: string; meta: string }[] = [
    { text: "Downloads grew from 500 to 10K+", meta: "BlinkMoney · Growth" },
    { text: "Financial health-check tool reached 500K+ views", meta: "BlinkMoney · Top of funnel" },
    { text: "Revived and lead the Vue 2 → Vue 3 migration", meta: "omegaUp · Maintainer" },
    { text: "Reviewed 1,000+ agent tasks for LLM training data", meta: "Parsewave · ShellBench" },
    { text: "Took an open problem to a working Next.js MVP", meta: "Vidhyalay Udhyam · NGO" },
  ];

  return (
    <div className="ph-x">
      {/* Hero */}
      <section className="ph-x__hero">
        <div className="ph-x__hero-text">
          <h1 className="ph-x__title">
            I build products, then get them used
          </h1>
          <ul className="ph-x__points">
            {HERO_POINTS.map(({ Icon, color, lead, text }) => (
              <li key={lead}>
                <Icon className="ph-x__point-icon" style={{ color }} strokeWidth={2} aria-hidden />
                <p>
                  <strong>{lead}</strong> {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/experience-hero.png"
          alt="Pixel-art Shivam at his desk with a laptop, thinking about a rising chart"
          className="ph-x__hero-art"
          draggable={false}
        />
      </section>

      {/* Role tabs + framed panel */}
      {role ? (
        <section className="ph-x__tabs-wrap">
          <h2 className="ph-x__h2 ph-x__tabs-title">Teams I worked with</h2>
          <div className="ph-x__tabs" role="tablist" aria-label="Teams I worked with">
            {roles.map((r, i) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                data-ui-sound="click"
                className={cn("ph-x__tab", i === active && "is-active")}
                style={
                  i === active
                    ? { background: TAB_COLORS[i % TAB_COLORS.length] }
                    : undefined
                }
                onClick={() => setActive(i)}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="ph-x__frame" style={{ background: color }}>
            <div className="ph-x__panel" key={role.id}>
              <div className="ph-x__board">
                {(role.work ?? []).map((w, i) => (
                  <div key={w.title} className="ph-x__ticket">
                    <div className="ph-x__ticket-head">
                      <span className="ph-x__badge" style={{ color, borderColor: color }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <strong>{w.title}</strong>
                    </div>
                    <p>{w.text}</p>
                  </div>
                ))}
              </div>

              <div className="ph-x__info">
                <div className="ph-x__info-head">
                  <ItemIcon item={role} className="ph-x__logo" />
                  <div>
                    <h2 className="ph-x__role">{role.role}</h2>
                    <p className="ph-x__meta">
                      {[role.name, role.dates, role.location].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <p className="ph-x__body">
                  {[role.tagline, role.context].filter(Boolean).join(" ")}
                </p>
                {role.link ? (
                  <a
                    className="ph-btn ph-btn--orange ph-btn--sm"
                    href={role.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ui-sound="click"
                  >
                    Visit {role.name} ↗
                  </a>
                ) : null}

                {role.stats?.length || role.result ? (
                  <>
                    <p className="ph-x__small">What it led to:</p>
                    <div className="ph-x__signals">
                      {(role.stats ?? []).map((s) => (
                        <div key={s.label}>
                          <span className="ph-x__signal-title">{s.value}</span>
                          <span>{s.label}</span>
                        </div>
                      ))}
                    </div>
                    {role.result ? <p className="ph-x__result">{role.result}</p> : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Tools marquee */}
      {tools.length ? (
        <section className="ph-x__marquee" aria-label="Tools I used">
          <span className="ph-x__marquee-label">Tools I used:</span>
          <div className="ph-x__marquee-track">
            <div className="ph-x__marquee-row">
              {[...tools, ...tools].map((tool, i) => (
                <span key={`${tool}-${i}`} aria-hidden={i >= tools.length}>
                  <i style={{ background: STRIPES[i % STRIPES.length] }} />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Big number + numbered results */}
      <section className="ph-x__results">
        <h2 className="ph-x__h2">Results, so far</h2>
        <p className="ph-x__muted">What changed because of the work above.</p>
        <div className="ph-x__results-grid">
          <div className="ph-x__big">
            <strong>20×</strong>
            <span>download growth at BlinkMoney, from about 500 to 10K+</span>
          </div>
          <ol className="ph-x__list">
            {results.map((r, i) => (
              <li key={r.text}>
                <span className="ph-x__list-num">{i + 1}</span>
                <span>
                  <strong>{r.text}</strong>
                  <small>{r.meta}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Leadership, two cards side by side */}
      {fests?.work?.length ? (
        <section>
          <h2 className="ph-x__h2">Leadership</h2>
          <p className="ph-x__muted">{fests.result}</p>
          <div className="ph-x__pair">
            {fests.work.map((w) => (
              <div key={w.title} className="ph-x__pair-card">
                <p className="ph-x__pair-title">{w.title}</p>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** One-line subtitle under each skills card heading. */
const SKILL_SUBTITLES: Record<string, string> = {
  Languages: "What most of my code is written in.",
  GTM: "Where outbound and lifecycle work happens.",
  "Full stack": "How I build and ship web products.",
  Product: "How I measure what's working.",
  "Applied AI": "Models, agents and automation I build with.",
};

function SkillRow({
  item,
  showDetail,
}: {
  item: SectionItem;
  showDetail: boolean;
}) {
  return (
    <li>
      <button
        type="button"
        className="ph-skill"
        data-ui-sound="click"
        onClick={() => openLink(item)}
        title={item.detail}
      >
        <ItemIcon item={item} className="ph-skill__icon" />
        <span className="ph-skill__text">
          <span className="ph-skill__name">{item.name}</span>
          {showDetail ? <small>{item.detail}</small> : null}
        </span>
      </button>
    </li>
  );
}

function SkillCardHead({ title }: { title: string }) {
  return (
    <div className="ph-skillcard__head">
      <h2 className="ph-label">{title}</h2>
      {SKILL_SUBTITLES[title] ? (
        <p className="ph-skillcard__sub">{SKILL_SUBTITLES[title]}</p>
      ) : null}
    </div>
  );
}

/**
 * Skills, laid out like the PostHog docs home:
 * two small cards on top, one wide card below them, and a tall
 * "guides" column on the right that scrolls inside its card.
 */
function SkillsLayout({ section }: { section: Section }) {
  const group = (title: string) =>
    section.groups?.find((g) => g.title === title);
  const languages = group("Languages");
  const gtm = group("GTM");
  const fullStack = group("Full stack");
  const product = group("Product");
  const ai = group("Applied AI");

  return (
    <div className="ph-skills">
      {languages ? (
        <section className="ph-panel ph-skillcard ph-skills__lang">
          <SkillCardHead title={languages.title} />
          <ul className="ph-skill-list">
            {languages.items.map((item) => (
              <SkillRow key={item.id} item={item} showDetail />
            ))}
          </ul>
        </section>
      ) : null}

      {gtm ? (
        <section className="ph-panel ph-skillcard ph-skills__gtm">
          <SkillCardHead title={gtm.title} />
          <ul className="ph-skill-list">
            {gtm.items.map((item) => (
              <SkillRow key={item.id} item={item} showDetail={false} />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="ph-panel ph-skillcard ph-skills__wide">
        {fullStack ? (
          <>
            <SkillCardHead title={fullStack.title} />
            <ul className="ph-skill-list ph-skill-list--cols">
              {fullStack.items.map((item) => (
                <SkillRow key={item.id} item={item} showDetail={false} />
              ))}
            </ul>
          </>
        ) : null}
        {product ? (
          <div className="ph-skillcard__more">
            <SkillCardHead title={product.title} />
            <ul className="ph-skill-list ph-skill-list--cols">
              {product.items.map((item) => (
                <SkillRow key={item.id} item={item} showDetail={false} />
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {ai ? (
        <section className="ph-panel ph-skillcard ph-skills__guides">
          <SkillCardHead title={ai.title} />
          <div className="ph-guides">
            <ul className="ph-skill-list ph-guides__list">
              {ai.items.map((item) => (
                <SkillRow key={item.id} item={item} showDetail />
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
