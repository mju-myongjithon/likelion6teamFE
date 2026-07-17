import React from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  options?: Array<string | SelectOption>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Select — native dropdown styled to match Input (40px, hairline, ink text).
 */
export function Select({ options = [], value, onChange, disabled = false, style = {}, ...rest }: SelectProps): JSX.Element {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height: 40,
        width: "100%",
        background: disabled ? "var(--surface-soft)" : "var(--canvas)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-md)",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...rest}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          border: "none",
          outline: "none",
          background: "transparent",
          width: "100%",
          height: "100%",
          padding: "0 36px 0 14px",
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          color: "var(--ink)",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
      <span style={{ position: "absolute", right: 12, pointerEvents: "none", color: "var(--muted)", fontSize: 12 }}>▾</span>
    </div>
  );
}
