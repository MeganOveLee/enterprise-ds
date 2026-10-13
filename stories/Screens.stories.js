// Screens — DS 클래스와 토큰만으로 짠 PLM 업무 화면 (실제 크기 1440 × 900, 가상 데이터)
// 문서 화면은 Screens.mdx. 도구 막대의 브랜드 · 화면 모드를 그대로 따른다.
// 구조는 실제 제품 화면과 같다: 아이콘 메뉴 + 두 번째 메뉴 패널(메뉴 · 폴더 트리) + 상단 바 + 라벨 위 검색 폼 + 목록
// 마크업은 문자열 이어 붙이기 — 스토리북 색인기가 여러 줄 HTML 템플릿을 MDX로 잘못 읽는 일을 피함
import './_screens.css';

const W = 1440;
const H = 900;

// ── 아이콘 (직접 그린 선 아이콘, currentColor) ──
const svg = (d, s = 20) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  work: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  drawing: '<path d="M4 20L20 4M4 20h16M4 20V4"/><path d="M9 20a5 5 0 0 0-5-5"/>',
  part: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  project: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
  change: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v3a4 4 0 0 0 4 4h5.5"/><path d="M13 13l2.5 2.5L13 18"/>',
  admin: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8 17a4 4 0 0 1 8 0"/>',
  user: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  reset: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  prev: '<path d="M15 6l-6 6 6 6"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  folder: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  excel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/>',
  approve: '<path d="M5 12l4 4 10-10"/>',
  minus: '<path d="M6 12h12"/>',
  clip: '<path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17.5a2 2 0 0 1-3-3l7.5-7.5"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};

// ── 데이터 (가상) ──
const STATUS = { 작업: ['info', '작업 중'], 검토: ['warning', '검토 중'], 승인: ['success', '승인'], 반려: ['danger', '반려'] };
const ROWS = [
  ['DOC-2610-0013', '브레이크 캘리퍼 조립 사양서', 'B.2', '작업', '김도윤', '2026-10-13', '김도윤', '2026-10-13'],
  ['DOC-2610-0012', '하우징 재질 변경 검토 보고서', 'A.3', '검토', '이서연', '2026-10-12', '이서연', '2026-10-13'],
  ['DOC-2610-0011', '커넥터 핀 배열 설계 기준', 'A.1', '작업', '박지훈', '2026-10-10', '박지훈', '2026-10-10'],
  ['DOC-2610-0010', '브래킷 체결 토크 시험 성적서', 'C.1', '승인', '최하은', '2026-10-08', '오세훈', '2026-10-09'],
  ['DOC-2610-0009', '실링 고무 경도 측정 결과', 'A.2', '반려', '정우진', '2026-10-07', '정우진', '2026-10-08'],
  ['DOC-2610-0008', '방열판 핀 간격 해석 자료', 'B.1', '승인', '김도윤', '2026-10-06', '이서연', '2026-10-07'],
  ['DOC-2610-0007', '조립 도면 공차 표기 기준', 'A.4', '작업', '한지민', '2026-10-02', '한지민', '2026-10-02'],
  ['DOC-2609-0006', '센서 브래킷 형상 검토서', 'D.1', '승인', '오세훈', '2026-09-30', '오세훈', '2026-10-01'],
  ['DOC-2609-0005', '케이블 하네스 배선 사양', 'A.2', '검토', '윤가람', '2026-09-26', '윤가람', '2026-09-29'],
  ['DOC-2609-0004', '표면 처리 사양서 (아노다이징)', 'B.4', '승인', '이서연', '2026-09-23', '최하은', '2026-09-24'],
  ['DOC-2609-0003', '파트 리스트 품번 체계', 'A.1', '작업', '박지훈', '2026-09-19', '박지훈', '2026-09-19'],
  ['DOC-2609-0002', '모터 마운트 진동 시험 계획서', 'C.1', '검토', '최하은', '2026-09-17', '최하은', '2026-09-18'],
  ['DOC-2609-0001', '설계 검토 회의록 양식', 'A.1', '승인', '정우진', '2026-09-15', '정우진', '2026-09-15'],
];

const chip = (k) => '<span class="scr-chip scr-chip--' + STATUS[k][0] + '">' + STATUS[k][1] + '</span>';
const ck = (label, extra = '') => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + extra + '></label>';
const dp = (label, value = '', extra = '') =>
  '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon">' + svg(I.cal, 14) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"' + extra + '></div>';
