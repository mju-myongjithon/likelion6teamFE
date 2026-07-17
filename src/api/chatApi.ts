import apiClient from './axiosInstance';

export interface ChatRoomSummary {
  groupId: number;
  title: string;
  memberCount: number;
  lastMessageId: number | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface ChatMessageResponse {
  messageId: number;
  groupId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessageResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

export const getChatRooms = () =>
  apiClient.get<ChatRoomSummary[]>('/api/chat/rooms');

export const getChatMessages = (groupId: number, before?: number, size = 50, signal?: AbortSignal) =>
  apiClient.get<ChatHistoryResponse>(`/api/chat/groups/${groupId}/messages`, {
    params: { before, size },
    signal,
  });

export const markChatRead = (groupId: number, messageId: number) =>
  apiClient.post<void>(`/api/chat/groups/${groupId}/read`, { messageId });
