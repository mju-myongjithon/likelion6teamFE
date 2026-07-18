import { useNavigate } from "react-router-dom";
import type { AppliedEvent, MyPageGroup } from "../api/myPageApi";
import { Badge } from "./ds/display/Badge";
import { Button } from "./ds/actions/Button";
import { Card } from "./ds/cards/Card";

interface MyActivityOverviewProps {
  appliedEvents: AppliedEvent[];
  myGroups: MyPageGroup[];
}

export function MyActivityOverview({ appliedEvents, myGroups }: MyActivityOverviewProps): JSX.Element {
  const navigate = useNavigate();
  const visibleEvents = appliedEvents.slice(0, 3);
  const visibleGroups = myGroups.slice(0, 3);

  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600 }}>
        내 행사 · 모임 한눈에 보기
      </h2>
      <div className="cl-activity-overview-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        <Card padding={20}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--font-sans)", fontSize: 15 }}>신청 표시한 행사</strong>
            <Badge tone="orange">{appliedEvents.length}개</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibleEvents.map((event) => (
              <button
                key={event.eventId}
                type="button"
                onClick={() => navigate(`/events/${event.eventId}`)}
                style={itemButtonStyle}
              >
                <span style={itemTitleStyle}>{event.title}</span>
                <span style={itemMetaStyle}>
                  {formatDate(event.startsAt)} · {event.location}
                </span>
              </button>
            ))}
            {appliedEvents.length === 0 && (
              <div style={emptyActionStyle}>
                <span style={emptyStyle}>예정된 신청 행사가 없어요.</span>
                <Button variant="secondary" size="sm" onClick={() => navigate("/home")}>행사 탐색하기</Button>
              </div>
            )}
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--font-sans)", fontSize: 15 }}>내 모임</strong>
            <Badge tone="violet">{myGroups.length}개</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {visibleGroups.map((group) => (
              <button
                key={group.groupId}
                type="button"
                onClick={() => navigate(`/groups/${group.groupId}`)}
                style={itemButtonStyle}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={itemTitleStyle}>{group.title}</span>
                  {group.leader && <Badge>리더</Badge>}
                </span>
                <span style={itemMetaStyle}>{group.meetingRule} · {group.location}</span>
              </button>
            ))}
            {myGroups.length === 0 && (
              <div style={emptyActionStyle}>
                <span style={emptyStyle}>아직 참여 중인 모임이 없어요.</span>
                <Button variant="secondary" size="sm" onClick={() => navigate("/home")}>모임 탐색하기</Button>
              </div>
            )}
            {myGroups.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-groups")} style={{ alignSelf: "flex-start", padding: 0 }}>
                내 모임 전체보기
              </Button>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

const itemButtonStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
  width: "100%",
  padding: 12,
  border: "1px solid var(--hairline)",
  borderRadius: "var(--radius-md)",
  background: "var(--canvas)",
  textAlign: "left",
  cursor: "pointer",
};

const itemTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--ink)",
};

const itemMetaStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  color: "var(--muted)",
};

const emptyStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  color: "var(--muted)",
};

const emptyActionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 10,
  padding: "12px 0",
};
