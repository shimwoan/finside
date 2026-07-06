# Hero 섹션 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `index.html`의 hero 섹션을 다크 테마 + 3D 분자 애니메이션 구성에서, 라이트 테마 + 실사 이미지(`assets/hero-person-device.png`) + 라이브 스캔 그리드 오버레이 + "주요 지표" 데이터 카드 구성으로 교체한다.

**Architecture:** 단일 정적 HTML 파일(`index.html`) 내에서 CSS/HTML/JS를 순차적으로 교체한다. 자동화 테스트 스위트가 없는 정적 사이트이므로, 각 태스크의 "테스트" 단계는 브라우저(`open index.html` 또는 로컬 서버)에서 시각적으로 확인하는 것으로 대체한다. 기존 3D 분자 캔버스 JS(`buildParticles`, `getMolecules`, `draw` 루프 등, 1436~1878행)는 완전히 제거하고 그 자리를 새 스캔 그리드 캔버스 JS로 교체한다. 텍스트 reveal 애니메이션 패턴(`.reveal-block`/`.reveal-inner`, IntersectionObserver 기반 스크롤 reveal)은 기존 컨벤션을 그대로 재사용한다.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas 2D API. 빌드 시스템 없음 (단일 `index.html` 직접 서빙, Vercel 배포).

## Global Constraints

- 스펙 문서: `docs/superpowers/specs/2026-07-06-hero-redesign-design.md` (모든 태스크는 이 문서의 요구사항을 따름)
- 변경 범위는 `#hero` 섹션, 관련 `nav` 스타일/스크립트, 그리고 hero 전용 CSS/JS 블록에 한정한다. `#ip` 이하 다른 섹션은 건드리지 않는다.
- 이미지 자산은 이미 `/Users/jaemu/workspace/finside/assets/hero-person-device.png`에 준비되어 있다 (새로 만들 필요 없음).
- 파트너 로고 스트립, "종합 피부 점수"/"피부 분석 결과" 카드는 이번 스코프에서 제외한다.
- 커밋은 각 태스크 완료 시마다 개별적으로 수행한다 (한 번에 몰아서 커밋하지 않는다).
- 각 태스크 완료 후 `open index.html` (또는 이미 떠 있는 로컬 서버 새로고침)로 브라우저에서 육안 확인 후 다음 태스크로 넘어간다.

---

### Task 1: 기존 3D 분자 캔버스 JS 제거, hero 전용 스캔 그리드 캔버스로 교체

**Files:**
- Modify: `index.html:1436-1878` (기존 `<script>` 블록 전체 — 분자 캔버스 렌더링 + 텍스트 reveal 오케스트레이션 포함)

**Interfaces:**
- Consumes: 없음 (신규 캔버스는 `#hero-inner` 안에 Task 2에서 새로 추가할 `<canvas id="scan-grid">` 엘리먼트를 참조)
- Produces: 전역 함수 `revealText()` (텍스트 reveal 오케스트레이션, Task 3에서 재사용), `countUp(el)` (스탯 카운트업, 이번 스코프에서는 미사용이지만 함수 시그니처는 유지)

이 태스크는 기존 코드에서 "분자/파티클 렌더링" 부분만 제거하고, 텍스트 reveal 오케스트레이션(`revealText`, `countUp`)은 유지한 채 스캔 그리드 캔버스 렌더링 코드로 교체하는 작업이다. `.hero-stats` 관련 reveal 로직은 Task 3에서 마크업과 함께 제거하므로, 이 태스크에서는 `revealText()` 함수의 `stats` 관련 라인만 먼저 정리한다.

- [ ] **Step 1: 기존 스크립트 블록(1436~1878행)을 아래 내용으로 전체 교체**

1436행의 `<script>`부터 1878행의 `</script>`까지 전체를 다음 코드로 교체:

