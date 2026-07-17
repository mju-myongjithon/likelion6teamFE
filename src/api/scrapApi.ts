import apiClient from './axiosInstance';

export interface StudyScrapItem {
  category: 'STUDY';
  groupId: number;
  title: string;
  leaderUserId: number;
  leaderName: string | null;
  leaderAvatarUrl: string | null;
  location: string;
  meetingRule: string;
  maxMemberCount: number;
  currentMemberCount: number;
  scrappedAt: string;
}

export interface EventScrapItem {
  category: 'HACKATHON';
  eventId: number;
  title: string;
  organizer: string;
  applicationDeadlineAt: string;
  startsAt: string;
  endsAt: string;
  location: string;
  scrappedAt: string;
}

export type ScrapItem = StudyScrapItem | EventScrapItem;

/** 내 통합 저장 목록 조회 (최근 저장순) */
export const getMyScraps = () =>
  apiClient.get<ScrapItem[]>('/api/scraps/me');

/** 스터디 모임 저장 */
export const saveGroupScrap = (groupId: string | number) =>
  apiClient.put<void>(`/api/scraps/groups/${groupId}`);

/** 스터디 모임 저장 해제 */
export const removeGroupScrap = (groupId: string | number) =>
  apiClient.delete<void>(`/api/scraps/groups/${groupId}`);

/** 해커톤·행사 저장 */
export const saveEventScrap = (eventId: string | number) =>
  apiClient.put<void>(`/api/scraps/events/${eventId}`);

/** 해커톤·행사 저장 해제 */
export const removeEventScrap = (eventId: string | number) =>
  apiClient.delete<void>(`/api/scraps/events/${eventId}`);
