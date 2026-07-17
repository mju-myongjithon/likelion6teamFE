import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Icon } from "../components/ds/foundations/Icon";
import { login } from "../api/authApi";

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
export function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      const message =
        err?.response?.data?.message ?? "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Brand />
      <h1 className="cl-display-sm" style={{ margin: 0 }}>다시 만나 반가워요</h1>
      <p style={{ margin: "var(--space-xs) 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>학교 이메일로 로그인하세요</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="학교 이메일">
          <Input
            placeholder="you@univ.ac.kr"
            iconLeft={<Icon name="mail" size={18} />}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
        </Field>
        <Field label="비밀번호">
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            iconLeft={<Icon name="lock" size={18} />}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
        </Field>
        {error && (
          <p style={{ margin: 0, color: "var(--danger, red)", fontSize: 13, fontFamily: "var(--font-sans)" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <a href="#" style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>비밀번호를 잊으셨나요?</a>
        </div>
        <Button variant="primary" size="lg" fullWidth onClick={handleLogin} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "var(--space-xxs) 0" }}>
          <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted-soft)" }}>또는</span>
          <span style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
        </div>
        <div style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)" }}>
          아직 계정이 없으신가요?{" "}
          <Link to="/signup" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none" }}>회원가입</Link>
        </div>
      </div>
    </AuthShell>
  );
}