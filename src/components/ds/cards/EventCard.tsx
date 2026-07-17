import React from "react";
import { Badge, type BadgeTone } from "../display/Badge";

export interface EventCardProps {
  title: string;
  /** Month label for the date block, e.g. "2월". */
  month?: string;
  /** Day number for the date block, e.g. "14". */
  day?: string;
  time?: string;
  venue?: string;
  tag?: string;
  tagTone?: BadgeTone;
  /** AI match score (0–100). Shows the "✦ N% 일치" flag when set. */
  matchScore?: number | null;
  /** Right-aligned attendance summary, e.g. "128명 참석". */
  attendance?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * EventCard — a one-off event listing (distinct from MeetupCard's recurring
 * meetup). Left date block + title + venue row. White outline, monochrome.
 */
export function EventCard({
  title,
  month = "",
  day = "",
  time,
  venue,
  tag = "행사",
  tagTone = "neutral",
  matchScore = null,
  attendance,
  onClick,
  style = {},
}: EventCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        gap: 16,
        background: "var(--canvas)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        padding: 16,
        boxShadow: "var(--shadow-soft)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 60,
          height: 64,
          borderRadius: "var(--radius-md)",
          background: "var(--surface-dark)",
          color: "var(--on-dark)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, opacity: 0.75 }}>{month}</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, letterSpacing: "-0.5px", lineHeight: 1 }}>{day}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge tone={tagTone}>{tag}</Badge>
          {matchScore != null && (
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--brand-accent)" }}>
              ✦ {matchScore}% 일치
            </span>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: "var(--ink)", textWrap: "pretty" }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>
          {time && <span>🕑 {time}</span>}
          {venue && <span>📍 {venue}</span>}
          {attendance && <span style={{ marginLeft: "auto" }}>{attendance}</span>}
        </div>
      </div>
    </div>
  );
}
