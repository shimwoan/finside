# 사업 분야 상세 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nav에 "사업 분야" 드롭다운을 추가하고, 4개 사업 분야(Beauty/Agriculture/Bio & Process/Resource Circulation)에 대한 독립 상세 페이지를 신설해 홈페이지 요약을 확장한다.

**Architecture:** 정적 HTML 사이트(빌드 도구 없음). 공유 nav는 `partials/header.js`(document.write로 마크업 생성), 공유 footer는 `partials/footer.js`, 공유 CSS는 루트 `style.css` 하나. 4개 신규 페이지는 `about.html`과 동일한 구조(NAV_PAGE 전역변수 + header.js include + 섹션들 + footer.js include + reveal-fade observer 스크립트)를 따르는 개별 HTML 파일이며, 신규 CSS 클래스는 `style.css`에 한 번만 추가해 4개 페이지가 공유한다.

**Tech Stack:** 순수 HTML/CSS/vanilla JS. 빌드 스텝 없음. 폰트는 SUIT 변수 폰트(이미 `style.css`에 `@font-face`로 정의됨). 테스트 프레임워크 없음 — 검증은 브라우저에서 수동 확인(링크 동작, 반응형 레이아웃, 콘솔 에러 없음)으로 대체한다.

## Global Constraints

- 없는 수치(자원순환 매출/특허/캐치프레이즈)를 지어내지 않는다 — `docs/superpowers/specs/2026-07-08-business-domains-pages-design.md`의 "참조 자료 요약"에 있는 내용만 사용한다.
- 신규 사진/일러스트를 제작하지 않는다 — 기존 `assets/domain-panel-*.png`, `assets/domain-*.png` 아이콘만 재사용한다.
- 색상/폰트/간격 등 디자인 토큰은 `style.css`에 이미 정의된 값(`.eyebrow`, `.heading`, `.section-inner`, `.reveal-fade`, `#a68a6d`, `#4a453d`, `#6b6259`, `#2a2520`, `#ede7db`, `#fffdf9`, SUIT 폰트)을 그대로 재사용하고 새로 정의하지 않는다.
- 반응형 브레이크포인트는 900px, 480px만 사용한다(사이트 전역 컨벤션).
- 모바일 전용 햄버거 메뉴를 신설하지 않는다 — 현재 480px 폭 축소 패턴을 유지한다.
- `partials/nav-scroll.js`는 어떤 HTML에서도 include되지 않는 미사용 파일이므로 수정하지 않는다. 실제 nav를 만드는 파일은 `partials/header.js`뿐이다.

---

## File Structure

- **Modify:** `partials/header.js` — "Technology" 링크 제거, "사업 분야" 드롭다운(4개 서브링크) 추가, 서브링크 active 플래그 지원 추가.
- **Modify:** `style.css` — 드롭다운 CSS(약 40줄) + 4개 신규 페이지가 공유하는 도메인 상세 섹션 CSS(하나의 블록, 약 120줄) 추가.
- **Create:** `domains-beauty.html`, `domains-agriculture.html`, `domains-bio.html`, `domains-resource.html` — 각각 about.html과 동일한 골격, 도메인별 실제 콘텐츠.
- **Modify:** `index.html` — `#domains` 섹션의 `.domain-panel-text`에 "자세히 보기" 링크 추가 + `DATA` 객체에 `href` 필드 추가 + `activate()` 함수에서 링크 갱신.

---

## Task 1: Nav에 "사업 분야" 드롭다운 추가

**Files:**
- Modify: `partials/header.js`
- Modify: `style.css`

**Interfaces:**
- Produces: `partials/header.js`가 생성하는 `<nav>` 마크업에 `<li class="nav-dropdown">` 항목과 그 안의 `<ul class="nav-dropdown-menu">` 서브링크. 이후 Task 2~5의 4개 페이지가 각각 `window.NAV_PAGE = 'domains-beauty'`(등)를 설정해 이 드롭다운의 active 서브링크 계산에 사용된다.

- [ ] **Step 1: `partials/header.js`의 링크 배열 구조를 드롭다운 지원 형태로 교체**

기존 파일 전체를 아래로 교체한다:

```js
(function() {
  var page = (window.NAV_PAGE || 'index');

  var logoHref = page === 'index' ? '/' : 'index.html';
  var domainsPrefix = page === 'index' ? '' : 'index.html';

  var domainLinks = [
    { key: 'domains-beauty', href: 'domains-beauty.html', label: '뷰티' },
    { key: 'domains-agriculture', href: 'domains-agriculture.html', label: '농산물' },
    { key: 'domains-bio', href: 'domains-bio.html', label: '바이오공정' },
    { key: 'domains-resource', href: 'domains-resource.html', label: '자원순환' }
  ];

  var domainsMobileHref = domainsPrefix + '#domains';
  var domainsActive = domainLinks.some(function(d) { return d.key === page; });

  var domainsMenuHtml = domainLinks.map(function(d) {
    var isActive = d.key === page;
    return '<li><a href="' + d.href + '"' + (isActive ? ' class="active"' : '') + '>' + d.label + '</a></li>';
  }).join('\n          ');

  var links = page === 'index'
    ? [
        { href: 'about.html', label: 'About Us' },
        { href: '#', label: 'Product' },
        { href: '#', label: 'Company' }
      ]
    : [
        { href: 'about.html', label: 'About Us', active: page === 'about' },
        { href: 'index.html', label: 'Product' },
        { href: 'index.html', label: 'Company' }
      ];

  var linksHtml = links.map(function(l) {
    return '<li><a href="' + l.href + '"' + (l.active ? ' class="active"' : '') + '>' + l.label + '</a></li>';
  }).join('\n      ');

  var dropdownHtml =
    '<li class="nav-dropdown">\n' +
    '        <a href="' + domainsMobileHref + '"' + (domainsActive ? ' class="active"' : '') + '>사업 분야</a>\n' +
    '        <ul class="nav-dropdown-menu">\n' +
    '          ' + domainsMenuHtml + '\n' +
    '        </ul>\n' +
    '      </li>';

  document.write(
    '<nav>\n' +
    '  <div id="nav-inner">\n' +
    '    <a href="' + logoHref + '" class="nav-logo">FinSide</a>\n' +
    '    <ul class="nav-links">\n' +
    '      <li>' + linksHtml.split('</li>')[0] + '</li>\n' +
    '      ' + dropdownHtml + '\n' +
    '      ' + linksHtml.split('</li>').slice(1).join('</li>') +
    '    </ul>\n' +
    '  </div>\n' +
    '</nav>'
  );

  var nav = document.querySelector('nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
```

