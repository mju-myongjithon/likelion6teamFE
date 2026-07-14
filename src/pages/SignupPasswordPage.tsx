import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Callout } from "../components/ds/feedback/Callout";
import { ProgressBar } from "../components/ds/feedback/ProgressBar";
import { Icon } from "../components/ds/foundations/Icon";

function Brand(): JSX.Element {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
      <span style={{ width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "inline-block" }} />
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>CampusLink</span>
    </div>
  );
}

function AuthShell({ children }: { children?: React.ReactNode }): JSX.Element {
  return (
    <div style={{ minHeight: "100%", background: "var(--canvas)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "var(--space-xxl) var(--space-lg)" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
    </div>
  );
}

/** CampusLink 회원가입 2단계 — 비밀번호 설정. */
export function SignupPasswordPage(): JSX.Element {
  const navigate = useNavigate();
  return (
    <AuthShell>
      <Brand />
      <h1 className="cl-display-sm" style={{ margin: 0 }}>비밀번호를 설정해 주세요</h1>
      <p style={{ margin: "var(--space-xs) 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>로그인할 때 사용할 비밀번호예요</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="비밀번호">
          <Input type="password" placeholder="영문, 숫자 포함 8자 이상" iconLeft={<Icon name="lock" size={18} />} />
        </Field>
        <Field label="비밀번호 확인">
          <Input type="password" placeholder="비밀번호를 한 번 더 입력해 주세요" iconLeft={<Icon name="lock" size={18} />} />
        </Field>
        <Callout>영문 · 숫자 · 특수문자 중 2가지 이상을 조합해 주세요</Callout>
        <ProgressBar step={2} total={5} />
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary" size="lg" onClick={() => navigate("/signup")}>이전</Button>
          <Button variant="primary" size="lg" fullWidth iconRight={<Icon name="arrow-right" size={18} color="var(--on-primary)" />} onClick={() => navigate("/signup/profile")}>다음</Button>
        </div>
      </div>
    </AuthShell>
  );
}
