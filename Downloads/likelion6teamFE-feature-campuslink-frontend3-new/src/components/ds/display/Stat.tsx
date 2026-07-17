import React from "react";

export interface StatProps {
  /** Large display number/value, e.g. "12" or "94%". */
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Stat — a single activity-statistic tile (참여 모임 수, 매칭 성사 수, …).
 * White outline card; large Geist-display value + muted label. Monochrome.
 */
export function Stat({ value, label, icon = null, style = {} }: StatProps): JSX.Element {
  return (
    <div style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 20, display: "flex", flexDirection: "column", gap: 8, ...style }}>
      {icon && <span style={{ color: "var(--muted)", display: "inline-flex" }}>{icon}</span>}
      <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, letterSpacing: "-1px", color: "var(--ink)", lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{label}</span>
    </div>
  );
}
