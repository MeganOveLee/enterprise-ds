// Blocks/BOM Compare — 문서 화면은 BomCompare.mdx. 두 BOM을 나란히 놓고 같은 품목끼리 줄을 맞춰 차이를 보이는 화면
// 근거 = 이전 버전 jsp/part/compareBom.jsp(= bom/compareBom.jsp) — 부품 관리 메뉴 › BOM 조회 › BOM 비교로 여는 본문 화면(새 창 아님)
//   열마다 조건(BOM 유형 · 품목 번호 + 버전 · Baseline) + 표, 왼쪽 열에 비교 옵션(단일 · 멀티 레벨), 오른쪽 열에 조회 옵션(Identical · Unassigned · Similar)
//   두 표는 같은 줄 = 같은 품목(한쪽에 없으면 빈 줄), 세로 스크롤을 서로 맞춤. 표 안 찾기(품목 번호) · 필터 초기화
// 이전 버전과 다르게 한 것 — 범례 색과 줄 색을 같은 토큰으로(이전: 범례 Unassigned 노랑 · 줄 빨강), 색만으로 알리지 않게 「비교」 칸에 글자,
//   열 머리 [검색]은 [찾기] secondary로(화면의 primary는 위 [검색] 하나), 범례 · 옵션 이름은 우리말(이전 이름은 구성 표에)
// 배치 클래스 .ui-compare · .ui-field-addon · .compare-legend 는 components.css 「Blocks」(이전 버전과 같은 이름)
import { flow, shot, MARK } from './_flow.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  reset: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  tree: '<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="10" width="7" height="5" rx="1"/><rect x="14" y="17" width="7" height="4" rx="1"/><path d="M6.5 8v10.5H14M6.5 12.5H14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};
const btn = (t, cls, icon = '') => '<button type="button" class="btn ' + cls + '">' + (icon ? svg(icon, 14) : '') + t + '</button>';
const field = (label, control, span = 0, id = '') =>
  '<div class="ff-field' + (span ? ' span-' + span : '') + '">' + (id ? '<label class="search-label" for="' + id + '">' + label + '</label>' : '<span class="search-label">' + label + '</span>') +
  '<div class="td">' + control + '</div></div>';
const radios = (name, label, opts, pick = 0) => '<div class="radio-group" role="radiogroup" aria-label="' + label + '">' +
  opts.map((o, i) => '<label class="radio"><input type="radio" name="' + name + '"' + (i === pick ? ' checked' : '') + '><span class="radio__mark"></span>' + o + '</label>').join('') + '</div>';
const checks = (label, opts, on) => '<div class="radio-group" role="group" aria-label="' + label + '">' +
  opts.map((o, i) => '<label class="checkbox"><input type="checkbox"' + (on[i] ? ' checked' : '') + '>' + o + '</label>').join('') + '</div>';

// ── 비교 결과 — 세 가지. 범례 · 조회 옵션 · 「비교」 칸이 같은 이름 ──
const STATE = { identical: ['같음', ''], similar: ['수량 다름', 'similar'], unassigned: ['한쪽에만 있음', 'unassigned'] };
const NAMES = ['같음', '수량 다름', '한쪽에만 있음'];
const MEANS = ['품목 번호 · 버전 · 수량이 같음', '같은 품목 번호 · 버전, 수량이 다름', '다른 쪽에 같은 품목 번호 · 버전이 없음'];
// 범례 — 같음 · 다름(수량 다름 · 한쪽에만 있음). 다른 줄은 모두 같은 빨간 표시, 종류는 「비교」 칸 글자로
const legend = () => '<ul class="compare-legend" aria-label="비교 결과 범례">' +
  '<li title="' + MEANS[0] + '"><span class="compare-legend__swatch"></span>같음</li>' +
  '<li title="' + MEANS[1] + ' · ' + MEANS[2] + '"><span class="compare-legend__swatch compare-legend__swatch--diff"></span>다름(수량 다름 · 한쪽에만 있음)</li></ul>';

