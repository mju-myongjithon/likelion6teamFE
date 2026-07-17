import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Button — CampusLink's primary action control.
 * Near-black primary CTA on white canvas; monochrome at the action layer.
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}: ButtonProps): JSX.Element {
  const sizes: Record<ButtonSize, { height: number; padding: string; fontSize: number }> = {
    sm: { height: 32, padding: "0 14px", fontSize: 13 },
    md: { height: 40, padding: "0 20px", fontSize: 14 },
    lg: { height: 48, padding: "0 24px", fontSize: 15 },
  };
  const s = sizes[size] || sizes.md;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
    fontSize: s.fontSize,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color .15s ease, border-color .15s ease, color .15s ease",
    whiteSpace: "nowrap",
    ...style,
  };

  const variants: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      background: disabled ? "var(--primary-disabled)" : "var(--primary)",
      color: disabled ? "var(--muted)" : "var(--on-primary)",
    },
    secondary: {
      background: "var(--canvas)",
      color: "var(--ink)",
      borderColor: "var(--hairline)",
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)",
    },
  };

  return (
    <button type="button" disabled={disabled} style={{ ...base, ...variants[variant] }} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
