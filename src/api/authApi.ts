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

// 참고: 백엔드에 별도의 인증코드 확인(verify) 엔드포인트는 없음.
// 인증코드 검증은 signup() 호출 시 백엔드가 한 번에 처리함.

export const signup = (data: SignupRequest) =>
  apiClient.post('/api/auth/signup', data);

export const login = (data: LoginRequest) =>
  apiClient.post('/api/auth/login', data);

export const logout = () =>
  apiClient.post('/api/auth/logout');

export const getSession = () =>
  apiClient.get('/api/auth/session');