const range = (label, a = '', b = '') =>
  '<div class="ui-datepicker-range">' + dp(label + ' 시작', a) + '<span class="ui-datepicker-range__sep">~</span>' + dp(label + ' 끝', b) + '</div>';
const btn = (t, cls, icon = '') => '<button type="button" class="btn ' + cls + '">' + (icon ? svg(icon, 14) : '') + t + '</button>';
const sel = (label, opts) => '<select class="select" aria-label="' + label + '">' + opts.map((o) => '<option>' + o + '</option>').join('') + '</select>';
// 라벨 위 · 칸 아래 — 검색 폼 · 등록 폼이 같은 짝 (.ff-field > .search-label + .td)
const field = (label, control, { req = false, span = 0, id = '' } = {}) =>
  '<div class="ff-field' + (span ? ' scr-span-' + span : '') + '">' +
  '<label class="search-label"' + (id ? ' for="' + id + '"' : '') + '>' + label + (req ? '<span class="required" aria-hidden="true"></span>' : '') + '</label>' +
  '<div class="td">' + control + '</div></div>';

// ── 아이콘 메뉴 + 두 번째 메뉴 패널 ──
const LNB = [['work', '업무관리'], ['doc', '문서관리', true], ['drawing', '도면관리'], ['part', '부품관리'], ['project', '프로젝트'], ['change', '설계변경']];
// 가상 제품 로고 — 브랜드 타일 위에 부품(육면체)과 그 둘레를 도는 수명 주기 궤도, 궤도 끝에 브랜드 포인트색 점.
// 브랜드를 바꾸면 타일 · 점 색이 따라감. 로고 = 브랜드 자산이라 모서리는 고정이고, 점은 브랜드 파일의 포인트색(--accent-500)을 그대로 씀 — 화면 코드에서 원색을 쓰는 유일한 곳
const LOGO =
  '<svg class="scr-logo" width="34" height="34" viewBox="0 0 34 34" role="img" aria-label="Enterprise PLM">' +
  '<rect width="34" height="34" rx="8" style="fill:var(--color-bg-brand)"/>' +
  '<path d="M4.4 21.6A12.5 12.5 0 1 1 27.6 21.6" fill="none" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--color-icon-on-color);opacity:.55"/>' +
  '<g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--color-icon-on-color)">' +
  '<path d="M16 10.2l6 3.45v6.9L16 24l-6-3.45v-6.9z"/><path d="M10 13.65l6 3.45 6-3.45M16 17.1V24"/></g>' +
  '<circle cx="27.6" cy="21.6" r="2.9" stroke-width="1.6" style="fill:var(--accent-500);stroke:var(--color-bg-brand)"/></svg>';
const lnb = () =>
  '<aside class="main-menu"><div class="scr-lnb__logo">' + LOGO + '</div>' +
  '<nav aria-label="주 메뉴"><ul class="scr-lnb">' +
  LNB.map(([ic, t, on]) => '<li><a href="#"' + (on ? ' class="is-active" aria-current="page"' : '') + '>' + svg(I[ic]) + t + '</a></li>').join('') +
  '</ul></nav><ul class="scr-lnb scr-lnb--bottom"><li><a href="#">' + svg(I.admin) + '관리자</a></li></ul></aside>';

const TREE = [[0, '제품 문서', true], [1, '설계 문서', true, true], [2, '사양서'], [2, '시험 성적서'], [2, '회의록'], [1, '품질 문서'], [1, '양식']];
const sub = () =>
  '<aside class="main-sub"><div class="main-sub-header"><h3>문서 관리</h3>' +
  '<button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>' +
  '<div class="main-sub-content"><ul class="scr-submenu"><li><a href="#" class="is-active" aria-current="page">문서 검색</a></li><li><a href="#">문서 등록</a></li></ul>' +
  '<div class="tree-section"><div class="tree-controls">' + sel('제품군', ['전체 제품군', '제동 부품', '전장 부품']) +
  '<div class="tree-search-wrap">' + svg(I.search, 14) + '<input class="tree-search-input" aria-label="폴더 검색" placeholder="폴더 검색"></div></div>' +
  '<ul class="scr-tree" role="tree" aria-label="문서 폴더">' +
  TREE.map(([lv, t, open, on]) => '<li role="treeitem"' + (open !== undefined ? ' aria-expanded="' + !!open + '"' : '') + (on ? ' aria-selected="true" class="is-selected"' : '') +
    ' style="padding-left:' + (8 + lv * 16) + 'px"><span class="scr-tree__caret">' + (lv < 2 ? svg(open ? I.down : I.next, 12) : '') + '</span>' +
    '<span class="scr-tree__folder">' + svg(I.folder, 16) + '</span>' + t + '</li>').join('') +
  '</ul></div></div></aside>';

