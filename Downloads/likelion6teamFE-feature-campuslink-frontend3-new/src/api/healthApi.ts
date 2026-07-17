import apiClient from './axiosInstance';

export const getHealth = () => apiClient.get('/api/health');