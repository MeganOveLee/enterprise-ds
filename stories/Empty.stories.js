// Feedback/Empty — 문서 화면은 Empty.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · Playground
// 일러스트 = 그림 자산(DS-ADR-037): 마크업에 솔리드 · 라인을 함께 두고, 브랜드 파일 토큰(--art-solid · --art-line)이 하나만 보이게 함
import { emptyArt, emptyIllo, emptyLine } from './_illustrations.js';
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

const btn = (t, k = 'secondary', s = 'outlined') => `<button type="button" class="btn btn--${k} btn--${s}">${t}</button>`;
// type = 'empty'(데이터 없음) · 'search'(검색 결과 없음) · 'network'(네트워크 오류) · 'error'(서버 오류)
const empty = ({ type, title, desc, actions = '', code = '', mod = '' }) =>
  `<div class="empty${mod ? ' ' + mod : ''}" role="status">
    ${emptyArt(type)}
    <p class="empty__title">${title}</p>
    ${desc ? `<p class="empty__desc">${desc}</p>` : ''}
    ${code ? `<p class="empty__code">오류 코드 ${code}</p>` : ''}
    ${actions ? `<div class="empty__actions">${actions}</div>` : ''}
  </div>`;
const frame = (inner, w = '520px') => `<div style="max-width:${w};border:1px solid var(--color-border-base);border-radius:var(--radius-card)">${inner}</div>`;

