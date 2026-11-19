import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSection } from "@/lib/sectionContent";
import { SITE } from "@/lib/siteMeta";

/**
 * Link-preview image (X, LinkedIn, WhatsApp), drawn from the site's own data.
 * Name and roles come from siteMeta.ts, the numbers from the Experience
 * section in sectionContent.ts. Edit those and redeploy, and the preview
 * follows. Next.js renders this once at build time.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = `${SITE.name}: ${SITE.roles.join(", ")}. Pixel-art Shivam at his desk on a teal macOS-style desktop.`;

const TEAL = "#0f6f6c";
const CORAL = "#ff5941";

/** First numeric stat from each experience entry, e.g. "20×" from BlinkMoney. */
function headlineStats(max = 3) {
  return getSection("experience")
    .items.flatMap((item) =>
      (item.stats ?? [])
        .filter((s) => /\d/.test(s.value))
        .slice(0, 1)
        .map((s) => ({ value: s.value, label: s.label, company: item.name })),
    )
    .slice(0, max);
}

export async function renderOgImage() {
  const art = await readFile(
    join(process.cwd(), "public/illustrations/experience-hero.png"),
  );
  const artSrc = `data:image/png;base64,${art.toString("base64")}`;
  const [geistRegular, geistBold] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/Geist-Bold.ttf")),
  ]);
  const stats = headlineStats();

  // Satori only supports flexbox: every element with children sets display:flex.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: TEAL,
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.28) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          color: "white",
          fontFamily: "Geist",
        }}
      >
        {/* Menu bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 34,
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            backgroundColor: "rgba(10,60,58,0.6)",
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {SITE.name}
        </div>

        {/* Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 64,
            width: 640,
          }}
        >
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
            {SITE.name}
          </div>
          <div style={{ display: "flex", marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 22px",
                borderRadius: 18,
                backgroundColor: CORAL,
                fontSize: 38,
                fontWeight: 700,
              }}
            >
              {SITE.roles.join(" · ")}
            </div>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
            {stats.map((s) => (
              <div
                key={s.company}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "12px 16px",
                  borderRadius: 12,
                  backgroundColor: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  width: 170,
                }}
              >
                <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>{s.value}</div>
                <div style={{ display: "flex", fontSize: 16, opacity: 0.85, marginTop: 2 }}>
                  {s.company}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Illustration */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={artSrc}
          width={540}
          height={378}
          style={{ position: "absolute", right: 40, bottom: 70 }}
        />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
      ],
    },
  );
}
