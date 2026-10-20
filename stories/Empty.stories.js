// Feedback/Empty — 문서 화면은 Empty.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · Playground
import { emptyIllo } from './_illustrations.js';
import { doDont } from './_dodont.js';

const I = {
  inbox: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>',
  search: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/></svg>',
  wifi: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 18a26 26 0 0 1 36 0M12 25a17 17 0 0 1 24 0M18 32a8 8 0 0 1 12 0"/><circle cx="24" cy="38" r="1.5" fill="currentColor"/><path d="m8 8 32 32"/></svg>',
  alert: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M24 6 44 40H4z"/><path d="M24 19v10" stroke-linecap="round"/><circle cx="24" cy="34" r="1.5" fill="currentColor"/></svg>',
};
// 픽토그램 → 일러스트 배지 종류 (유형이 같으면 같은 그림)
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

export const 아직_없음 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), icon: 'inbox', title: '등록된 설계 변경 요청이 없습니다', desc: '새 요청을 등록하면 이 목록에 표시됩니다.', actions: btn('요청 등록', 'primary', 'filled') })) };
export const 검색_결과_없음 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), icon: 'search', title: '조건에 맞는 문서가 없습니다', desc: '기간을 넓히거나 구분을 \'전체\'로 바꿔 주십시오.', actions: btn('검색 조건 초기화', 'secondary', 'transparent') })) };
export const 네트워크_오류 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), mod: 'empty--error', icon: 'wifi', title: '네트워크에 연결되지 않았습니다', desc: '연결을 확인한 뒤 다시 시도해 주십시오.', actions: btn('다시 시도') })) };
export const 서버_오류 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), mod: 'empty--error', icon: 'alert', title: '목록을 불러오지 못했습니다', desc: '잠시 후 다시 시도해 주십시오. 계속되면 관리자에게 오류 코드를 알려 주십시오.', code: 'E-5021', actions: btn('다시 시도') + '<a href="#" class="text-link no-arrow">관리자에게 문의</a>' })) };
export const 페이지 = { render: (_, { globals }) => `<div style="max-width:720px;height:420px;overflow:hidden;border:1px solid var(--color-border-base);border-radius:var(--radius-card);display:flex;flex-direction:column">${empty({ illo: useIllo(globals), mod: 'empty--page', icon: 'inbox', title: '참여 중인 프로젝트가 없습니다', desc: '프로젝트에 배정되면 이 화면에 표시됩니다.' }).replace('class="empty empty--page"', 'class="empty empty--page" style="min-height:100%;flex:1"')}</div>` };
export const 카드_안 = { render: () => frame(empty({ mod: 'empty--card', icon: 'inbox', title: '결재할 문서가 없습니다', desc: '새로 상신된 문서가 이 목록에 표시됩니다.' }), '280px') };

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 13번 ① ②) ── 미리보기만, 코드는 위 예시 카드에
const ddFrame = (inner, w = '') => `<div style="${w ? 'width:' + w : 'flex:1;min-width:0'};border:1px solid var(--color-border-base);border-radius:var(--radius-card)">${inner}</div>`;
// 카드 안 — 카드 제목 + 빈 상태. Don't 는 페이지용 큰 일러스트(브랜드와 상관없이 일러스트로 그림)
const ddCard = (inner) => `<div style="width:240px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden"><p style="margin:0;padding:12px 16px;border-bottom:1px solid var(--color-border-subtle);font-size:var(--body-md);font-weight:var(--font-weight-semibold);color:var(--color-text-base)">결재할 문서</p>${inner}</div>`;
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: (_, { globals }) => doDont([
    // ① 유형이 다음 동작을 정함 — 검색 결과 없음 = [검색 조건 초기화], 데이터 없음 = [등록]
    { title: '유형에 맞는 문구 · 버튼',
      do: [ddFrame(empty({ illo: useIllo(globals), icon: 'search', title: '조건에 맞는 문서가 없습니다', desc: '기간을 넓히거나 구분을 \'전체\'로 바꿔 주십시오.', actions: btn('검색 조건 초기화', 'secondary', 'transparent') })),
        '검색 결과 없음은 조건을 넓히도록 안내하고 [검색 조건 초기화]를 둡니다. 데이터 없음은 [등록]을 둡니다.'],
      dont: [ddFrame(empty({ illo: useIllo(globals), icon: 'inbox', title: '등록된 문서가 없습니다', desc: '새 문서를 등록하면 이 목록에 표시됩니다.', actions: btn('문서 등록', 'primary', 'filled') })),
        '검색 결과 없음에 데이터 없음과 같은 문구 · 버튼을 두면 조건 때문에 비었는지 알 수 없습니다.'] },
    // ② 배치에 맞는 크기 — 표 안 = 기본, 카드 안 = .empty--card, 페이지 = .empty--page
    { title: '배치에 맞는 크기',
      do: [ddCard(empty({ mod: 'empty--card', icon: 'inbox', title: '결재할 문서가 없습니다', desc: '새로 상신된 문서가 이 목록에 표시됩니다.' })),
        '카드 안은 .empty--card로 픽토그램을 작게 둡니다. 표 안은 기본, 페이지 전체는 .empty--page입니다.'],
      dont: [ddCard(empty({ illo: true, mod: 'empty--page', icon: 'inbox', title: '결재할 문서가 없습니다', desc: '새로 상신된 문서가 이 목록에 표시됩니다.' }).replace('class="empty empty--page"', 'class="empty empty--page" style="min-height:0"')),
        '카드 안에 페이지용 큰 일러스트를 두면 카드 내용보다 그림이 커집니다.'] },
  ]),
};

