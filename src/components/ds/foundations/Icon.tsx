import React from "react";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface IconProps {
  /** Lucide icon name (kebab or PascalCase), e.g. "calendar" / "Calendar". */
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

/**
 * Icon — thin wrapper over lucide-react, keyed by kebab or PascalCase name.
 * Keeps the `<Icon name="..."/>` API from the design handoff so screens don't
 * need to change, but resolves icons from the npm package instead of a CDN.
 */
export function Icon({ name, size = 20, strokeWidth = 1.75, color = "currentColor", style = {} }: IconProps): JSX.Element | null {
  const pascal = toPascalCase(name);
  const LucideIconComponent = (icons as unknown as Record<string, LucideIcon>)[pascal];
  if (!LucideIconComponent) return null;
  return (
    <LucideIconComponent
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      style={{ flexShrink: 0, ...style }}
    />
  );
}
