import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const login = process.env.GITHUB_LOGIN || "shiavm006";
const token =
  process.env.GITHUB_TOKEN ||
  execSync("gh auth token", { encoding: "utf8" }).trim();

const QUERY = `{
  user(login: "${login}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount contributionLevel }
        }
      }
    }
  }
}`;

const LEVEL = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: QUERY }),
});

if (!res.ok) throw new Error(`GitHub GraphQL failed: ${res.status}`);
const json = await res.json();
if (json.errors) throw new Error(JSON.stringify(json.errors));

const cal = json.data.user.contributionsCollection.contributionCalendar;
const days = cal.weeks.flatMap((w) => w.contributionDays);
const out = {
  login,
  total: cal.totalContributions,
  start: days[0].date,
  end: days[days.length - 1].date,
  counts: days.map((d) => d.contributionCount),
  levels: days.map((d) => LEVEL[d.contributionLevel] ?? 0),
  dates: days.map((d) => d.date),
  weeks: cal.weeks.length,
};

const dest = join(__dirname, "../src/data/github.json");
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(out));
console.log(`Wrote ${dest} (${days.length} days, ${out.total} total)`);
