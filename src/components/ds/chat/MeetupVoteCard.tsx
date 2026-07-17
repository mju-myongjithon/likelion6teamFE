import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "../foundations/Icon";
import { Card } from "../cards/Card";
import { Button } from "../actions/Button";
import { formatMeetupDate, toMeetupPlace, type Meetup, type MeetupPlace } from "./meetup";
import { KakaoMap, MapLoading } from "./KakaoMap";
import { getCafeRecommendations, type CafeRecommendation } from "../../../api/cafe";

export interface MeetupVoteCardProps {
  meetup: Meetup;
  /** 카페 추천 API를 호출할 그룹 id. */
  groupId: number | string;
  /** 투표가 완료됨 — 카페 선택이 잠기고 하단에 완료 표시가 뜬다. */
  ended?: boolean;
  /** "투표 완료" 클릭 — 최다 득표 카페를 넘겨준다. 보통 부모가 백엔드에 확정을 요청한다. */
  onComplete?: (winner: MeetupPlace) => void;
  /** "투표 취소" 클릭 — 보통 부모가 카드를 채팅에서 제거한다. */
  onCancel?: () => void;
  style?: React.CSSProperties;
}

/**
 * MeetupVoteCard — 채팅방에 게시되는 약속 잡기 투표 카드.
 * 상단에 약속명·날짜·시간을 보여주고, 중간지점이면 지도 + 추천 카페 투표를,
 * 사용자설정이면 확정된 주소를 표시한다. 추천 카페는 백엔드 API에서 불러온다.
 * 하단에는 투표 완료·투표 취소 버튼을 우측 정렬로 제공한다.
 */
export function MeetupVoteCard({ meetup, groupId, ended = false, onComplete, onCancel, style = {} }: MeetupVoteCardProps): JSX.Element {
  const isMidpoint = meetup.placeMode === "midpoint";
  const [selectedRank, setSelectedRank] = React.useState<number | null>(null);

  const { data: cafes = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["cafeRecommendations", groupId],
    queryFn: () => getCafeRecommendations(groupId),
    enabled: isMidpoint,
  });

  const sortedCafes = [...cafes].sort((a, b) => a.rank - b.rank);
  const topCafe = sortedCafes[0];

  /** 최다 득표 카페 — 내가 고른 곳이 있으면 그곳, 없으면 1순위 추천 카페. */
  const winningCafe = (): MeetupPlace | null => {
    if (cafes.length === 0) return null;
    const picked = selectedRank != null ? cafes.find((c) => c.rank === selectedRank) : null;
    const source = picked ?? sortedCafes[0];
    return toMeetupPlace(source);
  };

  const complete = () => {
    const winner = winningCafe();
    if (winner) onComplete?.(winner);
  };

  return (
    <div style={{ width: 420, maxWidth: "100%", background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-soft)", ...style }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline-soft)" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{meetup.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>
          <Icon name="calendar" size={13} color="var(--muted)" />
          <span>{formatMeetupDate(meetup.date)} · {meetup.time}</span>
        </div>
      </div>

      {!isMidpoint ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: 16 }}>
          <Icon name="map-pin" size={16} color="var(--primary)" />
          <div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>약속 장소</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{meetup.address}</div>
          </div>
        </div>
      ) : (
        <>
          {topCafe ? (
            <KakaoMap
              height={140}
              markers={sortedCafes.map((c) => ({
                lat: c.location.latitude,
                lng: c.location.longitude,
                label: `${c.rank}. ${c.location.placeName}`,
              }))}
            />
          ) : isLoading ? (
            <MapLoading height={140} />
          ) : null}
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {isLoading && (
              <div style={{ padding: "20px 0", textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>추천 카페를 불러오는 중…</div>
            )}
            {isError && (
              <div style={{ padding: "16px 0", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>추천 카페를 불러오지 못했어요.</div>
                <Button variant="secondary" size="sm" onClick={() => refetch()}>다시 시도</Button>
              </div>
            )}
            {!isLoading && !isError && cafes.length === 0 && (
              <div style={{ padding: "20px 0", textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>추천된 카페가 없어요.</div>
            )}
            {[...cafes].sort((a, b) => a.rank - b.rank).map((c: CafeRecommendation) => {
              const isSel = selectedRank === c.rank;
              return (
                <Card
                  key={c.rank}
                  surface="card"
                  radius="md"
                  padding="10px 12px"
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: ended ? "default" : "pointer", border: `2px solid ${isSel ? "var(--primary)" : "transparent"}`, background: "var(--surface-card)", transition: "border-color .12s ease" }}
                >
                  <div onClick={() => { if (!ended) setSelectedRank(c.rank); }} style={{ display: "flex", alignItems: "flex-start", gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, color: "var(--on-primary)" }}>{c.rank}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{c.location.placeName}</span>
                        {c.detail.parkingAvailable && (
                          <span style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600, color: "var(--muted)", background: "var(--surface-strong)", borderRadius: "var(--radius-pill)", padding: "1px 6px" }}>주차</span>
                        )}
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{c.detail.address}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted-soft)", marginTop: 4, lineHeight: 1.45 }}>{c.reason}</div>
                    </div>
                    {isSel && <Icon name="check" size={16} color="var(--primary)" style={{ marginTop: 2 }} />}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: "0 12px 12px" }}>
        {ended ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
            <Icon name="check-circle" size={14} color="var(--muted)" />투표 완료됨
          </span>
        ) : (
          <>
            <Button variant="primary" size="sm" disabled={isMidpoint && cafes.length === 0} onClick={complete}>투표 완료</Button>
            <Button variant="secondary" size="sm" onClick={onCancel}>투표 취소</Button>
          </>
        )}
      </div>
    </div>
  );
}
