import apiClient from './axiosInstance';

export interface StudyListingItem {
  category: 'STUDY';
  groupId: number;
  title: string;
  location: string;
  meetingRule: string;
  maxMemberCount: number;
  currentMemberCount: number;
  createdAt: string;
}

export interface HackathonListingItem {
  category: 'HACKATHON';
  eventId: number;
  title: string;
  applicationDeadlineAt: string;
  startsAt: string;
  location: string;
  posterUrl: string | null;
  createdAt: string;
}

export type ListingItem = StudyListingItem | HackathonListingItem;

export const getListings = () =>
  apiClient.get<ListingItem[]>('/api/listings');
