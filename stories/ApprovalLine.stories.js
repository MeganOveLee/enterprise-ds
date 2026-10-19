// Blocks(조합)/ApprovalLine — 문서 화면은 ApprovalLine.mdx. 결재 받을 사람을 역할(합의 · 승인 · 수신)별로 지정하는 조합 (TD-103 ④)
// 근거 = 이전 버전 jsp/approval/include/addApprovalLine.jsp(등록 · 요청 화면 안 지정 영역, 25곳) → [결재선 지정] = approval/addApprovalLinePopup.jsp(새 창 1000 × 870)
//   창 = 탭(조직 · 결재선 Template) + 탭 줄 [결재선 적용] · [Template 저장], 조직 = include/orgUserList.jsp(조직도 · 담당자), Template = include/appLineTemplate.jsp,
//   역할 상자 = include/approvalLineGrid.jsp(부서 · 이름 · ID) × 합의 · 승인 · 수신. 목록의 [선택 일괄 결재]로 열면 [결재선 적용] 대신 [결재 요청](mode=requestMulti)
// 이전 버전과 다르게 한 것 — 담당자를 끌어다 놓아야만 지정되던 것을 체크 + 역할 상자의 [추가] · [삭제]로(키보드로도 지정),
//   지정 영역의 [행 추가] primary · [행 삭제] 빨강 · [결재선 지정] primary를 secondary로(등록 창의 primary는 [등록] 하나, 저장 전이라 되돌릴 수 있음),
//   Template 목록의 [적용] primary를 secondary로(창의 primary는 [결재선 적용] 하나). 빈 역할 상자 「여기로 드래그하세요」 → 빈 상태 문구
// 세 칸 배치(조직 | 담당자 | 역할 상자) · 두 칸 배치(Template | 역할 상자)만 이 블록의 inline grid — DS에 여러 칸 배치 클래스가 없음. 나머지는 DS 클래스 그대로
import { flow, shot, MARK, wireSections, toggleIcon } from './_flow.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
};
const INBOX = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>';
const btn = (t, cls, label = '') => '<button type="button" class="btn ' + cls + '"' + (label ? ' aria-label="' + label + '"' : '') + '>' + t + '</button>';
const ck = (label, on = false) => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + (on ? ' checked' : '') + '></label>';
const empty = (title, desc) => '<div class="empty empty--card" role="status"><span class="empty__icon">' + INBOX + '</span><p class="empty__title">' + title + '</p>' + (desc ? '<p class="empty__desc">' + desc + '</p>' : '') + '</div>';
// 표 — after = 표 아래(.list 안)에 붙는 것(빈 상태). Table 「결과 0건」과 같은 자리
const tbl = (label, cols, head, rows, after = '') => '<div class="table_list"><div class="list"><table class="grid-table" aria-label="' + label + '"><colgroup>' + cols.map((w) => '<col' + (w ? ' style="width:' + w + '"' : '') + '>').join('') + '</colgroup>' +
  '<thead><tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' + rows + '</tbody></table>' + after + '</div></div>';

// ── 사람 · 결재선 (가상, Screens와 같은 부서 이름) ──
const USERS = [['김도윤', 'dykim', '설계1팀'], ['이서연', 'sylee', '설계1팀'], ['정하은', 'hejung', '설계1팀'], ['오지호', 'jhoh', '설계1팀']];
const LINE = { DISCUSS: [], APPROVE: [['품질팀', '박지훈', 'jhpark'], ['설계1팀', '이서연', 'sylee']], RECEIVE: [['생산기술팀', '최민준', 'mjchoi']] };
const TPL_LINE = { DISCUSS: [['품질팀', '박지훈', 'jhpark']], APPROVE: [['설계1팀', '이서연', 'sylee']], RECEIVE: [['생산기술팀', '최민준', 'mjchoi']] };
const ROLE = { DISCUSS: ['합의', '합의자'], APPROVE: ['승인', '승인자'], RECEIVE: ['수신', '수신자'] };

// ── 조직 — 부서 트리(.tree). 고른 부서의 담당자가 옆 목록에 나옴 ──
const ORG = [[0, '설계본부', true], [1, '설계1팀', undefined, true], [1, '설계2팀'], [0, '품질팀'], [0, '생산기술팀']];
const org = () => '<div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="search-label">조직도</span><div class="left-panel"><ul class="tree" role="tree" aria-label="조직도">' + ORG.map(([lv, t, open, on]) =>
  '<li class="tree__item" role="treeitem"' + (open !== undefined ? ' aria-expanded="' + open + '"' : '') + (on ? ' aria-selected="true"' : '') + ' style="--tree-level:' + lv + '">' +
  '<span class="tree__caret">' + (open !== undefined ? svg(open ? I.down : I.next, 12) : '') + '</span>' + t + '</li>').join('') + '</ul></div></div>';

