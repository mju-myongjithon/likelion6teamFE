import React from "react";
import { Button } from "../actions/Button";

export interface PricingTierCardProps {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  cta?: string;
  /** Featured tier flips to the dark surface — the only dark card on light pages. */
  featured?: boolean;
  style?: React.CSSProperties;
}

/**
 * PricingTierCard — a pricing plan. Featured tier flips to the dark surface
 * (the only dark card on light pages) — the color IS the featured signal.
 */
export function PricingTierCard({
  name,
  price,
  period = "/월",
  description,
  features = [],
  cta = "시작하기",
  featured = false,
  style = {},
}: PricingTierCardProps): JSX.Element {
  const fg = featured ? "var(--on-dark)" : "var(--ink)";
  const sub = featured ? "var(--on-dark-soft)" : "var(--muted)";
  return (
    <div
      style={{
        background: featured ? "var(--surface-dark)" : "var(--canvas)",
        border: featured ? "1px solid transparent" : "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        padding: 32,
        boxShadow: featured ? "none" : "var(--shadow-soft)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        ...style,
      }}
    >
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px", color: fg }}>{name}</div>
        {description && <div style={{ marginTop: 6, fontFamily: "var(--font-sans)", fontSize: 14, color: sub }}>{description}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, letterSpacing: "-1px", color: fg }}>{price}</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: sub }}>{period}</span>
      </div>
      <Button variant={featured ? "secondary" : "primary"} fullWidth>{cta}</Button>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 15, color: featured ? "var(--on-dark-soft)" : "var(--body)" }}>
            <span style={{ color: featured ? "var(--badge-emerald)" : "var(--success)", flexShrink: 0 }}>✓</span>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}
