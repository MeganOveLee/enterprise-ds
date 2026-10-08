import { mount } from './_foundation.js';

const SAMPLE = '설계 변경 요청서 ECR-2026-0142';

const rows = (items) => mount(items.map(([token, use, style]) => `
  <div class="fd-row fd-item">
    <code>--${token}</code>
    <span class="fd-val" data-read="font-size"></span>
    <div>
      <div class="fd-sw" style="${style}">${SAMPLE}</div>
      <div class="fd-use" style="font-size:var(--body-sm);margin-top:4px">${use}</div>
    </div>
  </div>`).join(''));

export default {
  title: 'Foundation/Typography',
  tags: ['!dev'],
  parameters: {
    docs: { description: { component:
      '글꼴은 **Pretendard** 하나입니다. 업무 화면이라 본문 기본은 14px이고, 제목은 6단계입니다. ' +
      'h1~h6 태그를 쓰면 같은 단계 크기가 자동으로 붙습니다. 제목 줄 간격은 1.2(`--line-height-tight`)입니다.' } },
  },
};

export const 제목 = {
  render: () => rows([
    ['heading-2xl', 'h1 · 홈 인사말', 'font-size:var(--heading-2xl);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-xl',  'h2', 'font-size:var(--heading-xl);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-lg',  'h3 · 상세 화면 제목', 'font-size:var(--heading-lg);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-md',  'h4 · 페이지 · 카드 · 팝업 제목', 'font-size:var(--heading-md);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-sm',  'h5', 'font-size:var(--heading-sm);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-xs',  'h6', 'font-size:var(--heading-xs);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
  ]),
};

export const 본문 = {
  render: () => rows([
    ['body-lg', '강조 본문 · 큰 안내', 'font-size:var(--body-lg)'],
    ['body-md', '기본 본문 · 입력칸 · 그리드 셀', 'font-size:var(--body-md)'],
    ['body-sm', '보조 설명 · 도움말 · 배지', 'font-size:var(--body-sm)'],
  ]),
};

export const 굵기 = {
  render: () => mount([
    ['regular', 400, '본문'],
    ['medium', 500, '버튼 · 탭'],
    ['semibold', 600, '라벨 · 강조'],
    ['bold', 700, '제목'],
  ].map(([n, w, use]) => `
    <div class="fd-row">
      <code>--font-weight-${n}</code><span class="fd-val">${w}</span>
      <div>
        <div style="font-size:var(--heading-sm);font-weight:var(--font-weight-${n})">${SAMPLE}</div>
        <div class="fd-use" style="font-size:var(--body-sm);margin-top:4px">${use}</div>
      </div>
    </div>`).join('')),
};
