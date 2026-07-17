/**
 * MeetupVote — CampusLink 약속 잡기 · 장소 투표. Typed handoff source.
 */
import React from "react";
import { AppShell, getDS } from "../app-home/AppShell";
import type { ChatMessageProps } from "../../components/chat/ChatMessage";
import type { ChatThreadItemProps } from "../../components/chat/ChatThreadItem";
import type { AvatarProps, AvatarTone } from "../../components/display/Avatar";
import type { ButtonProps } from "../../components/actions/Button";
import type { IconButtonProps } from "../../components/actions/IconButton";
import type { InputProps } from "../../components/forms/Input";
import type { BadgeProps } from "../../components/display/Badge";
import type { IconProps } from "../../components/foundations/Icon";
import type { CardProps } from "../../components/cards/Card";
import type { RatingStarsProps } from "../../components/display/RatingStars";

interface VoteDS {
  ChatMessage: React.FC<ChatMessageProps>;
  ChatThreadItem: React.FC<ChatThreadItemProps>;
  Avatar: React.FC<AvatarProps>;
  Button: React.FC<ButtonProps>;
  IconButton: React.FC<IconButtonProps>;
  Input: React.FC<InputProps>;
  Badge: React.FC<BadgeProps>;
  Icon: React.FC<IconProps>;
  Card: React.FC<CardProps>;
  RatingStars: React.FC<RatingStarsProps>;
}

interface ThreadSummary {
  id: string;
  name: string;
  memberCount?: number;
  preview: string;
  time: string;
  unread?: number;
  avatarTone: AvatarTone;
}

const THREADS: ThreadSummary[] = [
  { id: "algo", name: "주말 알고리즘 스터디", memberCount: 8, preview: "민준: 이번 주 장소 투표 올렸어요!", time: "오후 2:14", unread: 3, avatarTone: "violet" },
  { id: "run", name: "러닝 크루 — 한강 5K", memberCount: 45, preview: "일요일 뚝섬 집합입니다 🏃", time: "오전 9:02", avatarTone: "emerald" },
  { id: "ai", name: "AI 논문 리딩 그룹", memberCount: 6, preview: "다음 논문 후보 공유해요", time: "어제", avatarTone: "violet" },
  { id: "seoyeon", name: "이서연", preview: "포폴 리뷰 감사했어요 :)", time: "어제", avatarTone: "pink" },
];

const MEMBERS: { name: string; tone: AvatarTone; role: string }[] = [
  { name: "김민준", tone: "violet", role: "호스트" },
  { name: "이서연", tone: "pink", role: "멤버" },
  { name: "박도윤", tone: "emerald", role: "멤버" },
  { name: "최유진", tone: "orange", role: "멤버" },
  { name: "나", tone: "violet", role: "멤버" },
];

const CAFES: { id: string; letter: string; name: string; sub: string; rating: number }[] = [
  { id: "onda", letter: "A", name: "카페 온다", sub: "강남역 3분 · 콘센트 넉넉", rating: 4.6 },
  { id: "brewlab", letter: "B", name: "브루잉랩 강남점", sub: "강남역 5분 · 회의실 있음", rating: 4.4 },
  { id: "lounge", letter: "C", name: "스터디카페 라운지", sub: "강남역 2분 · 24시간", rating: 4.8 },
];
const PIN_POS: Record<string, { left: string; top: string }> = { A: { left: "22%", top: "34%" }, B: { left: "58%", top: "18%" }, C: { left: "40%", top: "62%" } };

