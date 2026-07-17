/**
 * ProfilePopoverScreen.preview.jsx — RUNTIME MOUNT only.
 * Canonical typed source: ProfilePopoverScreen.tsx.
 * Reuses the Home screen behind an always-open ProfilePopover to demonstrate
 * the header avatar interaction in context.
 */
const { getDS, AppShell, defineScreen } = window.CampusLinkAppShell;
React = window.React;

const EVENTS = [
  { title: "주말 알고리즘 스터디", when: "토 오후 2시" },
  { title: "AI 논문 리딩 그룹", when: "수 저녁 8시" },
  { title: "AI 해커톤 2026", when: "2/14 오전 10시" },
];

function ProfilePopoverScreen() {
  const { ProfilePopover, MeetupCard, Badge, Callout } = getDS();
  return (
    <AppShell active="home">
      <div style={{ position: "relative", padding: 28 }}>
        <div style={{ marginBottom: 8 }}><Badge tone="violet">✦ 오늘의 AI 추천</Badge></div>
        <h1 className="cl-display-md" style={{ margin: "0 0 var(--space-xs)" }}>안녕하세요, 지훈님</h1>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>우측 상단 아바타를 클릭하면 다가오는 일정을 확인할 수 있어요.</p>
        <Callout style={{ marginBottom: 24, maxWidth: 520 }}>이 화면은 헤더 아바타 클릭 시 열리는 프로필 팝오버를 보여주기 위해 항상 펼쳐 두었습니다.</Callout>
        <div style={{ maxWidth: 340 }}>
          <MeetupCard title="주말 알고리즘 스터디 — 코딩테스트 대비" category="스터디" categoryTone="violet" when="매주 토 · 오후 2시" where="강남" host="김민준" members={8} capacity={12} matchScore={94} />
        </div>

        <div style={{ position: "absolute", top: -6, right: 28, zIndex: 20 }}>
          <ProfilePopover
            name="정지훈"
            meta="한양대학교 · 컴퓨터공학과"
            avatarTone="violet"
            events={EVENTS}
            onViewProfile={() => { window.location.href = "../app-mypage/MyPage.dc.html"; }}
          />
        </div>
      </div>
    </AppShell>
  );
}

defineScreen("campuslink-profile-popover", () => ProfilePopoverScreen);
