import React from "react";

export interface NavPillItem {
  value: string;
  label: string;
}

export interface NavPillGroupProps {
  items?: Array<string | NavPillItem>;
  value?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/**
 * NavPillGroup — signature pill-in-pill segmented control. A soft-surface
 * wrapper; the active segment renders as a white pill with a soft shadow.
 */
export function NavPillGroup({ items = [], value, onChange, style = {} }: NavPillGroupProps): JSX.Element {
  const first = items[0];
  const active = value ?? (first ? (typeof first === "string" ? first : first.value) : undefined);
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 2,
        padding: 6,
        background: "var(--surface-soft)",
        borderRadius: "var(--radius-pill)",
        ...style,
      }}
    >
      {items.map((it) => {
        const val = typeof it === "string" ? it : it.value;
        const label = typeof it === "string" ? it : it.label;
        const isActive = val === active;
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange && onChange(val)}
            style={{
              border: "none",
              cursor: "pointer",
              padding: "8px 14px",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.4,
              background: isActive ? "var(--canvas)" : "transparent",
              color: isActive ? "var(--ink)" : "var(--muted)",
              boxShadow: isActive ? "var(--shadow-soft)" : "none",
              transition: "background-color .15s ease, color .15s ease",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
