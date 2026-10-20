// Navigation/Pagination — 문서 화면은 Pagination.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
// Figma UI Kit 「Pagination page」 · 「Pagination control」과 같은 짝. 마크업은 문자열 이어 붙이기(색인기 오류 회피)
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const PREV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
const NEXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

// 보일 번호 — 7칸 이하면 전부, 넘으면 처음 · 끝 · 지금 앞뒤 + 줄임표
const pages = (total, cur) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (cur >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', cur - 1, cur, cur + 1, '…', total];
};
const num = (n, cur, extra = '') =>
  '<button type="button" class="ui-pagination__btn' + (n === cur ? ' is-active' : '') + extra + '"' + (n === cur ? ' aria-current="page"' : '') + ' aria-label="' + n + ' 페이지">' + n + '</button>';
const arrow = (dir, disabled, extra = '') =>
  '<button type="button" class="ui-pagination__btn ui-pagination__btn--nav' + extra + '" aria-label="' + (dir === 'prev' ? '이전 페이지' : '다음 페이지') + '"' + (disabled ? ' disabled' : '') + '>' + (dir === 'prev' ? PREV : NEXT) + '</button>';
const ELLIPSIS = '<span class="ui-pagination__ellipsis" aria-hidden="true">…</span>';
const pager = (total, cur, label = '페이지 이동') =>   // label — 한 예시에 여러 개면 이름을 따로(landmark-unique)
  '<nav class="ui-pagination" aria-label="' + label + '">' + arrow('prev', cur === 1) +
  pages(total, cur).map((n) => (n === '…' ? ELLIPSIS : num(n, cur))).join('') +
  arrow('next', cur === total) + '</nav>';

export default {
  title: 'Navigation/Pagination',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Pagination.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 기본 = { render: () => pager(5, 1) };
export const 줄임표 = { parameters: { docs: { source: { code: pager(24, 12) } } }, render: () => '<div style="display:flex;flex-direction:column;gap:12px;align-items:center">' + pager(24, 3, '페이지 이동 — 앞쪽 예시') + pager(24, 12, '페이지 이동 — 가운데 예시') + pager(24, 22, '페이지 이동 — 뒤쪽 예시') + '</div>' };
// 놓는 자리 — 검색 화면과 같은 구조(.searchLayout .table_list › .list + .ui-pagination). 간격은 CSS 그대로(목록과 8 · 아래 16)
// 바깥 회색 틀 = 화면 영역(문서 미리보기 전용), 틀의 아래 선 = 화면 바닥
const LIST_BOX = '<div class="list" style="min-height:96px;display:flex;align-items:center;justify-content:center;color:var(--color-text-muted);font-size:var(--body-sm)">목록(그리드)</div>';
const screen = (nav, h = '') => '<div style="width:100%;' + h + 'display:flex;flex-direction:column;justify-content:flex-end;padding:16px 16px 0;box-sizing:border-box;background:var(--color-bg-subtle);border:1px solid var(--color-border-base);border-radius:var(--radius-panel)">' +
  '<div class="searchLayout" style="flex:none"><div class="table_list">' + LIST_BOX + nav + '</div></div></div>';
export const 목록_아래 = {
  parameters: { docs: { source: { code: '<div class="searchLayout">\n  <div class="table_list">\n    <div class="list">…</div>\n    ' + pager(7, 1) + '\n  </div>\n</div>' } } },
  render: () => '<div style="max-width:560px">' + screen(pager(7, 1)) + '</div>',
};

// ── 전체 상태 ── (Hovered · Pressed · Focused = 문서용 정지 화면, _pseudo.js)
export const 전체_상태 = {
  parameters: {
    controls: { disable: true },
    docs: { source: { language: 'html', code: [
      '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
      '<!-- 현재 페이지 = .is-active + aria-current="page" · 비활성 화살표 = disabled -->',
      num(3, 3), arrow('prev', true), ELLIPSIS,
    ].join('\n') } },
  },
  render: () => {
    enablePseudo();
    const PS = ['', ' ps-hover', ' ps-active', ' ps-focus-visible'];
    return matrix(['번호', '현재 페이지', '화살표', '비활성 화살표'], [
      ['Default', [num(2, 1), num(1, 1), arrow('next', false), arrow('prev', true)]],
      ['Hovered', [num(2, 1, PS[1]), num(1, 1, PS[1]), arrow('next', false, PS[1]), arrow('prev', true, PS[1])]],
      ['Focused', [num(2, 1, PS[3]), num(1, 1, PS[3]), arrow('next', false, PS[3]), '—']],
    ]) + '<p class="sb-note" style="margin:8px 0 0">비활성 화살표(첫 페이지의 이전 · 마지막 페이지의 다음)는 누를 수 없어 포커스가 가지 않습니다. 줄임표는 버튼이 아니라 글자입니다.</p>';
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    total: { control: { type: 'range', min: 1, max: 40, step: 1 }, description: '전체 페이지 수 — 7페이지가 넘으면 줄임표' },
    current: { control: { type: 'range', min: 1, max: 40, step: 1 }, description: '현재 페이지 — `.is-active` + `aria-current="page"`' },
  },
  args: { total: 12, current: 5 },
  render: (a) => pager(a.total, Math.min(a.current, a.total)),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 21번 ①) — 미리보기만, 코드는 위 예시 카드에. 페이지 이동이 여럿이라 이름을 따로(landmark-unique) ──
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: TD-108 21번 ① (Carbon Pagination) · 위 「놓는 자리」 — 검색 화면 CSS(.searchLayout .table_list > .ui-pagination) 아래 16
    { title: '목록 아래 가운데, 아래 여백 확보',
      do: [screen(pager(5, 1, '페이지 이동 — 지침 예시 1'), 'height:200px;'), '목록 바로 아래 가운데에 두고 화면 아래와 16을 띄웁니다.'],
      dont: [screen(pager(5, 1, '페이지 이동 — 지침 예시 2').replace('class="ui-pagination"', 'class="ui-pagination" style="margin-bottom:0"'), 'height:200px;'), '페이지 번호를 화면 바닥에 붙여 두지 않습니다.'] },
  ]),
};
