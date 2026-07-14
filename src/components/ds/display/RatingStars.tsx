import React from "react";

export interface RatingStarsProps {
  value?: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  style?: React.CSSProperties;
}

/**
 * RatingStars — inline 5-star rating in badge-orange. Read-only display.
 */
export function RatingStars({ value = 5, max = 5, size = 14, showValue = false, style = {} }: RatingStarsProps): JSX.Element {
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < max; i++) {
    const fill = i + 1 <= Math.round(value);
    stars.push(
      <span key={i} style={{ color: fill ? "var(--badge-orange)" : "var(--surface-strong)", fontSize: size, lineHeight: 1 }}>
        ★
      </span>
    );
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2, ...style }}>
      {stars}
      {showValue && (
        <span style={{ marginLeft: 6, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>
          {value.toFixed(1)}
        </span>
      )}
    </span>
  );
}
