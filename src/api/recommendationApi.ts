import apiClient from './axiosInstance';

export type RecommendationCategory = 'STUDY' | 'HACKATHON';
export type RecommendationMode = 'HYBRID' | 'RULE_FALLBACK';

export interface RecommendationItem {
  category: RecommendationCategory;
  targetId: number;
  title: string;
  location: string;
  score: number;
  ruleScore: number;
  aiScore: number | null;
  mode: RecommendationMode;
  reasons: string[];
}

export const getRecommendations = (limit = 20, signal?: AbortSignal) =>
  apiClient.get<RecommendationItem[]>('/api/recommendations', {
    params: { filter: 'ALL', limit },
    signal,
  });
