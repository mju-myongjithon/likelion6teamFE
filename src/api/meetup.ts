import type { ConfirmMeetupRequest, ConfirmedMeetup } from "../components/ds/chat/meetup";

/**
 * 약속 확정 — 투표 완료 시 최다 득표 카페와 약속 정보를 백엔드로 보내고,
 * DB 저장 후 확정된 약속 정보를 돌려받는다.
 *
 * TODO(backend): 백엔드 엔드포인트가 준비되면 아래 mock 을 지우고 실제 호출을 사용하세요.
 *   import apiClient from "./axiosInstance";
 *   export async function confirmMeetup(req: ConfirmMeetupRequest): Promise<ConfirmedMeetup> {
 *     const { data } = await apiClient.post<ConfirmedMeetup>("/meetups/confirm", req);
 *     return data;
 *   }
 */
export async function confirmMeetup(req: ConfirmMeetupRequest): Promise<ConfirmedMeetup> {
  // --- 임시 mock: 백엔드가 저장 후 약속 정보를 그대로 반환한다고 가정 ---
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { name: req.name, date: req.date, time: req.time, place: req.place };
}
