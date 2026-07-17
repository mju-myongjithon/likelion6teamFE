import React from "react";
import { Avatar, type AvatarTone } from "../display/Avatar";

export interface ChatMessageProps {
  /** true = current user's message (right-aligned near-black bubble). */
  mine?: boolean;
  /** Sender name — shown above other people's bubbles in group chats. */
  sender?: string;
  senderTone?: AvatarTone;
  time?: string;
  /** Hide the avatar (for consecutive messages from the same sender). */
  hideAvatar?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * ChatMessage — a single chat bubble. Mine = right-aligned near-black on white;
 * theirs = left-aligned soft-gray with avatar + name. Monochrome.
 */
export function ChatMessage({
  mine = false,
  sender,
  senderTone = "neutral",
  time,
  hideAvatar = false,
  children,
  style = {},
}: ChatMessageProps): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: mine ? "row-reverse" : "row", alignItems: "flex-end", gap: 8, ...style }}>
      {!mine && (
        <div style={{ width: 32, flexShrink: 0 }}>
          {!hideAvatar && <Avatar name={sender || ""} tone={senderTone} size={32} />}
        </div>
      )}
      <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start" }}>
        {!mine && !hideAvatar && sender && (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", margin: "0 4px 4px" }}>{sender}</span>
        )}
        <div style={{ display: "flex", flexDirection: mine ? "row-reverse" : "row", alignItems: "flex-end", gap: 6 }}>
          <div
            style={{
              padding: "9px 13px",
              borderRadius: 14,
              background: mine ? "var(--primary)" : "var(--surface-card)",
              color: mine ? "var(--on-primary)" : "var(--ink)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: "break-word",
              borderBottomRightRadius: mine ? 4 : 14,
              borderBottomLeftRadius: mine ? 14 : 4,
            }}
          >
            {children}
          </div>
          {time && <span style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted-soft)" }}>{time}</span>}
        </div>
      </div>
    </div>
  );
}
