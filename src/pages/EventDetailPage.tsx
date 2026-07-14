import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Badge } from "../components/ds/display/Badge";
import { Callout } from "../components/ds/feedback/Callout";
import { Icon } from "../components/ds/foundations/Icon";
import { useSavedItems } from "../context/SavedItemsContext";
import { EVENTS } from "./HomePage";

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

/** 추천 행사 상세 화면. */
export function EventDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const event = EVENTS.find((e) => e.id === eventId) ?? EVENTS[0];
  const [inquiry, setInquiry] = React.useState<string>("");
  const [inquiries, setInquiries] = React.useState<InquiryItem[]>([]);
  const [inquiryError, setInquiryError] = React.useState<string | undefined>(undefined);
  const [justSubmitted, setJustSubmitted] = React.useState<boolean>(false);
  const [inquiryPage, setInquiryPage] = React.useState<number>(1);
  const INQUIRIES_PER_PAGE = 5;
  const [, setTick] = React.useState<number>(0);

  // 로그인/권한 기능이 아직 없어서 임시로 호스트(주최측)라고 가정.
  // 실제 로그인 붙으면 currentUser.id === event.hostId 같은 조건으로 교체.
  const isHost = true;
  const [replyDraftId, setReplyDraftId] = React.useState<string | null>(null);
  const [replyDraftText, setReplyDraftText] = React.useState<string>("");

  // "방금" → "1분 전" 처럼 시간 표시가 저절로 갱신되도록 1분마다 리렌더
  React.useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const { isSaved, toggleSave } = useSavedItems();
  const saved = isSaved(event.id);

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

  return (
    <AppShell>
      <div style={{ padding: "var(--space-xl)", maxWidth: 780 }}>
        <a onClick={(e) => { e.preventDefault(); navigate("/home"); }} href="/home" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: "var(--space-lg)" }}>
          <Icon name="arrow-left" size={16} color="var(--muted)" /> 목록으로
        </a>
        <div style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
          <div style={{ flexShrink: 0, width: 88, height: 96, borderRadius: "var(--radius-lg)", background: "var(--surface-dark)", color: "var(--on-dark)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-xxs)" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, opacity: 0.75 }}>{event.month}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-1px", lineHeight: 1 }}>{event.day}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-sm)" }}>
              <Badge tone={event.tagTone ?? "neutral"}>{event.tag}</Badge>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--brand-accent)" }}>✦ {event.matchScore}% 일치</span>
            </div>
            <h1 className="cl-display-sm" style={{ margin: 0, textWrap: "pretty" }}>{event.title}</h1>
          </div>
        </div>
        <Callout style={{ marginBottom: "var(--space-lg)" }}>{event.matchReason}</Callout>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
          <InfoTile icon="clock" label="시작" value={`${event.month}/${event.day} ${event.time ?? ""}`} />
          <InfoTile icon="map-pin" label="장소" value={event.venue ?? ""} />
          <InfoTile icon="users" label="참석" value={event.attendance ?? ""} />
        </div>
        <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-sm)" }}>행사 소개</div>
          <p style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
            {event.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
            {event.features.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-md)" }}>일정</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {event.schedule.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", padding: "var(--space-md)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)" }}>
                <div style={{ flexShrink: 0, width: 72, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{s.date}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{s.title}</div>
                  {s.time && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{s.time}</div>}
                </div>
              </div>
            ))}
          </div>
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

                  {/* 주최측 답변 (등록된 경우) */}
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

                  {/* 호스트(주최측)에게만 보이는 답변 작성 UI */}
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
        <div style={{ display: "flex", gap: "var(--space-sm)", position: "sticky", bottom: 0, background: "var(--canvas)", paddingTop: "var(--space-xs)" }}>
          <Button variant="primary" size="lg" onClick={() => navigate("/apply/complete")}>참가 신청하기</Button>
          <Button
            variant="secondary"
            size="lg"
            iconLeft={<Icon name={saved ? "bookmark-check" : "bookmark"} size={16} />}
            onClick={() => toggleSave({
              id: event.id,
              type: "event",
              title: event.title,
              category: event.tag ?? "",
              categoryTone: event.tagTone ?? "neutral",
              when: `${event.month}/${event.day} ${event.time ?? ""}`,
              where: event.venue ?? "",
              host: "CampusLink",
              members: 0,
              capacity: 0,
            })}
          >
            {saved ? "저장됨" : "저장"}
          </Button>
          <Button variant="secondary" size="lg" iconLeft={<Icon name="share-2" size={16} />}>공유</Button>
        </div>
      </div>
    </AppShell>
  );
}