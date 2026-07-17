/**
 * Login — CampusLink login screen (template screen).
 *
 * Typed, handoff-ready source. Resolves the design system via getDS() at render
 * time. Production handoff: replace getDS() with real imports from the DS package.
 */
import React from "react";
import type { ButtonProps } from "../../components/actions/Button";
import type { InputProps } from "../../components/forms/Input";
import type { FieldProps } from "../../components/forms/Field";
import type { IconProps } from "../../components/foundations/Icon";

interface CampusLinkDS {
  Button: React.FC<ButtonProps>;
  Input: React.FC<InputProps>;
  Field: React.FC<FieldProps>;
  Icon: React.FC<IconProps>;
}

const DS_NAMESPACE = "CampusLinkDesignSystem_e2dcda";
function getDS(): CampusLinkDS {
  const ns = (window as unknown as Record<string, CampusLinkDS | undefined>)[DS_NAMESPACE];
  if (!ns) throw new Error(`CampusLink design system (${DS_NAMESPACE}) not loaded`);
  return ns;
}

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
      <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
    </div>
  );
}

/** CampusLink login screen. */
export function Login(): JSX.Element {
  const { Button, Input, Field, Icon } = getDS();
  return (
    <AuthShell>
      <Brand />
      <h1 className="cl-display-sm" style={{ margin: 0 }}>다시 만나 반가워요</h1>
      <p style={{ margin: "var(--space-xs) 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>학교 이메일로 로그인하세요</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="학교 이메일">
          <Input placeholder="you@univ.ac.kr" iconLeft={<Icon name="mail" size={18} />} />
        </Field>
        <Field label="비밀번호">
          <Input type="password" placeholder="비밀번호를 입력하세요" iconLeft={<Icon name="lock" size={18} />} />
        </Field>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="#" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>비밀번호를 잊으셨나요?</a>
        </div>
        <Button variant="primary" size="lg" fullWidth>로그인</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "var(--space-xxs) 0" }}>
          <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted-soft)" }}>또는</span>
          <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
        </div>
        <div style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)" }}>
          아직 계정이 없으신가요?{" "}
          <a href="../app-signup/Signup.dc.html" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none" }}>회원가입</a>
        </div>
      </div>
    </AuthShell>
  );
}
