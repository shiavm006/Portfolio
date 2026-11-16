import type { ReactNode } from "react";
import AboutBio from "@/components/AboutBio";

export type FolderId =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "resume"
  | "notes";

export const LINKS = {
  x: "https://x.com/Shivammitt2312",
  github: "https://github.com/shiavm006",
  linkedin: "https://www.linkedin.com/in/shivam-mittal-464a9031a/",
  claude: "https://claude.ai/",
  notion: "https://www.notion.so/",
  gmail: "mailto:shivammittal42006@gmail.com",
  spotify: "https://open.spotify.com/",
  portfolioRepo: "https://github.com/shiavm006/Portfolio",
} as const;

export const FOLDER_WINDOWS: Record<
  FolderId,
  { title: string; body: ReactNode }
> = {
  about: {
    title: "About Me",
    body: <AboutBio showLinks />,
  },
  experience: {
    title: "Experience",
    body: (
      <>
        <h2>Experience</h2>
        <p>
          <strong>Frontier AI Researcher</strong> · Parsewave · Remote
          <br />
          June 2026 – July 2026
        </p>
        <ul>
          <li>
            Reviewed 1,000+ multimodal and command-line agent tasks for LLM
            training datasets.
          </li>
          <li>
            Contributed to ShellBench, improving the quality of command-line
            tasks used to benchmark AI agents.
          </li>
          <li>
            Built review pipelines and refined multimodal tasks, improving data
            quality and how well task difficulty was calibrated.
          </li>
        </ul>
        <p>
          <strong>AI Product Intern</strong> · BlinkMoney · Remote
          <br />
          March 2026 – July 2026
        </p>
        <ul>
          <li>
            Scaled app downloads 20× (500 to 10K+) through marketing campaigns,
            SEO, and onboarding optimisation.
          </li>
          <li>
            Launched a financial health check tool that evaluates users’
            financial stability, reaching 500K+ views.
          </li>
          <li>
            Improved retention via automated Google Analytics–triggered messaging
            and feedback-driven product flow redesigns.
          </li>
        </ul>
        <p>
          <strong>Collaborator</strong> · OmegaUp · Remote
          <br />
          February 2026 – Present
        </p>
        <ul>
          <li>
            Led omegaUp’s end-to-end Vue 2 to Vue 3 migration as project
            maintainer.
          </li>
          <li>
            Managed contributors by triaging issues, prioritising the backlog,
            assigning tasks, and guiding implementation.
          </li>
        </ul>
        <p>
          <strong>Product Intern</strong> · Vidhyalay Udhyam Association · Remote
          <br />
          June 2025 – August 2025
        </p>
        <ul>
          <li>
            Ran user discovery with daily-wage labourers in Tier-3 India, mapping
            core pain points.
          </li>
          <li>
            Converted field research into product specs and prioritised features
            for the MVP.
          </li>
          <li>
            Shipped an MVP and validated the solution with labourers and local
            stakeholders.
          </li>
        </ul>
      </>
    ),
  },
  projects: {
    title: "Projects",
    body: (
      <>
        <h2>Selected work</h2>
        <ul>
          <li>
            <strong>Portfolio desktop</strong> — interactive macOS-style site
            with dock, Spotlight, and Claude mascot.{" "}
            <a
              href={LINKS.portfolioRepo}
              target="_blank"
              rel="noopener noreferrer"
            >
              View repo
            </a>
          </li>
          <li>
            <strong>Experiments</strong> — motion, Web Audio, and UI prototypes
            living in public repos on{" "}
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
              github.com/shiavm006
            </a>
            .
          </li>
        </ul>
      </>
    ),
  },
  skills: {
    title: "Skills",
    body: (
      <>
        <h2>Tools &amp; stack I use</h2>
        <ul>
          <li>
            <strong>Languages</strong> — TypeScript, Python, Databases
          </li>
          <li>
            <strong>Full stack</strong> — React, Next.js, Tailwind, FastAPI,
            Sanity, Docker, Kubernetes, Cloudflare, GitHub Actions, Git
          </li>
          <li>
            <strong>Product</strong> — discovery, shipping, PostHog, Excel
          </li>
          <li>
            <strong>Applied AI</strong> — OpenAI, Claude, LangChain, LangGraph,
            MCP, Hugging Face, Jupyter, Colab, Firecrawl, n8n, Zapier
          </li>
          <li>
            <strong>GTM</strong> — Clay, Apollo.io, HubSpot, CleverTap
          </li>
        </ul>
      </>
    ),
  },
  resume: {
    title: "Resume",
    body: (
      <>
        <h2>Resume</h2>
        <p>
          Product & GTM, applied AI, leaning growth. Solve the problem first,
          optimise later.
        </p>
        <p>
          Prefer a live trail? Browse{" "}
          <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>{" "}
          or reach out on{" "}
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          .
        </p>
        <p>
          <a href={LINKS.gmail}>Email me</a> for a PDF resume.
        </p>
      </>
    ),
  },
  notes: {
    title: "Notes",
    body: (
      <>
        <h2>Scratch pad</h2>
        <ul>
          <li>⌘K opens Spotlight</li>
          <li>Click the clock / bell for Notification Centre</li>
          <li>Folders on the right open real windows</li>
        </ul>
      </>
    ),
  },
};