주의: 위 `linksHtml.split('</li>')` 방식은 "About Us"를 첫 번째로 유지하고 드롭다운을 그 다음(기존 Technology 자리)에 끼워 넣기 위한 것이다. 이 방식이 문자열 조작으로 다소 불안정하므로, 더 명확하게 아래처럼 links 배열 자체에 드롭다운을 끼워 넣는 방식으로 재작성한다(이 버전을 최종본으로 사용):

```js
(function() {
  var page = (window.NAV_PAGE || 'index');

  var logoHref = page === 'index' ? '/' : 'index.html';
  var domainsPrefix = page === 'index' ? '' : 'index.html';

  var domainLinks = [
    { key: 'domains-beauty', href: 'domains-beauty.html', label: '뷰티' },
    { key: 'domains-agriculture', href: 'domains-agriculture.html', label: '농산물' },
    { key: 'domains-bio', href: 'domains-bio.html', label: '바이오공정' },
    { key: 'domains-resource', href: 'domains-resource.html', label: '자원순환' }
  ];
  var domainsActive = domainLinks.some(function(d) { return d.key === page; });

  var domainsMenuHtml = domainLinks.map(function(d) {
    var isActive = d.key === page;
    return '<li><a href="' + d.href + '"' + (isActive ? ' class="active"' : '') + '>' + d.label + '</a></li>';
  }).join('\n            ');

  var dropdownLi =
    '<li class="nav-dropdown">\n' +
    '        <a href="' + domainsPrefix + '#domains"' + (domainsActive ? ' class="active"' : '') + '>사업 분야</a>\n' +
    '        <ul class="nav-dropdown-menu">\n' +
    '            ' + domainsMenuHtml + '\n' +
    '        </ul>\n' +
    '      </li>';

  var otherLinks = page === 'index'
    ? [
        { href: 'about.html', label: 'About Us' },
        { href: '#', label: 'Product' },
        { href: '#', label: 'Company' }
      ]
    : [
        { href: 'about.html', label: 'About Us', active: page === 'about' },
        { href: 'index.html', label: 'Product' },
        { href: 'index.html', label: 'Company' }
      ];

  var aboutLi = '<li><a href="' + otherLinks[0].href + '"' + (otherLinks[0].active ? ' class="active"' : '') + '>' + otherLinks[0].label + '</a></li>';
  var restLiHtml = otherLinks.slice(1).map(function(l) {
    return '<li><a href="' + l.href + '"' + (l.active ? ' class="active"' : '') + '>' + l.label + '</a></li>';
  }).join('\n      ');

  document.write(
    '<nav>\n' +
    '  <div id="nav-inner">\n' +
    '    <a href="' + logoHref + '" class="nav-logo">FinSide</a>\n' +
    '    <ul class="nav-links">\n' +
    '      ' + aboutLi + '\n' +
    '      ' + dropdownLi + '\n' +
    '      ' + restLiHtml + '\n' +
    '    </ul>\n' +
    '  </div>\n' +
    '</nav>'
  );

  var nav = document.querySelector('nav');
  function updateNav() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();
```

- [ ] **Step 2: `style.css`에 드롭다운 스타일 추가**

`.nav-links a.active { color: #8a6a4a; font-weight: 600; }` 규칙(96번째 줄 근방, `nav` 블록 바로 뒤) 다음에 추가:

```css
.nav-dropdown { position: relative; }
.nav-dropdown-menu {
  position: absolute;
  top: 100%; left: 50%;
  transform: translateX(-50%) translateY(4px);
  list-style: none;
  background: #fffdf9;
  border-radius: 12px;
  box-shadow: 0 1px 0 #2a251f0f, 0 20px 40px -20px #2a251f2e;
  padding: 10px;
  min-width: 140px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s, transform 0.25s;
}
.nav-dropdown:hover .nav-dropdown-menu,
.nav-dropdown:focus-within .nav-dropdown-menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}
.nav-dropdown-menu li { padding: 0; }
.nav-dropdown-menu a {
  display: block;
  padding: 8px 14px;
  border-radius: 8px;
  white-space: nowrap;
  color: #4a453d;
  font-size: 14px;
}
.nav-dropdown-menu a:hover { background: #ede7db; }
.nav-dropdown-menu a.active { color: #8a6a4a; font-weight: 600; }

@media (max-width: 480px) {
  .nav-dropdown-menu { display: none; }
}
```

480px 이하에서는 서브메뉴를 완전히 숨기고(hover가 없는 터치 환경이므로), 상위 "사업 분야" 링크 탭 시 `#domains`(또는 `index.html#domains`)로 이동시켜 홈 도메인 섹션에서 각 페이지로 진입하도록 한다 — 이는 스펙의 모바일 동작 정의와 일치한다.

- [ ] **Step 3: 브라우저에서 수동 확인**

`index.html`을 로컬 서버로 열고(`python3 -m http.server 8000` 등) 다음을 확인:
1. Nav에 About Us / 사업 분야 / Product / Company 순서로 표시되는지
2. "사업 분야"에 마우스를 올렸을 때 4개 서브링크(뷰티/농산물/바이오공정/자원순환)가 드롭다운으로 나타나는지
3. 이 시점에는 4개 domains-*.html 파일이 아직 없으므로 서브링크 클릭 시 404가 나는 것은 정상(Task 2~5에서 해결)
4. 브라우저 폭을 480px 이하로 줄였을 때 드롭다운 메뉴가 사라지고 "사업 분야" 링크는 여전히 보이는지
5. 콘솔에 JS 에러가 없는지

