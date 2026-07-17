import React from "react";

export type AvatarTone = "neutral" | "orange" | "pink" | "violet" | "emerald";

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  tone?: AvatarTone;
  style?: React.CSSProperties;
}

const FILLS: Record<AvatarTone, string> = {
  neutral: "var(--surface-card)",
  orange: "var(--badge-orange)",
  pink: "var(--badge-pink)",
  violet: "var(--badge-violet)",
  emerald: "var(--badge-emerald)",
};

/**
 * Avatar — perfect circle (default 36px). Photo, or pastel fill with initials.
 */
export function Avatar({ src = null, name = "", size = 36, tone = "neutral", style = {} }: AvatarProps): JSX.Element {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const dark = tone === "neutral";
  return (
    <span
      title={name || undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "var(--radius-full)",
        background: src ? "var(--surface-card)" : FILLS[tone] || FILLS.neutral,
        color: dark ? "var(--ink)" : "#fff",
        fontFamily: "var(--font-sans)",
        fontSize: Math.round(size * 0.36),
        fontWeight: 600,
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "·"
      )}
    </span>
  );
}
