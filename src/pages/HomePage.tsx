import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { NavPillGroup } from "../components/ds/navigation/NavPillGroup";
import { MeetupCard, type MeetupCardProps } from "../components/ds/cards/MeetupCard";
import { EventCard, type EventCardProps } from "../components/ds/cards/EventCard";
import { Callout } from "../components/ds/feedback/Callout";
import { Button } from "../components/ds/actions/Button";
import { Icon } from "../components/ds/foundations/Icon";
import { getMyProfile, type ProfileResponse } from "../api/profileApi";
import { getListings, type StudyListingItem, type HackathonListingItem } from "../api/listingApi";
import { getRecommendations, type RecommendationItem } from "../api/recommendationApi";
import defaultProfileImage from "../assets/default-profile.svg";
import "./HomePage.css";

const CATEGORIES = ["전체", "스터디", "해커톤(대회)"];
const MIN_RECOMMENDED_MEETUP_COUNT = 5;

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

function ProfileAvatar({ avatarUrl, name }: { avatarUrl?: string; name: string }): JSX.Element {
  return (
    <img
      className="cl-home-profile-avatar"
      src={avatarUrl || defaultProfileImage}
      alt={`${name || "사용자"} 프로필`}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = defaultProfileImage;
      }}
    />
  );
}