// ── 상단 바 ──
const gnb = () =>
  '<header class="gnb"><div style="display:flex;align-items:center">' +
  '<div class="nav-history"><button type="button" class="nav-history-btn" aria-label="뒤로">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="nav-history-btn" aria-label="앞으로">' + svg(I.next, 14) + '</button></div>' +
  '<div class="breadcrumb"><span>Home</span><span aria-hidden="true">›</span><span>문서 관리</span><span aria-hidden="true">›</span><span class="crumb-current">문서 검색</span></div></div>' +
  '<div class="header-actions">' +
  '<button type="button" class="theme-toggle-btn" aria-label="화면 모드 바꾸기"><span class="icon-moon">' + svg(I.moon, 16) + '</span><span class="icon-sun">' + svg(I.sun, 16) + '</span></button>' +
  '<span class="scr-gnb-icon" aria-label="내 정보">' + svg(I.user, 20) + '</span>' +
  '<div class="menu-container"><button type="button" class="menu-toggle"><span class="title">결재업무</span><span class="count">2</span></button></div>' +
  '<div class="menu-container"><button type="button" class="menu-toggle"><span class="title">활동업무</span><span class="count">0</span></button></div>' +
  '</div></header>';

// ── 검색 조건 · 결과 ──
const searchForm = () =>
  '<div class="seach_arm"><div class="leftbt">' + svg(I.filter, 16) + '<h4>검색 조건</h4></div>' +
  '<div class="rightbt">' + btn('검색', 'btn--secondary btn--filled', I.search) + btn('검색 조건 초기화', 'btn--secondary btn--transparent', I.reset) + '</div></div>' +
  '<div class="pro_table"><div class="form-grid-2 scr-search">' +
  field('문서 분류', '<input class="input" aria-label="문서 분류" value="/제품 문서/설계 문서" readonly>') +
  field('문서 번호', '<input class="input" aria-label="문서 번호">') +
  field('문서 명', '<input class="input" aria-label="문서 명">') +
  field('작업현황', sel('작업현황', ['전체', '작업 중', '검토 중', '승인', '반려'])) +
  field('버전', '<div class="scr-radio-row" role="radiogroup" aria-label="버전">' +
    '<label class="radio"><input type="radio" name="scr-ver" checked><span class="radio__mark"></span>최신 버전</label>' +
    '<label class="radio"><input type="radio" name="scr-ver"><span class="radio__mark"></span>모든 버전</label></div>') +
  '<div class="ff-field"></div>' +
  field('등록자', sel('등록자', ['', '김도윤', '이서연'])) +
  field('수정자', sel('수정자', ['', '김도윤', '이서연'])) +
  field('등록일', range('등록일', '2026-09-01', ''), { span: 2 }) +
  field('수정일', range('수정일'), { span: 2 }) +
  '</div></div>';

