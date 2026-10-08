import { mount } from './_foundation.js';

export default {
  title: 'Foundation/Spacing · Radius',
  tags: ['!dev'],
  parameters: {
    docs: { description: { component:
      '간격 · 모서리 · 그림자 · 높이 단계입니다. 실제로 쓰는 단계만 둡니다. ' +
      '지금은 모든 브랜드가 같은 값을 쓰고, 브랜드별로 모양을 바꾸는 건(예: 모서리를 더 각지게) 시안 검토 후 정합니다.' } },
  },
};

export const 간격 = {
  render: () => mount([
    [2, '아이콘과 글자 사이 아주 좁게'],
    [4, '붙어 있는 요소 사이'],
    [8, '버튼 사이 · 라벨과 입력칸'],
    [12, '폼 항목 사이'],
    [16, '카드 안 여백'],
    [24, '섹션 사이'],
    [32, '큰 묶음 사이'],
    [48, '페이지 위아래 여백'],
  ].map(([n, use]) => `
    <div class="fd-row fd-item">
      <code>--spacing-${n}</code><span class="fd-val" data-read="width"></span>
      <div><div class="fd-sw fd-bar" style="width:var(--spacing-${n})"></div><div class="fd-use" style="font-size:var(--body-sm);margin-top:4px">${use}</div></div>
    </div>`).join('')),
};

export const 모서리 = {
  render: () => mount(`<div class="fd-boxes">${[
    ['sm', '체크박스 · 작은 태그'],
    ['md', '버튼 · 입력칸'],
    ['lg', '카드 · 팝업'],
    ['rounded', '칩 · 배지 · 스위치'],
  ].map(([n, use]) => `
    <div class="fd-item">
      <div class="fd-sw fd-box" style="border-radius:var(--radius-${n})"></div>
      <span class="fd-name">--radius-${n}</span><span class="fd-val" data-read="radius"></span>
      <span class="fd-val">${use}</span>
    </div>`).join('')}</div>`),
};

export const 그림자 = {
  render: () => mount(`<div style="padding:16px;background:var(--color-bg-subtle);border-radius:var(--radius-lg)">
    <div class="fd-card" style="box-shadow:var(--shadow-core)"><code>--shadow-core</code></div>
  </div>
  <p class="fd-use" style="margin:8px 0 0">그림자는 한 단계뿐입니다. 면 구분은 주로 배경색 차이와 테두리로 합니다.</p>`),
};

export const 높이 = {
  render: () => mount([
    ['size-input', '입력칸 · 셀렉트 · 날짜 선택'],
    ['size-btn', '버튼 (입력칸과 같은 줄에 맞춤)'],
  ].map(([n, use]) => `
    <div class="fd-row fd-item">
      <code>--${n}</code><span class="fd-val" data-read="height"></span>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="fd-sw" style="height:var(--${n});width:120px;border:1px dashed var(--color-border-brand);background:var(--color-bg-brand-subtle);border-radius:var(--radius-md)"></div>
        <span class="fd-use">${use}</span></div>
    </div>`).join('')),
};