/** 약속 잡기 · 장소 투표 — 채팅 목록·멤버 패널을 유지한 채 카카오톡 스타일 투표 카드로 장소를 확정한다. */
export function MeetupVote(): JSX.Element {
  const { ChatMessage, ChatThreadItem, Avatar, Button, IconButton, Input, Icon, Badge, Card, RatingStars } = getDS<VoteDS>();
  const [activeThread, setActiveThread] = React.useState<string>("algo");
  const [showMembers, setShowMembers] = React.useState<boolean>(true);

  const selectThread = (id: string) => {
    if (id === "algo") { setActiveThread(id); return; }
    window.location.href = "../app-chat/Chat.dc.html";
  };

  return (
    <AppShell active="chat">
      <div style={{ display: "flex", height: "100%", minHeight: 640, overflowX: "auto" }}>
        {/* directory — stays visible when 약속 잡기 is open */}
        <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid var(--hairline)", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
          <div style={{ padding: 16, borderBottom: "1px solid var(--hairline-soft)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>채팅</div>
            <Input placeholder="대화 검색" iconLeft={<Icon name="search" size={16} />} />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
            {THREADS.map((t) => (
              <ChatThreadItem key={t.id} {...t} active={t.id === activeThread} onClick={() => selectThread(t.id)} />
            ))}
          </div>
        </div>

        {/* chat window */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 420, background: "var(--surface-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" }}>
            <Avatar name="주말 알고리즘 스터디" tone="violet" size={36} />
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>주말 알고리즘 스터디</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>멤버 {MEMBERS.length}명 · 약속 잡기 진행 중</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <IconButton aria-label="멤버" onClick={() => setShowMembers((s) => !s)}><Icon name="users" size={18} /></IconButton>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ textAlign: "center" }}><Badge>오늘</Badge></div>
            <ChatMessage sender="김민준" senderTone="violet" time="오후 2:10">이번 주 토요일 스터디 장소 정해요!</ChatMessage>
            <ChatMessage mine time="오후 2:12">투표 만들었어요. 오늘 6시까지 투표해주세요 🙏</ChatMessage>
            <ChatMessage mine time="오후 2:16">✦ 강남역 근처 카페도 추천해드릴게요</ChatMessage>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: 320, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-soft)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderBottom: "1px solid var(--hairline-soft)" }}>
                  <Icon name="map-pin" size={16} color="var(--ink)" />
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>중간 위치</span>
                </div>
                <div style={{ position: "relative" }}>
                  {/* @ts-ignore — image-slot is a runtime-only custom element (see image-slot.js) */}
                  <image-slot id="meetup-vote-map-gangnam" shape="rect" src="uploads/pasted-1784294724814-0.png" placeholder="강남역 주변 지도 이미지를 놓아주세요" style={{ width: "100%", height: 150, display: "block" }}></image-slot>
                  {CAFES.map((c) => (
                    <div key={c.id} style={{ position: "absolute", left: PIN_POS[c.letter].left, top: PIN_POS[c.letter].top, transform: "translate(-50%, -50%)", width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)", color: "var(--on-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, boxShadow: "var(--shadow-raised)" }}>{c.letter}</div>
                  ))}
                </div>
                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {CAFES.map((c) => (
                    <Card key={c.id} surface="card" radius="md" padding="10px 12px" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, color: "var(--on-primary)" }}>{c.letter}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{c.name}</div>
                        <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{c.sub}</div>
                      </div>
                      <RatingStars value={c.rating} size={12} showValue />
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            <ChatMessage sender="이서연" senderTone="pink" time="오후 2:15">강남 좋아요 👍</ChatMessage>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderTop: "1px solid var(--hairline)", background: "var(--canvas)" }}>
            <IconButton aria-label="투표 만들기"><Icon name="bar-chart-2" size={18} /></IconButton>
            <div style={{ flex: 1 }}><Input placeholder="메시지를 입력하세요" /></div>
            <Button variant="primary" iconLeft={<Icon name="send" size={15} color="#fff" />}>전송</Button>
          </div>
        </div>

        {/* member panel — stays visible when 약속 잡기 is open */}
        {showMembers && (
          <div style={{ width: 240, flexShrink: 0, borderLeft: "1px solid var(--hairline)", background: "var(--canvas)", padding: 20, overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 16 }}>멤버 {MEMBERS.length}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {MEMBERS.map((m) => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
