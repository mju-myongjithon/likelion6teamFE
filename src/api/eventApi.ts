import apiClient from './axiosInstance';

export interface EventDetail {
  eventId: number;
  creatorUserId: number;
  title: string;
  category: 'HACKATHON';
  description: string;
  organizer: string;
  applicationDeadlineAt: string;
  startsAt: string;
  endsAt: string;
  location: string;
  relatedUrl: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventRequest {
  title: string;
  description: string;
  organizer: string;
  applicationDeadlineAt: string;
  startsAt: string;
  endsAt: string;
  location: string;
  relatedUrl: string;
  tags: string[];
}

export const getEventDetail = (eventId: string | number) =>
  apiClient.get<EventDetail>(`/api/events/${eventId}`);

/** 해커톤·행사 등록 (세션 사용자가 등록자가 됨) */
export const createEvent = (data: EventRequest) =>
  apiClient.post<EventDetail>('/api/events', data);

/** 해커톤·행사 전체 수정 (등록자만 가능) */
export const updateEvent = (eventId: string | number, data: EventRequest) =>
  apiClient.put<EventDetail>(`/api/events/${eventId}`, data);

/** 해커톤·행사 삭제 (등록자만 가능) */
export const deleteEvent = (eventId: string | number) =>
  apiClient.delete<void>(`/api/events/${eventId}`);