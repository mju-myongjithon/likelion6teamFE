import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Input } from "../components/ds/forms/Input";
import { Avatar } from "../components/ds/display/Avatar";
import { Icon } from "../components/ds/foundations/Icon";
import { ProfilePopover, type ProfilePopoverEvent } from "../components/ds/display/ProfilePopover";
import { getMyProfile } from "../api/profileApi";
import { logout } from "../api/authApi";

export type AppNavId = "home" | "my" | "chat" | "mypage";

interface NavItem { id: AppNavId; label: string; icon: string; to: string; }

export const APP_NAV: NavItem[] = [
  { id: "home", label: "둘러보기", icon: "compass", to: "/home" },
  { id: "my", label: "내 모임", icon: "users", to: "/my-groups" },
  { id: "chat", label: "채팅", icon: "message-circle", to: "/chat" },
  { id: "mypage", label: "마이페이지", icon: "user", to: "/mypage" },
];

const PROFILE_EVENTS: ProfilePopoverEvent[] = [
  { title: "주말 알고리즘 스터디", when: "토 오후 2시" },
  { title: "AI 논문 리딩 그룹", when: "수 저녁 8시" },
  { title: "AI 해커톤 2026", when: "2/14 오전 10시" },
];

function Sidebar(): JSX.Element {
  return (
    <aside style={{ width: 240, flexShrink: 0, borderRight: "1px solid var(--hairline)", background: "var(--canvas)", padding: 20, boxSizing: "border-box", display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflowY: "auto" }}>
      <NavLink to="/home" style={{ display: "flex", alignItems: "center", gap: 8, padding: "var(--space-xs) var(--space-xs)", marginBottom: 24, textDecoration: "none" }}>
        <span style={{ width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--primary)" }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>CampusLink</span>
      </NavLink>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {APP_NAV.map((n) => (
          <NavLink
            key={n.id}
            to={n.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "var(--space-sm) var(--space-sm)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              background: isActive ? "var(--surface-card)" : "transparent",
              color: isActive ? "var(--ink)" : "var(--muted)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
            })}
          >
            {({ isActive }) => (
              <>
                <Icon name={n.icon} size={18} color={isActive ? "var(--ink)" : "var(--muted)"} />
                {n.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

interface HeaderProps {
  q?: string;
  setQ?: (v: string) => void;
}

function Header({ q, setQ }: HeaderProps): JSX.Element {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const [profileName, setProfileName] = React.useState("");
  const [profileMeta, setProfileMeta] = React.useState("");

  React.useEffect(() => {
    getMyProfile()
      .then((res) => {
        setProfileName(res.data.name);
        setProfileMeta(`${res.data.schoolName} · ${res.data.departmentName}`);
      })
      .catch((err) => console.error("프로필 조회 실패:", err));
  }, []);

  React.useEffect(() => {
    if (!popoverOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [popoverOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      setPopoverOpen(false);
      navigate("/login");
    }
  };

  return (
    <header style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "var(--space-md) var(--space-xl)", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" }}>
      <div style={{ flex: 1, maxWidth: 420 }}>
        <Input placeholder="관심 있는 모임을 검색하세요" iconLeft={<Icon name="search" size={18} />} value={q} onChange={setQ ? (e) => setQ(e.target.value) : undefined} />
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
        <span onClick={() => setPopoverOpen((v) => !v)} style={{ cursor: "pointer" }}><Avatar name={profileName || "나"} tone="violet" /></span>
      </div>
      {popoverOpen && (
        <div ref={popoverRef} style={{ position: "absolute", top: "calc(100% + 8px)", right: 24, zIndex: 20 }}>
          <ProfilePopover
            name={profileName || "..."}
            meta={profileMeta}
            avatarTone="violet"
            events={PROFILE_EVENTS}
            onViewProfile={() => { setPopoverOpen(false); navigate("/mypage"); }}
            onLogout={handleLogout}
          />
        </div>
      )}
    </header>
  );
}

export interface AppShellProps {
  q?: string;
  setQ?: (v: string) => void;
  children?: React.ReactNode;
}

/** App chrome: fixed sidebar + search header + scrollable main. */
export function AppShell({ q, setQ, children }: AppShellProps): JSX.Element {
  return (
    <div style={{ display: "flex", height: "100%", background: "var(--surface-soft)", fontFamily: "var(--font-sans)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <Header q={q} setQ={setQ} />
        <main style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "var(--canvas)" }}>{children}</main>
      </div>
    </div>
  );
}