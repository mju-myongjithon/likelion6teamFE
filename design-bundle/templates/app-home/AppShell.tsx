/**
 * AppShell — shared CampusLink app chrome (sidebar + header) for app-* screens.
 *
 * Canonical typed source. Screens in sibling app-* folders import this via a
 * relative path. Resolves the design system through getDS() at render time.
 * Production handoff: replace getDS() with real imports and keep AppShell as a
 * shared layout component in your app package.
 */
import React from "react";
import type { ButtonProps } from "../../components/actions/Button";
import type { IconButtonProps } from "../../components/actions/IconButton";
import type { InputProps } from "../../components/forms/Input";
import type { AvatarProps } from "../../components/display/Avatar";
import type { IconProps } from "../../components/foundations/Icon";

interface ShellDS {
  Button: React.FC<ButtonProps>;
  IconButton: React.FC<IconButtonProps>;
  Input: React.FC<InputProps>;
  Avatar: React.FC<AvatarProps>;
  Icon: React.FC<IconProps>;
}

const DS_NAMESPACE = "CampusLinkDesignSystem_e2dcda";
export function getDS<T = ShellDS>(): T {
  const ns = (window as unknown as Record<string, T | undefined>)[DS_NAMESPACE];
  if (!ns) throw new Error(`CampusLink design system (${DS_NAMESPACE}) not loaded`);
  return ns;
}

export type AppNavId = "home" | "my" | "chat" | "mypage";

interface NavItem { id: AppNavId; label: string; icon: string; href: string; }

export const APP_NAV: NavItem[] = [
  { id: "home", label: "둘러보기", icon: "compass", href: "../app-home/Home.dc.html" },
  { id: "my", label: "내 모임", icon: "users", href: "../app-my-groups/MyGroups.dc.html" },
  { id: "chat", label: "채팅", icon: "message-circle", href: "../app-chat/Chat.dc.html" },
  { id: "mypage", label: "마이페이지", icon: "user", href: "../app-mypage/MyPage.dc.html" },
];

function Sidebar({ active }: { active: AppNavId }): JSX.Element {
  const { Button, Icon } = getDS();
  return (
    <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--hairline)", background: "var(--canvas)", padding: 20, boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflowY: "auto" }}>
      <a href="../app-home/Home.dc.html" style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--space-xs) var(--space-xs)", marginBottom: 24, textDecoration: "none" }}>
        <span style={{ width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)" }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>CampusLink</span>
      </a>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {APP_NAV.map((n) => {
          const on = n.id === active;
          return (
            <a key={n.id} href={n.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "var(--space-sm) var(--space-sm)", borderRadius: "var(--radius-md)", textDecoration: "none", background: on ? "var(--surface-card)" : "transparent", color: on ? "var(--ink)" : "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: on ? 600 : 500 }}>
              <Icon name={n.icon} size={18} color={on ? "var(--ink)" : "var(--muted)"} />
              {n.label}
            </a>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", padding: 16, background: "var(--surface-card)", borderRadius: "var(--radius-lg)" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>플러스로 업그레이드</div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", margin: "var(--space-xs) 0 var(--space-sm)", lineHeight: 1.4 }}>무제한 신청과 우선 매칭</div>
        <Button variant="primary" size="sm" fullWidth>업그레이드</Button>
      </div>
    </aside>
  );
}

interface HeaderProps { q?: string; setQ?: (v: string) => void; onAvatar?: () => void; }

function Header({ q, setQ, onAvatar }: HeaderProps): JSX.Element {
  const { Input, IconButton, Avatar, Icon } = getDS();
  return (
    <header style={{ display: "flex", alignItems: "center", gap: 16, padding: "var(--space-md) var(--space-xl)", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" }}>
      <div style={{ flex: 1, maxWidth: 420 }}>
        <Input placeholder="관심 있는 모임을 검색하세요" iconLeft={<Icon name="search" size={18} />} value={q} onChange={setQ ? (e) => setQ(e.target.value) : undefined} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <IconButton aria-label="알림"><Icon name="bell" size={18} /></IconButton>
        <span onClick={onAvatar} style={{ cursor: onAvatar ? "pointer" : "default" }}><Avatar name="나" tone="violet" /></span>
      </div>
    </header>
  );
}

export interface AppShellProps {
  active: AppNavId;
  q?: string;
  setQ?: (v: string) => void;
  onAvatar?: () => void;
  children?: React.ReactNode;
}

/** App chrome: fixed sidebar + search header + scrollable main. */
export function AppShell({ active, q, setQ, onAvatar, children }: AppShellProps): JSX.Element {
  return (
    <div style={{ display: "flex", height: "100%", background: "var(--surface-soft)", fontFamily: "var(--font-sans)" }}>
      <Sidebar active={active} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <Header q={q} setQ={setQ} onAvatar={onAvatar} />
        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "var(--canvas)" }}>{children}</main>
      </div>
    </div>
  );
}
