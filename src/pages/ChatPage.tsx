import axios from "axios";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getSession } from "../api/authApi";
import {
  getChatMessages,
  getChatRooms,
  markChatRead,
  type ChatMessageResponse,
  type ChatRoomSummary,
} from "../api/chatApi";
import { ChatSocket } from "../api/chatSocket";
import {
  cancelMeetup,
  cancelMeetupVote,
  confirmMeetup,
  createMeetup,
  getMeetups,
  voteMeetupOption,
  type CreateMeetupRequest,
  type Meetup,
} from "../api/meetupApi";
import { Button } from "../components/ds/actions/Button";
import { ChatMessage } from "../components/ds/chat/ChatMessage";
import { ChatThreadItem } from "../components/ds/chat/ChatThreadItem";
import { ConfirmedMeetupCard } from "../components/ds/chat/ConfirmedMeetupCard";
import { MeetupModal } from "../components/ds/chat/MeetupModal";
import { MeetupVoteCard } from "../components/ds/chat/MeetupVoteCard";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Badge } from "../components/ds/display/Badge";
import { Callout } from "../components/ds/feedback/Callout";
import { Input } from "../components/ds/forms/Input";
import { Icon } from "../components/ds/foundations/Icon";
import { AppShell } from "../layouts/AppShell";

const HISTORY_SIZE = 50;
const READ_DEBOUNCE_MS = 500;
const AVATAR_TONES: AvatarTone[] = ["violet", "pink", "emerald", "orange", "neutral"];
const MEETUP_MARKER = /^\[\[MEETUP:(\d+)]]$/;

interface ReadProgress {
  sent: number;
  pending: number;
  timer: number | null;
}

function mergeMessages(...groups: ChatMessageResponse[][]): ChatMessageResponse[] {
  const byId = new Map<number, ChatMessageResponse>();
  groups.flat().forEach((message) => byId.set(message.messageId, message));
  return [...byId.values()].sort((a, b) => a.messageId - b.messageId);
}

function sortRooms(rooms: ChatRoomSummary[]): ChatRoomSummary[] {
  return [...rooms].sort((a, b) => {
    const timeDifference = (b.lastMessageAt ? Date.parse(b.lastMessageAt) : 0)
      - (a.lastMessageAt ? Date.parse(a.lastMessageAt) : 0);
    return timeDifference || b.groupId - a.groupId;
  });
}

function mergeRoomRefresh(
  current: ChatRoomSummary[],
  refreshed: ChatRoomSummary[],
): ChatRoomSummary[] {
  const currentById = new Map(current.map((room) => [room.groupId, room]));
  return sortRooms(refreshed.map((room) => {
    const existing = currentById.get(room.groupId);
    if (
      existing?.lastMessageId !== null
      && existing?.lastMessageId !== undefined
      && (room.lastMessageId === null || existing.lastMessageId > room.lastMessageId)
    ) {
      return existing;
    }
    return room;
  }));
}

function formatThreadTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(date);
  }
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(date);
}

function formatMessageTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" })
    .format(new Date(value));
}

function formatMessageDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(value));
}