const grid = () =>
  '<div class="seach_arm"><div class="leftbt">' + svg(I.list, 16) + '<h4>검색 결과 (' + ROWS.length + '/128)</h4>' +
  sel('한 쪽에 보일 개수', ['20', '50', '100']) + '</div>' +
  '<div class="rightbt">' + btn('선택 일괄 결재', 'btn--primary btn--filled', I.approve) +
  '<button type="button" class="btn btn--excel">' + svg(I.excel, 14) + 'Excel</button>' +
  btn('필터 초기화', 'btn--secondary btn--transparent', I.reset) + '</div></div>' +
  '<div class="table_list"><div class="list"><table class="scr-grid"><colgroup>' +
  '<col style="width:52px"><col style="width:44px"><col style="width:140px"><col><col style="width:56px"><col style="width:64px"><col style="width:96px">' +
  '<col style="width:84px"><col style="width:104px"><col style="width:84px"><col style="width:104px"></colgroup>' +
  '<thead><tr><th>No.</th><th>' + ck('전체 선택') + '</th><th>문서 번호</th><th>문서 명</th><th>파일</th><th>버전</th><th>작업현황</th><th>등록자</th><th>등록일</th><th>수정자</th><th>수정일</th></tr></thead><tbody>' +
  ROWS.map((r, i) => '<tr' + (i === 1 ? ' class="is-selected"' : '') + '>' +
    '<td class="is-center is-date">' + (i + 1) + '</td><td class="is-center">' + ck(r[0] + ' 선택', i === 1 ? ' checked' : '') + '</td>' +
    '<td class="is-center"><a href="#" class="scr-link">' + r[0] + '</a></td><td>' + r[1] + '</td>' +
    '<td class="is-center scr-file">' + svg(I.file, 16) + '</td><td class="is-center">' + r[2] + '</td><td class="is-center">' + chip(r[3]) + '</td>' +
    '<td class="is-center">' + r[4] + '</td><td class="is-center is-date">' + r[5] + '</td><td class="is-center">' + r[6] + '</td><td class="is-center is-date">' + r[7] + '</td></tr>').join('') +
  '</tbody></table></div>' +
  '<nav class="ui-pagination" aria-label="쪽 이동">' +
  '<button type="button" class="ui-pagination__btn is-disabled" aria-label="이전 쪽">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="ui-pagination__btn is-active" aria-current="page">1</button>' +
  [2, 3, 4, 5].map((n) => '<button type="button" class="ui-pagination__btn">' + n + '</button>').join('') +
  '<span class="ui-pagination__ellipsis">…</span><button type="button" class="ui-pagination__btn">7</button>' +
  '<button type="button" class="ui-pagination__btn" aria-label="다음 쪽">' + svg(I.next, 14) + '</button></nav></div>';

const listScreen = () =>
  '<div style="display:flex;height:100%">' + lnb() + sub() +
  '<div class="main-layout"><div class="main-body"><div class="main-nav-layout"><div class="main-area">' + gnb() +
  '<div class="main-content"><div class="searchLayout"><div class="product">' + searchForm() + grid() + '</div></div></div>' +
  '</div></div></div></div></div>';

