import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Badge } from "../components/ds/display/Badge";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Icon } from "../components/ds/foundations/Icon";

interface Member { name: string; tone: AvatarTone; role: string; }
const MEMBERS: Member[] = [
  { name: "김민준", tone: "violet", role: "호스트" },
  { name: "이서연", tone: "pink", role: "멤버" },
  { name: "박도윤", tone: "emerald", role: "멤버" },
  { name: "최유진", tone: "orange", role: "멤버" },
  { name: "강민서", tone: "violet", role: "멤버" },
];

interface Slot { date: string; title: string; place: string; soon?: boolean; }
const SCHEDULE: Slot[] = [
  { date: "2/1 토", title: "8주차 — DP 문제 풀이", place: "강남 스터디카페", soon: true },
  { date: "2/8 토", title: "9주차 — 그래프 탐색", place: "강남 스터디카페" },
  { date: "2/15 토", title: "10주차 — 모의 코딩테스트", place: "온라인" },
];

function LeaveModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }): JSX.Element {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
      <div style={{ background: "var(--canvas)", borderRadius: "var(--radius-xl)", padding: 28, width: "100%", maxWidth: 380, boxShadow: "var(--shadow-raised)" }}>
        <div style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "rgba(239,68,68,.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Icon name="log-out" size={22} color="var(--error)" />
        </div>
        <h2 style={{ margin: "0 0 var(--space-xs)", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>모임에서 탈퇴할까요?</h2>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "var(--body)" }}>
          탈퇴하면 채팅방에서 나가고 다가오는 일정이 캘린더에서 제거돼요. 다시 참여하려면 새로 신청해야 합니다.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>취소</Button>
          <Button variant="primary" size="lg" fullWidth onClick={onConfirm} style={{ background: "var(--error)" }}>탈퇴하기</Button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: string; children?: React.ReactNode }): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon name={icon} size={18} color="var(--ink)" />
      <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{children}</h2>
    </div>
  );
}

/** 내 모임 상세 — 일정/멤버/채팅 + 탈퇴 기능. */
export function MyGroupDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const [leaving, setLeaving] = React.useState<boolean>(false);
  return (
    <AppShell>
      <div style={{ padding: 28, maxWidth: 780 }}>
        <a onClick={(e) => { e.preventDefault(); navigate("/my-groups"); }} href="/my-groups" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 20 }}>
          <Icon name="arrow-left" size={16} color="var(--muted)" /> 내 모임으로
        </a>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div>
            <Badge tone="violet" style={{ marginBottom: 10 }}>스터디</Badge>
            <h1 className="cl-display-sm" style={{ margin: 0 }}>주말 알고리즘 스터디</h1>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)", marginTop: 6 }}>참여 8주차 · 다음 일정 이번 주 토요일</div>
          </div>
          <Button variant="primary" iconLeft={<Icon name="message-circle" size={16} color="var(--on-primary)" />} onClick={() => navigate("/chat")}>채팅방</Button>
        </div>

        <SectionTitle icon="calendar">다가오는 일정</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {SCHEDULE.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: s.soon ? "var(--surface-soft)" : "var(--canvas)" }}>
              <div style={{ flexShrink: 0, width: 56, textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{s.date}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{s.title}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>📍 {s.place}</div>
              </div>
              {s.soon && <Badge tone="success">곧 시작</Badge>}
            </div>
          ))}
        </div>

        <SectionTitle icon="users">멤버 {MEMBERS.length}명</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
          {MEMBERS.map((m) => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar name={m.name} tone={m.tone} size={40} />
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>모임 탈퇴</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", marginTop: 2 }}>탈퇴하면 채팅방과 일정에서 제거돼요.</div>
          </div>
          <Button variant="secondary" iconLeft={<Icon name="log-out" size={16} color="var(--error)" />} onClick={() => setLeaving(true)} style={{ color: "var(--error)", borderColor: "var(--error)" }}>탈퇴하기</Button>
        </div>
      </div>
      {leaving && <LeaveModal onClose={() => setLeaving(false)} onConfirm={() => navigate("/my-groups")} />}
    </AppShell>
  );
}
