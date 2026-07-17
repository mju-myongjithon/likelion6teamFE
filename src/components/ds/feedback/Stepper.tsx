import React from "react";

export type StepStatus = "done" | "current" | "upcoming";

export interface StepperStep {
  title: string;
  description?: string;
  status?: StepStatus;
}

export interface StepperProps {
  steps: StepperStep[];
  style?: React.CSSProperties;
}

/**
 * Stepper — vertical numbered-step tracker for a pending multi-stage process
 * (e.g. application review: 신청 완료 → 호스트 확인 대기 → 확정). Distinct from
 * ProgressBar (linear fill for a form flow) — this shows discrete stage status
 * (done / current / upcoming) with a description per step. Monochrome.
 */
export function Stepper({ steps, style = {} }: StepperProps): JSX.Element {
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: "6px 16px", ...style }}>
      {steps.map((s, i) => {
        const status = s.status ?? "upcoming";
        const done = status === "done";
        const current = status === "current";
        return (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderBottom: i < steps.length - 1 ? "1px solid var(--hairline-soft)" : "none" }}>
            <span
              style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: "var(--radius-full)",
                border: `1px solid ${done || current ? "var(--primary)" : "var(--hairline)"}`,
                background: done ? "var(--primary)" : "var(--canvas)",
                color: done ? "var(--on-primary)" : "var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-sans)",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {done ? "✓" : i + 1}
            </span>
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: current || done ? "var(--ink)" : "var(--muted)" }}>{s.title}</div>
              {s.description && <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
