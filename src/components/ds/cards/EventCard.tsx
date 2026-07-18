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
  /** Official event poster shown as the card background when available. */
  posterUrl?: string | null;
  onClick?: () => void;
  style?: React.CSSProperties;
}

function getSafePosterUrl(posterUrl: string | null | undefined): string | null {
  if (!posterUrl) return null;
  return /^\/event-posters\/[a-z0-9-]+\.webp$/.test(posterUrl) ? posterUrl : null;
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
  posterUrl = null,
  onClick,
  style = {},
}: EventCardProps): JSX.Element {
  const [failedPosterUrl, setFailedPosterUrl] = React.useState<string | null>(null);
  const safePosterUrl = getSafePosterUrl(posterUrl);
  const hasPoster = safePosterUrl !== null && safePosterUrl !== failedPosterUrl;
  const foregroundColor = hasPoster ? "#fff" : "var(--ink)";
  const metaColor = hasPoster ? "rgba(255, 255, 255, 0.86)" : "var(--muted)";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexWrap: "nowrap",
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
      {hasPoster && (
        <>
          <img
            src={safePosterUrl ?? undefined}
            alt=""
            aria-hidden="true"
            onError={() => setFailedPosterUrl(safePosterUrl)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(12, 15, 24, 0.9) 0%, rgba(12, 15, 24, 0.76) 58%, rgba(12, 15, 24, 0.62) 100%)",
            }}
          />
        </>
      )}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
          width: 60,
          height: 64,
          borderRadius: "var(--radius-md)",
          background: hasPoster ? "rgba(12, 15, 24, 0.72)" : "var(--surface-dark)",
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
      <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <Badge tone={tagTone}>{tag}</Badge>
          {matchScore != null && (
            <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: hasPoster ? "#fff" : "var(--brand-accent)" }}>
              ✦ {matchScore}% 일치
            </span>
          )}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: foregroundColor, textWrap: "pretty" }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, fontFamily: "var(--font-sans)", fontSize: 13, color: metaColor, overflowWrap: "anywhere" }}>
          {time && <span>🕑 {time}</span>}
          {venue && <span>📍 {venue}</span>}
          {attendance && <span style={{ marginLeft: "auto" }}>{attendance}</span>}
        </div>
      </div>
    </div>
  );
}
