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
 * Event dots mark scheduled days; hovering a day exposes the event labels.
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
        <button type="button" onClick={onPrev} aria-label="이전 달 보기" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", fontSize: 16, padding: 4 }}>‹</button>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{monthLabel}</span>
        <button type="button" onClick={onNext} aria-label="다음 달 보기" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--muted)", fontSize: 16, padding: 4 }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
        {WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500, color: "var(--muted-soft)", padding: "4px 0" }}>{w}</div>
        ))}
      </div>
      <div role="grid" aria-label={`${monthLabel} 일정 달력`} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (day == null) return <div key={i} role="gridcell" aria-hidden="true" />;
          const isToday = day === today;
          const dayEvents = eventsByDay.get(day) || [];
          const eventLabels = dayEvents.map((event) => event.label).filter(Boolean).join(", ");
          const label = eventLabels ? `${day}일: ${eventLabels}` : `${day}일`;
          const content = (
            <>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: isToday ? 600 : 500, color: isToday ? "var(--on-primary)" : "var(--ink)" }}>{day}</span>
              <span style={{ display: "flex", gap: 2, height: 4 }}>
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <span key={idx} style={{ width: 4, height: 4, borderRadius: "var(--radius-full)", background: isToday ? "var(--on-primary)" : event.tone === "accent" ? "var(--brand-accent)" : "var(--muted)" }} />
                ))}
              </span>
            </>
          );
          const cellStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "6px 0",
            border: "none",
            borderRadius: "var(--radius-md)",
            background: isToday ? "var(--primary)" : "transparent",
          };
          return (
            <div key={i} role="gridcell">
              {onSelectDay ? (
                <button type="button" onClick={() => onSelectDay(day)} aria-label={label} title={eventLabels || undefined} style={{ ...cellStyle, width: "100%", cursor: "pointer" }}>
                  {content}
                </button>
              ) : (
                <div aria-label={label} title={eventLabels || undefined} style={cellStyle}>
                  {content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
