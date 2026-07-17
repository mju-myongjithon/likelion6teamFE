/**
 * ApplyComplete — CampusLink 참여 신청 완료. Typed handoff source.
 */
import React from "react";
import { AppShell, getDS } from "../app-home/AppShell";
import type { ButtonProps } from "../../components/actions/Button";
import type { IconProps } from "../../components/foundations/Icon";
import type { StepperProps } from "../../components/feedback/Stepper";

interface DS { Button: React.FC<ButtonProps>; Icon: React.FC<IconProps>; Stepper: React.FC<StepperProps>; }

/** 참여 신청 완료 화면 — 호스트 확인 대기 상태를 스텝퍼로 보여준다. */
export function ApplyComplete(): JSX.Element {
  const { Button, Icon, Stepper } = getDS<DS>();
  return (
    <AppShell active="home">
      <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-xxl) var(--space-lg)" }}>
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "var(--radius-full)", background: "var(--surface-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-lg)" }}>
            <Icon name="check" size={32} color="var(--on-primary)" strokeWidth={2.5} />
          </div>
          <h1 className="cl-display-sm" style={{ margin: "0 0 var(--space-sm)" }}>참여 신청이 완료됐어요</h1>
          <p style={{ margin: "0 0 var(--space-lg)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
            호스트가 확인하면 알려드릴게요. 보통 <strong style={{ color: "var(--ink)" }}>24시간 이내</strong>에 확정돼요.
          </p>
          <Stepper
            style={{ textAlign: "left", marginBottom: "var(--space-md)" }}
            steps={[
              { title: "신청 완료", description: "방금 전송됨", status: "done" },
              { title: "호스트 확인 대기 중", description: "김민준님이 검토하고 있어요", status: "current" },
              { title: "확정", description: "수락되면 채팅방이 열려요", status: "upcoming" },
            ]}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            <Button variant="primary" size="lg" fullWidth onClick={() => { window.location.href = "../app-my-groups/MyGroups.dc.html"; }}>내 신청 내역 보기</Button>
            <Button variant="secondary" size="lg" fullWidth onClick={() => { window.location.href = "../app-home/Home.dc.html"; }}>홈으로</Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
