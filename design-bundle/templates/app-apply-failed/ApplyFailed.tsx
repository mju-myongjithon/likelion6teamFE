/**
 * ApplyFailed — CampusLink 참여 신청 실패 (실패 사유 안내). Typed handoff source.
 */
import React from "react";
import { AppShell, getDS } from "../app-home/AppShell";
import type { ButtonProps } from "../../components/actions/Button";
import type { CalloutProps } from "../../components/feedback/Callout";
import type { MeetupCardProps } from "../../components/cards/MeetupCard";
import type { IconProps } from "../../components/foundations/Icon";

interface DS {
  Button: React.FC<ButtonProps>;
  Callout: React.FC<CalloutProps>;
  MeetupCard: React.FC<MeetupCardProps>;
  Icon: React.FC<IconProps>;
}

/** 참여 신청 실패 화면 — 실패 사유 + 대안 추천. */
export function ApplyFailed(): JSX.Element {
  const { Button, Icon, Callout, MeetupCard } = getDS<DS>();
  return (
    <AppShell active="home">
      <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xxl) var(--space-lg)" }}>
        <div style={{ width: "100%", maxWidth: 460, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", background: "rgba(239,68,68,.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-lg)" }}>
            <Icon name="x" size={32} color="var(--error)" strokeWidth={2.5} />
          </div>
          <h1 className="cl-display-sm" style={{ margin: "0 0 var(--space-sm)" }}>신청하지 못했어요</h1>
          <p style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>아래 사유로 참여 신청이 완료되지 않았습니다.</p>
          <Callout tone="danger" style={{ marginBottom: "var(--space-sm)", textAlign: "left" }}>모집 인원(12명)이 이미 마감되었어요.</Callout>
          <Callout tone="danger" style={{ marginBottom: "var(--space-lg)", textAlign: "left" }}>모임 시간이 이미 신청한 다른 일정과 겹쳐요.</Callout>
          <div style={{ textAlign: "left", marginBottom: "var(--space-sm)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>대신 이런 모임은 어때요?</div>
          <div style={{ marginBottom: "var(--space-lg)" }}>
            <MeetupCard title="AI 논문 리딩 그룹" category="스터디" categoryTone="violet" when="매주 수 · 저녁 8시" where="온라인" host="윤재원" members={3} capacity={12} matchScore={91} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => { window.location.href = "../app-home/Home.dc.html"; }}>다른 모임 추천받기</Button>
            <Button variant="secondary" size="lg" fullWidth onClick={() => { window.location.href = "../app-group-detail/GroupDetail.dc.html"; }}>이전으로</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
