// Foundation/Spacing · Radius — 문서 화면은 Spacing.mdx. 여기 스토리는 MDX 카드 안에 들어가는 단계 표
import { mount } from './_foundation.js';

export default {
  title: 'Foundation/Spacing · Radius',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Spacing.mdx
};
const css = (lines) => ({ docs: { source: { language: 'css', code: lines.join('\n') } } });

export const 간격 = {
  parameters: css(['.card { padding: var(--spacing-16); }', '.form-grid-2 { gap: var(--spacing-16) var(--spacing-24); }']),
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
  parameters: css(['/* 컴포넌트는 역할 이름을 쓴다 — 값은 단계를 가리키고, 브랜드 파일이 바꿀 수 있다 */', '.btn   { border-radius: var(--radius-btn); }    /* 기본 = var(--radius-md) */', '.input { border-radius: var(--radius-input); }  /* 기본 = var(--radius-sm) */', ':root.theme-precision { --radius-btn: var(--radius-none); --radius-input: var(--radius-none); }']),
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
  parameters: css(['.card { box-shadow: var(--shadow-core); }', '.datepicker { box-shadow: var(--shadow-popover); }', '.pop-area { box-shadow: var(--shadow-modal); }']),
  render: () => mount(`<div style="display:flex;gap:16px;flex-wrap:wrap;padding:16px;background:var(--color-bg-subtle);border-radius:var(--radius-lg)">
    ${[['core', '카드 · 달력 화살표'], ['popover', '드롭다운 · 달력 · 다중 선택 목록'], ['modal', '인페이지 팝업']].map(([n, use]) => `
    <div class="fd-card" style="flex:1 1 180px;box-shadow:var(--shadow-${n})"><code>--shadow-${n}</code><div class="fd-use">${use}</div></div>`).join('')}
  </div>
  <p class="fd-use" style="margin:8px 0 0">그림자는 역할 3단계입니다(카드 · 떠 있는 층 · 덮개 층). 면 구분은 주로 배경색 차이와 테두리로 하고, 그림자는 바닥에서 뜬 정도만 나타냅니다.</p>`),
};

export const 높이 = {
  parameters: css(['.input, .select { height: var(--size-input); }', '.btn { height: var(--size-btn); }', '.btn--sm { height: var(--size-btn-sm); }', ':root.theme-precision { --size-input: 32px; --size-btn: 32px; --size-btn-sm: 28px; }']),
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
