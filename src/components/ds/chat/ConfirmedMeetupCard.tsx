import { Icon } from "../foundations/Icon";
import { formatMeetupDate, type ConfirmedMeetup } from "./meetup";

export interface ConfirmedMeetupCardProps {
  meetup: ConfirmedMeetup;
  style?: React.CSSProperties;
}

/**
 * ConfirmedMeetupCard — 투표가 완료되어 확정된 약속을 알리는 카드.
 * 채팅방 중앙에 게시되며 약속명·날짜·시간·지도·확정된 카페 정보를 담는다.
 */
export function ConfirmedMeetupCard({ meetup, style = {} }: ConfirmedMeetupCardProps): JSX.Element {
  const place = meetup.place;

  return (
    <div style={{ width: 380, maxWidth: "100%", background: "var(--canvas)", border: "1px solid var(--primary)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-raised)", ...style }}>
      {/* 확정 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "var(--primary)", color: "var(--on-primary)" }}>
        <Icon name="check-circle" size={16} color="var(--on-primary)" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700 }}>약속이 확정되었어요</span>
      </div>

      {/* 약속명 · 날짜 · 시간 */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--hairline-soft)" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{meetup.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>
          <Icon name="calendar" size={14} color="var(--muted)" />
          <span>{formatMeetupDate(meetup.date)} · {meetup.time}</span>
        </div>
      </div>

      {/* 지도 */}
      <img src="/meetup-map.png" alt="약속 장소 지도" style={{ width: "100%", height: 150, objectFit: "cover", display: "block" }} />

      {/* 확정된 카페 정보 */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="map-pin" size={18} color="var(--on-primary)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{place.placeName}</span>
            {place.parkingAvailable && (
              <span style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, color: "var(--muted)", background: "var(--surface-strong)", borderRadius: "var(--radius-pill)", padding: "1px 6px" }}>주차</span>
            )}
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{place.address}</div>
          {place.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
              <Icon name="phone" size={12} color="var(--muted)" />
              <span>{place.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
