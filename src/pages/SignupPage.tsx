import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ds/actions/Button";
import { Input } from "../components/ds/forms/Input";
import { Field } from "../components/ds/forms/Field";
import { Callout } from "../components/ds/feedback/Callout";
import { ProgressBar } from "../components/ds/feedback/ProgressBar";
import { Icon } from "../components/ds/foundations/Icon";
import { sendVerificationCode } from "../api/authApi";

function apiErrorMessage(error: unknown, fallback: string): string {
  return axios.isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message ?? fallback
    : fallback;
}

// 백엔드에 별도의 "인증코드 확인" API가 없음 (POST /api/auth/signup 에서
// email + verificationCode를 함께 검증함). 그래서 여기서는 형식만
// 로컬로 체크하고, 실제 검증은 마지막 회원가입 제출 시점에 이루어짐.
const CODE_PATTERN = /^\d{6}$/;

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

/** CampusLink 회원가입 1단계 — 학교 이메일 재학생 인증. */
export function SignupPage(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [sent, setSent] = React.useState<boolean>(false);
  const [verified, setVerified] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  const handleSendCode = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }
    setError(null);
    setVerified(false);
    setSending(true);
    try {
      await sendVerificationCode(email);
      setSent(true);
    } catch (err: unknown) {
      setError(apiErrorMessage(err, "인증코드 발송에 실패했습니다."));
    } finally {
      setSending(false);
    }
  };

  const handleVerify = () => {
    if (!email || !verificationCode) {
      setError("이메일과 인증코드를 모두 입력해주세요.");
      return;
    }
    if (!CODE_PATTERN.test(verificationCode)) {
      setVerified(false);
      setError("인증코드는 숫자 6자리여야 합니다.");
      return;
    }
    // 실제 인증코드 검증은 회원가입 제출(POST /api/auth/signup) 시점에
    // 백엔드가 수행함. 코드가 틀리면 마지막 단계에서 에러로 안내됨.
    setError(null);
    setVerified(true);
  };

  const handleNext = () => {
    if (!verified) {
      setError("먼저 인증코드 확인을 완료해주세요.");
      return;
    }
    navigate("/signup/password", { state: { email, verificationCode } });
  };

  return (
    <AuthShell>
      <Brand />
      <h1 className="cl-display-sm" style={{ margin: 0 }}>학교 이메일로 시작하기</h1>
      <p style={{ margin: "var(--space-xs) 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>재학생 인증 후 프로필을 만들어요</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="학교 이메일">
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="you@univ.ac.kr"
                iconLeft={<Icon name="mail" size={18} />}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setVerified(false);
                }}
              />
            </div>
            <Button variant="secondary" onClick={handleSendCode} disabled={sending}>
              {sending ? "발송 중..." : "인증요청"}
            </Button>
          </div>
        </Field>
        <Field label="인증코드">
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="------"
                style={{ letterSpacing: 8, textAlign: "center" }}
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setVerificationCode(e.target.value);
                  setVerified(false);
                }}
              />
            </div>
            <Button variant="secondary" onClick={handleVerify} disabled={verified}>
              {verified ? "확인됨" : "확인"}
            </Button>
          </div>
        </Field>
        {sent && !verified && <Callout>{email} 로 인증코드를 보냈어요 · 03:00 남음</Callout>}
        {verified && (
          <p style={{ margin: 0, color: "var(--success, green)", fontSize: 14, fontFamily: "var(--font-sans)" }}>
            ✓ 인증에 성공했습니다.
          </p>
        )}
        {error && <p style={{ margin: 0, color: "var(--danger, red)", fontSize: 13 }}>{error}</p>}
        <ProgressBar step={1} total={5} />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          iconRight={<Icon name="arrow-right" size={18} color="var(--on-primary)" />}
          onClick={handleNext}
          disabled={!verified}
        >
          다음으로
        </Button>
        <div style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)" }}>
          이미 계정이 있으신가요?{" "}
          <Link to="/login" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none" }}>로그인</Link>
        </div>
      </div>
    </AuthShell>
  );
}
