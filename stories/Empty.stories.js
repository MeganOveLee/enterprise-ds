import { emptyIllo } from './_illustrations.js';

const I = {
  inbox: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>',
  search: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/></svg>',
  wifi: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 18a26 26 0 0 1 36 0M12 25a17 17 0 0 1 24 0M18 32a8 8 0 0 1 12 0"/><circle cx="24" cy="38" r="1.5" fill="currentColor"/><path d="m8 8 32 32"/></svg>',
  alert: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M24 6 44 40H4z"/><path d="M24 19v10" stroke-linecap="round"/><circle cx="24" cy="34" r="1.5" fill="currentColor"/></svg>',
};
// 픽토그램 → 일러스트 배지 종류 (빈 이유가 같으면 같은 그림)
const ILLO = { inbox: 'empty', search: 'search', wifi: 'network', alert: 'error' };
// 브랜드 선택은 제품 설정 — E3PS = 일러스트, 이퍼플(공개 시연) = 선 픽토그램
const useIllo = (globals) => globals.brand !== 'sample';

const btn = (t, k = 'secondary', s = 'outlined') => `<button type="button" class="btn btn--${k} btn--${s}">${t}</button>`;
const empty = ({ icon, title, desc, actions = '', code = '', mod = '', illo = false }) =>
  `<div class="empty${mod ? ' ' + mod : ''}" role="status">
    ${illo ? `<span class="empty__icon empty__icon--illo">${emptyIllo(ILLO[icon])}</span>` : `<span class="empty__icon">${I[icon]}</span>`}
    <p class="empty__title">${title}</p>
    <p class="empty__desc">${desc}</p>
    ${code ? `<p class="empty__code">오류 코드 ${code}</p>` : ''}
    ${actions ? `<div class="empty__actions">${actions}</div>` : ''}
  </div>`;
const frame = (inner, w = '520px') => `<div style="max-width:${w};border:1px solid var(--color-border-base);border-radius:var(--radius-lg)">${inner}</div>`;

export default {
  title: 'Feedback/Empty',
  tags: ['!dev'],   // 개별 예시는 메뉴에서 숨기고 Docs 페이지 안 섹션으로만 (MDX 문서는 그대로 보이게 파일마다 지정)
  parameters: {
    docs: { description: { component:
      '빈 상태 = 그림 + 제목 + 설명 + 주 액션 1개. **빈 이유가 액션을 정해요** — 아직 없으면 만들기, 검색 결과가 없으면 조건 바꾸기, ' +
      '네트워크 오류는 다시 시도, 서버 오류는 다시 시도 + 문의 + 오류 코드(서버 원문은 보이지 않음). ' +
      '놓이는 자리: 기본(영역) · `.empty--card`(카드 안) · `.empty--page`(페이지 전체). ' +
      '**그림은 브랜드(제품) 설정** — E3PS는 폴더 일러스트에 빈 이유 배지(`.empty__icon--illo`), 이퍼플은 선 픽토그램. 카드 안은 둘 다 픽토그램. 위쪽 도구 막대 「브랜드」로 바꿔 보세요.' } },
  },
};

export const 아직_없음 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), icon: 'inbox', title: '등록된 설계 변경 요청이 없어요', desc: '새 요청을 등록하면 이 목록에 쌓여요.', actions: btn('요청 등록', 'primary', 'filled') })) };
export const 검색_결과_없음 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), icon: 'search', title: '조건에 맞는 문서가 없어요', desc: '기간을 넓히거나 구분을 \'전체\'로 바꿔 보세요.', actions: btn('조건 초기화') })) };
export const 네트워크_오류 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), mod: 'empty--error', icon: 'wifi', title: '네트워크에 연결되지 않았어요', desc: '연결을 확인한 뒤 다시 시도해 주세요.', actions: btn('다시 시도') })) };
export const 서버_오류 = { render: (_, { globals }) => frame(empty({ illo: useIllo(globals), mod: 'empty--error', icon: 'alert', title: '목록을 불러오지 못했어요', desc: '잠시 후 다시 시도해 주세요. 계속되면 관리자에게 오류 코드를 알려 주세요.', code: 'E-5021', actions: btn('다시 시도') + btn('문의하기', 'secondary', 'transparent') })) };
export const 카드_안 = { render: () => frame(empty({ mod: 'empty--card', icon: 'inbox', title: '결재할 문서가 없어요', desc: '새로 상신된 문서가 오면 알려 드려요.' }), '280px') };

const REASONS = [['inbox', '아직 없음', ''], ['search', '검색 결과 없음', ''], ['wifi', '네트워크 오류', 'empty--error'], ['alert', '서버 오류', 'empty--error']];
const cellStyle = 'display:flex;flex-direction:column;align-items:center;gap:8px;font-size:var(--body-sm);color:var(--color-text-muted)';
export const 그림_두_가지 = {
  parameters: { docs: { description: { story: '같은 네 가지 빈 이유를 두 그림으로 — 위 = 일러스트(E3PS), 아래 = 선 픽토그램(이퍼플 · 카드 안). 도구 막대와 상관없이 둘 다 보여요.' } } },
  render: () => `<div class="sb-table-wrap" style="display:grid;grid-template-columns:repeat(4,auto);gap:24px 40px;justify-content:start;align-items:end">
    ${REASONS.map(([k, label, mod]) => `<div class="${mod}" style="${cellStyle}"><span class="empty__icon empty__icon--illo" style="margin:0">${emptyIllo(ILLO[k])}</span>${label}</div>`).join('')}
    ${REASONS.map(([k, label, mod]) => `<div class="${mod}" style="${cellStyle}"><span class="empty__icon" style="margin:0">${I[k]}</span>${label}</div>`).join('')}
  </div>`,
};
