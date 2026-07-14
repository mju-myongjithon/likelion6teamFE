import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { ChatThreadItem } from "../components/ds/chat/ChatThreadItem";
import { ChatMessage } from "../components/ds/chat/ChatMessage";
import { Input } from "../components/ds/forms/Input";
import { IconButton } from "../components/ds/actions/IconButton";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Button } from "../components/ds/actions/Button";
import { Badge } from "../components/ds/display/Badge";
import { Icon } from "../components/ds/foundations/Icon";

interface Thread { id: string; name: string; memberCount?: number; preview: string; time: string; unread?: number; avatarTone: AvatarTone; }
interface Msg { sender?: string; tone?: AvatarTone; text: string; time: string; mine?: boolean; }
interface Member { name: string; tone: AvatarTone; role: string; }

const THREADS: Thread[] = [
  { id: "algo", name: "주말 알고리즘 스터디", memberCount: 8, preview: "민준: 이번 주 장소 투표 올렸어요!", time: "오후 2:14", unread: 3, avatarTone: "violet" },
  { id: "run", name: "러닝 크루 — 한강 5K", memberCount: 45, preview: "일요일 뚝섬 집합입니다 🏃", time: "오전 9:02", avatarTone: "emerald" },
  { id: "ai", name: "AI 논문 리딩 그룹", memberCount: 6, preview: "다음 논문 후보 공유해요", time: "어제", avatarTone: "violet" },
  { id: "seoyeon", name: "이서연", preview: "포폴 리뷰 감사했어요 :)", time: "어제", avatarTone: "pink" },
];

const MESSAGES: Msg[] = [
  { sender: "김민준", tone: "violet", text: "다들 이번 주 토요일 스터디 어디서 할까요?", time: "오후 2:05" },
  { sender: "이서연", tone: "pink", text: "저는 강남이 접근성 좋아요!", time: "오후 2:07" },
  { mine: true, text: "좋아요. 후보 몇 개로 투표 만들게요 👇", time: "오후 2:10" },
  { sender: "박도윤", tone: "emerald", text: "온라인도 열어주시면 감사할 것 같아요", time: "오후 2:12" },
];

const MEMBERS: Member[] = [
  { name: "김민준", tone: "violet", role: "호스트" },
  { name: "이서연", tone: "pink", role: "멤버" },
  { name: "박도윤", tone: "emerald", role: "멤버" },
  { name: "최유진", tone: "orange", role: "멤버" },
  { name: "나", tone: "violet", role: "멤버" },
];

/** 채팅 — 대화 목록 + 채팅창 + 멤버 패널. */
export function ChatPage(): JSX.Element {
  const navigate = useNavigate();
  const [active, setActive] = React.useState<string>("algo");
  const [showMembers, setShowMembers] = React.useState<boolean>(true);
  const thread = THREADS.find((t) => t.id === active) as Thread;

  return (
    <AppShell>
      <div style={{ display: "flex", height: "100%", minHeight: 640 }}>
        <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid var(--hairline)", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--hairline-soft)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-sm)" }}>채팅</div>
            <Input placeholder="대화 검색" iconLeft={<Icon name="search" size={16} />} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-xs)" }}>
            {THREADS.map((t) => <ChatThreadItem key={t.id} {...t} active={t.id === active} onClick={() => setActive(t.id)} />)}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--surface-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" }}>
            <Avatar name={thread.name} tone={thread.avatarTone} size={36} />
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{thread.name}</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>멤버 {thread.memberCount || 2}명</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-xs)" }}>
              <Button variant="secondary" size="sm" iconLeft={<Icon name="map-pin" size={15} />} onClick={() => navigate("/chat/vote")}>약속 잡기</Button>
              <IconButton aria-label="멤버" onClick={() => setShowMembers((s) => !s)}><Icon name="users" size={18} /></IconButton>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <div style={{ textAlign: "center" }}><Badge>2월 1일 토요일</Badge></div>
            {MESSAGES.map((m, i) => <ChatMessage key={i} mine={m.mine} sender={m.sender} senderTone={m.tone} time={m.time}>{m.text}</ChatMessage>)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-md) var(--space-lg)", borderTop: "1px solid var(--hairline)", background: "var(--canvas)" }}>
            <IconButton aria-label="첨부"><Icon name="plus" size={18} /></IconButton>
            <div style={{ flex: 1 }}><Input placeholder="메시지를 입력하세요" /></div>
            <Button variant="primary" iconLeft={<Icon name="send" size={15} color="var(--on-primary)" />}>전송</Button>
          </div>
        </div>

        {showMembers && (
          <div style={{ width: 240, flexShrink: 0, borderLeft: "1px solid var(--hairline)", background: "var(--canvas)", padding: "var(--space-lg)", overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-md)" }}>멤버 {MEMBERS.length}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {MEMBERS.map((m) => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                  <Avatar name={m.name} tone={m.tone} size={36} />
                  <div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
