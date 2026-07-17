import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { NavPillGroup } from "../components/ds/navigation/NavPillGroup";
import { Badge, type BadgeTone } from "../components/ds/display/Badge";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Icon } from "../components/ds/foundations/Icon";
import { useSavedItems } from "../context/SavedItemsContext";

interface Group {
  id: string;
  title: string;
  category: string;
  categoryTone: BadgeTone & AvatarTone;
  when: string;
  where: string;
  host: string;
  members: number;
  capacity: number;
  next?: string;
  pending?: boolean;
  past?: boolean;
}

const STATIC_DATA: Record<string, Group[]> = {
  "참여 중": [
    { id: "g1", title: "주말 알고리즘 스터디", category: "스터디", categoryTone: "violet", when: "매주 토 · 오후 2시", where: "강남", host: "김민준", members: 8, capacity: 12, next: "이번 주 토요일" },
    { id: "g2", title: "AI 논문 리딩 그룹", category: "스터디", categoryTone: "violet", when: "매주 수 · 저녁 8시", where: "온라인", host: "윤재원", members: 6, capacity: 12, next: "내일 저녁" },
  ],
  "신청 중": [
    { id: "g4", title: "교외 해커톤 팀원 모집 — 백엔드 파트", category: "해커톤(대회)", categoryTone: "orange", when: "1/28 화 · 저녁 8시", where: "온라인", host: "박도윤", members: 14, capacity: 20, pending: true },
  ],
  "지난 모임": [
    { id: "g5", title: "겨울 알고리즘 스터디", category: "스터디", categoryTone: "violet", when: "12/20 · 종료", where: "온라인", host: "최유진", members: 10, capacity: 10, past: true },
  ],
};

function GroupRow({ g, onClick }: { g: Group; onClick: () => void }): JSX.Element {
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

/** 내 모임 목록 — 참여 중/신청 중/지난 모임/저장한 모임 탭. */
export function MyGroupsPage(): JSX.Element {
  const navigate = useNavigate();
  const { savedItems } = useSavedItems();
  const savedAsGroups: Group[] = savedItems.map((it) => ({
    id: it.id,
    title: it.title,
    category: it.category,
    categoryTone: it.categoryTone as BadgeTone & AvatarTone,
    when: it.when,
    where: it.where,
    host: it.host,
    members: it.members,
    capacity: it.capacity,
  }));
  const data: Record<string, Group[]> = { ...STATIC_DATA, "저장한 모임": savedAsGroups };
  const [tab, setTab] = React.useState<string>("참여 중");
  const list = data[tab] ?? [];
  return (
    <AppShell>
      <div style={{ padding: 28, maxWidth: 860 }}>
        <h1 className="cl-display-md" style={{ margin: "0 0 var(--space-xs)" }}>내 모임</h1>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>참여 중인 모임과 신청 현황을 한눈에 확인하세요.</p>
        <div style={{ marginBottom: 24 }}>
          <NavPillGroup items={Object.keys(data)} value={tab} onChange={setTab} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((g) => <GroupRow key={g.id} g={g} onClick={() => navigate(`/my-groups/${g.id}`)} />)}
          {list.length === 0 && tab === "저장한 모임" && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
              아직 저장한 모임이 없어요. 모임/행사 상세 페이지에서 저장 버튼을 눌러보세요.
            </div>
          )}
          {list.length === 0 && tab !== "저장한 모임" && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>아직 없어요.</div>}
        </div>
      </div>
    </AppShell>
  );
}
