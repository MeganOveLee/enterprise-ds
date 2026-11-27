/* 불러오는 순서는 README와 같다: tokens → brands → globals → components */
import '../css/tokens.css';
import '../css/brands/default.css';
import '../css/brands/mobility.css';
import '../css/fonts/nanum-square-neo.css';   // Mobility 본문 글꼴 등록: 브랜드 CSS 옆에 링크 (DS-ADR-052)
import '../css/brands/ootb.css';
import '../css/fonts/ibm-plex-sans-kr.css';   // OOTB 본문 글꼴 등록: 브랜드 CSS 옆에 링크 (DS-ADR-047)
import '../css/globals.css';
import '../css/components.css';
import '../css/blocks/mobility.css';   // 모바일 앱 전용 Blocks: PLM 화면은 링크하지 않음
import './fonts.css';

/** 브랜드 = <html class="theme-*">, 다크 = <body class="dark-mode">: 실제 화면과 같은 스위치 */
const withTheme = (Story, ctx) => {
  const { brand, mode } = ctx.globals;
  document.documentElement.classList.toggle('theme-mobility', brand === 'mobility');
  document.documentElement.classList.toggle('theme-ootb', brand === 'ootb');
  document.body.classList.toggle('dark-mode', mode === 'dark');
  const out = Story();
  const wrap = document.createElement('div');
  wrap.className = 'sb-ds';
  if (typeof out === 'string') wrap.innerHTML = out; else wrap.appendChild(out);
  // 날짜 선택은 그려진 뒤 초기화 (이미 붙은 칸은 건너뜀)
  requestAnimationFrame(() => { window.datepickerInit && window.datepickerInit(); window.dsClearInit && window.dsClearInit(); window.dsChipsInit && window.dsChipsInit(); window.dsNumberInputInit && window.dsNumberInputInit(); window.dsAppBarInit && window.dsAppBarInit(); });   // 지우기(×)는 날짜 칸이 그려진 뒤
  return wrap;
};

export default {
  globalTypes: {
    // 도구 막대는 .storybook/manager.js 가 그린다: 기기가 맨 앞, 브랜드 목록은 고른 기기의 브랜드만(DS-ADR-055)
    device: { description: '기기' },   // web = PLM 웹, mobile = 모바일 앱
    brand: { description: '브랜드' },   // PLM 웹 = default · ootb, 모바일 앱 = mobility
    mode: { description: '화면 모드 (라이트 / 다크)' },
  },
  initialGlobals: { device: 'web', brand: 'default', mode: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    // 왼쪽 메뉴 순서: 문서(소개 · 시작하기) → 화면 → 조합(Blocks) → 컴포넌트 분류 → 기본 요소(Foundation, 맨 아래). 「디자인이 먼저, 토큰은 밑」
    options: { storySort: { order: ['소개', '시작하기', 'Screens', ['PLM 화면', '*'], 'Blocks', ['SearchForm', 'BomCompare', 'ApprovalLine', '*'], 'Form', ['고르는 법', '*'], 'Navigation', 'Overlay', 'Data Display', 'Feedback', ['고르는 법', '*'], 'Foundation', ['Color', 'Typography', 'Spacing · Radius · Size', 'Shadow', 'Motion', 'Interaction', 'State']] } },
    controls: { expanded: true },
    a11y: { test: 'todo' },
  },
  tags: ['autodocs'],
};