export default {
  title: 'Feedback/Empty',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Empty.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

export const 아직_없음 = { render: () => frame(empty({ type: 'empty', title: '등록된 설계 변경 요청이 없습니다', desc: '새 요청을 등록하면 이 목록에 표시됩니다.', actions: btn('요청 등록', 'primary', 'filled') })) };
export const 검색_결과_없음 = { render: () => frame(empty({ type: 'search', title: '조건에 맞는 문서가 없습니다', desc: '기간을 넓히거나 구분을 \'전체\'로 바꿔 주십시오.', actions: btn('검색 조건 초기화', 'secondary', 'transparent') })) };
export const 네트워크_오류 = { render: () => frame(empty({ mod: 'empty--error', type: 'network', title: '네트워크에 연결되지 않았습니다', desc: '연결을 확인한 뒤 다시 시도해 주십시오.', actions: btn('다시 시도') })) };
export const 서버_오류 = { render: () => frame(empty({ mod: 'empty--error', type: 'error', title: '목록을 불러오지 못했습니다', desc: '잠시 후 다시 시도해 주십시오. 계속되면 관리자에게 오류 코드를 알려 주십시오.', code: 'E-5021', actions: btn('다시 시도') + '<a href="#" class="text-link no-arrow">관리자에게 문의</a>' })) };
export const 페이지 = { render: () => `<div style="max-width:720px;height:420px;overflow:hidden;border:1px solid var(--color-border-base);border-radius:var(--radius-card);display:flex;flex-direction:column">${empty({ mod: 'empty--page', type: 'empty', title: '참여 중인 프로젝트가 없습니다', desc: '프로젝트에 배정되면 이 화면에 표시됩니다.' }).replace('class="empty empty--page"', 'class="empty empty--page" style="min-height:100%;flex:1"')}</div>` };
export const 카드_안 = { render: () => frame(empty({ mod: 'empty--card', type: 'empty', title: '결재할 문서가 없습니다', desc: '새로 상신된 문서가 이 목록에 표시됩니다.' }), '280px') };

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 13번 ① ②) ── 미리보기만, 코드는 위 예시 카드에. 일러스트는 브랜드를 따름
const ddFrame = (inner, w = '') => `<div style="${w ? 'width:' + w : 'flex:1;min-width:0'};border:1px solid var(--color-border-base);border-radius:var(--radius-card)">${inner}</div>`;
// 카드 안 — 카드 제목 + 빈 상태. Don't 는 페이지용(.empty--page) 큰 일러스트
const ddCard = (inner) => `<div style="width:240px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden"><p style="margin:0;padding:12px 16px;border-bottom:1px solid var(--color-border-subtle);font-size:var(--body-md);font-weight:var(--font-weight-semibold);color:var(--color-text-base)">결재할 문서</p>${inner}</div>`;
// 검색 조건 줄 — Do · Don't 그림 위에 「검색한 뒤」라는 맥락을 보임
const searchCtx = '<p style="margin:0 0 8px;padding:6px 10px;border-radius:var(--radius-sm);background:var(--color-bg-muted);font-size:var(--body-sm);color:var(--color-text-muted)">검색 조건 — 작업현황 <b style="color:var(--color-text-base)">반려</b> · 등록일 <b style="color:var(--color-text-base)">2026-09-01 ~ 2026-09-30</b></p>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // ① 아직 없음에는 다음 동작 — 사용자가 만들 수 있는 것이 비었으면 [등록] (TD-121: 예전 Don't는 「검색 결과 없음」 자리에 아직 없음 문구를 둔 것이었는데 검색 맥락이 그림에 없어 맞는 예처럼 보였음)
    { title: '아직 없음에는 다음 동작을',
      do: [ddFrame(empty({ type: 'empty', title: '등록된 문서가 없습니다', desc: '새 문서를 등록하면 이 목록에 표시됩니다.', actions: btn('문서 등록', 'primary', 'filled') })),
        '사용자가 만들 수 있는 것이 비어 있으면 [등록]을 둡니다.'],
      dont: [ddFrame(empty({ type: 'empty', title: '데이터가 없습니다' })),
        '이유와 다음 동작이 없으면 기다려야 하는지 직접 만들어야 하는지 알 수 없습니다.'] },
    // ①-2 검색한 뒤 비었으면 검색 결과 없음 — 조건을 넓히는 안내 + [검색 조건 초기화]. 그림 위 줄 = 검색 조건(맥락)
    { title: '검색한 뒤에는 검색 결과 없음',
      do: [ddFrame(searchCtx + empty({ type: 'search', title: '조건에 맞는 문서가 없습니다', desc: '기간을 넓히거나 작업현황을 \'전체\'로 바꿔 주십시오.', actions: btn('검색 조건 초기화', 'secondary', 'transparent') })),
        '검색 결과가 비면 조건을 넓히도록 안내하고 [검색 조건 초기화]를 둡니다.'],
      dont: [ddFrame(searchCtx + empty({ type: 'empty', title: '등록된 문서가 없습니다', desc: '새 문서를 등록하면 이 목록에 표시됩니다.', actions: btn('문서 등록', 'primary', 'filled') })),
        '검색 결과 자리에 아직 없음 문구 · [등록]을 두면 조건 때문에 비었는지, 정말 없는지 알 수 없습니다.'] },
    // ② 배치에 맞는 크기 — 영역 · 표 안 = 기본, 카드 안 = .empty--card, 페이지 = .empty--page
    { title: '배치에 맞는 크기',
      do: [ddCard(empty({ mod: 'empty--card', type: 'empty', title: '결재할 문서가 없습니다', desc: '새로 상신된 문서가 이 목록에 표시됩니다.' })),
        '카드 안은 .empty--card로 일러스트를 작게 둡니다. 영역 · 표 안은 기본, 페이지 전체는 .empty--page입니다.'],
      dont: [ddCard(empty({ mod: 'empty--page', type: 'empty', title: '결재할 문서가 없습니다', desc: '새로 상신된 문서가 이 목록에 표시됩니다.' }).replace('class="empty empty--page"', 'class="empty empty--page" style="min-height:0"')),
        '카드 안에 페이지용 큰 일러스트를 두면 카드 내용보다 그림이 커집니다.'] },
  ]),
};

