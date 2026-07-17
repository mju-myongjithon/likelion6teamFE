import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { NavPillGroup } from "../components/ds/navigation/NavPillGroup";
import { MeetupCard, type MeetupCardProps } from "../components/ds/cards/MeetupCard";
import { EventCard, type EventCardProps } from "../components/ds/cards/EventCard";
import { Callout } from "../components/ds/feedback/Callout";
import { Badge } from "../components/ds/display/Badge";
import { Button } from "../components/ds/actions/Button";
import { Icon } from "../components/ds/foundations/Icon";
import { getMyProfile } from "../api/profileApi";
import { getListings, type StudyListingItem, type HackathonListingItem } from "../api/listingApi";
import { getRecommendations, type RecommendationItem } from "../api/recommendationApi";

const CATEGORIES = ["전체", "스터디", "해커톤(대회)"];

export type MeetupData = Omit<MeetupCardProps, "style"> & {
  id: string;
  description: string;
  matchReason: string;
};

// 참고: 더 이상 사용하지 않지만, 다른 파일(GroupDetailPage 등)에서 아직 참조하고 있어서 남겨둠.
// 상세 페이지도 API 연결되면 이 배열은 완전히 제거해도 됨.
// eslint-disable-next-line react-refresh/only-export-components
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
    matchReason: "프론트엔드 · React | 회원님의 역할과 일치해요",
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
    matchReason: "개발 · 해커톤(대회) | 회원님의 관심사와 일치해요",
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
    matchReason: "프론트엔드 · React | 회원님의 역할과 일치해요",
  },
];

export type EventData = Omit<EventCardProps, "style" | "onClick"> & {
  id: string;
  description: string;
  matchReason: string;
  features: string[];
  schedule: Array<{ date: string; title: string; time?: string }>;
};

// 참고: 더 이상 사용하지 않지만, 다른 파일(EventDetailPage 등)에서 아직 참조하고 있어서 남겨둠.
// eslint-disable-next-line react-refresh/only-export-components
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
  const [userName, setUserName] = React.useState<string>("");
  const [apiMeetups, setApiMeetups] = React.useState<MeetupData[]>([]);
  const [apiEvents, setApiEvents] = React.useState<EventData[]>([]);
  const [recommendations, setRecommendations] = React.useState<RecommendationItem[] | null>(null);
  const [recommendationReasons, setRecommendationReasons] = React.useState<string[]>([]);
  const [loadingListings, setLoadingListings] = React.useState(true);

  React.useEffect(() => {
    getMyProfile()
      .then((res) => setUserName(res.data.name))
      .catch((err) => console.error("프로필 조회 실패:", err));
  }, []);

  React.useEffect(() => {
    getListings()
      .then((listingsResponse) => {
        const studyItems = listingsResponse.data.filter(
          (item): item is StudyListingItem => item.category === "STUDY"
        );
        const hackathonItems = listingsResponse.data.filter(
          (item): item is HackathonListingItem => item.category === "HACKATHON"
        );

        setApiMeetups(
          studyItems.map((item) => ({
              id: String(item.groupId),
              title: item.title,
              category: "스터디",
              categoryTone: "violet",
              when: item.meetingRule,
              where: item.location,
              host: "",
              members: item.currentMemberCount,
              capacity: item.maxMemberCount,
              matchScore: null,
              description: "",
              matchReason: "",
            }))
        );

        setApiEvents(
          hackathonItems.map((item) => {
            const startDate = new Date(item.startsAt);
            return {
              id: String(item.eventId),
              month: `${startDate.getMonth() + 1}월`,
              day: String(startDate.getDate()),
              title: item.title,
              time: startDate.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" }),
              venue: item.location,
              tag: "해커톤",
              tagTone: "orange",
              matchScore: null,
              attendance: "",
              description: "",
              matchReason: "",
              features: [],
              schedule: [],
            };
          })
        );
      })
      .catch((err) => console.error("통합 목록 조회 실패:", err))
      .finally(() => setLoadingListings(false));

    getRecommendations()
      .then((response) => {
        setRecommendations(response.data);
        setRecommendationReasons(response.data[0]?.reasons ?? []);
      })
      .catch((err) => console.error("추천 정보 조회 실패:", err));
  }, []);

  const meetupsWithRecommendations = recommendations === null
    ? apiMeetups
    : recommendations.flatMap((recommendation) => {
        if (recommendation.category !== "STUDY") return [];
        const meetup = apiMeetups.find((item) => item.id === String(recommendation.targetId));
        if (!meetup) return [];
        return [{
          ...meetup,
          matchScore: recommendation.score,
          matchReason: recommendation.reasons.join(" "),
        }];
      });

  const eventsWithRecommendations = recommendations === null
    ? apiEvents
    : recommendations.flatMap((recommendation) => {
        if (recommendation.category !== "HACKATHON") return [];
        const event = apiEvents.find((item) => item.id === String(recommendation.targetId));
        if (!event) return [];
        return [{
          ...event,
          matchScore: recommendation.score,
          matchReason: recommendation.reasons.join(" "),
        }];
      });

  let meetups = meetupsWithRecommendations;
  if (cat !== "전체") meetups = meetups.filter((m) => m.category === cat);
  if (q) meetups = meetups.filter((m) => (m.title ?? "").includes(q));

  return (
    <AppShell q={q} setQ={setQ}>
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 8 }}><Badge tone="violet">✦ 오늘의 AI 추천</Badge></div>
        <h1 className="cl-display-md" style={{ margin: "0 0 var(--space-xs)" }}>
          안녕하세요, {userName || "..."}님
        </h1>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>성향과 목적을 분석해 딱 맞는 모임과 행사를 골랐어요.</p>
        {recommendationReasons.length > 0 && (
          <Callout style={{ marginBottom: 24 }}>{recommendationReasons.join(" ")}</Callout>
        )}

        <div style={{ marginBottom: 20 }}>
          <NavPillGroup items={CATEGORIES} value={cat} onChange={setCat} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>추천 모임</h2>
          <Button variant="secondary" size="sm" iconLeft={<Icon name="plus" size={14} />} onClick={() => navigate("/groups/new")}>
            새 모임 만들기
          </Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(calc(var(--space-section) * 3 - var(--space-xs)), 1fr))", gap: 20, marginBottom: 36, alignItems: "stretch" }}>
          {meetups.map((meetup) => (
            <div key={meetup.id} onClick={() => navigate(`/groups/${meetup.id}`)} style={{ cursor: "pointer", height: "100%" }}><MeetupCard {...meetup} style={{ height: "100%" }} /></div>
          ))}
          {!loadingListings && meetups.length === 0 && <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", padding: 20 }}>해당 카테고리의 모임이 없어요.</div>}
        </div>

        <SectionTitle>추천 행사</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {eventsWithRecommendations.map((event) => <EventCard key={event.id} {...event} onClick={() => navigate(`/events/${event.id}`)} />)}
          {!loadingListings && eventsWithRecommendations.length === 0 && <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", padding: 20 }}>등록된 행사가 없어요.</div>}
        </div>
      </div>
    </AppShell>
  );
}
