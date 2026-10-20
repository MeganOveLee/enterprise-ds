// Blocks/Drawing Register — 문서 화면은 DrawingRegister.mdx. 도면 검색에서 여는 도면 등록 창 (Figma 🧱 Blocks 「Drawing Register」와 같은 구성)
// 섹션 = 접는 섹션 상자(Accordion), 첨부 = 업로더(.resumable), 경로 = .ui-field-addon(읽기 전용 필드 + [선택])
// 필드는 보여 주기용으로 5개만(경로 · 도면 명 영문/한글 · CAD 구분 · 제품군 + 설명)
import { flow, shot, MARK, wireSections, toggleIcon } from './_flow.js';
import { fileIcon } from './_fileicon.js';
import { doDont } from './_dodont.js';
import { emptyArt } from './_illustrations.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  drawing: '<path d="M4 20L20 4M4 20h16M4 20V4"/><path d="M9 20a5 5 0 0 0-5-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  excel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l4 6M11 9l-4 6M14.5 9H18M14.5 12H18M14.5 15H18"/>',   // Button 엑셀 아이콘과 같은 모양
  reset: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  danger: '<circle cx="12" cy="12" r="8.34"/><path d="m9.5 9.5 5 5m0-5-5 5"/>',   // Alert 위험 아이콘(x-circle)과 같은 모양
};
const btn = (t, cls, { icon = '', label = '', extra = '' } = {}) => '<button type="button" class="btn ' + cls + '"' + (label ? ' aria-label="' + label + '"' : '') + (extra ? ' ' + extra : '') + '>' + (icon ? svg(icon, 14) : '') + t + '</button>';
const ck = (label, on = false) => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + (on ? ' checked' : '') + '></label>';
const REQ = '<span class="required" aria-hidden="true"></span>';
const iga = (t) => { const c = t.slice(-1).charCodeAt(0) - 0xac00; return c >= 0 && c < 11172 && c % 28 === 0 ? '가' : '이'; };   // 부품이 · 프로젝트가

// ── 섹션 — 접는 섹션 상자(헤더 + 내용, 내용 id 를 토글이 aria-controls 로 가리킴). 등록 창 안이라 제목은 h4 ──
const section = (u, key, title, body, { open = true, right = '', req = false } = {}) => {
  const id = u + '-' + key;
  return '<div class="seach_arm"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="' + open + '" aria-controls="' + id + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
    toggleIcon(open) + '</button><h4>' + title + (req ? REQ : '') + '</h4></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>' +
    body(id, open);
};

