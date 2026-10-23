# Enterprise Design System

v1.0 · 설계 · 퍼블리싱 이세영

전담 프론트엔드가 없는 엔터프라이즈 백오피스 화면을, 1인 퍼블리셔가 표준화하고 인계 가능한 상태로 유지하기 위한 CSS 디자인 시스템입니다.

**바로 보기** — [Figma UI Kit (한 장 요약)](https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5) · [Figma Foundation](https://www.figma.com/design/Mf4XTC6dNUOH0anjOMcRPi) · [Storybook](https://meganovelee.github.io/enterprise-ds/) · [화면 예시](https://meganovelee.github.io/enterprise-ds/?path=/docs/screens-plm-%ED%99%94%EB%A9%B4--docs) · [결정 기록(ADR)](https://app.notion.com/p/3eda8196682d8126967fcc86f796fcb4)

- **Figma**: [UI Kit](https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5) — 컴포넌트 원본, 첫 페이지가 한 장 요약 · [Foundation](https://www.figma.com/design/Mf4XTC6dNUOH0anjOMcRPi) — 토큰(변수) · 글자 스타일 원본
- **Storybook**: https://meganovelee.github.io/enterprise-ds/ — 같은 값을 실제 CSS로 그린 견본
- **화면 예시**: [Screens › PLM 화면](https://meganovelee.github.io/enterprise-ds/?path=/docs/screens-plm-%ED%99%94%EB%A9%B4--docs) — 이 디자인 시스템의 컴포넌트와 토큰으로 구성한 실제 크기 업무 화면(화면 배치만 별도 CSS)(로그인 · 홈 · 문서 검색 · 문서 등록 · 프로젝트 상세). 스토리북 맨 위 막대에서 브랜드 × 라이트 · 다크로 바꿔 볼 수 있습니다
- **결정 기록(ADR)**: [Notion — 결정 기록](https://app.notion.com/p/3eda8196682d8126967fcc86f796fcb4) — 토큰 · 컴포넌트를 정할 때의 배경 · 선택지 · 근거
- 스타일은 CSS가 소유합니다 — 토큰(`--color-*` …) → 컴포넌트 클래스(`.btn`, `.input` …). JSP 같은 서버 렌더링 화면에도 그대로 씁니다.
- 브랜드는 `<html class="theme-*">`, 다크 모드는 `<body class="dark-mode">` 하나로 바뀝니다.
- 데스크톱 브라우저 기준입니다. 창이 좁아지면 카드는 한 줄 개수가 줄고, 검색 조건은 칸 수를 그대로 둔 채 칸이 좁아지며, 목록 표는 열을 줄이지 않고 가로로 스크롤합니다. 왼쪽 메뉴를 뺀 본문 최소 폭은 1024px입니다.

## 구조

| 경로 | 내용 |
|---|---|
| `tokens/` | **토큰 값의 원본** (DTCG JSON). `core.json` 원천 램프 · 시맨틱 · `vendor.json` 벤더 이름 · `dark.json` 다크 · `brands/*.json` 브랜드. 값을 고치는 곳은 여기뿐입니다 |
| `css/tokens.css` | 공통 토큰 (원천 램프 → 시맨틱 → 다크) — `tokens/`에서 만드는 생성 파일 |
| `css/brands/` | 브랜드 값 파일 — `tokens/brands/`에서 만드는 생성 파일. 브랜드가 여는 토큰(색 · 형태 · 그림 자산) 목록은 `tokens/brands/_template.json`(새 브랜드 양식)에 있고, 지금 값은 스토리북 Foundation › Color(색) · Spacing · Radius · Size(형태 · 그림 자산)에서 브랜드를 바꿔 볼 수 있습니다. `default.css` = 기본 브랜드(그림 자산 솔리드), `fashion.css` · `precision.css` = 시연용 가상 산업 브랜드(Fashion · 패션 리테일 = 색 + 둥근 모서리 / Precision · 자동차 부품 = 색 + 직각 · 높이 32, 둘 다 그림 자산 라인) |
| `css/globals.css` · `components.css` | 전역 · 컴포넌트. 브랜드를 모릅니다 |
| `js/select.js` | 선택 목록 — 화면의 단일 select를 같은 목록(`.ui-select`)으로 (APG Select-Only Combobox 패턴) |
| `js/multiselect.js` | 다중 선택 — `select.checkSelect[multiple]`을 표시 상자 + 체크박스 목록으로 |
| `js/datepicker.js` | 날짜 선택 (WAI-ARIA APG Date Picker Dialog 패턴) |
| `js/tabs.js` | 팝업 탭 넘침 — 탭이 줄보다 많으면 양 끝에 이전 · 다음 버튼. 고른 탭 밑줄이 다음 탭으로 미끄러짐 |
| `js/motion.js` | 인터랙션 — 숫자 굴러가기 · 방금 바뀐 행 · 처리 끝 체크 · 다음 차이 · 끌어 순서 바꾸기 · 되돌리기 토스트 (`window.dsMotion`) |
| `js/clear.js` | 조회 조건 입력 · 날짜 칸의 지우기(×) 버튼 — `data-ds-clear` 또는 검색 조건 영역(`.mainTable`) 안 칸에 붙음 |
| `js/modal.js` | 확인 창 — `.modal` 열기 · 닫기 · 포커스 가두기 · Esc (APG Dialog (Modal) 패턴) |
| `stories/` · `.storybook/` | Storybook (HTML 프레임워크) |
| `scripts/tokens/` | 토큰 만들기(`build.mjs`, Style Dictionary) · 정의되지 않은 변수 검사 · Figma 변수 대조 · CSS → JSON 옮기기 |
| `figma-plugin/token-export/` | Figma 개발 플러그인 — Foundation 변수를 `tokens/figma/export.json`으로 내보냄 |

## 불러오는 순서

```html
<html class="theme-fashion">   <!-- 클래스 없으면 기본 브랜드 -->
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/brands/fashion.css">
<link rel="stylesheet" href="css/globals.css">
<link rel="stylesheet" href="css/components.css">
<script src="js/select.js"></script>        <!-- JS는 쓰는 컴포넌트 것만 -->
<script src="js/multiselect.js"></script>
<script src="js/datepicker.js"></script>
<script src="js/tabs.js"></script>
<script src="js/modal.js"></script>
<script src="js/motion.js"></script>
<script src="js/clear.js"></script>
```

## 규칙

- 화면 CSS는 `--color-*` 시맨틱만 씁니다. 원천 램프(`--neutral-N`, `--brand-N`) 직접 참조 금지
- 토큰 값은 `tokens/`의 JSON에서만 고칩니다. `css/tokens.css` · `css/brands/*.css`는 생성 파일이라 직접 고치지 않습니다
- 브랜드 값은 `tokens/brands/` 파일에만 둡니다
- 결정마다 ADR(결정 기록)을 남깁니다 — 코드 주석의 `DS-ADR-0NN`

## 로컬 실행

```
npm install
npm run storybook
```

## 토큰 고치기

```
# 1. tokens/*.json 에서 값을 고친다 (참조는 {이름}, 설명은 $description)
npm run tokens          # 2. css/tokens.css · css/brands/*.css 를 다시 만든다
npm run tokens:check    # 3. 생성 파일 · 정의되지 않은 변수 검사 (CI 와 같음)
```

- JSON과 생성 CSS를 함께 커밋합니다. 둘이 다르면 CI(토큰 검사)가 실패합니다.
- 참조가 끊기면(없는 이름을 가리키면) 만들기에서 실패합니다.
- Figma 변수는 `figma-plugin/token-export`로 내보내 `tokens/figma/export.json`에 넣으면, CI가 브랜드 × 라이트 · 다크 최종 값(`tokens/build/resolved.json`)과 대조해 다른 곳을 표로 남깁니다. 로컬에서는 `npm run tokens:figma`.
- 결정 기록: DS-ADR-045 「토큰 원본 = tokens.json」

## 다음 버전

- Figma 가져오기 — 같은 JSON을 Figma 변수에 반영하는 플러그인 버튼. 지금은 내보내기 · 대조까지입니다.
- 같은 JSON에서 리액트용 JS 토큰을 함께 만듭니다.

---

© 2026 이세영 (MeganOveLee). All rights reserved.
이 저장소의 코드와 문서는 포트폴리오 열람용으로 공개되어 있습니다. 별도 허락 없이 복제·수정·배포·상업적 이용을 할 수 없습니다.

출처 — 글꼴 Pretendard(SIL Open Font License 1.1, 이 저장소에는 글꼴 파일이 들어 있지 않음) · GitHub · Figma · Notion 로고는 각 회사의 상표이며 참고 자료 링크 표시에만 씁니다.
