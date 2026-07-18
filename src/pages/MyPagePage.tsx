import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Avatar } from "../components/ds/display/Avatar";
import { Badge } from "../components/ds/display/Badge";
import { Button } from "../components/ds/actions/Button";
import { Stat } from "../components/ds/display/Stat";
import { Calendar } from "../components/ds/display/Calendar";
import { Icon } from "../components/ds/foundations/Icon";
import { getMyProfile, type ProfileResponse } from "../api/profileApi";
import { getMyPageSummary, type MyPageSummary } from "../api/myPageApi";

/** 마이페이지 — 프로필 정보, 활동 통계, 캘린더. */
export function MyPagePage(): JSX.Element {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null);
  const [summary, setSummary] = React.useState<MyPageSummary | null>(null);
  const [viewedMonth, setViewedMonth] = React.useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.all([
      getMyProfile(),
      getMyPageSummary(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1),
    ])
      .then(([profileResponse, summaryResponse]) => {
        setProfile(profileResponse.data);
        setSummary(summaryResponse.data);
      })
      .catch((err) => {
        console.error("마이페이지 조회 실패:", err);
        setError("마이페이지 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [viewedMonth]);

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: 28 }}>불러오는 중...</div>
      </AppShell>
    );
  }

  if (error || !profile || !summary) {
    return (
      <AppShell>
        <div style={{ padding: 28, color: "var(--danger, red)" }}>{error ?? "프로필이 없습니다."}</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ padding: 28, maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <Avatar name={profile.name} tone="violet" size={72} />
          <div style={{ flex: 1 }}>
            <h1 className="cl-display-sm" style={{ margin: 0 }}>{profile.name}</h1>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)", margin: "var(--space-xs) 0 var(--space-sm)" }}>
              {profile.schoolName} · {profile.departmentName} · {profile.residenceArea}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {profile.interests.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
          <Button variant="secondary" iconLeft={<Icon name="pencil" size={15} />} onClick={() => navigate("/signup/profile", { state: { mode: "edit", profile } })}>프로필 수정</Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          <Stat value={summary.participatedGroupCount} label="참여한 모임" icon={<Icon name="users" size={18} />} />
          <Stat value={`${summary.aiMatchSuccessRate}%`} label="AI 매칭 성사율" icon={<Icon name="sparkles" size={18} />} />
          <Stat
            value={summary.monthlyActivityCount}
            label={isCurrentMonth(viewedMonth) ? "이번 달 활동" : `${viewedMonth.getMonth() + 1}월 활동`}
            icon={<Icon name="calendar-check" size={18} />}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `1fr calc(var(--space-section) * 3 + var(--space-xl))`, gap: 20, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>자기소개</h2>
            <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 28, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)", whiteSpace: "pre-wrap" }}>
              {profile.bio || "아직 자기소개가 없어요."}
            </div>
          </div>
          <Calendar
            monthLabel={`${viewedMonth.getFullYear()}년 ${viewedMonth.getMonth() + 1}월`}
            startOffset={new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), 1).getDay()}
            daysInMonth={new Date(viewedMonth.getFullYear(), viewedMonth.getMonth() + 1, 0).getDate()}
            today={isCurrentMonth(viewedMonth) ? new Date().getDate() : null}
            events={summary.activities.map((activity) => ({
              day: Number(activity.date.slice(8, 10)),
              label: activity.name,
              tone: activity.status === "CONFIRMED" ? "accent" : "default",
            }))}
            onPrev={() => setViewedMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            onNext={() => setViewedMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          />
        </div>
      </div>
    </AppShell>
  );
}

function isCurrentMonth(month: Date): boolean {
  const today = new Date();
  return month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
}
