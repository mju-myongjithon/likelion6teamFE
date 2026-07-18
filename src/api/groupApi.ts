import apiClient from './axiosInstance';

export interface RecruitingRole {
  role: string;
  skill: string;
}

export interface GroupDetail {
  groupId: number;
  leaderUserId: number;
  eventId?: number;
  eventTitle?: string;
  title: string;
  category: 'STUDY';
  status: 'RECRUITING' | 'CLOSED';
  description: string;
  maxMemberCount: number;
  meetingRule: string;
  location: string;
  currentMemberCount: number;
  recruitingRoles: RecruitingRole[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupSummary {
  groupId: number;
  eventId?: number;
  eventTitle?: string;
  title: string;
  category: 'STUDY';
  status: 'RECRUITING' | 'CLOSED';
  location: string;
  meetingRule: string;
  maxMemberCount: number;
  currentMemberCount: number;
  createdAt: string;
}

export interface MyGroupResponse extends GroupSummary {
  role: 'LEADER' | 'MEMBER';
}

export interface MemberResponse {
  userId: number;
  name?: string | null;
  role: 'LEADER' | 'MEMBER';
  joinedAt: string;
}

export interface RecruitingRoleRequest {
  role: string;
  skill?: string | null;
}

/** 스터디 모임 등록/수정 요청 바디 (POST /api/groups, PUT /api/groups/{groupId}) */
export interface GroupRequest {
  eventId?: number | null;
  title: string;
  description: string;
  maxMemberCount: number;
  meetingRule: string;
  location: string;
  recruitingRoles: RecruitingRoleRequest[];
}

export const getGroupDetail = (groupId: string | number) =>
  apiClient.get<GroupDetail>(`/api/groups/${groupId}`);

/** 스터디 모임 목록 조회 (공개, 최신 등록순) */
export const getGroups = () =>
  apiClient.get<GroupSummary[]>('/api/groups');

/** 내 모임 목록 조회 (리더이거나 승인된 참여자인 모임) */
export const getMyGroups = () =>
  apiClient.get<MyGroupResponse[]>('/api/groups/me');

/** 스터디 모임 등록 — 세션 사용자가 리더가 됨 */
export const createGroup = (data: GroupRequest) =>
  apiClient.post<GroupDetail>('/api/groups', data);

/** 스터디 모임 전체 수정 — 리더만 가능 */
export const updateGroup = (groupId: string | number, data: GroupRequest) =>
  apiClient.put<GroupDetail>(`/api/groups/${groupId}`, data);

/** 스터디 모임 삭제 — 리더만 가능 */
export const deleteGroup = (groupId: string | number) =>
  apiClient.delete<void>(`/api/groups/${groupId}`);

/** 모임 참여자 조회 — 모임 참여자만 조회 가능 (이름은 구버전 API 호환을 위해 선택값) */
export const getGroupMembers = (groupId: string | number) =>
  apiClient.get<MemberResponse[]>(`/api/groups/${groupId}/members`);

export interface ApplicationResponse {
  applicationId: number;
  groupId: number;
  applicantUserId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  requestedAt: string;
  decidedAt?: string;
}

export interface CafeLocation {
  placeName: string;
  latitude: number;
  longitude: number;
}

export interface CafeDetail {
  address: string | null;
  phone: string | null;
  parkingAvailable: boolean | null;
  parkingInfo: string | null;
}

export interface CafeRecommendation {
  rank: number;
  location: CafeLocation;
  detail: CafeDetail;
  reason: string;
}

export interface CafeRecommendationResponse {
  recommendations: CafeRecommendation[];
}

/** 모임 참가 신청 */
export const applyToGroup = (groupId: string | number) =>
  apiClient.post<ApplicationResponse>(`/api/groups/${groupId}/applications`);

/** 대기 중인 참가 신청 조회 — 모임 리더만 가능 */
export const getGroupApplications = (groupId: string | number) =>
  apiClient.get<ApplicationResponse[]>(`/api/groups/${groupId}/applications`);

/** 내 참가 신청 조회 (해당 모임 기준) */
export const getMyApplicationForGroup = (groupId: string | number) =>
  apiClient.get<ApplicationResponse>(`/api/groups/${groupId}/applications/me`);

/** 참가 신청 승인 — 모임 리더만 가능 */
export const approveApplication = (groupId: string | number, applicationId: string | number) =>
  apiClient.post<void>(`/api/groups/${groupId}/applications/${applicationId}/approve`);

/** 참가 신청 거절 — 모임 리더만 가능 */
export const rejectApplication = (groupId: string | number, applicationId: string | number) =>
  apiClient.post<void>(`/api/groups/${groupId}/applications/${applicationId}/reject`);

/** 모임 탈퇴 */
export const leaveGroup = (groupId: string | number) =>
  apiClient.post<void>(`/api/groups/${groupId}/leave`);

/** 모임 참여자 강퇴 — 모임 리더만 가능 */
export const removeMember = (groupId: string | number, memberUserId: string | number) =>
  apiClient.delete<void>(`/api/groups/${groupId}/members/${memberUserId}`);

/** 리더 권한 양도 — 현재 리더만 가능 */
export const transferLeadership = (groupId: string | number, newLeaderUserId: number) =>
  apiClient.post<void>(`/api/groups/${groupId}/transfer-leader`, { newLeaderUserId });

/** 모임 모집 마감 — 모임 리더만 가능 */
export const closeRecruitment = (groupId: string | number) =>
  apiClient.post<void>(`/api/groups/${groupId}/close`);

/** 모임 모집 재개 — 모임 리더만 가능 */
export const reopenRecruitment = (groupId: string | number) =>
  apiClient.post<void>(`/api/groups/${groupId}/reopen`);

/** 모임 멤버 기반 공동 카페 추천 — 모임 멤버만 가능 */
export const recommendGroupCafes = (groupId: string | number) =>
  apiClient.post<CafeRecommendationResponse>(`/api/groups/${groupId}/cafes/recommendations`);
