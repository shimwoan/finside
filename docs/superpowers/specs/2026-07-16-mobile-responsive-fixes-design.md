# 모바일/태블릿 반응형 수정 설계

## 배경

코드 레벨 감사(audit) 결과, 사이트 대부분(히어로, 파트너 마퀴, 푸터, about.html, 대부분의 도메인 상세 페이지 레이아웃, agriculture 그리드류)은 이미 반응형이 정상 구현되어 있음이 확인됨. 문제는 아래에 열거된 특정 컴포넌트들로 국한됨.

`html { overflow-x: hidden }` (style.css 74행)이 전역으로 설정되어 있어, overflow 버그가 스크롤바로 드러나지 않고 조용히 잘려서 보이지 않는다는 점이 이 문제들을 발견하기 어렵게 만든 원인.

## 범위

### 1. 모바일 네비게이션 — 햄버거 드로어 메뉴

**현재 문제:** `partials/header.js`의 "사업 분야" 드롭다운은 순수 CSS `:hover`/`:focus-within`으로만 동작하며, 터치 기기에서 열 수 있는 방법이 전혀 없음. 게다가 `style.css` 175행 근처 `@media (max-width:480px)` 규칙이 드롭다운 메뉴 자체를 하드코딩으로 숨겨버림. 햄버거 메뉴나 토글 버튼 마커업은 코드베이스 전체에 존재하지 않음(grep으로 확인).

**변경 대상:** `partials/header.js`, `style.css`

**`partials/header.js` 변경:**
- `#nav-inner` 안에 햄버거 버튼(`<button id="nav-toggle" aria-label="메뉴 열기" aria-expanded="false">`, 내부에 3개의 `<span>` bar) 추가
- 배경 스크림 엘리먼트(`#nav-scrim`) 추가
- 버튼 클릭 시 `nav.classList.toggle('nav-open')` 및 `aria-expanded` 갱신
- 드로어가 열려있는 동안 `.nav-dropdown` 트리거("사업 분야")는 클릭 시 `.nav-dropdown.open` 토글 — 데스크톱 hover 로직과 분리된 별도 클릭 핸들러
- 스크림 클릭, Esc 키, `.nav-links a` 클릭 시 드로어 자동 닫힘 (단, "사업 분야" 트리거 자체 클릭은 서브메뉴만 토글하고 드로어는 안 닫음)
- 드로어 열림 동안 `document.documentElement`/`body`에 `modal-open`과 동일한 스크롤 잠금 클래스 재사용 (문의하기 모달과 공유)
- 900px 이상 폭에서는 버튼이 안 보이고 기존 hover 동작 그대로 유지 (JS는 항상 붙어있지만 CSS로 버튼을 숨기므로 무해)

**`style.css` 변경:**
- `@media (max-width:900px)`: `.nav-links`를 `position:fixed; top:0; right:0; height:100%; width:min(78vw,320px); transform:translateX(100%); transition:transform .25s ease;` 형태의 슬라이드인 패널로 전환. `.nav-open .nav-links { transform:translateX(0); }`
- `#nav-scrim`을 배경 반투명 오버레이로 추가, `.nav-open`일 때만 `display:block`
- `#nav-toggle`은 900px 이상에서 `display:none`, 이하에서 `display:flex` (3-bar 아이콘은 CSS로 구현: `span` 3개를 `position:absolute`로 쌓고 `transform`으로 X자 변형)
- `.nav-dropdown-menu`: 기존 hover/focus-within 규칙은 900px 이상에서만 적용되도록 미디어 쿼리로 감싸고, 900px 이하에서는 `.nav-dropdown.open .nav-dropdown-menu`일 때만 `display:block` (max-height 트랜지션으로 펼침)
- 480px 이하에서 드롭다운 메뉴를 완전히 숨기던 기존 규칙 제거

### 2. `.bottleneck-stats` flex/grid 불일치 수정

**현재 문제:** `domains-bio.html`, `domains-resource.html`에서 `.bottleneck-stats`는 `display:flex`인데, `@media (max-width:900px)` 오버라이드가 `grid-template-columns:1fr`를 지정 — flex 컨테이너에는 아무 효과가 없어 어떤 모바일 폭에서도 쌓이지 않음.

**변경 대상:** `style.css` (~1468행 부근)

**수정:** 해당 미디어 쿼리 내 규칙을 `flex-direction:column`으로 교체 (필요시 `gap` 값도 세로 배치에 맞게 조정).

### 3. `domains-beauty.html` `.biz-flow-visual` 오버플로우 수정

**현재 문제:** 375px 폭에서 디바이스 이미지(140px)+플러스 기호+폰 이미지(165px)+`gap:24px`+`padding:24px`(1364행)가 480px 최대 지름의 원형 안에 가로 배치(`flex-direction:row`)로 유지되어, `white-space:nowrap`인 라벨("휴대용 피부 측정 디바이스")과 함께 실제로 겹치거나 잘림.

