import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * Textarea — multi-line text field matching Input (hairline border, ink text).
 */
export function Textarea({ invalid = false, disabled = false, rows = 3, style = {}, ...rest }: TextareaProps): JSX.Element {
  const [focused, setFocused] = React.useState(false);
  const borderColor = invalid ? "var(--error)" : focused ? "var(--ink)" : "var(--hairline)";
  return (
    <textarea
      rows={rows}
      disabled={disabled}
      onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
      onBlur={(e) => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
      {...rest}
      style={{
        width: "100%",
        resize: "vertical",
        padding: "10px 14px",
        background: disabled ? "var(--surface-soft)" : "var(--canvas)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        fontFamily: "var(--font-sans)",
        fontSize: 16,
        lineHeight: 1.5,
        color: "var(--ink)",
        outline: "none",
        transition: "border-color .15s ease",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    />
  );
}
