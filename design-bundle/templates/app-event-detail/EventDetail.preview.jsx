/**
 * EventDetail.preview.jsx — RUNTIME MOUNT only. Canonical typed source: EventDetail.tsx.
 */
const { getDS, AppShell, defineScreen } = window.CampusLinkAppShell;
React = window.React;

function InfoTile({ icon, label, value }) {
  const { Icon } = getDS();
  return (
    <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: "var(--space-md)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--muted)", marginBottom: "var(--space-xs)" }}>
        <Icon name={icon} size={15} color="var(--muted)" />
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
    </div>
  );
}

function EventDetail() {
  const { Button, Input, Field, Badge, Callout, Icon } = getDS();
  const [inquiry, setInquiry] = React.useState("");
  const SCHEDULE = [
    { date: "3/20까지", title: "참가 신청 마감" },
    { date: "3/28 토", title: "오리엔테이션 · 개발 시작", time: "오전 10시" },
    { date: "3/29 일", title: "결과 발표 및 시상", time: "오후 5시" },
  ];
  return (
    <AppShell active="home">
      <div style={{ padding: "var(--space-xl)", maxWidth: 780 }}>
        <a href="../app-home/Home.dc.html" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--muted)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: "var(--space-lg)" }}>
          <Icon name="arrow-left" size={16} color="var(--muted)" /> 목록으로
        </a>
        <div style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
          <div style={{ flexShrink: 0, width: 88, height: 96, borderRadius: "var(--radius-lg)", background: "var(--surface-dark)", color: "var(--on-dark)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-xxs)" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, opacity: 0.75 }}>2월</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 600, letterSpacing: "-1px", lineHeight: 1 }}>14</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", marginBottom: "var(--space-sm)" }}>
              <Badge tone="orange">해커톤</Badge>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--brand-accent)" }}>✦ 92% 일치</span>
            </div>
            <h1 className="cl-display-sm" style={{ margin: 0, textWrap: "pretty" }}>AI 해커톤 2026 — 48시간 무박</h1>
          </div>
        </div>
        <Callout style={{ marginBottom: "var(--space-lg)" }}>관심사(AI·개발)와 프로젝트 목적에 잘 맞아 추천했어요. 팀 매칭도 지원됩니다.</Callout>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
          <InfoTile icon="clock" label="시작" value="2/14 오전 10시" />
          <InfoTile icon="map-pin" label="장소" value="코엑스 D홀" />
          <InfoTile icon="users" label="참석" value="128명" />
        </div>
        <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-sm)" }}>행사 소개</div>
          <p style={{ margin: "0 0 var(--space-md)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.6, color: "var(--body)" }}>
            48시간 동안 팀을 이뤄 AI 서비스를 만드는 해커톤입니다. 개인 참가 시 관심사 기반으로 팀을 매칭해 드려요. 멘토링과 상금이 제공됩니다.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
            {["팀 매칭 지원", "멘토링", "상금 500만원", "식사 제공"].map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: "var(--space-md)" }}>일정</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {SCHEDULE.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", padding: "var(--space-md)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)" }}>
                <div style={{ flexShrink: 0, width: 72, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{s.date}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{s.title}</div>
                  {s.time && <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)" }}>{s.time}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <Field label="문의">
            <div style={{ display: "flex", gap: "var(--space-xs)" }}>
              <div style={{ flex: 1 }}>
                <Input placeholder="궁금한 점을 남겨보세요" value={inquiry} onChange={(e) => setInquiry(e.target.value)} />
              </div>
              <Button variant="secondary">문의하기</Button>
            </div>
          </Field>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)", position: "sticky", bottom: 0, background: "var(--canvas)", paddingTop: "var(--space-xs)" }}>
          <Button variant="primary" size="lg" onClick={() => { window.location.href = "../app-apply-complete/ApplyComplete.dc.html"; }}>참가 신청하기</Button>
          <Button variant="secondary" size="lg" iconLeft={<Icon name="bookmark" size={16} />}>저장</Button>
          <Button variant="secondary" size="lg" iconLeft={<Icon name="share-2" size={16} />}>공유</Button>
        </div>
      </div>
    </AppShell>
  );
}

defineScreen("campuslink-event-detail", () => EventDetail);
