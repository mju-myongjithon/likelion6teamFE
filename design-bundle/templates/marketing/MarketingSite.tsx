/**
 * MarketingSite — CampusLink marketing landing page (template screen).
 *
 * Self-contained React + TypeScript screen composed from the CampusLink design
 * system components. The design-system namespace is resolved at RENDER time via
 * getDS() (not at module load), so the screen mounts safely regardless of when
 * the _ds_bundle.js finishes loading in the template runtime.
 *
 * Handoff note (Claude Code / production): replace getDS() with real imports —
 *   import { Button, TopNav, MeetupCard, ... } from "@campuslink/design-system";
 * and delete the window-namespace shim + the trailing window registration.
 */
import React from "react";
import type { ButtonProps } from "../../components/actions/Button";
import type { TopNavProps } from "../../components/navigation/TopNav";
import type { NavPillGroupProps } from "../../components/navigation/NavPillGroup";
import type { FeatureCardProps } from "../../components/cards/FeatureCard";
import type { MeetupCardProps } from "../../components/cards/MeetupCard";
import type { TestimonialCardProps } from "../../components/cards/TestimonialCard";
import type { PricingTierCardProps } from "../../components/cards/PricingTierCard";
import type { BadgeProps } from "../../components/display/Badge";
import type { IconProps } from "../../components/foundations/Icon";

/** The subset of the CampusLink design system this screen consumes. */
interface CampusLinkDS {
  TopNav: React.FC<TopNavProps>;
  Button: React.FC<ButtonProps>;
  NavPillGroup: React.FC<NavPillGroupProps>;
  FeatureCard: React.FC<FeatureCardProps>;
  MeetupCard: React.FC<MeetupCardProps>;
  TestimonialCard: React.FC<TestimonialCardProps>;
  PricingTierCard: React.FC<PricingTierCardProps>;
  Badge: React.FC<BadgeProps>;
  Icon: React.FC<IconProps>;
}

const DS_NAMESPACE = "CampusLinkDesignSystem_e2dcda";

/** Resolve the design-system namespace at render time (safe against load order). */
function getDS(): CampusLinkDS {
  const ns = (window as unknown as Record<string, CampusLinkDS | undefined>)[DS_NAMESPACE];
  if (!ns) throw new Error(`CampusLink design system (${DS_NAMESPACE}) not loaded`);
  return ns;
}

const MAXW = 1200;

interface SectionProps {
  children?: React.ReactNode;
  bg?: string;
  pad?: number;
  style?: React.CSSProperties;
}

function Section({ children, bg = "var(--canvas)", pad = 96, style = {} }: SectionProps): JSX.Element {
  return (
    <section style={{ background: bg, padding: `${pad}px var(--space-lg)`, ...style }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Hero(): JSX.Element {
  const { Badge, Button, Icon } = getDS();
  return (
    <Section pad={80}>
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 56, alignItems: "center" }}>
        <div>
          <div style={{ marginBottom: 20 }}><Badge tone="violet">✦ AI 기반 모임 추천</Badge></div>
          <h1 className="cl-display-xl" style={{ margin: 0 }}>나에게 딱 맞는<br />모임을 만나는 법</h1>
          <p style={{ margin: "var(--space-lg) 0 0", maxWidth: 460, fontFamily: "var(--font-sans)", fontSize: 18, lineHeight: 1.55, color: "var(--body)" }}>
            CampusLink의 AI가 관심사와 일정을 분석해, 지금 참여하기 좋은 모임과 행사를 골라 연결해 드립니다.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={18} color="var(--on-primary)" />} onClick={() => { window.location.href = "../app-signup/Signup.dc.html"; }}>무료로 시작하기</Button>
            <Button variant="secondary" size="lg">둘러보기</Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--muted)" }}>
            <Icon name="users" size={16} color="var(--muted)" /> 이번 주 12,480명이 새 모임을 찾았어요
          </div>
        </div>
        <HeroMockup />
      </div>
    </Section>
  );
}