- [ ] **Step 4: Commit**

```bash
git add partials/header.js style.css
git commit -m "feat: add business domains dropdown to nav"
```

---

## Task 2: 공유 CSS — 도메인 상세 페이지 섹션 스타일

**Files:**
- Modify: `style.css`

**Interfaces:**
- Produces: `.domain-detail-hero`, `.domain-detail-hero-layout`, `.domain-detail-hero-img`, `.domain-detail-section`, `.domain-detail-eyebrow`(=`.eyebrow` 재사용), `.domain-compare-table`, `.domain-stat-grid`, `.domain-stat-card`, `.domain-cta-strip`, `.domain-cta-links` 클래스. Task 3~6의 4개 HTML 파일이 이 클래스들을 그대로 사용한다.

- [ ] **Step 1: `style.css` 맨 끝에 도메인 상세 페이지 전용 섹션 추가**

파일 끝에 추가:

```css

/* ══════════════════════════════════════════════════════════
   domains-*.html — shared detail page sections
   ══════════════════════════════════════════════════════════ */

.domain-detail-hero {
  padding: clamp(160px, 22vh, 240px) 0 clamp(60px, 8vh, 100px);
  background: #ffffff;
}
.domain-detail-hero-layout {
  display: flex;
  align-items: center;
  gap: clamp(32px, 5vw, 80px);
}
.domain-detail-hero-text { flex: 0 1 46%; min-width: 0; }
.domain-detail-hero-visual { flex: 0 1 54%; min-width: 0; }
.domain-detail-hero-img {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 0 #2a251f0f, 0 30px 60px -30px #2a251f1f;
}
.domain-detail-hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.domain-detail-hero-title {
  font-family: 'SUIT', 'Apple SD Gothic Neo', sans-serif;
  font-size: clamp(30px, 3.6vw, 52px);
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: #4a453d;
}
.domain-detail-hero-title b { font-weight: 800; color: #2a2520; }
.domain-detail-hero-lead {
  margin-top: 24px;
  font-size: clamp(14px, 1.1vw, 17px);
  color: #6b6259;
  line-height: 1.85;
  max-width: 560px;
}
.domain-detail-hero-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 24px; }
@media (max-width: 900px) {
  .domain-detail-hero-layout { flex-direction: column-reverse; }
  .domain-detail-hero-text, .domain-detail-hero-visual { flex: none; width: 100%; }
}

.domain-detail-section { padding: clamp(60px, 8vh, 100px) 0; }
.domain-detail-section-title { margin-bottom: 32px; }
.domain-detail-body {
  font-size: 15px;
  color: #6b6259;
  line-height: 1.9;
  max-width: 860px;
}
.domain-detail-body + .domain-detail-body { margin-top: 20px; }

.domain-compare-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 32px;
  font-size: 14px;
}
.domain-compare-table th, .domain-compare-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #2a251f14;
  text-align: left;
  color: #6b6259;
}
.domain-compare-table th {
  color: #2a2520;
  font-weight: 700;
  background: #ede7db;
}
.domain-compare-table tr.highlight td { color: #2a2520; font-weight: 700; background: #fbf3e7; }

.domain-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 32px;
}
.domain-stat-card {
  background: #fffdf9;
  border-radius: 16px;
  padding: 28px 24px;
  box-shadow: 0 1px 0 #2a251f0f, 0 20px 40px -24px #2a251f1f;
}
.domain-stat-label {
  font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: #a68a6d; margin-bottom: 10px;
}
.domain-stat-value { font-size: 20px; font-weight: 800; color: #2a2520; line-height: 1.5; }

.domain-cta-strip {
  padding: clamp(50px, 7vh, 80px) 0;
  background: #ede7db;
}
.domain-cta-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
}
.domain-cta-links a {
  padding: 12px 24px;
  border-radius: 24px;
  background: #fffdf9;
  color: #4a453d;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.25s, color 0.25s;
}
.domain-cta-links a:hover { background: #2a2520; color: #fffdf9; }
```

- [ ] **Step 2: 브라우저 콘솔에서 CSS 파싱 에러 없는지 확인**

