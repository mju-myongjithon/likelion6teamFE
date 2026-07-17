/**
 * Login.preview.jsx — RUNTIME MOUNT for the template preview only.
 * Canonical typed source: Login.tsx. Mounted via a custom element so render +
 * hooks + the DS bundle share one UMD React instance.
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
      <div style={{ width: "100%", maxWidth: 420 }}>{children}</div>
    </div>
  );
}

function Login() {
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

class CampusLinkLoginElement extends HTMLElement {
  connectedCallback() {
    this.style.display = "block";
    const boot = () => {
      if (!window.React || !window.ReactDOM || typeof window[DS_NAMESPACE] !== "object") { setTimeout(boot, 40); return; }
      React = window.React;
      if (!this._root) this._root = window.ReactDOM.createRoot(this);
      this._root.render(React.createElement(Login));
    };
    boot();
  }
  disconnectedCallback() { if (this._root) { this._root.unmount(); this._root = null; } }
}
if (!customElements.get("campuslink-login")) customElements.define("campuslink-login", CampusLinkLoginElement);
