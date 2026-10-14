# Enterprise DS v1.0

전담 프론트엔드가 없는 엔터프라이즈 백오피스 화면을, 1인 퍼블리셔가 표준화하고 인계 가능한 상태로 유지하기 위한 CSS 디자인 시스템입니다.

**바로 보기** — [Figma UI Kit (한 장 요약)](https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5) · [Figma Foundation](https://www.figma.com/design/Mf4XTC6dNUOH0anjOMcRPi) · [Storybook](https://meganovelee.github.io/enterprise-ds/) · [화면 예시](https://meganovelee.github.io/enterprise-ds/?path=/docs/screens-plm-%ED%99%94%EB%A9%B4--docs) · [결정 기록(ADR)](https://app.notion.com/p/3eda8196682d8126967fcc86f796fcb4)

- **Figma**: [UI Kit](https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5) — 컴포넌트 원본, 첫 페이지가 한 장 요약 · [Foundation](https://www.figma.com/design/Mf4XTC6dNUOH0anjOMcRPi) — 토큰(변수) · 글자 스타일 원본
- **Storybook**: https://meganovelee.github.io/enterprise-ds/ — 같은 값을 실제 CSS로 그린 견본
- **화면 예시**: [Screens › PLM 화면](https://meganovelee.github.io/enterprise-ds/?path=/docs/screens-plm-%ED%99%94%EB%A9%B4--docs) — 이 디자인 시스템의 클래스와 토큰만으로 구성한 실제 크기 업무 화면 5장(로그인 · 홈 · 문서 검색 · 문서 등록 · 프로젝트 상세)과 같은 화면의 브랜드 3개 비교
- **결정 기록(ADR)**: [Notion — 결정 기록](https://app.notion.com/p/3eda8196682d8126967fcc86f796fcb4) — 토큰 · 컴포넌트를 정할 때의 배경 · 선택지 · 근거
- 스타일은 CSS가 소유합니다 — 토큰(`--color-*` …) → 컴포넌트 클래스(`.btn`, `.input` …). JSP 같은 서버 렌더링 화면에도 그대로 씁니다.
- 브랜드는 `<html class="theme-*">`, 다크 모드는 `<body class="dark-mode">` 하나로 바뀝니다.

## 구조

| 경로 | 내용 |
|---|---|
| `css/tokens.css` | 공통 토큰 (원천 램프 → 시맨틱 → 다크) |
| `css/brands/` | 브랜드 값 파일. 브랜드가 여는 토큰(색 · 형태) 목록은 `_template.css`(새 브랜드 양식), 지금 값 표는 스토리북 Foundation › Spacing · Radius · `fashion.css` · `precision.css` = 시연용 가상 산업 브랜드(Fashion · 패션 리테일 = 색 + 둥근 모서리 / Precision · 정밀기계 = 색 + 직각 · 높이 32) |
| `css/globals.css` · `components.css` | 전역 · 컴포넌트. 브랜드를 모릅니다 |
| `js/datepicker.js` | 날짜 선택 (WAI-ARIA APG Date Picker Dialog 패턴) |
| `stories/` · `.storybook/` | Storybook (HTML 프레임워크) |

## 불러오는 순서

```html
<html class="theme-fashion">   <!-- 클래스 없으면 기본 브랜드 -->
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/brands/fashion.css">
<link rel="stylesheet" href="css/globals.css">
<link rel="stylesheet" href="css/components.css">
<script src="js/datepicker.js"></script>
```

## 규칙

- 화면 CSS는 `--color-*` 시맨틱만 씁니다. 원천 램프(`--neutral-N`, `--brand-N`) 직접 참조 금지
- 브랜드 값은 `css/brands/` 파일에만 둡니다
- 결정마다 ADR(결정 기록)을 남깁니다 — 코드 주석의 `DS-ADR-0NN`

## 로컬 실행

```
npm install
npm run storybook
```

---

© 2026 이세영 (MeganOveLee). All rights reserved.
이 저장소의 코드와 문서는 포트폴리오 열람용으로 공개되어 있습니다. 별도 허락 없이 복제·수정·배포·상업적 이용을 할 수 없습니다.
