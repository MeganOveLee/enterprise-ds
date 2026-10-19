// Blocks(조합)/DrawingRegister — 문서 화면은 DrawingRegister.mdx. 도면 검색에서 여는 도면 등록 창 (TD-103 ②)
// 근거 = 이전 버전 jsp/epm/saveEpm.jsp(새 창 950 × 650, 도면 검색 createEpm() — 고른 폴더가 경로로 넘어옴, 도면 상세 [수정]도 같은 화면)
//   칸 = 경로(폴더 고르기) · 도면 파일(주 파일 하나) · 도면 명(영문) · CAD 구분 · 고객사 품번 · 도면 명(한글) · 제품군 · 재질 · 중량 · 길이 · 두께 · 표면 처리
//        · LOSS율 · 금형 형번 · Cycle Time · Standard Time · 설명 · 부 첨부 파일(여러 개) · 관련 부품 · 관련 도면 · 관련 프로젝트([추가] · [삭제] + 표)
//   저장 버튼 하나(임시 저장 · 결재 요청 · 결재선 지정 영역은 이전 버전 코드에서 꺼져 있음)
// 이전 버전과 다르게 한 것 — 빈 필수 칸을 알림 창으로 하나씩 알리던 것(openNotice)을 폼 위 Alert + 칸 아래 문구로 한 번에,
//   검사는 하는데 필수 표시가 없던 제품군에 필수 표시, 관련 객체의 [추가] primary · [삭제] 빨강을 secondary로(창의 primary는 [저장] 하나, 저장 전이라 되돌릴 수 있음),
//   [저장]을 섹션 머리에서 창 제목 줄로(Modal 「등록 창」과 같은 자리)
// 섹션 = Accordion 「이어지는 형」 마크업 그대로, 첨부 = Screens 문서 등록과 같은 업로더(.resumable), 경로 칸 = .ui-field-addon(입력칸 + [선택])
import { flow, shot, MARK, wireSections, toggleIcon } from './_flow.js';
import { fileIcon } from './_fileicon.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  drawing: '<path d="M4 20L20 4M4 20h16M4 20V4"/><path d="M9 20a5 5 0 0 0-5-5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  excel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/>',
  reset: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.2" r=".6" fill="currentColor"/>',
};
const INBOX = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>';
const btn = (t, cls, { icon = '', label = '', extra = '' } = {}) => '<button type="button" class="btn ' + cls + '"' + (label ? ' aria-label="' + label + '"' : '') + (extra ? ' ' + extra : '') + '>' + (icon ? svg(icon, 14) : '') + t + '</button>';
const ck = (label, on = false) => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + (on ? ' checked' : '') + '></label>';
const REQ = '<span class="required" aria-hidden="true"></span>';
const iga = (t) => { const c = t.slice(-1).charCodeAt(0) - 0xac00; return c >= 0 && c < 11172 && c % 28 === 0 ? '가' : '이'; };   // 부품이 · 프로젝트가

// ── 섹션 — Accordion 「이어지는 형」(머리 + 내용, 내용 id 를 토글이 aria-controls 로 가리킴) ──
const section = (u, key, title, body, { open = true, right = '', req = false } = {}) => {
  const id = u + '-' + key;
  return '<div class="seach_arm"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="' + open + '" aria-controls="' + id + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
    toggleIcon(open) + '</button><h4>' + title + (req ? REQ : '') + '</h4></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>' +
    body(id, open);
};