`index.html`을 열고 개발자 도구 콘솔에 CSS 관련 에러가 없는지 확인(추가 클래스는 아직 어떤 HTML도 사용하지 않으므로 시각적 변화는 없어야 정상).

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add shared CSS for domain detail pages"
```

---

## Task 3: `domains-beauty.html` 생성

**Files:**
- Create: `domains-beauty.html`

**Interfaces:**
- Consumes: Task 1의 `partials/header.js`(NAV_PAGE='domains-beauty'), Task 2의 `.domain-detail-*` CSS 클래스, `partials/footer.js`, 기존 `assets/domain-panel-beauty.png`.

- [ ] **Step 1: 파일 생성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Beauty — FINSIDE</title>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="style.css">
</head>
<body class="page-about">

<script>window.NAV_PAGE = 'domains-beauty';</script>
<script src="partials/header.js"></script>

<section class="domain-detail-hero">
  <div class="section-inner domain-detail-hero-layout">
    <div class="domain-detail-hero-text">
      <div class="eyebrow reveal-fade">BEAUTY</div>
      <h1 class="domain-detail-hero-title reveal-fade">
        피부를 데이터로,<br><b>스킨케어를 초개인화로</b>
      </h1>
      <p class="domain-detail-hero-lead reveal-fade">
        비접촉 광학 센서로 수분·유분·탄력 등 피부 상태를 정량 데이터로 측정합니다.
        측정값은 맞춤형 스킨케어 추천과 화장품 R&D 개발 데이터로 이어져, 피부샵·클리닉·화장품 소매점과
        스킨케어 브랜드(B2B), 홈케어 디바이스 사용자(B2C) 모두에게 근거 기반 데이터를 제공합니다.
      </p>
      <div class="domain-detail-hero-tags reveal-fade">
        <span class="domain-chip">비접촉 측정</span>
        <span class="domain-chip">초개인화 추천</span>
        <span class="domain-chip">B2B2C</span>
      </div>
    </div>
    <div class="domain-detail-hero-visual reveal-fade">
      <div class="domain-detail-hero-img">
        <img src="assets/domain-panel-beauty.png" alt="비접촉 피부 진단 디바이스">
      </div>
    </div>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">TECHNOLOGY</div>
      <h2 class="heading" style="margin-top: 20px;">LWIR 기반 <b>비접촉 피부 진단</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      원적외선(LWIR, Long-Wave Infrared) 특성 기반 비접촉 내부 상태 진단 및 품질 예측 기술을 피부에 적용한 제품입니다.
      생물·바이오소재의 내부 상태(수분, 경도, 물성 등)를 예측하는 FINSIDE의 공용 원천기술을 뷰티 영역에 적용한
      OSMU(One Source Multi-Use) 스핀오프로, 접촉 없이 피부의 수분·유분·탄력 상태를 정량 데이터로 측정하고
      AI 기반 모바일 연동 앱으로 결과를 제공하는 프로토타입까지 개발되어 있습니다.
    </p>
    <table class="domain-compare-table reveal-fade">
      <thead>
        <tr><th>제품</th><th>제조사</th><th>가격</th><th>비고</th></tr>
      </thead>
      <tbody>
        <tr><td>스킨 라이트 테라피 3S</td><td>아모레퍼시픽</td><td>475,000원</td><td>-</td></tr>
        <tr><td>A-ONE Smart</td><td>봄텍전자</td><td>7,700,000원</td><td>-</td></tr>
        <tr><td>LUMINI HOME</td><td>룰루랩</td><td>-</td><td>-</td></tr>
        <tr><td>IMate 유수분측정기</td><td>IMATE</td><td>28,000원</td><td>기기 측정 값의 오류 큼</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="domain-detail-section">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">BUSINESS MODEL &amp; CUSTOMERS</div>
      <h2 class="heading" style="margin-top: 20px;">B2B2C로 <b>연결되는 피부 데이터</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      B2B: 화장품 소매점(2024년 기준 약 1,300개 매장, 올리브영·키엘 사례를 참고한 입점 확대 목표), 전국 약 35,000개
      피부관리실(목표 10%, 약 3,500개), 에이피알·세라젬·달바 등 스킨케어 기업과의 공동 마케팅 및 기술 라이선싱.
      <br><br>
      B2C: 디바이스 판매 30만원 + 월 구독 3~5만원 모델. 시장 규모는 TAM $19.79B, SAM 약 $8.1B(Grand View Research,
      CAGR 17.9%)로 추산됩니다.
    </p>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">ACHIEVEMENTS</div>
      <h2 class="heading" style="margin-top: 20px;">특허와 <b>성장 로드맵</b></h2>
    </div>
    <div class="domain-stat-grid reveal-fade">
      <div class="domain-stat-card">
        <div class="domain-stat-label">특허</div>
        <div class="domain-stat-value">국내 8건 + PCT 2건<br>(회사 전체 특허 30건 중)</div>
      </div>
      <div class="domain-stat-card">
        <div class="domain-stat-label">2026~2030 매출 로드맵</div>
        <div class="domain-stat-value">5억 → 10억 → 30억 → 150억 → 300억</div>
      </div>
      <div class="domain-stat-card">
        <div class="domain-stat-label">시장 규모</div>
        <div class="domain-stat-value">TAM $19.79B<br>SAM 약 $8.1B</div>
      </div>
    </div>
  </div>
</section>

<section class="domain-cta-strip">
  <div class="section-inner reveal-fade">
    <div class="eyebrow">EXPLORE MORE</div>
    <h2 class="heading" style="margin-top: 16px;">다른 <b>사업 분야</b> 보기</h2>
    <div class="domain-cta-links">
      <a href="domains-agriculture.html">농산물</a>
      <a href="domains-bio.html">바이오공정</a>
      <a href="domains-resource.html">자원순환</a>
      <a href="index.html#domains">전체 사업 분야 보기</a>
    </div>
  </div>
</section>

<script src="partials/footer.js"></script>

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

- [ ] **Step 2: 브라우저에서 수동 확인**

`http://localhost:8000/domains-beauty.html`을 열고:
1. Nav에서 "사업 분야" 드롭다운의 "뷰티" 항목이 active 스타일(굵게, 브라운 컬러)로 표시되는지
2. Hero 이미지가 잘리지 않고 표시되는지
3. 비교표가 가로 스크롤 없이 렌더링되는지 (900px 이하에서 필요시 확인)
4. 하단 CTA 링크 3개(농산물/바이오공정/자원순환)를 클릭하면 아직 404가 나는 것은 정상(Task 4~5에서 해결), `index.html#domains`는 정상 작동해야 함
5. 스크롤 시 섹션들이 reveal-fade로 나타나는지
6. 콘솔에 에러 없는지

- [ ] **Step 3: Commit**

```bash
git add domains-beauty.html
git commit -m "feat: add Beauty business domain detail page"
```

---

## Task 4: `domains-agriculture.html` 생성

**Files:**
- Create: `domains-agriculture.html`

**Interfaces:**
- Consumes: Task 1의 `partials/header.js`(NAV_PAGE='domains-agriculture'), Task 2의 CSS 클래스, `assets/domain-panel-agriculture.png`.

- [ ] **Step 1: 파일 생성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Agriculture — FINSIDE</title>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="style.css">
</head>
<body class="page-about">

