// Data Display/Table — 문서 화면은 Table.mdx. Figma 짝 = Table component · Header · Cell, DS 클래스 = .grid-table (바깥 컨테이너 .table_list › .list)
// 제품 목록 그리드는 상용 그리드 라이브러리가 그림 — .grid-table 은 같은 그리드 토큰으로 그리는 HTML 표(라이브러리 없이 쓰는 목록 · 문서 · 화면 예시)
// 값 = 헤더 행 34 · 행 30 · 글자 12 · 세로선 · 얼룩 행 · 가운데 정렬, 긴 글만 왼쪽 — components.css 주석
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const STATUS = { 작업: ['info', '작업 중'], 검토: ['warning', '검토 중'], 승인: ['success', '승인'] };
const ROWS = [
  ['DOC-2610-0013', '브레이크 캘리퍼 조립 사양서', 'B.2', '작업', '김도윤', '2026-10-13'],
  ['DOC-2610-0012', '하우징 재질 변경 검토 보고서', 'A.3', '검토', '이서연', '2026-10-12'],
  ['DOC-2610-0011', '커넥터 핀 배열 설계 기준', 'A.1', '작업', '박지훈', '2026-10-10'],
  ['DOC-2610-0010', '브래킷 체결 토크 시험 성적서', 'C.1', '승인', '최하은', '2026-10-08'],
  ['DOC-2610-0009', '방열판 핀 간격 해석 자료', 'B.1', '승인', '정우진', '2026-10-06'],
];
const chip = (k) => '<span class="status-chip status-chip--' + STATUS[k][0] + '">' + STATUS[k][1] + '</span>';
const ck = (label, on = false) => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + (on ? ' checked' : '') + '></label>';
const COLS = '<colgroup><col style="width:52px"><col style="width:44px"><col style="width:132px"><col><col style="width:64px"><col style="width:96px"><col style="width:84px"><col style="width:104px"></colgroup>';
const HEAD = '<thead><tr><th>No.</th><th>' + ck('전체 선택') + '</th><th>문서 번호</th><th>문서 명</th><th>버전</th><th>작업현황</th><th>등록자</th><th>등록일</th></tr></thead>';

// 행 하나 — sel = 선택한 행(체크 + 선택 바탕), ps = 정지 화면 상태 클래스(.ps-hover), linkPs = 링크 상태 클래스(.ps-focus-visible)
const row = (r, i, { sel = false, ps = '', linkPs = '' } = {}) => {
  const cls = [sel ? 'is-selected' : '', ps].filter(Boolean).join(' ');
  return '<tr' + (cls ? ' class="' + cls + '"' : '') + (sel ? ' aria-selected="true"' : '') + '>' +
    '<td>' + (i + 1) + '</td><td>' + ck(r[0] + ' 선택', sel) + '</td>' +
    '<td><a href="#" class="grid-custom-rows-link' + (linkPs ? ' ' + linkPs : '') + '">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td>' +
    '<td><a href="#" class="grid-link" aria-label="' + r[0] + ' 버전 이력">' + r[2] + '</a></td><td>' + chip(r[3]) + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td></tr>';
};
const table = (rows, head = true) => '<table class="grid-table">' + COLS + (head ? HEAD : '') + '<tbody>' + rows + '</tbody></table>';
const wrap = (t, w = '760px') => '<div style="max-width:' + w + '"><div class="table_list"><div class="list">' + t + '</div></div></div>';
const html = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

