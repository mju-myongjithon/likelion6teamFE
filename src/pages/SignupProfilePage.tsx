import React from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Textarea } from "../components/ds/forms/Textarea";
import { Field } from "../components/ds/forms/Field";
import { Chip } from "../components/ds/forms/Chip";
import { ProgressBar } from "../components/ds/feedback/ProgressBar";
import { Icon } from "../components/ds/foundations/Icon";
import { signup } from "../api/authApi";
import { updateMyProfile, type ProfileResponse } from "../api/profileApi";

const INTERESTS = ["AI/머신러닝", "웹개발", "앱개발", "게임개발", "알고리즘•코테", "공모전", "취업준비", "데이터 분석", "보안/해킹", "UI•UX", "창업", "클라우드/인프라"];
const PURPOSES = ["프로젝트", "스터디", "친목", "행사·네트워킹"];
const ROLES = ["프론트엔드", "기획", "디자인", "백엔드", "데이터"];

function apiErrorMessage(error: unknown, fallback: string): string {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? fallback
    : fallback;
}

function useToggle(initial: string[], max?: number): [string[], (t: string) => void] {
  const [sel, setSel] = React.useState<string[]>(initial);
  const toggle = (t: string) => setSel((s) => {
    if (s.includes(t)) return s.filter((x) => x !== t);
    if (max && s.length >= max) return s;
    return [...s, t];
  });
  return [sel, toggle];
}

interface ChipRowProps {
  items: string[];
  sel: string[];
  toggle: (t: string) => void;
  add?: boolean;
}

function ChipRow({ items, sel, toggle, add }: ChipRowProps): JSX.Element {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((t) => <Chip key={t} active={sel.includes(t)} onClick={() => toggle(t)}>{t}</Chip>)}
      {add && <Chip variant="add">+ 직접입력</Chip>}
    </div>
  );
}

interface SignupState {
  email: string;
  verificationCode: string;
  password: string;
  mode?: string;
  profile?: ProfileResponse;
}

/** CampusLink 회원가입 3단계 — 프로필 등록 / 수정. */
export function SignupProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const prevState = location.state as SignupState | null;
  const isEditMode = prevState?.mode === "edit";
  const existing = prevState?.profile;

  const [name, setName] = React.useState(existing?.name ?? "");
  const [schoolName, setSchoolName] = React.useState(existing?.schoolName ?? "");
  const [departmentName, setDepartmentName] = React.useState(existing?.departmentName ?? "");
  const [residenceArea, setResidenceArea] = React.useState(existing?.residenceArea ?? "");
  const [bio, setBio] = React.useState(existing?.bio ?? "");
  const [interests, toggleInterest] = useToggle(existing?.interests ?? ["AI/머신러닝", "웹개발", "창업"], 3);
  const [purpose, togglePurpose] = useToggle(existing?.purposes ?? ["프로젝트"]);
  const [role, toggleRole] = useToggle(existing?.roles ?? ["프론트엔드"]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isEditMode && !prevState?.email) {
      navigate("/signup");
    }
  }, [prevState, isEditMode, navigate]);

  const handleSubmit = async () => {
    if (!name || !schoolName || !departmentName || !residenceArea) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!prevState?.email || !prevState?.verificationCode || !prevState?.password) {
      setError("이전 단계 정보가 없습니다. 처음부터 다시 시도해주세요.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signup({
        email: prevState.email,
        verificationCode: prevState.verificationCode,
        password: prevState.password,
        profile: {
          name,
          schoolName,
          departmentName,
          residenceArea,
          bio,
          interests,
          purposes: purpose,
          roles: role,
        },
      });
      navigate("/home");
    } catch (err: unknown) {
      setError(apiErrorMessage(err, "회원가입에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!name || !schoolName || !departmentName || !residenceArea) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updateMyProfile({
        name,
        schoolName,
        departmentName,
        residenceArea,
        bio,
        interests,
        purposes: purpose,
        roles: role,
      });
      navigate("/mypage");
    } catch (err: unknown) {
      setError(apiErrorMessage(err, "프로필 저장에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100%", background: "var(--canvas)", display: "flex", justifyContent: "center", padding: "var(--space-xxl) var(--space-lg) var(--space-xxl)" }}>
      <div style={{ width: "100%", maxWidth: 620 }}>
        {!isEditMode && <ProgressBar step={3} total={5} style={{ marginBottom: 20 }} />}
        <h1 className="cl-display-sm" style={{ margin: 0 }}>{isEditMode ? "프로필 수정" : "프로필을 등록해 주세요"}</h1>
        <p style={{ margin: "var(--space-xs) 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>
          {isEditMode ? "관심사와 활동 정보를 최신 상태로 유지해주세요" : "AI가 이 정보를 바탕으로 어울리는 사람과 모임을 찾아드려요"}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", background: "var(--surface-card)", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0 }}>
              <Icon name="camera" size={22} color="var(--muted)" />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="이름">
                <Input placeholder="정지훈" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
              </Field>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="학교">
              <Input placeholder="한양대학교" value={schoolName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSchoolName(e.target.value)} />
            </Field>
            <Field label="학과">
              <Input placeholder="컴퓨터공학과" value={departmentName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartmentName(e.target.value)} />
            </Field>
          </div>
          <Field label="사는 곳">
            <Input placeholder="서울 · 성동구" iconLeft={<Icon name="map-pin" size={18} />} value={residenceArea} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setResidenceArea(e.target.value)} />
          </Field>
          <Field label="관심사" labelAside={`${interests.length} / 3 선택`}>
            <ChipRow items={INTERESTS} sel={interests} toggle={toggleInterest} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="활동 목적"><ChipRow items={PURPOSES} sel={purpose} toggle={togglePurpose} /></Field>
            <Field label="역할"><ChipRow items={ROLES} sel={role} toggle={toggleRole} /></Field>
          </div>
          <Field label="자기소개" labelAside={`${bio.length} / 500자`}>
            <Textarea
              rows={6}
              maxLength={500}
              placeholder={"함께 프로젝트 할 팀원을 찾고 있어요. 편하게 말 걸어주세요!\n\n선호하는 스터디 방식, 관심사, 취미 등을 자유롭게 적어보면 좋아요."}
              value={bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
            />
          </Field>
          {error && <p style={{ margin: 0, color: "var(--danger, red)", fontSize: 13 }}>{error}</p>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            {isEditMode ? (
              <>
                <Button variant="secondary" size="lg" onClick={() => navigate("/mypage")}>취소</Button>
                <Button variant="primary" size="lg" onClick={handleEditSave} disabled={loading}>
                  {loading ? "저장 중..." : "저장"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="lg" onClick={() => navigate("/signup/password", { state: prevState })}>이전</Button>
                <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={18} color="var(--on-primary)" />} onClick={handleSubmit} disabled={loading}>
                  {loading ? "가입 중..." : "다음"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