function HeroMockup(): JSX.Element {
  const { Icon, Badge, MeetupCard } = getDS();
  return (
    <div style={{ background: "var(--canvas)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-raised)", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ width: 30, height: 30, borderRadius: "var(--radius-full)", background: "var(--surface-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="sparkles" size={16} color="var(--on-primary)" />
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>AI 추천 결과</span>
        <span style={{ marginLeft: "auto" }}><Badge tone="success">3개 매칭</Badge></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <MeetupCard title="주말 알고리즘 스터디" category="스터디" categoryTone="violet" when="매주 토 · 오후 2시" where="강남" host="김민준" members={8} capacity={12} matchScore={94} />
        <MeetupCard title="스타트업 사이드프로젝트 밋업" category="네트워킹" categoryTone="orange" when="1/25 금 · 저녁 7시" where="성수동" host="이서연" members={22} capacity={30} matchScore={88} />
      </div>
    </div>
  );
}

function Logos(): JSX.Element {
  const names = ["서울대", "연세대", "고려대", "카이스트", "성균관대", "한양대"];
  return (
    <Section pad={40} bg="var(--canvas)">
      <div style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 500, color: "var(--muted)", marginBottom: 20 }}>
        전국 120개 대학 커뮤니티가 함께합니다
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", opacity: 0.6 }}>
        {names.map((n) => <span key={n} style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--ink)" }}>{n}</span>)}
      </div>
    </Section>
  );
}

function Features(): JSX.Element {
  const { FeatureCard, Icon } = getDS();
  return (
    <Section bg="var(--surface-soft)">
      <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto var(--space-xxl)" }}>
        <h2 className="cl-display-lg" style={{ margin: 0 }}>연결까지, 세 단계면 충분해요</h2>
        <p style={{ margin: "var(--space-md) 0 0", fontFamily: "var(--font-sans)", fontSize: 18, color: "var(--body)" }}>
          복잡한 검색 대신, AI가 당신을 대신해 모임을 찾습니다.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        <FeatureCard icon={<Icon name="user-round-cog" />} title="관심사 프로필">
          좋아하는 주제와 가능한 시간대를 한 번만 알려주세요. 나머지는 AI가 기억합니다.
        </FeatureCard>
        <FeatureCard icon={<Icon name="sparkles" />} title="AI 매칭">
          수천 개의 모임 중 지금의 나에게 가장 잘 맞는 것만 골라 매칭 점수와 함께 보여줍니다.
        </FeatureCard>
        <FeatureCard icon={<Icon name="calendar-check" />} title="원클릭 참여">
          마음에 드는 모임에 바로 신청하고, 일정은 캘린더에 자동으로 정리됩니다.
        </FeatureCard>
      </div>
    </Section>
  );
}

type MeetupData = Omit<MeetupCardProps, "style">;

function Discover(): JSX.Element {
  const { NavPillGroup, MeetupCard } = getDS();
  const [tab, setTab] = React.useState<string>("추천");
  const all: Record<string, MeetupData[]> = {
    "추천": [
      { title: "주말 알고리즘 스터디 — 코딩테스트 대비", category: "스터디", categoryTone: "violet", when: "매주 토 · 오후 2시", where: "강남 스터디카페", host: "김민준", members: 8, capacity: 12, matchScore: 94 },
      { title: "북클럽: 이번 달 과학 에세이", category: "취미", categoryTone: "orange", when: "1/28 화 · 저녁 8시", where: "온라인", host: "박도윤", members: 14, capacity: 20, matchScore: 90 },
      { title: "주니어 디자이너 포트폴리오 리뷰", category: "네트워킹", categoryTone: "pink", when: "2/1 토 · 오후 3시", where: "홍대", host: "최유진", members: 6, capacity: 10, matchScore: 87 },
    ],
    "인기": [
      { title: "러닝 크루 — 한강 5K", category: "운동", categoryTone: "emerald", when: "매주 일 · 오전 9시", where: "뚝섬", host: "정하늘", members: 45, capacity: 50, matchScore: 82 },
      { title: "스타트업 창업자 밋업", category: "네트워킹", categoryTone: "orange", when: "1/30 목 · 저녁 7시", where: "성수동", host: "이서연", members: 88, capacity: 100, matchScore: 79 },
      { title: "주말 사진 출사 모임", category: "취미", categoryTone: "violet", when: "2/2 일 · 오후 1시", where: "서촌", host: "강민서", members: 12, capacity: 15, matchScore: 76 },
    ],
    "신규": [
      { title: "AI 논문 리딩 그룹", category: "스터디", categoryTone: "violet", when: "매주 수 · 저녁 8시", where: "온라인", host: "윤재원", members: 3, capacity: 12, matchScore: 91 },
      { title: "보드게임 나이트", category: "취미", categoryTone: "pink", when: "1/26 일 · 오후 5시", where: "신촌", host: "한소희", members: 5, capacity: 8, matchScore: 85 },
      { title: "영어 프리토킹 카페", category: "문화", categoryTone: "orange", when: "매주 금 · 저녁 7시", where: "이태원", host: "Jason K.", members: 7, capacity: 10, matchScore: 80 },
    ],
  };
  return (
    <Section>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 className="cl-display-lg" style={{ margin: 0 }}>지금 뜨는 모임</h2>
          <p style={{ margin: "var(--space-sm) 0 0", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--body)" }}>당신의 관심사에 맞춰 실시간으로 업데이트됩니다.</p>
        </div>
        <NavPillGroup items={["추천", "인기", "신규"]} value={tab} onChange={setTab} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {all[tab].map((m, i) => <MeetupCard key={i} {...m} />)}
      </div>
    </Section>
  );
}

function Testimonials(): JSX.Element {
  const { TestimonialCard } = getDS();
  return (
    <Section bg="var(--surface-soft)">
      <h2 className="cl-display-lg" style={{ margin: "0 0 var(--space-xxl)", textAlign: "center" }}>이미 연결된 사람들</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        <TestimonialCard name="이서연" role="대학생 · 서울" avatarTone="pink" rating={5}>혼자선 못 갔을 스터디를 CampusLink가 딱 맞게 연결해줬어요. 매칭 점수가 진짜 정확해요.</TestimonialCard>
        <TestimonialCard name="김민준" role="취업준비생" avatarTone="violet" rating={5}>검색하느라 지치던 시간이 사라졌어요. 알림만 보고 신청하면 끝이에요.</TestimonialCard>
        <TestimonialCard name="박도윤" role="직장인 · 판교" avatarTone="emerald" rating={4}>퇴근 후 참여할 수 있는 모임만 골라줘서 좋아요. 일정 정리도 자동이라 편합니다.</TestimonialCard>
      </div>
    </Section>
  );
}

function Pricing(): JSX.Element {
  const { PricingTierCard } = getDS();
  return (
    <Section>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2 className="cl-display-lg" style={{ margin: 0 }}>부담 없이 시작하세요</h2>
        <p style={{ margin: "var(--space-md) 0 0", fontFamily: "var(--font-sans)", fontSize: 18, color: "var(--body)" }}>언제든 업그레이드하거나 해지할 수 있습니다.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, maxWidth: 940, margin: "0 auto" }}>
        <PricingTierCard name="무료" price="₩0" description="가볍게 둘러보기" features={["AI 모임 추천", "월 3회 신청", "기본 알림"]} cta="무료로 시작" />
        <PricingTierCard name="플러스" price="₩9,900" featured description="가장 인기 있는 플랜" features={["무제한 신청", "우선 AI 매칭", "전용 이벤트 초대", "캘린더 연동"]} cta="플러스 시작" />
        <PricingTierCard name="캠퍼스" price="₩29,900" description="동아리 · 학생회" features={["팀 관리 도구", "모임 홍보 부스트", "참여 분석", "전담 지원"]} cta="문의하기" />
      </div>
    </Section>
  );
}