<script>window.NAV_PAGE = 'domains-agriculture';</script>
<script src="partials/header.js"></script>

<section class="domain-detail-hero">
  <div class="section-inner domain-detail-hero-layout">
    <div class="domain-detail-hero-text">
      <div class="eyebrow reveal-fade">AGRICULTURE</div>
      <h1 class="domain-detail-hero-title reveal-fade">
        수확 전에 품질을,<br><b>유통 전에 등급을</b>
      </h1>
      <p class="domain-detail-hero-lead reveal-fade">
        초분광·열화상 영상으로 당도, 수분(함수율), 경도, 중량, 착색 상태를 비파괴 방식으로 현장에서 즉시
        판별합니다. 스마트팜부터 산지 유통 단계까지 품질 데이터를 표준화해, 선별·등급 판정의 정확도와 속도를
        함께 끌어올립니다.
      </p>
      <div class="domain-detail-hero-tags reveal-fade">
        <span class="domain-chip">초분광·열화상</span>
        <span class="domain-chip">비파괴 검사</span>
        <span class="domain-chip">스마트팜</span>
      </div>
    </div>
    <div class="domain-detail-hero-visual reveal-fade">
      <div class="domain-detail-hero-img">
        <img src="assets/domain-panel-agriculture.png" alt="농산물 비파괴 품질 선별 시스템">
      </div>
    </div>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">TECHNOLOGY</div>
      <h2 class="heading" style="margin-top: 20px;">모듈형 <b>선별 플랫폼</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      V자형 레일 이송 구조 위에서 부피·중량·착색·당도·수분·경도 측정 모듈을 필요에 따라 조합하는 모듈형
      선별 플랫폼입니다. LWIR 국소가열 분석 모듈, 2번 반사 기반 착색 측정 모듈, 접촉형 인디케이터 모듈,
      비접촉 복원 응용 모듈(단열 팽창 공기 기반), 마이크로 분광 센서 표면 투과 스펙트럼 분석 모듈 등을
      AI 제어 시스템과 Plug &amp; Play 자동인식으로 연결합니다.
    </p>
    <p class="domain-detail-body reveal-fade">
      농가 단위의 소규모 처리를 위한 <b>Compact Type</b>과, 산지 유통센터·APC(농산물산지유통센터)의
      대용량 처리를 위한 <b>Industrial Type</b> 두 가지 폼팩터로 제공됩니다.
    </p>
  </div>
</section>

<section class="domain-detail-section">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">BUSINESS MODEL &amp; CUSTOMERS</div>
      <h2 class="heading" style="margin-top: 20px;">외산이 지배하는 시장, <b>모듈 라이선싱으로</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      고객군은 개별 농가(Compact Type)와 산지 유통센터·APC(Industrial Type)로 나뉩니다. 충주 APC 현장 시장
      조사 결과 APC 시장은 현재 외산 장비가 지배하고 있어, 국산 모듈형 대안에 대한 수요가 확인되었습니다.
      수익 모델은 모듈·부품 단위 라이선싱과, AI 품질예측 엔진을 서비스형(SaaS)으로 제공하는 방식을
      병행합니다.
      <br><br>
      실증·공동개발 파트너: 진영산업(AI 과일 선별), 한성티앤아이(비파괴 당도 선별), 한아(중량 선별·물류
      분류), 이듬(작물 생육 측정), 에이오팜(TRL 6→7 현장실증, 2026~27).
    </p>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">ACHIEVEMENTS</div>
      <h2 class="heading" style="margin-top: 20px;">TRL 진행과 <b>정부 지원 과제</b></h2>
    </div>
    <div class="domain-stat-grid reveal-fade">
      <div class="domain-stat-card">
        <div class="domain-stat-label">TRL 진행</div>
        <div class="domain-stat-value">4(2024, 수분·당도 측정 개발)<br>→ 6(2025, 모듈형 선별기 시제품)<br>→ 7(2026 목표, 실증평가·인증)</div>
      </div>
      <div class="domain-stat-card">
        <div class="domain-stat-label">충북도 지원 과제</div>
        <div class="domain-stat-value">3년 / 90억원 규모<br>(충북대 산학협력단 67.7%, 위드위 24.4%, 농업회사법인A 7.8%)</div>
      </div>
      <div class="domain-stat-card">
        <div class="domain-stat-label">매출 로드맵</div>
        <div class="domain-stat-value">2028년 약 20억원<br>2029년 약 70억원<br>2030년 약 120억원</div>
      </div>
    </div>
  </div>
</section>

<section class="domain-cta-strip">
  <div class="section-inner reveal-fade">
    <div class="eyebrow">EXPLORE MORE</div>
    <h2 class="heading" style="margin-top: 16px;">다른 <b>사업 분야</b> 보기</h2>
    <div class="domain-cta-links">
      <a href="domains-beauty.html">뷰티</a>
      <a href="domains-bio.html">바이오공정</a>
      <a href="domains-resource.html">자원순환</a>
      <a href="index.html#domains">전체 사업 분야 보기</a>
    </div>
  </div>
</section>

<script src="partials/footer.js"></script>

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

- [ ] **Step 2: 브라우저에서 수동 확인**

`http://localhost:8000/domains-agriculture.html`을 열고 Task 3의 Step 2와 동일한 항목(nav active 상태, hero 이미지, CTA 링크, reveal-fade, 콘솔 에러)을 확인한다. 이 페이지 및 Beauty 페이지 상호 간 CTA 링크(농산물 ↔ 뷰티)가 이제 정상 작동해야 한다.

- [ ] **Step 3: Commit**

```bash
git add domains-agriculture.html
git commit -m "feat: add Agriculture business domain detail page"
```

---

## Task 5: `domains-bio.html` 생성

**Files:**
- Create: `domains-bio.html`

**Interfaces:**
- Consumes: Task 1의 `partials/header.js`(NAV_PAGE='domains-bio'), Task 2의 CSS 클래스(`.domain-compare-table` 포함), `assets/domain-panel-bio.png`.

