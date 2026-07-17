import apiClient from './axiosInstance';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface ApplicationGroupSummary {
  groupId: number;
  title: string;
  leaderUserId: number;
  leaderName: string | null;
  leaderAvatarUrl: string | null;
  category: 'STUDY';
  groupStatus: 'RECRUITING' | 'CLOSED';
  meetingRule: string;
  location: string;
  currentMemberCount: number;
  maxMemberCount: number;
}

export interface MyApplicationResponse {
  applicationId: number;
  status: ApplicationStatus;
  requestedAt: string;
  decidedAt?: string;
  isCurrentMember: boolean;
  group: ApplicationGroupSummary;
}

export interface MyApplicationPageResponse {
  content: MyApplicationResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface GetMyApplicationsParams {
  status?: ApplicationStatus;
  page?: number;
  size?: number;
}

/** 내 참가 신청 내역 조회 (상태 필터 + 페이지) */
export const getMyApplications = (params: GetMyApplicationsParams = {}) =>
  apiClient.get<MyApplicationPageResponse>('/api/group-applications/me', { params });

/** 대기 중인 참가 신청 취소 */
export const cancelMyApplication = (applicationId: string | number) =>
  apiClient.post<void>(`/api/group-applications/${applicationId}/cancel`);
