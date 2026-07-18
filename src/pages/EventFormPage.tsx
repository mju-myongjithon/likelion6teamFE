import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../layouts/AppShell";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Textarea } from "../components/ds/forms/Textarea";
import { Field } from "../components/ds/forms/Field";
import { Icon } from "../components/ds/foundations/Icon";
import {
  createEvent,
  updateEvent,
  getEventDetail,
  type EventRequest,
} from "../api/eventApi";

/** ISO 8601 UTC 문자열 → <input type="datetime-local">에 넣을 수 있는 로컬 시각 문자열. */
function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** datetime-local 입력값(로컬 시각) → 서버에 보낼 ISO 8601 UTC 문자열. */
function toIsoString(localValue: string): string {
  const d = new Date(localValue);
  return d.toISOString();
}

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

function TagInput({ tags, onChange }: TagInputProps): JSX.Element {
  const [value, setValue] = React.useState("");

  function commit(): void {
    const v = value.trim();
    if (v && !tags.includes(v) && tags.length < 20) {
      onChange([...tags, v]);
    }
    setValue("");
  }

  function remove(t: string): void {
    onChange(tags.filter((x) => x !== t));
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <Input
            placeholder="태그 입력 후 Enter (예: AI, 온라인)"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Enter") { e.preventDefault(); commit(); }
            }}
          />
        </div>
        <Button variant="secondary" onClick={commit} disabled={!value.trim()}>추가</Button>
      </div>
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {tags.map((t) => (
            <span
              key={t}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid var(--hairline)",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--ink)",
              }}
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                aria-label={`${t} 태그 삭제`}
                style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", padding: 0 }}
              >
                <Icon name="x" size={12} color="var(--muted)" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** 해커톤·행사 등록/수정 폼 — /events/new, /events/:eventId/edit 에서 공용으로 사용. */
export function EventFormPage(): JSX.Element {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const isEditMode = Boolean(eventId);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [organizer, setOrganizer] = React.useState("");
  const [applicationDeadlineAt, setApplicationDeadlineAt] = React.useState("");
  const [startsAt, setStartsAt] = React.useState("");
  const [endsAt, setEndsAt] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [relatedUrl, setRelatedUrl] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [loadingDetail, setLoadingDetail] = React.useState(isEditMode);

  React.useEffect(() => {
    if (!isEditMode || !eventId) return;
    getEventDetail(eventId)
      .then((res) => {
        const e = res.data;
        setTitle(e.title);
        setDescription(e.description);
        setOrganizer(e.organizer);
        setApplicationDeadlineAt(toLocalInputValue(e.applicationDeadlineAt));
        setStartsAt(toLocalInputValue(e.startsAt));
        setEndsAt(toLocalInputValue(e.endsAt));
        setLocation(e.location);
        setRelatedUrl(e.relatedUrl);
        setTags(e.tags);
      })
      .catch((err) => {
        console.error("행사 정보 조회 실패:", err);
        setError("행사 정보를 불러오지 못했습니다.");
      })
      .finally(() => setLoadingDetail(false));
  }, [isEditMode, eventId]);

  async function handleSubmit(): Promise<void> {
    if (!title.trim() || !description.trim() || !organizer.trim() || !location.trim() || !relatedUrl.trim()) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!applicationDeadlineAt || !startsAt || !endsAt) {
      setError("일정(신청 마감·시작·종료)을 모두 입력해주세요.");
      return;
    }
    if (tags.length === 0) {
      setError("태그를 최소 1개 이상 추가해주세요.");
      return;
    }

    const payload: EventRequest = {
      title: title.trim(),
      description: description.trim(),
      organizer: organizer.trim(),
      applicationDeadlineAt: toIsoString(applicationDeadlineAt),
      startsAt: toIsoString(startsAt),
      endsAt: toIsoString(endsAt),
      location: location.trim(),
      relatedUrl: relatedUrl.trim(),
      tags,
    };

    setError(null);
    setLoading(true);
    try {
      if (isEditMode && eventId) {
        await updateEvent(eventId, payload);
        navigate(`/events/${eventId}`);
      } else {
        const res = await createEvent(payload);
        navigate(`/events/${res.data.eventId}`);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "저장에 실패했습니다.");
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
          onClick={(e) => { e.preventDefault(); navigate(isEditMode && eventId ? `/events/${eventId}` : "/home"); }}
          href="#"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 20 }}
        >
          <Icon name="arrow-left" size={16} color="var(--muted)" /> {isEditMode ? "행사로" : "목록으로"}
        </a>
        <h1 className="cl-display-sm" style={{ margin: "0 0 var(--space-xs)" }}>
          {isEditMode ? "행사 정보 수정" : "새 해커톤·행사 등록"}
        </h1>
        <p style={{ margin: "0 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>
          {isEditMode ? "일정과 소개를 최신 상태로 유지하세요" : "행사 정보를 입력하면 바로 목록에 노출돼요"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Field label="행사 이름" labelAside={`${title.length} / 100자`}>
            <Input placeholder="2026 CampusLink 해커톤" maxLength={100} value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
          </Field>

          <Field label="행사 소개" labelAside={`${description.length} / 2000자`}>
            <Textarea rows={4} maxLength={2000} placeholder="행사 주제, 진행 방식, 참가 대상, 시상 내역 등을 자세히 소개해주세요" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="주최">
              <Input placeholder="CampusLink" maxLength={100} value={organizer} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOrganizer(e.target.value)} />
            </Field>
            <Field label="장소">
              <Input placeholder="코엑스 D홀 / 온라인" maxLength={200} value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="신청 마감">
              <Input type="datetime-local" value={applicationDeadlineAt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApplicationDeadlineAt(e.target.value)} />
            </Field>
            <Field label="시작 일시">
              <Input type="datetime-local" value={startsAt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartsAt(e.target.value)} />
            </Field>
            <Field label="종료 일시">
              <Input type="datetime-local" value={endsAt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndsAt(e.target.value)} />
            </Field>
          </div>

          <Field label="관련 링크" hint="공식 홈페이지, 신청 폼 등">
            <Input placeholder="https://example.com/events/campuslink-2026" maxLength={2048} value={relatedUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRelatedUrl(e.target.value)} />
          </Field>

          <Field label="태그" hint="최소 1개 이상 추가해주세요">
            <TagInput tags={tags} onChange={setTags} />
          </Field>

          {error && <p style={{ margin: 0, color: "var(--danger, red)", fontSize: 13 }}>{error}</p>}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" size="lg" onClick={() => navigate(isEditMode && eventId ? `/events/${eventId}` : "/home")}>
              취소
            </Button>
            <Button variant="primary" size="lg" onClick={handleSubmit} disabled={loading}>
              {loading ? "저장 중..." : isEditMode ? "수정 완료" : "행사 등록하기"}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
