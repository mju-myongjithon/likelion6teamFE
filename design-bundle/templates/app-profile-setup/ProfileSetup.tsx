/**
 * ProfileSetup — CampusLink 회원가입 3단계 (프로필 등록). Typed handoff source.
 */
import React from "react";
import type { ButtonProps } from "../../components/actions/Button";
import type { InputProps } from "../../components/forms/Input";
import type { TextareaProps } from "../../components/forms/Textarea";
import type { FieldProps } from "../../components/forms/Field";
import type { ChipProps } from "../../components/forms/Chip";
import type { ProgressBarProps } from "../../components/feedback/ProgressBar";
import type { IconProps } from "../../components/foundations/Icon";

interface CampusLinkDS {
  Button: React.FC<ButtonProps>;
  Input: React.FC<InputProps>;
  Textarea: React.FC<TextareaProps>;
  Field: React.FC<FieldProps>;
  Chip: React.FC<ChipProps>;
  ProgressBar: React.FC<ProgressBarProps>;
  Icon: React.FC<IconProps>;
}

const DS_NAMESPACE = "CampusLinkDesignSystem_e2dcda";
function getDS(): CampusLinkDS {
  const ns = (window as unknown as Record<string, CampusLinkDS | undefined>)[DS_NAMESPACE];
  if (!ns) throw new Error(`CampusLink design system (${DS_NAMESPACE}) not loaded`);
  return ns;
}

const INTERESTS = ["AI", "개발", "창업", "디자인", "공모전", "여행"];
const PURPOSES = ["프로젝트", "스터디", "친목", "행사·네트워킹"];
const ROLES = ["프론트엔드", "기획", "디자인", "백엔드", "데이터"];

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
  const { Chip } = getDS();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((t) => <Chip key={t} active={sel.includes(t)} onClick={() => toggle(t)}>{t}</Chip>)}
      {add && <Chip variant="add">+ 직접입력</Chip>}
    </div>
  );
}

/** CampusLink 회원가입 3단계 — 프로필 등록. */
export function ProfileSetup(): JSX.Element {
  const { Button, Input, Textarea, Field, ProgressBar, Icon } = getDS();
  const [interests, toggleInterest] = useToggle(["AI", "개발", "창업"], 3);
  const [purpose, togglePurpose] = useToggle(["프로젝트"]);
  const [role, toggleRole] = useToggle(["프론트엔드"]);
  return (
    <div style={{ minHeight: "100%", background: "var(--canvas)", display: "flex", justifyContent: "center", padding: "var(--space-xxl) var(--space-lg) var(--space-xxl)" }}>
      <div style={{ width: "100%", maxWidth: 620 }}>
        <ProgressBar step={3} total={5} style={{ marginBottom: 20 }} />
        <h1 className="cl-display-sm" style={{ margin: 0 }}>프로필을 등록해 주세요</h1>
        <p style={{ margin: "var(--space-xs) 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>AI가 이 정보를 바탕으로 어울리는 사람과 모임을 찾아드려요</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", background: "var(--surface-card)", border: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", flexShrink: 0 }}>
              <Icon name="camera" size={22} color="var(--muted)" />
            </div>
            <div style={{ flex: 1 }}>
              <Field label="이름"><Input placeholder="정지훈" /></Field>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="학교 / 학과"><Input placeholder="한양대학교 · 컴퓨터공학과" /></Field>
            <Field label="사는 곳"><Input placeholder="서울 · 성동구" iconLeft={<Icon name="map-pin" size={18} />} /></Field>
          </div>
          <Field label="관심사" labelAside={`${interests.length} / 3 선택`}>
            <ChipRow items={INTERESTS} sel={interests} toggle={toggleInterest} add />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="활동 목적"><ChipRow items={PURPOSES} sel={purpose} toggle={togglePurpose} /></Field>
            <Field label="역할"><ChipRow items={ROLES} sel={role} toggle={toggleRole} /></Field>
          </div>
          <Field label="자기소개">
            <Textarea rows={3} placeholder="함께 프로젝트 할 팀원을 찾고 있어요. 편하게 말 걸어주세요!" />
          </Field>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="secondary" size="lg">이전</Button>
            <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={18} color="var(--on-primary)" />}>다음</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
