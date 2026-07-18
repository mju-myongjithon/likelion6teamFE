import { useNavigate } from "react-router-dom";
import type { AppliedEvent, MyPageGroup } from "../api/myPageApi";
import { Badge } from "./ds/display/Badge";
import { Card } from "./ds/cards/Card";

interface MyActivityOverviewProps {
  appliedEvents: AppliedEvent[];
  myGroups: MyPageGroup[];
}

export function MyActivityOverview({ appliedEvents, myGroups }: MyActivityOverviewProps): JSX.Element {
  const navigate = useNavigate();

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
            {appliedEvents.map((event) => (
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
            {appliedEvents.length === 0 && <span style={emptyStyle}>아직 신청 표시한 행사가 없어요.</span>}
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <strong style={{ fontFamily: "var(--font-sans)", fontSize: 15 }}>내 모임</strong>
            <Badge tone="violet">{myGroups.length}개</Badge>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myGroups.map((group) => (
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
            {myGroups.length === 0 && <span style={emptyStyle}>아직 참여 중인 모임이 없어요.</span>}
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
  padding: "12px 0",
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  color: "var(--muted)",
};
