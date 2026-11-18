import { LINKS, type FolderId } from "@/lib/portfolioContent";

export type SectionId = Exclude<FolderId, "notes">;

export type SectionItem = {
  id: string;
  name: string;
  kind: "folder" | "file";
  detail: string;
  link?: string;
  /** Optional brand icon under /public/icons/stack or /experience */
  icon?: string;
  role?: string;
  dates?: string;
  location?: string;
  highlights?: string[];
  /** Experience write-up fields */
  tagline?: string;
  context?: string;
  stats?: { value: string; label: string }[];
  work?: { title: string; text: string }[];
  result?: string;
  tools?: string[];
};

export type SectionGroup = {
  title: string;
  items: SectionItem[];
};

export type Section = {
  id: SectionId;
  name: string;
  items: SectionItem[];
  groups?: SectionGroup[];
};

export const SECTION_IDS: readonly SectionId[] = [
  "about",
  "experience",
  "projects",
  "skills",
  "resume",
];

export const SECTIONS: Section[] = [
  {
    id: "about",
    name: "About Me",
    items: [
      {
        id: "bio",
        name: "Bio",
        kind: "folder",
        detail:
          "I’m into product and GTM — building something people want and getting it to them are one problem. CS student on the side: applied AI, automations, agents. Solve first, optimise later. I take my work seriously; myself less so. Mountains, music, long debates. This Mac portfolio? I just love my device a little too much. Find me interesting? Let’s connect.",
      },
      {
        id: "focus",
        name: "Focus Areas",
        kind: "folder",
        detail:
          "Product & GTM (same problem, two ends) · Growth · Applied AI automations & agents · Solve first, optimise later.",
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
        id: "blinkmoney",
        name: "BlinkMoney",
        kind: "file",
        detail: "AI Product Intern · March 2026 – July 2026 · Remote",
        icon: "/icons/experience/blinkmoney.svg",
        link: "https://www.blinkmoney.in/",
        role: "AI Product Intern",
        dates: "March 2026 – July 2026",
        location: "Remote",
        tagline:
          "Indian fintech app for investments and loans against mutual funds. Joined in the app’s early days.",
        context:
          "The app had about 500 downloads. There was little awareness and no repeatable growth engine, and user communication and design review were manual.",
        stats: [
          { value: "20×", label: "Downloads, 500 → 10K+" },
          { value: "500K+", label: "Views on the health-check tool" },
        ],
        work: [
          {
            title: "Growth and marketing",
            text: "Ran marketing campaigns to bring in new users. Owned SEO content and was the point of contact with the external agency, Rocket SEO. This gave the app organic discovery instead of relying only on paid or manual outreach.",
          },
          {
            title: "Financial health-check tool",
            text: "Built a tool on my own that assesses a user’s financial stability. It reached 500K+ views and worked as a top-of-funnel hook, bringing people to the app by giving them something useful first.",
          },
          {
            title: "User messaging automation",
            text: "Built Google Analytics-triggered workflows that send personalised messages based on what users do in the app. This replaced manual outreach, so the team could re-engage inactive users at scale.",
          },
          {
            title: "Product flow, UX and retention",
            text: "Worked on the product flow and collected user feedback to find where people dropped off. Used those findings to improve key journeys and retention.",
          },
          {
            title: "Vishwakarma, an internal AI tool",
            text: "Built an AI tool that reviews product screens, which sped up design review and iteration for the team.",
          },
        ],
        result:
          "Downloads grew from 500 to 10K+ (20×). The financial health tool reached 500K+ views.",
        tools: [
          "Google Analytics",
          "SEO tooling",
          "AI / LLM tooling",
          "Marketing campaign tools",
        ],
      },
      {
        id: "omegaup",
        name: "omegaUp",
        kind: "file",
        detail: "Maintainer · February 2026 – Present · Remote",
        icon: "/icons/experience/omegaup.svg",
        link: "https://omegaup.com/",
        role: "Maintainer, Vue 2 → Vue 3 migration",
        dates: "February 2026 – Present",
        location: "Remote · Open source (GSSoC)",
        tagline: "Open-source programming education platform.",
        context:
          "The frontend ran on legacy Vue 2 and Bootstrap, and the migration had stalled. Without it the codebase would keep falling behind and get harder to maintain.",
        stats: [
          { value: "Vue 3", label: "Migration from Vue 2, revived and led" },
          { value: "BS 5", label: "Bootstrap upgrade alongside it" },
        ],
        work: [
          {
            title: "Lead the migration",
            text: "Revived and now lead the whole migration from Vue 2 to Vue 3 and Bootstrap 5.",
          },
          {
            title: "Manage contributors",
            text: "Break the migration into issues, line them up in priority order, assign them, and guide contributors on how to implement each one. This keeps many people working in parallel without blocking each other.",
          },
          {
            title: "Fix issues myself",
            text: "Resolved bugs and open GitHub issues through merged PRs.",
          },
          {
            title: "Repository collaborator",
            text: "Became a collaborator through consistent contributions and close work with maintainers on GitHub issues and Discord.",
          },
        ],
        result:
          "A stalled project became an organised, contributor-driven effort, and the codebase moved toward a modern, consistent frontend.",
        tools: ["Vue 2 / 3", "Bootstrap 5", "GitHub", "Discord"],
      },
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
        tagline: "AI data and LLM training.",
        stats: [{ value: "1,000+", label: "Agent tasks reviewed" }],
        work: [
          {
            title: "Task review",
            text: "Reviewed 1,000+ multimodal and command-line agent tasks used in LLM training datasets.",
          },
          {
            title: "ShellBench",
            text: "Contributed to ShellBench, improving the quality of the command-line tasks used to benchmark AI agents.",
          },
          {
            title: "Review pipelines",
            text: "Built review pipelines and refined multimodal tasks, improving data quality and difficulty calibration.",
          },
        ],
        result:
          "Cleaner, better-calibrated training and benchmark data, which makes the models trained on it more reliable.",
      },
      {
        id: "vidhyalay",
        name: "Vidhyalay Udhyam",
        kind: "file",
        detail: "Product Intern · June 2025 – August 2025 · Udaipur",
        icon: "/icons/experience/vidhyalay.png",
        role: "Product Intern",
        dates: "June 2025 – August 2025",
        location: "Udaipur",
        tagline:
          "Udaipur-based NGO. Two-month internship on a project building solutions for daily-wage labour.",
        work: [
          {
            title: "User discovery",
            text: "Researched the daily-wage labour problem with the people affected, in Tier-3 India, to find the real pain points.",
          },
          {
            title: "Product definition",
            text: "Turned the research into product specs and prioritised features for an MVP.",
          },
          {
            title: "Build",
            text: "Shipped a Next.js MVP.",
          },
        ],
        result:
          "The project moved from an open problem to a working MVP. The internship certificate credits analytical thinking, creativity and teamwork.",
        tools: ["Next.js"],
      },
      {
        id: "fests",
        name: "College Fests",
        kind: "folder",
        detail: "Leadership · Damru, Photon, Neutron 2.0",
        role: "Leadership",
        tagline: "Organising and outreach for college fests.",
        stats: [{ value: "3", label: "Fests led or on the core team" }],
        work: [
          {
            title: "Damru, the annual fest",
            text: "Organised the fest, curated events, and managed the team and sponsors.",
          },
          {
            title: "Photon and Neutron 2.0",
            text: "Core Committee Member handling PR and outreach.",
          },
        ],
        result:
          "Led or was on the core team of 3 college fests: team management, sponsor outreach and execution.",
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
          "Interactive macOS-style portfolio — dock, Spotlight, notifications, Claude mascot.",
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
          {
            id: "notion",
            name: "Notion",
            kind: "file",
            detail: "Specs, roadmaps, and team docs.",
            icon: "/icons/dock/notion.png",
            link: LINKS.notion,
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
          {
            id: "sanity",
            name: "Sanity",
            kind: "file",
            detail: "Headless CMS for marketing and site content.",
            icon: "/icons/stack/sanity.png",
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
];

export function isSectionId(id: string): id is SectionId {
  return (SECTION_IDS as readonly string[]).includes(id);
}

export function getSection(id: SectionId): Section {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0]!;
}

export function sectionItemsOf(section: Section): SectionItem[] {
  if (section.groups?.length) {
    return section.groups.flatMap((g) => g.items);
  }
  return section.items;
}

export function experienceInfoRows(
  item: SectionItem,
): { label: string; value: string }[] {
  const rows = [
    { label: "Role", value: item.role },
    { label: "Company", value: item.name },
    { label: "Dates", value: item.dates },
    { label: "Location", value: item.location },
  ].filter((row): row is { label: string; value: string } =>
    Boolean(row.value),
  );
  if (item.link) {
    rows.push({
      label: "Website",
      value: item.link.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    });
  }
  return rows;
}