const REASONS = [['inbox', '데이터 없음', ''], ['search', '검색 결과 없음', ''], ['wifi', '네트워크 오류', 'empty--error'], ['alert', '서버 오류', 'empty--error']];
const cellStyle = 'display:flex;flex-direction:column;align-items:center;gap:8px;font-size:var(--body-sm);color:var(--color-text-muted)';
export const 그림_두_가지 = {
  parameters: { docs: { description: { story: '유형마다 두 그림 — 위 = 일러스트(Default), 아래 = 선 픽토그램(Fashion · Precision · 카드 안). 도구 막대와 상관없이 둘 다 표시합니다.' } } },
  render: () => `<div class="sb-table-wrap" style="display:grid;grid-template-columns:repeat(4,auto);gap:24px 40px;justify-content:start;align-items:end">
    ${REASONS.map(([k, label, mod]) => `<div class="${mod}" style="${cellStyle}"><span class="empty__icon empty__icon--illo" style="margin:0">${emptyIllo(ILLO[k])}</span>${label}</div>`).join('')}
    ${REASONS.map(([k, label, mod]) => `<div class="${mod}" style="${cellStyle}"><span class="empty__icon" style="margin:0">${I[k]}</span>${label}</div>`).join('')}
  </div>`,
};

// ── Playground ──
const PG = {
  '데이터 없음': ['inbox', '', '등록된 설계 변경 요청이 없습니다', '새 요청을 등록하면 이 목록에 표시됩니다.', '', btn('요청 등록', 'primary', 'filled')],
  '검색 결과 없음': ['search', '', '조건에 맞는 문서가 없습니다', '기간을 넓히거나 구분을 \'전체\'로 바꿔 주십시오.', '', btn('검색 조건 초기화', 'secondary', 'transparent')],
  '네트워크 오류': ['wifi', 'empty--error', '네트워크에 연결되지 않았습니다', '연결을 확인한 뒤 다시 시도해 주십시오.', '', btn('다시 시도')],
  '서버 오류': ['alert', 'empty--error', '목록을 불러오지 못했습니다', '잠시 후 다시 시도해 주십시오.', 'E-5021', btn('다시 시도') + '<a href="#" class="text-link no-arrow">관리자에게 문의</a>'],
};
export const Playground = {
  argTypes: {
    reason: { control: 'inline-radio', options: Object.keys(PG), description: '유형 — 일러스트 · 액션이 따라 바뀜' },
    place: { control: 'inline-radio', options: ['영역', '카드 안', '페이지'], description: '배치 — 기본(그리드 · 패널 영역) · `.empty--card` · `.empty--page`' },
    title: { control: 'text', description: '제목 (비우면 유형의 기본 문구)' },
  },
  args: { reason: '데이터 없음', place: '영역', title: '' },
  render: (a, { globals }) => {
    const [icon, mod, t, desc, code, actions] = PG[a.reason];
    const place = { '영역': '', '카드 안': 'empty--card', '페이지': 'empty--page' }[a.place];
    const card = place === 'empty--card';
    return frame(empty({ illo: !card && useIllo(globals), icon, title: a.title || t, desc, code, actions: card ? '' : actions,
      mod: [mod, place].filter(Boolean).join(' ') }), card ? '280px' : '520px');
  },
};
