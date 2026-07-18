import apiClient from './axiosInstance';

export interface MyPageActivity {
  meetupId: number;
  groupId: number;
  name: string;
  date: string;
  time: string;
  status: 'OPEN' | 'CONFIRMED';
}

export interface MyPageSummary {
  participatedGroupCount: number;
  aiMatchSuccessRate: number;
  monthlyActivityCount: number;
  activities: MyPageActivity[];
  appliedEvents: AppliedEvent[];
  myGroups: MyPageGroup[];
}

export interface AppliedEvent {
  eventId: number;
  title: string;
  organizer: string;
  startsAt: string;
  endsAt: string;
  location: string;
  relatedUrl: string;
  appliedAt: string;
}

export interface MyPageGroup {
  groupId: number;
  title: string;
  meetingRule: string;
  location: string;
  leader: boolean;
}

export const getMyPageSummary = (year: number, month: number) =>
  apiClient.get<MyPageSummary>('/api/mypage', { params: { year, month } });
