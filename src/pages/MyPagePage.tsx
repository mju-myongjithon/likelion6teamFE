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

const ACTIVITY = [
  { text: "주말 알고리즘 스터디에 참여했어요", when: "2일 전" },
  { text: "AI 해커톤 2026에 신청했어요", when: "5일 전" },
  { text: "겨울 디자인 워크샵을 완료했어요", when: "3주 전" },
];

/** 마이페이지 — 프로필 정보, 활동 통계, 캘린더. */
export function MyPagePage(): JSX.Element {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<ProfileResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getMyProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.error("프로필 조회 실패:", err);
        setError("프로필을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: 28 }}>불러오는 중...</div>
      </AppShell>
    );
  }

  if (error || !profile) {
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
          <Stat value={12} label="참여한 모임" icon={<Icon name="users" size={18} />} />
          <Stat value="94%" label="AI 매칭 성사율" icon={<Icon name="sparkles" size={18} />} />
          <Stat value={6} label="이번 달 활동" icon={<Icon name="calendar-check" size={18} />} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `1fr calc(var(--space-section) * 3 + var(--space-xl))`, gap: 20, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>자기소개</h2>
            <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 28, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
              {profile.bio || "아직 자기소개가 없어요."}
            </div>
            <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>최근 활동</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "var(--space-sm) 0", borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--hairline-soft)" : "none" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "var(--radius-full)", background: "var(--ink)" }} />
                  <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink)" }}>{a.text}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted-soft)" }}>{a.when}</span>
                </div>
              ))}
            </div>
          </div>
          <Calendar monthLabel="2026년 2월" startOffset={0} daysInMonth={28} today={9} events={[{ day: 1 }, { day: 8 }, { day: 9 }, { day: 15 }, { day: 22 }]} />
        </div>
      </div>
    </AppShell>
  );
}