// Feedback/Empty — 문서 화면은 Empty.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · Playground
import { emptyIllo } from './_illustrations.js';

const I = {
  inbox: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>',
  search: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/></svg>',
  wifi: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 18a26 26 0 0 1 36 0M12 25a17 17 0 0 1 24 0M18 32a8 8 0 0 1 12 0"/><circle cx="24" cy="38" r="1.5" fill="currentColor"/><path d="m8 8 32 32"/></svg>',
  alert: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M24 6 44 40H4z"/><path d="M24 19v10" stroke-linecap="round"/><circle cx="24" cy="34" r="1.5" fill="currentColor"/></svg>',
};
// 픽토그램 → 일러스트 배지 종류 (빈 이유가 같으면 같은 그림)
const ILLO = { inbox: 'empty', search: 'search', wifi: 'network', alert: 'error' };
// 브랜드 선택은 제품 설정 — Default = 일러스트, Fashion · Precision = 선 픽토그램
const useIllo = (globals) => (globals.brand || 'default') === 'default';   // 일러스트 = 기본 브랜드 설정 (DS-ADR-018). 다른 브랜드는 픽토그램

const btn = (t, k = 'secondary', s = 'outlined') => `<button type="button" class="btn btn--${k} btn--${s}">${t}</button>`;
const empty = ({ icon, title, desc, actions = '', code = '', mod = '', illo = false }) =>
  `<div class="empty${mod ? ' ' + mod : ''}" role="status">
    ${illo ? `<span class="empty__icon empty__icon--illo">${emptyIllo(ILLO[icon])}</span>` : `<span class="empty__icon">${I[icon]}</span>`}
    <p class="empty__title">${title}</p>
    <p class="empty__desc">${desc}</p>
    ${code ? `<p class="empty__code">오류 코드 ${code}</p>` : ''}
    ${actions ? `<div class="empty__actions">${actions}</div>` : ''}
  </div>`;
const frame = (inner, w = '520px') => `<div style="max-width:${w};border:1px solid var(--color-border-base);border-radius:var(--radius-card)">${inner}</div>`;

export default {
  title: 'Feedback/Empty',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Empty.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

export const 아직_없음 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), icon: 'inbox', title: '등록된 설계 변경 요청이 없어요', desc: '새 요청을 등록하면 이 목록에 쌓여요.', actions: btn('요청 등록', 'primary', 'filled') })) };
export const 검색_결과_없음 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), icon: 'search', title: '조건에 맞는 문서가 없어요', desc: '기간을 넓히거나 구분을 \'전체\'로 바꿔 보세요.', actions: btn('조건 초기화') })) };
export const 네트워크_오류 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), mod: 'empty--error', icon: 'wifi', title: '네트워크에 연결되지 않았어요', desc: '연결을 확인한 뒤 다시 시도해 주세요.', actions: btn('다시 시도') })) };
export const 서버_오류 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), mod: 'empty--error', icon: 'alert', title: '목록을 불러오지 못했어요', desc: '잠시 후 다시 시도해 주세요. 계속되면 관리자에게 오류 코드를 알려 주세요.', code: 'E-5021', actions: btn('다시 시도') + btn('문의하기', 'secondary', 'transparent') })) };
export const 카드_안 = { render: () => frame(empty({ mod: 'empty--card', icon: 'inbox', title: '결재할 문서가 없어요', desc: '새로 상신된 문서가 오면 알려 드려요.' }), '280px') };

const REASONS = [['inbox', '아직 없음', ''], ['search', '검색 결과 없음', ''], ['wifi', '네트워크 오류', 'empty--error'], ['alert', '서버 오류', 'empty--error']];
const cellStyle = 'display:flex;flex-direction:column;align-items:center;gap:8px;font-size:var(--body-sm);color:var(--color-text-muted)';
export const 그림_두_가지 = {
  parameters: { docs: { description: { story: '같은 빈 이유를 두 그림으로 — 위 = 일러스트(Default), 아래 = 선 픽토그램(Fashion · Precision · 카드 안). 도구 막대와 상관없이 둘 다 보여요.' } } },
  render: () => `<div class="sb-table-wrap" style="display:grid;grid-template-columns:repeat(4,auto);gap:24px 40px;justify-content:start;align-items:end">
    ${REASONS.map(([k, label, mod]) => `<div class="${mod}" style="${cellStyle}"><span class="empty__icon empty__icon--illo" style="margin:0">${emptyIllo(ILLO[k])}</span>${label}</div>`).join('')}
    ${REASONS.map(([k, label, mod]) => `<div class="${mod}" style="${cellStyle}"><span class="empty__icon" style="margin:0">${I[k]}</span>${label}</div>`).join('')}
  </div>`,
};

// ── Playground ──
const PG = {
  '아직 없음': ['inbox', '', '등록된 설계 변경 요청이 없어요', '새 요청을 등록하면 이 목록에 쌓여요.', '', btn('요청 등록', 'primary', 'filled')],
  '검색 결과 없음': ['search', '', '조건에 맞는 문서가 없어요', '기간을 넓히거나 구분을 \'전체\'로 바꿔 보세요.', '', btn('조건 초기화')],
  '네트워크 오류': ['wifi', 'empty--error', '네트워크에 연결되지 않았어요', '연결을 확인한 뒤 다시 시도해 주세요.', '', btn('다시 시도')],
  '서버 오류': ['alert', 'empty--error', '목록을 불러오지 못했어요', '잠시 후 다시 시도해 주세요.', 'E-5021', btn('다시 시도') + btn('문의하기', 'secondary', 'transparent')],
};
export const Playground = {
  argTypes: {
    reason: { control: 'inline-radio', options: Object.keys(PG), description: '빈 이유 — 그림 · 액션이 따라 바뀜' },
    place: { control: 'inline-radio', options: ['영역', '카드 안', '페이지'], description: '놓이는 자리 — 기본 · `.empty--card` · `.empty--page`' },
    title: { control: 'text', description: '제목 (비우면 빈 이유의 기본 문구)' },
  },
  args: { reason: '아직 없음', place: '영역', title: '' },
  render: (a, { globals }) => {
    const [icon, mod, t, desc, code, actions] = PG[a.reason];
    const place = { '영역': '', '카드 안': 'empty--card', '페이지': 'empty--page' }[a.place];
    const card = place === 'empty--card';
    return frame(empty({ illo: !card && useIllo(globals), icon, title: a.title || t, desc, code, actions: card ? '' : actions,
      mod: [mod, place].filter(Boolean).join(' ') }), card ? '280px' : '520px');
  },
};
