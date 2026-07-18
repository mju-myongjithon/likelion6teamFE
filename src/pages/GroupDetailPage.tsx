import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Badge } from "../components/ds/display/Badge";
import { Avatar, type AvatarTone } from "../components/ds/display/Avatar";
import { Callout } from "../components/ds/feedback/Callout";
import { Icon } from "../components/ds/foundations/Icon";
import { useSavedItems } from "../context/savedItems";
import {
  getGroupDetail,
  deleteGroup,
  getGroupMembers,
  applyToGroup,
  getMyApplicationForGroup,
  getGroupApplications,
  approveApplication,
  rejectApplication,
  removeMember,
  transferLeadership,
  closeRecruitment,
  reopenRecruitment,
  recommendGroupCafes,
  type GroupDetail,
  type MemberResponse,
  type ApplicationResponse,
  type CafeRecommendationResponse,
} from "../api/groupApi";
import { cancelMyApplication } from "../api/groupApplicationApi";
import { getMyProfile } from "../api/profileApi";
import {
  getGroupInquiries,
  createGroupInquiry,
  answerGroupInquiry,
  deleteGroupInquiry,
  type GroupInquiryResponse,
} from "../api/groupInquiryApi";

function apiErrorMessage(error: unknown, fallback: string): string {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? fallback
    : fallback;
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;

  const date = new Date(iso);
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

  const refreshGroup = React.useCallback(async () => {
    if (!groupId) return;
    try {
      const res = await getGroupDetail(groupId);
      setGroup(res.data);
    } catch (err) {
      console.error("모임 상세 조회 실패:", err);
    }
  }, [groupId]);

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

  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null);
  React.useEffect(() => {
    getMyProfile()
      .then((res) => setCurrentUserId(res.data.userId))
      .catch(() => {
        // 비로그인 상태일 수 있음 — 리더 전용 기능만 숨기고 나머지는 그대로 보여줌
      });
  }, []);

  const [members, setMembers] = React.useState<MemberResponse[]>([]);
  const [membersError, setMembersError] = React.useState<string | null>(null);
  const [memberActionLoading, setMemberActionLoading] = React.useState<number | null>(null);

  const refreshMembers = React.useCallback(async () => {
    if (!groupId) return;
    try {
      const res = await getGroupMembers(groupId);
      setMembers(res.data);
      setMembersError(null);
    } catch (err) {
      console.error("모임 참여자 조회 실패:", err);
      setMembersError("참여 중인 멤버만 목록을 볼 수 있어요.");
    }
  }, [groupId]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshMembers();
  }, [refreshMembers]);

  const [deleting, setDeleting] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  async function handleDelete(): Promise<void> {
    if (!groupId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteGroup(groupId);
      navigate("/home");
    } catch (err: unknown) {
      setDeleteError(apiErrorMessage(err, "삭제에 실패했습니다."));
      setDeleteLoading(false);
    }
  }

  const isHost = group !== null && currentUserId !== null && currentUserId === group.leaderUserId;

  const { isSaved, toggleSave } = useSavedItems();
  const saved = group ? isSaved(String(group.groupId)) : false;

  // ── 참가 신청 (신청자 관점) ──────────────────────────────
  const [myApplication, setMyApplication] = React.useState<ApplicationResponse | null>(null);
  const [myApplicationLoading, setMyApplicationLoading] = React.useState(true);
  const [applyLoading, setApplyLoading] = React.useState(false);
  const [applyError, setApplyError] = React.useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = React.useState(false);

  const refreshMyApplication = React.useCallback(async () => {
    if (!groupId) return;
    try {
      const res = await getMyApplicationForGroup(groupId);
      setMyApplication(res.data);
    } catch {
      setMyApplication(null);
    } finally {
      setMyApplicationLoading(false);
    }
  }, [groupId]);

  React.useEffect(() => {
    if (isHost) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMyApplicationLoading(false);
      return;
    }
    void refreshMyApplication();
  }, [refreshMyApplication, isHost]);

  async function handleApply(): Promise<void> {
    if (!groupId) return;
    setApplyLoading(true);
    setApplyError(null);
    try {
      const res = await applyToGroup(groupId);
      setMyApplication(res.data);
      navigate("/apply/complete");
    } catch (err: unknown) {
      setApplyError(apiErrorMessage(err, "참여 신청에 실패했습니다."));
    } finally {
      setApplyLoading(false);
    }
  }

  async function handleCancelApplication(): Promise<void> {
    if (!myApplication) return;
    setCancelLoading(true);
    try {
      await cancelMyApplication(myApplication.applicationId);
      setMyApplication(null);
    } catch (err: unknown) {
      setApplyError(apiErrorMessage(err, "신청 취소에 실패했습니다."));
    } finally {
      setCancelLoading(false);
    }
  }

  // ── 리더 관리: 대기 신청 승인/거절 ──────────────────────────
  const [pendingApplications, setPendingApplications] = React.useState<ApplicationResponse[]>([]);
  const [pendingLoading, setPendingLoading] = React.useState(false);
  const [applicationActionLoading, setApplicationActionLoading] = React.useState<number | null>(null);

  const refreshPendingApplications = React.useCallback(async () => {
    if (!groupId || !isHost) return;
    setPendingLoading(true);
    try {
      const res = await getGroupApplications(groupId);
      setPendingApplications(res.data.filter((a) => a.status === "PENDING"));
    } catch (err) {
      console.error("대기 신청 조회 실패:", err);
    } finally {
      setPendingLoading(false);
    }
  }, [groupId, isHost]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshPendingApplications();
  }, [refreshPendingApplications]);

  async function handleApprove(applicationId: number): Promise<void> {
    if (!groupId) return;
    setApplicationActionLoading(applicationId);
    try {
      await approveApplication(groupId, applicationId);
      await Promise.all([refreshPendingApplications(), refreshMembers(), refreshGroup()]);
    } catch (err) {
      console.error("신청 승인 실패:", err);
    } finally {
      setApplicationActionLoading(null);
    }
  }

  async function handleReject(applicationId: number): Promise<void> {
    if (!groupId) return;
    setApplicationActionLoading(applicationId);
    try {
      await rejectApplication(groupId, applicationId);
      await refreshPendingApplications();
    } catch (err) {
      console.error("신청 거절 실패:", err);
    } finally {
      setApplicationActionLoading(null);
    }
  }

  // ── 리더 관리: 멤버 강퇴 / 리더 양도 / 모집 마감·재개 ─────────
  async function handleRemoveMember(userId: number): Promise<void> {
    if (!groupId) return;
    if (!window.confirm("이 멤버를 모임에서 강퇴할까요?")) return;
    setMemberActionLoading(userId);
    try {
      await removeMember(groupId, userId);
      await Promise.all([refreshMembers(), refreshGroup()]);
    } catch (err) {
      console.error("멤버 강퇴 실패:", err);
    } finally {
      setMemberActionLoading(null);
    }
  }

  async function handleTransferLeadership(userId: number): Promise<void> {
    if (!groupId) return;
    if (!window.confirm("이 멤버에게 리더 권한을 양도할까요? 되돌릴 수 없어요.")) return;
    setMemberActionLoading(userId);
    try {
      await transferLeadership(groupId, userId);
      await Promise.all([refreshMembers(), refreshGroup()]);
    } catch (err) {
      console.error("리더 양도 실패:", err);
    } finally {
      setMemberActionLoading(null);
    }
  }

  const [recruitmentLoading, setRecruitmentLoading] = React.useState(false);
  async function handleToggleRecruitment(): Promise<void> {
    if (!groupId || !group) return;
    setRecruitmentLoading(true);
    try {
      if (group.status === "RECRUITING") {
        await closeRecruitment(groupId);
      } else {
        await reopenRecruitment(groupId);
      }
      await refreshGroup();
    } catch (err) {
      console.error("모집 상태 변경 실패:", err);
    } finally {
      setRecruitmentLoading(false);
    }
  }

  // ── 카페 추천 ────────────────────────────────────────────
  const [cafeResult, setCafeResult] = React.useState<CafeRecommendationResponse | null>(null);
  const [cafeLoading, setCafeLoading] = React.useState(false);
  const [cafeError, setCafeError] = React.useState<string | null>(null);

  async function handleRecommendCafes(): Promise<void> {
    if (!groupId) return;
    setCafeLoading(true);
    setCafeError(null);
    try {
      const res = await recommendGroupCafes(groupId);
      setCafeResult(res.data);
    } catch (err: unknown) {
      setCafeError(apiErrorMessage(err, "카페 추천을 불러오지 못했습니다."));
    } finally {
      setCafeLoading(false);
    }
  }

  // ── 모임 문의 (실 API 연동) ───────────────────────────────
  const [inquiry, setInquiry] = React.useState<string>("");
  const [inquiries, setInquiries] = React.useState<GroupInquiryResponse[]>([]);
  const [inquiryError, setInquiryError] = React.useState<string | undefined>(undefined);
  const [justSubmitted, setJustSubmitted] = React.useState<boolean>(false);
  const [inquiryPage, setInquiryPage] = React.useState<number>(1);
  const [inquiryTotalPages, setInquiryTotalPages] = React.useState<number>(1);
  const [inquiryLoading, setInquiryLoading] = React.useState(false);
  const [submittingInquiry, setSubmittingInquiry] = React.useState(false);
  const INQUIRIES_PER_PAGE = 5;
  const [replyDraftId, setReplyDraftId] = React.useState<number | null>(null);
  const [replyDraftText, setReplyDraftText] = React.useState<string>("");
  const [replySubmitting, setReplySubmitting] = React.useState(false);

  const refreshInquiries = React.useCallback(async (page: number) => {
    if (!groupId) return;
    setInquiryLoading(true);
    try {
      const res = await getGroupInquiries(groupId, page - 1, INQUIRIES_PER_PAGE);
      setInquiries(res.data.content);
      setInquiryTotalPages(Math.max(1, res.data.totalPages));
    } catch (err) {
      console.error("모임 문의 조회 실패:", err);
    } finally {
      setInquiryLoading(false);
    }
  }, [groupId]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshInquiries(inquiryPage);
  }, [refreshInquiries, inquiryPage]);

  async function handleSubmitInquiry(): Promise<void> {
    const trimmed = inquiry.trim();
    if (!trimmed || !groupId) {
      setInquiryError("문의 내용을 입력해주세요.");
      return;
    }
    setInquiryError(undefined);
    setSubmittingInquiry(true);
    try {
      await createGroupInquiry(groupId, trimmed);
      setInquiry("");
      setJustSubmitted(true);
      setInquiryPage(1);
      await refreshInquiries(1);
      window.setTimeout(() => setJustSubmitted(false), 2000);
    } catch (err: unknown) {
      setInquiryError(apiErrorMessage(err, "문의 등록에 실패했습니다."));
    } finally {
      setSubmittingInquiry(false);
    }
  }

  function handleInquiryKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitInquiry();
    }
  }

  async function handleDeleteInquiry(inquiryId: number): Promise<void> {
    if (!groupId) return;
    try {
      await deleteGroupInquiry(groupId, inquiryId);
      await refreshInquiries(inquiryPage);
    } catch (err) {
      console.error("문의 삭제 실패:", err);
    }
  }

  function handleStartReply(inquiryId: number): void {
    setReplyDraftId(inquiryId);
    setReplyDraftText("");
  }

  function handleCancelReply(): void {
    setReplyDraftId(null);
    setReplyDraftText("");
  }

  async function handleSubmitReply(inquiryId: number): Promise<void> {
    const trimmed = replyDraftText.trim();
    if (!trimmed || !groupId) return;
    setReplySubmitting(true);
    try {
      await answerGroupInquiry(groupId, inquiryId, trimmed);
      setReplyDraftId(null);
      setReplyDraftText("");
      await refreshInquiries(inquiryPage);
    } catch (err) {
      console.error("문의 답변 실패:", err);
    } finally {
      setReplySubmitting(false);
    }
  }

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

        {/* ── 참여 멤버 (리더는 강퇴/양도 가능) ─────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>참여 멤버 {group.currentMemberCount}명</div>
          {members.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {members.map((m) => {
                const name = m.name?.trim();
                const isCurrentUser = m.userId === currentUserId;
                const label = name
                  ? `${name}${isCurrentUser ? " (나)" : ""}`
                  : isCurrentUser ? "나" : `멤버 #${m.userId}`;
                const tone: AvatarTone = m.role === "LEADER" ? "violet" : "neutral";
                const canManage = isHost && m.role !== "LEADER";
                return (
                  <div key={m.userId} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={name || label} tone={tone} size={40} />
                    <div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{m.role === "LEADER" ? "호스트" : "멤버"}</div>
                    </div>
                    {canManage && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <button
                          type="button"
                          onClick={() => handleTransferLeadership(m.userId)}
                          disabled={memberActionLoading === m.userId}
                          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--brand-accent)", textAlign: "left" }}
                        >
                          리더 양도
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(m.userId)}
                          disabled={memberActionLoading === m.userId}
                          style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, color: "var(--error)", textAlign: "left" }}
                        >
                          강퇴
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <Callout>{membersError ?? "아직 참여 멤버가 없어요."}</Callout>
          )}
        </div>

        {/* ── 리더 관리 패널: 대기 신청 + 모집 마감/재개 ─────────── */}
        {isHost && (
          <div style={{ marginBottom: 28, border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>모임 관리</div>
              <Button variant="secondary" size="sm" onClick={handleToggleRecruitment} disabled={recruitmentLoading}>
                {recruitmentLoading ? "처리 중..." : group.status === "RECRUITING" ? "모집 마감하기" : "모집 재개하기"}
              </Button>
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>
              대기 중인 신청 {pendingApplications.length}건
            </div>
            {pendingLoading ? (
              <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 13 }}>불러오는 중...</div>
            ) : pendingApplications.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pendingApplications.map((a) => (
                  <div key={a.applicationId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 14px", background: "var(--surface-card)", borderRadius: "var(--radius-md)" }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>
                      신청자 #{a.applicantUserId} · {formatRelativeTime(a.requestedAt)}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Button variant="primary" size="sm" onClick={() => handleApprove(a.applicationId)} disabled={applicationActionLoading === a.applicationId}>
                        승인
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleReject(a.applicationId)} disabled={applicationActionLoading === a.applicationId}>
                        거절
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 13 }}>대기 중인 신청이 없어요.</div>
            )}
          </div>
        )}

        {/* ── 공동 카페 추천 ─────────────────────────────────── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>모임 멤버 공동 카페 추천</div>
            <Button variant="secondary" size="sm" onClick={handleRecommendCafes} disabled={cafeLoading}>
              {cafeLoading ? "찾는 중..." : "추천받기"}
            </Button>
          </div>
          {cafeError && <Callout tone="danger">{cafeError}</Callout>}
          {cafeResult && cafeResult.recommendations.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cafeResult.recommendations.map((c) => (
                <div key={c.rank} style={{ padding: "12px 14px", border: "1px solid var(--hairline)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Badge>{c.rank}순위</Badge>
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{c.location.placeName}</span>
                  </div>
                  {c.detail.address && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{c.detail.address}</div>}
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{c.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 모임 문의 ────────────────────────────────────────── */}
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
              <Button variant="secondary" onClick={handleSubmitInquiry} disabled={!inquiry.trim() || submittingInquiry}>
                {submittingInquiry ? "등록 중..." : "문의하기"}
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

          {inquiryLoading && <div style={{ marginTop: 16, color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 13 }}>불러오는 중...</div>}

          {!inquiryLoading && inquiries.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {inquiries.map((q) => (
                <div
                  key={q.inquiryId}
                  style={{
                    background: "var(--surface-card)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Icon name="message-circle" size={14} color="var(--muted)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>{q.content}</div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>{formatRelativeTime(q.createdAt)}</div>
                    </div>
                    {q.canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(q.inquiryId)}
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
                    )}
                  </div>

                  {/* 호스트 답변 (등록된 경우) */}
                  {q.answer && (
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
                        <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--muted)" }}>{formatRelativeTime(q.answer.answeredAt)}</span>
                      </div>
                      <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--body)" }}>{q.answer.content}</div>
                    </div>
                  )}

                  {/* 호스트에게만 보이는 답변 작성 UI */}
                  {q.canAnswer && !q.answer && (
                    <div style={{ marginTop: 10, marginLeft: 22 }}>
                      {replyDraftId === q.inquiryId ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <Input
                              placeholder="답변을 입력해주세요"
                              value={replyDraftText}
                              onChange={(e) => setReplyDraftText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSubmitReply(q.inquiryId);
                                }
                                if (e.key === "Escape") handleCancelReply();
                              }}
                            />
                          </div>
                          <Button variant="secondary" onClick={() => handleSubmitReply(q.inquiryId)} disabled={!replyDraftText.trim() || replySubmitting}>
                            등록
                          </Button>
                          <Button variant="ghost" onClick={handleCancelReply}>
                            취소
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStartReply(q.inquiryId)}
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

        <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "sticky", bottom: 0, background: "var(--canvas)", paddingTop: 8 }}>
          {applyError && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--danger, red)" }}>{applyError}</div>}
          <div style={{ display: "flex", gap: 12 }}>
            {isHost ? (
              <>
                <Button variant="primary" size="lg" iconLeft={<Icon name="pencil" size={16} color="var(--on-primary)" />} onClick={() => navigate(`/groups/${group.groupId}/edit`)}>
                  모임 수정
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  iconLeft={<Icon name="trash-2" size={16} color="var(--error)" />}
                  onClick={() => setDeleting(true)}
                  style={{ color: "var(--error)", borderColor: "var(--error)" }}
                >
                  삭제
                </Button>
              </>
            ) : myApplicationLoading ? (
              <Button variant="primary" size="lg" disabled>불러오는 중...</Button>
            ) : myApplication?.status === "PENDING" ? (
              <>
                <Button variant="secondary" size="lg" disabled>승인 대기 중</Button>
                <Button variant="ghost" size="lg" onClick={handleCancelApplication} disabled={cancelLoading}>
                  {cancelLoading ? "취소 중..." : "신청 취소"}
                </Button>
              </>
            ) : myApplication?.status === "APPROVED" ? (
              <Button variant="secondary" size="lg" disabled>이미 참여 중인 모임이에요</Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handleApply} disabled={applyLoading || group.status !== "RECRUITING"}>
                {applyLoading ? "신청 중..." : group.status === "RECRUITING" ? "참여 신청하기" : "모집 마감됨"}
              </Button>
            )}
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
      </div>

      {deleting && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 24 }}>
          <div style={{ background: "var(--canvas)", borderRadius: "var(--radius-xl)", padding: 28, width: "100%", maxWidth: 380, boxShadow: "var(--shadow-raised)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "var(--radius-full)", background: "rgba(239,68,68,.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Icon name="trash-2" size={22} color="var(--error)" />
            </div>
            <h2 style={{ margin: "0 0 var(--space-xs)", fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>모임을 삭제할까요?</h2>
            <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "var(--body)" }}>
              삭제하면 되돌릴 수 없고, 참여 중인 멤버도 모두 모임에서 제거돼요.
            </p>
            {deleteError && (
              <p style={{ margin: "0 0 var(--space-md)", color: "var(--danger, red)", fontSize: 13 }}>{deleteError}</p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="secondary" size="lg" fullWidth onClick={() => setDeleting(false)} disabled={deleteLoading}>취소</Button>
              <Button variant="primary" size="lg" fullWidth onClick={handleDelete} disabled={deleteLoading} style={{ background: "var(--error)" }}>
                {deleteLoading ? "삭제 중..." : "삭제하기"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
