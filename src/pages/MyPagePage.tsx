import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Avatar } from "../components/ds/display/Avatar";
import { Badge } from "../components/ds/display/Badge";
import { Button } from "../components/ds/actions/Button";
import { Stat } from "../components/ds/display/Stat";
import { Calendar, type CalendarEvent } from "../components/ds/display/Calendar";
import { Card } from "../components/ds/cards/Card";
import { Callout } from "../components/ds/feedback/Callout";
import { ProgressBar } from "../components/ds/feedback/ProgressBar";
import { Icon } from "../components/ds/foundations/Icon";
import { getMyProfile, type ProfileResponse } from "../api/profileApi";
import {
  getMyPageSummary,
  type AppliedEvent,
  type MyPageSummary,
} from "../api/myPageApi";
import { getMyApplications } from "../api/groupApplicationApi";
import { MyActivityOverview } from "../components/MyActivityOverview";

const PROFILE_FIELDS = [
  { key: "bio", label: "자기소개" },
  { key: "interests", label: "관심사" },
  { key: "purposes", label: "활동 목적" },
  { key: "roles", label: "역할" },
] as const;

interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: "meetup" | "event";
  eventId?: number;
  groupId?: number;
}

function hasProfileValue(profile: ProfileResponse, key: typeof PROFILE_FIELDS[number]["key"]): boolean {
  const value = profile[key];
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

function profileCompletion(profile: ProfileResponse): number {
  const completed = PROFILE_FIELDS.filter(({ key }) => hasProfileValue(profile, key)).length;
  return Math.round((completed / PROFILE_FIELDS.length) * 100);
}

function createSchedule(summary: MyPageSummary, month: Date): ScheduleItem[] {
  const activities = summary.activities
    .filter((activity) => isSameMonth(activity.date, month))
    .map((activity) => ({
      id: `meetup-${activity.meetupId}`,
      title: activity.name,
      date: activity.date,
      time: activity.time,
      type: "meetup" as const,
      groupId: activity.groupId,
    }));
  const events = summary.appliedEvents
    .filter((event) => isSameMonth(event.startsAt, month))
    .map((event) => ({
      id: `event-${event.eventId}`,
      title: event.title,
      date: event.startsAt,
      type: "event" as const,
      eventId: event.eventId,
    }));

  return [...activities, ...events].sort((a, b) => scheduleTime(a) - scheduleTime(b));
}

function scheduleTime(item: ScheduleItem): number {
  if (item.type === "meetup") {
    return new Date(`${item.date}T${item.time || "00:00:00"}`).getTime();
  }
  return new Date(item.date).getTime();
}

function upcomingEvents(events: AppliedEvent[]): AppliedEvent[] {
  const now = Date.now();
  return events
    .filter((event) => new Date(event.endsAt || event.startsAt).getTime() >= now)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

function calendarEvents(summary: MyPageSummary, month: Date): CalendarEvent[] {
  return [
    ...summary.activities
      .filter((activity) => isSameMonth(activity.date, month))
      .map((activity) => ({
        day: dateInMonth(activity.date),
        label: `모임: ${activity.name}`,
        tone: activity.status === "CONFIRMED" ? "accent" as const : "default" as const,
      })),
    ...summary.appliedEvents
      .filter((event) => isSameMonth(event.startsAt, month))
      .map((event) => ({
        day: new Date(event.startsAt).getDate(),
        label: `신청 행사: ${event.title}`,
        tone: "accent" as const,
      })),
  ];
}

/** 마이페이지 — 핵심 프로필 정보와 실제 활동 상태를 한눈에 보여준다. */
export function MyPagePage(): JSX.Element {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);
  const [profileError, setProfileError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<MyPageSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = React.useState(true);
  const [summaryError, setSummaryError] = React.useState<string | null>(null);
  const [pendingApplicationCount, setPendingApplicationCount] = React.useState<number | null>(null);
  const [applicationsError, setApplicationsError] = React.useState(false);
  const [summaryReloadKey, setSummaryReloadKey] = React.useState(0);
  const [viewedMonth, setViewedMonth] = React.useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const summaryRequestId = React.useRef(0);

  const requestProfile = React.useCallback(() => getMyProfile()
      .then((response) => setProfile(response.data))
      .catch((error) => {
        console.error("프로필 조회 실패:", error);
        setProfileError("프로필 정보를 불러오지 못했습니다.");
      })
      .finally(() => setProfileLoading(false)), []);

  function retryProfile(): void {
    setProfileLoading(true);
    setProfileError(null);
    void requestProfile();
  }

  React.useEffect(() => {
    void requestProfile();
    getMyApplications({ status: "PENDING", page: 0, size: 1 })
      .then((response) => setPendingApplicationCount(response.data.totalElements))
      .catch((error) => {
        console.error("승인 대기 신청 조회 실패:", error);
        setApplicationsError(true);
      });
  }, [requestProfile]);

  React.useEffect(() => {
    const requestId = ++summaryRequestId.current;
    getMyPageSummary(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1)
      .then((response) => {
        if (requestId === summaryRequestId.current) setSummary(response.data);
      })
      .catch((error) => {
        if (requestId !== summaryRequestId.current) return;
        console.error("월별 마이페이지 요약 조회 실패:", error);
        setSummaryError("이 달의 일정 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (requestId === summaryRequestId.current) setSummaryLoading(false);
      });
  }, [summaryReloadKey, viewedMonth]);

  function moveMonth(offset: number): void {
    setSummaryLoading(true);
    setSummaryError(null);
    setViewedMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  function retrySummary(): void {
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryReloadKey((key) => key + 1);
  }

  if (profileLoading) {
    return (
      <AppShell>
        <div className="cl-mypage-state" role="status">프로필을 불러오는 중...</div>
      </AppShell>
    );
  }

  if (profileError || !profile) {
    return (
      <AppShell>
        <div className="cl-mypage-state" role="alert">
          <span>{profileError ?? "프로필이 없습니다."}</span>
          <Button variant="secondary" size="sm" onClick={retryProfile}>다시 시도</Button>
        </div>
      </AppShell>
    );
  }

  const interests = profile.interests.slice(0, 3);
  const extraInterestCount = Math.max(0, profile.interests.length - interests.length);
  const completion = profileCompletion(profile);
  const missingFields = PROFILE_FIELDS.filter(({ key }) => !hasProfileValue(profile, key));
  const schedule = summary ? createSchedule(summary, viewedMonth) : [];
  const monthLabel = `${viewedMonth.getFullYear()}년 ${viewedMonth.getMonth() + 1}월`;
  const editProfile = () => navigate("/signup/profile", { state: { mode: "edit", profile } });

  return (
    <AppShell>
      <div className="cl-mypage">
        <section className="cl-mypage-profile" aria-labelledby="mypage-title">
          <Avatar src={profile.avatarUrl} name={profile.name} tone="violet" size={80} />
          <div className="cl-mypage-profile-copy">
            <h1 id="mypage-title" className="cl-display-sm">{profile.name}</h1>
            <p>{profile.schoolName} · {profile.departmentName}</p>
            <div className="cl-mypage-interest-list" aria-label="관심사">
              {interests.map((interest) => <Badge key={interest}>{interest}</Badge>)}
              {extraInterestCount > 0 && <Badge>+{extraInterestCount}</Badge>}
              {profile.interests.length === 0 && <span>관심사를 추가해보세요.</span>}
            </div>
          </div>
          <Button
            variant="secondary"
            iconLeft={<Icon name="pencil" size={15} />}
            onClick={editProfile}
            aria-label="프로필 정보 수정"
          >
            프로필 수정
          </Button>
        </section>

        <section className="cl-mypage-stats" aria-label="내 활동 요약">
          <Stat value={`${completion}%`} label="프로필 완성도" icon={<Icon name="circle-user-round" size={18} />} />
          <Stat value={summary?.participatedGroupCount ?? "—"} label="내 모임" icon={<Icon name="users" size={18} />} />
          <Stat
            value={pendingApplicationCount ?? "—"}
            label={applicationsError ? "승인 대기 · 확인 불가" : "승인 대기"}
            icon={<Icon name="clock-3" size={18} />}
          />
        </section>

        <section className="cl-mypage-content-grid">
          <Card padding={24} style={{ minWidth: 0 }}>
            <div className="cl-mypage-section-heading">
              <div>
                <h2>프로필 완성도</h2>
                <p>{completion === 100 ? "모임에서 나를 잘 알아볼 수 있어요." : "정보를 채우면 더 잘 맞는 모임을 찾기 쉬워져요."}</p>
              </div>
              <strong>{completion}%</strong>
            </div>
            <ProgressBar value={completion / 100} showLabel={false} style={{ margin: "18px 0 20px" }} />
            <div className="cl-mypage-completion-grid">
              {PROFILE_FIELDS.map(({ key, label }) => {
                const complete = hasProfileValue(profile, key);
                return (
                  <div key={key} className={`cl-mypage-completion-item${complete ? " is-complete" : ""}`}>
                    <Icon name={complete ? "check" : "plus"} size={15} />
                    <span>{label}</span>
                    <span>{complete ? "완료" : "미입력"}</span>
                  </div>
                );
              })}
            </div>
            {missingFields.length > 0 && (
              <Button variant="ghost" size="sm" onClick={editProfile} iconRight={<Icon name="arrow-right" size={15} />} style={{ marginTop: 14, padding: 0 }}>
                누락된 정보 채우기
              </Button>
            )}
          </Card>

          <section aria-labelledby="schedule-title">
            <div className="cl-mypage-schedule-heading">
              <div>
                <h2 id="schedule-title">{viewedMonth.getMonth() + 1}월 일정</h2>
                <p>{summaryLoading ? "일정을 불러오는 중..." : `모임과 신청 행사를 합쳐 ${schedule.length}개예요.`}</p>
              </div>
              <span>{monthLabel}</span>
            </div>
            {summaryError && (
              <Callout tone="danger" style={{ marginBottom: 12 }}>
                <span className="cl-mypage-error-copy">
                  <span>{summaryError}</span>
                  <button type="button" onClick={retrySummary}>다시 시도</button>
                </span>
              </Callout>
            )}
            <Calendar
              monthLabel={monthLabel}
              startOffset={new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1).getDay()}
              daysInMonth={new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate()}
              today={isCurrentMonth(viewedMonth) ? new Date().getDate() : null}
              events={summary && !summaryError ? calendarEvents(summary, viewedMonth) : []}
              onPrev={() => moveMonth(-1)}
              onNext={() => moveMonth(1)}
              style={{ opacity: summaryLoading ? 0.62 : 1 }}
            />
          </section>
        </section>

        <section className="cl-mypage-month-preview" aria-labelledby="month-preview-title">
          <div className="cl-mypage-section-heading">
            <div>
              <h2 id="month-preview-title">{viewedMonth.getMonth() + 1}월 일정 미리보기</h2>
              <p>현재 조회 중인 달의 일정을 날짜순으로 보여드려요.</p>
            </div>
          </div>
          {!summaryLoading && !summaryError && schedule.length === 0 && (
            <div className="cl-mypage-empty">
              <span>이 달에 예정된 일정이 없어요.</span>
              <Button variant="secondary" size="sm" onClick={() => navigate("/home")}>모임 탐색하기</Button>
            </div>
          )}
          {summaryLoading && <div className="cl-mypage-empty" role="status">일정을 불러오는 중...</div>}
          {!summaryLoading && !summaryError && schedule.length > 0 && (
            <div className="cl-mypage-schedule-list">
              {schedule.slice(0, 5).map((item) => (
                item.eventId || item.groupId ? (
                  <button
                    key={item.id}
                    type="button"
                    className="cl-mypage-schedule-item"
                    onClick={() => navigate(item.eventId ? `/events/${item.eventId}` : `/groups/${item.groupId}`)}
                    aria-label={`${item.type === "event" ? "행사" : "모임"} ${item.title}, ${formatScheduleDate(item)}`}
                  >
                    <ScheduleItemContent item={item} />
                    <Icon name="chevron-right" size={17} color="var(--muted)" />
                  </button>
                ) : (
                  <div key={item.id} className="cl-mypage-schedule-item">
                    <ScheduleItemContent item={item} />
                  </div>
                )
              ))}
            </div>
          )}
        </section>

        {summary && !summaryError && (
          <MyActivityOverview
            appliedEvents={upcomingEvents(summary.appliedEvents)}
            myGroups={summary.myGroups}
          />
        )}
      </div>
    </AppShell>
  );
}

function ScheduleItemContent({ item }: { item: ScheduleItem }): JSX.Element {
  return (
    <>
      <span className="cl-mypage-schedule-date">{formatScheduleDay(item.date)}</span>
      <span className="cl-mypage-schedule-copy">
        <strong>{item.title}</strong>
        <span>{item.type === "event" ? "신청 행사" : "모임 일정"} · {formatScheduleDate(item)}</span>
      </span>
    </>
  );
}

function dateInMonth(iso: string): number {
  const datePart = iso.slice(0, 10);
  return Number(datePart.slice(8, 10));
}

function formatScheduleDay(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`;
}

function formatScheduleDate(item: ScheduleItem): string {
  const date = new Date(item.date);
  const dateText = date.toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" });
  if (!item.time) {
    return `${dateText} ${date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return `${dateText} ${item.time.slice(0, 5)}`;
}

function isSameMonth(iso: string, month: Date): boolean {
  const date = new Date(iso);
  return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
}

function isCurrentMonth(month: Date): boolean {
  const today = new Date();
  return month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
}
