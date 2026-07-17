import React from "react";

export interface PlaceVoteOption {
  id: string;
  label: string;
  /** Optional secondary line, e.g. distance or address. */
  sub?: string;
  votes: number;
}

export interface PlaceVoteCardProps {
  title?: string;
  options: PlaceVoteOption[];
  /** Currently selected option id (controlled). */
  selectedId?: string | null;
  /** Total voters for the "N명 참여" summary; defaults to sum of votes. */
  totalVoters?: number | null;
  /** Deadline note, e.g. "오늘 오후 6시 마감". */
  deadline?: string;
  closed?: boolean;
  onVote?: (id: string) => void;
  style?: React.CSSProperties;
}

/**
 * PlaceVoteCard — KakaoTalk-style place-vote card embedded in a chat message.
 * Each option shows a near-black fill bar for its share; tapping selects it.
 * Monochrome — the bar and selected outline carry the state, not color.
 */
export function PlaceVoteCard({
  title = "약속 장소 투표",
  options,
  selectedId = null,
  totalVoters = null,
  deadline,
  closed = false,
  onVote,
  style = {},
}: PlaceVoteCardProps): JSX.Element {
  const total = options.reduce((s, o) => s + o.votes, 0);
  const voters = totalVoters ?? total;
  const leadVotes = Math.max(0, ...options.map((o) => o.votes));
  return (
    <div
      style={{
        width: 320,
        background: "var(--canvas)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-soft)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 16px", borderBottom: "1px solid var(--hairline-soft)" }}>
        <span style={{ fontSize: 15 }}>📍</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{title}</span>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((o) => {
          const pct = total > 0 ? Math.round((o.votes / total) * 100) : 0;
          const selected = o.id === selectedId;
          const lead = o.votes === leadVotes && o.votes > 0;
          return (
            <button
              key={o.id}
              type="button"
              disabled={closed}
              onClick={() => onVote && onVote(o.id)}
              style={{
                position: "relative",
                textAlign: "left",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${selected ? "var(--primary)" : "var(--hairline)"}`,
                background: "var(--canvas)",
                cursor: closed ? "default" : "pointer",
                overflow: "hidden",
              }}
            >
              <span style={{ position: "absolute", inset: 0, width: `${pct}%`, background: lead ? "var(--surface-strong)" : "var(--surface-card)", transition: "width .3s ease" }} />
              <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{o.label}</span>
                  {o.sub && <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{o.sub}</span>}
                </span>
                <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  {selected && <span style={{ fontSize: 13, color: "var(--ink)" }}>✓</span>}
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{o.votes}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", width: 34, textAlign: "right" }}>{pct}%</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderTop: "1px solid var(--hairline-soft)", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>
        <span>{voters}명 참여</span>
        {(deadline || closed) && <span>{closed ? "투표 마감" : deadline}</span>}
      </div>
    </div>
  );
}
