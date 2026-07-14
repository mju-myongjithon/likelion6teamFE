/**
 * MyGroups.preview.jsx — RUNTIME MOUNT only. Canonical typed source: MyGroups.tsx.
 */
const { getDS, AppShell, defineScreen } = window.CampusLinkAppShell;
React = window.React;

const DATA = {
  "참여 중": [
    { title: "주말 알고리즘 스터디", category: "스터디", categoryTone: "violet", when: "매주 토 · 오후 2시", where: "강남", host: "김민준", members: 8, capacity: 12, next: "이번 주 토요일" },
    { title: "AI 논문 리딩 그룹", category: "스터디", categoryTone: "violet", when: "매주 수 · 저녁 8시", where: "온라인", host: "윤재원", members: 6, capacity: 12, next: "내일 저녁" },
    { title: "러닝 크루 — 한강 5K", category: "운동", categoryTone: "emerald", when: "매주 일 · 오전 9시", where: "뚝섬", host: "정하늘", members: 45, capacity: 50, next: "일요일 오전" },
  ],
  "신청 중": [
    { title: "스타트업 사이드프로젝트 밋업", category: "네트워킹", categoryTone: "orange", when: "1/25 금 · 저녁 7시", where: "성수동", host: "이서연", members: 22, capacity: 30, pending: true },
  ],
  "지난 모임": [
    { title: "겨울 디자인 워크샵", category: "취미", categoryTone: "pink", when: "12/20 · 종료", where: "홍대", host: "최유진", members: 10, capacity: 10, past: true },
  ],
};

function GroupRow({ g, onClick }) {
  const { Badge, Avatar, Icon } = getDS();
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 16, padding: 18, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", cursor: "pointer", boxShadow: "var(--shadow-soft)" }}>
      <Avatar name={g.host} tone={g.categoryTone} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Badge tone={g.categoryTone}>{g.category}</Badge>
          {g.pending && <Badge tone="warning">승인 대기</Badge>}
          {g.past && <Badge>종료</Badge>}
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{g.title}</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{g.when} · {g.where} · {g.members}/{g.capacity}명</div>
      </div>
      {g.next && (
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>다음 일정</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{g.next}</div>
        </div>
      )}
      <Icon name="chevron-right" size={18} color="var(--muted-soft)" />
    </div>
  );
}

function MyGroups() {
  const { NavPillGroup } = getDS();
  const [tab, setTab] = React.useState("참여 중");
  const list = DATA[tab];
  const go = () => { window.location.href = "../app-my-group-detail/MyGroupDetail.dc.html"; };
  return (
    <AppShell active="my">
      <div style={{ padding: 28, maxWidth: 860 }}>
        <h1 className="cl-display-md" style={{ margin: "0 0 var(--space-xs)" }}>내 모임</h1>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>참여 중인 모임과 신청 현황을 한눈에 확인하세요.</p>
        <div style={{ marginBottom: 24 }}>
          <NavPillGroup items={Object.keys(DATA)} value={tab} onChange={setTab} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((g, i) => <GroupRow key={i} g={g} onClick={go} />)}
          {list.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>아직 없어요.</div>}
        </div>
      </div>
    </AppShell>
  );
}

defineScreen("campuslink-my-groups", () => MyGroups);