/** CampusLink 홈 — 성향·목적 기반 추천 피드 + 카테고리 필터. */
export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const [cat, setCat] = React.useState<string>("전체");
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [apiMeetups, setApiMeetups] = React.useState<MeetupData[]>([]);
  const [apiEvents, setApiEvents] = React.useState<EventData[]>([]);
  const [recommendations, setRecommendations] = React.useState<RecommendationItem[] | null>(null);
  const [recommendationReasons, setRecommendationReasons] = React.useState<string[]>([]);
  const [loadingListings, setLoadingListings] = React.useState(true);
  const [listingsError, setListingsError] = React.useState<string | null>(null);
  const eventCardRefs = React.useRef(new Map<string, HTMLDivElement>());
  const eventCardPositions = React.useRef(new Map<string, DOMRect>());

  const loadProfile = React.useCallback(() => {
    return getMyProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("프로필 조회 실패:", err);
        setProfile(null);
        setProfileError("프로필 정보를 불러오지 못했어요.");
      })
      .finally(() => setProfileLoading(false));
  }, []);

  const retryProfile = () => {
    setProfileLoading(true);
    setProfileError(null);
    void loadProfile();
  };

  React.useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

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
              posterUrl: item.posterUrl,
              description: "",
              matchReason: "",
              features: [],
              schedule: [],
            };
          })
        );
      })
      .catch((err) => {
        console.error("통합 목록 조회 실패:", err);
        setListingsError("행사와 모임 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => setLoadingListings(false));

    getRecommendations()
      .then((response) => {
        setRecommendations(response.data);
        setRecommendationReasons(response.data[0]?.reasons ?? []);
      })
      .catch((err) => console.error("추천 정보 조회 실패:", err));
  }, []);

  const meetupsWithRecommendations = apiMeetups.map((meetup) => {
    const recommendation = recommendations?.find(
      (item) => item.category === "STUDY" && String(item.targetId) === meetup.id
    );
    return recommendation
      ? {
          ...meetup,
          matchScore: recommendation.score,
          matchReason: recommendation.reasons.join(" "),
        }
      : meetup;
  });

  const eventsWithRecommendations = apiEvents.map((event) => {
    const recommendation = recommendations?.find(
      (item) => item.category === "HACKATHON" && String(item.targetId) === event.id
    );
    return recommendation
      ? {
          ...event,
          matchScore: recommendation.score,
          matchReason: recommendation.reasons.join(" "),
        }
      : event;
  });

  let meetups = [...meetupsWithRecommendations].sort(
    (a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1)
  );
  if (cat !== "전체") meetups = meetups.filter((m) => m.category === cat);
  const recommendedMeetupCount = meetups.filter((meetup) => meetup.matchScore != null).length;
  meetups = meetups.slice(
    0,
    Math.max(MIN_RECOMMENDED_MEETUP_COUNT, recommendedMeetupCount)
  );
  const sortedEvents = [...eventsWithRecommendations].sort(
    (a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1)
  );
  const events = cat === "스터디" ? [] : sortedEvents;
  const eventOrderKey = events.map((event) => event.id).join(",");

  React.useLayoutEffect(() => {
    const nextPositions = new Map<string, DOMRect>();
    eventCardRefs.current.forEach((element, id) => {
      nextPositions.set(id, element.getBoundingClientRect());
    });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nextPositions.forEach((nextPosition, id) => {
        const previousPosition = eventCardPositions.current.get(id);
        const element = eventCardRefs.current.get(id);
        if (!previousPosition || !element) return;

        const offsetY = previousPosition.top - nextPosition.top;
        if (Math.abs(offsetY) < 1) return;

        element.animate(
          [
            { transform: `translateY(${offsetY}px)` },
            { transform: "translateY(0)" },
          ],
          {
            duration: 450,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        );
      });
    }

    eventCardPositions.current = nextPositions;
  }, [eventOrderKey]);

  const recommendationSignals = profile
    ? Array.from(new Set([...profile.roles, ...profile.interests, ...profile.purposes]))
    : [];
  const primaryRole = profile?.roles[0];
  const primaryInterest = profile?.interests[0];
  const primaryPurpose = profile?.purposes[0];
  const profileSummaryParts = [
    primaryRole && `${primaryRole} 역할`,
    primaryInterest && `${primaryInterest} 관심사`,
    primaryPurpose && `${primaryPurpose} 목적`,
  ].filter(Boolean);

  return (
    <AppShell>
      <div className="cl-home-page">
        <section className="cl-home-ai-hero" aria-labelledby="ai-briefing-title">
          <div className="cl-home-ai-briefing">
            <div className="cl-home-ai-eyebrow">✦ TODAY'S AI BRIEFING</div>
            <h1 id="ai-briefing-title" className="cl-home-ai-title">
              {profileLoading ? (
                "프로필을 확인하고 있어요"
              ) : profileError ? (
                "오늘의 추천 브리핑"
              ) : (
                <>안녕하세요, <span>{profile?.name}</span>님</>
              )}
            </h1>
            <p className="cl-home-ai-lead">
              {profileError
                ? "프로필을 다시 불러오면 맞춤 추천 기준을 확인할 수 있어요."
                : "프로필에 등록된 정보를 바탕으로 오늘의 추천 방향을 정리했어요."}
            </p>

            <div className="cl-home-ai-summary">
              <span className="cl-home-ai-summary-label">AI 요약</span>
              <div>
                <p>
                  {profileLoading
                    ? "등록된 역할과 관심사를 확인하는 중이에요."
                    : profileError
                      ? profileError
                      : profileSummaryParts.length > 0
                        ? `${profileSummaryParts.join(", ")}을 중심으로 모임과 개발 행사를 살펴보고 있어요.`
                        : "프로필에 역할, 관심사, 참여 목적을 추가하면 더 구체적인 추천 기준을 확인할 수 있어요."}
                </p>
                {profileError && (
                  <Button
                    className="cl-home-profile-retry"
                    variant="secondary"
                    size="sm"
                    onClick={retryProfile}
                    disabled={profileLoading}
                  >
                    프로필 다시 불러오기
                  </Button>
                )}
              </div>
            </div>

            <div className="cl-home-ai-signal-block">
              <div className="cl-home-ai-section-heading">
                <span>추천 신호</span>
                <small>프로필에 직접 등록된 키워드</small>
              </div>
              <div className="cl-home-ai-signals">
                {profileLoading ? (
                  <span className="cl-home-ai-empty">키워드를 불러오는 중이에요.</span>
                ) : profileError ? (
                  <span className="cl-home-ai-empty">프로필을 불러온 뒤 추천 신호를 표시할게요.</span>
                ) : recommendationSignals.length > 0 ? (
                  recommendationSignals.map((signal) => (
                    <span className="cl-home-ai-signal" key={signal}>#{signal}</span>
                  ))
                ) : (
                  <span className="cl-home-ai-empty">아직 등록된 키워드가 없어요.</span>
                )}
              </div>
            </div>

            {recommendationReasons.length > 0 && (
              <div className="cl-home-ai-reason">
                <span>대표 추천 근거</span>
                <p>{recommendationReasons.join(" ")}</p>
              </div>
            )}
          </div>

          <aside className="cl-home-profile-card" aria-label="내 프로필 요약">
            <div className="cl-home-profile-glow" aria-hidden="true" />
            <span className="cl-home-profile-label">MY PROFILE</span>
            <ProfileAvatar avatarUrl={profile?.avatarUrl} name={profile?.name || ""} />
            <h2>
              {profileLoading
                ? "프로필 불러오는 중"
                : profileError
                  ? "프로필 연결이 필요해요"
                  : profile?.name}
            </h2>
            <p className="cl-home-profile-school">
              {profileLoading
                ? "잠시만 기다려주세요."
                : profileError
                  ? "잠시 후 다시 시도해주세요."
                  : [profile?.schoolName, profile?.departmentName].filter(Boolean).join(" · ") || "학교 정보를 등록해주세요"}
            </p>
            {!profileLoading && !profileError && (
              <>
                {profile?.bio && <p className="cl-home-profile-bio">{profile.bio}</p>}
                <dl className="cl-home-profile-meta">
                  <div>
                    <dt>주요 역할</dt>
                    <dd>{profile?.roles.join(", ") || "미등록"}</dd>
                  </div>
                  <div>
                    <dt>활동 지역</dt>
                    <dd>{profile?.residenceArea || "미등록"}</dd>
                  </div>
                </dl>
              </>
            )}
            <div className="cl-home-profile-action">
              <Button
                variant="secondary"
                size="sm"
                onClick={profileError ? retryProfile : () => navigate("/mypage")}
                disabled={profileLoading}
                style={{ width: "100%" }}
              >
                {profileError ? "다시 시도" : "프로필 자세히 보기"}
              </Button>
            </div>
          </aside>
        </section>

        {listingsError && <Callout tone="danger" style={{ marginBottom: 24 }}>{listingsError}</Callout>}

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

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
          <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>개발 행사</h2>
          <Button variant="secondary" size="sm" iconLeft={<Icon name="plus" size={14} />} onClick={() => navigate("/events/new")}>
            새 행사 등록
          </Button>
        </div>
        <div className="cl-home-event-list">
          {events.map((event) => (
            <div
              className="cl-home-event-card"
              key={event.id}
              ref={(element) => {
                if (element) eventCardRefs.current.set(event.id, element);
                else eventCardRefs.current.delete(event.id);
              }}
            >
              <EventCard {...event} onClick={() => navigate(`/events/${event.id}`)} />
            </div>
          ))}
          {!loadingListings && !listingsError && events.length === 0 && <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", padding: 20 }}>등록된 행사가 없어요.</div>}
        </div>
      </div>
    </AppShell>
  );
}
