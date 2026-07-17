import apiClient from './axiosInstance';

export type MeetupStatus = 'OPEN' | 'CONFIRMED';
export type PlaceMode = 'MIDPOINT' | 'CUSTOM';

export interface MeetupOption {
  optionId: number;
  rank: number;
  placeName: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  phone: string | null;
  reason: string | null;
  voteCount: number;
}

export interface Meetup {
  meetupId: number;
  groupId: number;
  creatorUserId: number;
  canManage: boolean;
  name: string;
  meetingDate: string;
  meetingTime: string;
  status: MeetupStatus;
  confirmedOptionId: number | null;
  selectedOptionId: number | null;
  options: MeetupOption[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetupRequest {
  name: string;
  meetingDate: string;
  meetingTime: string;
  placeMode: PlaceMode;
  customAddress?: string;
}

export const getMeetups = (groupId: number) =>
  apiClient.get<Meetup[]>(`/api/groups/${groupId}/meetups`);

export const createMeetup = (groupId: number, request: CreateMeetupRequest) =>
  apiClient.post<Meetup>(`/api/groups/${groupId}/meetups`, request);

export const voteMeetupOption = (groupId: number, meetupId: number, optionId: number) =>
  apiClient.put<Meetup>(`/api/groups/${groupId}/meetups/${meetupId}/votes/${optionId}`);

export const cancelMeetupVote = (groupId: number, meetupId: number) =>
  apiClient.delete<Meetup>(`/api/groups/${groupId}/meetups/${meetupId}/votes/me`);

export const confirmMeetup = (groupId: number, meetupId: number) =>
  apiClient.post<Meetup>(`/api/groups/${groupId}/meetups/${meetupId}/confirm`);

export const cancelMeetup = (groupId: number, meetupId: number) =>
  apiClient.delete<void>(`/api/groups/${groupId}/meetups/${meetupId}`);
