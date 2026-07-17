import type { Meetup } from "../../../api/meetupApi";
import { Button } from "../actions/Button";
import { Badge } from "../display/Badge";
import { Icon } from "../foundations/Icon";
import { KakaoMap } from "./KakaoMap";

interface MeetupVoteCardProps {
  meetup: Meetup;
  loading: boolean;
  onVote: (optionId: number) => void;
  onCancelVote: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function MeetupVoteCard({
  meetup,
  loading,
  onVote,
  onCancelVote,
  onConfirm,
  onCancel,
}: MeetupVoteCardProps): JSX.Element {
  const canManage = meetup.canManage;
  const markers = meetup.options.flatMap((option) =>
    option.latitude !== null && option.longitude !== null
      ? [{ latitude: option.latitude, longitude: option.longitude, label: option.placeName }]
      : []);
  const totalVotes = meetup.options.reduce((sum, option) => sum + option.voteCount, 0);

  return (
    <div style={{ width: "min(520px, 100%)", overflow: "hidden", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "var(--canvas)", boxShadow: "var(--shadow-soft)" }}>
      {markers.length > 0 && <KakaoMap markers={markers} />}
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge tone="violet">장소 투표</Badge>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>{totalVotes}명 참여</span>
        </div>
        <h3 style={{ margin: "10px 0 4px", fontFamily: "var(--font-sans)", fontSize: 17, color: "var(--ink)" }}>{meetup.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>
          <Icon name="calendar" size={14} color="var(--muted)" />
          {meetup.meetingDate} · {meetup.meetingTime.slice(0, 5)}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {meetup.options.map((option) => {
            const selected = meetup.selectedOptionId === option.optionId;
            return (
              <button
                key={option.optionId}
                type="button"
                disabled={loading}
                onClick={() => onVote(option.optionId)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: 12,
                  textAlign: "left",
                  cursor: loading ? "wait" : "pointer",
                  border: `1px solid ${selected ? "var(--primary)" : "var(--hairline)"}`,
                  borderRadius: "var(--radius-md)",
                  background: selected ? "var(--surface-card)" : "var(--canvas)",
                  color: "var(--ink)",
                }}
              >
                <span style={{ display: "flex", width: 26, height: 26, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "var(--surface-dark)", color: "var(--on-dark)", fontSize: 12, fontWeight: 700 }}>
                  {option.rank}
                </span>
                <span>
                  <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600 }}>{option.placeName}</span>
                  {option.address && <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>{option.address}</span>}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700 }}>{option.voteCount}표</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {meetup.selectedOptionId !== null && <Button variant="ghost" size="sm" disabled={loading} onClick={onCancelVote}>내 투표 취소</Button>}
          {canManage && <Button variant="secondary" size="sm" disabled={loading || totalVotes === 0} onClick={onConfirm}>최다 득표로 확정</Button>}
          {canManage && <Button variant="ghost" size="sm" disabled={loading} onClick={onCancel}>약속 취소</Button>}
        </div>
      </div>
    </div>
  );
}
