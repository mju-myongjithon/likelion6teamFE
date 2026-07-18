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
}

export const getMyPageSummary = (year: number, month: number) =>
  apiClient.get<MyPageSummary>('/api/mypage', { params: { year, month } });
