import apiClient from "./client";

/** 카페 추천 응답의 개별 항목 — GET /api/groups/{groupId}/cafes/recommendations */
export interface CafeRecommendation {
  rank: number;
  location: {
    placeName: string;
    latitude: number;
    longitude: number;
  };
  detail: {
    address: string;
    phone: string;
    parkingAvailable: boolean;
    parkingInfo: string;
  };
  reason: string;
}

interface CafeRecommendationsResponse {
  recommendations: CafeRecommendation[];
}

/**
 * 로그인 세션 우회용 mock 데이터.
 * VITE_USE_MOCK_CAFES=true 일 때 실제 API 대신 사용된다.
 * (추천 API는 로그인 세션을 요구하는데, 로그인이 다른 브랜치에서 개발 중이라 임시로 둔다.)
 */
const MOCK_RECOMMENDATIONS: CafeRecommendation[] = [
  {
    rank: 1,
    location: { placeName: "캠퍼스 카페", latitude: 37.223, longitude: 127.1888 },
    detail: { address: "경기 용인시 처인구 명지로 116", phone: "031-000-0001", parkingAvailable: true, parkingInfo: "건물 지하 주차 가능" },
    reason: "4명의 사용자 좌표와 카페 좌표 사이의 직선거리 기준으로 총 거리 약 1200m, 가장 먼 사용자 거리 약 400m로 후보 중 1순위입니다.",
  },
  {
    rank: 2,
    location: { placeName: "브루잉랩 명지대점", latitude: 37.2245, longitude: 127.1902 },
    detail: { address: "경기 용인시 처인구 명지로 124", phone: "031-000-0002", parkingAvailable: false, parkingInfo: "" },
    reason: "총 거리 약 1500m, 가장 먼 사용자 거리 약 520m로 후보 중 2순위입니다.",
  },
  {
    rank: 3,
    location: { placeName: "스터디카페 라운지", latitude: 37.2218, longitude: 127.1875 },
    detail: { address: "경기 용인시 처인구 명지로 108", phone: "031-000-0003", parkingAvailable: true, parkingInfo: "인근 공영주차장 이용" },
    reason: "총 거리 약 1700m, 가장 먼 사용자 거리 약 610m로 후보 중 3순위입니다.",
  },
];

const USE_MOCK = import.meta.env.VITE_USE_MOCK_CAFES === "true";

/**
 * 그룹의 카페 추천 목록을 가져온다. 멤버들의 좌표를 기준으로 백엔드가
 * 중간 위치에 가까운 카페를 순위와 함께 내려준다.
 *
 * 엔드포인트는 POST 이며 로그인된 세션이 필요하다(미로그인 시 401).
 * VITE_USE_MOCK_CAFES=true 이면 세션 없이 mock 데이터로 동작한다.
 */
export async function getCafeRecommendations(groupId: number | string): Promise<CafeRecommendation[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_RECOMMENDATIONS;
  }
  const { data } = await apiClient.post<CafeRecommendationsResponse>(`/api/groups/${groupId}/cafes/recommendations`, {});
  return data.recommendations;
}
