import apiClient from './axiosInstance';

export interface ProfileResponse {
  userId: number;
  name: string;
  schoolName: string;
  departmentName: string;
  residenceArea: string;
  bio?: string;
  avatarUrl?: string;
  interests: string[];
  purposes: string[];
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  name: string;
  schoolName: string;
  departmentName: string;
  residenceArea: string;
  bio?: string;
  avatarUrl?: string;
  interests: string[];
  purposes: string[];
  roles: string[];
}

export const getMyProfile = () =>
  apiClient.get<ProfileResponse>('/api/profile');

export const updateMyProfile = (data: ProfileUpdateRequest) =>
  apiClient.put<ProfileResponse>('/api/profile', data);