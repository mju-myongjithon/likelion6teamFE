import React from "react";
import { Input } from "../forms/Input";
import { Button } from "../actions/Button";
import { Icon } from "../foundations/Icon";
import type { Meetup, PlaceMode } from "./meetup";

const fieldLabel: React.CSSProperties = { display: "block", marginBottom: 6, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" };

export interface MeetupModalProps {
  onClose: () => void;
  onCreate: (m: Meetup) => void;
}

/** 약속 잡기 모달 — 약속명·날짜·시간·장소를 입력해 투표 카드를 생성한다. 빈칸이 있으면 만들기 비활성화. */
export function MeetupModal({ onClose, onCreate }: MeetupModalProps): JSX.Element {
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [placeMode, setPlaceMode] = React.useState<PlaceMode>("midpoint");
  const [si, setSi] = React.useState("");
  const [gun, setGun] = React.useState("");
  const [gu, setGu] = React.useState("");
  const [detail, setDetail] = React.useState("");

  const baseFilled = name.trim() !== "" && date.trim() !== "" && time.trim() !== "";
  const addrFilled = placeMode === "midpoint" || (si.trim() !== "" && gun.trim() !== "" && gu.trim() !== "" && detail.trim() !== "");
  const valid = baseFilled && addrFilled;

  const submit = () => {
    if (!valid) return;
    onCreate({
      name: name.trim(),
      date,
      time,
      placeMode,
      address: placeMode === "custom" ? `${si.trim()} ${gun.trim()} ${gu.trim()} ${detail.trim()}` : "",
    });
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 440, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", background: "var(--canvas)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-raised)", padding: 24, fontFamily: "var(--font-sans)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Icon name="calendar-check" size={20} color="var(--ink)" />
          <h2 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>약속 잡기</h2>
        </div>
        <p style={{ margin: "0 0 20px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>약속 정보를 입력하면 채팅방에 투표 카드가 전송돼요.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={fieldLabel}>약속명</label>
            <Input placeholder="예) 토요일 알고리즘 스터디" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>날짜</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={fieldLabel}>시간</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div>
            <label style={fieldLabel}>장소</label>
            <div style={{ display: "flex", gap: 8 }}>
              {([["midpoint", "중간지점"], ["custom", "사용자설정"]] as [PlaceMode, string][]).map(([mode, lbl]) => {
                const on = placeMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPlaceMode(mode)}
                    style={{ flex: 1, height: 40, borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, border: `1px solid ${on ? "var(--primary)" : "var(--hairline)"}`, background: on ? "var(--primary)" : "var(--canvas)", color: on ? "var(--on-primary)" : "var(--muted)", transition: "background .12s ease, border-color .12s ease, color .12s ease" }}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>
          </div>

          {placeMode === "custom" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 14, background: "var(--surface-soft)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>시</label>
                  <Input placeholder="서울특별시" value={si} onChange={(e) => setSi(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>군</label>
                  <Input placeholder="○○군" value={gun} onChange={(e) => setGun(e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>구</label>
                  <Input placeholder="강남구" value={gu} onChange={(e) => setGu(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={fieldLabel}>상세 주소</label>
                  <Input placeholder="테헤란로 123" value={detail} onChange={(e) => setDetail(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <Button variant="secondary" fullWidth onClick={onClose}>취소</Button>
          <Button variant="primary" fullWidth disabled={!valid} onClick={submit}>만들기</Button>
        </div>
      </div>
    </div>
  );
}
