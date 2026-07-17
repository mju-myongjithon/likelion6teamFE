import React from "react";

export interface FieldProps {
  /** Bold field label shown above the control. */
  label?: string;
  /** Optional helper text shown below the control. */
  hint?: string;
  /** Right-aligned secondary text on the label row (e.g. "3개까지"). */
  labelAside?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Field — label + control wrapper for forms. Consistent label type + spacing.
 */
export function Field({ label, hint, labelAside, children, style = {} }: FieldProps): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {(label || labelAside) && (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          {label && <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{label}</span>}
          {labelAside && <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{labelAside}</span>}
        </div>
      )}
      {children}
      {hint && <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{hint}</span>}
    </div>
  );
}
