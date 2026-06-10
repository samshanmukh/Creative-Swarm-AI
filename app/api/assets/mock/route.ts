import { NextRequest, NextResponse } from "next/server";

const themes = [
  {
    primary: "#c7ff47",
    secondary: "#8b5cf6",
    glow: "#c7ff47",
    shape: "workflow",
  },
  {
    primary: "#8b5cf6",
    secondary: "#38bdf8",
    glow: "#8b5cf6",
    shape: "portal",
  },
  {
    primary: "#38bdf8",
    secondary: "#c7ff47",
    glow: "#38bdf8",
    shape: "globe",
  },
] as const;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function artwork(shape: (typeof themes)[number]["shape"], primary: string) {
  if (shape === "portal") {
    return `
      <ellipse cx="600" cy="400" rx="260" ry="260" fill="none" stroke="${primary}" stroke-width="2" opacity=".35"/>
      <ellipse cx="600" cy="400" rx="190" ry="190" fill="none" stroke="url(#accent)" stroke-width="16" opacity=".65" filter="url(#blur)"/>
      <ellipse cx="600" cy="400" rx="155" ry="155" fill="url(#core)" opacity=".7"/>
      <path d="M160 640 C360 470 430 690 600 500 C780 300 850 570 1040 250" fill="none" stroke="url(#accent)" stroke-width="3" opacity=".6"/>
    `;
  }
  if (shape === "globe") {
    return `
      <circle cx="600" cy="400" r="250" fill="url(#core)" opacity=".55"/>
      <circle cx="600" cy="400" r="250" fill="none" stroke="${primary}" stroke-width="2" opacity=".4"/>
      <ellipse cx="600" cy="400" rx="250" ry="85" fill="none" stroke="url(#accent)" stroke-width="2" opacity=".5"/>
      <ellipse cx="600" cy="400" rx="95" ry="250" fill="none" stroke="url(#accent)" stroke-width="2" opacity=".5"/>
      <path d="M350 400 H850 M395 270 Q600 410 805 270 M395 530 Q600 390 805 530" fill="none" stroke="${primary}" stroke-width="2" opacity=".35"/>
      <circle cx="430" cy="310" r="10" fill="${primary}" filter="url(#glow)"/>
      <circle cx="735" cy="455" r="10" fill="${primary}" filter="url(#glow)"/>
      <circle cx="570" cy="590" r="10" fill="${primary}" filter="url(#glow)"/>
    `;
  }
  return `
    <path d="M170 520 C310 300 410 610 555 375 C690 155 790 480 1030 230" fill="none" stroke="url(#accent)" stroke-width="4" opacity=".7"/>
    <path d="M170 590 C340 420 450 650 610 480 C760 320 860 560 1030 390" fill="none" stroke="${primary}" stroke-width="2" opacity=".3"/>
    <g fill="#111421" stroke="${primary}" stroke-width="2">
      <rect x="135" y="475" width="110" height="80" rx="18"/>
      <rect x="505" y="330" width="110" height="80" rx="18"/>
      <rect x="975" y="185" width="110" height="80" rx="18"/>
    </g>
    <g fill="${primary}" filter="url(#glow)">
      <circle cx="190" cy="515" r="8"/><circle cx="560" cy="370" r="8"/><circle cx="1030" cy="225" r="8"/>
    </g>
  `;
}

export async function GET(request: NextRequest) {
  const index = Number(request.nextUrl.searchParams.get("index") || 0);
  const prompt = escapeXml(
    request.nextUrl.searchParams.get("prompt") || "Campaign visual concept",
  );
  const theme = themes[Math.abs(index) % themes.length];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#111421"/>
          <stop offset=".55" stop-color="#090b13"/>
          <stop offset="1" stop-color="${theme.secondary}" stop-opacity=".22"/>
        </linearGradient>
        <radialGradient id="core">
          <stop offset="0" stop-color="${theme.primary}" stop-opacity=".55"/>
          <stop offset=".55" stop-color="${theme.secondary}" stop-opacity=".18"/>
          <stop offset="1" stop-color="#090b13" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="accent" x1="0" y1="1" x2="1" y2="0">
          <stop stop-color="${theme.primary}"/>
          <stop offset="1" stop-color="${theme.secondary}"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="blur"><feGaussianBlur stdDeviation="14"/></filter>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="#ffffff" stroke-opacity=".035"/>
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <rect width="1200" height="800" fill="url(#grid)"/>
      <circle cx="600" cy="400" r="330" fill="url(#core)" opacity=".5"/>
      ${artwork(theme.shape, theme.primary)}
      <rect x="54" y="54" width="142" height="34" rx="17" fill="#090b13" stroke="#ffffff" stroke-opacity=".12"/>
      <text x="125" y="76" text-anchor="middle" fill="${theme.primary}" font-family="monospace" font-size="11" letter-spacing="2">CONCEPT 0${(index % 3) + 1}</text>
      <text x="54" y="710" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="600">Creative Swarm Visual Direction</text>
      <text x="54" y="744" fill="#98a0b3" font-family="Arial, sans-serif" font-size="13">${prompt.slice(0, 110)}</text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
