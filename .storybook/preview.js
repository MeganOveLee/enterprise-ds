/* 불러오는 순서는 README와 같다: tokens → brands → globals → components */
import '../css/tokens.css';
import '../css/brands/e3ps.css';
import '../css/brands/sample.css';
import '../css/globals.css';
import '../css/components.css';
import './fonts.css';

/** 브랜드 = <html class="theme-*">, 다크 = <body class="dark-mode"> — 실제 화면과 같은 스위치 */
const withTheme = (Story, ctx) => {
  const { brand, mode } = ctx.globals;
  document.documentElement.classList.toggle('theme-sample', brand === 'sample');
  document.body.classList.toggle('dark-mode', mode === 'dark');
  const out = Story();
  const wrap = document.createElement('div');
  wrap.className = 'sb-ds';
  if (typeof out === 'string') wrap.innerHTML = out; else wrap.appendChild(out);
  // 날짜 선택은 그려진 뒤 초기화 (이미 붙은 칸은 건너뜀)
  requestAnimationFrame(() => window.datepickerInit && window.datepickerInit());
  return wrap;
};

export default {
  globalTypes: {
    brand: {
      description: '브랜드',
      toolbar: { title: '브랜드', icon: 'paintbrush', dynamicTitle: true,
        items: [{ value: 'e3ps', title: 'E3PS' }, { value: 'sample', title: '이퍼플 (sample)' }] },
    },
    mode: {
      description: '라이트 / 다크',
      toolbar: { title: '모드', icon: 'mirror', dynamicTitle: true,
        items: [{ value: 'light', title: '라이트' }, { value: 'dark', title: '다크' }] },
    },
  },
  initialGlobals: { brand: 'e3ps', mode: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'fullscreen',
    // 왼쪽 메뉴 순서 — 카테고리 > 컴포넌트 (컴포넌트 하나 = 한 페이지)
    options: { storySort: { order: ['소개', 'Foundation', ['Color', 'Typography', 'Spacing · Radius', 'State'], 'Form', 'Feedback'] } },
    controls: { expanded: true },
    a11y: { test: 'todo' },
  },
  tags: ['autodocs'],
};