```html
<script>
// ─────────────────────────────────────────────────────────
//  Hero scan-grid overlay — pulsing radial dot/line grid
//  layered over the cheek area of the hero photo.
//  Purely decorative "deep scan" feel — no facial data.
// ─────────────────────────────────────────────────────────

const canvas = document.getElementById('scan-grid');
const ctx    = canvas.getContext('2d');
let W = 0, H = 0;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
const ro = new ResizeObserver(resize);
ro.observe(canvas);
resize();

// ── Depth layers ─────────────────────────────────────────
// Each layer pulses at a different speed/phase for a
// "scanning through skin depth" feel without being literal.
const LAYERS = [
  { rings: 4, dotsPerRing: 14, speed: 0.6, phase: 0,    color: '42,158,255', maxR: 0.92 },
  { rings: 3, dotsPerRing: 10, speed: 0.9, phase: 1.1,  color: '86,182,255', maxR: 0.62 },
  { rings: 2, dotsPerRing: 8,  speed: 1.3, phase: 2.4,  color: '150,205,255', maxR: 0.34 },
];

function drawLayer(layer, t, cx, cy, baseR) {
  const pulse = 0.5 + 0.5 * Math.sin(t * layer.speed + layer.phase);
  for (let r = 1; r <= layer.rings; r++) {
    const ringR = (baseR * layer.maxR) * (r / layer.rings);
    const alpha = (0.15 + 0.35 * pulse) * (1 - r / (layer.rings + 1.5));

    // connecting ring line
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${layer.color},${alpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // dots around the ring
    for (let i = 0; i < layer.dotsPerRing; i++) {
      const angle = (i / layer.dotsPerRing) * Math.PI * 2 + t * 0.15 * layer.speed;
      const dx = cx + Math.cos(angle) * ringR;
      const dy = cy + Math.sin(angle) * ringR;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${layer.color},${alpha})`;
      ctx.fill();
    }
  }

  // center glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * layer.maxR * 0.5);
  grad.addColorStop(0, `rgba(${layer.color},${0.25 * pulse})`);
  grad.addColorStop(1, `rgba(${layer.color},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, baseR * layer.maxR * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function draw(ts) {
  requestAnimationFrame(draw);
  if (!W || !H) return;
  ctx.clearRect(0, 0, W, H);

  const t = ts / 1000;
  // anchor point matches the cheek position in hero-person-device.png
  // (right-of-center, slightly above vertical middle of the image)
  const cx = W * 0.52;
  const cy = H * 0.46;
  const baseR = Math.min(W, H) * 0.5;

  LAYERS.forEach(layer => drawLayer(layer, t, cx, cy, baseR));
}
requestAnimationFrame(draw);

// ── Text reveal orchestration ─────────────────────────────
// Staggered sequence: label → title lines → divider → sub → cta
function revealText() {
  const delay = (el, ms, fn) => setTimeout(() => { if (el) fn(el); }, ms);

  const label    = document.querySelector('.hero-label');
  const lines    = document.querySelectorAll('.reveal-block');
  const divider  = document.querySelector('.hero-divider');
  const sub      = document.querySelector('.hero-sub');
  const cta      = document.querySelector('.hero-cta');

  lines.forEach((line, i) => {
    delay(line, 320 + i * 140, el => el.classList.add('revealed'));
  });

  delay(divider, 320 + lines.length * 140 + 60, el => el.classList.add('revealed'));
  delay(sub, 820, el => el.classList.add('revealed'));
  delay(cta, 1020, el => el.classList.add('revealed'));
}

// Start text reveal shortly after page load
setTimeout(revealText, 80);
</script>
```

- [ ] **Step 2: 브라우저에서 확인**

`index.html`을 브라우저로 열거나 로컬 서버를 새로고침한다. 이 시점에는 아직 `#scan-grid` 캔버스 엘리먼트가 마크업에 없으므로 콘솔에 `Cannot read properties of null (reading 'getContext')` 에러가 발생하는 것이 **정상**이다 (Task 2에서 마크업 추가 시 해결됨). 에러 메시지가 정확히 이 형태인지만 확인한다.

- [ ] **Step 3: 커밋**

```bash
git add index.html
git commit -m "refactor: replace hero molecule canvas with scan-grid renderer"
```

---

### Task 2: hero 마크업 교체 — 텍스트, 실사 이미지, 스캔 그리드 캔버스, 주요 지표 카드

**Files:**
- Modify: `index.html:858-892` (`<section id="hero">` 전체)

**Interfaces:**
- Consumes: Task 1에서 정의한 `resize()`/`draw()`가 참조할 `<canvas id="scan-grid">` 엘리먼트, `revealText()`가 참조할 `.hero-label`/`.reveal-block`/`.hero-divider`/`.hero-sub`/`.hero-cta` 클래스
- Produces: `.hero-metrics` 카드 마크업 (Task 4의 바 그래프 애니메이션 JS가 `data-target` 속성으로 소비), `.metric-bar[data-target]` 구조

- [ ] **Step 1: 858~892행의 `<section id="hero">`를 아래 내용으로 전체 교체**

```html
<section id="hero">
  <div id="hero-inner">
  <div class="hero-content">
    <div class="hero-eyebrow">측정 · 진단 · 데이터 플랫폼</div>
    <h1 class="hero-title">
      <div class="reveal-block"><span class="reveal-inner">정확한 측정 데이터</span></div>
      <div class="reveal-block"><span class="reveal-inner">기반으로 <span class="accent">더 나은 결정</span>을</span></div>
      <div class="reveal-block"><span class="reveal-inner">만듭니다</span></div>
    </h1>
    <div class="hero-divider"></div>
    <p class="hero-sub">
      비접촉 방식으로 피부 데이터를 정밀하게 측정하고,<br>
      축적된 데이터를 기반으로 신뢰할 수 있는 인사이트를 제공합니다
    </p>
    <div class="hero-cta">
      <button class="btn-primary-blue">솔루션 자세히 보기 →</button>
    </div>
  </div>

  <div class="hero-visual">
    <img class="hero-photo" src="assets/hero-person-device.png" alt="Finside 디바이스로 피부를 측정하는 모습">
    <canvas id="scan-grid"></canvas>

    <div class="hero-metrics">
      <div class="metrics-title">주요 지표</div>
      <div class="metric-row">
        <span class="metric-label metric-alert">수분</span>
        <div class="metric-bar-track"><div class="metric-bar metric-alert" data-target="76"></div></div>
        <span class="metric-value metric-alert" data-target="76">0</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">유분</span>
        <div class="metric-bar-track"><div class="metric-bar" data-target="65"></div></div>
        <span class="metric-value" data-target="65">0</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">모공</span>
        <div class="metric-bar-track"><div class="metric-bar" data-target="72"></div></div>
        <span class="metric-value" data-target="72">0</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">탄력</span>
        <div class="metric-bar-track"><div class="metric-bar" data-target="68"></div></div>
        <span class="metric-value" data-target="68">0</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">멜라닌</span>
        <div class="metric-bar-track"><div class="metric-bar" data-target="58"></div></div>
        <span class="metric-value" data-target="58">0</span>
      </div>
      <div class="metric-row">
        <span class="metric-label">피부결</span>
        <div class="metric-bar-track"><div class="metric-bar" data-target="81"></div></div>
        <span class="metric-value" data-target="81">0</span>
      </div>
    </div>
  </div>
  </div>
</section>
```

- [ ] **Step 2: 브라우저에서 확인**

브라우저를 새로고침한다. 이 시점에는 아직 CSS가 라이트 테마로 바뀌지 않았으므로 레이아웃이 깨져 보이는 것이 **정상** (Task 3에서 CSS 교체 후 해결됨). 콘솔에 Task 1에서 봤던 `getContext` 에러가 더 이상 나타나지 않는지만 확인한다 (`#scan-grid` 캔버스가 이제 존재하므로).

- [ ] **Step 3: 커밋**

```bash
git add index.html
git commit -m "feat: replace hero markup with photo, scan-grid canvas, and metrics card"
```

---

### Task 3: hero CSS 교체 — 라이트 테마, 텍스트 스타일, 레이아웃

**Files:**
- Modify: `index.html:36-49` (`#hero::before` 다크 glow)
- Modify: `index.html:86-277` (`#hero`, `#scene`→`.hero-visual`, `.hero-content`, `.hero-label`, `.hero-title`, `.hero-divider`, `.hero-sub`, `.hero-cta`, `.btn-primary`/`.btn-ghost`, `.hero-stats`, `.stat-num`, `.stat-label`, `.scroll-hint`, reveal 애니메이션 규칙)

**Interfaces:**
- Consumes: Task 2의 마크업 클래스 (`.hero-eyebrow`, `.hero-visual`, `.hero-photo`, `#scan-grid`, `.hero-metrics`, `.metric-row`, `.metric-label`, `.metric-bar-track`, `.metric-bar`, `.metric-value`, `.metric-alert`, `.btn-primary-blue`)
- Produces: 없음 (최종 시각 스타일)

기존 `.hero-label` 클래스는 nav 로고(`<div class="hero-label nav-logo">FinSide</div>`, 850행)와 hero 본문 eyebrow 둘 다에 쓰였다. 이번 리디자인에서 hero eyebrow는 별도 클래스 `.hero-eyebrow`로 분리했으므로 (Task 2 참고), `.hero-label`은 이제 nav 로고 전용으로만 남는다. 이 태스크에서 `.hero-label`의 hero 전용 규칙(124-129행, 245-251행)은 제거하지 않고 nav 로고 스타일로서 유지한다.

- [ ] **Step 1: 36~49행 `#hero::before` 규칙을 아래로 교체**

```css
  /* soft blue glow behind hero visual, light theme */
  #hero::before {
    content: '';
    position: absolute;
    right: max(8%, calc((100vw - 1800px) / 2 + 40px)); top: 50%;
    transform: translateY(-50%);
    width: min(56vw, 1000px); height: 80vh;
    background: radial-gradient(ellipse at center,
      #eaf3ff 0%,
      #f5f9ff 45%,
      transparent 72%
    );
    pointer-events: none;
    z-index: 0;
  }
```

- [ ] **Step 2: 86~277행 전체를 아래로 교체**

86행 `#hero {`부터 277행 `.stat-num { font-variant-numeric: tabular-nums; }`까지 전체를 다음으로 교체:

```css
  #hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    position: relative;
    overflow: clip;
    scroll-snap-align: start;
    padding-top: clamp(80px, 10vh, 140px);
    padding-bottom: clamp(80px, 10vh, 140px);
    box-sizing: border-box;
    height: 100vh;
    background: #fcfdff;
  }

  #hero-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: clamp(24px, 4vw, 64px);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 44%;
    padding: 0 0 0 clamp(80px, 12vw, 240px);
  }

  .hero-eyebrow {
    font-size: 14px; letter-spacing: 0.2em;
    color: #6b7280; margin-bottom: 28px;
    font-weight: 500; opacity: 0.9;
  }

  .hero-title {
    font-size: clamp(28px, 3.6vw, 64px);
    font-weight: 800;
    line-height: 1.28;
    letter-spacing: 0;
    color: #17181c;
  }
  .hero-title .accent {
    color: #2f6bff;
  }

  .hero-divider {
    width: 40px; height: 1px;
    background: #17181c;
    opacity: 0.2;
    margin: clamp(16px, 2.5vh, 32px) 0;
  }

  .hero-sub {
    font-size: clamp(14px, 1.1vw, 20px);
    color: #4b5563;
    line-height: 1.8;
    max-width: clamp(320px, 28vw, 480px);
    font-weight: 400;
    letter-spacing: 0.01em;
  }

  .hero-cta { display: flex; gap: 16px; margin-top: clamp(24px, 4vh, 48px); align-items: center; }

  .btn-primary-blue {
    background: #2f6bff;
    color: #ffffff;
    font-size: 15px; font-weight: 600; letter-spacing: 0.01em;
    padding: 14px 28px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .btn-primary-blue:hover {
    background: #1f54db;
  }

  /* ── Hero visual: photo + scan-grid + metrics card ───── */
  .hero-visual {
    position: relative;
    z-index: 2;
    width: 56%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    height: 100%;
  }

  .hero-photo {
    position: relative;
    z-index: 1;
    height: clamp(500px, 75vh, 780px);
    width: auto;
    max-width: 100%;
    object-fit: contain;
    -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
    mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
  }

  #scan-grid {
    position: absolute;
    z-index: 2;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .hero-metrics {
    position: absolute;
    z-index: 3;
    right: clamp(0px, 4vw, 48px);
    bottom: clamp(40px, 8vh, 90px);
    width: clamp(220px, 20vw, 280px);
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(20, 30, 60, 0.12);
    padding: 20px 22px;
  }

  .metrics-title {
    font-size: 13px;
    font-weight: 700;
    color: #17181c;
    letter-spacing: 0.02em;
    margin-bottom: 14px;
  }

  .metric-row {
    display: grid;
    grid-template-columns: 40px 1fr 28px;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .metric-row:last-child { margin-bottom: 0; }

  .metric-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
  }
  .metric-label.metric-alert { color: #e0393e; }

  .metric-bar-track {
    height: 6px;
    background: #eef1f6;
    border-radius: 3px;
    overflow: hidden;
  }
  .metric-bar {
    height: 100%;
    width: 0%;
    background: #2f6bff;
    border-radius: 3px;
    transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .metric-bar.metric-alert { background: #e0393e; }

  .metric-value {
    font-size: 12px;
    font-weight: 700;
    color: #17181c;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .metric-value.metric-alert { color: #e0393e; }

  .scroll-hint {
    position: absolute; bottom: 36px; left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
    opacity: 0.4;
  }
  .scroll-hint span {
    font-size: 12px; letter-spacing: 0.15em;
    color: #17181c; text-transform: uppercase;
  }
  .scroll-arrow {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, #17181c, transparent);
    animation: scrollBounce 2.5s ease-in-out infinite;
  }
  @keyframes scrollBounce {
    0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
    50%       { opacity: 1;   transform: scaleY(1);   transform-origin: top; }
  }

  /* ── Text reveal animation ── */
  .reveal-block {
    overflow: hidden;
  }
  .reveal-inner {
    display: block;
    transform: translateY(100%);
    opacity: 0;
    transition:
      transform 0.9s cubic-bezier(0.16, 1, 0.3, 1),
      opacity   0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-block.revealed .reveal-inner {
    transform: translateY(0);
    opacity: 1;
  }

  .hero-divider {
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hero-divider.revealed { transform: scaleX(1); }

  .hero-sub, .hero-cta {
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity   0.8s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hero-sub.revealed,
  .hero-cta.revealed {
    opacity: 1;
    transform: translateY(0);
  }
```

**주의:** 원본 124~129행(`.hero-label`)과 245~251행(`.hero-label`/`.hero-label.revealed`)은 이번 교체 범위(86~277행) 안에 포함되어 있었지만, nav 로고가 이 클래스를 계속 사용하므로 **삭제하지 않고 유지**해야 한다. 위 교체 블록에는 `.hero-label` 규칙이 포함되어 있지 않으므로, 실제 편집 시 아래 규칙을 (36~49행 patch 이후, 86행 patch 이전 위치에) 별도로 보존해서 남겨둔다:

```css
  .hero-label {
    font-size: 14px; letter-spacing: 0.22em;
    color: #17181c;
    font-weight: 600; text-transform: uppercase;
    transition: color 0.35s;
  }
  .hero-label.revealed { color: #1a1a1a; }
```

(다크 테마 nav 위에서 쓰이던 `color: var(--text)` 대신 라이트 nav 전제로 `#17181c` 고정값으로 조정 — Task 5에서 다루는 nav 라이트 전환과 일치시킴)

- [ ] **Step 3: 브라우저에서 확인**

새로고침 후 hero 섹션이 라이트 배경, 좌측 텍스트, 우측 사진+파란 스캔 그리드+주요 지표 카드(막대는 아직 0%, Task 4에서 애니메이션 추가) 레이아웃으로 보이는지 확인한다. 텍스트 reveal 애니메이션(줄별로 올라오는 효과)이 정상 동작하는지 확인한다.

- [ ] **Step 4: 커밋**

```bash
git add index.html
git commit -m "style: apply light theme to hero section, add metrics card styles"
```

---

### Task 4: 주요 지표 카드 — 스크롤 reveal 시 바 그래프 애니메이션

**Files:**
- Modify: `index.html` — Task 1에서 만든 `<script>` 블록의 `revealText()` 함수 바로 아래 (새 함수 추가)

**Interfaces:**
- Consumes: `.hero-metrics`, `.metric-bar[data-target]`, `.metric-value[data-target]` (Task 2 마크업)
- Produces: `revealMetrics()` 함수 (IntersectionObserver로 자동 호출되므로 외부에서 직접 호출할 필요 없음)

- [ ] **Step 1: Task 1에서 추가한 `<script>` 블록 안, `setTimeout(revealText, 80);` 바로 아래에 다음 코드 추가**

```html
<script>
// ── Metrics card: bar-fill + count-up on scroll into view ──
(function() {
  const card = document.querySelector('.hero-metrics');
  if (!card) return;

  function animateMetrics() {
    card.querySelectorAll('.metric-bar[data-target]').forEach((bar, i) => {
      const target = parseInt(bar.dataset.target, 10);
      setTimeout(() => { bar.style.width = target + '%'; }, i * 90);
    });
    card.querySelectorAll('.metric-value[data-target]').forEach((val, i) => {
      const target = parseInt(val.dataset.target, 10);
      setTimeout(() => countUp(val), i * 90);
    });
  }

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    animateMetrics();
  }, { threshold: 0.4 });

  obs.observe(card);
})();
</script>
```

- [ ] **Step 2: 브라우저에서 확인**

새로고침 후 페이지 로드 시 (hero가 뷰포트에 40% 이상 보이는 상태이므로) 주요 지표 카드의 막대그래프들이 순차적으로 0%에서 목표치까지 차오르고, 숫자가 0에서 카운트업되는지 확인한다. "수분" 항목만 빨간색(라벨, 막대, 숫자 모두)으로 표시되는지 확인한다.

- [ ] **Step 3: 커밋**

```bash
git add index.html
git commit -m "feat: animate metrics bar chart fill and count-up on scroll into view"
```

---

### Task 5: 네비게이션 라이트 테마 전환

**Files:**
- Modify: `index.html:51-84` (`nav`, `nav.scrolled`, `nav.nav-dark`, `.nav-links a` 등 CSS)
- Modify: `index.html:849-856` (`<nav>` 마크업 — 문의하기 버튼 추가)
- Modify: `index.html:2252-2277` (nav 스크롤 JS — hero 진입/이탈 시 다크/라이트 토글 로직)

**Interfaces:**
- Consumes: 없음
- Produces: 없음 (최종 시각 스타일 + 동작)

기존 로직은 "hero(다크) 위에서는 흰 텍스트, hero를 벗어나면(다른 섹션은 라이트) 다크 텍스트"로 토글했다. hero가 이제 라이트 배경이 되므로, nav는 **항상 다크 텍스트**로 고정하고 토글 로직 자체를 제거한다.

- [ ] **Step 1: 51~84행 nav CSS를 아래로 교체**

```css
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px clamp(56px, 5vw, 120px);
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    transition: backdrop-filter 0.35s, background 0.35s, border-color 0.35s;
    border-bottom: 1px solid transparent;
  }
  nav.scrolled {
    background: #ffffffcc;
    backdrop-filter: blur(16px) saturate(1.4);
    -webkit-backdrop-filter: blur(16px) saturate(1.4);
    border-bottom-color: #1a1a1a10;
  }
  nav * { pointer-events: auto; }
  .nav-logo {
    transition: color 0.35s;
  }
  nav .nav-logo { margin-bottom: 0; }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    color: #17181c;
    text-decoration: none;
    font-size: 14px; letter-spacing: 0.1em; font-weight: 400;
    transition: color 0.35s;
  }
  .nav-contact {
    background: #2f6bff;
    color: #ffffff;
    font-size: 13px; font-weight: 600; letter-spacing: 0.02em;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
  }
  .nav-contact:hover { background: #1f54db; }
```

- [ ] **Step 2: 849~856행 `<nav>` 마크업을 아래로 교체**

```html
<nav>
  <div class="hero-label nav-logo">FinSide</div>
  <ul class="nav-links">
    <li><a href="#">Technology</a></li>
    <li><a href="#">Product</a></li>
    <li><a href="#">Company</a></li>
  </ul>
  <button class="nav-contact">문의하기</button>
</nav>
```

- [ ] **Step 3: 2252~2277행 nav 스크롤 JS를 아래로 교체**

```javascript
// nav: 스크롤 시 배경 블러만 적용, 텍스트는 항상 다크 (전 섹션 라이트 테마)
(function() {
  const nav  = document.querySelector('nav');
  const hero = document.getElementById('hero');

  function updateNav() {
    const heroVisible = hero ? hero.getBoundingClientRect().bottom > 80 : false;
    nav.classList.toggle('scrolled', !heroVisible);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
```

- [ ] **Step 4: 브라우저에서 확인**

새로고침 후 nav 로고와 링크가 hero 위에서부터 다크 텍스트로 보이는지, 우측에 파란 "문의하기" 버튼이 보이는지 확인한다. 페이지를 스크롤해서 hero를 벗어났을 때 nav에 블러 배경이 적용되는지, 텍스트 색이 계속 다크로 유지되는지 확인한다.

- [ ] **Step 5: 커밋**

```bash
git add index.html
git commit -m "style: switch nav to permanent light theme, add contact button"
```

---

### Task 6: 전체 회귀 확인

**Files:**
- 없음 (검증 전용 태스크)

**Interfaces:**
- Consumes: Task 1~5의 모든 변경사항
- Produces: 없음

- [ ] **Step 1: 브라우저 콘솔 에러 확인**

`index.html`을 브라우저로 열고 개발자 도구 콘솔을 확인한다. 에러나 경고가 없어야 한다 (특히 `getContext`, `querySelector` null 참조 관련).

- [ ] **Step 2: 전체 페이지 스크롤 확인**

hero → `#ip`(IP 확보) → 이후 섹션들까지 스크롤하면서 `scroll-snap` 동작, 각 섹션 reveal 애니메이션이 기존과 동일하게 동작하는지 확인한다. hero 리디자인이 다른 섹션에 레이아웃 영향을 주지 않았는지 확인한다.

- [ ] **Step 3: 반응형 확인**

브라우저 창 너비를 줄여가며 (또는 개발자 도구 반응형 모드로) hero 레이아웃이 clamp() 기반으로 자연스럽게 축소되는지, 주요 지표 카드가 사진과 겹치는 위치를 벗어나지 않는지 확인한다. (참고: 이 사이트는 데스크톱 전용이며 `.mobile-block` 오버레이가 이미 모바일 뷰를 차단하고 있음 — 별도 모바일 대응 불필요.)

- [ ] **Step 4: 최종 커밋 (변경사항이 있는 경우에만)**

Step 1~3에서 발견된 문제를 수정했다면:

```bash
git add index.html
git commit -m "fix: address regressions found in hero redesign QA pass"
```

변경사항이 없다면 이 스텝은 생략한다.
