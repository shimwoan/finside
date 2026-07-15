# Bio & Process 페이지 — FBE 시스템 장비 섹션 추가

## 배경

`domains-agriculture.html`에는 "모듈형 선별 플랫폼" 섹션이 있다 — 장비 사진과 기능
아이콘 그리드를 좌우로 배치한 `sort-platform-*` 스타일 섹션. `domains-bio.html`에는
현재 이 장비 섹션이 없고, TECHNOLOGY/BUSINESS MODEL 텍스트 섹션만 존재한다.

`ref/` 자료(TeX-Corps 창업탐색 지원사업 발표자료, IP스타과학자 발표자료) 조사 결과,
바이오 도메인의 핵심 기술은 **FBE 시스템**(비접촉 LWIR 열화상 센서 + AI 실시간 시계열
분석으로 이동 컨베이어 위 축분의 함수율을 실시간 계측)이며, 하드웨어 구성(라즈베리파이5,
FLIR Lepton 3.0 LWIR 센서, 듀얼 카메라, 히터, 3D프린팅 인클로저 등)과 레트로핏 방식
도입 특징이 명확히 문서화되어 있다.

사용자가 직접 제공한 장비 사진(컨베이어 프레임, 열화상 센서 마운트, 제어박스가 있는 리그)이
이 FBE 시스템의 물리적 구성과 일치하여 대표 이미지로 사용한다.

## 범위

- **포함**: `domains-bio.html`에 신규 "FBE 시스템" 장비 섹션 추가 (히어로 섹션과 기존
  TECHNOLOGY 텍스트 섹션 사이)
- **제외**: 기존 BUSINESS MODEL 텍스트 섹션의 카드형 재구성, 파트너사 그리드 추가 —
  현재 텍스트 섹션은 그대로 유지

## 설계

### 배치

```
히어로 섹션 (기존)
  ↓
[신규] FBE 시스템 장비 섹션 — sort-platform-* 스타일 재사용
  ↓
TECHNOLOGY 텍스트 섹션 (기존, 변경 없음)
  ↓
BUSINESS MODEL 텍스트 섹션 (기존, 변경 없음)
```

### 신규 섹션 내용

농업 페이지의 "모듈형 선별 플랫폼" 섹션과 동일한 마크업 구조
(`sort-platform-section` / `sort-platform-layout` / `sort-platform-visual` /
`sort-platform-content` / `sort-platform-grid`)를 재사용한다. 기존 CSS를 그대로
쓰므로 스타일 변경은 없다.

- **좌측 이미지**: 사용자 제공 장비 사진 → `assets/fbe-system-device.png`로 저장
  - alt: "FBE 시스템 계측 장비"
- **우측 제목**: `FBE <b>시스템</b>`
- **Subhead**: `연속 이송 라인 기반 비접촉 실시간 함수율 계측 시스템`
- **바디 텍스트** (TeX-Corps 자료 슬라이드 5 기반):
  > 연속 이송 라인에서 비접촉 방식으로 축분 원료의 함수율을 실시간 정량 예측하는 AI
  > 품질 분석 시스템입니다. 원료 표면의 증발 냉각 효과에 따른 시계열 데이터를 분석해,
  > 점성이 강하고 수분 분포가 불균일한 환경에서도 높은 신뢰도를 확보했습니다.
  > 저비용·고효율 계측 모듈의 레트로핏 방식으로 기존 설비 교체 없이 도입할 수 있습니다.
- **기능 아이콘 그리드 (6종)**, 기존 SVG 아이콘 스타일(stroke, `currentColor`) 유지:
  1. LWIR 비접촉 열화상 센싱
  2. 실시간 시계열 분석 (AI)
  3. 이동 컨베이어 무중단 계측
  4. 레트로핏 모듈 장착
  5. 고온·분진 내구 설계
  6. 폐쇄루프(Closed-loop) 공정 제어

### 근거 자료 (ref/02. TeX-Corps...pptx)

- Slide 5: "연속 이송 라인에서 비접촉 방식으로 축분 원료의 함수율을 실시간 정량
  예측하는 AI 품질 분석 시스템 / 원료의 표면 증발 냉각 효과에 따른 시계열 데이터
  분석 → 점성이 강하고 수분 분포가 불균일한 환경에서도 높은 신뢰도 확보 / 저비용·고효율
  계측 모듈의 레트로핏 방식을 통한 초기 설비 투자 부담 최소화"
- Slide 4: "비접촉 AI 분석으로 고온·분진 등 가혹한 현장 환경 극복 / 설비 교체 없이
  모듈 추가 장착으로 초기 도입 부담 감소"
- Slide 11 (영문 요약): "Inline & Non-contact", "AI-based Closed-loop Control —
  Reduces over-drying and minimizes energy waste"

## 테스트

- 브라우저에서 `domains-bio.html` 열어 레이아웃 확인 (신규 섹션이 히어로와 TECHNOLOGY
  섹션 사이에 올바르게 배치되는지)
- 반응형 확인: `sort-platform-layout`은 기존 CSS 미디어쿼리로 모바일에서 세로 스택되므로
  별도 CSS 작업 불필요 — 시각적으로 확인만
- reveal-fade 애니메이션 동작 확인 (기존 IntersectionObserver 스크립트 재사용)