**변경 대상:** `style.css` (~1320-1401행), 필요시 `domains-beauty.html`

**수정:** `@media (max-width:900px)` 규칙(1400행) 하위에 좀 더 좁은 폭(예: `max-width:480px` 또는 `600px`)을 위한 추가 단계를 두어 `.biz-flow-visual`을 `flex-direction:column`으로 전환하거나 이미지 크기를 비례 축소. 라벨의 `white-space:nowrap`을 제거해 필요시 줄바꿈 허용.

### 4. `domains-bio.html` 파트너 그리드 인라인 스타일 오버플로우 수정

**현재 문제:** `domains-bio.html` 212행의 인라인 `style="grid-template-columns:repeat(2, minmax(220px, 280px))"`가 375px 폭에서 456px 최소 너비를 요구해 실제로 넘침. 이 인라인 스타일은 실수가 아니라 파트너 카드 개수(bio=2개)에 맞춘 의도적 오버라이드이므로, 단순 삭제가 아니라 최소 너비 값 자체를 좁은 화면에 맞게 조정해야 함.

**변경 대상:** `domains-bio.html` (해당 인라인 스타일), 또는 이를 대체할 `style.css` 내 페이지 전용 클래스

**수정:** 인라인 `minmax(220px, 280px)`를 `minmax(140px, 1fr)` 계열로 낮추거나, `@media` 대응이 가능하도록 인라인 스타일을 제거하고 전용 클래스(`.partner-companies-grid--bio` 등)로 옮겨 `style.css`에 좁은 폭 전용 규칙을 추가. 카드 2열 유지 의도는 보존하되 375px에서 넘치지 않도록 함.

### 5. `domains-resource.html` 파트너 그리드 일관성 정리

**현재 문제:** 153행에 동일 패턴의 인라인 `minmax(220px, 280px)` 단일 컬럼 오버라이드가 있음. 현재는 카드가 1개뿐이라 무해하지만, 카드가 추가되면 동일한 오버플로우 위험이 재현됨.

**변경 대상:** `domains-resource.html`

**수정:** bio.html과 동일한 방식(클래스 기반 또는 낮은 minmax 값)으로 통일해 향후 카드 추가에도 안전하도록 정리.

### 6. `domains-beauty.html` 그리드 브레이크포인트 세분화

**현재 문제:** `.domain-feature-grid--tri`(1643-1704행)와 `.domain-highlight-row`(1730-1756행) 모두 `@media (max-width:640px)`에서만 1열/세로로 꺾여서, 768px(태블릿)에서는 여전히 3열/3열-가로로 답답하게 유지됨.

**변경 대상:** `style.css`

**수정:** 두 컴포넌트 모두에 `@media (max-width:900px)` 단계를 추가해 2열(또는 2단)로 전환하고, 기존 640px 단계는 최종 1열로 유지.

## 이번 작업 범위 제외

- 히어로, 파트너 마퀴, 푸터, about.html, 대부분의 도메인 상세 페이지 공유 레이아웃(hero/tech-split/product/sort-platform), `.sort-platform-grid`, `.biz-model-grid`, `domains-agriculture.html`의 파트너 그리드(정상 동작하는 "control" 사례) — 모두 감사에서 문제없음으로 확인됨, 손대지 않음
- `about.html`의 `.history-sparse-item` 날짜 컬럼이 768px에서 아직 안 쌓이는 것 — 넘치지 않고 약간 타이트한 수준의 저우선순위 항목으로, 이번 스코프에서는 보류. 필요시 별도 작업으로 진행
- `.opt3-*` 죽은 CSS(1852-1917행) — 이번 반응형 작업과 무관, 삭제하지 않음
- `index.html`의 `.domains-tabs` 가로 스크롤에 엣지 페이드 등 시각적 어포던스가 없는 점 — 기능은 정상 동작하므로 저우선순위, 이번 스코프에서는 보류

## 검증 계획

- 코드 수정 후 각 미디어 쿼리 규칙이 실제로 375px(모바일)/768px(태블릿)/1280px+(데스크톱) 폭에서 의도대로 적용되는지 `window.matchMedia()` 및 `getBoundingClientRect()` 기반 점검 수행
- 브라우저 자동화 도구의 뷰포트 축소 기능이 현재 동작하지 않아, 실제 스크린샷을 통한 시각적 검증은 제한적일 수 있음. 가능한 대안(다른 리사이즈 방식, 실기기 확인 등)을 모색하되, 안 될 경우 사용자에게 상황을 알리고 코드 레벨 검증(computed style, matchMedia 결과)으로 대체
