// Blocks(조합)/ApprovalDecision — 문서 화면은 ApprovalDecision.mdx. 결재함에서 받은 결재 하나를 처리하는 영역
// 근거: 이전 버전 결재함 상세(workspace/detailApproval.jsp) = 결재 정보 · 결재 의견(approval/include/approvalInfo.jsp)
//       + 결재 이력(approval/include/approvalLineView.jsp — 상세 화면의 통합 이력에도 들어가는 같은 표)
// 순서 · 라벨 · 버튼 이름 · 표 열은 이전 버전 그대로. 섹션 접기는 Accordion, 값 보기는 Modal 상세 창의 .detail-dl, 이력은 .grid-table + Status Chip
// 버튼은 활동(역할)에 따라: 승인자 = 승인 · 반려, 합의자 = 합의 · 이의, 수신자 = 수신확인, 제출자(반려된 건) = 재기안 — approvalInfo.jsp
const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const MINUS = '<path d="M6 12h12"/>';
const PLUS = '<path d="M12 5v14M5 12h14"/>';
const BACK = '<path d="M19 12H5M11 18l-6-6 6-6"/>';
const EXCEL = '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/>';
const RESET = '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>';

const btn = (t, cls, icon = '') => '<button type="button" class="btn ' + cls + '">' + (icon ? svg(icon, 14) : '') + t + '</button>';
// 활동별 버튼 — 이전 버전 btn--error btn--outline = DS destructive · outlined, btn--neutral btn--transparent = secondary · transparent
const ACTIONS = {
  승인자: btn('승인', 'btn--primary btn--filled') + btn('반려', 'btn--destructive btn--outlined'),
  합의자: btn('합의', 'btn--primary btn--filled') + btn('이의', 'btn--destructive btn--outlined'),
};

let uid = 0;
const toggle = (title, id) =>
  '<button type="button" class="section-toggle" aria-expanded="true" aria-label="' + title + ' 접기" aria-controls="' + id + '">' + svg(MINUS) + '</button>';
// 섹션 머리 — 제목 id 는 결재 의견 칸의 이름으로도 씀
const head = (title, id, right = '', hid = '') =>
  '<div class="seach_arm"><div class="leftbt">' + toggle(title, id) + '<h4' + (hid ? ' id="' + hid + '"' : '') + '>' + title + '</h4></div>' +
  (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>';

// 결재 정보 — 이전 버전 표(번호 · 제목은 줄 전체, 활동 | 작업자, 도착일 | 상태) = .detail-dl 줄 4개
const row = (cells) => '<dl class="detail-dl__row">' + cells.map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>').join('') + '</dl>';
const info = (role) => [
  [['번호', '<a class="grid-custom-rows-link" href="#">DOC-2610-0013</a>']],
  [['제목', '브레이크 캘리퍼 조립 사양서']],
  [['활동', role], ['작업자', '김도윤 · 설계1팀']],
  [['도착일', '2026-10-13 09:20'], ['상태', '검토 중']],
].map(row).join('');

// 결재 이력 — 열 = 구분 · 이름 · 부서 · 아이디 · 결재일 · 결재 · 결재 의견 (approvalLineView.jsp). 결재 결과는 Status Chip, 아직 처리 전이면 비움
const chip = (t, tone) => '<span class="status-chip status-chip--' + tone + '">' + t + '</span>';
const HISTORY = [
  ['제출자', '김도윤', '설계1팀', 'dykim', '2026-10-13 09:20', chip('기안', 'info'), '체결 토크 기준 개정분 반영'],
  ['합의자', '이서연', '품질팀', 'sylee', '2026-10-13 14:05', chip('합의', 'success'), '시험 성적서 첨부 확인'],
  ['승인자', '박지훈', '설계1팀', 'jhpark', '', '', ''],
  ['수신자', '최유나', '생산기술팀', 'ynchoi', '', '', ''],
];
const history = () =>
  '<div class="table_list"><div class="list"><table class="grid-table"><colgroup>' +
  '<col style="width:48px"><col style="width:72px"><col style="width:80px"><col style="width:96px"><col style="width:80px"><col style="width:136px"><col style="width:88px"><col></colgroup>' +
  '<thead><tr><th>No.</th><th>구분</th><th>이름</th><th>부서</th><th>아이디</th><th>결재일</th><th>결재</th><th>결재 의견</th></tr></thead><tbody>' +
  HISTORY.map((r, i) => '<tr><td>' + (i + 1) + '</td>' + r.map((c, j) => '<td' + (j === 6 ? ' class="is-left"' : '') + '>' + c + '</td>').join('') + '</tr>').join('') +
  '</tbody></table></div></div>';

const block = (role = '승인자') => {
  const n = ++uid;
  const [a, b, c] = ['ad-info-' + n, 'ad-opinion-' + n, 'ad-history-' + n];
  return '<div style="background:var(--color-bg-subtle);padding:16px"><section class="product" style="padding:0">' +
    head('결재 정보', a, ACTIONS[role] + btn('뒤로가기', 'btn--secondary btn--transparent', BACK)) +
    '<div class="pro_table" id="' + a + '"><div class="detail-dl">' + info(role) + '</div></div>' +
    head('결재 의견', b, '', b + '-t') +
    '<div class="pro_table" id="' + b + '"><textarea class="textarea" rows="3" aria-labelledby="' + b + '-t" placeholder="의견을 입력해 주세요"></textarea></div>' +
    head('결재 이력', c, '<button type="button" class="btn btn--excel">' + svg(EXCEL, 14) + 'Excel</button>' + btn('필터 초기화', 'btn--secondary btn--transparent', RESET)) +
    '<div id="' + c + '">' + history() + '</div>' +
    '</section></div>';
};

// 눌러 보기 — 섹션 토글이 aria-expanded · 아이콘 · 이름을 바꾸고 이은 내용에 hidden 을 붙였다 뗌 (Accordion 과 같음)
const mount = (html) => {
  const root = document.createElement('div');
  root.innerHTML = html;
  root.querySelectorAll('.section-toggle[aria-controls]').forEach((t) => {
    t.addEventListener('click', () => {
      const open = t.getAttribute('aria-expanded') !== 'true';
      const title = t.getAttribute('aria-label').replace(/ (접기|펼치기)$/, '');
      t.setAttribute('aria-expanded', String(open));
      t.setAttribute('aria-label', title + (open ? ' 접기' : ' 펼치기'));
      t.innerHTML = svg(open ? MINUS : PLUS);
      const panel = root.querySelector('#' + t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !open;
    });
  });
  return root;
};

export default {
  title: 'Blocks/ApprovalDecision',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ApprovalDecision.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 승인자 = {
  parameters: { docs: { source: { code: block('승인자') } } },
  render: () => mount(block('승인자')),
};
