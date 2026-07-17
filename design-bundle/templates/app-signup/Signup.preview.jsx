/**
 * Signup.preview.jsx — RUNTIME MOUNT only. Canonical typed source: Signup.tsx.
 */
const DS_NAMESPACE = "CampusLinkDesignSystem_e2dcda";
function getDS() {
  const ns = window[DS_NAMESPACE];
  if (!ns) throw new Error("CampusLink design system not loaded");
  return ns;
}

function Brand() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
      <span style={{ width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)", display: "inline-block" }} />
      <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>CampusLink</span>
    </div>
  );
}

function AuthShell({ children }) {
  return (
    <div style={{ minHeight: "100%", background: "var(--canvas)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "var(--space-xxl) var(--space-lg)" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
    </div>
  );
}

function Signup() {
  const { Button, Input, Field, Callout, ProgressBar, Icon } = getDS();
  const [sent, setSent] = React.useState(false);
  return (
    <AuthShell>
      <Brand />
      <h1 className="cl-display-sm" style={{ margin: 0 }}>학교 이메일로 시작하기</h1>
      <p style={{ margin: "var(--space-xs) 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--muted)" }}>재학생 인증 후 프로필을 만들어요</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="학교 이메일">
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Input placeholder="you@univ.ac.kr" iconLeft={<Icon name="mail" size={18} />} />
            </div>
            <Button variant="secondary" onClick={() => setSent(true)}>인증요청</Button>
          </div>
        </Field>
        <Field label="인증코드">
          <Input placeholder="------" style={{ letterSpacing: 8, textAlign: "center" }} />
        </Field>
        {sent && <Callout>univ.ac.kr 로 인증코드를 보냈어요 · 03:00 남음</Callout>}
        <ProgressBar step={1} total={5} />
        <Button variant="primary" size="lg" fullWidth iconRight={<Icon name="arrow-right" size={18} color="var(--on-primary)" />}>인증하고 다음으로</Button>
        <div style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)" }}>
          이미 계정이 있으신가요?{" "}
          <a href="../app-login/Login.dc.html" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "none" }}>로그인</a>
        </div>
      </div>
    </AuthShell>
  );
}

class CampusLinkSignupElement extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    const boot = () => {
      if (!window.React || !window.ReactDOM || typeof window[DS_NAMESPACE] !== "object") { setTimeout(boot, 40); return; }
      React = window.React;
      if (!this._root) this._root = window.ReactDOM.createRoot(this);
      this._root.render(React.createElement(Signup));
    };
    boot();
  }
  disconnectedCallback() { if (this._root) { this._root.unmount(); this._root = null; } }
}
if (!customElements.get("campuslink-signup")) customElements.define("campuslink-signup", CampusLinkSignupElement);
