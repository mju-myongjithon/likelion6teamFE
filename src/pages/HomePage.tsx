import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { NavPillGroup } from "../components/ds/navigation/NavPillGroup";
import { MeetupCard, type MeetupCardProps } from "../components/ds/cards/MeetupCard";
import { EventCard, type EventCardProps } from "../components/ds/cards/EventCard";
import { Callout } from "../components/ds/feedback/Callout";
import { Badge } from "../components/ds/display/Badge";

const CATEGORIES = ["전체", "스터디", "해커톤(대회)"];

export type MeetupData = Omit<MeetupCardProps, "style"> & {
  id: string;
  description: string;
  matchReason: string;
};

export const MEETUPS: MeetupData[] = [
  {
    id: "m1",
    title: "주말 알고리즘 스터디 — 코딩테스트 대비",
    category: "스터디",
    categoryTone: "violet",
    when: "매주 토 · 오후 2시",
    where: "강남",
    host: "김민준",
    members: 8,
    capacity: 12,
    matchScore: 94,
    description: "코딩테스트를 함께 준비하는 소규모 스터디입니다. 매주 문제를 정하고 풀이를 공유해요. 초급~중급 환영합니다.",
    matchReason: "프론트엔드 · React | 지훈님의 역할과 일치해요",
  },
  {
    id: "m2",
    title: "교외 해커톤 팀원 모집 — 백엔드 파트",
    category: "해커톤(대회)",
    categoryTone: "pink",
    when: "1/28 화 · 저녁 8시",
    where: "온라인",
    host: "박도윤",
    members: 14,
    capacity: 20,
    matchScore: 90,
    description: "교외에서 열리는 해커톤에 함께 나갈 백엔드 팀원을 찾고 있어요. 3인 1팀으로 24시간 동안 진행됩니다.",
    matchReason: "개발 · 해커톤(대회) | 지훈님의 관심사와 일치해요",
  },
  {
    id: "m3",
    title: "교내 해커톤 팀원 모집 — 프론트엔드 파트",
    category: "해커톤(대회)",
    categoryTone: "pink",
    when: "2/1 토 · 오후 3시",
    where: "홍대",
    host: "최유진",
    members: 6,
    capacity: 10,
    matchScore: 87,
    description: "교내 해커톤에 함께 나갈 프론트엔드 팀원을 찾고 있어요. React 경험자를 우대하며, 2주간 짧고 굵게 진행돼요.",
    matchReason: "프론트엔드 · React | 지훈님의 역할과 일치해요",
  },
];

export type EventData = Omit<EventCardProps, "style" | "onClick"> & {
  id: string;
  description: string;
  matchReason: string;
  features: string[];
  schedule: Array<{ date: string; title: string; time?: string }>;
};

export const EVENTS: EventData[] = [
  {
    id: "e1",
    month: "2월",
    day: "14",
    title: "AI 해커톤 2026 — 48시간 무박",
    time: "오전 10시",
    venue: "코엑스 D홀",
    tag: "해커톤",
    tagTone: "orange",
    matchScore: 92,
    attendance: "128명 참석",
    description: "48시간 동안 팀을 이뤄 AI 서비스를 만드는 해커톤입니다. 개인 참가 시 관심사 기반으로 팀을 매칭해 드려요. 멘토링과 상금이 제공됩니다.",
    matchReason: "관심사(AI·개발)와 프로젝트 목적에 잘 맞아 추천했어요. 팀 매칭도 지원됩니다.",
    features: ["팀 매칭 지원", "멘토링", "상금 500만원", "식사 제공"],
    schedule: [
      { date: "2/10까지", title: "참가 신청 마감" },
      { date: "2/14 토", title: "오리엔테이션 · 해커톤 시작", time: "오전 10시" },
      { date: "2/16 월", title: "결과 발표 및 시상", time: "오후 5시" },
    ],
  },
  {
    id: "e2",
    month: "2월",
    day: "20",
    title: "스타트업 채용 박람회",
    time: "오후 1시",
    venue: "성수 S팩토리",
    tag: "행사",
    tagTone: "violet",
    matchScore: 78,
    attendance: "340명 참석",
    description: "다양한 스타트업이 참여하는 채용 박람회입니다. 현장에서 실무진과 1:1 면담을 진행하고, 부스별 기업 설명회도 들을 수 있어요.",
    matchReason: "관심사(창업)와 취업 준비 목적에 잘 맞아 추천했어요.",
    features: ["현장 면접", "기업 부스 30개+", "이력서 첨삭 부스", "네트워킹 라운지"],
    schedule: [
      { date: "2/20 금", title: "박람회 시작", time: "오후 1시" },
      { date: "2/20 금", title: "기업 설명회 세션", time: "오후 3시" },
      { date: "2/20 금", title: "박람회 종료", time: "오후 7시" },
    ],
  },
];

function SectionTitle({ children }: { children?: React.ReactNode }): JSX.Element {
  return <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{children}</h2>;
}

/** CampusLink 홈 — 성향·목적 기반 추천 피드 + 카테고리 필터. */
export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const [cat, setCat] = React.useState<string>("전체");
  const [q, setQ] = React.useState<string>("");
  let meetups = MEETUPS;
  if (cat !== "전체") meetups = meetups.filter((m) => m.category === cat);
  if (q) meetups = meetups.filter((m) => (m.title ?? "").includes(q));

  return (
    <AppShell q={q} setQ={setQ}>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 8 }}><Badge tone="violet">✦ 오늘의 AI 추천</Badge></div>
        <h1 className="cl-display-md" style={{ margin: "0 0 var(--space-xs)" }}>안녕하세요, 지훈님</h1>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>성향과 목적을 분석해 딱 맞는 모임과 행사를 골랐어요.</p>
        <Callout style={{ marginBottom: 24 }}>관심사(AI·개발·창업)와 주말 오후 시간대가 잘 맞는 항목을 우선 배치했어요.</Callout>

        <div style={{ marginBottom: 20 }}>
          <NavPillGroup items={CATEGORIES} value={cat} onChange={setCat} />
        </div>

        <SectionTitle>추천 모임</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(var(--space-section) * 3 - var(--space-xs)), 1fr))", gap: 20, marginBottom: 36, alignItems: "stretch" }}>
          {meetups.map(({ id, description, matchReason, ...m }) => (
            <div key={id} onClick={() => navigate(`/groups/${id}`)} style={{ cursor: "pointer", height: "100%" }}><MeetupCard {...m} style={{ height: "100%" }} /></div>
          ))}
          {meetups.length === 0 && <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", padding: 20 }}>해당 카테고리의 모임이 없어요.</div>}
        </div>

        <SectionTitle>추천 행사</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EVENTS.map(({ id, description, matchReason, features, schedule, ...e }) => <EventCard key={id} {...e} onClick={() => navigate(`/events/${id}`)} />)}
        </div>
      </div>
    </AppShell>
  );
}