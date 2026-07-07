# About Us Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `about.html` page to the FINSIDE site, linked from the nav's first menu item, presenting company vision, history, leadership, and partners using real IR-deck content.

**Architecture:** Single new static HTML file (`about.html`) that duplicates the site's existing nav/footer chrome and design tokens (dark theme, SUIT font, mint accent) from `index.html`, then adds seven content sections unique to About Us. No build step, no JS framework — plain HTML/CSS/vanilla JS matching the existing codebase's style. Scroll-reveal reuses the exact `.reveal-fade` + `IntersectionObserver` pattern already in `index.html`.

**Tech Stack:** Static HTML/CSS/JS, SUIT variable font (already in `assets/fonts/`), no build tooling.

## Global Constraints

- Design tokens (copy exactly from `index.html:10-17`): `--accent: #c8f0e8`, `--accent2: #7ee8c8`, `--bg: #0e0e0e`, `--text: #e8e4dc`, `--text-dim: #e8e4dc55`, `--text-mid: #e8e4dc99`
- Font: `'SUIT', 'Apple SD Gothic Neo', sans-serif` via the same `@font-face` block as `index.html:19-72`
- Nav must have "About Us" as the **first** `<li>` in `.nav-links`, linking to `about.html`, before Technology/Product/Company
- No count-up / bar-fill animations (per spec exclusions) — only `.reveal-fade` fade+slide-up on scroll
- No team member photos or invented names — only real content from `ref/` pptx extraction (see spec)
- Page must include the same `<nav>` and `<footer id="footer">` markup/behavior as `index.html` (nav scroll-blur, footer contact info)
- Mobile breakpoints at `900px` and `480px`, matching `index.html`'s existing breakpoints

---

## File Structure

- **Modify:** `index.html` — add "About Us" nav link (Task 1)
- **Create:** `about.html` — full new page: `<head>` (fonts/tokens), nav, 7 sections, footer, scripts (Tasks 2–8)