// 가상 데이터 — 기준 B.2 와 비교 대상 B.3. 줄 = 한 쌍(같은 품목), 한쪽에 없으면 null
const P = (no, name, ver, qty) => [no, name, ver, qty, 'EA'];
const PAIRS = [
  [P('BRK-20417-01', '캘리퍼 하우징', 'A.2', 1), P('BRK-20417-01', '캘리퍼 하우징', 'A.2', 1), 'identical'],
  [P('BRK-20417-02', '피스톤', 'A.1', 2), P('BRK-20417-02', '피스톤', 'A.1', 2), 'identical'],
  [P('BRK-20417-03', '피스톤 실', 'A.1', 2), P('BRK-20417-03', '피스톤 실', 'A.1', 4), 'similar'],
  [P('BRK-20417-04', '패드 스프링', 'A.3', 2), P('BRK-20417-04', '패드 스프링', 'A.3', 2), 'identical'],
  [P('BRK-20417-05', '블리더 스크루', 'A.1', 1), null, 'unassigned'],
  [P('BRK-20417-06', '가이드 핀', 'B.1', 2), P('BRK-20417-06', '가이드 핀', 'B.1', 2), 'identical'],
  [P('BRK-20417-07', '캘리퍼 볼트 M10', 'A.1', 4), P('BRK-20417-07', '캘리퍼 볼트 M10', 'A.1', 6), 'similar'],
  [null, P('BRK-20417-08', '더스트 부트', 'A.1', 2), 'unassigned'],
];
const COLS = '<colgroup><col style="width:40px"><col style="width:112px"><col><col style="width:48px"><col style="width:48px"><col style="width:48px"><col style="width:96px"></colgroup>';
const HEAD = '<thead><tr><th>No.</th><th>품목 번호</th><th>품목 명</th><th>버전</th><th>수량</th><th>단위</th><th>비교</th></tr></thead>';
const row = (r, state, i) => {
  const [name, k] = STATE[state];
  return '<tr' + (k ? ' class="compare-row--' + k + '"' : '') + '><td>' + (i + 1) + '</td>' +
    (r ? '<td><a href="#" class="grid-custom-rows-link">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td><td>' + r[2] + '</td><td' + (state === 'similar' ? ' class="compare-qty"' : '') + '>' + r[3] + '</td><td>' + r[4] + '</td>'
       : '<td></td><td></td><td></td><td></td><td></td>') +
    '<td class="compare-cell">' + name + '</td></tr>';
};
const table = (side, label, pairs) => '<div class="table_list"><div class="list"><table class="grid-table" aria-label="' + label + '">' + COLS + HEAD + '<tbody>' +
  pairs.map(([a, b, s], i) => row(side ? b : a, s, i)).join('') + '</tbody></table></div></div>';

// 열 하나 — 조건(.pro_table) + 머리줄(찾기 · 범례 또는 필터 초기화) + 표
let uid = 0;
const col = (side, { pairs, show }) => {
  const u = 'bc' + (++uid);
  const who = side ? '비교 BOM' : '기준 BOM';
  const conds = '<div class="pro_table"><div class="form-grid-2 form-grid--4">' +
    field('BOM 유형', radios(u + '-view', who + ' BOM 유형', ['E-BOM'])) +
    field('품목 번호', '<div class="ui-field-addon"><span class="ui-field-addon__main"><input class="input" id="' + u + '-no" value="BRK-20417 / 캘리퍼 어셈블리" placeholder="품목 번호 또는 이름 입력"></span>' +
      '<span class="ui-field-addon__addon"><select class="select" aria-label="' + who + ' 버전"><option' + (side ? '' : ' selected') + '>B.2</option><option' + (side ? ' selected' : '') + '>B.3</option></select></span></div>', 2, u + '-no') +
    field('Baseline', '<select class="select" id="' + u + '-base"><option>최신</option></select>', 0, u + '-base') +
    (side ? field('조회 옵션', checks('조회 옵션', NAMES, show), 2) : field('비교 옵션', radios(u + '-lv', '비교 옵션', ['단일 레벨', '멀티 레벨']), 2)) +
    '</div></div>';
  const head = '<div class="seach_arm" style="margin-top:0"><div class="leftbt">' + svg(I.tree) + '<h4>' + who + '</h4>' +
    '<div class="ui-compare__find"><input class="input" aria-label="' + who + '에서 품목 번호 찾기" placeholder="품목 번호">' + btn('찾기', 'btn--secondary btn--outlined') + '</div></div>' +
    '<div class="rightbt">' + (side ? btn('필터 초기화', 'btn--secondary btn--transparent', I.reset) : legend()) + '</div></div>';
  return '<div class="ui-compare__col">' + conds + head + table(side, who + ' 품목', pairs) + '</div>';
};

