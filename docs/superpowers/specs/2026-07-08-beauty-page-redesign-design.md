# Beauty 상세 페이지 리디자인 (Option B — LULULAB 스타일)

## 배경

`domains-beauty.html`이 "너무 단조롭고 프로덕트 디자인 느낌이 아니다"라는 피드백을 받았다. TECHNOLOGY, BUSINESS MODEL & CUSTOMERS, ACHIEVEMENTS 3개 섹션을 대상으로 재디자인한다. 경쟁제품 비교표(`.domain-compare-table`)는 완전히 제거한다.

`design-drafts/beauty-modern-product.html`에서 BeconX·LULULAB 실측 CSS(색상/타이포/코너 반경)를 반영한 3개 옵션(A/B/C)을 로컬 서버로 시각화했고, 사용자가 **Option B (LULULAB 스타일)**를 선택했다. 이 문서는 Option B를 실제 `domains-beauty.html` + `style.css`에 반영하기 위한 설계다.

## 참조 근거 (재확인)

룰루랩(lulu-lab.com) 실측: 블랙/화이트/그레이 베이스 + 마젠타 강조 `#da005c`, font-weight 500/600/900 다용, 히어로 타이포 최대 5.625rem(90px), 코너 반경 5~10px. FINSIDE 현재 톤(베이지 `#faf8f4`, 코너 12~20px 라운드)과 대비되는, 고대비 화이트/블랙 + 단일 강조색 + 굵은 대형 숫자 타이포 + 매거진/대시보드식 레이아웃 방향.

## 변경 범위

이 작업은 **Beauty 페이지 전용**이다. `style.css`에 새 컴포넌트 클래스를 추가하지만, 기존 클래스(`.domain-detail-section`, `.domain-stat-grid` 등)는 다른 도메인 페이지(Agriculture/Bio/Resource)에서 계속 쓰이므로 수정하지 않고 새 클래스를 병행 추가한다. Beauty 페이지의 3개 섹션만 새 마크업/클래스로 교체한다.

## 섹션별 설계

### 1. TECHNOLOGY

- 기존 문단은 유지.
- 문단 아래에 **히어로 스탯 블록** 추가: "ZERO CONTACT" 형태의 대형 볼드 타이포(반응형 `clamp(56px, 8vw, 120px)`, font-weight 900, 하단 4px 블랙 보더)와 우측 캡션("접촉 없이 수분·유분·탄력을 정량 데이터로 측정하고 AI 앱으로 즉시 제공"). 좁은 화면에서는 세로 스택.
- 그 아래 **필터 칩 로우**: 수분/유분/탄력/AI 모바일 연동 4개 pill 칩. 첫 번째("수분")를 마젠타 active 상태로 표시해 시각적 포인트를 준다.
- **경쟁제품 비교표는 완전히 제거** — 대체 콘텐츠 없이 삭제.

### 2. BUSINESS MODEL & CUSTOMERS

- 배경을 다크(#111)로 전환해 섹션 간 명암 리듬을 준다 (TECHNOLOGY/ACHIEVEMENTS는 화이트 유지).
- 기존 하나의 문단을 **2열 스플릿 카드**(B2B / B2C)로 분해: 각 열에 마젠타 태그 pill("B2B"/"B2C") + 타이틀 + 설명 문단 + 하단 큰 통계 숫자(B2B: "3,500 목표 매장/관리실 수", B2C: "17.9% 시장 연평균 성장률"). 2px 보더로 카드 전체를 감싸고 중앙에 구분선.
- 원문 수치(1,300개 매장, 35,000개 피부관리실 목표 10%, 에이피알·세라젬·달바, 30만원+3~5만원 구독, TAM/SAM/CAGR)는 그대로 유지, 배치만 재구성.

### 3. ACHIEVEMENTS

- 배경 화이트(연한 오프화이트 `#fbfbfb`) 유지.
- 특허 수치를 **도넛 차트**로 시각화: conic-gradient로 국내 8건(마젠타)/PCT 2건(블랙) 비율 표현, 중앙에 "10건" 숫자 + 범례.
- 매출 로드맵을 기존 `.revenue-bars`보다 **굵은 바 차트**(`optB-bars2` 패턴)로 교체 — 마지막 막대(2030, 300억)만 마젠타로 강조해 목표 연도를 부각.
- TAM/SAM 비교는 기존 `.compare-bar-track` 패턴을 유지하되 색상만 마젠타 계열로 조정(완전히 새 컴포넌트를 만들 필요 없음 — 기존 바 컴포넌트가 이미 이 용도에 적합).

## style.css 변경

다음 클래스를 새로 추가한다 (기존 클래스는 변경하지 않음, 접두사 `beauty-b-`로 다른 도메인과 네임스페이스 분리):

- `.beauty-b-hero-stat`, `.beauty-b-hero-num`, `.beauty-b-hero-cap` — 대형 숫자 히어로 블록
- `.beauty-b-chip-row`, `.beauty-b-chip`, `.beauty-b-chip.active` — 필터 칩
- `.beauty-b-biz` (다크 배경 섹션 wrapper), `.beauty-b-split`, `.beauty-b-split-col`, `.beauty-b-split-tag`, `.beauty-b-split-stat` — B2B/B2C 스플릿 카드
- `.beauty-b-donut`, `.beauty-b-donut-hole`, `.beauty-b-legend` — 특허 도넛 차트
- `.beauty-b-bars`, `.beauty-b-bars-col`, `.beauty-b-bars-bar`, `.beauty-b-bars-bar.hi` — 굵은 매출 바 차트

색상: 마젠타 강조 `#da005c` (다크 섹션 내 텍스트용 밝은 변형 `#ff4d94`), 블랙 `#111`, 화이트/오프화이트 `#fff`/`#fbfbfb`. 코너 반경은 참조 실측대로 5~10px 정도로 각지게 (기존 사이트의 12~24px보다 좁게), 단 완전 직각(0px)까지는 가지 않아 사이트 전체 톤과 과도하게 단절되지 않도록 한다.

## 스코프 제외

- Hero 섹션, CTA 스트립은 변경하지 않음 (기존 그대로 유지)
- 다른 도메인 페이지(Agriculture/Bio/Resource)는 이번 작업에서 건드리지 않음
- Option A/C의 다크 대시보드·매거진 카드 레이아웃은 채택하지 않음 (Option B만 구현)
- 새 이미지/아이콘 제작 없음