// ── 담당자 — 이름 찾기(.left-search) + 표. 체크한 사람을 역할 상자의 [추가]로 넣음 ──
const users = () => '<div style="display:flex;flex-direction:column;gap:8px;min-width:0"><span class="search-label">담당자</span>' +
  '<div class="left-search"><input class="input" aria-label="담당자 이름" placeholder="이름">' + btn('검색', 'btn--secondary btn--outlined left-search-btn') + '</div>' +
  tbl('설계1팀 담당자', ['44px', '', '30%', '30%'], [ck('전체 선택'), '이름', 'ID', '부서'],
    USERS.map(([n, id, d], i) => '<tr' + (i === 0 ? ' class="is-selected" aria-selected="true"' : '') + '><td>' + ck(n + ' 선택', i === 0) + '</td><td>' + n + '</td><td>' + id + '</td><td>' + d + '</td></tr>').join('')) + '</div>';

// ── 역할 상자 — 머리(h4 + [추가] · [삭제]) + 표(부서 · 이름 · ID). 비어 있으면 표 아래 빈 상태 ──
const roleBox = (key, list) => {
  const [title, who] = ROLE[key];
  const head = '<div class="seach_arm" style="margin-top:0"><div class="leftbt"><h4>' + title + '</h4></div><div class="rightbt">' +
    btn('추가', 'btn--secondary btn--outlined btn--sm', who + ' 추가') + btn('삭제', 'btn--secondary btn--outlined btn--sm', who + ' 삭제') + '</div></div>';
  const rows = list.map(([d, n, id], i) => '<tr><td>' + (i + 1) + '</td><td>' + d + '</td><td>' + n + '</td><td>' + id + '</td></tr>').join('');
  return '<div style="display:flex;flex-direction:column;gap:8px">' + head + tbl(who, ['52px', '', '', ''], ['No.', '부서', '이름', 'ID'], rows,
    list.length ? '' : empty('지정한 ' + who + '가 없어요', '담당자를 체크한 뒤 [추가]를 눌러 주세요.')) + '</div>';
};
const roles = (line) => '<div style="display:flex;flex-direction:column;gap:12px;min-width:0">' + ['DISCUSS', 'APPROVE', 'RECEIVE'].map((k) => roleBox(k, line[k])).join('') + '</div>';

// ── 결재 Template 탭 — 저장해 둔 결재선 목록([삭제] · [적용]) + 고른 Template 상세 ──
const TPLS = [['설계 문서 기본', true], ['품질 검토 포함']];
const templates = () => '<div style="display:flex;flex-direction:column;gap:12px;min-width:0">' +
  '<div class="seach_arm" style="margin-top:0"><div class="leftbt"><h4>결재 Template</h4></div><div class="rightbt">' +
  btn('삭제', 'btn--destructive btn--outlined btn--sm', 'Template 삭제') + btn('적용', 'btn--secondary btn--outlined btn--sm', 'Template 적용') + '</div></div>' +
  tbl('결재 Template', ['44px', ''], ['', 'Template 이름'], TPLS.map(([n, on]) => '<tr' + (on ? ' class="is-selected" aria-selected="true"' : '') + '><td>' + ck(n + ' 선택', on) + '</td><td class="is-left">' + n + '</td></tr>').join('')) +
  '<div class="seach_arm" style="margin-top:0"><div class="leftbt"><h4>Template 상세</h4></div></div>' +
  tbl('설계 문서 기본 상세', ['20%', '', '', ''], ['구분', '부서', '이름', 'ID'],
    ['DISCUSS', 'APPROVE', 'RECEIVE'].map((k) => TPL_LINE[k].map(([d, n, id]) => '<tr><td>' + ROLE[k][1] + '</td><td>' + d + '</td><td>' + n + '</td><td>' + id + '</td></tr>').join('')).join('')) + '</div>';

// 결재선 지정 창 — 제목 줄(닫기) + 탭 줄(조직 · 결재선 Template | [결재선 적용] · [Template 저장]) + 내용
const pop = ({ tab = 0 } = {}) =>
  '<div class="pop"><div class="top"><div class="top-title-area"><h3>결재선 지정</h3></div><div class="top-btn-area">' +
  '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
  '<div class="tab"><ul role="tablist" aria-label="결재선 지정">' +
  ['조직', '결재선 Template'].map((t, i) => '<li role="tab" tabindex="' + (i === tab ? 0 : -1) + '" aria-selected="' + (i === tab) + '"' + (i === tab ? ' class="is-active"' : '') + '>' + t + '</li>').join('') + '</ul>' +
  '<div class="tab-actions">' + btn('결재선 적용', 'btn--primary btn--filled') + btn('Template 저장', 'btn--secondary btn--outlined') + '</div></div>' +
  '<div class="contents">' + (tab === 0
    ? '<div style="display:grid;grid-template-columns:180px minmax(0,1fr) minmax(0,1.2fr);gap:16px;align-items:start">' + org() + users() + roles(LINE) + '</div>'
    : '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:16px;align-items:start">' + templates() + roles(TPL_LINE) + '</div>') +
  '</div></div>';

