// Blocks/Approval Line — 문서 화면은 ApprovalLine.mdx. 결재 받을 사람을 역할(합의 · 승인 · 수신)별로 지정하는 영역과 창 (Figma 🧱 Blocks 「Approval Line」과 같은 구성)
// 등록 창 안 결재선 지정 섹션 → [결재선 지정] = 새 창(탭: 조직 · 결재선 Template). 담당자를 체크하고 역할 상자의 [추가]로 넣거나 끌어다 놓음
// 상자 = 접는 섹션 상자 · 섹션 상자(.section-box, 접기 없음). 두 칸 배치(왼쪽 | 역할 상자)만 이 블록의 inline grid
import { flow, shot, MARK, wireSections, toggleIcon } from './_flow.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
};
const INBOX = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>';
const btn = (t, cls, label = '') => '<button type="button" class="btn ' + cls + '"' + (label ? ' aria-label="' + label + '"' : '') + '>' + t + '</button>';
const ck = (label, on = false) => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + (on ? ' checked' : '') + '></label>';
const empty = (title, desc) => '<div class="empty" role="status"><span class="empty__icon">' + INBOX + '</span><p class="empty__title">' + title + '</p>' + (desc ? '<p class="empty__desc">' + desc + '</p>' : '') + '</div>';
// 표 — after = 표 아래(.list 안)에 붙는 것(빈 상태). Table 「결과 0건」과 같은 자리
const tbl = (label, cols, head, rows, after = '', style = '') => '<div class="table_list"' + (style ? ' style="' + style + '"' : '') + '><div class="list"><table class="grid-table" aria-label="' + label + '"><colgroup>' + cols.map((w) => '<col' + (w ? ' style="width:' + w + '"' : '') + '>').join('') + '</colgroup>' +
  '<thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' + rows + '</tbody></table>' + after + '</div></div>';

// ── 사람 · 결재선 (가상, Figma 블록과 같은 데이터) ──
const USERS = [['김도윤', '설계1팀', true], ['정우진', '설계1팀'], ['이서연', '설계1팀', true], ['박지훈', '설계1팀'], ['최유진', '설계1팀'], ['윤서준', '설계1팀']];
const LINE = { DISCUSS: [['설계1팀', '김도윤', 'dykim']], APPROVE: [['설계1팀', '정우진', 'wjjung']], RECEIVE: [] };
const TPL_LINE = { DISCUSS: [['설계1팀', '김도윤', 'dykim']], APPROVE: [['설계1팀', '정우진', 'wjjung']], RECEIVE: [['설계1팀', '이서연', 'sylee']] };
const ROLE = { DISCUSS: ['합의', '합의자'], APPROVE: ['승인', '승인자'], RECEIVE: ['수신', '수신자'] };

// ── 조직도 — 부서 트리(.tree). 고른 부서의 담당자가 옆 목록에 나옴 ──
const ORG = [[0, '대표이사', true], [1, '기술연구소', true], [2, '설계1팀', undefined, true], [2, '설계2팀'], [2, '품질팀'], [1, '생산본부', false], [1, '경영지원팀']];
const org = () => '<div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="search-label">조직도</span><div class="left-panel" style="flex:1"><ul class="tree" role="tree" aria-label="조직도">' + ORG.map(([lv, t, open, on]) =>
  '<li class="tree__item" role="treeitem"' + (open !== undefined ? ' aria-expanded="' + open + '"' : '') + (on ? ' aria-selected="true"' : '') + ' style="--tree-level:' + lv + '">' +
  '<span class="tree__caret">' + (open !== undefined ? svg(open ? I.down : I.next, 12) : '') + '</span>' + t + '</li>').join('') + '</ul></div></div>';

// ── 담당자 — 이름 찾기(.left-search) + 표. 체크한 사람을 역할 상자의 [추가]로 넣음 ──
const users = () => '<div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="search-label">담당자</span>' +
  '<div class="left-search"><input class="input" aria-label="담당자 이름" placeholder="이름 입력">' + btn(svg(I.search, 14) + '검색', 'btn--secondary btn--outlined left-search-btn') + '</div>' +
  tbl('설계1팀 담당자', ['44px', '', ''], [ck('전체 선택'), '이름', '부서'],
    USERS.map(([n, d, on]) => '<tr' + (on ? ' class="is-selected" aria-selected="true"' : '') + '><td>' + ck(n + ' 선택', !!on) + '</td><td>' + n + '</td><td>' + d + '</td></tr>').join(''), '', 'flex:1') + '</div>';

// 왼쪽 상자 — 안내 + 조직도 | 담당자. 오른쪽 역할 상자 끝까지 늘어남
const GUIDE = '담당자를 체크하고 역할 상자의 [추가]를 누르거나, 역할 상자로 끌어다 놓아 주십시오.';
const left = () => '<div class="section-box" style="padding-top:16px;gap:8px">' +
  '<p class="section-meta" style="margin:0">' + GUIDE + '</p>' +
  '<div style="flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px">' + org() + users() + '</div></div>';

