import React from "react";

export type BadgeTone =
  | "neutral"
  | "orange"
  | "pink"
  | "violet"
  | "emerald"
  | "success"
  | "warning"
  | "error";

export interface BadgeProps {
  tone?: BadgeTone;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const PASTELS: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: "var(--surface-card)", fg: "var(--ink)" },
  orange: { bg: "var(--badge-orange)", fg: "#fff" },
  pink: { bg: "var(--badge-pink)", fg: "#fff" },
  violet: { bg: "var(--badge-violet)", fg: "#fff" },
  emerald: { bg: "var(--badge-emerald)", fg: "#0b3b2e" },
  success: { bg: "rgba(16,185,129,.12)", fg: "var(--success)" },
  warning: { bg: "rgba(245,158,11,.14)", fg: "#8a5a00" },
  error: { bg: "rgba(239,68,68,.12)", fg: "var(--error)" },
};

/**
 * Badge — small pill label for category tags and status. Neutral by default;
 * pastel tones reserved for category accents (never on CTAs).
 */
export function Badge({ tone = "neutral", children, style = {} }: BadgeProps): JSX.Element {
  const c = PASTELS[tone] || PASTELS.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        background: c.bg,
        color: c.fg,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 1.4,
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
