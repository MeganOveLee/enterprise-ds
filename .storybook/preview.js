/* 불러오는 순서는 README와 같다: tokens → brands → globals → components */
import '../css/tokens.css';
import '../css/brands/default.css';
import '../css/brands/fashion.css';
import '../css/brands/precision.css';
import '../css/globals.css';
import '../css/components.css';
import './fonts.css';

/** 브랜드 = <html class="theme-*">, 다크 = <body class="dark-mode"> — 실제 화면과 같은 스위치 */
const withTheme = (Story, ctx) => {
  const { brand, mode } = ctx.globals;
  document.documentElement.classList.toggle('theme-fashion', brand === 'fashion');
  document.documentElement.classList.toggle('theme-precision', brand === 'precision');
  document.body.classList.toggle('dark-mode', mode === 'dark');
  const out = Story();
  const wrap = document.createElement('div');
  wrap.className = 'sb-ds';
  if (typeof out === 'string') wrap.innerHTML = out; else wrap.appendChild(out);
  // 날짜 선택은 그려진 뒤 초기화 (이미 붙은 칸은 건너뜀)
  requestAnimationFrame(() => { window.datepickerInit && window.datepickerInit(); window.dsClearInit && window.dsClearInit(); });   // 지우기(×)는 날짜 칸이 그려진 뒤
  return wrap;
};

export default {
  globalTypes: {
    brand: {
      description: '브랜드',
      toolbar: { title: '브랜드', icon: 'paintbrush', dynamicTitle: true,
        items: [{ value: 'default', title: 'Default' }, { value: 'fashion', title: 'Fashion · 패션 리테일' }, { value: 'precision', title: 'Precision · 자동차 부품' }] },
    },
    mode: {
      description: '화면 모드 (라이트 / 다크)',
      toolbar: { title: '화면 모드', icon: 'mirror', dynamicTitle: true,
        items: [{ value: 'light', title: '라이트' }, { value: 'dark', title: '다크' }] },
    },
  },
  initialGlobals: { brand: 'default', mode: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    // 왼쪽 메뉴 순서 — 문서(소개 · 시작하기) → 화면 → 조합(Blocks) → 컴포넌트 분류 → 기본 요소(Foundation, 맨 아래). 「디자인이 먼저, 토큰은 밑」
    options: { storySort: { order: ['소개', '시작하기', 'Screens', 'Blocks', ['SearchForm', 'BomCompare', 'ApprovalLine', '*'], 'Form', ['고르는 법', '*'], 'Navigation', 'Overlay', 'Data Display', 'Feedback', ['고르는 법', '*'], 'Foundation', ['Color', 'Typography', 'Spacing · Radius · Size', 'Shadow', 'Motion', 'State']] } },
    controls: { expanded: true },
    a11y: { test: 'todo' },
  },
  tags: ['autodocs'],
};
