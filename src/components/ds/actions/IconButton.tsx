import React from "react";

export type IconButtonVariant = "outline" | "ghost" | "solid";

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children?: React.ReactNode;
  size?: number;
  variant?: IconButtonVariant;
  disabled?: boolean;
  style?: React.CSSProperties;
}

/**
 * IconButton — circular icon-only control (36px). Share, more, carousel arrows.
 */
export function IconButton({
  children,
  size = 36,
  variant = "outline",
  disabled = false,
  style = {},
  ...rest
}: IconButtonProps): JSX.Element {
  const variants: Record<IconButtonVariant, React.CSSProperties> = {
    outline: { background: "var(--canvas)", border: "1px solid var(--hairline)", color: "var(--ink)" },
    ghost: { background: "transparent", border: "1px solid transparent", color: "var(--ink)" },
    solid: { background: "var(--primary)", border: "1px solid var(--primary)", color: "var(--on-primary)" },
  };
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color .15s ease, border-color .15s ease",
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
