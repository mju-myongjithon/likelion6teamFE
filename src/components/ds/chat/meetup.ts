/** 약속 잡기 도메인 타입 — 약속 잡기 모달·투표 카드·확정 카드가 공유한다. */

import type { CafeRecommendation } from "../../../api/cafe";

export type PlaceMode = "midpoint" | "custom";

export interface Meetup {
  name: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  placeMode: PlaceMode;
  address: string; // "시 군 구 상세주소" — custom 모드에서만 채워짐
}

/** 확정된 약속의 장소(= 최다 득표 카페). 카페 추천 응답에서 필요한 필드만 추린 형태. */
export interface MeetupPlace {
  rank: number;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  parkingAvailable: boolean;
  parkingInfo: string;
}

/** 카페 추천 응답 항목 → 약속 장소로 변환. */
export function toMeetupPlace(c: CafeRecommendation): MeetupPlace {
  return {
    rank: c.rank,
    placeName: c.location.placeName,
    address: c.detail.address,
    latitude: c.location.latitude,
    longitude: c.location.longitude,
    phone: c.detail.phone,
    parkingAvailable: c.detail.parkingAvailable,
    parkingInfo: c.detail.parkingInfo,
  };
}

/** 투표 완료 시 백엔드로 보내는 약속 확정 요청. */
export interface ConfirmMeetupRequest {
  name: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  place: MeetupPlace;
}

/** 백엔드가 DB 저장 후 돌려주는 확정된 약속. (현재는 요청과 동일 구조) */
export type ConfirmedMeetup = ConfirmMeetupRequest;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** yyyy-mm-dd → "M월 D일 (요일)". 파싱 실패 시 원본을 그대로 돌려준다. */
export function formatMeetupDate(d: string): string {
  const dt = new Date(`${d}T00:00:00`);
  if (isNaN(dt.getTime())) return d;
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일 (${WEEKDAYS[dt.getDay()]})`;
}