// 기본 화면 — 문서 등록 창 안 지정 영역(이전 버전 include/addApprovalLine.jsp). 누르는 곳 = [결재선 지정]
// 섹션 = Accordion 「이어지는 형」 마크업. 기본 정보는 접어 둠
let uid = 0;
const section = (u, title, body, { open = true, right = '' } = {}) => {
  const id = u + '-' + (++uid);
  return '<div class="seach_arm"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="' + open + '" aria-controls="' + id + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
    toggleIcon(open) + '</button><h4>' + title + '</h4></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>' + body(id, open);
};
const area = (u = 'al') => {
  const tplId = u + '-tpl-' + (++uid);
  const right = '<span id="' + tplId + '">결재선 Template</span><select class="select" aria-labelledby="' + tplId + '"><option>선택</option><option>설계 문서 기본</option></select>' +
    btn('행 추가', 'btn--secondary btn--outlined') + btn('행 삭제', 'btn--secondary btn--outlined') + btn('결재선 지정', 'btn--secondary btn--outlined ' + MARK);
  const line = (id, open) => tbl('결재선', ['44px', '52px', '24%', '', '28%'], [ck('전체 선택'), 'No.', '구분', '이름', '부서'], '',
    empty('지정한 결재선이 없어요', '[결재선 지정]을 눌러 결재 받을 사람을 고르세요.')).replace('<div class="table_list">', '<div class="table_list" id="' + id + '"' + (open ? '' : ' hidden') + '>');
  return '<div class="pop"><div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.doc) + '</span><h3>문서 등록</h3></div>' +
    '<div class="top-btn-area">' + btn('임시 저장', 'btn--secondary btn--outlined') + btn('등록', 'btn--primary btn--filled') +
    '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
    '<div class="product"><div class="contents">' +
    section(u, '기본 정보', (id, open) => '<div class="pro_table" id="' + id + '" hidden></div>', { open: false }) +
    section(u, '결재선 지정', line, { right }) +
    '</div></div></div>';
};

export default {
  title: 'Blocks/ApprovalLine',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ApprovalLine.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 결재선_지정 = {
  parameters: { docs: { source: { code: area() + '\n\n<!-- [결재선 지정]을 누르면 여는 창 -->\n' + pop() } } },
  render: () => wireSections(flow({
    base: { html: area(), w: 1000, h: 380, where: '문서 등록 창 — 결재선 지정 영역(등록 · 요청 화면 공통)' },
    open: { html: pop(), w: 1000, h: 640, where: '결재선 지정 — 새 창(폭 1000)' },
    trigger: '[결재선 지정]', how: '새 창이 열립니다. [결재선 적용]을 누르면 고른 사람이 등록 창 표에 들어갑니다',
  })),
};
export const 저장한_결재선_불러오기 = {
  parameters: { docs: { source: { code: pop({ tab: 1 }) } } },
  render: () => shot(pop({ tab: 1 }), 1000, 560),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't) — 미리보기만 ──
const mini = (inner) => '<div style="width:100%;padding:12px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);background:var(--color-bg-base)">' + inner + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '끌어다 놓기만으로 지정하지 않기',
      do: [mini(roleBox('APPROVE', [['설계1팀', '이서연', 'sylee']])), '체크한 담당자를 [추가]로 넣습니다. 키보드로도 지정할 수 있습니다.'],
      dont: [mini('<div style="display:flex;flex-direction:column;gap:8px"><div class="seach_arm" style="margin-top:0"><div class="leftbt"><h4>승인</h4></div></div>' +
        tbl('승인자', ['52px', '', '', ''], ['No.', '부서', '이름', 'ID'], '', empty('여기로 끌어다 놓으세요', '')) + '</div>'),
        '끌어다 놓기만 되면 마우스를 쓰지 못하는 사람은 결재선을 만들 수 없습니다.'] },
    { title: '창의 primary는 하나',
      do: [mini('<div class="sb-row" style="gap:8px">' + btn('결재선 적용', 'btn--primary btn--filled') + btn('Template 저장', 'btn--secondary btn--outlined') + btn('적용', 'btn--secondary btn--outlined btn--sm') + '</div>'),
        '창을 닫으며 끝내는 [결재선 적용]만 primary입니다. Template 목록의 [적용]은 역할 상자만 채우므로 secondary입니다.'],
      dont: [mini('<div class="sb-row" style="gap:8px">' + btn('결재선 적용', 'btn--primary btn--filled') + btn('Template 저장', 'btn--secondary btn--outlined') + btn('적용', 'btn--primary btn--filled btn--sm') + '</div>'),
        '[적용]도 primary면 어느 버튼이 창을 끝내는지 알 수 없습니다.'] },
  ]),
};