// ── 칸 — 라벨 위 · 칸 아래(.ff-field). err = 칸 아래 오류 문구 ──
const field = (u, key, label, control, { req = false, col2 = false, err = '' } = {}) => {
  const id = u + '-' + key;
  const ctl = control(id, err ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '') + (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '');
  return '<div class="ff-field' + (col2 ? ' col-2' : '') + '"><label class="search-label" for="' + id + '">' + label + (req ? REQ : '') + '</label><div class="td">' + ctl + '</div></div>';
};
const text = (value = '', ph = '') => (id, a) => '<input class="input" id="' + id + '"' + a + (value ? ' value="' + value + '"' : '') + (ph ? ' placeholder="' + ph + '"' : '') + '>';
const pick = (opts, value = '') => (id, a) => '<select class="select" id="' + id + '"' + a + '><option value="">선택</option>' + opts.map((o) => '<option' + (o === value ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';

// ── 첨부 — Screens 문서 등록과 같은 업로더. one = 주 파일 하나(전체 삭제 없음) ──
const uploader = (id, open, files, { one = false, err = '' } = {}) =>
  '<div class="resumable" id="' + id + '"' + (open ? '' : ' hidden') + (err ? ' aria-describedby="' + id + '-err"' : '') + '><div class="resumable-bar">' +
  '<div class="resumable-label"><span class="resumable-label__name">' + (one ? '한 파일만 올립니다' : files.length + '개') + '</span></div>' +
  '<div class="resumable-bar__right">' + btn('파일 선택', 'btn--secondary btn--outlined') + (one ? '' : '<button type="button" class="btn btn--destructive btn--transparent" data-role="clear-all">전체 삭제</button>') + '</div></div>' +
  '<div class="resumable-drop" role="button" tabindex="0"><span class="drop-cta">' + (one ? '도면 파일 하나를 끌어다 놓거나 눌러서 고르세요' : '파일을 여기로 끌어다 놓거나 눌러서 고르세요 · 한 파일 100 MB까지') + '</span></div>' +
  (files.length ? '<ul class="fileList">' + files.map(([n, ext, size]) => '<li class="file-item">' + fileIcon(ext) + '<a href="#" class="file-name">' + n + '</a><span class="file-size">' + size + '</span>' +
    '<button type="button" class="remove-btn" aria-label="' + n + ' 빼기">' + svg(I.close, 14) + '</button></li>').join('') + '</ul>' : '') +
  (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '') + '</div>';

// ── 관련 객체 — 섹션 머리 [추가] · [삭제] + 표. 비어 있으면 표 머리 + 빈 상태 ──
const related = (what, head, rows) => (id, open) => '<div class="table_list" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="list"><table class="grid-table" aria-label="관련 ' + what + '">' +
  '<colgroup><col style="width:44px">' + head.map((h, i) => '<col' + (i === 1 ? '' : ' style="width:' + (i === 0 ? 150 : 90) + 'px"') + '>').join('') + '</colgroup>' +
  '<thead><tr><th>' + ck('전체 선택') + '</th>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  rows.map((r) => '<tr><td>' + ck(r[0] + ' 선택') + '</td><td><a href="#" class="grid-custom-rows-link">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td><td>' + r[2] + '</td></tr>').join('') + '</tbody></table>' +
  (rows.length ? '' : '<div class="empty empty--card" role="status"><span class="empty__icon">' + INBOX + '</span><p class="empty__title">추가한 관련 ' + what + iga(what) + ' 없어요</p><p class="empty__desc">[추가]를 눌러 고르세요.</p></div>') +
  '</div></div>';
const addDel = (what) => btn('추가', 'btn--secondary btn--outlined', { label: '관련 ' + what + ' 추가' }) + btn('삭제', 'btn--secondary btn--outlined', { label: '관련 ' + what + ' 삭제' });

let uid = 0;
// 등록 창 — errors = 저장을 눌렀는데 빈 필수 칸이 있을 때
const pop = ({ errors = false } = {}) => {
  const u = 'dr' + (++uid);
  const E = (t) => (errors ? t : '');
  const files = errors ? [] : [['BRK-20417_캘리퍼_조립도.dwg', 'dwg', '3.2 MB']];
  const subs = [['체결 토크 기준표.xlsx', 'xlsx', '96 KB'], ['조립도 검토 메모.pdf', 'pdf', '410 KB']];
  const basic = (id, open) => '<div class="pro_table" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2">' +
    field(u, 'path', '경로', (id2, a) => '<div class="ui-field-addon"><span class="ui-field-addon__main"><input class="input" id="' + id2 + '"' + a + ' value="/Drawing/제동 부품/캘리퍼" readonly></span>' +
      '<span class="ui-field-addon__addon">' + btn('선택', 'btn--secondary btn--outlined', { label: '경로 선택' }) + '</span></div>', { req: true, col2: true }) +
    field(u, 'name', '도면 명(영문)', text(errors ? '' : 'CALIPER ASSY DRAWING', '영문 도면 명'), { req: true, err: E('도면 명(영문)을 입력해 주세요') }) +
    field(u, 'cad', 'CAD 구분', pick(['2D', '3D'], errors ? '' : '2D'), { req: true, err: E('CAD 구분을 골라 주세요') }) +
    field(u, 'cust', '고객사 품번', text()) +
    field(u, 'namek', '도면 명(한글)', text(errors ? '' : '캘리퍼 조립도')) +
    field(u, 'group', '제품군', pick(['제동 부품', '전장 부품'], errors ? '' : '제동 부품'), { req: true, err: E('제품군을 골라 주세요') }) +
    field(u, 'mat', '재질', text(errors ? '' : 'AL6061-T6')) +
    field(u, 'wt', '중량(g)', text(errors ? '' : '1240')) + field(u, 'len', '길이(mm)', text(errors ? '' : '186')) +
    field(u, 'thk', '두께', text()) + field(u, 'fin', '표면 처리', text(errors ? '' : '아노다이징')) +
    field(u, 'loss', 'LOSS율(%)', text()) + field(u, 'mold', '금형 형번', text()) +
    field(u, 'ct', 'Cycle Time(초/ea)', text()) + field(u, 'st', 'Standard Time(초/ea)', text()) +
    field(u, 'desc', '설명', (id2, a) => '<textarea class="textarea" id="' + id2 + '"' + a + ' rows="3" placeholder="도면의 목적 · 변경 내용을 적어 주세요"></textarea>', { col2: true }) +
    '</div></div>';
  const alert = errors ? '<div class="alert alert--danger" role="alert"><span class="alert__icon">' + svg(I.danger) + '</span><div class="alert__body">' +
    '<strong class="alert__title">필수 항목 네 개가 비어 있어요</strong><span class="alert__desc">도면 명(영문) · CAD 구분 · 제품군을 입력하고 도면 파일을 올려 주세요. 칸 아래에도 빨간 문구가 함께 보여요.</span></div></div>' : '';
  return '<div class="pop"><div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.drawing) + '</span><h3>도면 등록</h3></div>' +
    '<div class="top-btn-area">' + btn('저장', 'btn--primary btn--filled') + '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
    '<div class="product"><div class="contents">' + alert +
    section(u, 'basic', '기본 정보', basic, { right: '<span class="section-meta">' + REQ + ' 필수</span>' }) +
    section(u, 'main', '도면 파일', (id, open) => uploader(id, open, files, { one: true, err: E('도면 파일을 올려 주세요') }), { req: true }) +
    section(u, 'sub', '부 첨부 파일', (id, open) => uploader(id, open, subs)) +
    section(u, 'part', '관련 부품', related('부품', ['품목 번호', '품목 명', '버전'], errors ? [] : [['BRK-20417', '캘리퍼 어셈블리', 'B.3']]), { right: addDel('부품') }) +
    section(u, 'epm', '관련 도면', related('도면', ['도면 번호', '도면 명(영문)', '버전'], []), { right: addDel('도면') }) +
    section(u, 'pjt', '관련 프로젝트', related('프로젝트', ['프로젝트 번호', '프로젝트 명', '타입'], errors ? [] : [['PJT-2026-014', '브레이크 캘리퍼 경량화 개발', '개발']]), { right: addDel('프로젝트') }) +
    '</div></div></div>';
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
  title: 'Blocks/DrawingRegister',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 DrawingRegister.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 도면_등록_창 = {
  parameters: { docs: { source: { code: pop() } } },
  render: () => wireSections(flow({
    base: { html: list(), w: 960, h: 210, where: '도면 검색 — 검색 결과' },
    open: { html: pop(), w: 950, h: 650, where: '도면 등록 — 새 창 950 × 650' },
    trigger: '[등록]', how: '새 창이 열리고, 메뉴 패널에서 고른 폴더가 경로에 들어갑니다',
  })),
};
export const 필수_칸_비었을_때 = {
  parameters: { docs: { source: { code: pop({ errors: true }) } } },
  render: () => wireSections(shot(pop({ errors: true }), 950, 650)),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't) — 미리보기만 ──
const mini = (inner) => '<div style="width:100%;overflow:hidden;border:1px solid var(--color-border-base);border-radius:var(--radius-card)"><div class="pop" style="height:auto;min-width:0"><div class="product"><div class="contents">' + inner + '</div></div></div></div>';
const two = (a, b) => '<div class="pro_table"><div class="form-grid-2">' + a + b + '</div></div>';
let dd = 0;
const ddField = (label, err, req = true) => { const id = 'dd-dr-' + (++dd); return '<div class="ff-field"><label class="search-label" for="' + id + '">' + label + (req ? REQ : '') + '</label><div class="td"><input class="input" id="' + id + '"' +
  (err ? ' aria-invalid="true" aria-describedby="' + id + '-e"' : '') + '>' + (err ? '<span class="field-error-msg" id="' + id + '-e">' + err + '</span>' : '') + '</div></div>'; };
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '빈 필수 칸은 한 번에 알리기',
      do: [mini(two(ddField('도면 명(영문)', '도면 명(영문)을 입력해 주세요'), ddField('제품군', '제품군을 골라 주세요'))), '[저장]을 누르면 빈 칸을 모두 한 번에 표시하고, 첫 빈 칸으로 포커스를 옮깁니다.'],
      dont: [mini('<div class="alert alert--danger" role="status"><span class="alert__icon">' + svg(I.danger) + '</span><div class="alert__body"><strong class="alert__title">도면 명(영문)을 입력하세요.</strong></div></div>' + two(ddField('도면 명(영문)', ''), ddField('제품군', ''))),
        '하나씩 알리면 칸마다 저장 → 알림 → 닫기를 되풀이합니다. 어느 칸인지도 칸에 남지 않습니다.'] },
    { title: '검사하는 칸에는 필수 표시',
      do: [mini(two(ddField('도면 명(영문)', ''), ddField('제품군', ''))), '[저장] 때 검사하는 칸에는 모두 필수 표시(*)를 둡니다.'],
      dont: [mini(two(ddField('도면 명(영문)', ''), ddField('제품군', '', false))), '표시 없는 칸을 비웠다고 막으면 저장해 보기 전에는 알 수 없습니다.'] },
  ]),
};
