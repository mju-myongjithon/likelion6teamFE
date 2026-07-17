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

function daysSince(iso: string): number {
  const start = new Date(iso);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - start.getTime()) / 86400000);
  return Math.max(1, diff + 1);
}

function milestoneMessage(days: number): string {
  if (days <= 1) return "CampusLink에 오신 걸 환영해요!";
  if (days < 7) return "이제 막 시작했어요. 어울리는 모임을 둘러보세요.";
  if (days < 30) return "한 주 넘게 함께하고 있어요.";
  if (days < 100) return "벌써 한 달 넘게 함께하고 있어요!";
  if (days < 365) return "100일 넘게 CampusLink와 함께하고 있어요.";
  return "1년 넘게 함께해주셔서 고마워요!";
}

function TagRow({ label, items, emptyText }: { label: string; items: string[]; emptyText: string }): JSX.Element {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--muted)", marginBottom: 8 }}>{label}</div>
      {items.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {items.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
      ) : (
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted-soft)" }}>{emptyText}</div>
      )}
    </div>
  );
}

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
            <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 24, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)", whiteSpace: "pre-wrap" }}>
              {profile.bio || "아직 자기소개가 없어요."}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <TagRow label="활동 목적" items={profile.purposes} emptyText="설정된 활동 목적이 없어요." />
              <TagRow label="역할" items={profile.roles} emptyText="설정된 역할이 없어요." />
            </div>

            <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="sparkles" size={24} color="var(--on-primary)" />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>CampusLink와 함께한 지</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--ink)", letterSpacing: "-0.5px" }}>{daysSince(profile.createdAt)}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>일째</span>
                </div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{milestoneMessage(daysSince(profile.createdAt))}</div>
              </div>
            </div>
          </div>
          <Calendar monthLabel="2026년 2월" startOffset={0} daysInMonth={28} today={9} events={[{ day: 1 }, { day: 8 }, { day: 9 }, { day: 15 }, { day: 22 }]} />
        </div>
      </div>
    </AppShell>
  );
}