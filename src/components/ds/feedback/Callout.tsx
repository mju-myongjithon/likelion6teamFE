import React from "react";

export type CalloutTone = "info" | "danger";

export interface CalloutProps {
  /** info = soft-gray brand hint; danger = error-tinted warning. */
  tone?: CalloutTone;
  /** Leading marker glyph. Defaults to the ✦ brand glyph (info) / ! (danger). */
  marker?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Callout — inline info / warning banner. Info uses the soft-gray surface with
 * the ✦ brand glyph; danger uses the semantic error tint. Monochrome at rest.
 */
export function Callout({ tone = "info", marker, children, style = {} }: CalloutProps): JSX.Element {
  const isDanger = tone === "danger";
  const glyph = marker ?? (isDanger ? "!" : "✦");
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        background: isDanger ? "rgba(239,68,68,.08)" : "var(--surface-soft)",
        border: `1px solid ${isDanger ? "var(--error)" : "var(--hairline)"}`,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.5,
        color: isDanger ? "var(--error)" : "var(--body)",
        ...style,
      }}
    >
      <span style={{ flexShrink: 0, fontWeight: 700, color: isDanger ? "var(--error)" : "var(--ink)", lineHeight: 1.5 }}>{glyph}</span>
      <span>{children}</span>
    </div>
  );
}