// ── 전체 상태 — 두 모양 · 배치별 크기. 감싸는 .ds-art 없이 그려 브랜드와 상관없이 둘 다 보임 ──
const TYPES = [['empty', '데이터 없음', ''], ['search', '검색 결과 없음', ''], ['network', '네트워크 오류', 'empty--error'], ['error', '서버 오류', 'empty--error']];
const cell = (mod, art, style = '') => `<div class="empty${mod ? ' ' + mod : ''}" style="padding:0;min-height:0${style}"><span class="empty__icon">${art}</span></div>`;
export const 두_모양 = {
  parameters: { controls: { disable: true }, docs: { source: { code: '<!-- 마크업은 늘 두 모양을 함께 둠 — 브랜드 파일이 하나만 보이게 함 -->\n<span class="empty__icon ds-art">\n  <svg class="ds-art__solid empty-illo" …>…</svg>   <!-- 솔리드: 폴더 + 유형 배지 -->\n  <svg class="ds-art__line" …>…</svg>              <!-- 라인: 선 픽토그램 -->\n</span>' } } },
  render: () => matrix(TYPES.map(([, label]) => label), [
    ['솔리드<span class="sb-note" style="display:block">Default</span>', TYPES.map(([k, , mod]) => cell(mod, emptyIllo(k)))],
    ['라인<span class="sb-note" style="display:block">Fashion · Precision</span>', TYPES.map(([k, , mod]) => cell(mod, emptyLine(k)))],
  ]),
};
// 배치별 크기 — 실제 배치 클래스 그대로(표 아래 = 숨긴 표 바로 뒤 .empty)
const PLACES = [['영역', '', '', '104 · 48'], ['표 아래', '', 'table', '56 · 48'], ['카드 안', 'empty--card', '', '40 · 32'], ['페이지', 'empty--page', '', '128 · 48']];
const placed = ([, mod, tbl], art) => (tbl ? '<table class="grid-table" hidden></table>' : '') + cell(mod, art);
export const 배치별_크기 = {
  parameters: { controls: { disable: true }, docs: { source: { code: '/* 크기는 배치가 정함 (components.css) — 솔리드 폭 · 라인 크기 */\n.empty                { --empty-solid-size: 104px; --empty-line-size: 48px; }\n.grid-table + .empty  { --empty-solid-size: 56px;  --empty-badge-scale: 1.25; }   /* 표 아래 */\n.empty--card          { --empty-solid-size: 40px;  --empty-line-size: 32px; --empty-badge-scale: 1.5; }\n.empty--page          { --empty-solid-size: 128px; }', language: 'css' } } },
  render: () => matrix(PLACES.map(([label, , , px]) => label + '<span class="sb-note" style="display:block;font-weight:400">' + px + '</span>'), [
    ['솔리드', PLACES.map((p) => placed(p, emptyIllo('search')))],
    ['라인', PLACES.map((p) => placed(p, emptyLine('search')))],
  ]),
};

// ── Playground ──
const PG = {
  '데이터 없음': ['empty', '', '등록된 설계 변경 요청이 없습니다', '새 요청을 등록하면 이 목록에 표시됩니다.', '', btn('요청 등록', 'primary', 'filled')],
  '검색 결과 없음': ['search', '', '조건에 맞는 문서가 없습니다', '기간을 넓히거나 구분을 \'전체\'로 바꿔 주십시오.', '', btn('검색 조건 초기화', 'secondary', 'transparent')],
  '네트워크 오류': ['network', 'empty--error', '네트워크에 연결되지 않았습니다', '연결을 확인한 뒤 다시 시도해 주십시오.', '', btn('다시 시도')],
  '서버 오류': ['error', 'empty--error', '목록을 불러오지 못했습니다', '잠시 후 다시 시도해 주십시오.', 'E-5021', btn('다시 시도') + '<a href="#" class="text-link no-arrow">관리자에게 문의</a>'],
};
export const Playground = {
  argTypes: {
    reason: { control: 'inline-radio', options: Object.keys(PG), description: '유형 — 일러스트 · 액션이 따라 바뀜' },
    place: { control: 'inline-radio', options: ['영역', '카드 안', '페이지'], description: '배치 — 기본(영역 · 표 아래) · `.empty--card` · `.empty--page`' },
    title: { control: 'text', description: '제목 (비우면 유형의 기본 문구)' },
  },
  args: { reason: '데이터 없음', place: '영역', title: '' },
  render: (a) => {
    const [type, mod, t, desc, code, actions] = PG[a.reason];
    const place = { '영역': '', '카드 안': 'empty--card', '페이지': 'empty--page' }[a.place];
    const card = place === 'empty--card';
    return frame(empty({ type, title: a.title || t, desc, code, actions: card ? '' : actions,
      mod: [mod, place].filter(Boolean).join(' ') }), card ? '280px' : '520px');
  },
};
