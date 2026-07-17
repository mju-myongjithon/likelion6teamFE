import React from "react";

export interface TopNavProps {
  brand?: string;
  links?: string[];
  activeLink?: string | null;
  /** Called when a nav link is clicked, with the link label. Use to scroll to a section. */
  onLinkClick?: (link: string) => void;
  /** Right-side action cluster (e.g. Sign in link + primary Button). */
  right?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * TopNav — white 64px nav bar pinned to the top. Wordmark left, menu center,
 * action cluster right. Composes the brand wordmark in plain type (no logo mark).
 */
export function TopNav({
  brand = "CampusLink",
  links = ["둘러보기", "모임", "요금제"],
  activeLink = null,
  onLinkClick,
  right = null,
  style = {},
}: TopNavProps): JSX.Element {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 24px",
        background: "var(--canvas)",
        borderBottom: "1px solid var(--hairline-soft)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>{brand}</span>
        </span>
        <nav style={{ display: "flex", gap: 4 }}>
          {links.map((l) => (
            <a
              key={l}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onLinkClick?.(l);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                cursor: "pointer",
                color: l === activeLink ? "var(--ink)" : "var(--muted)",
              }}
            >
              {l}
            </a>
          ))}
        </nav>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{right}</div>
    </header>
  );
}
