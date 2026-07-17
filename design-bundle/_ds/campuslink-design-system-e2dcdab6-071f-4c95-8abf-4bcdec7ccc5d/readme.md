# CampusLink Design System

> **CampusLink** — AI가 사용자에게 적합한 모임이나 행사를 찾아 연결해 주는 서비스.
> *("CampusLink's AI finds the meetups and events that fit you, and connects you to them.")*

CampusLink helps people discover the right community — the AI analyzes a user's interests and availability, then surfaces the meetups and events worth joining, with a match score. This design system provides the tokens, components, and full-screen UI kits to build CampusLink's marketing and product surfaces on-brand.

## Design language

The visual language is derived from the **Cal.com "clean calendar-SaaS"** analysis supplied with this brief: a white canvas anchored by near-black primary actions, a geometric display face (**Geist**, Vercel's open-source typeface), soft-rounded light-gray cards holding real product UI, and a single dark footer that closes long pages. Brand voltage comes from **the display headline + real product artifacts shown in-card**, not from accent color. The system is near-monochrome at the action layer.

## Sources

- **Design spec:** the attached *Cal.com-design-analysis* (v alpha) markdown — colors, type scale, spacing, radii, component inventory, do/don't. This is the ground truth for all foundations.
- **Product brief:** CampusLink one-liner (above). Korean-language product; meetup/event discovery via AI matching.
- No codebase, Figma file, logo, or font binaries were supplied. Substitutions and gaps are flagged below and in **Caveats**.

---

## CONTENT FUNDAMENTALS

**Language.** Product copy is **Korean**, written warm-but-precise — friendly modern-SaaS, never salesy or shouting. Mirrors Cal.com's "confidently engineered without trying to impress" voice.

**Person & address.** Speaks *to* the user politely (존댓말, `-요`/`-습니다`): "관심사에 맞는 모임을 찾아보세요", "신청되었습니다". Greets by name in-app ("안녕하세요, 지민님"). The product is the actor ("AI가 … 연결해 드립니다") — the user is invited, not commanded.

**Tone.** Concrete and reassuring. Headlines make a single clear promise ("나에게 딱 맞는 모임을 만나는 법"); subheads explain the mechanism in one plain sentence. Numbers are specific and human ("이번 주 12,480명이 새 모임을 찾았어요"), never vague hype.

**Casing & punctuation.** Sentence-style Korean. Latin words keep natural casing (AI, CampusLink). Em-dashes and middot (·) separate meta ("매주 토 · 오후 2시"). Prices in ₩ with thousands separators (₩9,900).

**Emoji.** Not used as UI. A single geometric sparkle glyph **✦** marks AI/recommendation moments (badges, match score) — treat it as a brand mark, not decoration. Otherwise rely on Lucide line icons.

**Vibe.** Helpful, low-pressure, campus-friendly. "우리가 대신 찾아드릴게요" — the AI removes the work of searching; the copy keeps that reassurance front and center.

---

## VISUAL FOUNDATIONS

**Color.** Near-monochrome. White canvas (`--canvas` #fff), near-black primary (`--primary` #111) for every CTA and display headline. Text steps ink → body → muted → muted-soft (#111 → #374151 → #6b7280 → #898989). Accent blue (`--brand-accent` #3b82f6) appears **rarely** — only on the AI match-score chip and inline links. A small pastel set (orange/pink/violet/emerald) appears **only** on category badges and avatar fills, never on actions. Semantic success/warning/error for status only.

**Type.** Two roles, strict boundary. **Display** = **Geist** (`--font-display`, self-hosted `@font-face` via the Fontsource CDN) at 600 weight with negative tracking (−0.5px to −2px) for h1–h3 and hero headlines. **Body/UI** = Inter (400–600, 0 tracking) for everything else. Code = JetBrains Mono. Display weight is *always* 600 — never 700 (bombastic), never 500. When in doubt, bigger display before bolder.

**Spacing.** 4px base. Section rhythm is 96px (`--space-section`) between editorial bands. Card padding: 32px (feature/pricing), 24px (testimonial/product/meetup). 24px gutters in card grids. Max content width 1200px, centered.

**Backgrounds.** Flat color only — no gradients, no photographic hero washes, no textures or patterns. Surface *mode* carries meaning: light-gray card = abstract claim, white outline card = real product, dark = scarce emphasis. Bands alternate white ↔ soft-gray for pacing; never two identical surfaces back-to-back.

**Cards.** Content cards are `--radius-lg` (12px); the hero mockup is `--radius-xl` (16px); buttons/inputs `--radius-md` (8px); badges/pills and avatars fully round. Light-gray cards carry **no border, no shadow**. White cards use a 1px hairline (`--hairline` #e5e7eb) and optionally a soft shadow.

**Elevation.** Soft and modern. Two shadows only: `--shadow-soft` (`0 1px 2px rgba(0,0,0,.05)`) and `--shadow-raised` (`0 4px 12px rgba(0,0,0,.08)`). No heavy shadows, no neumorphism, no glassmorphism. The featured pricing tier uses **color inversion (dark surface)** instead of shadow to signal elevation.

**Borders.** 1px hairlines only — `--hairline` on inputs/white cards/dividers, `--hairline-soft` (#f3f4f6) for barely-there section splits.

**The dark surface is scarce.** `--surface-dark` (#101010) appears in exactly two places: the page footer and the featured pricing tier. Never add other dark cards casually.

**Hover / press.** Minimal by policy. Primary button darkens on press (#111 → #242424); nav-pill active segment becomes a white pill with a soft shadow; links go to ink on hover. No scale/bounce, no elaborate hover reveals.

**Animation.** Short functional transitions only (~.15s ease on color/border). No decorative loops, no parallax. Reduced-motion friendly by default.

**Transparency & blur.** Used sparingly — low-alpha tints for status backgrounds (e.g. success chip on `rgba(16,185,129,.1)`). No frosted-glass panels.

**Imagery mood.** Meetup cover images (when present) sit in white cards with hairline; the system does not tint them. Avatars crop to perfect circles; pastel-fill initials stand in when no photo. Product UI is shown as real chrome at small scale, not illustrated.

---

## ICONOGRAPHY

- **System:** [Lucide](https://lucide.dev) line icons — 1.75px stroke, rounded joins — matching the clean modern-SaaS feel. **This is a substitution:** no bespoke CampusLink icon font/SVG set was supplied. Flagged for replacement.
- **How:** loaded from CDN (`https://unpkg.com/lucide@latest`) and rendered through the `Icon` component (`<Icon name="calendar" />`). Common glyphs: search, calendar, users, map-pin, sparkles, bell, bookmark, compass, message-circle, arrow-right.
- **Brand glyph:** the sparkle **✦** (Unicode) marks AI/recommendation moments — used deliberately, not as generic decoration.
- **Emoji:** not used in UI. Small unicode markers (·, ✓, ✦) appear as typographic accents only.
- **Logo:** none supplied. The wordmark is rendered in the display face beside a solid brand dot (see `guidelines/brand-wordmark.card.html`). **Do not** invent a logo — replace with the official mark when provided.

---

## Component index

Reusable primitives (compiled into the bundle under `window.CampusLinkDesignSystem_e2dcda`):

- **Actions:** `Button` (primary / secondary / ghost; sm/md/lg), `IconButton` (circular icon control)
- **Foundations:** `Icon` (Lucide wrapper)
- **Forms:** `Input` (hairline text field), `Textarea` (multi-line field), `Select` (styled native dropdown), `Chip` (selectable interest/purpose/role tag), `Field` (label + control wrapper)
- **Feedback:** `Callout` (info / danger banner), `ProgressBar` (multi-step form progress), `Stepper` (vertical numbered tracker for a pending process — e.g. application review)
- **Display:** `Badge` (category/status pill), `Avatar` (circular, pastel-fill initials), `RatingStars` (orange star rating), `Calendar` (month-grid scheduling widget), `Stat` (activity-statistic tile), `ProfilePopover` (header avatar dropdown — profile + upcoming schedule)
- **Navigation:** `NavPillGroup` (signature pill-in-pill switcher), `TopNav` (64px white header)
- **Cards:** `Card` (base, surface modes), `FeatureCard` (gray claim), `TestimonialCard`, `PricingTierCard` (featured = dark), `MeetupCard` (core recurring-meetup listing with AI match), `EventCard` (one-off event listing with date block)
- **Chat:** `ChatThreadItem` (directory row), `ChatMessage` (mine/theirs bubble), `PlaceVoteCard` (KakaoTalk-style place-vote card)

Each component directory has `<Name>.tsx` (typed React function component), `<Name>.d.ts` (props contract), `<Name>.prompt.md`, and one `@dsCard` HTML. **All components are TypeScript** — copy a directory straight into a TS/React project and import `<Name>` with its exported props interface.

*Intentional additions* (not in the source's named inventory): `Icon` (Lucide wrapper), `MeetupCard` (the product's core content unit), and the wireframe-driven set — `Textarea`, `Chip`, `Field`, `Callout`, `ProgressBar` (and, added per section, `Stepper`, `Stat`, `Calendar`, `ChatMessage`, `ChatThreadItem`, `PlaceVoteCard`, `ProfilePopover`) — needed to build CampusLink's onboarding, chat, and mypage surfaces. Each has a one-line reason in its `.prompt.md`.

## Templates

Reusable starting points a consuming project can copy or follow (each is a `templates/<slug>/` folder). Every template loads the design system through a sibling `ds-base.js` (one line to repoint at a bound `_ds/<folder>`).

- `templates/marketing/` — full CampusLink landing page (hero → discovery → pricing → dark footer). Entry: `Marketing.dc.html`.
- CampusLink app screens (16, from the product wireframe) — each its own `templates/app-<screen>/` folder sharing `AppShell` (sidebar + header) from `templates/app-home/AppShell.tsx`:
  - 온보딩: `app-login`, `app-signup`, `app-password`, `app-profile-setup`
  - 홈·추천: `app-home`, `app-group-detail`, `app-apply-complete`, `app-apply-failed`, `app-event-detail`
  - 내 모임: `app-my-groups`, `app-my-group-detail`
  - 채팅: `app-chat`, `app-meetup-vote`
  - 마이페이지: `app-mypage`, `app-profile-popover`

**Each template ships two screen files:**
- `<Screen>.tsx` — the **canonical, typed, handoff-ready** source (real `import`s, typed props, resolves the DS via `getDS()` at render). This is what you hand to Claude Code / drop into a TS/React project.
- `<Screen>.preview.jsx` — the plain-JS build the design-system preview runtime actually mounts (via a custom element that keeps a single React instance for render + hooks + bundle). Mirror of the `.tsx`; not for handoff.

Both resolve design-system components at **render time** through `getDS()` (a namespace lookup), so a screen never touches `window.<Namespace>` at module-load and mounts safely regardless of bundle load order.

## Foundations (Design System tab)

Specimen cards live in `guidelines/` (Colors, Type, Spacing, Brand) and each component directory (Components). They render the real tokens from `styles.css`.

## Root manifest

- `styles.css` — global entry (import this one file). `@import`s the token files.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`.
- `components/` — reusable primitives (`.tsx`), grouped by concern.
- `templates/` — reusable starting points (`marketing/`, `app/`), each a `.dc.html` entry + typed `.tsx` screen + `.preview.jsx` mount + `ds-base.js`.
- `guidelines/` — foundation specimen cards.
- `SKILL.md` — Agent-Skills-compatible entry point.

---

## Caveats

- **Display font is Geist** (Vercel, OFL) — the original Cal.com analysis used the proprietary *Cal Sans*, which is not publicly licensable, so per request the display voice is now Geist, self-hosted as a real `@font-face` (Fontsource CDN, variable weight). `--font-display` names `"Geist"` first, then Inter. No license action needed.
- **Icons** are Lucide (substitution) — no CampusLink icon set was supplied.
- **No logo** was supplied — wordmark + brand dot stand in. Do not treat it as final.
- **No font binaries** were supplied; Inter + JetBrains Mono load from Google Fonts CDN.
- Foundations are derived from the written spec (no Figma/codebase to cross-check exact values); numeric tokens match the spec verbatim.
