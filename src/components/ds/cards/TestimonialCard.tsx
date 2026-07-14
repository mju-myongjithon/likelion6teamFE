import React from "react";
import { Avatar, type AvatarTone } from "../display/Avatar";
import { RatingStars } from "../display/RatingStars";

export interface TestimonialCardProps {
  name: string;
  role?: string;
  avatarSrc?: string | null;
  avatarTone?: AvatarTone;
  rating?: number | null;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * TestimonialCard — light-gray quote card. Avatar row + quote.
 */
export function TestimonialCard({
  name,
  role,
  avatarSrc = null,
  avatarTone = "neutral",
  rating = null,
  children,
  style = {},
}: TestimonialCardProps): JSX.Element {
  return (
    <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 24, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Avatar src={avatarSrc} name={name} tone={avatarTone} />
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{name}</div>
          {role && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{role}</div>}
        </div>
        {rating != null && <div style={{ marginLeft: "auto" }}><RatingStars value={rating} /></div>}
      </div>
      <p style={{ margin: "16px 0 0", fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.5, color: "var(--body)" }}>
        {children}
      </p>
    </div>
  );
}
