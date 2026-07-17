import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs';
import type { ChatMessageResponse } from './chatApi';

interface ChatSocketCallbacks {
  onConnected: () => void | Promise<void>;
  onDisconnected: () => void;
  onMessage: (message: ChatMessageResponse) => void;
  onError: (message: string) => void;
}

export class ChatSocket {
  private readonly client: Client;
  private readonly callbacks: ChatSocketCallbacks;
  private readonly desiredGroupIds = new Set<number>();
  private readonly subscriptions = new Map<number, StompSubscription>();

  constructor(callbacks: ChatSocketCallbacks) {
    this.callbacks = callbacks;
    const configured = import.meta.env.VITE_CHAT_SOCKET_URL ?? '/ws-chat';
    const socketUrl = new URL(configured, window.location.origin);
    socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
    this.client = new Client({
      brokerURL: socketUrl.toString(),
      reconnectDelay: 3_000,
      heartbeatIncoming: 10_000,
      heartbeatOutgoing: 10_000,
      onConnect: async () => {
        await this.callbacks.onConnected();
        this.syncSubscriptions();
      },
      onWebSocketClose: () => {
        this.subscriptions.clear();
        this.callbacks.onDisconnected();
      },
      onStompError: (frame) => {
        this.callbacks.onError(frame.headers.message || '채팅 연결 중 오류가 발생했습니다.');
      },
      onWebSocketError: () => {
        this.callbacks.onError('채팅 서버에 연결하지 못했습니다.');
      },
    });
  }

  activate(): void {
    this.client.activate();
  }

  async deactivate(): Promise<void> {
    this.subscriptions.clear();
    await this.client.deactivate();
  }

  setGroupIds(groupIds: number[]): void {
    this.desiredGroupIds.clear();
    groupIds.forEach((groupId) => this.desiredGroupIds.add(groupId));
    this.syncSubscriptions();
  }

  send(groupId: number, content: string): void {
    if (!this.client.connected) {
      throw new Error('채팅 서버와 연결되어 있지 않습니다.');
    }
    this.client.publish({
      destination: `/app/chat/groups/${groupId}/messages`,
      body: JSON.stringify({ content }),
    });
  }

  private syncSubscriptions(): void {
    if (!this.client.connected) return;

    for (const [groupId, subscription] of this.subscriptions) {
      if (!this.desiredGroupIds.has(groupId)) {
        subscription.unsubscribe();
        this.subscriptions.delete(groupId);
      }
    }

    for (const groupId of this.desiredGroupIds) {
      if (this.subscriptions.has(groupId)) continue;
      const subscription = this.client.subscribe(
        `/user/queue/chat/groups/${groupId}`,
        (frame) => this.handleMessage(frame),
      );
      this.subscriptions.set(groupId, subscription);
    }
  }

  private handleMessage(frame: IMessage): void {
    try {
      this.callbacks.onMessage(JSON.parse(frame.body) as ChatMessageResponse);
    } catch {
      this.callbacks.onError('서버에서 올바르지 않은 채팅 메시지를 받았습니다.');
    }
  }
}
