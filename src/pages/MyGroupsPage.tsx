import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { NavPillGroup } from "../components/ds/navigation/NavPillGroup";
import { Badge, type BadgeTone } from "../components/ds/display/Badge";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Icon } from "../components/ds/foundations/Icon";
import { Button } from "../components/ds/actions/Button";
import { useSavedItems } from "../context/SavedItemsContext";
import { getMyGroups } from "../api/groupApi";
import { getMyApplications, cancelMyApplication } from "../api/groupApplicationApi";

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
  role?: "LEADER" | "MEMBER";
  /** true면 실제 백엔드 groupId — 클릭 시 /groups/:id(상세)로 이동 */
  real?: boolean;
  /** "신청 중" 탭 항목의 취소 액션 */
  applicationId?: number;
}

function GroupRow({ g, onClick, onCancel, cancelling }: { g: Group; onClick: () => void; onCancel?: (applicationId: number) => void; cancelling?: boolean }): JSX.Element {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 16, padding: 18, background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", cursor: "pointer", boxShadow: "var(--shadow-soft)" }}>
      <Avatar name={g.host} tone={g.categoryTone} size={44} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Badge tone={g.categoryTone}>{g.category}</Badge>
          {g.role === "LEADER" && <Badge tone="emerald">리더</Badge>}
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
      {onCancel && g.applicationId !== undefined && (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onCancel(g.applicationId as number); }}
          disabled={cancelling}
        >
          {cancelling ? "취소 중..." : "신청 취소"}
        </Button>
      )}
      <Icon name="chevron-right" size={18} color="var(--muted-soft)" />
    </div>
  );
}

/** 내 모임 목록 — 참여 중/신청 중/지난 모임/저장한 모임 탭. */
export function MyGroupsPage(): JSX.Element {
  const navigate = useNavigate();
  const { savedItems } = useSavedItems();

  const [activeGroups, setActiveGroups] = React.useState<Group[]>([]);
  const [pastGroups, setPastGroups] = React.useState<Group[]>([]);
  const [loadingMyGroups, setLoadingMyGroups] = React.useState(true);
  const [myGroupsError, setMyGroupsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getMyGroups()
      .then((res) => {
        const mapped = res.data.map((g) => ({
          id: String(g.groupId),
          title: g.title,
          category: "스터디",
          categoryTone: "violet" as const,
          when: g.meetingRule,
          where: g.location,
          host: "",
          members: g.currentMemberCount,
          capacity: g.maxMemberCount,
          role: g.role,
          real: true,
          past: g.status === "CLOSED",
        }));
        setActiveGroups(mapped.filter((g) => !g.past));
        setPastGroups(mapped.filter((g) => g.past));
      })
      .catch((err) => {
        console.error("내 모임 목록 조회 실패:", err);
        setMyGroupsError("내 모임 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoadingMyGroups(false));
  }, []);

  const [pendingApplications, setPendingApplications] = React.useState<Group[]>([]);
  const [loadingApplications, setLoadingApplications] = React.useState(true);
  const [applicationsError, setApplicationsError] = React.useState<string | null>(null);
  const [cancellingId, setCancellingId] = React.useState<number | null>(null);

  const refreshApplications = React.useCallback(() => {
    setLoadingApplications(true);
    getMyApplications({ status: "PENDING", page: 0, size: 50 })
      .then((res) => {
        setPendingApplications(
          res.data.content.map((a) => ({
            id: String(a.group.groupId),
            title: a.group.title,
            category: "스터디",
            categoryTone: "violet",
            when: a.group.meetingRule,
            where: a.group.location,
            host: a.group.leaderName ?? "",
            members: a.group.currentMemberCount,
            capacity: a.group.maxMemberCount,
            pending: true,
            real: true,
            applicationId: a.applicationId,
          }))
        );
      })
      .catch((err) => {
        console.error("내 참가 신청 조회 실패:", err);
        setApplicationsError("신청 내역을 불러오지 못했습니다.");
      })
      .finally(() => setLoadingApplications(false));
  }, []);

  React.useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  async function handleCancelApplication(applicationId: number): Promise<void> {
    setCancellingId(applicationId);
    try {
      await cancelMyApplication(applicationId);
      refreshApplications();
    } catch (err) {
      console.error("신청 취소 실패:", err);
    } finally {
      setCancellingId(null);
    }
  }

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

  const data: Record<string, Group[]> = {
    "참여 중": activeGroups,
    "신청 중": pendingApplications,
    "지난 모임": pastGroups,
    "저장한 모임": savedAsGroups,
  };
  const [tab, setTab] = React.useState<string>("참여 중");
  const list = data[tab] ?? [];

  const isLoading = (tab === "참여 중" || tab === "지난 모임") ? loadingMyGroups : tab === "신청 중" ? loadingApplications : false;
  const errorMsg = (tab === "참여 중" || tab === "지난 모임") ? myGroupsError : tab === "신청 중" ? applicationsError : null;

  return (
    <AppShell>
      <div style={{ padding: 28, maxWidth: 860 }}>
        <h1 className="cl-display-md" style={{ margin: "0 0 var(--space-xs)" }}>내 모임</h1>
        <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>참여 중인 모임과 신청 현황을 한눈에 확인하세요.</p>
        <div style={{ marginBottom: 24 }}>
          <NavPillGroup items={Object.keys(data)} value={tab} onChange={setTab} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((g) => (
            <GroupRow
              key={g.applicationId ?? g.id}
              g={g}
              onClick={() => navigate(g.real ? `/groups/${g.id}` : `/my-groups/${g.id}`)}
              onCancel={tab === "신청 중" ? handleCancelApplication : undefined}
              cancelling={cancellingId === g.applicationId}
            />
          ))}
          {isLoading && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>불러오는 중...</div>
          )}
          {!isLoading && errorMsg && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--danger, red)", fontFamily: "var(--font-sans)" }}>{errorMsg}</div>
          )}
          {!isLoading && !errorMsg && list.length === 0 && tab === "저장한 모임" && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>
              아직 저장한 모임이 없어요. 모임/행사 상세 페이지에서 저장 버튼을 눌러보세요.
            </div>
          )}
          {!isLoading && !errorMsg && list.length === 0 && tab !== "저장한 모임" && (
            <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--font-sans)" }}>아직 없어요.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
