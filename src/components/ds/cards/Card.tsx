import React from "react";

export type CardSurface = "card" | "outline" | "soft" | "dark";
export type CardRadius = "md" | "lg" | "xl";

export interface CardProps {
  /** Surface mode. card=light gray; outline=white+hairline; soft=very-soft; dark=scarce featured. */
  surface?: CardSurface;
  padding?: number | string;
  radius?: CardRadius;
  shadow?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Card — base content container. Two surface modes:
 *  - "card" (light gray, no border): abstract feature claims
 *  - "outline" (white + hairline): product / real-content cards
 *  - "dark" (near-black): scarce featured signal (footer / featured tier only)
 */
export function Card({
  surface = "outline",
  padding = 24,
  radius = "lg",
  shadow = false,
  children,
  style = {},
}: CardProps): JSX.Element {
  const surfaces: Record<CardSurface, React.CSSProperties> = {
    card: { background: "var(--surface-card)", border: "1px solid transparent", color: "var(--ink)" },
    outline: { background: "var(--canvas)", border: "1px solid var(--hairline)", color: "var(--ink)" },
    soft: { background: "var(--surface-soft)", border: "1px solid transparent", color: "var(--ink)" },
    dark: { background: "var(--surface-dark)", border: "1px solid transparent", color: "var(--on-dark)" },
  };
  const radii: Record<CardRadius, string> = {
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  };
  return (
    <div
      style={{
        borderRadius: radii[radius] || radii.lg,
        padding,
        boxShadow: shadow ? "var(--shadow-raised)" : "none",
        ...surfaces[surface],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
