import React from "react";
import { Avatar, type AvatarTone } from "../display/Avatar";

export interface ChatThreadItemProps {
  name: string;
  /** Last message preview (single line, truncated). */
  preview?: string;
  time?: string;
  /** Unread message count; shows a near-black count bubble when > 0. */
  unread?: number;
  avatarTone?: AvatarTone;
  /** Group thread — shows a member count instead of presence dot. */
  memberCount?: number | null;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * ChatThreadItem — one row in the chat directory (left rail). Avatar + name +
 * last-message preview + time + unread count. Monochrome; active row fills soft.
 */
export function ChatThreadItem({
  name,
  preview = "",
  time = "",
  unread = 0,
  avatarTone = "neutral",
  memberCount = null,
  active = false,
  onClick,
  style = {},
}: ChatThreadItemProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        background: active ? "var(--surface-card)" : "transparent",
        cursor: "pointer",
        ...style,
      }}
    >
      <Avatar name={name} tone={avatarTone} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
          {memberCount != null && <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted-soft)" }}>{memberCount}</span>}
          <span style={{ marginLeft: "auto", flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted-soft)" }}>{time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{preview}</span>
          {unread > 0 && (
            <span style={{ flexShrink: 0, minWidth: 18, height: 18, padding: "0 5px", borderRadius: "var(--radius-pill)", background: "var(--primary)", color: "var(--on-primary)", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}
