import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Badge } from "../components/ds/display/Badge";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Callout } from "../components/ds/feedback/Callout";
import { Icon } from "../components/ds/foundations/Icon";
import { useSavedItems } from "../context/SavedItemsContext";
import { getGroupDetail, type GroupDetail } from "../api/groupApi";

interface Member { name: string; tone: AvatarTone; role: string; }
const MEMBERS: Member[] = [
  { name: "김민준", tone: "violet", role: "호스트" },
  { name: "이서연", tone: "pink", role: "멤버" },
  { name: "박도윤", tone: "emerald", role: "멤버" },
  { name: "최유진", tone: "orange", role: "멤버" },
];

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
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", marginBottom: 8 }}>
        <Icon name={icon} size={15} color="var(--muted)" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
    </div>
  );
}

/** 추천 모임 상세 화면. */
export function GroupDetailPage(): JSX.Element {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const [group, setGroup] = React.useState<GroupDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!groupId) return;
    getGroupDetail(groupId)
      .then((res) => setGroup(res.data))
      .catch((err) => {
        console.error("모임 상세 조회 실패:", err);
        setLoadError("모임 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [groupId]);

  const [inquiry, setInquiry] = React.useState<string>("");
  const [inquiries, setInquiries] = React.useState<InquiryItem[]>([]);
  const [inquiryError, setInquiryError] = React.useState<string | undefined>(undefined);
  const [justSubmitted, setJustSubmitted] = React.useState<boolean>(false);
  const [inquiryPage, setInquiryPage] = React.useState<number>(1);
  const INQUIRIES_PER_PAGE = 5;
  const [, setTick] = React.useState<number>(0);

  // 로그인/권한 기능이 아직 없어서 임시로 호스트라고 가정. 실제 로그인 붙으면
  // currentUser.id === group.leaderUserId 같은 조건으로 교체하면 됨.
  const isHost = true;
  const [replyDraftId, setReplyDraftId] = React.useState<string | null>(null);
  const [replyDraftText, setReplyDraftText] = React.useState<string>("");

  // "방금" → "1분 전" 처럼 시간 표시가 저절로 갱신되도록 1분마다 리렌더
  React.useEffect(() => {
    const interval = window.setInterval(() => setTick((t) => t + 1), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const { isSaved, toggleSave } = useSavedItems();
  const saved = group ? isSaved(String(group.groupId)) : false;

  // 문의하기: 프론트엔드 로컬 상태에만 저장 (백엔드 연동 전까지 새로고침 시 초기화됨)
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

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: 28 }}>불러오는 중...</div>
      </AppShell>
    );
  }

  if (loadError || !group) {
    return (
      <AppShell>
        <div style={{ padding: 28, color: "var(--danger, red)" }}>{loadError ?? "모임을 찾을 수 없습니다."}</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ padding: 28, maxWidth: 780 }}>
        <a onClick={(e) => { e.preventDefault(); navigate("/home"); }} href="/home" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 20 }}>
          <Icon name="arrow-left" size={16} color="var(--muted)" /> 목록으로
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Badge tone="violet">스터디</Badge>
          {group.status === "RECRUITING" ? (
            <Badge tone="emerald">모집중</Badge>
          ) : (
            <Badge tone="neutral">모집마감</Badge>
          )}
        </div>
        <h1 className="cl-display-sm" style={{ margin: "0 0 var(--space-sm)", textWrap: "pretty" }}>{group.title}</h1>
        <Callout style={{ marginBottom: 24 }}>관심사와 활동 선호가 잘 맞아 상위로 추천했어요.</Callout>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          <InfoTile icon="calendar" label="일정" value={group.meetingRule} />
          <InfoTile icon="map-pin" label="장소" value={group.location} />
          <InfoTile icon="users" label="참여" value={`${group.currentMemberCount} / ${group.maxMemberCount}명`} />
        </div>
        <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>모임 소개</div>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
            {group.description}
          </p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>모집 중인 역할</div>
          {group.recruitingRoles.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {group.recruitingRoles.map((r, i) => (
                <Badge key={i}>{r.role} · {r.skill}</Badge>
              ))}
            </div>
          ) : (
            <Callout>현재 모집 중인 역할이 없어요.</Callout>
          )}
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>참여 멤버 {group.currentMemberCount}명</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {MEMBERS.map((m) => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.name} tone={m.tone} size={40} />
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 28 }}>
          <Field label="문의">
            <div style={{ display: "flex", gap: 8 }}>
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
            <div style={{ marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--brand-accent)" }}>
              문의가 등록되었어요.
            </div>
          )}

          {inquiries.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {paginatedInquiries.map((q) => (
                <div
                  key={q.id}
                  style={{
                    background: "var(--surface-card)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
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

                  {/* 호스트 답변 (등록된 경우) */}
                  {q.reply && (
                    <div
                      style={{
                        marginTop: 10,
                        marginLeft: 22,
                        paddingLeft: 12,
                        borderLeft: "2px solid var(--hairline)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>호스트 답변</span>
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>{formatRelativeTime(q.reply.time)}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>{q.reply.text}</div>
                    </div>
                  )}

                  {/* 호스트에게만 보이는 답변 작성 UI */}
                  {isHost && !q.reply && (
                    <div style={{ marginTop: 10, marginLeft: 22 }}>
                      {replyDraftId === q.id ? (
                        <div style={{ display: "flex", gap: 8 }}>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8 }}>
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
        <div style={{ display: "flex", gap: 12, position: "sticky", bottom: 0, background: "var(--canvas)", paddingTop: 8 }}>
          <Button variant="primary" size="lg" onClick={() => navigate("/apply/complete")}>참여 신청하기</Button>
          <Button
            variant="secondary"
            size="lg"
            iconLeft={<Icon name={saved ? "bookmark-check" : "bookmark"} size={16} />}
            onClick={() => toggleSave({
              id: String(group.groupId),
              type: "group",
              title: group.title,
              category: "스터디",
              categoryTone: "violet",
              when: group.meetingRule,
              where: group.location,
              host: "",
              members: group.currentMemberCount,
              capacity: group.maxMemberCount,
            })}
          >
            {saved ? "저장됨" : "저장"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}