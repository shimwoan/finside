# About Us 페이지 설계

## 배경

FINSIDE 웹사이트(`index.html`)는 현재 단일 페이지(hero + footer)로 구성되어 있고, nav는 Technology/Product/Company 세 개의 placeholder 링크(`href="#"`)만 가지고 있다. 이번 작업은 nav 첫 번째 항목으로 "About Us"를 추가하고, beconx.com(`/ko/about-us`)의 섹션 구성을 참조해 FINSIDE의 실제 IR/사업계획 자료(`ref/` 폴더의 pptx 5개) 기반 콘텐츠로 별도 About Us 페이지를 만드는 것이다.

## 참조 자료 요약

**디자인 참조 (beconx.com/ko/about-us)**: Hero → Vision/기술 소개 → 기술 그리드 → 연혁 타임라인 → 자문단/팀 → 대표 메시지 → 오시는 길 → 통계 → 파트너사. 좌우 교차 이미지-텍스트 배치, 화이트 배경 중심, 타임라인은 세로형 연대기.

**콘텐츠 (ref/ pptx 추출, 주로 FINSIDE_IR_vFF와 C-LOVE NEXT BRIDGE)**:
- 슬로건: "보이지 않는 내부의 가치를 발견합니다"
- Vision: "FIND" — Satisfaction(고객 만족) · Intelligence(기술 지능화) · Effectiveness(제품 효율화) → "산업의 새로운 기준을 만듭니다"
- 정의문: AI + 비접촉 내부 분석 기술 기반 지능형 분석 솔루션 기업
- 핵심 철학: OSMU(One Source Multi-Use) — 하나의 AI 선별 원천기술을 뷰티/농산물/폐플라스틱/바이오차/축분 등에 적용
- 회사 개요: 설립 2025.12.18, 대표 이동훈, 충북 청주시 서원구 충대로 1 충북대 S21-24동 204호
- 연혁: 2024.04 IP스타과학자 선정 → 2024.06 범부처 고가장비 구축사업 선정 → 2025.07 딥테크 예비창업패키지 선정 → 2025.12 C-LOVE NEXT BRIDGE 선정 → 2025.12.18 법인 설립
- 대표이사 이동훈: 충북대 바이오시스템공학과 교수(2013~현재), 특허 30건 보유(국내 8건, PCT 2건), 최근 3년 기술이전 18건(2.5억원), 논문 6편, 수상 다수(충북대 산학협력 우수교원 등)
- 팀 구성(실명 없음, 직위만): CTO(개발총괄) / S/W개발 차장 / H/W총괄 차장 / 재무관리 차장 / 지재권관리 차장
- 파트너: 충북대학교, 충북창조경제혁신센터, 실증협업기업(진영산업, 한성티앤아이, 한아, 위드위, 포네이처스, 이듬)

## 구현 방식

- 새 파일 `about.html`을 프로젝트 루트에 생성 (index.html과 동일 레벨)
- `index.html`의 `.nav-links` 첫 항목으로 `<li><a href="about.html">About Us</a></li>` 추가 (Technology/Product/Company보다 앞)
- `about.html`에도 동일한 nav/footer를 포함하고, nav의 About Us 항목은 현재 페이지임을 표시(active 스타일)
- 기존 디자인 시스템 그대로 사용: `--bg: #0e0e0e`, `--accent: #c8f0e8`, `--accent2: #7ee8c8`, SUIT 폰트, nav의 scroll-시 라이트 테마 전환
- 애니메이션은 가볍게: scroll-reveal(fade-in/slide-up, IntersectionObserver 기반, 기존 hero reveal-block 패턴 재사용) + 정적 레이아웃. count-up/bar-fill 같은 복잡한 애니메이션은 사용하지 않음

## 섹션 구성 (순서대로)

1. **Hero** — "FIND + INSIDE" 슬로건 중심, 심플한 타이틀 + 서브카피. 기존 index.html hero보다 가벼운 버전(사진/캔버스 없이 텍스트 중심 또는 배경 그라디언트만)
2. **Vision & Mission** — S.I.E 프레임워크를 3개 카드로 표현 (Satisfaction / Intelligence / Effectiveness), 각 카드에 짧은 설명
3. **핵심 철학 (OSMU)** — "하나의 기술, 다양한 산업" 컨셉을 좌(텍스트)-우(적용분야 아이콘/리스트: 뷰티·농산물·폐플라스틱·바이오차·축분) 레이아웃으로
4. **연혁 타임라인** — 세로형 타임라인, 2024.04 ~ 2025.12.18 법인설립까지 5개 마일스톤
5. **대표이사 소개** — 좌(약력 텍스트: 이동훈, 충북대 교수, 특허 30건, 기술이전 18건/2.5억원, 논문 6편)-우(팀 구성 요약 카드: CTO/SW/HW/재무/지재권 직위 리스트, 사진 없이 직위+역할만)
6. **파트너/협력기관** — 충북대학교, 충북창조경제혁신센터, 정부지원사업 3건, 실증협업기업 6개사를 심플한 텍스트/로고 자리 그리드로 나열 (실제 로고 이미지 없으므로 텍스트 배지 형태)
7. **Footer** — index.html과 동일한 footer 컴포넌트 재사용 (오시는 길/연락처 포함되어 있어 별도 Contact 섹션 불필요)

## 스코프 제외

- 팀원 개별 사진/실명 프로필 (자료에 존재하지 않음)
- CES 수상 등 beconx 특유의 화려한 통계/성장 그래프 섹션 (FINSIDE는 아직 창업 초기 단계라 해당 데이터 없음 — 억지로 만들지 않음)
- count-up 숫자 애니메이션, bar-chart 애니메이션 (index.html metrics 섹션과 차별화, 가벼운 버전 유지)
