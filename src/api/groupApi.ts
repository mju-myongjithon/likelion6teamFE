import apiClient from './axiosInstance';

export interface RecruitingRole {
  role: string;
  skill: string;
}

export interface GroupDetail {
  groupId: number;
  leaderUserId: number;
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

export const getGroupDetail = (groupId: string | number) =>
  apiClient.get<GroupDetail>(`/api/groups/${groupId}`);