- [ ] **Step 1: 파일 생성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bio & Process — FINSIDE</title>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="style.css">
</head>
<body class="page-about">

<script>window.NAV_PAGE = 'domains-bio';</script>
<script src="partials/header.js"></script>

<section class="domain-detail-hero">
  <div class="section-inner domain-detail-hero-layout">
    <div class="domain-detail-hero-text">
      <div class="eyebrow reveal-fade">BIO &amp; PROCESS</div>
      <h1 class="domain-detail-hero-title reveal-fade">
        눈에 보이지 않는<br><b>공정을 실시간으로</b>
      </h1>
      <p class="domain-detail-hero-lead reveal-fade">
        바이오차 등 바이오소재 생산 공정에서 원료의 함수율(수분 상태)을 비접촉 열화상 센서로 실시간
        계측합니다. 이동 중인 컨베이어 위에서도 공정을 중단하지 않고 품질 변화를 추적할 수 있어, 고온·분진
        등 열악한 환경의 양산 라인에서도 일관된 공정 관리가 가능합니다.
      </p>
      <div class="domain-detail-hero-tags reveal-fade">
        <span class="domain-chip">실시간 계측</span>
        <span class="domain-chip">비접촉 모니터링</span>
        <span class="domain-chip">TRL 검증</span>
      </div>
    </div>
    <div class="domain-detail-hero-visual reveal-fade">
      <div class="domain-detail-hero-img">
        <img src="assets/domain-panel-bio.png" alt="바이오차 생산 공정 실시간 함수율 모니터링">
      </div>
    </div>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">TECHNOLOGY</div>
      <h2 class="heading" style="margin-top: 20px;">FBE 시스템 — <b>보이지 않는 공정 품질을 데이터로</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      비접촉 LWIR 열화상 센서와 AI 실시간 분석을 결합한 "FBE 시스템"은, 표면 증발 냉각 효과에 따른 시계열
      데이터 분석을 통해 이동하는 컨베이어 위에서도 축분(가축분뇨)의 바이오차 전환 공정을 무중단으로
      계측합니다. 기존 설비를 교체하지 않고 리트로핏 모듈로 적용할 수 있습니다.
    </p>
    <table class="domain-compare-table reveal-fade">
      <thead>
        <tr><th>측정 방식</th><th>속도</th><th>샘플</th><th>정확도</th><th>현장 적합성</th></tr>
      </thead>
      <tbody>
        <tr><td>전기전도도 타입 측정기</td><td>즉시</td><td>국소부위</td><td>낮음</td><td>제한적</td></tr>
        <tr><td>간이 건조감량법</td><td>10~60분</td><td>매우소량</td><td>중간(±5℃)</td><td>부적합</td></tr>
        <tr><td>열풍건조기</td><td>~24시간</td><td>소량~중량</td><td>매우 높음</td><td>매우 부적합</td></tr>
        <tr class="highlight"><td>FBE 시스템</td><td>실시간</td><td>제한 없음</td><td>높음</td><td>최적</td></tr>
      </tbody>
    </table>
  </div>
</section>

<section class="domain-detail-section">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">BUSINESS MODEL &amp; CUSTOMERS</div>
      <h2 class="heading" style="margin-top: 20px;">고품질 바이오차 대량 생산의 <b>병목을 해결하다</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      국내에서 연간 약 5천만 톤 발생하는 가축분뇨는 런던협약(2016)에 의해 해양 투기가 금지되면서, 원천
      함수율 70% 이상을 20% 이하로 낮추는 전처리 공정이 필수가 되었습니다. 고객은 바이오차 생산 기업과
      장비 통합사(B2B)이며, 지자체·공공기관 파일럿 테스트, 바이오차 설비 제조사와의 공동개발, 전시·SNS
      브랜딩을 통해 시장에 접근합니다.
    </p>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">ACHIEVEMENTS</div>
      <h2 class="heading" style="margin-top: 20px;">TRL 진행과 <b>핵심 파트너</b></h2>
    </div>
    <div class="domain-stat-grid reveal-fade">
      <div class="domain-stat-card">
        <div class="domain-stat-label">TRL 진행</div>
        <div class="domain-stat-value">6(2024~25, 충북대)<br>→ 필드실증(2026, 충북대·해표산업)<br>→ 7(2027)</div>
      </div>
      <div class="domain-stat-card">
        <div class="domain-stat-label">핵심 파트너</div>
        <div class="domain-stat-value">해표산업 — 2024~25년 누적 기술이전 계약 (3백만원·5천만원·4천만원·7천만원)</div>
      </div>
      <div class="domain-stat-card">
        <div class="domain-stat-label">추가 협력</div>
        <div class="domain-stat-value">포네이처스 — IoT 자동 배양·센서, ESG·탄소중립 연계</div>
      </div>
    </div>
  </div>
</section>

<section class="domain-cta-strip">
  <div class="section-inner reveal-fade">
    <div class="eyebrow">EXPLORE MORE</div>
    <h2 class="heading" style="margin-top: 16px;">다른 <b>사업 분야</b> 보기</h2>
    <div class="domain-cta-links">
      <a href="domains-beauty.html">뷰티</a>
      <a href="domains-agriculture.html">농산물</a>
      <a href="domains-resource.html">자원순환</a>
      <a href="index.html#domains">전체 사업 분야 보기</a>
    </div>
  </div>
</section>

<script src="partials/footer.js"></script>

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

- [ ] **Step 2: 브라우저에서 수동 확인**

`http://localhost:8000/domains-bio.html`을 열고 Task 3의 Step 2와 동일한 항목을 확인한다. 비교표의 4번째 행(FBE 시스템)이 `.highlight` 스타일(굵은 텍스트, 밝은 배경)로 구분되는지 추가로 확인한다.

- [ ] **Step 3: Commit**

