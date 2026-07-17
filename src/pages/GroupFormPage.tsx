import React from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Textarea } from "../components/ds/forms/Textarea";
import { Field } from "../components/ds/forms/Field";
import { Icon } from "../components/ds/foundations/Icon";
import {
  createGroup,
  updateGroup,
  getGroupDetail,
  type GroupRequest,
  type RecruitingRoleRequest,
} from "../api/groupApi";

function apiErrorMessage(error: unknown, fallback: string): string {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? fallback
    : fallback;
}

interface RoleRow extends RecruitingRoleRequest {
  key: string;
}

function emptyRole(): RoleRow {
  return { key: `${Date.now()}-${Math.random()}`, role: "", skill: "" };
}

/** 스터디 모임 등록/수정 폼 — /groups/new, /groups/:groupId/edit 에서 공용으로 사용. */
export function GroupFormPage(): JSX.Element {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const isEditMode = Boolean(groupId);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [maxMemberCount, setMaxMemberCount] = React.useState("8");
  const [meetingRule, setMeetingRule] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [roles, setRoles] = React.useState<RoleRow[]>([emptyRole()]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingDetail, setLoadingDetail] = React.useState(isEditMode);

  React.useEffect(() => {
    if (!isEditMode || !groupId) return;
    getGroupDetail(groupId)
      .then((res) => {
        const g = res.data;
        setTitle(g.title);
        setDescription(g.description);
        setMaxMemberCount(String(g.maxMemberCount));
        setMeetingRule(g.meetingRule);
        setLocation(g.location);
        setRoles(
          g.recruitingRoles.length > 0
            ? g.recruitingRoles.map((r) => ({ key: `${Date.now()}-${Math.random()}`, role: r.role, skill: r.skill ?? "" }))
            : [emptyRole()]
        );
      })
      .catch((err) => {
        console.error("모임 정보 조회 실패:", err);
        setError("모임 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoadingDetail(false));
  }, [isEditMode, groupId]);

  function updateRole(key: string, patch: Partial<RoleRow>): void {
    setRoles((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRole(): void {
    setRoles((prev) => [...prev, emptyRole()]);
  }

  function removeRole(key: string): void {
    setRoles((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }

  async function handleSubmit(): Promise<void> {
    const memberCount = Number(maxMemberCount);
    if (!title.trim() || !description.trim() || !meetingRule.trim() || !location.trim()) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!memberCount || memberCount < 1) {
      setError("정원은 1명 이상이어야 합니다.");
      return;
    }
    const recruitingRoles: RecruitingRoleRequest[] = roles
      .filter((r) => r.role.trim())
      .map((r) => ({ role: r.role.trim(), skill: r.skill?.trim() || null }));

    const payload: GroupRequest = {
      title: title.trim(),
      description: description.trim(),
      maxMemberCount: memberCount,
      meetingRule: meetingRule.trim(),
      location: location.trim(),
      recruitingRoles,
    };

    setError(null);
    setLoading(true);
    try {
      if (isEditMode && groupId) {
        await updateGroup(groupId, payload);
        navigate(`/groups/${groupId}`);
      } else {
        const res = await createGroup(payload);
        navigate(`/groups/${res.data.groupId}`);
      }
    } catch (err: unknown) {
      setError(apiErrorMessage(err, "저장에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  }

  if (loadingDetail) {
    return (
      <AppShell>
        <div style={{ padding: 28 }}>불러오는 중...</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ padding: 28, maxWidth: 680 }}>
        <a
          onClick={(e) => { e.preventDefault(); navigate(isEditMode && groupId ? `/groups/${groupId}` : "/home"); }}
          href="#"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 20 }}
        >
          <Icon name="arrow-left" size={16} color="var(--muted)" /> {isEditMode ? "모임으로" : "목록으로"}
        </a>
        <h1 className="cl-display-sm" style={{ margin: "0 0 var(--space-xs)" }}>
          {isEditMode ? "모임 정보 수정" : "새 스터디 모임 만들기"}
        </h1>
        <p style={{ margin: "0 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>
          {isEditMode ? "모집 조건과 소개를 최신 상태로 유지하세요" : "모임 정보를 입력하면 바로 모집이 시작돼요"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Field label="모임 이름">
            <Input placeholder="주말 알고리즘 스터디" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
          </Field>

          <Field label="모임 소개">
            <Textarea rows={4} placeholder="어떤 모임인지 소개해주세요" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="정원 (리더 포함)">
              <Input type="number" min={1} max={100} placeholder="8" value={maxMemberCount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxMemberCount(e.target.value)} />
            </Field>
            <Field label="장소">
              <Input placeholder="강남" value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
            </Field>
          </div>

          <Field label="모임 일정">
            <Input placeholder="매주 토요일 오후 2시" value={meetingRule} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingRule(e.target.value)} />
          </Field>

          <Field label="모집 역할" hint="역할을 비워두면 저장 시 제외돼요">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {roles.map((r) => (
                <div key={r.key} style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <Input placeholder="역할 (예: 프론트엔드)" value={r.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRole(r.key, { role: e.target.value })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input placeholder="필요 기술 (예: React)" value={r.skill ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRole(r.key, { skill: e.target.value })} />
                  </div>
                  <Button variant="ghost" onClick={() => removeRole(r.key)} disabled={roles.length === 1} aria-label="역할 삭제">
                    <Icon name="x" size={16} />
                  </Button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addRole} iconLeft={<Icon name="plus" size={14} />} style={{ alignSelf: "flex-start" }}>
                역할 추가
              </Button>
            </div>
          </Field>

          {error && <p style={{ margin: 0, color: "var(--danger, red)", fontSize: 13 }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" size="lg" onClick={() => navigate(isEditMode && groupId ? `/groups/${groupId}` : "/home")}>
              취소
            </Button>
            <Button variant="primary" size="lg" onClick={handleSubmit} disabled={loading}>
              {loading ? "저장 중..." : isEditMode ? "수정 완료" : "모임 만들기"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
