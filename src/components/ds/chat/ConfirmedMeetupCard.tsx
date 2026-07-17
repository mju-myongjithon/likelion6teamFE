import type { Meetup } from "../../../api/meetupApi";
import { Badge } from "../display/Badge";
import { Icon } from "../foundations/Icon";
import { KakaoMap } from "./KakaoMap";

export function ConfirmedMeetupCard({ meetup }: { meetup: Meetup }): JSX.Element {
  const option = meetup.options.find((candidate) => candidate.optionId === meetup.confirmedOptionId);
  if (!option) return <></>;
  const markers = option.latitude !== null && option.longitude !== null
    ? [{ latitude: option.latitude, longitude: option.longitude, label: option.placeName }]
    : [];

  return (
    <div style={{ width: "min(460px, 100%)", overflow: "hidden", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "var(--canvas)", boxShadow: "var(--shadow-soft)" }}>
      {markers.length > 0 && <KakaoMap markers={markers} height={150} />}
      <div style={{ padding: 18 }}>
        <Badge tone="emerald">약속 확정</Badge>
        <h3 style={{ margin: "10px 0", fontFamily: "var(--font-sans)", fontSize: 17, color: "var(--ink)" }}>{meetup.name}</h3>
        <div style={{ display: "grid", gap: 7, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="calendar" size={14} />{meetup.meetingDate} · {meetup.meetingTime.slice(0, 5)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="map-pin" size={14} />{option.placeName}</span>
          {option.address && <span style={{ paddingLeft: 21, color: "var(--muted)" }}>{option.address}</span>}
        </div>
      </div>
    </div>
  );
}
