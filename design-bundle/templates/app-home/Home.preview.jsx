/**
 * Home.preview.jsx — RUNTIME MOUNT only. Canonical typed source: Home.tsx.
 * Uses the shared window.CampusLinkAppShell (loaded via app-shell.js helmet).
 */
const { getDS, AppShell, defineScreen } = window.CampusLinkAppShell;
// x-import injects a stale React binding; point it at the helmet's UMD React so
// this module's JSX (React.createElement) uses the same instance as the shell.
React = window.React;

const CATEGORIES = ["전체", "스터디", "네트워킹", "취미", "운동", "문화"];

const MEETUPS = [
  { title: "주말 알고리즘 스터디 — 코딩테스트 대비", category: "스터디", categoryTone: "violet", when: "매주 토 · 오후 2시", where: "강남", host: "김민준", members: 8, capacity: 12, matchScore: 94 },
  { title: "북클럽: 이번 달 과학 에세이", category: "취미", categoryTone: "orange", when: "1/28 화 · 저녁 8시", where: "온라인", host: "박도윤", members: 14, capacity: 20, matchScore: 90 },
  { title: "주니어 디자이너 포트폴리오 리뷰", category: "네트워킹", categoryTone: "pink", when: "2/1 토 · 오후 3시", where: "홍대", host: "최유진", members: 6, capacity: 10, matchScore: 87 },
];

const EVENTS = [
  { month: "2월", day: "14", title: "AI 해커톤 2026 — 48시간 무박", time: "오전 10시", venue: "코엑스 D홀", tag: "해커톤", matchScore: 92, attendance: "128명 참석" },
  { month: "2월", day: "20", title: "스타트업 채용 박람회", time: "오후 1시", venue: "성수 S팩토리", tag: "행사", matchScore: 78, attendance: "340명 참석" },
];

function Home() {
  const { NavPillGroup, MeetupCard, EventCard, Callout, Badge } = getDS();
  const [cat, setCat] = React.useState("전체");
  const [q, setQ] = React.useState("");
  const goDetail = () => { window.location.href = "../app-group-detail/GroupDetail.dc.html"; };
  const goEvent = () => { window.location.href = "../app-event-detail/EventDetail.dc.html"; };
  let meetups = MEETUPS;
  if (cat !== "전체") meetups = meetups.filter((m) => m.category === cat);
  if (q) meetups = meetups.filter((m) => m.title.includes(q));

  return (
    <AppShell active="home" q={q} setQ={setQ} onAvatar={() => { window.location.href = "../app-mypage/MyPage.dc.html"; }}>
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
          {meetups.map((m, i) => (
            <div key={i} onClick={goDetail} style={{ cursor: "pointer", height: "100%" }}><MeetupCard {...m} style={{ height: "100%" }} /></div>
          ))}
          {meetups.length === 0 && <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", padding: 20 }}>해당 카테고리의 모임이 없어요.</div>}
        </div>

        <SectionTitle>추천 행사</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {EVENTS.map((e, i) => <EventCard key={i} {...e} onClick={goEvent} />)}
        </div>
      </div>
    </AppShell>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>{children}</h2>;
}

defineScreen("campuslink-home", () => Home);
