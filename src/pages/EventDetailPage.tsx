import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Badge } from "../components/ds/display/Badge";
import { Callout } from "../components/ds/feedback/Callout";
import { Icon } from "../components/ds/foundations/Icon";
import {
  applyToEvent,
  deleteEvent,
  getEventApplicationStatus,
  getEventDetail,
  type EventDetail,
} from "../api/eventApi";
import { getMyProfile } from "../api/profileApi";
import { getRecommendations, type RecommendationItem } from "../api/recommendationApi";

interface InquiryItem {
  id: string;
  text: string;
  time: number;
  reply?: { text: string; time: number };
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;

  const date = new Date(timestamp);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function InfoTile({ icon, label, value }: { icon: string; label: string; value: string }): JSX.Element {
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--muted)", marginBottom: "var(--space-xs)" }}>
        <Icon name={icon} size={15} color="var(--muted)" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
    </div>
  );
}

function formatDateTime(iso: string): { month: string; day: string; full: string } {
  const d = new Date(iso);
  return {
    month: `${d.getMonth() + 1}월`,
    day: String(d.getDate()),
    full: `${d.getMonth() + 1}/${d.getDate()} ${d.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" })}`,
  };
}

function getSafeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/** 추천 행사 상세 화면. */
export function EventDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [eventResult, setEventResult] = React.useState<{
    eventId: string;
    item: EventDetail | null;
    error: string | null;
  } | null>(null);
  const [applicationStatusResult, setApplicationStatusResult] = React.useState<{
    eventId: string;
    applied: boolean;
  } | null>(null);
  const [applyingRequest, setApplyingRequest] = React.useState<{
    eventId: string;
    mutationId: number;
  } | null>(null);
  const [applicationMessageResult, setApplicationMessageResult] = React.useState<{
    eventId: string;
    message: string;
  } | null>(null);
  const applicationMutationIdRef = React.useRef(0);
  const [recommendationResult, setRecommendationResult] = React.useState<{
    eventId: string;
    item: RecommendationItem | null;
  } | null>(null);

  React.useEffect(() => {
    if (!eventId) return;
    let active = true;

    getEventDetail(eventId)
      .then((res) => {
        if (active) setEventResult({ eventId, item: res.data, error: null });
      })
      .catch((err) => {
        if (!active) return;
        console.error("행사 상세 조회 실패:", err);
        setEventResult({ eventId, item: null, error: "행사 정보를 불러오지 못했습니다." });
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  React.useEffect(() => {
    if (!eventId) return;
    let active = true;
    applicationMutationIdRef.current += 1;

    getEventApplicationStatus(eventId)
      .then((res) => {
        if (active) setApplicationStatusResult({ eventId, applied: res.data.applied });
      })
      .catch(() => {
        // 비로그인 사용자는 상세 정보만 볼 수 있다.
        if (active) setApplicationStatusResult({ eventId, applied: false });
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  React.useEffect(() => {
    if (!eventId) return;
    const targetId = Number(eventId);
    if (!Number.isSafeInteger(targetId) || targetId <= 0) return;

    const controller = new AbortController();
    let active = true;
    getRecommendations(20, controller.signal)
      .then((response) => {
        if (!active) return;
        const item = response.data.find(
          (candidate) => candidate.category === "HACKATHON" && candidate.targetId === targetId
        ) ?? null;
        setRecommendationResult({ eventId, item });
      })
      .catch(() => {
        if (active && !controller.signal.aborted) {
          setRecommendationResult({ eventId, item: null });
        }
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [eventId]);

  const event = eventResult && eventResult.eventId === eventId ? eventResult.item : null;
  const loadError = eventResult && eventResult.eventId === eventId ? eventResult.error : null;
  const loading = eventResult?.eventId !== eventId;
  const applied = applicationStatusResult && applicationStatusResult.eventId === eventId
    ? applicationStatusResult.applied
    : false;
  const applicationStatusLoading = applicationStatusResult?.eventId !== eventId;
  const applying = applyingRequest?.eventId === eventId;
  const applicationMessage = applicationMessageResult && applicationMessageResult.eventId === eventId
    ? applicationMessageResult.message
    : null;

  const [inquiry, setInquiry] = React.useState<string>("");
  const [inquiries, setInquiries] = React.useState<InquiryItem[]>([]);
  const [inquiryError, setInquiryError] = React.useState<string | undefined>(undefined);
  const [justSubmitted, setJustSubmitted] = React.useState<boolean>(false);
  const [inquiryPage, setInquiryPage] = React.useState<number>(1);
  const INQUIRIES_PER_PAGE = 5;
  const [, setTick] = React.useState<number>(0);

  const [myUserId, setMyUserId] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    getMyProfile()
      .then((res) => setMyUserId(res.data.userId))
      .catch((err) => console.error("프로필 조회 실패:", err));
  }, []);

  const isHost = myUserId !== null && event?.creatorUserId === myUserId;
  const [replyDraftId, setReplyDraftId] = React.useState<string | null>(null);
  const [replyDraftText, setReplyDraftText] = React.useState<string>("");

  async function handleDeleteEvent(): Promise<void> {
    if (!event) return;
    if (!window.confirm("정말 이 행사를 삭제할까요? 되돌릴 수 없어요.")) return;
    setDeleting(true);
    try {
      await deleteEvent(event.eventId);
      navigate("/home");
    } catch (err) {
      console.error("행사 삭제 실패:", err);
      window.alert("행사 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  }

  React.useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 60000);
    return () => window.clearInterval(interval);
  }, []);

  function handleSubmitInquiry(): void {
    const trimmed = inquiry.trim();
    if (!trimmed) {
      setInquiryError("문의 내용을 입력해주세요.");
      return;
    }
    setInquiryError(undefined);
    setInquiries((prev) => [
      { id: `${Date.now()}`, text: trimmed, time: Date.now() },
      ...prev,
    ]);
    setInquiry("");
    setJustSubmitted(true);
    setInquiryPage(1);
    window.setTimeout(() => setJustSubmitted(false), 2000);
  }

  function handleApply(): void {
    if (!eventId || applied || applying || applicationStatusLoading) return;
    const mutationId = ++applicationMutationIdRef.current;
    setApplyingRequest({ eventId, mutationId });
    setApplicationMessageResult(null);
    applyToEvent(eventId)
      .then(() => {
        if (applicationMutationIdRef.current !== mutationId) return;
        setApplicationStatusResult({ eventId, applied: true });
        setApplicationMessageResult({
          eventId,
          message: "마이페이지 달력에 신청 일정이 표시됐어요.",
        });
      })
      .catch((err) => {
        if (applicationMutationIdRef.current !== mutationId) return;
        console.error("행사 신청 일정 기록 실패:", err);
        setApplicationMessageResult({
          eventId,
          message: axios.isAxiosError<{ message?: string }>(err)
            ? err.response?.data?.message ?? "신청 일정을 기록하지 못했습니다."
            : "신청 일정을 기록하지 못했습니다.",
        });
      })
      .finally(() => {
        setApplyingRequest((current) =>
          current?.mutationId === mutationId ? null : current
        );
      });
  }

  function handleInquiryKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitInquiry();
    }
  }

  function handleDeleteInquiry(id: string): void {
    setInquiries((prev) => {
      const next = prev.filter((q) => q.id !== id);
      const maxPage = Math.max(1, Math.ceil(next.length / INQUIRIES_PER_PAGE));
      setInquiryPage((page) => Math.min(page, maxPage));
      return next;
    });
  }

  function handleStartReply(id: string): void {
    setReplyDraftId(id);
    setReplyDraftText("");
  }

  function handleCancelReply(): void {
    setReplyDraftId(null);
    setReplyDraftText("");
  }

  function handleSubmitReply(id: string): void {
    const trimmed = replyDraftText.trim();
    if (!trimmed) return;
    setInquiries((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, reply: { text: trimmed, time: Date.now() } } : q
      )
    );
    setReplyDraftId(null);
    setReplyDraftText("");
  }

  const inquiryTotalPages = Math.max(1, Math.ceil(inquiries.length / INQUIRIES_PER_PAGE));
  const paginatedInquiries = inquiries.slice(
    (inquiryPage - 1) * INQUIRIES_PER_PAGE,
    inquiryPage * INQUIRIES_PER_PAGE
  );

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: "var(--space-xl)" }}>불러오는 중...</div>
      </AppShell>
    );
  }

  if (loadError || !event) {
    return (
      <AppShell>
        <div style={{ padding: "var(--space-xl)", color: "var(--danger, red)" }}>{loadError ?? "행사를 찾을 수 없습니다."}</div>
      </AppShell>
    );
  }

  const start = formatDateTime(event.startsAt);
  const safeRelatedUrl = getSafeExternalUrl(event.relatedUrl);
  const recommendation = recommendationResult !== null && recommendationResult.eventId === eventId
    ? recommendationResult.item
    : null;
  const recommendationReasons = recommendation?.reasons.filter((reason) => reason.trim().length > 0) ?? [];
  return (
    <AppShell>
      <div style={{ padding: "var(--space-xl)", maxWidth: 780 }}>
        <a onClick={(e) => { e.preventDefault(); navigate("/home"); }} href="/home" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: "var(--space-lg)" }}>
          <Icon name="arrow-left" size={16} color="var(--muted)" /> 목록으로
        </a>
        <div style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
          <div style={{ flexShrink: 0, width: 88, height: 96, borderRadius: "var(--radius-lg)", background: "var(--surface-dark)", color: "var(--on-dark)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-xxs)" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, opacity: 0.75 }}>{start.month}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-1px", lineHeight: 1 }}>{start.day}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-sm)" }}>
              <Badge tone="orange">해커톤</Badge>
            </div>
            <h1 className="cl-display-sm" style={{ margin: 0, textWrap: "pretty" }}>{event.title}</h1>
          </div>
        </div>
        <Callout style={{ marginBottom: "var(--space-lg)" }}>주최: {event.organizer}</Callout>
        <div className="cl-event-info-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
          <InfoTile icon="clock" label="시작" value={start.full} />
          <InfoTile icon="map-pin" label="장소" value={event.location} />
          <InfoTile icon="calendar" label="신청 마감" value={formatDateTime(event.applicationDeadlineAt).full} />
        </div>
        <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-sm)" }}>행사 소개</div>
          <p style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
            {event.description}
          </p>
          {recommendation && (
            <section aria-labelledby="event-recommendation-heading" style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-md)", padding: "var(--space-md)", marginBottom: "var(--space-md)", background: "var(--canvas)" }}>
              <h2 id="event-recommendation-heading" style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: recommendationReasons.length > 0 ? "var(--space-xs)" : 0 }}>
                회원님과 {recommendation.score}% 잘 맞는 행사예요
              </h2>
              {recommendationReasons.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                  {recommendationReasons.map((reason, index) => (
                    <li key={`${reason}-${index}`} style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5, color: "var(--body)" }}>
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {event.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
              {event.tags.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          )}
          {safeRelatedUrl && (
            <div style={{ marginTop: "var(--space-md)" }}>
              <a href={safeRelatedUrl} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--brand-accent)" }}>
                관련 링크 바로가기 →
              </a>
            </div>
          )}
        </div>
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <Field label="문의">
            <div style={{ display: "flex", gap: "var(--space-xs)" }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="궁금한 점을 남겨보세요"
                  value={inquiry}
                  onChange={(e) => {
                    setInquiry(e.target.value);
                    if (inquiryError) setInquiryError(undefined);
                  }}
                  onKeyDown={handleInquiryKeyDown}
                />
              </div>
              <Button variant="secondary" onClick={handleSubmitInquiry} disabled={!inquiry.trim()}>
                문의하기
              </Button>
            </div>
          </Field>

          {inquiryError && (
            <div style={{ marginTop: 4, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--danger, #e5484d)" }}>
              {inquiryError}
            </div>
          )}

          {justSubmitted && (
            <div style={{ marginTop: "var(--space-xs)", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--brand-accent)" }}>
              문의가 등록되었어요.
            </div>
          )}

          {inquiries.length > 0 && (
            <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
              {paginatedInquiries.map((q) => (
                <div
                  key={q.id}
                  style={{
                    background: "var(--surface-card)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-sm) var(--space-md)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-xs)" }}>
                    <Icon name="message-circle" size={14} color="var(--muted)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>{q.text}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>{formatRelativeTime(q.time)}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(q.id)}
                      aria-label="문의 삭제"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "var(--radius-sm)",
                      }}
                    >
                      <Icon name="x" size={14} color="var(--muted)" />
                    </button>
                  </div>

                  {q.reply && (
                    <div
                      style={{
                        marginTop: "var(--space-sm)",
                        marginLeft: 22,
                        paddingLeft: "var(--space-sm)",
                        borderLeft: "2px solid var(--hairline)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>주최측 답변</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>{formatRelativeTime(q.reply.time)}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>{q.reply.text}</div>
                    </div>
                  )}

                  {isHost && !q.reply && (
                    <div style={{ marginTop: "var(--space-sm)", marginLeft: 22 }}>
                      {replyDraftId === q.id ? (
                        <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                          <div style={{ flex: 1 }}>
                            <Input
                              placeholder="답변을 입력해주세요"
                              value={replyDraftText}
                              onChange={(e) => setReplyDraftText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSubmitReply(q.id);
                                }
                                if (e.key === "Escape") handleCancelReply();
                              }}
                            />
                          </div>
                          <Button variant="secondary" onClick={() => handleSubmitReply(q.id)} disabled={!replyDraftText.trim()}>
                            등록
                          </Button>
                          <Button variant="ghost" onClick={handleCancelReply}>
                            취소
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartReply(q.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            fontFamily: "var(--font-sans)",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--brand-accent)",
                          }}
                        >
                          답변하기
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {inquiryTotalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: "var(--space-xs)" }}>
                  <button
                    type="button"
                    onClick={() => setInquiryPage((p) => Math.max(1, p - 1))}
                    disabled={inquiryPage === 1}
                    aria-label="이전 페이지"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: inquiryPage === 1 ? "default" : "pointer",
                      opacity: inquiryPage === 1 ? 0.3 : 1,
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="chevron-left" size={16} color="var(--muted)" />
                  </button>

                  {Array.from({ length: inquiryTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setInquiryPage(page)}
                      aria-label={`${page} 페이지`}
                      aria-current={page === inquiryPage}
                      style={{
                        minWidth: 28,
                        height: 28,
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: page === inquiryPage ? 700 : 500,
                        color: page === inquiryPage ? "var(--ink)" : "var(--muted)",
                        background: page === inquiryPage ? "var(--surface-card)" : "transparent",
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setInquiryPage((p) => Math.min(inquiryTotalPages, p + 1))}
                    disabled={inquiryPage === inquiryTotalPages}
                    aria-label="다음 페이지"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: inquiryPage === inquiryTotalPages ? "default" : "pointer",
                      opacity: inquiryPage === inquiryTotalPages ? 0.3 : 1,
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Icon name="chevron-right" size={16} color="var(--muted)" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="cl-event-actions" style={{ display: "flex", gap: "var(--space-sm)", position: "sticky", bottom: 0, background: "var(--canvas)", paddingTop: "var(--space-xs)" }}>
          {isHost ? (
            <>
              <Button variant="secondary" size="lg" iconLeft={<Icon name="pencil" size={16} />} onClick={() => navigate(`/events/${event.eventId}/edit`)}>
                행사 수정
              </Button>
              <Button variant="secondary" size="lg" iconLeft={<Icon name="trash-2" size={16} />} onClick={handleDeleteEvent} disabled={deleting}>
                {deleting ? "삭제 중..." : "행사 삭제"}
              </Button>
            </>
          ) : (
            <Button variant="primary" size="lg" onClick={handleApply} disabled={applied || applying || applicationStatusLoading}>
              {applied ? "신청 표시됨" : applying ? "기록 중..." : applicationStatusLoading ? "신청 상태 확인 중..." : "참가 신청 표시하기"}
            </Button>
          )}
          <Button variant="secondary" size="lg" iconLeft={<Icon name="share-2" size={16} />}>공유</Button>
        </div>
        {!isHost && (
          <div style={{ marginTop: "var(--space-xs)", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>
            이 버튼은 CampusLink 마이페이지에 일정만 기록하며, 주최 측 실제 참가 접수는 관련 링크에서 별도로 해야 합니다.
          </div>
        )}
        {!isHost && applicationMessage && (
          <div style={{ marginTop: "var(--space-xs)", fontFamily: "var(--font-sans)", fontSize: 13, color: applied ? "var(--brand-accent)" : "var(--danger, #e5484d)" }}>
            {applicationMessage}
          </div>
        )}
      </div>
    </AppShell>
  );
}