// 본문 화면 — 제목줄(검색 조건 · [검색]) + 좌우 두 열
const screen = ({ show = [true, true, true] } = {}) => {
  const keep = ['identical', 'similar', 'unassigned'].filter((k, i) => show[i]);
  const pairs = PAIRS.filter((p) => keep.includes(p[2]));
  return '<div class="product">' +
    '<div class="seach_arm"><div class="leftbt">' + svg(I.filter) + '<h4>검색 조건</h4></div><div class="rightbt">' + btn('검색', 'btn--primary btn--filled', I.search) + '</div></div>' +
    '<div class="ui-compare">' + col(0, { pairs, show }) + col(1, { pairs, show }) + '</div></div>';
};
const body = (inner) => '<div class="main-content"><div class="searchLayout">' + inner + '</div></div>';

// 기본 화면 — 부품 관리 메뉴 패널. 지금 화면 = 부품 검색, 누르는 곳 = BOM 조회 › BOM 비교
const menu = () =>
  '<aside class="main-sub" aria-label="부품 관리 메뉴"><div class="main-sub-header"><h3>부품 관리</h3>' +
  '<button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>' +
  '<div class="main-sub-content"><div class="ui-submenu"><ul>' +
  '<li class="ui-submenu-flat"><a href="#" aria-current="page">부품 검색</a></li><li class="ui-submenu-flat"><a href="#">부품 등록</a></li>' +
  '<li class="ui-submenu-group"><h4 class="ui-submenu-title"><a href="#">BOM 조회</a></h4><ul class="ui-submenu-list">' +
  '<li><a href="#">정전개</a></li><li><a href="#" class="' + MARK + '">BOM 비교</a></li></ul></li>' +
  '</ul></div></div></aside>';

const W = 1240, H = 600;
export default {
  title: 'Blocks/BOM Compare',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 BomCompare.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 두_BOM_비교 = {
  parameters: { docs: { source: { code: screen() } } },
  render: () => flow({
    base: { html: menu(), w: 280, h: 300, where: '부품 관리 메뉴 패널' },
    open: { html: body(screen()), w: W, h: H, title: '열리는 화면', where: 'BOM 비교 — 본문 영역' },
    trigger: '[BOM 비교]', how: '본문이 비교 화면으로 바뀝니다(새 창 아님)',
  }),
};
// 조회 옵션에서 「같음」을 끔 — 차이 줄만 남음
export const 차이만_보기 = {
  parameters: { docs: { source: { code: screen({ show: [false, true, true] }) } } },
  render: () => shot(body(screen({ show: [false, true, true] })), W, 470),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't) — 미리보기만. 작은 표 3줄 ──
const mini = (rows, { colorOnly = false, mismatch = false } = {}) => {
  const lg = '<div style="margin-bottom:8px">' + legend() + '</div>';
  const tr = ([no, q, s]) => {
    const k = STATE[s][1];
    const cls = mismatch && s === 'unassigned' ? 'compare-row--danger-demo' : k ? 'compare-row--' + k : '';
    return '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td>' + no + '</td><td>' + q + '</td>' + (colorOnly ? '' : '<td class="compare-cell">' + STATE[s][0] + '</td>') + '</tr>';
  };
  return '<div style="width:100%">' + lg + '<div class="table_list"><div class="list"><table class="grid-table"><thead><tr><th>품목 번호</th><th>수량</th>' + (colorOnly ? '' : '<th>비교</th>') + '</tr></thead><tbody>' +
    rows.map(tr).join('') + '</tbody></table></div></div></div>';
};
const MINI = [['BRK-20417-02', 2, 'identical'], ['BRK-20417-03', 2, 'similar'], ['BRK-20417-05', 1, 'unassigned']];
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = doDont([
      { title: '색만으로 알리지 않기',
        do: [mini(MINI), '다른 행은 빨간 바탕 · 테두리와 함께 「비교」 열에 결과를 글자로 둡니다. 흑백으로 인쇄해도 결과가 보입니다.'],
        dont: [mini(MINI, { colorOnly: true }), '줄 색만 있으면 색을 구분하기 어려운 사람과 흑백 인쇄에서 결과가 사라집니다.'] },
    ]);
    // Don't 견본 — 범례와 다른 색(빨강) 줄. 문서 견본 전용이라 DS 클래스가 아님
    el.querySelectorAll('tr.compare-row--danger-demo td').forEach((td) => { td.style.background = 'var(--color-bg-danger-subtle)'; });
    return el;
  },
};
