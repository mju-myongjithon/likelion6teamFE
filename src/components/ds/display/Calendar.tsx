import React from "react";

export interface CalendarEvent {
  /** Day of month this event falls on. */
  day: number;
  label?: string;
  tone?: "default" | "accent";
}

export interface CalendarProps {
  /** e.g. "2026년 2월". */
  monthLabel: string;
  /** Weekday-aligned starting offset (0 = Sunday) for the 1st of the month. */
  startOffset: number;
  /** Total days in the month. */
  daysInMonth: number;
  events?: CalendarEvent[];
  /** Highlighted "today" day number. */
  today?: number | null;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectDay?: (day: number) => void;
  style?: React.CSSProperties;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * Calendar — month-grid calendar widget for scheduling surfaces (마이페이지).
 * Near-black dot marks days with events; today gets a filled circle. Monochrome.
 */
export function Calendar({
  monthLabel,
  startOffset,
  daysInMonth,
  events = [],
  today = null,
  onPrev,
  onNext,
  onSelectDay,
  style = {},
}: CalendarProps): JSX.Element {
  const cells: Array<number | null> = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const eventsByDay = new Map<number, CalendarEvent[]>();
  events.forEach((e) => {
    const list = eventsByDay.get(e.day) || [];
    list.push(e);
    eventsByDay.set(e.day, list);
  });

  return (
    <div style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 20, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button type="button" onClick={onPrev} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", fontSize: 16, padding: 4 }}>‹</button>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{monthLabel}</span>
        <button type="button" onClick={onNext} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", fontSize: 16, padding: 4 }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--muted-soft)", padding: "4px 0" }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (day == null) return <div key={i} />;
          const isToday = day === today;
          const dayEvents = eventsByDay.get(day) || [];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay && onSelectDay(day)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "6px 0",
                border: "none",
                borderRadius: "var(--radius-md)",
                background: isToday ? "var(--primary)" : "transparent",
                cursor: onSelectDay ? "pointer" : "default",
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: isToday ? 600 : 500, color: isToday ? "var(--on-primary)" : "var(--ink)" }}>{day}</span>
              <span style={{ display: "flex", gap: 2, height: 4 }}>
                {dayEvents.slice(0, 3).map((_e, idx) => (
                  <span key={idx} style={{ width: 4, height: 4, borderRadius: "var(--radius-full)", background: isToday ? "var(--on-primary)" : "var(--muted)" }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