// ── 등록 창 — 제품에서는 새 창(.pop). 여기서는 목록 위에 띄운 창 ──
// 섹션 머리 — 네모 테두리 안 빼기(펼침) / 더하기(접힘) + 제목. 바탕색 없음 (제품 등록 창과 같은 모양)
const SQ = { minus: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 12h8"/>', plus: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 12h8M12 8v8"/>' };
const section = (title, open = true, right = '') =>
  '<div class="seach_arm scr-sec"><div class="leftbt"><button type="button" class="scr-sec-toggle" aria-expanded="' + open + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
  svg(open ? SQ.minus : SQ.plus, 18) + '</button><h4>' + title + '</h4></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>';

// 첨부 — 파일 형식 아이콘(형식별 색 + 확장자 띠)
const FT = { pdf: ['danger', 'PDF'], xlsx: ['success', 'XLS'], docx: ['info', 'DOC'], dwg: ['base', 'DWG'], zip: ['warning', 'ZIP'] };
const fileIcon = (ext) => {
  const [tone, label] = FT[ext] || ['muted', 'FILE'];
  return '<span class="file-icon scr-ft scr-ft--' + tone + '"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
    '<path d="M4.5 1.5h7.5l4 4v12.2a.8.8 0 0 1-.8.8H4.5a.8.8 0 0 1-.8-.8V2.3a.8.8 0 0 1 .8-.8z" stroke-width="1.2" style="fill:var(--color-bg-base);stroke:currentColor"/>' +
    '<path d="M12 1.5v4h4" fill="none" stroke-width="1.2" style="stroke:currentColor"/>' +
    '<rect x="1.5" y="9.6" width="13.6" height="6.4" rx="1.2" style="fill:currentColor"/>' +
    '<text x="8.3" y="14.5" text-anchor="middle" font-size="5" font-weight="700" font-family="Arial, sans-serif" style="fill:var(--color-text-on-color)">' + label + '</text></svg></span>';
};
const FILES = [
  ['BRK-20417_조립사양_B2.pdf', 'pdf', '1.8 MB'],
  ['체결토크_시험결과.xlsx', 'xlsx', '96 KB'],
  ['BRK-20417_캘리퍼.dwg', 'dwg', '3.2 / 5.0 MB', 64],
  ['설계검토_회의록.docx', 'docx', '42 KB'],
];
const uploader = () =>
  '<div class="resumable"><div class="resumable-bar">' +
  '<div class="resumable-label"><span class="resumable-label__name">' + FILES.length + '개 · 올리는 중 1개</span><a href="#" class="scr-link">(양식) 사양서 양식.docx</a></div>' +
  '<div class="resumable-bar__right">' + btn('파일 선택', 'btn--secondary btn--outlined') + '<button type="button" class="btn btn--destructive btn--transparent" data-role="clear-all">전체 삭제</button></div></div>' +
  '<div class="resumable-drop" role="button" tabindex="0"><span class="drop-cta">파일을 여기로 끌어다 놓거나 눌러서 고르세요 · 한 파일 100 MB까지</span></div>' +
  '<ul class="fileList">' + FILES.map(([n, ext, size, pct]) =>
    '<li class="file-item">' + fileIcon(ext) +
    (pct === undefined ? '<a href="#" class="file-name">' + n + '</a>' : '<span class="file-name">' + n + '</span><progress max="100" value="' + pct + '" aria-label="' + n + ' 올리는 중">' + pct + '%</progress>') +
    '<span class="file-size">' + (pct === undefined ? size : pct + '% · ' + size) + '</span>' +
    '<button type="button" class="remove-btn" aria-label="' + n + (pct === undefined ? ' 빼기' : ' 올리기 취소') + '">' + svg(I.close, 14) + '</button></li>').join('') +
  '</ul></div>';
const registerPop = () =>
  '<div class="pop"><div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.doc, 16) + '</span><h3>문서 등록</h3></div>' +
  '<div class="top-btn-area">' + btn('임시 저장', 'btn--secondary btn--outlined') + btn('등록', 'btn--primary btn--filled') +
  '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
  '<div class="contents">' + section('기본 정보', true, '<span class="scr-total"><span class="required" aria-hidden="true"></span> 필수</span>') +
  '<div class="pro_table"><div class="form-grid-2">' +
  field('문서 분류', '<div class="ff-readonly">/제품 문서/설계 문서/사양서</div>', { req: true }) +
  field('문서 번호', '<div class="ff-readonly">저장하면 자동으로 매겨집니다</div>') +
  field('문서 명', '<input class="input" id="scr-docname" aria-invalid="true" aria-describedby="scr-docname-err" placeholder="문서 명 입력">' +
    '<span class="field-error-msg" id="scr-docname-err">문서 명을 입력해 주세요</span>', { req: true, id: 'scr-docname' }) +
  field('작업현황', sel('작업현황', ['작업 중', '검토 중'])) +
  field('담당자', '<input class="input" aria-label="담당자" value="김도윤 · 설계1팀">', { req: true }) +
  field('완료 예정일', dp('완료 예정일', '2026-10-27'), { req: true }) +
  '<div class="ff-field col-2"><label class="search-label" for="scr-desc">설명</label><div class="td">' +
  '<textarea class="textarea" id="scr-desc" rows="3" placeholder="문서의 목적 · 변경 내용을 적어 주세요"></textarea></div></div>' +
  '</div></div>' +
  section('첨부 파일') + uploader() +
  '</div></div>';

// 실제 크기로 그린 화면을 칸 너비에 맞게 줄여 보여 준다 (1보다 크게 키우지 않음)
const frame = (inner) => {
  const el = document.createElement('div');
  el.className = 'scr-frame';
  el.style.aspectRatio = W + ' / ' + H;
  el.innerHTML = '<div class="scr" style="width:' + W + 'px;height:' + H + 'px">' + inner + '</div>';
  const fit = () => { const k = Math.min(1, el.clientWidth / W); if (k > 0) el.firstChild.style.transform = 'scale(' + k + ')'; };
  if (window.ResizeObserver) new ResizeObserver(fit).observe(el);
  requestAnimationFrame(fit);
  return el;
};
const src = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

export default {
  title: 'Screens/PLM 화면',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Screens.mdx
  parameters: { layout: 'fullscreen' },
};

export const 문서_검색 = {
  parameters: src(listScreen()),
  render: () => frame(listScreen()),
};

export const 문서_등록 = {
  parameters: src(registerPop()),
  render: () => frame(listScreen() + '<div class="scr-dim"></div><div class="scr-window">' + registerPop() + '</div>'),
};