// ── 역할 상자 — 섹션 상자(헤더 h4 + [추가]) + 표(No. · 부서 · 이름 · ID). 비어 있으면 표 안 빈 상태 ──
// add = 헤더 [추가] 버튼(Do · Don't 견본만 끔), blank = 빈 상태 안내(Do · Don't 견본만 끔)
const roleBox = (key, list, { add = true, blank = true } = {}) => {
  const [title, who] = ROLE[key];
  const head = '<div class="seach_arm"><div class="leftbt"><h4>' + title + '</h4></div>' + (add ? '<div class="rightbt">' + btn('추가', 'btn--secondary btn--outlined', who + ' 추가') + '</div>' : '') + '</div>';
  const rows = list.map(([d, n, id], i) => '<tr><td>' + (i + 1) + '</td><td>' + d + '</td><td>' + n + '</td><td>' + id + '</td></tr>').join('');
  return '<div class="section-box">' + head + tbl(who, ['52px', '', '', '100px'], ['No.', '부서', '이름', 'ID'], rows,
    list.length || !blank ? '' : empty('지정한 ' + who + '가 없습니다', '담당자를 체크하고 [추가]를 누르거나, 여기로 끌어다 놓아 주십시오.')) + '</div>';
};
const roles = (line) => '<div style="display:flex;flex-direction:column;gap:12px;min-width:0">' + ['DISCUSS', 'APPROVE', 'RECEIVE'].map((k) => roleBox(k, line[k])).join('') + '</div>';

// ── 결재선 Template 탭 — 저장해 둔 결재선 목록([삭제] · [적용]) + 고른 Template 상세 ──
const TPLS = [['설계 문서 기본', true], ['품질 검토 포함']];
const templates = () => '<div style="display:flex;flex-direction:column;gap:12px;min-width:0">' +
  '<div class="section-box"><div class="seach_arm"><div class="leftbt"><h4>결재 Template</h4></div><div class="rightbt">' +
  btn('삭제', 'btn--destructive btn--outlined', 'Template 삭제') + btn('적용', 'btn--secondary btn--outlined', 'Template 적용') + '</div></div>' +
  tbl('결재 Template', ['44px', ''], [ck('전체 선택'), 'Template 이름'], TPLS.map(([n, on]) => '<tr' + (on ? ' class="is-selected" aria-selected="true"' : '') + '><td>' + ck(n + ' 선택', on) + '</td><td class="is-left">' + n + '</td></tr>').join('')) + '</div>' +
  '<div class="section-box" style="flex:1"><div class="seach_arm"><div class="leftbt"><h4>Template 상세</h4></div></div>' +
  tbl('설계 문서 기본 상세', ['80px', '', '', '100px'], ['구분', '부서', '이름', 'ID'],
    ['DISCUSS', 'APPROVE', 'RECEIVE'].map((k) => TPL_LINE[k].map(([d, n, id]) => '<tr><td>' + ROLE[k][0] + '</td><td>' + d + '</td><td>' + n + '</td><td>' + id + '</td></tr>').join('')).join(''), '', 'flex:1') + '</div></div>';

// 결재선 지정 창 — 제목 줄(닫기) + 탭 줄(조직 · 결재선 Template | [결재선 적용] · [Template 저장]) + 내용(왼쪽 | 역할 상자, 높이 맞춤)
const pop = ({ tab = 0 } = {}) =>
  '<div class="pop"><div class="top"><div class="top-title-area"><h3>결재선 지정</h3></div><div class="top-btn-area">' +
  '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
  '<div class="tab"><ul role="tablist" aria-label="결재선 지정">' +
  ['조직', '결재선 Template'].map((t, i) => '<li role="tab" tabindex="' + (i === tab ? 0 : -1) + '" aria-selected="' + (i === tab) + '"' + (i === tab ? ' class="is-active"' : '') + '>' + t + '</li>').join('') + '</ul>' +
  '<div class="tab-actions">' + btn('결재선 적용', 'btn--primary btn--filled') + btn('Template 저장', 'btn--secondary btn--outlined') + '</div></div>' +
  '<div class="contents"><div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:stretch">' +
  (tab === 0 ? left() + roles(LINE) : templates() + roles(TPL_LINE)) + '</div></div></div>';

