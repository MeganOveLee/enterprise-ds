// Data Display/Table — 문서 화면은 Table.mdx. Figma 짝 = Table component · Header · Cell, DS 클래스 = .grid-table (바깥 틀 .table_list › .list)
// 제품 목록 그리드는 상용 그리드 라이브러리가 그림 — .grid-table 은 같은 그리드 토큰으로 그리는 HTML 표(라이브러리 없이 쓰는 목록 · 문서 · 화면 예시)
// 값 근거 = 이전 버전 그리드(머리 34 · 줄 30 · 글자 12 · 세로선 · 얼룩 줄 · 가운데 정렬, 긴 글만 왼쪽) — components.css 주석
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

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

// 줄 하나 — sel = 선택한 줄(체크 + 선택 바탕), ps = 정지 화면 상태 클래스(.ps-hover), linkPs = 링크 상태 클래스(.ps-focus-visible)
const row = (r, i, { sel = false, ps = '', linkPs = '' } = {}) => {
  const cls = [sel ? 'is-selected' : '', ps].filter(Boolean).join(' ');
  return '<tr' + (cls ? ' class="' + cls + '"' : '') + (sel ? ' aria-selected="true"' : '') + '>' +
    '<td>' + (i + 1) + '</td><td>' + ck(r[0] + ' 선택', sel) + '</td>' +
    '<td><a href="#" class="grid-custom-rows-link' + (linkPs ? ' ' + linkPs : '') + '">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td>' +
    '<td>' + r[2] + '</td><td>' + chip(r[3]) + '</td><td>' + r[4] + '</td><td>' + r[5] + '</td></tr>';
};
const table = (rows, head = true) => '<table class="grid-table">' + COLS + (head ? HEAD : '') + '<tbody>' + rows + '</tbody></table>';
const wrap = (t, w = '760px') => '<div style="max-width:' + w + '"><div class="table_list"><div class="list">' + t + '</div></div></div>';
const html = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

export default {
  title: 'Data Display/Table',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Table.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 — 문서 검색 결과처럼. 두 번째 줄 선택 ──
const SRC = [
  '<div class="table_list"><div class="list">',
  '  <table class="grid-table">',
  '    <colgroup>…</colgroup>',
  '    <thead><tr><th>No.</th><th>문서 번호</th><th>문서 명</th><th>작업현황</th><th>등록일</th></tr></thead>',
  '    <tbody>',
  '      <tr><td>1</td><td><a href="#" class="grid-custom-rows-link">DOC-2610-0013</a></td><td class="is-left">브레이크 캘리퍼 조립 사양서</td>',
  '          <td><span class="status-chip status-chip--info">작업 중</span></td><td>2026-10-13</td></tr>',
  '      <tr class="is-selected" aria-selected="true">…</tr>',
  '    </tbody>',
  '  </table>',
  '</div></div>',
].join('\n');
export const 기본 = {
  parameters: html(SRC),
  render: () => wrap(table(ROWS.map((r, i) => row(r, i, { sel: i === 1 })).join(''))),
};

// ── 편집 표 — 일괄 등록처럼 칸 안에 입력칸. 회색 판 + 흰 입력 상자(이전 버전 편집 그리드) ──
const EROWS = [['설계 사양서', '브레이크 캘리퍼 조립 사양서', '김도윤'], ['시험 성적서', '', '김도윤'], ['도면', '하우징 3D 모델', '김도윤']];
const sel = (label, v) => '<select class="select" aria-label="' + label + '">' + ['설계 사양서', '시험 성적서', '도면'].map((o) => '<option' + (o === v ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
const ECOLS = '<colgroup><col style="width:52px"><col style="width:44px"><col style="width:150px"><col><col style="width:120px"></colgroup>';
const EHEAD = '<thead><tr><th>No.</th><th>' + ck('전체 선택') + '</th><th>문서 분류</th><th>문서 명</th><th>등록자</th></tr></thead>';
const erow = (r, i, on = false) => '<tr' + (on ? ' class="is-selected" aria-selected="true"' : '') + '><td>' + (i + 1) + '</td><td>' + ck((i + 1) + '번 줄 선택', on) + '</td>' +
  '<td>' + sel((i + 1) + '번 줄 문서 분류', r[0]) + '</td>' +
  '<td><input class="input" aria-label="' + (i + 1) + '번 줄 문서 명" placeholder="문서 명을 입력하세요" value="' + r[1] + '"></td>' +
  '<td><input class="input" aria-label="' + (i + 1) + '번 줄 등록자" value="' + r[2] + '" readonly></td></tr>';
const ESRC = [
  '<table class="grid-table grid-table--edit">',
  '  <thead>…</thead>',
  '  <tbody>',
  '    <tr><td>1</td><td><label class="checkbox"><input type="checkbox" aria-label="1번 줄 선택"></label></td>',
  '        <td><select class="select" aria-label="1번 줄 문서 분류">…</select></td>',
  '        <td><input class="input" aria-label="1번 줄 문서 명"></td>',
  '        <td><input class="input" aria-label="1번 줄 등록자" value="김도윤" readonly></td></tr>',
  '  </tbody>',
  '</table>',
].join('\n');
export const 편집 = {
  parameters: html(ESRC),
  render: () => wrap('<table class="grid-table grid-table--edit">' + ECOLS + EHEAD + '<tbody>' + EROWS.map((r, i) => erow(r, i, i === 2)).join('') + '</tbody></table>'),
};

// ── 전체 상태 — 줄 상태. Hovered 는 마우스 상태를, 링크 Focused 는 키보드 상태를 정지 화면으로 ──
export const 전체_상태 = {
  parameters: html('<tr>…</tr>                                        <!-- Default -->\n<tr>…</tr>                                        <!-- 짝수 줄 = 얼룩 -->\n<tr class="is-selected" aria-selected="true">…</tr>  <!-- Selected -->'),
  render: () => {
    enablePseudo();
    const box = (rows) => '<div class="table_list" style="min-width:640px">' + table(rows, false) + '</div>';   // 바깥 틀 = 테두리
    return matrix(['모습'], [
      ['Default', [box(row(ROWS[0], 0))]],
      ['Zebra (짝수 줄)', [box(row(ROWS[0], 0) + row(ROWS[1], 1))]],
      ['Hovered', [box(row(ROWS[0], 0, { ps: 'ps-hover' }))]],
      ['Selected <code>.is-selected</code>', [box(row(ROWS[1], 1, { sel: true }))]],
      ['Selected · Hovered', [box(row(ROWS[1], 1, { sel: true, ps: 'ps-hover' }))]],
      ['링크 Focused', [box(row(ROWS[0], 0, { linkPs: 'ps-focus-visible' }))]],
    ]);
  },
};
