import apiClient from './axiosInstance';

export interface LoginRequest {
  email: string;
  password: string;
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

// 인증코드 확인용 별도 엔드포인트는 백엔드에 없다. 코드는 회원가입(signup) 시 함께 검증된다.

export const signup = (data: SignupRequest) =>
  apiClient.post('/api/auth/signup', data);

export const login = (data: LoginRequest) =>
  apiClient.post('/api/auth/login', data);

export const logout = () =>
  apiClient.post('/api/auth/logout');

export const getSession = () =>
  apiClient.get('/api/auth/session');