```bash
git add domains-bio.html
git commit -m "feat: add Bio & Process business domain detail page"
```

---

## Task 6: `domains-resource.html` 생성 (자원순환 — 축소 버전)

**Files:**
- Create: `domains-resource.html`

**Interfaces:**
- Consumes: Task 1의 `partials/header.js`(NAV_PAGE='domains-resource'), Task 2의 CSS 클래스, `assets/domain-panel-resource.png`.

**주의:** 스펙에 따라 이 페이지는 Achievements 섹션을 포함하지 않는다 — 근거 매출/특허 수치가 존재하지 않기 때문이다. Hero + Technology + Business Model & Customers 3개 섹션만 구성한다.

- [ ] **Step 1: 파일 생성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resource Circulation — FINSIDE</title>
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="style.css">
</head>
<body class="page-about">

<script>window.NAV_PAGE = 'domains-resource';</script>
<script src="partials/header.js"></script>

<section class="domain-detail-hero">
  <div class="section-inner domain-detail-hero-layout">
    <div class="domain-detail-hero-text">
      <div class="eyebrow reveal-fade">RESOURCE CIRCULATION</div>
      <h1 class="domain-detail-hero-title reveal-fade">
        폐자원에서 다시<br><b>가치를 찾아내는 기술</b>
      </h1>
      <p class="domain-detail-hero-lead reveal-fade">
        초분광·열화상 센서로 폐플라스틱 등 폐자원의 재질 성분을 실시간으로 분석해 소재별 자동 선별을
        지원합니다. 선별 정확도를 높이고 수작업 의존도를 낮춰, 재활용률 향상과 자원순환 공정 전반의
        효율·경제성을 개선합니다.
      </p>
      <div class="domain-detail-hero-tags reveal-fade">
        <span class="domain-chip">소재 선별</span>
        <span class="domain-chip">실시간 성분 분석</span>
        <span class="domain-chip">공정 자동화</span>
      </div>
    </div>
    <div class="domain-detail-hero-visual reveal-fade">
      <div class="domain-detail-hero-img">
        <img src="assets/domain-panel-resource.png" alt="폐플라스틱 초분광 선별 시스템">
      </div>
    </div>
  </div>
</section>

<section class="domain-detail-section" style="background: #faf8f4;">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">TECHNOLOGY</div>
      <h2 class="heading" style="margin-top: 20px;">초분광·가시광 <b>융합 선별</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      초분광(hyperspectral)과 가시광 센서를 융합해 폐플라스틱의 재질 성분을 진단하는 원천기술(TRL 6,
      2024~25)을 시작으로, AI 선별 알고리즘을 고도화(TRL 7, 2026 목표)해 폐배터리 해체·재활용 필드
      실험까지 적용 범위를 넓히고, 2027년에는 다중 스펙트럼 자율지능형 AI 선별시스템으로 발전시키는
      로드맵을 갖고 있습니다. 시스템은 가시광·열화상 센서와 고정 장치·조명·촬영각도 조절 구조로
      구성됩니다.
    </p>
  </div>
</section>

<section class="domain-detail-section">
  <div class="section-inner">
    <div class="domain-detail-section-title reveal-fade">
      <div class="eyebrow">BUSINESS MODEL &amp; CUSTOMERS</div>
      <h2 class="heading" style="margin-top: 20px;">고비용 장비의 <b>대안을 제시하다</b></h2>
    </div>
    <p class="domain-detail-body reveal-fade">
      고객은 기존 폐플라스틱 선별 장비 제조사(B2B) — 초분광 전용 고비용 시스템 대비 저렴한 대안을
      필요로 하는 시장입니다. 파트너사 위드위(WithWe)와 함께 "폐플라스틱 분류 One-Stop 시스템"을
      공동개발하며 TRL 6에서 7로의 스케일업을 진행하고 있습니다. 2026년에는 폐배터리 해체·재활용
      분야로의 적용 확장을 실증할 예정입니다.
    </p>
  </div>
</section>

<section class="domain-cta-strip">
  <div class="section-inner reveal-fade">
    <div class="eyebrow">EXPLORE MORE</div>
    <h2 class="heading" style="margin-top: 16px;">다른 <b>사업 분야</b> 보기</h2>
    <div class="domain-cta-links">
      <a href="domains-beauty.html">뷰티</a>
      <a href="domains-agriculture.html">농산물</a>
      <a href="domains-bio.html">바이오공정</a>
      <a href="index.html#domains">전체 사업 분야 보기</a>
    </div>
  </div>
</section>

<script src="partials/footer.js"></script>

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

- [ ] **Step 2: 브라우저에서 수동 확인**

`http://localhost:8000/domains-resource.html`을 열고 Task 3의 Step 2와 동일한 항목을 확인한다. 이 페이지가 다른 3개 페이지보다 짧게(Achievements 섹션 없이 3개 섹션만) 렌더링되는 것이 의도된 결과임을 확인한다. 4개 페이지 간 CTA 링크가 모두 상호 연결되어 정상 작동하는지 최종 확인한다(뷰티→농산물→바이오공정→자원순환→뷰티 순환).

- [ ] **Step 3: Commit**

```bash
git add domains-resource.html
git commit -m "feat: add Resource Circulation business domain detail page"
```

---

## Task 7: 홈페이지(`index.html`) `#domains`에 "자세히 보기" 링크 연동

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 3~6에서 생성한 4개 `domains-*.html` 파일 경로, 기존 `DATA` 객체(`index.html:466`)와 `activate()` 함수(`index.html:500`).

- [ ] **Step 1: `.domain-panel-text` 마크업에 링크 요소 추가**

`index.html:452`의 `.domain-panel-tags` 블록 바로 다음에 추가:

```html
          <div class="domain-panel-tags" data-domain-field="tags">
            <span class="domain-chip">비접촉 측정</span>
            <span class="domain-chip">초개인화 추천</span>
            <span class="domain-chip">B2B2C</span>
          </div>
          <a class="domain-panel-link" data-domain-field="href" href="domains-beauty.html">자세히 보기 →</a>
```

