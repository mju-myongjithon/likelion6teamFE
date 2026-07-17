import React from "react";
import { Avatar, type AvatarProps } from "./Avatar";

export interface ProfilePopoverEvent {
  title: string;
  when: string;
  tone?: AvatarProps["tone"];
}

export interface ProfilePopoverProps {
  name: string;
  meta?: string;
  avatarSrc?: string | null;
  avatarTone?: AvatarProps["tone"];
  events?: ProfilePopoverEvent[];
  onViewProfile?: () => void;
  onLogout?: () => void;
  style?: React.CSSProperties;
}

/**
 * ProfilePopover — header avatar dropdown showing profile summary + upcoming
 * schedule. White card, hairline border, soft shadow. Monochrome.
 */
export function ProfilePopover({
  name,
  meta,
  avatarSrc = null,
  avatarTone = "violet",
  events = [],
  onViewProfile,
  onLogout,
  style = {},
}: ProfilePopoverProps): JSX.Element {
  return (
    <div
      style={{
        width: 280,
        background: "var(--canvas)",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-raised)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderBottom: "1px solid var(--hairline-soft)" }}>
        <Avatar src={avatarSrc} name={name} tone={avatarTone} size={44} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{name}</div>
          {meta && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{meta}</div>}
        </div>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 10 }}>다가오는 일정</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {events.length === 0 && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted-soft)" }}>예정된 일정이 없어요.</div>}
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "var(--radius-full)", background: "var(--ink)", flexShrink: 0 }} />
              <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</span>
              <span style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{e.when}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--hairline-soft)", padding: 8, display: "flex", flexDirection: "column" }}>
        <button type="button" onClick={onViewProfile} style={{ textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "8px 8px", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>마이페이지</button>
        <button type="button" onClick={onLogout} style={{ textAlign: "left", border: "none", background: "transparent", cursor: "pointer", padding: "8px 8px", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>로그아웃</button>
      </div>
    </div>
  );
}
