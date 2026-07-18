import React from "react";
import type { CreateMeetupRequest, PlaceMode } from "../../../api/meetupApi";
import { Button } from "../actions/Button";
import { Input } from "../forms/Input";
import { Icon } from "../foundations/Icon";

interface MeetupModalProps {
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onCreate: (request: CreateMeetupRequest) => void;
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--ink)",
};

export function MeetupModal({ loading, error, onClose, onCreate }: MeetupModalProps): JSX.Element {
  const [name, setName] = React.useState("");
  const [meetingDate, setMeetingDate] = React.useState("");
  const [meetingTime, setMeetingTime] = React.useState("");
  const [placeMode, setPlaceMode] = React.useState<PlaceMode>("MIDPOINT");
  const [customAddress, setCustomAddress] = React.useState("");
  const valid = name.trim() !== ""
    && meetingDate !== ""
    && meetingTime !== ""
    && (placeMode === "MIDPOINT" || customAddress.trim() !== "");

  const submit = (): void => {
    if (!valid || loading) return;
    onCreate({
      name: name.trim(),
      meetingDate,
      meetingTime,
      placeMode,
      customAddress: placeMode === "CUSTOM" ? customAddress.trim() : undefined,
    });
  };

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(17, 17, 17, .45)",
      }}
    >
      <div style={{ width: 440, maxWidth: "100%", padding: 24, borderRadius: "var(--radius-lg)", background: "var(--canvas)", boxShadow: "var(--shadow-raised)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="calendar-check" size={20} color="var(--ink)" />
          <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 18, color: "var(--ink)" }}>약속 잡기</h2>
        </div>
        <p style={{ margin: "6px 0 20px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>
          약속을 만들면 채팅방에 장소 투표 카드가 전송돼요.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>약속명</label>
            <Input value={name} maxLength={100} placeholder="예) 토요일 알고리즘 스터디" onChange={(event) => setName(event.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>날짜</label>
              <Input type="date" value={meetingDate} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setMeetingDate(event.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>시간</label>
              <Input type="time" value={meetingTime} onChange={(event) => setMeetingTime(event.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>장소 정하기</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Button variant={placeMode === "MIDPOINT" ? "primary" : "secondary"} onClick={() => setPlaceMode("MIDPOINT")}>
                중간지점 카페 추천
              </Button>
              <Button variant={placeMode === "CUSTOM" ? "primary" : "secondary"} onClick={() => setPlaceMode("CUSTOM")}>
                직접 지정
              </Button>
            </div>
          </div>
          {placeMode === "CUSTOM" && (
            <div>
              <label style={labelStyle}>장소 주소 또는 이름</label>
              <Input value={customAddress} maxLength={255} placeholder="예) 서울 강남구 테헤란로 123" onChange={(event) => setCustomAddress(event.target.value)} />
            </div>
          )}
          {placeMode === "MIDPOINT" && (
            <div style={{ padding: 12, borderRadius: "var(--radius-md)", background: "var(--surface-soft)", fontFamily: "var(--font-sans)", fontSize: 12, lineHeight: 1.6, color: "var(--muted)" }}>
              프로필 좌표가 없으면 저장한 시·군·구의 시청·군청·구청 대표 위치를 사용해 중간지점 카페를 추천합니다. 지역은 시·도를 포함해 입력해주세요.
            </div>
          )}
          {error && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--error)" }}>{error}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button variant="secondary" onClick={onClose} disabled={loading}>취소</Button>
            <Button onClick={submit} disabled={!valid || loading}>{loading ? "만드는 중..." : "투표 만들기"}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
