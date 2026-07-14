import React from "react";

export type ChipVariant = "default" | "add";

export interface ChipProps {
  /** Selected state — fills with near-black primary. */
  active?: boolean;
  /** "add" renders a dashed outline for "+ 직접입력" style affordances. */
  variant?: ChipVariant;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Chip — selectable tag for interests / purpose / role pickers. Monochrome:
 * inactive = hairline outline, active = near-black fill. (Distinct from Badge,
 * which is a read-only label.)
 */
export function Chip({ active = false, variant = "default", onClick, children, style = {} }: ChipProps): JSX.Element {
  const dashed = variant === "add";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: "var(--radius-pill)",
        border: `1px ${dashed ? "dashed" : "solid"} ${active ? "var(--primary)" : "var(--hairline)"}`,
        background: active ? "var(--primary)" : "var(--canvas)",
        color: active ? "var(--on-primary)" : dashed ? "var(--muted)" : "var(--body)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 500,
        lineHeight: 1,
        cursor: "pointer",
        transition: "background-color .15s ease, border-color .15s ease, color .15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