export default {
  title: 'Data Display/Table',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Table.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 — 문서 검색 결과처럼. 섹션 헤더(.seach_arm) + 표, 두 번째 행 선택 ──
const LIST = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>';
const XLS = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l4 6M11 9l-4 6M14.5 9H18M14.5 12H18M14.5 15H18"/></svg>';   // Button 엑셀 아이콘과 같은 모양
// 결과 헤더 — 기본 · 0건 예시가 같은 헤더를 쓰고 결과 수 · 내보내기 가능 여부만 다름
const resultHead = (n) => '<div class="seach_arm"><div class="leftbt">' + LIST + '<h4>검색 결과 (' + n + ')</h4></div>' +
  '<div class="rightbt"><button type="button" class="btn btn--excel"' + (n ? '' : ' disabled') + '>' + XLS + 'Excel</button></div></div>';
const SRC = [
  '<div class="seach_arm"><div class="leftbt">…<h4>검색 결과 (5)</h4></div><div class="rightbt">…</div></div>',
  '<div class="table_list"><div class="list">',
  '  <table class="grid-table">',
  '    <colgroup>…</colgroup>',
  '    <thead><tr><th>No.</th><th>문서 번호</th><th>문서 명</th><th>버전</th><th>작업현황</th><th>등록일</th></tr></thead>',
  '    <tbody>',
  '      <tr><td>1</td><td><a href="#" class="grid-custom-rows-link">DOC-2610-0013</a></td><td class="is-left">브레이크 캘리퍼 조립 사양서</td>',
  '          <td><a href="#" class="grid-link" aria-label="DOC-2610-0013 버전 이력">B.2</a></td>',
  '          <td><span class="status-chip status-chip--info">작업 중</span></td><td>2026-10-13</td></tr>',
  '      <tr class="is-selected" aria-selected="true">…</tr>',
  '    </tbody>',
  '  </table>',
  '</div></div>',
].join('\n');
export const 기본 = {
  parameters: html(SRC),
  render: () => '<div style="max-width:760px">' + resultHead(ROWS.length) + '<div class="table_list"><div class="list">' + table(ROWS.map((r, i) => row(r, i, { sel: i === 1 })).join('')) + '</div></div></div>',
};

// ── 결과 0건 — 헤더 행은 그대로, 표 아래 빈 상태(검색 결과 없음 = 기본 .empty + [검색 조건 초기화]), 내보내기는 누를 수 없음 ──
const NOHIT = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/></svg>';
const EMPTY_HIT = (actions = true) => '<div class="empty" role="status"><span class="empty__icon">' + NOHIT + '</span><p class="empty__title">조건에 맞는 문서가 없습니다</p>' +
  '<p class="empty__desc">기간을 넓히거나 작업현황을 \'전체\'로 바꿔 주십시오.</p>' +
  (actions ? '<div class="empty__actions"><button type="button" class="btn btn--secondary btn--transparent">검색 조건 초기화</button></div>' : '') + '</div>';
const ZERO = resultHead(0) +
  '<div class="table_list"><div class="list"><table class="grid-table">' + COLS + HEAD.replace('aria-label="전체 선택"', 'aria-label="전체 선택" disabled') + '<tbody></tbody></table>' +
  EMPTY_HIT() + '</div></div>';
export const 결과_0건 = {
  parameters: html(ZERO),
  render: () => '<div style="max-width:760px">' + ZERO + '</div>',
};

// ── 편집 표 — 일괄 등록처럼 셀 안에 입력 필드. 회색 판 + 흰 입력 상자 ──
const EROWS = [['설계 사양서', '브레이크 캘리퍼 조립 사양서', '김도윤'], ['시험 성적서', '', '김도윤'], ['도면', '하우징 3D 모델', '김도윤']];
const sel = (label, v) => '<select class="select" aria-label="' + label + '">' + ['설계 사양서', '시험 성적서', '도면'].map((o) => '<option' + (o === v ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
const ECOLS = '<colgroup><col style="width:52px"><col style="width:44px"><col style="width:150px"><col><col style="width:120px"></colgroup>';
const EHEAD = '<thead><tr><th>No.</th><th>' + ck('전체 선택') + '</th><th>문서 분류</th><th>문서 명</th><th>등록자</th></tr></thead>';
const erow = (r, i, on = false) => '<tr' + (on ? ' class="is-selected" aria-selected="true"' : '') + '><td>' + (i + 1) + '</td><td>' + ck((i + 1) + '행 선택', on) + '</td>' +
  '<td>' + sel((i + 1) + '행 문서 분류', r[0]) + '</td>' +
  '<td><input class="input" aria-label="' + (i + 1) + '행 문서 명" placeholder="문서 명 입력" value="' + r[1] + '"></td>' +
  '<td><input class="input" aria-label="' + (i + 1) + '행 등록자" value="' + r[2] + '" readonly></td></tr>';
const ESRC = [
  '<table class="grid-table grid-table--edit">',
  '  <thead>…</thead>',
  '  <tbody>',
  '    <tr><td>1</td><td><label class="checkbox"><input type="checkbox" aria-label="1행 선택"></label></td>',
  '        <td><select class="select" aria-label="1행 문서 분류">…</select></td>',
  '        <td><input class="input" aria-label="1행 문서 명" placeholder="문서 명 입력"></td>',
  '        <td><input class="input" aria-label="1행 등록자" value="김도윤" readonly></td></tr>',
  '  </tbody>',
  '</table>',
].join('\n');
export const 편집 = {
  parameters: html(ESRC),
  render: () => wrap('<table class="grid-table grid-table--edit">' + ECOLS + EHEAD + '<tbody>' + EROWS.map((r, i) => erow(r, i, i === 2)).join('') + '</tbody></table>'),
};

// ── 셀 안 아이콘 버튼 — Figma Cell Type=Actions 짝. 행마다 같은 동작을 아이콘 버튼으로(.button_group 간격 8), 이름은 「식별자 + 동작」 ──
const ico = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ACT = [['미리보기', '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'],
  ['내려받기', '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'],
  ['버전 이력', '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>']];
const actions = (id) => '<div class="button_group">' + ACT.map(([t, d]) => '<button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="' + id + ' ' + t + '">' + ico(d) + '</button>').join('') + '</div>';
const ACOLS = '<colgroup><col style="width:52px"><col style="width:132px"><col><col style="width:84px"><col style="width:144px"></colgroup>';   // 동작 열 = 버튼 3 + 간격 8 × 2 + 셀 여백 12 × 2 (Precision 버튼 32도 들어가게)
const AHEAD = '<thead><tr><th>No.</th><th>문서 번호</th><th>문서 명</th><th>버전</th><th>동작</th></tr></thead>';
const arow = (r, i) => '<tr><td>' + (i + 1) + '</td><td><a href="#" class="grid-custom-rows-link">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td><td>' + r[2] + '</td><td>' + actions(r[0]) + '</td></tr>';
const ASRC = [
  '<td>',
  '  <div class="button_group">',
  '    <button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="DOC-2610-0013 미리보기"><svg …/></button>',
  '    <button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="DOC-2610-0013 내려받기"><svg …/></button>',
  '    <button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="DOC-2610-0013 버전 이력"><svg …/></button>',
  '  </div>',
  '</td>',
].join('\n');
export const 셀_안_버튼 = {
  parameters: html(ASRC),
  render: () => wrap('<table class="grid-table">' + ACOLS + AHEAD + '<tbody>' + ROWS.slice(0, 3).map(arow).join('') + '</tbody></table>'),
};

// ── 전체 상태 — 행 상태. Hovered 는 마우스 상태를, 링크 Focused 는 키보드 상태를 정지 화면으로 ──
export const 전체_상태 = {
  parameters: html('<tr>…</tr>                                        <!-- Default -->\n<tr>…</tr>                                        <!-- 짝수 행 = 얼룩 -->\n<tr class="is-selected" aria-selected="true">…</tr>  <!-- Selected -->'),
  render: () => {
    enablePseudo();
    const box = (rows) => '<div class="table_list" style="min-width:640px">' + table(rows, false) + '</div>';   // 바깥 컨테이너 = 테두리
    return matrix(['모습'], [
      ['Default', [box(row(ROWS[0], 0))]],
      ['Zebra (짝수 행)', [box(row(ROWS[0], 0) + row(ROWS[1], 1))]],
      ['Hovered', [box(row(ROWS[0], 0, { ps: 'ps-hover' }))]],
      ['Selected <code>.is-selected</code>', [box(row(ROWS[1], 1, { sel: true }))]],
      ['Selected · Hovered', [box(row(ROWS[1], 1, { sel: true, ps: 'ps-hover' }))]],
      ['링크 Focused', [box(row(ROWS[0], 0, { linkPs: 'ps-focus-visible' }))]],
    ]);
  },
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 11번 ①) — 미리보기만, 코드는 위 예시 카드에. 열 넷으로 줄인 표 ──
const DCOLS = '<colgroup><col style="width:44px"><col style="width:120px"><col><col style="width:100px"></colgroup>';
const DHEAD = '<thead><tr><th>' + ck('전체 선택') + '</th><th>문서 번호</th><th>문서 명</th><th>작업현황</th></tr></thead>';
const ddZero = (withTable) => '<div style="width:100%;align-self:flex-start">' + resultHead(0) +
  '<div class="table_list"><div class="list">' + (withTable ? '<table class="grid-table">' + DCOLS + DHEAD.replace('aria-label="전체 선택"', 'aria-label="전체 선택" disabled') + '<tbody></tbody></table>' : '') +
  EMPTY_HIT(false) + '</div></div></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: TD-108 11번 ① (Carbon Data table · Atlassian Empty state) · 위 「결과 0건」 예시
    { title: '0건이어도 헤더 행 유지',
      do: [ddZero(true), '결과가 0건이어도 헤더 행을 두고 표 아래에 빈 상태를 둡니다. 어떤 열의 목록인지 알 수 있습니다.'],
      dont: [ddZero(false), '0건일 때 표를 통째로 숨기고 빈 상태만 두지 않습니다.'] },
  ]),
};