// 기본 화면 — 문서 등록 창 안 결재선 지정 섹션. 누르는 곳 = [결재선 지정]
let uid = 0;
const section = (u, title, body, { open = true, right = '' } = {}) => {
  const id = u + '-' + (++uid);
  return '<div class="seach_arm"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="' + open + '" aria-controls="' + id + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
    toggleIcon(open) + '</button><h4>' + title + '</h4></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>' + body(id, open);
};
const AREA = [['합의', '김도윤', '설계1팀'], ['승인', '정우진', '설계1팀'], ['수신', '이서연', '설계1팀']];
const area = (u = 'al') => {
  const tplId = u + '-tpl-' + (++uid);
  const right = '<span id="' + tplId + '">결재선 Template</span><select class="select" aria-labelledby="' + tplId + '"><option>선택</option><option>설계 문서 기본</option></select>' +
    btn('행 추가', 'btn--secondary btn--outlined') + btn('행 삭제', 'btn--destructive btn--outlined') + btn('결재선 지정', 'btn--secondary btn--outlined ' + MARK);
  const line = (id, open) => tbl('결재선', ['44px', '52px', '120px', '160px', ''], [ck('전체 선택'), 'No.', '구분', '이름', '부서'],
    AREA.map(([r, n, d], i) => '<tr><td>' + ck((i + 1) + '행 선택') + '</td><td>' + (i + 1) + '</td><td>' + r + '</td><td>' + n + '</td><td class="is-left">' + d + '</td></tr>').join('')).replace('<div class="table_list">', '<div class="table_list" id="' + id + '"' + (open ? '' : ' hidden') + '>');
  return '<div class="pop"><div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.doc) + '</span><h3>문서 등록</h3></div>' +
    '<div class="top-btn-area">' + btn('임시 저장', 'btn--secondary btn--outlined') + btn('등록', 'btn--primary btn--filled') +
    '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
    '<div class="contents">' +
    section(u, '기본 정보', (id) => '<div class="pro_table" id="' + id + '" hidden></div>', { open: false }) +
    section(u, '첨부 파일', (id) => '<div class="pro_table" id="' + id + '" hidden></div>', { open: false }) +
    section(u, '결재선 지정', line, { right }) +
    '</div></div>';
};

export default {
  title: 'Blocks/Approval Line',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ApprovalLine.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 결재선_지정 = {
  parameters: { docs: { source: { code: area() + '\n\n<!-- [결재선 지정]을 누르면 여는 창 -->\n' + pop() } } },
  render: () => wireSections(flow({
    base: { html: area(), w: 1000, h: 408, where: '문서 등록 창 — 결재선 지정 섹션(등록 · 결재 요청 화면 공통)' },
    open: { html: pop(), w: 1200, h: 720, where: '결재선 지정 — 새 창' },
    trigger: '[결재선 지정]', how: '새 창이 열립니다. [결재선 적용]을 누르면 고른 사람이 등록 창 표에 들어갑니다',
  })),
};
export const 저장한_결재선_불러오기 = {
  parameters: { docs: { source: { code: pop({ tab: 1 }) } } },
  render: () => shot(pop({ tab: 1 }), 1200, 640),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 7번 ① ② ③) — 미리보기만 ──
const mini = (inner) => '<div style="width:100%;display:flex;flex-direction:column;gap:8px;padding:12px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);background:var(--color-bg-base)">' + inner + '</div>';
const guide = (t) => '<p class="section-meta" style="margin:0">' + t + '</p>';
const ONE = [['설계1팀', '정우진', 'wjjung']];
// 결재선 지정 섹션 헤더 오른쪽 버튼 — 색만 바꿔 비교
const lineBtns = (del) => '<div class="seach_arm" style="margin:0"><div class="leftbt"><h4>결재선 지정</h4></div><div class="rightbt">' +
  btn('행 추가', 'btn--secondary btn--outlined') + btn('행 삭제', del) + btn('결재선 지정', 'btn--secondary btn--outlined') + '</div></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '끌어다 놓기와 [추가] 버튼을 함께',
      do: [mini(guide(GUIDE) + roleBox('APPROVE', ONE)), '역할 상자 헤더에 [추가]를 두어, 체크한 담당자를 버튼으로도 넣게 합니다. 키보드로도 결재선을 지정할 수 있습니다.'],
      dont: [mini(guide('담당자를 역할 상자로 끌어다 놓아 주십시오.') + roleBox('APPROVE', ONE, { add: false })),
        '끌어다 놓기만 되면 마우스를 쓰지 못하는 사용자는 결재선을 지정할 수 없습니다.'] },
    { title: '빈 역할 상자에는 빈 상태 안내',
      do: [mini(roleBox('RECEIVE', [])), '역할 상자가 비면 표 안에 빈 상태를 두어 무엇을 하면 되는지 안내합니다.'],
      dont: [mini(roleBox('RECEIVE', [], { blank: false })), '헤더 행만 남기면 비어 있는 것인지 불러오는 중인지 알 수 없습니다.'] },
    { title: '버튼 색은 업무 동작대로',
      do: [mini(lineBtns('btn--destructive btn--outlined')), '[행 삭제]처럼 지우는 동작은 destructive로 구분하고, [행 추가] · [결재선 지정]은 secondary로 둡니다.'],
      dont: [mini(lineBtns('btn--secondary btn--outlined')), '셋이 같은 색이면 지우는 버튼을 다른 버튼과 구분하기 어렵습니다.'] },
  ]),
};
