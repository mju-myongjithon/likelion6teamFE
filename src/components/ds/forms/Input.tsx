import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  invalid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Input — standard text field. 40px, hairline border, ink text on white.
 */
export function Input({
  iconLeft = null,
  invalid = false,
  disabled = false,
  style = {},
  onFocus,
  onBlur,
  ...rest
}: InputProps): JSX.Element {
  const [focused, setFocused] = React.useState(false);
  const borderColor = invalid
    ? "var(--error)"
    : focused
    ? "var(--ink)"
    : "var(--hairline)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        height: 40,
        padding: "0 14px",
        background: disabled ? "var(--surface-soft)" : "var(--canvas)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        transition: "border-color .15s ease",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {iconLeft && <span style={{ display: "inline-flex", color: "var(--muted)" }}>{iconLeft}</span>}
      <input
        disabled={disabled}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          color: "var(--ink)",
          minWidth: 0,
        }}
      />
    </div>
  );
}
