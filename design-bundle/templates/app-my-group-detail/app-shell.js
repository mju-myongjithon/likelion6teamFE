// Shared app shell for CampusLink app-* template previews.
// Plain-JS runtime build; canonical typed source lives in AppShell.tsx.
(function () {
  const DS_NAMESPACE = "CampusLinkDesignSystem_e2dcda";
  function getDS() {
    const ns = window[DS_NAMESPACE];
    if (!ns) throw new Error("CampusLink design system not loaded");
    return ns;
  }

  const NAV = [
    { id: "home", label: "둘러보기", icon: "compass", href: "../app-home/Home.dc.html" },
    { id: "my", label: "내 모임", icon: "users", href: "../app-my-groups/MyGroups.dc.html" },
    { id: "chat", label: "채팅", icon: "message-circle", href: "../app-chat/Chat.dc.html" },
    { id: "mypage", label: "마이페이지", icon: "user", href: "../app-mypage/MyPage.dc.html" },
  ];

  function Sidebar({ active }) {
    const { Button, Icon } = getDS();
    return (
      React.createElement("aside", { style: { width: 240, flexShrink: 0, borderRight: "1px solid var(--hairline)", background: "var(--canvas)", padding: 20, boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflowY: "auto" } },
        React.createElement("a", { href: "../app-home/Home.dc.html", style: { display: "flex", alignItems: "center", gap: 8, padding: "var(--space-xs) var(--space-xs)", marginBottom: 24, textDecoration: "none" } },
          React.createElement("span", { style: { width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)" } }),
          React.createElement("span", { style: { fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" } }, "CampusLink")
        ),
        React.createElement("nav", { style: { display: "flex", flexDirection: "column", gap: 2 } },
          NAV.map((n) => {
            const on = n.id === active;
            return React.createElement("a", { key: n.id, href: n.href, style: {
              display: "flex", alignItems: "center", gap: 10, padding: "var(--space-sm) var(--space-sm)", borderRadius: "var(--radius-md)",
              textDecoration: "none", background: on ? "var(--surface-card)" : "transparent",
              color: on ? "var(--ink)" : "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: on ? 600 : 500,
            } },
              React.createElement(Icon, { name: n.icon, size: 18, color: on ? "var(--ink)" : "var(--muted)" }),
              n.label
            );
          })
        ),
        React.createElement("div", { style: { marginTop: "auto", padding: 16, background: "var(--surface-card)", borderRadius: "var(--radius-lg)" } },
          React.createElement("div", { style: { fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" } }, "플러스로 업그레이드"),
          React.createElement("div", { style: { fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", margin: "var(--space-xs) 0 var(--space-sm)", lineHeight: 1.4 } }, "무제한 신청과 우선 매칭"),
          React.createElement(Button, { variant: "primary", size: "sm", fullWidth: true }, "업그레이드")
        )
      )
    );
  }

  function Header({ q, setQ, onAvatar }) {
    const { Input, IconButton, Avatar, Icon } = getDS();
    return (
      React.createElement("header", { style: { display: "flex", alignItems: "center", gap: 16, padding: "var(--space-md) var(--space-xl)", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" } },
        React.createElement("div", { style: { flex: 1, maxWidth: 420 } },
          React.createElement(Input, { placeholder: "관심 있는 모임을 검색하세요", iconLeft: React.createElement(Icon, { name: "search", size: 18 }), value: q, onChange: setQ ? (e) => setQ(e.target.value) : undefined })
        ),
        React.createElement("div", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 } },
          React.createElement(IconButton, { "aria-label": "알림" }, React.createElement(Icon, { name: "bell", size: 18 })),
          React.createElement("span", { onClick: onAvatar, style: { cursor: onAvatar ? "pointer" : "default" } },
            React.createElement(Avatar, { name: "나", tone: "violet" })
          )
        )
      )
    );
  }

  function AppShell({ active, q, setQ, onAvatar, children }) {
    return (
      React.createElement("div", { style: { display: "flex", height: "100%", background: "var(--surface-soft)", fontFamily: "var(--font-sans)" } },
        React.createElement(Sidebar, { active }),
        React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 } },
          React.createElement(Header, { q, setQ, onAvatar }),
          React.createElement("main", { style: { flex: 1, minHeight: 0, overflowY: "auto", background: "var(--canvas)" } }, children)
        )
      )
    );
  }

  // Mount a screen component inside a custom element with a single UMD React instance.
  function defineScreen(tagName, ScreenFactory) {
    class ScreenEl extends HTMLElement {
      connectedCallback() {
        this.style.display = "block";
        this.style.height = "100%";
        const boot = () => {
          if (!window.React || !window.ReactDOM || typeof window[DS_NAMESPACE] !== "object") { setTimeout(boot, 40); return; }
          if (!this._root) this._root = window.ReactDOM.createRoot(this);
          this._root.render(React.createElement(ScreenFactory()));
        };
        boot();
      }
      disconnectedCallback() { if (this._root) { this._root.unmount(); this._root = null; } }
    }
    if (!customElements.get(tagName)) customElements.define(tagName, ScreenEl);
  }

  window.CampusLinkAppShell = { getDS, AppShell, defineScreen, NAV };
})();