// ── 필드 — 라벨 위 · 필드 아래(.ff-field). err = 필드 아래 오류 문구(자리는 늘 비워 둠) ──
const field = (u, key, label, control, { req = false, col2 = false, err = '' } = {}) => {
  const id = u + '-' + key;
  const ctl = control(id, (req ? ' aria-required="true"' : '') + (err ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '')) + (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '');
  return '<div class="ff-field' + (col2 ? ' col-2' : '') + '"><label class="search-label" for="' + id + '">' + label + (req ? REQ : '') + '</label><div class="td">' + ctl + '</div></div>';
};
const text = (value = '', ph = '') => (id, a) => '<input class="input" id="' + id + '"' + a + (value ? ' value="' + value + '"' : '') + (ph ? ' placeholder="' + ph + '"' : '') + '>';
const pick = (opts, value = '') => (id, a) => '<select class="select" id="' + id + '"' + a + '><option value="">선택</option>' + opts.map((o) => '<option' + (o === value ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';

// ── 업로더 — 바(안내 + [파일 선택]) + 끌어다 놓는 영역 + 파일 목록. one = 주 파일 하나(전체 삭제 없음) ──
const uploader = (id, open, files, { one = false, err = '' } = {}) =>
  '<div class="resumable' + (err ? ' is-error' : '') + '" id="' + id + '"' + (open ? '' : ' hidden') + (err ? ' aria-describedby="' + id + '-err"' : '') + '><div class="resumable-bar">' +
  '<span class="resumable-help">' + (one ? '도면 파일 1개 · 100 MB까지(dwg · dxf · pdf)' : '여러 개 · 파일당 100 MB까지') + '</span>' +
  '<div class="resumable-bar__right">' + btn('파일 선택', 'btn--secondary btn--outlined') + (one ? '' : '<button type="button" class="btn btn--destructive btn--transparent" data-role="clear-all">전체 삭제</button>') + '</div></div>' +
  '<div class="resumable-drop" role="button" tabindex="0"><span class="drop-cta">' + (one ? '도면 파일을 여기로 끌어다 놓거나 눌러서 선택해 주십시오' : '파일을 여기로 끌어다 놓거나 눌러서 선택해 주십시오') + '</span></div>' +
  (files.length ? '<ul class="fileList">' + files.map(([n, ext, size]) => '<li class="file-item">' + fileIcon(ext) + '<a href="#" class="file-name">' + n + '</a><span class="file-size">' + size + '</span>' +
    '<button type="button" class="remove-btn" aria-label="' + n + ' 빼기">' + svg(I.close, 14) + '</button></li>').join('') + '</ul>' : '') +
  (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '') + '</div>';

// ── 관련 객체 — 섹션 헤더 오른쪽 [추가] · [삭제] + 표. 비어 있으면 헤더 행 + 표 안 빈 상태(.empty) ──
const related = (what, head, rows) => (id, open) => '<div class="table_list" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="list"><table class="grid-table" aria-label="관련 ' + what + '">' +
  '<colgroup><col style="width:44px">' + head.map((h, i) => '<col' + (i === 1 ? '' : ' style="width:' + (i === 0 ? 150 : 90) + 'px"') + '>').join('') + '</colgroup>' +
  '<thead><tr><th>' + ck('전체 선택') + '</th>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr><td>' + ck(r[0] + ' 선택') + '</td><td><a href="#" class="grid-custom-rows-link">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td><td>' + r[2] + '</td></tr>').join('') + '</tbody></table>' +
  (rows.length ? '' : '<div class="empty" role="status">' + emptyArt('empty') + '<p class="empty__title">추가한 관련 ' + what + iga(what) + ' 없습니다</p><p class="empty__desc">[추가]를 눌러 ' + what + '을 선택해 주십시오.</p></div>') +
  '</div></div>';
const addDel = (what) => btn('추가', 'btn--secondary btn--outlined', { label: '관련 ' + what + ' 추가' }) + btn('삭제', 'btn--destructive btn--outlined', { label: '관련 ' + what + ' 삭제' });

let uid = 0;
// 등록 창 — errors = [저장]을 눌렀는데 필수 항목이 비었을 때
const pop = ({ errors = false } = {}) => {
  const u = 'dr' + (++uid);
  const E = (t) => (errors ? t : '');
  const files = errors ? [] : [['BRK-20417_캘리퍼_조립도.dwg', 'dwg', '3.2 MB']];
  const basic = (id, open) => '<div class="pro_table" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2">' +
    field(u, 'path', '경로', (id2, a) => '<div class="ui-field-addon"><span class="ui-field-addon__main"><input class="input" id="' + id2 + '"' + a + ' value="/Drawing/제동 부품/캘리퍼" readonly></span>' +
      '<span class="ui-field-addon__addon">' + btn('선택', 'btn--secondary btn--outlined', { label: '경로 선택' }) + '</span></div>', { req: true, col2: true }) +
    field(u, 'name', '도면 명(영문)', text(errors ? '' : 'CALIPER ASSY DRAWING', '영문 도면 명 입력'), { req: true, err: E('도면 명(영문)을 입력해 주십시오') }) +
    field(u, 'namek', '도면 명(한글)', text(errors ? '' : '캘리퍼 조립도', '한글 도면 명 입력')) +
    field(u, 'cad', 'CAD 구분', pick(['2D', '3D'], errors ? '' : '2D'), { req: true, err: E('CAD 구분을 선택해 주십시오') }) +
    field(u, 'group', '제품군', pick(['제동 부품', '전장 부품'], errors ? '' : '제동 부품'), { req: true, err: E('제품군을 선택해 주십시오') }) +
    field(u, 'desc', '설명', (id2, a) => '<textarea class="textarea" id="' + id2 + '"' + a + ' rows="3" placeholder="도면의 목적 · 변경 내용 입력"></textarea>', { col2: true }) +
    '</div></div>';
  const alert = errors ? '<div class="alert alert--danger" role="alert"><span class="alert__icon">' + svg(I.danger) + '</span><div class="alert__body">' +
    '<strong class="alert__title">필수 항목을 모두 입력해 주십시오.</strong></div></div>' : '';
  const closed = (key, title, right = '') => section(u, key, title, (id) => '<div class="pro_table" id="' + id + '" hidden></div>', { open: false, right });
  return '<div class="pop"><div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.drawing) + '</span><h3>도면 등록</h3></div>' +
    '<div class="top-btn-area">' + btn('저장', 'btn--primary btn--filled') + '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
    '<div class="contents">' + alert +
    section(u, 'basic', '기본 정보', basic, { right: '<span class="section-meta">' + REQ + ' 필수</span>' }) +
    section(u, 'main', '도면 파일', (id, open) => uploader(id, open, files, { one: true, err: E('도면 파일을 올려 주십시오') }), { req: true }) +
    (errors
      ? closed('sub', '부 첨부 파일') + closed('part', '관련 부품') + closed('epm', '관련 도면') + closed('pjt', '관련 프로젝트')
      : closed('sub', '부 첨부 파일') +
        section(u, 'part', '관련 부품', related('부품', ['품목 번호', '품목 명', '버전'], [['BRK-20417', '캘리퍼 어셈블리', 'B.3'], ['BRK-20418', '브레이크 패드 세트', 'A.1']]), { right: addDel('부품') }) +
        section(u, 'epm', '관련 도면', related('도면', ['도면 번호', '도면 명(영문)', '버전'], []), { right: addDel('도면') }) +
        closed('pjt', '관련 프로젝트', addDel('프로젝트'))) +
    '</div></div>';
};

// 기본 화면 — 도면 검색 결과 머리줄 + 표 앞부분. 누르는 곳 = [등록]
const DWG = [['DWG-BRK-20417', '캘리퍼 조립도', 'B.3', 'info', '작업 중', '김도윤', '2026-10-13'], ['DWG-BRK-20416', '캘리퍼 하우징 상세도', 'A.2', 'warning', '검토 중', '이서연', '2026-10-12'], ['DWG-BRK-20415', '패드 브래킷 상세도', 'C.1', 'success', '승인', '박지훈', '2026-10-08']];
const list = () => '<div class="main-content"><div class="searchLayout"><div class="product">' +
  '<div class="seach_arm"><div class="leftbt">' + svg(I.list) + '<h4>검색 결과 (' + DWG.length + ')</h4></div><div class="rightbt">' +
  btn('등록', 'btn--primary btn--filled ' + MARK) + '<button type="button" class="btn btn--excel">' + svg(I.excel, 14) + 'Excel</button>' + btn('필터 초기화', 'btn--secondary btn--transparent', { icon: I.reset }) + '</div></div>' +
  '<div class="table_list"><div class="list"><table class="grid-table"><colgroup><col style="width:52px"><col style="width:44px"><col style="width:140px"><col><col style="width:64px"><col style="width:96px"><col style="width:84px"><col style="width:104px"></colgroup>' +
  '<thead><tr><th>No.</th><th>' + ck('전체 선택') + '</th><th>도면 번호</th><th>도면 명</th><th>버전</th><th>작업현황</th><th>등록자</th><th>등록일</th></tr></thead><tbody>' +
  DWG.map((r, i) => '<tr><td>' + (i + 1) + '</td><td>' + ck(r[0] + ' 선택') + '</td><td><a href="#" class="grid-custom-rows-link">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td><td>' + r[2] + '</td>' +
    '<td><span class="status-chip status-chip--' + r[3] + '">' + r[4] + '</span></td><td>' + r[5] + '</td><td>' + r[6] + '</td></tr>').join('') +
  '</tbody></table></div></div></div></div></div>';

export default {
  title: 'Blocks/Drawing Register',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 DrawingRegister.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 도면_등록_창 = {
  parameters: { docs: { source: { code: pop() } } },
  render: () => wireSections(flow({
    base: { html: list(), w: 960, h: 210, where: '도면 검색 — 검색 결과' },
    open: { html: pop(), w: 950, h: 1396, where: '도면 등록 — 새 창 950 × 650 (스크롤 없이 전체를 펼친 모습)' },
    trigger: '[등록]', how: '새 창이 열리고, 메뉴 패널에서 고른 폴더가 경로에 들어갑니다',
  })),
};
export const 필수_칸_비었을_때 = {
  parameters: { docs: { source: { code: pop({ errors: true }) } } },
  render: () => wireSections(shot(pop({ errors: true }), 950, 1024)),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 6번 ① ②) — 미리보기만 ──
const mini = (inner) => '<div style="width:100%;overflow:hidden;border:1px solid var(--color-border-base);border-radius:var(--radius-card)"><div class="pop" style="height:auto;min-width:0"><div class="contents">' + inner + '</div></div></div>';
const two = (a, b) => '<div class="pro_table"><div class="form-grid-2">' + a + b + '</div></div>';
const ddAlert = '<div class="alert alert--danger" role="status"><span class="alert__icon">' + svg(I.danger) + '</span><div class="alert__body"><strong class="alert__title">필수 항목을 모두 입력해 주십시오.</strong></div></div>';
let dd = 0;
const ddField = (label, err, req = true) => { const id = 'dd-dr-' + (++dd); return '<div class="ff-field"><label class="search-label" for="' + id + '">' + label + (req ? REQ : '') + '</label><div class="td"><input class="input" id="' + id + '"' +
  (err ? ' aria-invalid="true" aria-describedby="' + id + '-e"' : '') + '>' + (err ? '<span class="field-error-msg" id="' + id + '-e">' + err + '</span>' : '') + '</div></div>'; };
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '저장 오류는 Alert와 필드에 함께',
      do: [mini(ddAlert + two(ddField('도면 명(영문)', '도면 명(영문)을 입력해 주십시오'), ddField('제품군', '제품군을 선택해 주십시오'))), '필수 필드가 비면 폼 위 Alert와 함께 빈 필드마다 빨간 테두리 · 오류 문구를 표시합니다. 포커스는 첫 빈 필드로 옮깁니다.'],
      dont: [mini(ddAlert + two(ddField('도면 명(영문)', ''), ddField('제품군', ''))),
        'Alert만 띄우면 어느 필드가 비었는지 필드에 남지 않습니다.'] },
    { title: '검사하는 필드에는 모두 필수 표시',
      do: [mini(two(ddField('도면 명(영문)', ''), ddField('제품군', ''))), '[저장] 때 검사하는 필드에는 모두 필수 표시(*)를 둡니다.'],
      dont: [mini(two(ddField('도면 명(영문)', ''), ddField('제품군', '', false))), '일부 필드에만 표시하면 저장해 보기 전에는 무엇이 필수인지 알 수 없습니다.'] },
  ]),
};
