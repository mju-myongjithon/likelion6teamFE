import React from "react";

export interface ProgressBarProps {
  /** Current step (1-based). */
  step?: number;
  /** Total steps. */
  total?: number;
  /** Explicit 0–1 ratio (overrides step/total when set). */
  value?: number;
  /** Show the "n / total 단계" label to the right. */
  showLabel?: boolean;
  /** Custom label; defaults to "{step} / {total} 단계". */
  label?: string;
  style?: React.CSSProperties;
}

/**
 * ProgressBar — thin step progress indicator for multi-step flows (onboarding).
 * Near-black fill on a light track.
 */
export function ProgressBar({ step = 1, total = 5, value, showLabel = true, label, style = {} }: ProgressBarProps): JSX.Element {
  const ratio = value != null ? value : total > 0 ? step / total : 0;
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      <div style={{ flex: 1, height: 4, borderRadius: "var(--radius-pill)", background: "var(--surface-strong)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "var(--primary)", borderRadius: "var(--radius-pill)", transition: "width .25s ease" }} />
      </div>
      {showLabel && (
        <span style={{ flexShrink: 0, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--muted)", whiteSpace: "nowrap" }}>
          {label ?? `${step} / ${total} 단계`}
        </span>
      )}
    </div>
  );
}
