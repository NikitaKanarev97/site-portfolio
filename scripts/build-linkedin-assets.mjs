import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public", "media", "linkedin");
const caseDir = path.join(outDir, "cases");
const manrope = path.join(root, "scripts", "og-fonts", "Manrope-800.ttf");
const mono = path.join(root, "scripts", "og-fonts", "JetBrainsMono-500.ttf");

const palette = {
  paper: "#F7F7F5",
  ink: "#1B1B18",
  muted: "#686863",
  rule: "#D8D8D2",
  accent: "#C1440E",
  white: "#FFFFFF",
};

const escape = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

async function typeLayer({ text, fontfile, font, size, color, width, align = "left", spacing = 0 }) {
  return sharp({
    text: {
      text: `<span foreground="${color}" letter_spacing="${spacing}">${escape(text)}</span>`,
      font: `${font} ${size}`,
      fontfile,
      width,
      align,
      rgba: true,
      dpi: 72,
    },
  }).png().toBuffer();
}

async function buildProfileBanner() {
  const source = path.join(outDir, "2026-09-01-19-44-55-linkedin-banner-krea-source.png");
  const base = await sharp(source)
    .resize(1584, 396, { fit: "cover", position: "centre", kernel: "lanczos3" })
    .png()
    .toBuffer();

  const title = await typeLayer({
    text: "PRODUCT DESIGN\nFOR COMPLEX B2B SYSTEMS",
    fontfile: manrope,
    font: "Manrope",
    size: 36,
    color: palette.ink,
    width: 520,
  });
  const meta = await typeLayer({
    text: "WORKFLOWS  ·  AI OVERSIGHT  ·  DESIGN SYSTEMS",
    fontfile: mono,
    font: "JetBrains Mono",
    size: 13,
    color: palette.muted,
    width: 560,
    spacing: 250,
  });

  const accents = Buffer.from(`<svg width="1584" height="396" xmlns="http://www.w3.org/2000/svg">
    <rect x="72" y="48" width="34" height="4" rx="2" fill="${palette.accent}"/>
    <circle cx="119" cy="50" r="2" fill="${palette.accent}"/>
  </svg>`);

  await sharp(base)
    .composite([
      { input: accents, left: 0, top: 0 },
      { input: title, left: 72, top: 70 },
      { input: meta, left: 74, top: 168 },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(outDir, "linkedin-banner-v2.png"));
}

const cases = [
  {
    slug: "agent-ops-console",
    index: "01",
    title: "AGENT OPS\nCONSOLE",
    subtitle: "AI oversight & risk operations",
    meta: "PRODUCT DESIGN  ·  UX RESEARCH  ·  REACT",
    source: "public/media/case-agent-ops/cover/review-queue.webp",
  },
  {
    slug: "b2b-partner-portal",
    index: "02",
    title: "B2B PARTNER\nPORTAL",
    subtitle: "Ordering workflows & design system",
    meta: "PRODUCT DESIGN  ·  B2B SAAS  ·  REACT",
    source: "public/media/case-dssl/cover/dashboard.webp",
  },
  {
    slug: "vet-clinic-os",
    index: "03",
    title: "VET CLINIC OS",
    subtitle: "Clinical workflows & design system",
    meta: "PRODUCT DESIGN  ·  UX ARCHITECTURE  ·  REACT",
    source: "public/media/case-vet/cover/vet-day-queue.webp",
  },
  {
    slug: "pawly",
    index: "04",
    title: "PAWLY",
    subtitle: "Booking, trust & evidence flows",
    meta: "PRODUCT DESIGN  ·  MOBILE UX  ·  REACT",
    source: "public/media/case-pawly/cover/screen-gallery.webp",
    extract: { left: 140, top: 290, width: 1720, height: 960 },
  },
];

const casesV3 = [
  {
    slug: "agent-ops-console",
    index: "01",
    title: "AGENT OPS\nCONSOLE",
    problem: "Oversight for AI commitments\nand money at risk.",
    scope: "SOLE DESIGNER  ·  RESEARCH → TESTED PROTOTYPE",
    evidence: "PAID CLIENT  ·  USER-TESTED  ·  ACCEPTED",
    source: "public/media/case-agent-ops/cover/action-approvals.webp",
    background: "public/media/linkedin/case-backgrounds/2026-09-01-19-55-35-agent-ops-krea.png",
  },
  {
    slug: "b2b-partner-portal",
    index: "02",
    title: "B2B PARTNER\nPORTAL",
    problem: "Procurement workflows with\ntraceable source lines.",
    scope: "PRODUCT DESIGN  ·  DESIGN SYSTEM  ·  REACT",
    evidence: "COMMERCIAL REDESIGN  ·  SHIPPED IN FULL",
    source: "public/media/case-dssl/cover/resolution-center.webp",
    background: "public/media/linkedin/case-backgrounds/2026-09-01-19-56-38-b2b-portal-krea.png",
  },
  {
    slug: "vet-clinic-os",
    index: "03",
    title: "VET CLINIC\nOS",
    problem: "Clinical records that work\ninside the appointment.",
    scope: "RESEARCH  ·  PRODUCT DESIGN  ·  PROTOTYPE",
    evidence: "REAL CLINIC  ·  LIVE INTERVIEWS  ·  2 WEEKS",
    source: "public/media/case-vet/cover/vet-day-queue.webp",
    background: "public/media/linkedin/case-backgrounds/2026-09-01-19-58-09-vet-clinic-krea.png",
  },
  {
    slug: "pawly",
    index: "04",
    title: "PAWLY",
    problem: "Trust, handover proof and\nrecovery for pet care.",
    scope: "PRODUCT STRATEGY  ·  MOBILE UX  ·  REACT",
    evidence: "CONCEPT  ·  17 ROUTES  ·  71 FINDINGS RESOLVED",
    source: "public/media/case-pawly/cover/screen-gallery.webp",
    extract: { left: 140, top: 290, width: 1720, height: 960 },
    frameHeight: 416,
    background: "public/media/linkedin/case-backgrounds/2026-09-01-19-58-35-pawly-krea.png",
  },
];

async function roundedScreenshot(item) {
  const w = 700;
  const h = 438;
  let source = sharp(path.join(root, item.source));
  if (item.extract) source = source.extract(item.extract);
  const frame = await source
    .resize(w, h, {
      fit: "contain",
      position: "centre",
      background: palette.white,
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();
  const mask = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" rx="18" fill="#fff"/>
  </svg>`);
  const border = Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="17" fill="none" stroke="rgba(27,27,24,.16)" stroke-width="2"/>
  </svg>`);
  return sharp(frame)
    .composite([
      { input: mask, blend: "dest-in" },
      { input: border, blend: "over" },
    ])
    .png()
    .toBuffer();
}

async function buildCaseCover(item) {
  const background = Buffer.from(`<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="628" fill="${palette.paper}"/>
    <path d="M0 0H1200V628H0Z" fill="url(#grain)" opacity=".14"/>
    <defs><filter id="noise"><feTurbulence baseFrequency=".9" numOctaves="2" seed="8" stitchTiles="stitch"/></filter>
      <pattern id="grain" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" filter="url(#noise)" opacity=".08"/></pattern></defs>
    <rect x="56" y="62" width="34" height="4" rx="2" fill="${palette.accent}"/>
    <circle cx="103" cy="64" r="2" fill="${palette.accent}"/>
    <path d="M56 538H438" stroke="${palette.rule}" stroke-width="1"/>
    <path d="M56 538H176" stroke="${palette.accent}" stroke-width="3"/>
    <rect x="472" y="107" width="700" height="438" rx="18" fill="#000" opacity=".09" transform="translate(0 10)"/>
  </svg>`);

  const index = await typeLayer({
    text: `CASE ${item.index}`,
    fontfile: mono,
    font: "JetBrains Mono",
    size: 14,
    color: palette.accent,
    width: 320,
    spacing: 650,
  });
  const title = await typeLayer({
    text: item.title,
    fontfile: manrope,
    font: "Manrope",
    size: 45,
    color: palette.ink,
    width: 360,
  });
  const subtitle = await typeLayer({
    text: item.subtitle,
    fontfile: manrope,
    font: "Manrope",
    size: 22,
    color: palette.ink,
    width: 350,
  });
  const meta = await typeLayer({
    text: item.meta,
    fontfile: mono,
    font: "JetBrains Mono",
    size: 12,
    color: palette.muted,
    width: 350,
    spacing: 180,
  });
  const screenshot = await roundedScreenshot(item);

  await sharp(background)
    .composite([
      { input: index, left: 56, top: 90 },
      { input: title, left: 56, top: 142 },
      { input: subtitle, left: 56, top: 292 },
      { input: meta, left: 56, top: 398 },
      { input: screenshot, left: 472, top: 97 },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(caseDir, `${item.slug}-featured.png`));
}

async function buildCaseCoverV3(item) {
  const frame = { x: 418, y: item.frameHeight ? 106 : 80, w: 752, h: item.frameHeight ?? 470 };
  const background = await sharp(path.join(root, item.background))
    .resize(1200, 628, { fit: "cover", position: "centre", kernel: "lanczos3" })
    .png()
    .toBuffer();

  const label = await typeLayer({
    text: `PRODUCT CASE  ·  ${item.index}  ·  2026`,
    fontfile: mono,
    font: "JetBrains Mono",
    size: 12,
    color: palette.accent,
    width: 330,
    spacing: 520,
  });
  const title = await typeLayer({
    text: item.title,
    fontfile: manrope,
    font: "Manrope",
    size: 42,
    color: palette.ink,
    width: 330,
  });
  const problem = await typeLayer({
    text: item.problem,
    fontfile: manrope,
    font: "Manrope",
    size: 20,
    color: palette.ink,
    width: 330,
  });
  const scope = await typeLayer({
    text: item.scope,
    fontfile: mono,
    font: "JetBrains Mono",
    size: 10,
    color: palette.muted,
    width: 330,
    spacing: 150,
  });
  const evidence = await typeLayer({
    text: item.evidence,
    fontfile: mono,
    font: "JetBrains Mono",
    size: 10,
    color: palette.ink,
    width: 304,
    spacing: 120,
  });

  let source = sharp(path.join(root, item.source));
  if (item.extract) source = source.extract(item.extract);
  const screenshot = await source
    .resize(frame.w, frame.h, {
      fit: "contain",
      position: "centre",
      background: palette.white,
      kernel: "lanczos3",
    })
    .png()
    .toBuffer();
  const mask = Buffer.from(`<svg width="${frame.w}" height="${frame.h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${frame.w}" height="${frame.h}" rx="18" fill="#fff"/>
  </svg>`);
  const border = Buffer.from(`<svg width="${frame.w}" height="${frame.h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="${frame.w - 2}" height="${frame.h - 2}" rx="17" fill="none" stroke="rgba(27,27,24,.22)" stroke-width="2"/>
  </svg>`);
  const plate = await sharp(screenshot)
    .composite([
      { input: mask, blend: "dest-in" },
      { input: border, blend: "over" },
    ])
    .png()
    .toBuffer();

  const chrome = Buffer.from(`<svg width="1200" height="628" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#1B1B18" flood-opacity=".20"/>
    </filter></defs>
    <rect x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" rx="18" fill="#FFFFFF" filter="url(#shadow)"/>
    <rect x="48" y="54" width="34" height="4" rx="2" fill="${palette.accent}"/>
    <circle cx="95" cy="56" r="2" fill="${palette.accent}"/>
    <rect x="48" y="492" width="330" height="48" rx="10" fill="rgba(255,255,255,.58)" stroke="rgba(27,27,24,.14)"/>
    <rect x="48" y="492" width="4" height="48" rx="2" fill="${palette.accent}"/>
  </svg>`);

  await sharp(background)
    .composite([
      { input: chrome, left: 0, top: 0 },
      { input: label, left: 48, top: 77 },
      { input: title, left: 48, top: 120 },
      { input: problem, left: 48, top: 276 },
      { input: scope, left: 48, top: 383 },
      { input: evidence, left: 66, top: 509 },
      { input: plate, left: frame.x, top: frame.y },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(caseDir, `${item.slug}-featured-v3.png`));
}

async function buildCaseContactSheet() {
  const gap = 32;
  const width = 1200 * 2 + gap;
  const height = 628 * 2 + gap;
  const inputs = casesV3.map((item) => path.join(caseDir, `${item.slug}-featured-v3.png`));
  await sharp({ create: { width, height, channels: 4, background: palette.ink } })
    .composite([
      { input: inputs[0], left: 0, top: 0 },
      { input: inputs[1], left: 1200 + gap, top: 0 },
      { input: inputs[2], left: 0, top: 628 + gap },
      { input: inputs[3], left: 1200 + gap, top: 628 + gap },
    ])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(path.join(caseDir, "featured-v3-contact-sheet.png"));
}

await sharp({ create: { width: 1, height: 1, channels: 4, background: "transparent" } }).png().toBuffer();
await import("node:fs/promises").then(({ mkdir }) => mkdir(caseDir, { recursive: true }));
await buildProfileBanner();
for (const item of cases) await buildCaseCover(item);
for (const item of casesV3) await buildCaseCoverV3(item);
await buildCaseContactSheet();

console.log("Built LinkedIn profile banner and two generations of four Featured case covers.");
