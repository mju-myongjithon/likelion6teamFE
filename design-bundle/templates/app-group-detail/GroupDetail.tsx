/**
 * GroupDetail — CampusLink 추천 모임 상세 + 참여 신청. Typed handoff source.
 */
import React from "react";
import { AppShell, getDS } from "../app-home/AppShell";
import type { ButtonProps } from "../../components/actions/Button";
import type { InputProps } from "../../components/forms/Input";
import type { FieldProps } from "../../components/forms/Field";
import type { BadgeProps } from "../../components/display/Badge";
import type { AvatarProps, AvatarTone } from "../../components/display/Avatar";
import type { CalloutProps } from "../../components/feedback/Callout";
import type { IconProps } from "../../components/foundations/Icon";

interface DetailDS {
  Button: React.FC<ButtonProps>;
  Input: React.FC<InputProps>;
  Field: React.FC<FieldProps>;
  Badge: React.FC<BadgeProps>;
  Avatar: React.FC<AvatarProps>;
  Callout: React.FC<CalloutProps>;
  Icon: React.FC<IconProps>;
}

interface Member { name: string; tone: AvatarTone; role: string; }
const MEMBERS: Member[] = [
  { name: "김민준", tone: "violet", role: "호스트" },
  { name: "이서연", tone: "pink", role: "멤버" },
  { name: "박도윤", tone: "emerald", role: "멤버" },
  { name: "최유진", tone: "orange", role: "멤버" },
];

function InfoTile({ icon, label, value }: { icon: string; label: string; value: string }): JSX.Element {
  const { Icon } = getDS<DetailDS>();
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", marginBottom: 8 }}>
        <Icon name={icon} size={15} color="var(--muted)" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
    </div>
  );
}

/** 추천 모임 상세 화면. */
export function GroupDetail(): JSX.Element {
  const { Button, Input, Field, Badge, Avatar, Callout, Icon } = getDS<DetailDS>();
  const [inquiry, setInquiry] = React.useState<string>("");
  return (
    <AppShell active="home">
      <div style={{ padding: 28, maxWidth: 780 }}>
        <a href="../app-home/Home.dc.html" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 20 }}>
          <Icon name="arrow-left" size={16} color="var(--muted)" /> 목록으로
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Badge tone="violet">스터디</Badge>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--brand-accent)" }}>✦ 94% 일치</span>
        </div>
        <h1 className="cl-display-sm" style={{ margin: "0 0 var(--space-sm)", textWrap: "pretty" }}>주말 알고리즘 스터디 — 코딩테스트 대비</h1>
        <Callout style={{ marginBottom: 24 }}>관심사(개발·AI)와 주말 오후 활동 선호가 잘 맞아 상위로 추천했어요.</Callout>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 24 }}>
          <InfoTile icon="calendar" label="일정" value="매주 토 · 오후 2시" />
          <InfoTile icon="map-pin" label="장소" value="강남 스터디카페" />
          <InfoTile icon="users" label="참여" value="8 / 12명" />
        </div>
        <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 24, marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>모임 소개</div>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
            코딩테스트를 함께 준비하는 소규모 스터디입니다. 매주 문제를 정하고 풀이를 공유해요. 초급~중급 환영합니다.
          </p>
        </div>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>모집 중인 역할</div>
          <Callout>프론트엔드 · React &nbsp;|&nbsp; 지훈님의 역할과 일치해요</Callout>
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 14 }}>참여 멤버 8명</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {MEMBERS.map((m) => (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.name} tone={m.tone} size={40} />
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{m.name}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{m.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 28 }}>
          <Field label="문의">
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Input placeholder="궁금한 점을 남겨보세요" value={inquiry} onChange={(e) => setInquiry(e.target.value)} />
              </div>
              <Button variant="secondary">문의하기</Button>
            </div>
          </Field>
        </div>
        <div style={{ display: "flex", gap: 12, position: "sticky", bottom: 0, background: "var(--canvas)", paddingTop: 8 }}>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = "../app-apply-complete/ApplyComplete.dc.html"; }}>참여 신청하기</Button>
          <Button variant="secondary" size="lg" iconLeft={<Icon name="bookmark" size={16} />}>저장</Button>
        </div>
      </div>
    </AppShell>
  );
}