All sections live in the single `about.html` file, following the existing codebase convention of one big HTML file with inline `<style>`/`<script>` blocks per section (matches `index.html`'s pattern — do not split into multiple files).

---

### Task 1: Add "About Us" nav link to index.html

**Files:**
- Modify: `index.html:528-532`

**Interfaces:**
- Produces: nav `.nav-links` now has 4 items; `about.html` is linked (created in Task 2)

- [ ] **Step 1: Edit the nav-links list**

In `index.html`, replace:

```html
    <ul class="nav-links">
      <li><a href="#domains">Technology</a></li>
      <li><a href="#">Product</a></li>
      <li><a href="#">Company</a></li>
    </ul>
```

with:

```html
    <ul class="nav-links">
      <li><a href="about.html">About Us</a></li>
      <li><a href="#domains">Technology</a></li>
      <li><a href="#">Product</a></li>
      <li><a href="#">Company</a></li>
    </ul>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` directly in a browser (or via a local static server), confirm "About Us" appears first in the nav. Clicking it will 404 until Task 2 lands — that's expected at this point.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add About Us nav link"
```

---

### Task 2: Scaffold about.html — head, fonts, tokens, nav, footer

**Files:**
- Create: `about.html`

**Interfaces:**
- Consumes: `assets/fonts/SUIT-*.ttf`, `assets/favicon.svg` (existing assets, unchanged)
- Produces: base page shell that Tasks 3–8 insert `<section>` blocks into, between `</nav>` and `<footer id="footer">`

- [ ] **Step 1: Create about.html with head, nav, and footer (no content sections yet)**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>About Us — FINSIDE</title>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --accent: #c8f0e8;
    --accent2: #7ee8c8;
    --bg: #0e0e0e;
    --text: #e8e4dc;
    --text-dim: #e8e4dc55;
    --text-mid: #e8e4dc99;
  }

  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-Thin.ttf') format('truetype'); font-weight: 100; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-ExtraLight.ttf') format('truetype'); font-weight: 200; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-Light.ttf') format('truetype'); font-weight: 300; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-Regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-Medium.ttf') format('truetype'); font-weight: 500; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-SemiBold.ttf') format('truetype'); font-weight: 600; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-Bold.ttf') format('truetype'); font-weight: 700; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-ExtraBold.ttf') format('truetype'); font-weight: 800; font-display: swap; }
  @font-face { font-family: 'SUIT'; src: url('assets/fonts/SUIT-Heavy.ttf') format('truetype'); font-weight: 900; font-display: swap; }

  html, body {
    width: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'SUIT', 'Apple SD Gothic Neo', sans-serif;
  }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: #ffffffcc;
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border-bottom: 1px solid #1a1a1a10;
  }
  nav * { pointer-events: auto; }
  #nav-inner {
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px clamp(56px, 5vw, 120px);
  }
  .nav-logo {
    font-size: 14px; letter-spacing: 0.22em;
    color: #17181c;
    font-weight: 600; text-transform: uppercase;
  }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    color: #17181c;
    text-decoration: none;
    font-size: 14px; letter-spacing: 0.1em; font-weight: 400;
    transition: color 0.25s;
  }
  .nav-links a.active { color: #8a6a4a; font-weight: 600; }

  @media (max-width: 480px) {
    #nav-inner { padding: 18px 16px; }
    .nav-logo { font-size: 12px; letter-spacing: 0.12em; }
    .nav-links { gap: 12px; }
    .nav-links a { font-size: 11px; letter-spacing: 0.02em; }
  }

  /* ── shared reveal-on-scroll (same pattern as index.html #domains) ── */
  .reveal-fade {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1);
  }
  .reveal-fade.revealed { opacity: 1; transform: translateY(0); }
</style>
</head>
<body>

<nav>
  <div id="nav-inner">
    <div class="nav-logo"><a href="index.html" style="color:inherit; text-decoration:none;">FinSide</a></div>
    <ul class="nav-links">
      <li><a href="about.html" class="active">About Us</a></li>
      <li><a href="index.html#domains">Technology</a></li>
      <li><a href="index.html">Product</a></li>
      <li><a href="index.html">Company</a></li>
    </ul>
  </div>
</nav>

<!-- SECTION_ANCHOR: content sections inserted here by Tasks 3-8 -->

<!-- ── Footer ── -->
<footer id="footer">
  <div id="footer-inner">

    <div class="footer-top">
      <div class="footer-brand">
        <div class="footer-logo">FINSIDE</div>
        <div class="footer-tagline">Find the Inside Value</div>
      </div>
      <div class="footer-contact">
        <div class="footer-contact-row">
          <span class="footer-contact-label">대표</span>
          <span class="footer-contact-val">이동훈</span>
        </div>
        <div class="footer-contact-row">
          <span class="footer-contact-label">연락처</span>
          <span class="footer-contact-val">010-3181-4636</span>
        </div>
        <div class="footer-contact-row">
          <span class="footer-contact-label">이메일</span>
          <span class="footer-contact-val">leedh@cbnu.ac.kr</span>
        </div>
        <div class="footer-contact-row">
          <span class="footer-contact-label">주소</span>
          <span class="footer-contact-val">충북 청주시 서원구 충대로 1, 충북대학교 S21-24동 204호</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-copy">© 2026 주식회사 파인사이드. All rights reserved.</div>
      <div class="footer-sub">AI 비접촉 내부 분석 기술 · 설립 2025.12.18</div>
    </div>

  </div>
</footer>

<style>
  #footer {
    background: #080c0a;
    border-top: 1px solid #ffffff0d;
    padding: 64px 0 40px;
  }
  #footer-inner {
    max-width: 1860px;
    margin: 0 auto;
    padding: 0 clamp(80px, 12vw, 240px);
    display: flex;
    flex-direction: column;
    gap: 48px;
  }
  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 48px;
  }
  .footer-logo {
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: #e8e4dc;
  }
  .footer-tagline {
    margin-top: 8px;
    font-size: 13px;
    letter-spacing: 0.18em;
    color: #e8e4dcaa;
    text-transform: uppercase;
  }
  .footer-contact {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .footer-contact-row {
    display: flex;
    gap: 20px;
    font-size: 14px;
  }
  .footer-contact-label {
    color: #e8e4dc88;
    letter-spacing: 0.06em;
    min-width: 44px;
  }
  .footer-contact-val {
    color: #e8e4dccc;
  }
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    border-top: 1px solid #ffffff18;
    gap: 16px;
  }
  .footer-copy {
    font-size: 13px;
    color: #e8e4dc77;
    letter-spacing: 0.04em;
  }
  .footer-sub {
    font-size: 13px;
    color: #e8e4dc55;
    letter-spacing: 0.06em;
  }
  @media (max-width: 768px) {
    .footer-top { flex-direction: column; gap: 32px; }
    .footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
    #footer-inner { padding: 0 24px; }
  }
</style>

<script>
(function() {
  const fadeEls = document.querySelectorAll('.reveal-fade');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  fadeEls.forEach(el => io.observe(el));
})();
</script>

</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Open `about.html` directly. Confirm: dark background, nav shows "About Us" highlighted (mint/brown `active` color), footer renders with correct contact info, no console errors.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: scaffold about.html shell with nav and footer"
```

---

### Task 3: Hero section

**Files:**
- Modify: `about.html` (insert at `<!-- SECTION_ANCHOR -->`, replace with hero markup + this comment moved below it)

**Interfaces:**
- Consumes: `.reveal-fade` (Task 2)
- Produces: `#about-hero` section; establishes `.section-inner` max-width/padding convention reused by Tasks 4-7

- [ ] **Step 1: Insert hero section HTML+CSS**

Replace `<!-- SECTION_ANCHOR: content sections inserted here by Tasks 3-8 -->` with:

```html
<!-- ── About Hero ── -->
<section id="about-hero">
  <div class="section-inner">
    <div class="about-hero-eyebrow reveal-fade">ABOUT US</div>
    <h1 class="about-hero-title reveal-fade">
      보이지 않는 <span class="accent-text">내부의 가치</span>를<br>발견합니다
    </h1>
    <p class="about-hero-sub reveal-fade">
      FINSIDE(파인사이드)는 AI와 비접촉 내부 분석 기술을 기반으로,<br>
      보이지 않는 내부 데이터를 정량화하여 산업에 적용하는 지능형 분석 솔루션 기업입니다.
    </p>
  </div>
</section>

<style>
  .section-inner {
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 clamp(56px, 8vw, 160px);
  }
  #about-hero {
    padding: clamp(160px, 22vh, 240px) 0 clamp(80px, 10vh, 120px);
    background: #0e0e0e;
  }
  .about-hero-eyebrow {
    font-size: 14px; letter-spacing: 0.28em;
    color: var(--accent2);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 24px;
  }
  .about-hero-title {
    font-size: clamp(32px, 4.4vw, 56px);
    font-weight: 700;
    line-height: 1.35;
    letter-spacing: -0.01em;
    color: var(--text);
  }
  .about-hero-title .accent-text { color: var(--accent2); }
  .about-hero-sub {
    margin-top: 28px;
    font-size: clamp(14px, 1.1vw, 18px);
    color: var(--text-mid);
    line-height: 1.85;
    max-width: 640px;
  }
  @media (max-width: 480px) {
    .section-inner { padding: 0 20px; }
  }
</style>

<!-- SECTION_ANCHOR: content sections inserted here by Tasks 4-8 -->
```

- [ ] **Step 2: Verify in browser**

Reload `about.html`. Confirm hero text fades/slides up on load (IntersectionObserver fires immediately since it's in viewport), title wraps correctly at narrow widths (resize to ~400px).

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add About Us hero section"
```

---

### Task 4: Vision & Mission (S.I.E.) section

**Files:**
- Modify: `about.html` (insert before the Task 3 `SECTION_ANCHOR` comment, update anchor comment to "Tasks 5-8")

**Interfaces:**
- Consumes: `.section-inner`, `.reveal-fade` (Task 3)
- Produces: `#vision` section, `.sie-grid`/`.sie-card` classes (self-contained, no downstream consumers)

- [ ] **Step 1: Insert Vision & Mission section**

Replace `<!-- SECTION_ANCHOR: content sections inserted here by Tasks 4-8 -->` with:

```html
<!-- ── Vision & Mission ── -->
<section id="vision">
  <div class="section-inner">
    <div class="vision-eyebrow reveal-fade">VISION</div>
    <h2 class="vision-heading reveal-fade">FIND — <b>산업의 새로운 기준</b>을 만듭니다</h2>

    <div class="sie-grid">
      <div class="sie-card reveal-fade">
        <div class="sie-letter">S</div>
        <div class="sie-word">Satisfaction</div>
        <div class="sie-desc">고객 만족 — 정밀한 진단으로 신뢰할 수 있는 결과를 제공합니다</div>
      </div>
      <div class="sie-card reveal-fade">
        <div class="sie-letter">I</div>
        <div class="sie-word">Intelligence</div>
        <div class="sie-desc">기술 지능화 — AI 기반 분석으로 데이터의 정확도를 높입니다</div>
      </div>
      <div class="sie-card reveal-fade">
        <div class="sie-letter">E</div>
        <div class="sie-word">Effectiveness</div>
        <div class="sie-desc">제품 효율화 — 비접촉·비파괴 방식으로 측정 편의성을 극대화합니다</div>
      </div>
    </div>
  </div>
</section>

<style>
  #vision {
    padding: clamp(80px, 10vh, 120px) 0;
    background: #111311;
  }
  .vision-eyebrow {
    font-size: 13px; letter-spacing: 0.24em;
    color: var(--accent2);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .vision-heading {
    font-size: clamp(24px, 2.6vw, 36px);
    font-weight: 500;
    color: var(--text);
    margin-bottom: 56px;
  }
  .vision-heading b { font-weight: 800; }
  .sie-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(20px, 2.5vw, 40px);
  }
  .sie-card {
    background: #ffffff08;
    border: 1px solid #ffffff14;
    border-radius: 16px;
    padding: clamp(28px, 3vw, 40px);
  }
  .sie-letter {
    font-size: 40px;
    font-weight: 800;
    color: var(--accent);
    margin-bottom: 12px;
  }
  .sie-word {
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 12px;
  }
  .sie-desc {
    font-size: 14px;
    color: var(--text-mid);
    line-height: 1.7;
  }
  @media (max-width: 900px) {
    .sie-grid { grid-template-columns: 1fr; }
  }
</style>

<!-- SECTION_ANCHOR: content sections inserted here by Tasks 5-8 -->
```

- [ ] **Step 2: Verify in browser**

Reload, scroll to Vision section. Confirm 3 cards render in a row (stack on narrow/mobile width), each card fades in independently as it enters viewport (cards should stagger visually since `.reveal-fade` triggers per-element).

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add Vision and Mission (S.I.E.) section"
```

---

### Task 5: Core Philosophy (OSMU) section

**Files:**
- Modify: `about.html` (insert before anchor, update anchor to "Tasks 6-8")

**Interfaces:**
- Consumes: `.section-inner`, `.reveal-fade`
- Produces: `#philosophy` section, `.osmu-list` class (self-contained)

- [ ] **Step 1: Insert OSMU section**

Replace `<!-- SECTION_ANCHOR: content sections inserted here by Tasks 5-8 -->` with:

```html
<!-- ── Core Philosophy: OSMU ── -->
<section id="philosophy">
  <div class="section-inner osmu-layout">
    <div class="osmu-text reveal-fade">
      <div class="osmu-eyebrow">PHILOSOPHY</div>
      <h2 class="osmu-heading">하나의 기술, <b>다양한 산업</b><br>OSMU 전략</h2>
      <p class="osmu-desc">
        FINSIDE는 하나의 AI 선별·진단 원천기술(One Source Multi-Use)을
        여러 산업에 적용합니다. LWIR(장파 적외선) 기반 비접촉 분석으로
        표면 아래 내부 상태를 정량화하고, 이를 각 산업의 문제 해결에
        맞게 확장합니다.
      </p>
    </div>
    <ul class="osmu-list reveal-fade">
      <li><span class="osmu-tag">뷰티</span>피부 진단기기 · 스마트 미러</li>
      <li><span class="osmu-tag">농산물</span>품질 · 성분 비파괴 선별</li>
      <li><span class="osmu-tag">바이오</span>바이오차 품질 분석</li>
      <li><span class="osmu-tag">자원순환</span>폐플라스틱 소재 선별</li>
      <li><span class="osmu-tag">축산</span>축분 측정 · 정화 모니터링</li>
    </ul>
  </div>
</section>

<style>
  #philosophy {
    padding: clamp(80px, 10vh, 120px) 0;
    background: #0e0e0e;
  }
  .osmu-layout {
    display: flex;
    gap: clamp(40px, 6vw, 100px);
    align-items: flex-start;
  }
  .osmu-text { flex: 0 1 44%; min-width: 0; }
  .osmu-eyebrow {
    font-size: 13px; letter-spacing: 0.24em;
    color: var(--accent2);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .osmu-heading {
    font-size: clamp(22px, 2.4vw, 32px);
    font-weight: 500;
    line-height: 1.4;
    color: var(--text);
    margin-bottom: 24px;
  }
  .osmu-heading b { font-weight: 800; color: var(--accent2); }
  .osmu-desc {
    font-size: clamp(14px, 1vw, 16px);
    color: var(--text-mid);
    line-height: 1.85;
  }
  .osmu-list {
    flex: 0 1 56%;
    min-width: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .osmu-list li {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #ffffff08;
    border: 1px solid #ffffff14;
    border-radius: 12px;
    padding: 18px 24px;
    font-size: 15px;
    color: var(--text);
  }
  .osmu-tag {
    flex: 0 0 auto;
    background: var(--accent2);
    color: #0e0e0e;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 6px 12px;
    border-radius: 20px;
  }
  @media (max-width: 900px) {
    .osmu-layout { flex-direction: column; }
    .osmu-text, .osmu-list { flex: none; width: 100%; }
  }
</style>

<!-- SECTION_ANCHOR: content sections inserted here by Tasks 6-8 -->
```

- [ ] **Step 2: Verify in browser**

Reload, scroll to Philosophy section. Confirm left text / right tag-list layout side by side on desktop, stacked on mobile width (< 900px).

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add Core Philosophy (OSMU) section"
```

---

### Task 6: History timeline section

**Files:**
- Modify: `about.html` (insert before anchor, update anchor to "Tasks 7-8")

**Interfaces:**
- Consumes: `.section-inner`, `.reveal-fade`
- Produces: `#history` section, `.timeline` class (self-contained)

- [ ] **Step 1: Insert timeline section**

Replace `<!-- SECTION_ANCHOR: content sections inserted here by Tasks 6-8 -->` with:

```html
<!-- ── History Timeline ── -->
<section id="history">
  <div class="section-inner">
    <div class="history-eyebrow reveal-fade">HISTORY</div>
    <h2 class="history-heading reveal-fade">지금까지의 <b>발자취</b></h2>

    <ol class="timeline">
      <li class="timeline-item reveal-fade">
        <div class="timeline-date">2024.04</div>
        <div class="timeline-body">IP스타과학자 지원형 선정</div>
      </li>
      <li class="timeline-item reveal-fade">
        <div class="timeline-date">2024.06</div>
        <div class="timeline-body">범부처 고가장비 구축사업 선정 — 10WAY GPU Tesla 서버 도입, AI 플랫폼 구축</div>
      </li>
      <li class="timeline-item reveal-fade">
        <div class="timeline-date">2025.07</div>
        <div class="timeline-body">딥테크 예비창업패키지(충북창조경제혁신센터) 선정 — 시제품 개발 및 주요 부품 고도화</div>
      </li>
      <li class="timeline-item reveal-fade">
        <div class="timeline-date">2025.12</div>
        <div class="timeline-body">C-LOVE NEXT BRIDGE 선정</div>
      </li>
      <li class="timeline-item reveal-fade">
        <div class="timeline-date">2025.12.18</div>
        <div class="timeline-body"><b>주식회사 파인사이드 법인 설립</b></div>
      </li>
    </ol>
  </div>
</section>

<style>
  #history {
    padding: clamp(80px, 10vh, 120px) 0;
    background: #111311;
  }
  .history-eyebrow {
    font-size: 13px; letter-spacing: 0.24em;
    color: var(--accent2);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .history-heading {
    font-size: clamp(24px, 2.6vw, 36px);
    font-weight: 500;
    color: var(--text);
    margin-bottom: 56px;
  }
  .history-heading b { font-weight: 800; }
  .timeline {
    list-style: none;
    position: relative;
    padding-left: 32px;
    border-left: 1px solid #ffffff22;
  }
  .timeline-item {
    position: relative;
    padding-bottom: 40px;
  }
  .timeline-item:last-child { padding-bottom: 0; }
  .timeline-item::before {
    content: '';
    position: absolute;
    left: -37px;
    top: 4px;
    width: 9px; height: 9px;
    border-radius: 50%;
    background: var(--accent2);
  }
  .timeline-date {
    font-size: 14px;
    font-weight: 700;
    color: var(--accent2);
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }
  .timeline-body {
    font-size: 16px;
    color: var(--text);
    line-height: 1.7;
    max-width: 640px;
  }
</style>

<!-- SECTION_ANCHOR: content sections inserted here by Tasks 7-8 -->
```

- [ ] **Step 2: Verify in browser**

Reload, scroll to History section. Confirm vertical timeline renders with dots aligned to the left border, dates in mint color, entries fade in as scrolled into view.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add History timeline section"
```

---

### Task 7: Leadership (CEO + team summary) section

**Files:**
- Modify: `about.html` (insert before anchor, update anchor to "Task 8")

**Interfaces:**
- Consumes: `.section-inner`, `.reveal-fade`
- Produces: `#leadership` section, `.team-role-grid` class (self-contained)

- [ ] **Step 1: Insert leadership section**

Replace `<!-- SECTION_ANCHOR: content sections inserted here by Tasks 7-8 -->` with:

```html
<!-- ── Leadership ── -->
<section id="leadership">
  <div class="section-inner leadership-layout">
    <div class="ceo-block reveal-fade">
      <div class="leadership-eyebrow">LEADERSHIP</div>
      <h2 class="ceo-name">이동훈 <span>CEO</span></h2>
      <p class="ceo-bio">
        충북대학교 바이오시스템공학과 교수(2013~현재)로,
        바이오시스템 정보기술 융합과 농업특화 인공지능 시스템 설계·자동화를
        연구해 왔습니다. 보유 특허 30건(국내 8건, PCT 2건), 최근 3년
        기술이전 18건(2.5억원)의 실적을 바탕으로 FINSIDE의 핵심 기술을
        이끌고 있습니다.
      </p>
      <ul class="ceo-stats">
        <li><b>30건</b><span>보유 특허</span></li>
        <li><b>18건</b><span>최근 3년 기술이전</span></li>
        <li><b>6편</b><span>게재 논문</span></li>
      </ul>
    </div>

    <div class="team-block reveal-fade">
      <div class="team-heading">팀 구성</div>
      <ul class="team-role-grid">
        <li><span class="team-role">CTO</span>개발총괄</li>
        <li><span class="team-role">차장</span>S/W 개발</li>
        <li><span class="team-role">차장</span>H/W 총괄</li>
        <li><span class="team-role">차장</span>재무관리 · 회계</li>
        <li><span class="team-role">차장</span>지재권 · 특허관리</li>
      </ul>
    </div>
  </div>
</section>

<style>
  #leadership {
    padding: clamp(80px, 10vh, 120px) 0;
    background: #0e0e0e;
  }
  .leadership-layout {
    display: flex;
    gap: clamp(40px, 6vw, 100px);
    align-items: flex-start;
  }
  .leadership-eyebrow {
    font-size: 13px; letter-spacing: 0.24em;
    color: var(--accent2);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .ceo-block { flex: 0 1 58%; min-width: 0; }
  .ceo-name {
    font-size: clamp(24px, 2.6vw, 34px);
    font-weight: 700;
    color: var(--text);
    margin-bottom: 24px;
  }
  .ceo-name span {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-dim);
    margin-left: 10px;
    letter-spacing: 0.1em;
  }
  .ceo-bio {
    font-size: clamp(14px, 1vw, 16px);
    color: var(--text-mid);
    line-height: 1.85;
    max-width: 620px;
  }
  .ceo-stats {
    list-style: none;
    display: flex;
    gap: clamp(24px, 3vw, 48px);
    margin-top: 32px;
  }
  .ceo-stats li {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ceo-stats b {
    font-size: 28px;
    font-weight: 800;
    color: var(--accent2);
  }
  .ceo-stats span {
    font-size: 13px;
    color: var(--text-dim);
  }
  .team-block { flex: 0 1 42%; min-width: 0; }
  .team-heading {
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 20px;
  }
  .team-role-grid {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .team-role-grid li {
    display: flex;
    align-items: center;
    gap: 14px;
    background: #ffffff08;
    border: 1px solid #ffffff14;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 14px;
    color: var(--text-mid);
  }
  .team-role {
    flex: 0 0 auto;
    background: #ffffff14;
    color: var(--text);
    font-size: 12px;
    font-weight: 700;
    padding: 5px 10px;
    border-radius: 6px;
  }
  @media (max-width: 900px) {
    .leadership-layout { flex-direction: column; }
    .ceo-block, .team-block { flex: none; width: 100%; }
  }
</style>

<!-- SECTION_ANCHOR: content sections inserted here by Task 8 -->
```

- [ ] **Step 2: Verify in browser**

Reload, scroll to Leadership section. Confirm CEO bio + stats on the left, team role list on the right (stacked on mobile), stat numbers in mint color.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add Leadership section"
```

---

### Task 8: Partners section

**Files:**
- Modify: `about.html` (insert before anchor, remove the anchor comment entirely since this is the last section)

**Interfaces:**
- Consumes: `.section-inner`, `.reveal-fade`
- Produces: `#partners` section, `.partner-grid` class (final section, nothing downstream)

- [ ] **Step 1: Insert partners section**

Replace `<!-- SECTION_ANCHOR: content sections inserted here by Task 8 -->` with (note: no anchor comment left behind, this is the last content section before the footer):

```html
<!-- ── Partners ── -->
<section id="partners">
  <div class="section-inner">
    <div class="partners-eyebrow reveal-fade">PARTNERS</div>
    <h2 class="partners-heading reveal-fade">함께하는 <b>기관과 기업</b></h2>

    <div class="partner-group reveal-fade">
      <div class="partner-group-label">학술 · 지원기관</div>
      <div class="partner-grid">
        <span class="partner-chip">충북대학교</span>
        <span class="partner-chip">충북창조경제혁신센터</span>
      </div>
    </div>

    <div class="partner-group reveal-fade">
      <div class="partner-group-label">정부지원사업</div>
      <div class="partner-grid">
        <span class="partner-chip">IP스타과학자</span>
        <span class="partner-chip">딥테크 예비창업패키지</span>
        <span class="partner-chip">C-LOVE NEXT BRIDGE</span>
      </div>
    </div>

    <div class="partner-group reveal-fade">
      <div class="partner-group-label">실증협업기업</div>
      <div class="partner-grid">
        <span class="partner-chip">진영산업</span>
        <span class="partner-chip">한성티앤아이</span>
        <span class="partner-chip">한아</span>
        <span class="partner-chip">위드위</span>
        <span class="partner-chip">포네이처스</span>
        <span class="partner-chip">이듬</span>
      </div>
    </div>
  </div>
</section>

<style>
  #partners {
    padding: clamp(80px, 10vh, 120px) 0;
    background: #111311;
  }
  .partners-eyebrow {
    font-size: 13px; letter-spacing: 0.24em;
    color: var(--accent2);
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .partners-heading {
    font-size: clamp(24px, 2.6vw, 36px);
    font-weight: 500;
    color: var(--text);
    margin-bottom: 48px;
  }
  .partners-heading b { font-weight: 800; }
  .partner-group { margin-bottom: 36px; }
  .partner-group:last-child { margin-bottom: 0; }
  .partner-group-label {
    font-size: 13px;
    color: var(--text-dim);
    letter-spacing: 0.06em;
    margin-bottom: 14px;
  }
  .partner-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .partner-chip {
    background: #ffffff08;
    border: 1px solid #ffffff1a;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
    color: var(--text);
  }
</style>
```

- [ ] **Step 2: Verify in browser**

Reload `about.html` end-to-end. Scroll through all 7 sections top to bottom. Confirm: nav highlights "About Us", all sections fade in on scroll, timeline/leadership/partners layouts look correct at desktop width, then resize browser to ~375px and re-check all sections stack cleanly with no horizontal overflow.

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add Partners section, complete About Us page"
```

---

## Final Verification (after Task 8)

- [ ] Open `index.html`, click "About Us" in nav, confirm it navigates to `about.html`
- [ ] On `about.html`, click "FinSide" logo, confirm it navigates back to `index.html`
- [ ] Check browser console for errors on both pages (no 404s for fonts/assets, no JS errors)
- [ ] Resize to mobile width (375px) and tablet width (768px), confirm no horizontal scrollbar appears on `about.html`