function CtaBand(): JSX.Element {
  const { Button } = getDS();
  return (
    <Section pad={64}>
      <div style={{ background: "var(--surface-card)", borderRadius: "var(--radius-lg)", padding: 56, textAlign: "center" }}>
        <h2 className="cl-display-md" style={{ margin: 0 }}>더 똑똑하게, 더 쉽게 연결되기</h2>
        <p style={{ margin: "var(--space-md) 0 var(--space-xl)", fontFamily: "var(--font-sans)", fontSize: 17, color: "var(--body)" }}>지금 프로필을 만들고 첫 모임을 추천받으세요.</p>
        <Button variant="primary" size="lg" onClick={() => { window.location.href = "../app-signup/Signup.dc.html"; }}>무료로 시작하기</Button>
      </div>
    </Section>
  );
}

function Footer(): JSX.Element {
  const cols: Record<string, string[]> = {
    "제품": ["모임 찾기", "이벤트", "AI 매칭", "요금제"],
    "솔루션": ["동아리", "학생회", "기업 채용", "커뮤니티"],
    "회사": ["소개", "블로그", "채용", "문의"],
    "리소스": ["도움말", "이용약관", "개인정보", "상태"],
  };
  return (
    <footer style={{ background: "var(--surface-dark)", color: "var(--on-dark-soft)", padding: "var(--space-xxl) var(--space-lg)" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 32 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ width: 22, height: 22, borderRadius: "var(--radius-full)", background: "var(--on-dark)", display: "inline-block" }} />
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--on-dark)" }}>CampusLink</span>
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, maxWidth: 240 }}>AI가 연결하는 모임과 행사. 관심사에 맞는 사람들을 만나세요.</p>
        </div>
        {Object.entries(cols).map(([h, items]) => (
          <div key={h}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: "var(--on-dark)", marginBottom: 14 }}>{h}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((i) => <a key={i} href="#" style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--on-dark-soft)", textDecoration: "none" }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: MAXW, margin: "var(--space-xxl) auto 0", paddingTop: 24, borderTop: "1px solid var(--surface-dark-elevated)", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--muted-soft)" }}>
        © 2026 CampusLink. All rights reserved.
      </div>
    </footer>
  );
}

/** The full CampusLink marketing landing page. */
export function MarketingSite(): JSX.Element {
  const { TopNav, Button } = getDS();
  return (
    <div style={{ background: "var(--canvas)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <TopNav
          activeLink="둘러보기"
          right={<>
            <Button variant="ghost" size="sm" onClick={() => { window.location.href = "../app-login/Login.dc.html"; }}>로그인</Button>
            <Button variant="primary" size="sm" onClick={() => { window.location.href = "../app-signup/Signup.dc.html"; }}>무료로 시작</Button>
          </>}
        />
      </div>
      <Hero />
      <Logos />
      <Features />
      <Discover />
      <Testimonials />
      <Pricing />
      <CtaBand />
      <Footer />
    </div>
  );
}

// Template-runtime registration (remove on production handoff — use a real import instead).
(window as unknown as Record<string, unknown>).CampusLinkMarketingSite = MarketingSite;