function dateKey(value: string): string {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function senderTone(senderId: number): AvatarTone {
  return AVATAR_TONES[Math.abs(senderId) % AVATAR_TONES.length];
}

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

function meetupMarkerId(content: string): number | null {
  const match = MEETUP_MARKER.exec(content);
  return match ? Number(match[1]) : null;
}

function chatPreview(content: string | null): string {
  if (!content) return "아직 메시지가 없습니다.";
  return meetupMarkerId(content) === null ? content : "새 약속 장소 투표가 생성됐어요.";
}

/** 모임 전용 실시간 채팅 화면. */
export function ChatPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = React.useState<ChatRoomSummary[]>([]);
  const [activeGroupId, setActiveGroupId] = React.useState<number | null>(null);
  const [messages, setMessages] = React.useState<ChatMessageResponse[]>([]);
  const [nextCursor, setNextCursor] = React.useState<number | null>(null);
  const [hasNext, setHasNext] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [loadingRooms, setLoadingRooms] = React.useState(true);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [loadingOlder, setLoadingOlder] = React.useState(false);
  const [roomsError, setRoomsError] = React.useState<string | null>(null);
  const [messagesError, setMessagesError] = React.useState<string | null>(null);
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [connected, setConnected] = React.useState(false);
  const [meetups, setMeetups] = React.useState<Meetup[]>([]);
  const [meetupModalOpen, setMeetupModalOpen] = React.useState(false);
  const [meetupLoading, setMeetupLoading] = React.useState(false);
  const [meetupError, setMeetupError] = React.useState<string | null>(null);

  const socketRef = React.useRef<ChatSocket | null>(null);
  const activeGroupIdRef = React.useRef<number | null>(null);
  const messagesRef = React.useRef<ChatMessageResponse[]>([]);
  const currentUserIdRef = React.useRef<number | null>(null);
  const latestMessageIdByGroupRef = React.useRef(new Map<number, number>());
  const requestedGroupIdRef = React.useRef(Number(searchParams.get("groupId")));
  const historyGenerationRef = React.useRef(0);
  const historyAbortRef = React.useRef<AbortController | null>(null);
  const readProgressRef = React.useRef(new Map<number, ReadProgress>());
  const flushReadRef = React.useRef<(groupId: number) => void>(() => undefined);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const previousLastMessageIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    activeGroupIdRef.current = activeGroupId;
  }, [activeGroupId]);

  React.useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  React.useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  const stopForUnauthorized = React.useCallback((error: unknown): boolean => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) return false;
    void socketRef.current?.deactivate();
    navigate("/login", { replace: true });
    return true;
  }, [navigate]);

  const refreshMeetups = React.useCallback(async (groupId: number): Promise<void> => {
    try {
      const response = await getMeetups(groupId);
      if (activeGroupIdRef.current === groupId) {
        setMeetups(response.data);
        setMeetupError(null);
      }
    } catch (error) {
      if (!stopForUnauthorized(error) && activeGroupIdRef.current === groupId) {
        setMeetupError(errorMessage(error, "약속 정보를 불러오지 못했습니다."));
      }
    }
  }, [stopForUnauthorized]);

  const flushRead = React.useCallback((groupId: number): void => {
    const progress = readProgressRef.current.get(groupId);
    if (!progress) return;
    if (progress.timer !== null) {
      window.clearTimeout(progress.timer);
      progress.timer = null;
    }
    const messageId = progress.pending;
    if (messageId <= progress.sent) return;
    const previousSent = progress.sent;
    progress.sent = messageId;

    void markChatRead(groupId, messageId)
      .then(() => {
        setRooms((current) => current.map((room) => (
          room.groupId === groupId
            && (latestMessageIdByGroupRef.current.get(groupId) ?? messageId) <= messageId
            ? { ...room, unreadCount: 0 }
            : room
        )));
      })
      .catch((error) => {
        if (progress.sent === messageId) progress.sent = previousSent;
        if (!stopForUnauthorized(error)) {
          setMessagesError(errorMessage(error, "읽음 상태를 저장하지 못했습니다."));
          if (progress.pending > progress.sent && progress.timer === null) {
            progress.timer = window.setTimeout(
              () => flushReadRef.current(groupId),
              READ_DEBOUNCE_MS,
            );
          }
        }
      });
  }, [stopForUnauthorized]);

  React.useEffect(() => {
    flushReadRef.current = flushRead;
  }, [flushRead]);

  const scheduleRead = React.useCallback((groupId: number, messageId: number): void => {
    if (document.visibilityState !== "visible") return;
    const progress = readProgressRef.current.get(groupId) ?? {
      sent: 0,
      pending: 0,
      timer: null,
    };
    progress.pending = Math.max(progress.pending, messageId);
    if (progress.pending <= progress.sent) return;
    if (progress.timer !== null) window.clearTimeout(progress.timer);
    progress.timer = window.setTimeout(() => flushRead(groupId), READ_DEBOUNCE_MS);
    readProgressRef.current.set(groupId, progress);
  }, [flushRead]);

  const refreshRooms = React.useCallback(async (): Promise<ChatRoomSummary[] | null> => {
    try {
      const response = await getChatRooms();
      const nextRooms = response.data;
      setRooms((current) => mergeRoomRefresh(current, nextRooms));
      setRoomsError(null);
      return nextRooms;
    } catch (error) {
      if (!stopForUnauthorized(error)) {
        setRoomsError(errorMessage(error, "채팅방 목록을 불러오지 못했습니다."));
      }
      return null;
    } finally {
      setLoadingRooms(false);
    }
  }, [stopForUnauthorized]);

  const loadLatest = React.useCallback(async (groupId: number): Promise<void> => {
    const generation = ++historyGenerationRef.current;
    historyAbortRef.current?.abort();
    const controller = new AbortController();
    historyAbortRef.current = controller;
    setLoadingMessages(true);
    setMessagesError(null);
    try {
      const response = await getChatMessages(groupId, undefined, HISTORY_SIZE, controller.signal);
      if (generation !== historyGenerationRef.current || activeGroupIdRef.current !== groupId) return;
      setMessages((current) => mergeMessages(current, response.data.messages));
      setNextCursor(response.data.nextCursor);
      setHasNext(response.data.hasNext);
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (generation === historyGenerationRef.current && !stopForUnauthorized(error)) {
        setMessagesError(errorMessage(error, "메시지를 불러오지 못했습니다."));
      }
    } finally {
      if (generation === historyGenerationRef.current) setLoadingMessages(false);
    }
  }, [stopForUnauthorized]);

  const resyncMessages = React.useCallback(async (groupId: number): Promise<void> => {
    const generation = ++historyGenerationRef.current;
    historyAbortRef.current?.abort();
    const controller = new AbortController();
    historyAbortRef.current = controller;
    setLoadingMessages(true);
    const knownHighest = messagesRef.current.at(-1)?.messageId ?? null;
    let cursor: number | undefined;
    let recovered: ChatMessageResponse[] = [];
    let finalCursor: number | null | undefined;
    let more: boolean | undefined;

    try {
      do {
        const response = await getChatMessages(groupId, cursor, HISTORY_SIZE, controller.signal);
        recovered = mergeMessages(recovered, response.data.messages);
        finalCursor = response.data.nextCursor;
        more = response.data.hasNext;
        const reachedKnownMessage = knownHighest !== null
          && response.data.messages.some((message) => message.messageId <= knownHighest);
        if (knownHighest === null || reachedKnownMessage || !more || finalCursor === null) break;
        cursor = finalCursor;
      } while (generation === historyGenerationRef.current);

      if (generation !== historyGenerationRef.current || activeGroupIdRef.current !== groupId) return;
      setMessages((current) => mergeMessages(current, recovered));
      setNextCursor(finalCursor ?? null);
      setHasNext(more ?? false);
      setMessagesError(null);
    } catch (error) {
      if (axios.isCancel(error)) return;
      if (generation === historyGenerationRef.current && !stopForUnauthorized(error)) {
        setMessagesError(errorMessage(error, "재연결 후 메시지를 동기화하지 못했습니다."));
      }
    } finally {
      if (generation === historyGenerationRef.current) setLoadingMessages(false);
    }
  }, [stopForUnauthorized]);

  const loadOlder = React.useCallback(async (): Promise<void> => {
    const groupId = activeGroupIdRef.current;
    if (groupId === null || nextCursor === null || loadingOlder) return;
    const generation = historyGenerationRef.current;
    setLoadingOlder(true);
    try {
      const response = await getChatMessages(groupId, nextCursor, HISTORY_SIZE);
      if (generation !== historyGenerationRef.current || activeGroupIdRef.current !== groupId) return;
      setMessages((current) => mergeMessages(response.data.messages, current));
      setNextCursor(response.data.nextCursor);
      setHasNext(response.data.hasNext);
    } catch (error) {
      if (!stopForUnauthorized(error)) {
        setMessagesError(errorMessage(error, "이전 메시지를 불러오지 못했습니다."));
      }
    } finally {
      if (generation === historyGenerationRef.current) setLoadingOlder(false);
    }
  }, [loadingOlder, nextCursor, stopForUnauthorized]);

  React.useEffect(() => {
    let cancelled = false;
    // The async callbacks below own the state updates; invoking the loaders is the effect's external sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void Promise.all([getSession(), refreshRooms()])
      .then(([sessionResponse, fetchedRooms]) => {
        if (cancelled) return;
        setCurrentUserId(sessionResponse.data.userId);
        const requestedId = requestedGroupIdRef.current;
        const requestedRoom = fetchedRooms?.find((room) => room.groupId === requestedId);
        setActiveGroupId(requestedRoom?.groupId ?? fetchedRooms?.[0]?.groupId ?? null);
      })
      .catch((error) => {
        if (!stopForUnauthorized(error)) {
          setRoomsError(errorMessage(error, "로그인 정보를 확인하지 못했습니다."));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshRooms, stopForUnauthorized]);

  React.useEffect(() => {
    const socket = new ChatSocket({
      onConnected: async () => {
        setConnected(true);
        setSendError(null);
        const refreshedRooms = await refreshRooms();
        socket.setGroupIds(refreshedRooms?.map((room) => room.groupId) ?? []);
        const groupId = activeGroupIdRef.current;
        const stillAvailable = groupId !== null
          && refreshedRooms?.some((room) => room.groupId === groupId);
        if (groupId !== null && stillAvailable) {
          void resyncMessages(groupId);
        } else if (groupId !== null) {
          historyAbortRef.current?.abort();
          historyGenerationRef.current += 1;
          setMessages([]);
          setNextCursor(null);
          setHasNext(false);
          setActiveGroupId(refreshedRooms?.[0]?.groupId ?? null);
        }
      },
      onDisconnected: () => setConnected(false),
      onMessage: (message) => {
        latestMessageIdByGroupRef.current.set(
          message.groupId,
          Math.max(latestMessageIdByGroupRef.current.get(message.groupId) ?? 0, message.messageId),
        );
        setRooms((current) => sortRooms(current.map((room) => {
          if (room.groupId !== message.groupId) return room;
          const active = activeGroupIdRef.current === message.groupId
            && document.visibilityState === "visible";
          const sentByCurrentUser = message.senderId === currentUserIdRef.current;
          return {
            ...room,
            lastMessageId: message.messageId,
            lastMessage: chatPreview(message.content),
            lastMessageAt: message.createdAt,
            unreadCount: active || sentByCurrentUser ? room.unreadCount : room.unreadCount + 1,
          };
        })));
        if (activeGroupIdRef.current === message.groupId) {
          setMessages((current) => mergeMessages(current, [message]));
          if (meetupMarkerId(message.content) !== null) void refreshMeetups(message.groupId);
        }
      },
      onError: (message) => {
        setConnected(false);
        setSendError(message);
        if (message.includes("로그인")) {
          void socket.deactivate();
          navigate("/login", { replace: true });
        }
      },
    });
    socketRef.current = socket;
    socket.activate();

    return () => {
      const groupId = activeGroupIdRef.current;
      if (groupId !== null) flushRead(groupId);
      historyAbortRef.current?.abort();
      void socket.deactivate();
      socketRef.current = null;
    };
  }, [flushRead, navigate, refreshMeetups, refreshRooms, resyncMessages]);

  React.useEffect(() => {
    socketRef.current?.setGroupIds(rooms.map((room) => room.groupId));
  }, [rooms]);

  React.useEffect(() => {
    if (activeGroupId === null) return;
    setSearchParams((current) => {
      if (Number(current.get("groupId")) === activeGroupId) return current;
      const next = new URLSearchParams(current);
      next.set("groupId", String(activeGroupId));
      return next;
    }, { replace: true });
    // The selected room is the external resource this effect synchronizes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadLatest(activeGroupId);
    void refreshMeetups(activeGroupId);
    const meetupRefresh = window.setInterval(() => void refreshMeetups(activeGroupId), 5_000);
    return () => {
      window.clearInterval(meetupRefresh);
      flushRead(activeGroupId);
    };
  }, [activeGroupId, flushRead, loadLatest, refreshMeetups, setSearchParams]);

  React.useEffect(() => {
    if (activeGroupId === null || messages.length === 0) return;
    const latestMessageId = messages[messages.length - 1].messageId;
    latestMessageIdByGroupRef.current.set(
      activeGroupId,
      Math.max(latestMessageIdByGroupRef.current.get(activeGroupId) ?? 0, latestMessageId),
    );
    scheduleRead(activeGroupId, latestMessageId);
  }, [activeGroupId, messages, scheduleRead]);

  React.useEffect(() => {
    const onVisibilityChange = () => {
      const groupId = activeGroupIdRef.current;
      if (groupId === null) return;
      if (document.visibilityState !== "visible") {
        flushRead(groupId);
        return;
      }
      const messageId = messagesRef.current.at(-1)?.messageId;
      if (messageId !== undefined) scheduleRead(groupId, messageId);
    };
    const onPageHide = () => {
      const groupId = activeGroupIdRef.current;
      const progress = groupId === null ? null : readProgressRef.current.get(groupId);
      if (groupId === null || !progress || progress.pending < 1) return;
      void fetch(`/api/chat/groups/${groupId}/read`, {
        method: "POST",
        credentials: "include",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: progress.pending }),
      });
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [flushRead, scheduleRead]);

  React.useEffect(() => {
    const lastMessageId = messages.at(-1)?.messageId ?? null;
    if (lastMessageId !== null && lastMessageId !== previousLastMessageIdRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    previousLastMessageIdRef.current = lastMessageId;
  }, [messages]);

  const activeRoom = rooms.find((room) => room.groupId === activeGroupId) ?? null;
  const filteredRooms = rooms.filter((room) =>
    room.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));

  const selectRoom = (groupId: number): void => {
    if (groupId === activeGroupId) return;
    if (activeGroupId !== null) flushRead(activeGroupId);
    historyAbortRef.current?.abort();
    historyGenerationRef.current += 1;
    setMessages([]);
    setNextCursor(null);
    setHasNext(false);
    setMessagesError(null);
    setActiveGroupId(groupId);
    setSendError(null);
  };

  const sendMessage = (): void => {
    if (activeGroupId === null) return;
    const content = draft.trim();
    if (!content) return;
    if (content.length > 2000) {
      setSendError("메시지는 2000자까지 입력할 수 있습니다.");
      return;
    }
    try {
      socketRef.current?.send(activeGroupId, content);
      setDraft("");
      setSendError(null);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "메시지를 전송하지 못했습니다.");
    }
  };

  const createRoomMeetup = async (request: CreateMeetupRequest): Promise<void> => {
    if (activeGroupId === null) return;
    setMeetupLoading(true);
    setMeetupError(null);
    try {
      const response = await createMeetup(activeGroupId, request);
      setMeetups((current) => [...current.filter((meetup) => meetup.meetupId !== response.data.meetupId), response.data]);
      setMeetupModalOpen(false);
    } catch (error) {
      setMeetupError(errorMessage(error, "약속을 만들지 못했습니다."));
    } finally {
      setMeetupLoading(false);
    }
  };

  const updateMeetup = (updated: Meetup): void => {
    setMeetups((current) => current.map((meetup) => meetup.meetupId === updated.meetupId ? updated : meetup));
  };

  const runMeetupAction = async (action: () => Promise<{ data: Meetup }>): Promise<void> => {
    setMeetupLoading(true);
    setMeetupError(null);
    try {
      updateMeetup((await action()).data);
    } catch (error) {
      setMeetupError(errorMessage(error, "약속 상태를 변경하지 못했습니다."));
    } finally {
      setMeetupLoading(false);
    }
  };

  const removeMeetup = async (meetupId: number): Promise<void> => {
    if (activeGroupId === null) return;
    setMeetupLoading(true);
    setMeetupError(null);
    try {
      await cancelMeetup(activeGroupId, meetupId);
      setMeetups((current) => current.filter((meetup) => meetup.meetupId !== meetupId));
    } catch (error) {
      setMeetupError(errorMessage(error, "약속을 취소하지 못했습니다."));
    } finally {
      setMeetupLoading(false);
    }
  };

  return (
    <AppShell>
      <div style={{ display: "flex", height: "100%", minHeight: 640 }}>
        <div style={{ width: 300, flexShrink: 0, borderRight: "1px solid var(--hairline)", display: "flex", flexDirection: "column", background: "var(--canvas)" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--hairline-soft)" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-sm)" }}>채팅</div>
            <Input
              placeholder="모임 검색"
              iconLeft={<Icon name="search" size={16} />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-xs)" }}>
            {loadingRooms && (
              <div style={{ padding: 20, fontSize: 13, color: "var(--muted)" }}>채팅방을 불러오는 중...</div>
            )}
            {!loadingRooms && roomsError && (
              <div style={{ padding: 12 }}>
                <Callout tone="danger">{roomsError}</Callout>
                <Button variant="secondary" size="sm" fullWidth style={{ marginTop: 10 }} onClick={() => void refreshRooms()}>
                  다시 시도
                </Button>
              </div>
            )}
            {!loadingRooms && !roomsError && rooms.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, lineHeight: 1.6, color: "var(--muted)" }}>
                참여 중인 모임의 채팅방이 아직 없습니다.
              </div>
            )}
            {!loadingRooms && !roomsError && rooms.length > 0 && filteredRooms.length === 0 && (
              <div style={{ padding: 20, fontSize: 13, color: "var(--muted)" }}>검색 결과가 없습니다.</div>
            )}
            {filteredRooms.map((room) => (
              <ChatThreadItem
                key={room.groupId}
                name={room.title}
                memberCount={room.memberCount}
                preview={chatPreview(room.lastMessage)}
                time={formatThreadTime(room.lastMessageAt)}
                unread={room.unreadCount}
                avatarTone={senderTone(room.groupId)}
                active={room.groupId === activeGroupId}
                onClick={() => selectRoom(room.groupId)}
              />
            ))}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--surface-soft)" }}>
          {activeRoom ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" }}>
                <Avatar name={activeRoom.title} tone={senderTone(activeRoom.groupId)} size={36} />
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{activeRoom.title}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>멤버 {activeRoom.memberCount}명</div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ marginLeft: "auto" }}
                  iconLeft={<Icon name="map-pin" size={15} />}
                  onClick={() => {
                    setMeetupError(null);
                    setMeetupModalOpen(true);
                  }}
                >
                  약속 잡기
                </Button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: connected ? "var(--muted)" : "var(--error)" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: connected ? "var(--success, #22c55e)" : "var(--error)" }} />
                  {connected ? "실시간 연결됨" : "재연결 중"}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                {!connected && (
                  <Callout>연결이 끊겼습니다. 자동으로 다시 연결하고 있으며, 빠진 메시지도 복구합니다.</Callout>
                )}
                {messagesError && <Callout tone="danger">{messagesError}</Callout>}
                {meetupError && <Callout tone="danger">{meetupError}</Callout>}
                {hasNext && !loadingMessages && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="secondary" size="sm" disabled={loadingOlder} onClick={() => void loadOlder()}>
                      {loadingOlder ? "불러오는 중..." : "이전 메시지 보기"}
                    </Button>
                  </div>
                )}
                {loadingMessages && (
                  <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 13 }}>메시지를 불러오는 중...</div>
                )}
                {!loadingMessages && messages.length === 0 && !messagesError && (
                  <div style={{ margin: "auto", textAlign: "center", color: "var(--muted)", lineHeight: 1.7 }}>
                    아직 메시지가 없습니다.<br />첫 메시지를 남겨보세요.
                  </div>
                )}
                {!loadingMessages && messages.map((message, index) => {
                  const previous = messages[index - 1];
                  const showDate = !previous || dateKey(previous.createdAt) !== dateKey(message.createdAt);
                  const markerId = meetupMarkerId(message.content);
                  const meetup = markerId === null ? null : meetups.find((candidate) => candidate.meetupId === markerId);
                  return (
                    <React.Fragment key={message.messageId}>
                      {showDate && <div style={{ textAlign: "center" }}><Badge>{formatMessageDate(message.createdAt)}</Badge></div>}
                      {meetup ? (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                          {meetup.status === "CONFIRMED" ? (
                            <ConfirmedMeetupCard meetup={meetup} />
                          ) : (
                            <MeetupVoteCard
                              meetup={meetup}
                              loading={meetupLoading}
                              onVote={(optionId) => {
                                if (activeGroupId !== null) void runMeetupAction(
                                  () => voteMeetupOption(activeGroupId, meetup.meetupId, optionId));
                              }}
                              onCancelVote={() => {
                                if (activeGroupId !== null) void runMeetupAction(
                                  () => cancelMeetupVote(activeGroupId, meetup.meetupId));
                              }}
                              onConfirm={() => {
                                if (activeGroupId !== null) void runMeetupAction(
                                  () => confirmMeetup(activeGroupId, meetup.meetupId));
                              }}
                              onCancel={() => void removeMeetup(meetup.meetupId)}
                            />
                          )}
                        </div>
                      ) : markerId === null ? (
                        <ChatMessage
                          mine={message.senderId === currentUserId}
                          sender={message.senderName}
                          senderTone={senderTone(message.senderId)}
                          hideAvatar={previous?.senderId === message.senderId && !showDate}
                          time={formatMessageTime(message.createdAt)}
                        >
                          {message.content}
                        </ChatMessage>
                      ) : null}
                    </React.Fragment>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div style={{ padding: "0 var(--space-lg)", background: "var(--canvas)" }}>
                {sendError && <div style={{ paddingTop: 8, fontSize: 12, color: "var(--error)" }}>{sendError}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", padding: "var(--space-md) var(--space-lg)", borderTop: "1px solid var(--hairline)", background: "var(--canvas)" }}>
                <div style={{ flex: 1 }}>
                  <Input
                    placeholder={connected ? "메시지를 입력하세요" : "재연결 후 메시지를 보낼 수 있습니다"}
                    value={draft}
                    maxLength={2000}
                    disabled={!connected}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                </div>
                <Button
                  variant="primary"
                  disabled={!connected || !draft.trim()}
                  iconLeft={<Icon name="send" size={15} color="var(--on-primary)" />}
                  onClick={sendMessage}
                >
                  전송
                </Button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", textAlign: "center", lineHeight: 1.7 }}>
              {loadingRooms ? "채팅방을 불러오는 중..." : "왼쪽에서 채팅방을 선택하세요."}
            </div>
          )}
        </div>
      </div>
      {meetupModalOpen && (
        <MeetupModal
          loading={meetupLoading}
          error={meetupError}
          onClose={() => {
            if (!meetupLoading) setMeetupModalOpen(false);
          }}
          onCreate={(request) => void createRoomMeetup(request)}
        />
      )}
    </AppShell>
  );
}
