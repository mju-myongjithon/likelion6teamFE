import React from "react";
import { Badge, type BadgeTone } from "../display/Badge";
import { Avatar, type AvatarTone } from "../display/Avatar";

export interface MeetupCardProps {
  title: string;
  category?: string;
  categoryTone?: BadgeTone;
  when?: string;
  where?: string;
  host?: string;
  hostTone?: AvatarTone;
  members?: number;
  capacity?: number;
  /** AI match score (0–100). Shows the "✦ N% 일치" flag when set. */
  matchScore?: number | null;
  image?: string | null;
  style?: React.CSSProperties;
}

interface MetaProps {
  glyph: string;
  children?: React.ReactNode;
}

/**
 * MeetupCard — CampusLink's core content unit: a meetup/event listing.
 * White outline card with category tag, title, meta, host, and member count.
 */
export function MeetupCard({
  title,
  category = "모임",
  categoryTone = "neutral",
  when,
  where,
  host,
  hostTone = "violet",
  members,
  capacity,
  matchScore = null,
  image = null,
  style = {},
}: MeetupCardProps): JSX.Element {
  return (
    <div
      style={{
        background: "var(--canvas)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "var(--shadow-soft)",
        ...style,
      }}
    >
      {image && (
        <div style={{ height: 132, background: `var(--surface-card) center/cover no-repeat`, backgroundImage: `url(${image})` }} />
      )}
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge tone={categoryTone}>{category}</Badge>
          {matchScore != null && (
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--brand-accent)" }}>
              ✦ {matchScore}% 일치
            </span>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 17, fontWeight: 600, lineHeight: 1.35, color: "var(--ink)", textWrap: "pretty" }}>
          {title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {when && <Meta glyph="🗓">{when}</Meta>}
          {where && <Meta glyph="📍">{where}</Meta>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto", paddingTop: 4 }}>
          {host && <Avatar name={host} tone={hostTone} size={28} />}
          {host && <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{host}</span>}
          {members != null && (
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>
              {members}{capacity ? ` / ${capacity}` : ""}명
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Meta({ glyph, children }: MetaProps): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--body)" }}>
      <span style={{ fontSize: 13, opacity: 0.7 }}>{glyph}</span>
      {children}
    </div>
  );
}