- [ ] **Step 2: `style.css`에 `.domain-panel-link` 스타일 추가**

`.domain-chip` 규칙(`style.css:759` 근방) 다음에 추가:

```css
.domain-panel-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 700;
  color: #8a6a4a;
  text-decoration: none;
}
.domain-panel-link:hover { color: #4a453d; }
```

- [ ] **Step 3: `DATA` 객체에 `href` 필드 추가 (`index.html:466`)**

```js
  const DATA = {
    beauty: {
      tag: 'Beauty',
      title: '피부를 데이터로, 스킨케어를 초개인화로',
      desc: '비접촉 광학 센서로 수분·유분·탄력 등 피부 상태를 정량 데이터로 측정합니다. 측정값은 맞춤형 스킨케어 추천과 화장품 R&D 개발 데이터로 이어져, 피부샵·클리닉·화장품 소매점과 스킨케어 브랜드(B2B), 홈케어 디바이스 사용자(B2C) 모두에게 근거 기반 데이터를 제공합니다.',
      tags: ['비접촉 측정', '초개인화 추천', 'B2B2C'],
      href: 'domains-beauty.html'
    },
    agriculture: {
      tag: 'Agriculture',
      title: '수확 전에 품질을, 유통 전에 등급을',
      desc: '초분광·열화상 영상으로 당도, 수분(함수율), 경도, 중량, 착색 상태를 비파괴 방식으로 현장에서 즉시 판별합니다. 스마트팜부터 산지 유통 단계까지 품질 데이터를 표준화해, 선별·등급 판정의 정확도와 속도를 함께 끌어올립니다.',
      tags: ['초분광·열화상', '비파괴 검사', '스마트팜'],
      href: 'domains-agriculture.html'
    },
    bio: {
      tag: 'Bio & Process',
      title: '눈에 보이지 않는 공정을 실시간으로',
      desc: '바이오차 등 바이오소재 생산 공정에서 원료의 함수율(수분 상태)을 비접촉 열화상 센서로 실시간 계측합니다. 이동 중인 컨베이어 위에서도 공정을 중단하지 않고 품질 변화를 추적할 수 있어, 고온·분진 등 열악한 환경의 양산 라인에서도 일관된 공정 관리가 가능합니다.',
      tags: ['실시간 계측', '비접촉 모니터링', 'TRL 검증'],
      href: 'domains-bio.html'
    },
    resource: {
      tag: 'Resource Circulation',
      title: '폐자원에서 다시 가치를 찾아내는 기술',
      desc: '초분광·열화상 센서로 폐플라스틱 등 폐자원의 재질 성분을 실시간으로 분석해 소재별 자동 선별을 지원합니다. 선별 정확도를 높이고 수작업 의존도를 낮춰, 재활용률 향상과 자원순환 공정 전반의 효율·경제성을 개선합니다.',
      tags: ['소재 선별', '실시간 성분 분석', '공정 자동화'],
      href: 'domains-resource.html'
    }
  };
```

- [ ] **Step 4: `activate()` 함수에서 링크 `href` 갱신 (`index.html:500`)**

```js
  const tabs   = document.querySelectorAll('.domain-tab');
  const tagEl  = document.querySelector('[data-domain-field="tag"]');
  const titleEl= document.querySelector('[data-domain-field="title"]');
  const descEl = document.querySelector('[data-domain-field="desc"]');
  const tagsEl = document.querySelector('[data-domain-field="tags"]');
  const linkEl = document.querySelector('[data-domain-field="href"]');
  const imgEls = document.querySelectorAll('[data-domain-img]');

  function activate(key) {
    const d = DATA[key];
    if (!d) return;

    tabs.forEach(t => {
      const isActive = t.dataset.domain === key;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    imgEls.forEach(el => { el.hidden = el.dataset.domainImg !== key; });

    tagEl.textContent = d.tag;
    titleEl.textContent = d.title;
    descEl.textContent = d.desc;
    tagsEl.innerHTML = d.tags.map(t => `<span class="domain-chip">${t}</span>`).join('');
    linkEl.setAttribute('href', d.href);
  }
```

- [ ] **Step 5: 브라우저에서 수동 확인**

`http://localhost:8000/index.html`을 열고:
1. `#domains` 섹션에서 각 탭(Beauty/Agriculture/Bio & Process/Resource Circulation)을 클릭할 때마다 "자세히 보기 →" 링크의 `href`가 해당 도메인 페이지로 바뀌는지(개발자 도구에서 요소 검사로 확인)
2. 각 링크를 클릭해 올바른 `domains-*.html` 페이지로 이동하는지
3. 이동한 페이지에서 다시 nav의 "사업 분야" 드롭다운으로 다른 도메인 페이지나 `index.html#domains`로 돌아올 수 있는지(전체 순환 확인)
4. 콘솔에 에러 없는지

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "feat: link homepage domain panels to detail pages"
```

---

## Self-Review Notes

- **Spec coverage:** Nav 드롭다운(Task 1) ✓, 4개 페이지 공통 템플릿+공유 CSS(Task 2~6) ✓, 자원순환 Achievements 섹션 제외(Task 6) ✓, 홈페이지 연동(Task 7) ✓, 모바일 동작(480px 드롭다운 숨김 + 상위 링크가 `#domains`로 이동)(Task 1) ✓.
- **Placeholder scan:** 없음 — 모든 스텝에 실제 코드/명령어 포함.
- **Type consistency:** `NAV_PAGE` 값(`domains-beauty` 등)이 Task 1의 `domainLinks` 배열 `key`와 Task 3~6의 각 파일 첫 `<script>` 값에서 정확히 일치. `DATA` 객체의 `href` 필드명과 `activate()`의 `linkEl.setAttribute('href', d.href)`가 일치.
