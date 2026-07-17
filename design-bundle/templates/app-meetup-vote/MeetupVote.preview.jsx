/**
 * MeetupVote.preview.jsx — RUNTIME MOUNT only. Canonical typed source: MeetupVote.tsx.
 */
const { getDS, AppShell, defineScreen } = window.CampusLinkAppShell;
React = window.React;

const OPTIONS = [
  { id: "gangnam", label: "강남 스터디카페", sub: "2호선 강남역 3분", votes: 5 },
  { id: "hongdae", label: "홍대 라운지", sub: "합정역 5분", votes: 2 },
  { id: "online", label: "온라인 (Discord)", sub: "어디서나 참여", votes: 1 },
];

const VOTERS = {
  gangnam: ["김민준", "이서연", "최유진", "강민서", "나"],
  hongdae: ["박도윤", "정하늘"],
  online: ["윤재원"],
};
const TONES = { "김민준": "violet", "이서연": "pink", "박도윤": "emerald", "최유진": "orange", "강민서": "violet", "나": "violet", "정하늘": "emerald", "윤재원": "pink" };

function MeetupVote() {
  const { ChatMessage, PlaceVoteCard, Avatar, Button, IconButton, Input, Icon, Badge } = getDS();
  const [picked, setPicked] = React.useState("gangnam");
  const [options, setOptions] = React.useState(OPTIONS);

  const vote = (id) => {
    if (id === picked) return;
    setOptions((os) => os.map((o) => {
      if (o.id === id) return { ...o, votes: o.votes + 1 };
      if (o.id === picked) return { ...o, votes: Math.max(0, o.votes - 1) };
      return o;
    }));
    setPicked(id);
  };

  const lead = options.reduce((a, b) => (b.votes > a.votes ? b : a), options[0]);

  return (
    <AppShell active="chat">
      <div style={{ display: "flex", height: "100%", minHeight: 640 }}>
        {/* chat window */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--surface-soft)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--space-md) var(--space-lg)", borderBottom: "1px solid var(--hairline)", background: "var(--canvas)" }}>
            <a href="../app-chat/Chat.dc.html" style={{ display: "inline-flex", color: "var(--muted)" }}><Icon name="arrow-left" size={18} color="var(--muted)" /></a>
            <Avatar name="주말 알고리즘 스터디" tone="violet" size={36} />
            <div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>주말 알고리즘 스터디</div>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--muted)" }}>약속 잡기 진행 중</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ textAlign: "center" }}><Badge>오늘</Badge></div>
            <ChatMessage sender="김민준" senderTone="violet" time="오후 2:10">이번 주 토요일 스터디 장소 정해요!</ChatMessage>
            <ChatMessage mine time="오후 2:12">투표 만들었어요. 오늘 6시까지 투표해주세요 🙏</ChatMessage>
            <ChatMessage mine>
              <PlaceVoteCard
                title="2/1(토) 스터디 장소"
                options={options}
                selectedId={picked}
                deadline="오늘 오후 6시 마감"
                onVote={vote}
              />
            </ChatMessage>
            <ChatMessage sender="이서연" senderTone="pink" time="오후 2:15">강남 좋아요 👍</ChatMessage>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "var(--space-md) var(--space-lg)", borderTop: "1px solid var(--hairline)", background: "var(--canvas)" }}>
            <IconButton aria-label="투표 만들기"><Icon name="bar-chart-2" size={18} /></IconButton>
            <div style={{ flex: 1 }}><Input placeholder="메시지를 입력하세요" /></div>
            <Button variant="primary" iconLeft={<Icon name="send" size={15} color="var(--on-primary)" />}>전송</Button>
          </div>
        </div>

        {/* vote status panel */}
        <div style={{ width: 260, flexShrink: 0, borderLeft: "1px solid var(--hairline)", background: "var(--canvas)", padding: 20, overflowY: "auto" }}>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>투표 현황</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>현재 <strong style={{ color: "var(--ink)" }}>{lead.label}</strong>가 앞서고 있어요</div>
          {options.map((o) => (
            <div key={o.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                <span>{o.label}</span><span>{o.votes}표</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(VOTERS[o.id] || []).map((n) => <Avatar key={n} name={n} tone={TONES[n] || "neutral"} size={26} />)}
              </div>
            </div>
          ))}
          <Button variant="primary" size="sm" fullWidth style={{ marginTop: 8 }}>장소 확정하기</Button>
        </div>
      </div>
    </AppShell>
  );
}

defineScreen("campuslink-meetup-vote", () => MeetupVote);
