import React from "react";

export interface FeatureCardProps {
  /** Icon node rendered in a white tile above the title. */
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * FeatureCard — light-gray card for a feature claim. Icon, title, description.
 */
export function FeatureCard({ icon = null, title, children, style = {} }: FeatureCardProps): JSX.Element {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        borderRadius: "var(--radius-lg)",
        padding: 32,
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            background: "var(--canvas)",
            color: "var(--ink)",
            marginBottom: 20,
            boxShadow: "var(--shadow-soft)",
          }}
        >
          {icon}
        </div>
      )}
      <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: "var(--ink)" }}>
        {title}
      </h3>
      <p style={{ margin: "10px 0 0", fontFamily: "var(--font-sans)", fontSize: 16, lineHeight: 1.5, color: "var(--body)" }}>
        {children}
      </p>
    </div>
  );
}
