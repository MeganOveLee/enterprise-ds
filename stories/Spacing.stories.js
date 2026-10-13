import { mount } from './_foundation.js';

export default {
  title: 'Foundation/Spacing · Radius',
  tags: ['!dev'],
  parameters: {
    docs: { description: { component:
      '간격 · 모서리 · 그림자 · 높이 단계입니다. 실제로 쓰는 단계만 둡니다. ' +
      '모서리와 높이는 컴포넌트가 역할 이름(--radius-btn · --size-input …)으로 쓰고, 브랜드가 이 역할 값을 바꿀 수 있습니다. ' +
      '도구 막대에서 Fashion을 고르면 둥근 모서리, Precision을 고르면 직각 · 높이 32로 역할 값이 바뀝니다.' } },
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
  render: () => mount(`
    <p class="fd-lead">단계 — 값 사전입니다. 모든 브랜드가 같은 값을 씁니다.</p>
    <div class="fd-boxes">${[
      ['none', '직각 — 브랜드가 역할을 0으로 둘 때'], ['sm', '입력칸 · 체크박스 · 작은 표식의 기본'], ['md', '버튼 · 영역 박스 · 떠 있는 층의 기본'], ['lg', '카드의 기본'], ['rounded', '알약 · 칩 · 스위치'],
    ].map(([n, use]) => `
      <div class="fd-item">
        <div class="fd-sw fd-box" style="border-radius:var(--radius-${n})"></div>
        <span class="fd-name">--radius-${n}</span><span class="fd-val" data-read="radius"></span>
        <span class="fd-val">${use}</span>
      </div>`).join('')}</div>
    <p class="fd-lead" style="margin-top:32px">역할 — 컴포넌트는 이 이름을 씁니다. 브랜드가 값을 바꿀 수 있는 자리입니다(플렉시블).</p>
    <div class="fd-row fd-head" style="padding-top:0;align-items:center"><span>토큰 · 기본 단계</span><span>지금 값</span><span>쓰는 곳</span></div>
    ${[
      ['btn', 'md', '모든 버튼 — 표준 · 아이콘(닫기 · 페이지 번호 · 달력 화살표) · 작은 버튼'],
      ['input', 'sm', '입력칸 · 셀렉트 · 여러 줄 입력 · 날짜 · 다중 선택'],
      ['checkbox', 'sm', '체크박스 표식'],
      ['chip', 'rounded', '칩 — Chip · Status chip, 버전 표시'],
      ['item', 'sm', '목록 · 메뉴 안의 행'],
      ['card', 'lg', '카드 · 스켈레톤 카드'],
      ['panel', 'md', '화면 안 영역 박스 — 그리드 목록 · 검색 폼'],
      ['popover', 'md', '떠 있는 층 — 달력 · 드롭다운'],
      ['skeleton', 'sm', '스켈레톤 조각'],
    ].map(([n, base, use]) => `
      <div class="fd-row fd-item" style="align-items:center">
        <span><code>--radius-${n}</code><span class="fd-val">기본 ${base}</span></span>
        <span class="fd-val" data-read="radius"></span>
        <div style="display:flex;align-items:center;gap:12px">
          <div class="fd-sw" style="width:56px;height:28px;flex-shrink:0;background:var(--color-bg-brand-subtle);border:1px solid var(--color-border-brand);border-radius:var(--radius-${n})"></div>
          <span class="fd-use">${use}</span></div>
      </div>`).join('')}
    <p class="fd-use" style="margin:12px 0 0">원형(라디오 · 스피너) · 알약(스위치 · 개수 배지) · 로고 마크는 역할이 없어 모든 브랜드가 같습니다(스태틱).</p>`),
};

export const 그림자 = {
  render: () => mount(`<div style="padding:16px;background:var(--color-bg-subtle);border-radius:var(--radius-lg)">
    <div class="fd-card" style="box-shadow:var(--shadow-core)"><code>--shadow-core</code></div>
  </div>
  <p class="fd-use" style="margin:8px 0 0">그림자는 한 단계뿐입니다. 면 구분은 주로 배경색 차이와 테두리로 합니다.</p>`),
};

export const 높이 = {
  render: () => mount([
    ['size-input', '입력칸 · 셀렉트 · 날짜 선택 — 브랜드가 바꿀 수 있음'],
    ['size-btn', '버튼 (입력칸과 같은 줄에 맞춤) · 아이콘 버튼은 가로세로 — 브랜드가 바꿀 수 있음'],
    ['size-btn-sm', '작은 버튼 (Figma Small Button) — 섹션 접기 · 첨부 삭제'],
  ].map(([n, use]) => `
    <div class="fd-row fd-item">
      <code>--${n}</code><span class="fd-val" data-read="height"></span>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="fd-sw" style="height:var(--${n});width:120px;border:1px dashed var(--color-border-brand);background:var(--color-bg-brand-subtle);border-radius:var(--radius-input)"></div>
        <span class="fd-use">${use}</span></div>
    </div>`).join('')),
};
