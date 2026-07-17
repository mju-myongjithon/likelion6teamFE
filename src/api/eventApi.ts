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

export const getEventDetail = (eventId: string | number) =>
  apiClient.get<EventDetail>(`/api/events/${eventId}`);