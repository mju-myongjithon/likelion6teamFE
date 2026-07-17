import apiClient from './axiosInstance';

export interface GroupInquiryAnswerResponse {
  content: string;
  answeredAt: string;
}

export interface GroupInquiryResponse {
  inquiryId: number;
  content: string;
  createdAt: string;
  answer?: GroupInquiryAnswerResponse;
  canDelete: boolean;
  canAnswer: boolean;
}

export interface GroupInquiryPageResponse {
  content: GroupInquiryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** 모임 문의 목록 조회 (공개, 최신순) */
export const getGroupInquiries = (groupId: string | number, page = 0, size = 5) =>
  apiClient.get<GroupInquiryPageResponse>(`/api/groups/${groupId}/inquiries`, { params: { page, size } });

/** 모임 문의 등록 */
export const createGroupInquiry = (groupId: string | number, content: string) =>
  apiClient.post<GroupInquiryResponse>(`/api/groups/${groupId}/inquiries`, { content });

/** 모임 문의 답변 — 모임 리더만 가능, 문의당 답변 1개 */
export const answerGroupInquiry = (groupId: string | number, inquiryId: string | number, content: string) =>
  apiClient.post<GroupInquiryResponse>(`/api/groups/${groupId}/inquiries/${inquiryId}/answer`, { content });

/** 모임 문의 삭제 — 작성자만 가능 */
export const deleteGroupInquiry = (groupId: string | number, inquiryId: string | number) =>
  apiClient.delete<void>(`/api/groups/${groupId}/inquiries/${inquiryId}`);
