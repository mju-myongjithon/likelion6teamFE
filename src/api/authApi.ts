import apiClient from './axiosInstance';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SessionResponse {
  userId: number;
  email: string;
}

export interface SignupProfile {
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

export interface SignupRequest {
  email: string;
  verificationCode: string;
  password: string;
  profile: SignupProfile;
}

export const sendVerificationCode = (email: string) =>
  apiClient.post('/api/auth/email-verifications', { email });

export const verifyCode = (email: string, verificationCode: string) =>
  apiClient.post('/api/auth/email-verifications/verify', { email, verificationCode });

export const signup = (data: SignupRequest) =>
  apiClient.post('/api/auth/signup', data);

export const login = (data: LoginRequest) =>
  apiClient.post('/api/auth/login', data);

export const logout = () =>
  apiClient.post('/api/auth/logout');

export const getSession = () =>
  apiClient.get<SessionResponse>('/api/auth/session');
