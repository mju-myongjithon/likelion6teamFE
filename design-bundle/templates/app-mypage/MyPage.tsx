/**
 * MyPage — CampusLink 마이페이지 (프로필, 활동 통계, 캘린더). Typed handoff source.
 */
import React from "react";
import { AppShell, getDS } from "../app-home/AppShell";
import type { AvatarProps } from "../../components/display/Avatar";
import type { BadgeProps } from "../../components/display/Badge";
import type { ButtonProps } from "../../components/actions/Button";
import type { StatProps } from "../../components/display/Stat";
import type { CalendarProps } from "../../components/display/Calendar";
import type { IconProps } from "../../components/foundations/Icon";

interface MyPageDS {
  Avatar: React.FC<AvatarProps>;
  Badge: React.FC<BadgeProps>;
  Button: React.FC<ButtonProps>;
  Stat: React.FC<StatProps>;
  Calendar: React.FC<CalendarProps>;
  Icon: React.FC<IconProps>;
}

const INTERESTS = ["AI", "개발", "창업"];

const ACTIVITY = [
  { text: "주말 알고리즘 스터디에 참여했어요", when: "2일 전" },
  { text: "AI 해커톤 2026에 신청했어요", when: "5일 전" },
  { text: "겨울 디자인 워크샵을 완료했어요", when: "3주 전" },
];

/** 마이페이지 — 프로필 정보, 활동 통계, 캘린더. */
export function MyPage(): JSX.Element {
  const { Avatar, Badge, Button, Stat, Calendar, Icon } = getDS<MyPageDS>();
  return (
    <AppShell active="mypage">
      <div style={{ padding: 28, maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          <Avatar name="정지훈" tone="violet" size={72} />
          <div style={{ flex: 1 }}>
            <h1 className="cl-display-sm" style={{ margin: 0 }}>정지훈</h1>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)", margin: "var(--space-xs) 0 var(--space-sm)" }}>한양대학교 · 컴퓨터공학과 · 서울 성동구</div>
            <div style={{ display: "flex", gap: 6 }}>
              {INTERESTS.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
          <Button variant="secondary" iconLeft={<Icon name="pencil" size={15} />}>프로필 수정</Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          <Stat value={12} label="참여한 모임" icon={<Icon name="users" size={18} />} />
          <Stat value="94%" label="AI 매칭 성사율" icon={<Icon name="sparkles" size={18} />} />
          <Stat value={6} label="이번 달 활동" icon={<Icon name="calendar-check" size={18} />} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `1fr calc(var(--space-section) * 3 + var(--space-xl))`, gap: 20, alignItems: "start" }}>
          <div>
            <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>자기소개</h2>
            <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 20, marginBottom: 28, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
              함께 프로젝트 할 팀원을 찾고 있어요. 편하게 말 걸어주세요!
            </div>
            <h2 style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, color: "var(--ink)" }}>최근 활동</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "var(--space-sm) 0", borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--hairline-soft)" : "none" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "var(--radius-full)", background: "var(--ink)" }} />
                  <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--ink)" }}>{a.text}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted-soft)" }}>{a.when}</span>
                </div>
              ))}
            </div>
          </div>
          <Calendar monthLabel="2026년 2월" startOffset={0} daysInMonth={28} today={9} events={[{ day: 1 }, { day: 8 }, { day: 9 }, { day: 15 }, { day: 22 }]} />
        </div>
      </div>
    </AppShell>
  );
}
