// Screens — DS 클래스와 토큰만으로 짠 PLM 업무 화면 (실제 크기 1440 × 900, 가상 데이터)
// 문서 화면은 Screens.mdx. 도구 막대의 브랜드 · 화면 모드를 그대로 따른다.
// 구조는 실제 제품 화면과 같다: 로그인 = 브랜드 패널 + 폼 / 홈 = 아이콘 메뉴 + 상단 바 + 카드 대시보드
// 업무 화면 = 아이콘 메뉴 + 두 번째 메뉴 패널(메뉴 · 폴더 트리) + 상단 바 + 라벨 위 검색 폼 + 목록
// 프로젝트 상세 = 아이콘 메뉴 + 상단 바 + 왼쪽 산출물 구조 패널 + 오른쪽 상세(섹션 · 진행률)
// 마크업은 문자열 이어 붙이기 — 스토리북 색인기가 여러 줄 HTML 템플릿을 MDX로 잘못 읽는 일을 피함
import './_screens.css';
import { wireSearchDetail, EXPAND_LABEL } from './_search.js';
import { fileIcon, folderIcon } from './_fileicon.js';

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
  inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>',
  task: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
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

const chip = (k) => '<span class="status-chip status-chip--' + STATUS[k][0] + '">' + STATUS[k][1] + '</span>';
const ck = (label, extra = '') => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + extra + '></label>';
const dp = (label, value = '', extra = '') =>
  '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon">' + svg(I.cal, 14) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"' + extra + '></div>';
const range = (label, a = '', b = '') =>
  '<div class="ui-datepicker-range">' + dp(label + ' 시작', a) + '<span class="ui-datepicker-range__sep">~</span>' + dp(label + ' 끝', b) + '</div>';
const btn = (t, cls, icon = '') => '<button type="button" class="btn ' + cls + '">' + (icon ? svg(icon, 14) : '') + t + '</button>';
const sel = (label, opts, pick) => '<select class="select" aria-label="' + label + '">' + opts.map((o) => '<option' + (o === pick ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
// 라벨 위 · 칸 아래 — 검색 폼 · 등록 폼이 같은 짝 (.ff-field > .search-label + .td)
const field = (label, control, { req = false, span = 0, id = '', cls = '' } = {}) =>
  '<div class="ff-field' + (span ? ' span-' + span : '') + (cls ? ' ' + cls : '') + '">' +
  '<label class="search-label"' + (id ? ' for="' + id + '"' : '') + '>' + label + (req ? '<span class="required" aria-hidden="true"></span>' : '') + '</label>' +
  '<div class="td">' + control + '</div></div>';

// ── 아이콘 메뉴 + 두 번째 메뉴 패널 ──
const LNB = [['work', '업무관리'], ['doc', '문서관리'], ['drawing', '도면관리'], ['part', '부품관리'], ['project', '프로젝트'], ['change', '설계변경']];
// 가상 제품 로고(모든 브랜드 레일 · 로그인, TD-101 10/17). 브랜드 타일 위에 부품(육면체)과 그 둘레를 도는 수명 주기 궤도, 궤도 끝에 브랜드 포인트색 점.
// 브랜드를 바꾸면 타일 · 점 색이 따라감. 로고 = 브랜드 자산이라 모서리는 고정이고, 점은 브랜드 파일의 포인트색(--accent-500)을 그대로 씀 — 화면 코드에서 원색을 쓰는 유일한 곳
const LOGO =
  '<svg class="scr-logo" width="34" height="34" viewBox="0 0 34 34" role="img" aria-label="Enterprise PLM">' +
  '<rect width="34" height="34" rx="8" style="fill:var(--color-bg-brand)"/>' +
  '<path d="M4.4 21.6A12.5 12.5 0 1 1 27.6 21.6" fill="none" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--color-icon-on-color);opacity:.55"/>' +
  '<g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--color-icon-on-color)">' +
  '<path d="M16 10.2l6 3.45v6.9L16 24l-6-3.45v-6.9z"/><path d="M10 13.65l6 3.45 6-3.45M16 17.1V24"/></g>' +
  '<circle cx="27.6" cy="21.6" r="2.9" stroke-width="1.6" style="fill:var(--accent-500);stroke:var(--color-bg-brand)"/></svg>';
// active = 지금 메뉴 이름. 홈(대시보드)은 로고가 홈이라 켜진 메뉴 없음
// 아이콘 메뉴 = 이전 버전 개발 마크업 그대로(li › .menu_icon_box › .menu_icon › a + span). 아이콘은 mask 그림(--lnb-icon) 한 장을 글자색으로 칠함
// 링크 이름은 a 의 aria-label, 화면에 보이는 이름(span)은 읽기에서 뺌(두 번 읽지 않게)
const lnbIcon = (d) => "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>') + "')";
const lnbItem = ([ic, t], active) => '<li><div class="menu_icon_box"><div class="menu_icon" style="--lnb-icon:' + lnbIcon(I[ic]) + '"><a href="#" aria-label="' + t + '"' + (t === active ? ' aria-current="page"' : '') + '></a></div></div><span aria-hidden="true">' + t + '</span></li>';
const lnb = (active = '문서관리') =>
  '<aside class="main-menu"><a class="lnb-logo" href="#" aria-label="홈">' + LOGO + '</a>' +
  '<nav aria-label="주 메뉴"><ul>' + LNB.map((x) => lnbItem(x, active)).join('') + '</ul><ul>' + lnbItem(['admin', '관리자'], active) + '</ul></nav></aside>';

const TREE = [[0, '제품 문서', true], [1, '설계 문서', true, true], [2, '사양서'], [2, '시험 성적서'], [2, '회의록'], [1, '품질 문서'], [1, '양식']];
const sub = () =>
  '<aside class="main-sub" aria-label="문서 관리 메뉴"><div class="main-sub-header"><h3>문서 관리</h3>' +
  '<button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>' +
  '<div class="main-sub-content"><div class="ui-submenu"><ul><li class="ui-submenu-flat"><a href="#" aria-current="page">문서 검색</a></li><li class="ui-submenu-flat"><a href="#">문서 등록</a></li></ul></div>' +
  '<div class="tree-section"><div class="tree-controls">' + sel('제품군', ['전체 제품군', '제동 부품', '전장 부품']) +
  '<div class="tree-search-wrap">' + svg(I.search, 14) + '<input class="tree-search-input" aria-label="폴더 검색" placeholder="폴더 검색"></div></div>' +
  '<ul class="tree" role="tree" aria-label="문서 폴더">' +
  TREE.map(([lv, t, open, on]) => '<li class="tree__item" role="treeitem"' + (open !== undefined ? ' aria-expanded="' + !!open + '"' : '') + (on ? ' aria-selected="true"' : '') +
    ' style="--tree-level:' + lv + '"><span class="tree__caret">' + (lv < 2 ? svg(open ? I.down : I.next, 12) : '') + '</span>' +
    '<span class="tree__icon">' + folderIcon(!!open) + '</span>' + t + '</li>').join('') +
  '</ul></div></div></aside>';

// ── 상단 바 ──
const gnb = (crumbs = ['Home', '문서 관리', '문서 검색']) =>
  '<header class="gnb"><div style="display:flex;align-items:center">' +
  '<div class="nav-history"><button type="button" class="nav-history-btn" aria-label="뒤로">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="nav-history-btn" aria-label="앞으로">' + svg(I.next, 14) + '</button></div>' +
  '<div class="breadcrumb">' + crumbs.map((c, i) => i < crumbs.length - 1 ? '<span>' + c + '</span><span aria-hidden="true">&gt;</span>' : '<span class="crumb-current">' + c + '</span>').join('') + '</div></div>' +
  '<div class="header-actions">' +
  '<div class="menu-container"><button type="button" class="menu-toggle" aria-label="사용자 메뉴" aria-haspopup="true" aria-expanded="false">' + svg(I.user, 20) + '</button></div>' +
  '<div class="menu-container"><button type="button" class="menu-toggle"><span class="title">결재업무</span><span class="count">2</span></button></div>' +
  '<div class="menu-container"><button type="button" class="menu-toggle"><span class="title">활동업무</span><span class="count">0</span></button></div>' +
  '</div></header>';

// ── 검색 조건 · 결과 ──
// 검색 조건 — 대표 조건 1줄 + [상세 검색] 펼침 (10/14)
// 1줄 = 문서 분류 · 문서 번호 · 문서 명 · 작업현황 · 등록일(기간 2칸) — 6열 칸 폭에 5항목. 펼치면 버전 · 등록자 · 수정자 · 수정일
// 접혀 있을 때 숨은 조건에 값이 있으면 버튼에 개수(이 화면은 등록자 · 수정일에 값 → 2)
let searchUid = 0;
const searchForm = ({ open = false } = {}) => {
  const id = 'scr-search-detail-' + (++searchUid);
  return '<div class="seach_arm"><div class="leftbt">' + svg(I.filter, 16) + '<h4>검색 조건</h4></div>' +
  '<div class="rightbt">' + btn('검색', 'btn--primary btn--filled', I.search) +
  '<button type="button" class="btn btn--secondary btn--outlined btn--expand" aria-expanded="' + open + '" aria-controls="' + id + '">' + EXPAND_LABEL + '</button>' +
  btn('검색 조건 초기화', 'btn--secondary btn--transparent', I.reset) + '</div></div>' +
  '<div class="pro_table"><div class="form-grid-2 form-grid--6">' +
  field('문서 분류', '<input class="input" aria-label="문서 분류" value="/제품 문서/설계 문서" readonly>') +
  field('문서 번호', '<input class="input" aria-label="문서 번호">') +
  field('문서 명', '<input class="input" aria-label="문서 명">') +
  field('작업현황', sel('작업현황', ['전체', '작업 중', '검토 중', '승인', '반려'])) +
  field('등록일', range('등록일', '2026-09-01', ''), { span: 2 }) +
  '</div><div class="search-detail" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2 form-grid--6"><div class="search-divider">상세 검색</div>' +
  field('버전', '<div class="radio-group" role="radiogroup" aria-label="버전">' +
    '<label class="radio"><input type="radio" name="' + id + '-ver" checked><span class="radio__mark"></span>최신 버전</label>' +
    '<label class="radio"><input type="radio" name="' + id + '-ver"><span class="radio__mark"></span>모든 버전</label></div>', { span: 2 }) +
  field('등록자', sel('등록자', ['', '김도윤', '이서연'])) +
  field('수정자', sel('수정자', ['', '김도윤', '이서연'])) +
  field('수정일', range('수정일', '', ''), { span: 2 }) +
  '</div></div></div>';
};

// 쪽 이동 — 이전 버전 화면에는 없음(개발 요청: 쪽을 나누면 다음 쪽 데이터가 검색 조건 · 정렬에 걸리지 않아서). 기본 화면은 이전 버전대로 빼고,
// 쪽 이동은 「시안 2」에만 둠 — 검색 · 정렬을 전체 결과에 먼저 하고 쪽을 나누는 경우의 DS 제안
const pager = () =>
  '<nav class="ui-pagination" aria-label="쪽 이동">' +
  '<button type="button" class="ui-pagination__btn ui-pagination__btn--nav is-disabled" aria-label="이전 쪽">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="ui-pagination__btn is-active" aria-current="page">1</button>' +
  [2, 3, 4, 5].map((n) => '<button type="button" class="ui-pagination__btn">' + n + '</button>').join('') +
  '<span class="ui-pagination__ellipsis">…</span><button type="button" class="ui-pagination__btn">7</button>' +
  '<button type="button" class="ui-pagination__btn ui-pagination__btn--nav" aria-label="다음 쪽">' + svg(I.next, 14) + '</button></nav>';

const grid = ({ paging = false } = {}) =>
  '<div class="seach_arm"><div class="leftbt">' + svg(I.list, 16) + '<h4>검색 결과 (' + ROWS.length + '/' + (paging ? 128 : ROWS.length) + ')</h4>' +
  sel('한 쪽에 보일 개수', ['20', '50', '100']) + '</div>' +
  // [선택 일괄 결재] 아이콘 없음 — 이전 버전 캡처(03 · 06 · 07) 그대로. ✓ 아이콘은 근거 없이 넣었던 것(10/16 대조)
  '<div class="rightbt">' + btn('선택 일괄 결재', 'btn--primary btn--filled') +
  '<button type="button" class="btn btn--excel">' + svg(I.excel, 14) + 'Excel</button>' +
  btn('필터 초기화', 'btn--secondary btn--transparent', I.reset) + '</div></div>' +
  '<div class="table_list"><div class="list"><table class="grid-table"><colgroup>' +
  '<col style="width:52px"><col style="width:44px"><col style="width:140px"><col><col style="width:56px"><col style="width:64px"><col style="width:96px">' +
  '<col style="width:84px"><col style="width:104px"><col style="width:84px"><col style="width:104px"></colgroup>' +
  '<thead><tr><th>No.</th><th>' + ck('전체 선택') + '</th><th>문서 번호</th><th>문서 명</th><th>파일</th><th>버전</th><th>작업현황</th><th>등록자</th><th>등록일</th><th>수정자</th><th>수정일</th></tr></thead><tbody>' +
  ROWS.map((r, i) => '<tr' + (i === 1 ? ' class="is-selected"' : '') + '>' +
    // 정렬 = DS .grid-table 기본 가운데(이전 버전 그리드), 문서 명만 왼쪽(.is-left)
    '<td>' + (i + 1) + '</td><td>' + ck(r[0] + ' 선택', i === 1 ? ' checked' : '') + '</td>' +
    '<td><a href="#" class="grid-custom-rows-link">' + r[0] + '</a></td><td class="is-left">' + r[1] + '</td>' +
    '<td>' + svg(I.file, 16) + '</td><td>' + r[2] + '</td><td>' + chip(r[3]) + '</td>' +
    '<td>' + r[4] + '</td><td>' + r[5] + '</td><td>' + r[6] + '</td><td>' + r[7] + '</td></tr>').join('') +
  '</tbody></table></div>' + (paging ? pager() : '') + '</div>';

const listScreen = ({ paging = false } = {}) =>
  '<div style="display:flex;height:100%">' + lnb() + sub() +
  '<div class="main-layout"><div class="main-body"><div class="main-nav-layout"><div class="main-area">' + gnb() +
  '<div class="main-content"><div class="searchLayout"><div class="product">' + searchForm() + grid({ paging }) + '</div></div></div>' +
  '</div></div></div></div></div>';

// ── 등록 창 — 제품에서는 새 창(.pop). 여기서는 목록 위에 띄운 창 ──
// 섹션 머리 — DS .pop .seach_arm(바탕 없는 제목줄) + .section-toggle. 펼침 = 빼기, 접힘 = 더하기
const section = (title, open = true, right = '') =>
  '<div class="seach_arm scr-sec"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="' + open + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
  svg(open ? I.minus : I.plus, 16) + '</button><h4>' + title + '</h4></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>';

// 첨부 — 파일 형식 아이콘은 _fileicon.js(상세 창 첨부 목록과 같은 것)
const FILES = [
  ['BRK-20417_조립사양_B2.pdf', 'pdf', '1.8 MB'],
  ['체결토크_시험결과.xlsx', 'xlsx', '96 KB'],
  ['BRK-20417_캘리퍼.dwg', 'dwg', '3.2 / 5.0 MB', 64],
  ['설계검토_회의록.docx', 'docx', '42 KB'],
];
const uploader = () =>
  '<div class="resumable"><div class="resumable-bar">' +
  '<div class="resumable-label"><span class="resumable-label__name">' + FILES.length + '개 · 올리는 중 1개</span><a href="#" class="text-link no-arrow" download>(양식) 사양서 양식.docx</a></div>' +
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
  '<div class="contents">' + section('기본 정보', true, '<span class="section-meta"><span class="required" aria-hidden="true"></span> 필수</span>') +
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

// ── 홈 대시보드 — 두 번째 메뉴 패널 없음. 위 = 프로필 카드 + 숫자 카드 3, 아래 = .card-grid 3열 × 2줄 ──
const more = (t = '전체 보기') => '<a href="#" class="scr-more">' + t + svg(I.next, 12) + '</a>';
const cardHead = (title, count, right = '') =>
  '<div class="card-header"><h2 class="card-title">' + title + (count !== undefined ? '<span class="card-title-count">' + count + '</span>' : '') + '</h2>' + right + '</div>';
const tile = (icon, tone) => '<span class="scr-tile scr-tile--' + tone + '">' + svg(I[icon], 20) + '</span>';
const STATS = [
  ['inbox', 'brand', '결재 대기', 2, '건'],
  ['doc', 'info', '작업 중인 내 문서', 4, '건'],
  ['clock', 'warning', '이번 주 마감 태스크', 3, '건'],
];
const profile = () =>
  '<section class="card scr-profile" aria-label="내 정보"><div><p class="scr-profile__date">2026년 10월 13일 화요일</p>' +
  '<h1 class="scr-profile__hello">김도윤 님, 좋은 오후예요</h1><p class="scr-profile__meta">설계1팀 · 선임연구원</p></div>' +
  '<span class="scr-profile__avatar" aria-hidden="true">김</span></section>';
const stat = ([icon, tone, label, n, unit]) =>
  '<section class="card scr-stat"><div class="scr-stat__body">' + tile(icon, tone) +
  '<div><p class="scr-stat__label">' + label + '</p><p class="scr-stat__num">' + n + '<span>' + unit + '</span></p></div></div>' +
  more('자세히 보기') + '</section>';

// 내 업무 구성 — 도넛. 차트 색 토큰이 DS에 아직 없어서 아이콘 신호색을 빌려 씀
const MIX = [['문서', 12, '--color-icon-brand'], ['도면', 8, '--color-icon-success'], ['부품', 5, '--color-icon-warning'], ['설계 변경', 3, '--color-icon-muted']];
const donut = () => {
  const total = MIX.reduce((a, m) => a + m[1], 0);
  let at = 0;
  const arcs = MIX.map(([, n, tok]) => {
    const p = n / total * 100;
    const a = '<circle cx="21" cy="21" r="15.915" fill="none" stroke-width="5" stroke-dasharray="' + (p - 0.8).toFixed(2) + ' ' + (100 - p + 0.8).toFixed(2) + '" stroke-dashoffset="' + (25 - at).toFixed(2) + '" style="stroke:var(' + tok + ')"/>';
    at += p; return a;
  }).join('');
  return '<div class="scr-donut"><svg viewBox="0 0 42 42" width="148" height="148" role="img" aria-label="내 업무 ' + total + '건 — ' + MIX.map((m) => m[0] + ' ' + m[1]).join(', ') + '">' +
    '<circle cx="21" cy="21" r="15.915" fill="none" stroke-width="5" style="stroke:var(--color-bg-muted)"/>' + arcs + '</svg>' +
    '<div class="scr-donut__center"><b>' + total + '</b><span>전체</span></div></div>' +
    '<ul class="scr-legend">' + MIX.map(([t, n, tok]) => '<li><i style="background:var(' + tok + ')"></i>' + t + '<b>' + n + '</b><span>' + Math.round(n / total * 100) + '%</span></li>').join('') + '</ul>';
};
const APPROVALS = [['검토', '결재 대기', '하우징 재질 변경 검토 보고서', '10-13'], ['검토', '결재 대기', '모터 마운트 진동 시험 계획서', '10-12'], ['승인', '승인', '브래킷 체결 토크 시험 성적서', '10-09'], ['반려', '반려', '실링 고무 경도 측정 결과', '10-08'], ['승인', '승인', '방열판 핀 간격 해석 자료', '10-07']];
const TASKS = [['danger', '1일 지남', '캘리퍼 조립 사양 검토 — BRK-20417', '10-12'], ['warning', 'D-1', '하우징 재질 변경 승인 요청', '10-14'], ['info', 'D-3', '방열판 핀 간격 해석 보완', '10-16'], ['neutral', 'D-7', '양산 이관 체크리스트 작성', '10-20'], ['neutral', 'D-9', '센서 브래킷 형상 재검토', '10-22']];
const RECENT = [['pdf', 'DOC-2610-0013 브레이크 캘리퍼 조립 사양서', '10-13'], ['dwg', 'DWG-BRK-20417 캘리퍼 조립도', '10-13'], ['xlsx', '체결 토크 시험 결과 집계', '10-12'], ['docx', '설계 검토 회의록 10월 2주', '10-10'], ['pdf', 'DOC-2610-0010 브래킷 체결 토크 시험 성적서', '10-09']];
const SHORTCUTS = [['doc', '문서 등록'], ['drawing', '도면 등록'], ['part', '부품 검색'], ['change', '설계 변경 요청'], ['project', '프로젝트 현황'], ['inbox', '결재함']];
const li = (lead, title, date) => '<li><a href="#">' + lead + '<span class="item-title">' + title + '</span><span class="item-date">' + date + '</span></a></li>';
const homeBody = () =>
  '<div class="scr-home"><div class="scr-home__top">' + profile() + STATS.map(stat).join('') + '</div>' +
  '<div class="card-grid card-grid--3 scr-home__grid">' +
  '<section class="card">' + cardHead('내 업무 구성') + '<div class="scr-mix">' + donut() + '</div></section>' +
  '<section class="card">' + cardHead('결재 업무', 2, more('최근 5건 · 전체 보기')) + '<ul class="card-list">' +
    APPROVALS.map(([k, label, t, d]) => li('<span class="status-chip status-chip--' + STATUS[k][0] + '">' + label + '</span>', t, d)).join('') + '</ul></section>' +
  '<section class="card">' + cardHead('활동 업무', 0) +
    '<div class="empty empty--card" role="status"><span class="empty__icon">' + svg(I.inbox, 32) + '</span>' +
    '<p class="empty__title">진행 중인 활동 업무가 없어요</p><p class="empty__desc">배정된 활동이 생기면 여기에 보여요.</p></div></section>' +
  '<section class="card">' + cardHead('나의 태스크', TASKS.length, more()) + '<ul class="card-list">' +
    TASKS.map(([tone, label, t, d]) => li('<span class="status-chip status-chip--' + tone + '">' + label + '</span>', t, d)).join('') + '</ul></section>' +
  '<section class="card">' + cardHead('최근 작업 중인 데이터', undefined, more()) + '<ul class="card-list scr-recent">' +
    RECENT.map(([ext, t, d]) => li(fileIcon(ext), t, d)).join('') + '</ul></section>' +
  '<section class="card">' + cardHead('바로가기', undefined, '<a href="#" class="scr-more">' + svg(I.plus, 12) + '편집</a>') +
    '<ul class="scr-shortcuts">' + SHORTCUTS.map(([ic, t]) => '<li><a href="#">' + tile(ic, 'brand') + '<span>' + t + '</span>' + svg(I.next, 14) + '</a></li>').join('') + '</ul></section>' +
  '</div></div>';
const homeScreen = () =>
  '<div style="display:flex;height:100%">' + lnb('') +
  '<div class="main-layout"><div class="main-body"><div class="main-nav-layout"><div class="main-area">' + gnb(['Home']) +
  '<div class="main-content">' + homeBody() + '</div>' +
  '</div></div></div></div></div>';

// ── 프로젝트 상세 — 왼쪽 산출물 구조(WBS) 패널 + 오른쪽 상세. DS detail-page 컴포넌트를 그대로 씀 ──
// .divide-detail-layout > .left-panel(.left-actions · .left-legend · .left-search) + .right-panel(.detail-header · .section-toggle · .progress-bar)
const PS = {   // 진행 상태 — 글자 · 진행률 막대 · 상태 칩 · 범례 기호
  done: ['완료', 'success', '<path d="M5 12l4 4 10-10"/>'],
  progress: ['진행', 'info', '<path d="M9 6l6 6-6 6"/>'],
  delay: ['지연', 'danger', '<path d="M12 6v7M12 17.5v.5"/>'],
  plan: ['예정', 'neutral', '<path d="M12 7v5l3 2"/>'],
  hold: ['보류', 'warning', '<path d="M9 7v10M15 7v10"/>'],
};
const pchip = (k) => '<span class="status-chip status-chip--' + PS[k][1] + '">' + PS[k][0] + '</span>';
// 계획 표식이 있을 때 화면 읽기 문구 — 「진행률 58%, 계획 64%, 6%p 늦음」
const planText = (pct, plan) => '진행률 ' + pct + '%, 계획 ' + plan + '%, ' + (plan > pct ? (plan - pct) + '%p 늦음' : plan < pct ? (pct - plan) + '%p 빠름' : '계획대로');
const pbar = (k, pct, name, label = true, plan) => '<div class="progress-bar progress-bar--' + k + '" role="progressbar" aria-label="' + name + ' 진행률" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"' +
  (plan === undefined ? '' : ' aria-valuetext="' + planText(pct, plan) + '"') + '>' +
  '<div class="pbar-fill" style="width:' + pct + '%"></div>' + (label ? '<span class="progress-bar__label">' + pct + '%</span>' : '') +
  (plan === undefined ? '' : '<span class="progress-bar__plan" style="--plan:' + plan + '%" aria-hidden="true"></span>') + '</div>';
const WBS = [
  [0, '브레이크 캘리퍼 경량화', 'delay', 'open'],
  [1, '1. 기획', 'done', 'open'], [2, '1.1 요구사항 정의서', 'done'], [2, '1.2 개발 계획서', 'done'],
  [1, '2. 설계', 'progress', 'open'], [2, '2.1 하우징 3D 모델', 'done'], [2, '2.2 조립 도면', 'progress', '', true], [2, '2.3 설계 검토(DR)', 'delay'],
  [1, '3. 시작품', 'delay', 'open'], [2, '3.1 시작품 발주', 'delay'], [2, '3.2 시작품 조립', 'plan'],
  [1, '4. 검증', 'plan', 'closed'], [1, '5. 양산 이관', 'hold', 'closed'],
];
const leftPanel = () =>
  '<aside class="left-panel" aria-label="산출물 구조">' +
  '<div class="left-actions">' + [['doc', '산출물'], ['task', '태스크'], ['change', '이슈']].map(([ic, t]) =>
    '<button type="button" class="left-action-btn">' + svg(I[ic]) + t + '</button>').join('') + '</div>' +
  '<div class="left-legend">' + ['done', 'progress', 'delay', 'plan'].map((k) =>
    '<span class="legend-item"><span class="legend-dot" style="background:var(--color-progress-' + k + '-end)">' + svg(PS[k][2], 12) + '</span>' + PS[k][0] + '</span>').join('') + '</div>' +
  '<div class="left-search"><input class="input" aria-label="태스크 검색" placeholder="태스크 검색">' +
  '<button type="button" class="btn btn--secondary btn--outlined left-search-btn">검색</button></div>' +
  '<ul class="tree scr-wbs" role="tree" aria-label="산출물 구조">' +
  WBS.map(([lv, t, k, open, on]) => '<li class="tree__item" role="treeitem"' + (open ? ' aria-expanded="' + (open === 'open') + '"' : '') + (on ? ' aria-selected="true"' : '') +
    ' style="--tree-level:' + lv + '"><span class="tree__caret">' + (open ? svg(open === 'open' ? I.down : I.next, 12) : '') + '</span>' +
    '<span class="output-row"><span class="output-dot" style="background:var(--color-progress-' + k + '-end)" title="' + PS[k][0] + '"></span><span class="output-label">' + t + '</span></span></li>').join('') +
  '</ul></aside>';

// 섹션 머리 — DS .seach_arm + .section-toggle (등록 창과 같은 토글). 펼침 = 빼기, 접힘 = 더하기
const dsec = (title, open = true, right = '') =>
  '<div class="seach_arm"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="' + open + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '">' +
  svg(open ? I.minus : I.plus, 16) + '</button><h3>' + title + '</h3></div>' + (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>';
const ro = (label, value, span = 0) => field(label, '<div class="ff-readonly">' + value + '</div>', { span });
// 단계 — 이름 · 상태 · 실적 % · 기간 · 계획 %(기준일 10-13). 계획 0이면 표식 없음
const PHASES = [['기획', 'done', 100, '07-01 ~ 07-31', 100], ['설계', 'progress', 72, '08-01 ~ 10-24', 87], ['시작품', 'delay', 25, '09-22 ~ 11-07', 46], ['검증', 'plan', 0, '11-10 ~ 12-05', 0], ['양산 이관', 'hold', 0, '12-08 ~ 12-18', 0]];
const TASK_ROWS = [
  ['조립 도면 작성', '설계', '김도윤', '2026-10-17', '', 70, 'progress'],
  ['설계 검토(DR) 자료 준비', '설계', '이서연', '2026-10-10', '', 40, 'delay'],
  ['하우징 3D 모델', '설계', '박지훈', '2026-09-26', '2026-09-25', 100, 'done'],
  ['시작품 발주', '시작품', '최하은', '2026-10-08', '', 20, 'delay'],
  ['제동 성능 시험 계획', '검증', '정우진', '2026-11-06', '', 0, 'plan'],
];
const detailBody = () =>
  '<div class="divide-detail-layout">' + leftPanel() +
  '<div class="right-panel scr-detail">' +
  '<div class="detail-header"><div class="detail-header__title"><span class="detail-icon">' + svg(I.project, 24) + '</span>' +
  '<h2>브레이크 캘리퍼 경량화 개발</h2><span class="detail-code">PJT-2026-014</span>' + pchip('delay') + '</div>' +
  '<div class="detail-header__actions">' + btn('수정', 'btn--secondary btn--outlined') + btn('태스크 추가', 'btn--secondary btn--outlined', I.plus) + btn('결재 요청', 'btn--primary btn--filled') + '</div></div>' +
  dsec('기본 정보') +
  '<div class="pro_table"><div class="form-grid-2 form-grid--4 scr-cols-4">' +
  ro('프로젝트 번호', 'PJT-2026-014') + ro('제품군', '제동 부품') + ro('PM', '김도윤 · 설계1팀') + ro('개발 단계', '설계 검증 (DV)') +
  ro('계획 기간', '2026-07-01 ~ 2026-12-18', 2) + ro('실적 시작일', '2026-07-03') + ro('관리 등급', 'A · 중점 관리') +
  '</div></div>' +
  dsec('진행 현황', true, '<span class="section-meta"><span class="progress-plan-key" aria-hidden="true"></span>계획 · 기준 2026-10-13</span>') +
  '<div class="pro_table scr-progress"><div class="scr-progress__top">' +
  '<div class="status-block status-block--delay"><div class="status-segments status-segments--delay">' + '<span class="status-segments__bar"></span>'.repeat(5) + '</div><span class="status-text"></span></div>' +
  '<div class="scr-progress__main"><div class="scr-progress__meta"><b>전체 진행률</b><span>계획 64% · 실적 58% · <em>6%p 늦음</em></span></div>' +
  '<div class="progress-row">' + pbar('delay', 58, '전체', true, 64) + '</div></div>' +
  '<dl class="scr-kv"><div><dt>남은 기간</dt><dd>66일</dd></div><div><dt>지연 태스크</dt><dd class="is-danger">2건</dd></div><div><dt>완료 태스크</dt><dd>9 / 21</dd></div></dl></div>' +
  '<ul class="scr-phases">' + PHASES.map(([n, k, pct, d, plan]) =>
    '<li><span class="scr-phases__name">' + n + '</span>' + pbar(k, pct, n, true, plan > 0 ? plan : undefined) + '<span class="scr-phases__date">' + d + '</span>' + pchip(k) + '</li>').join('') + '</ul></div>' +
  dsec('태스크', true, '<span class="section-meta">전체 <b>21</b> · 지연 <b>2</b></span>') +
  '<div class="table_list scr-tasks"><div class="list"><table class="grid-table"><colgroup>' +
  '<col style="width:48px"><col><col style="width:80px"><col style="width:84px"><col style="width:104px"><col style="width:104px"><col style="width:150px"><col style="width:84px"></colgroup>' +
  '<thead><tr><th>No.</th><th>태스크</th><th>단계</th><th>담당자</th><th>계획 종료</th><th>실적 종료</th><th>진행률</th><th>상태</th></tr></thead><tbody>' +
  TASK_ROWS.map((r, i) => '<tr' + (i === 0 ? ' class="is-selected"' : '') + '><td>' + (i + 1) + '</td><td class="is-left"><a href="#" class="grid-link">' + r[0] + '</a></td>' +
    '<td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td><td>' + (r[4] || '—') + '</td>' +
    '<td>' + pbar(r[6], r[5], r[0]) + '</td><td>' + pchip(r[6]) + '</td></tr>').join('') +
  '</tbody></table></div></div>' +
  dsec('산출물 문서', false, '<span class="section-meta">14건</span>') +
  '</div></div>';
const detailScreen = () =>
  '<div style="display:flex;height:100%">' + lnb('프로젝트') +
  '<div class="main-layout"><div class="main-body"><div class="main-nav-layout"><div class="main-area">' + gnb(['Home', '프로젝트', '프로젝트 상세']) +
  '<div class="main-content">' + detailBody() + '</div>' +
  '</div></div></div></div></div>';

// ── 로그인 — 왼쪽 브랜드 패널(딥 패널 + 분자 그림) + 오른쪽 로그인 폼. 메뉴 · 상단 바 없음 ──
// 그림은 직접 그린 SVG — 색은 패널 위 글자 토큰을 옅게 써서 브랜드 · 모드를 따라감. 사진 · 고객사 로고 · 연락처는 쓰지 않음
const ORB = (cx, cy, r) =>
  '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#scr-orb)" stroke-width="1.5" style="stroke:var(--color-text-on-panel);stroke-opacity:.22"/>' +
  '<ellipse cx="' + (cx - r * 0.35) + '" cy="' + (cy - r * 0.4) + '" rx="' + (r * 0.28) + '" ry="' + (r * 0.16) + '" transform="rotate(-30 ' + (cx - r * 0.35) + ' ' + (cy - r * 0.4) + ')" style="fill:var(--color-text-on-panel);fill-opacity:.18"/>';
const BOND = (x1, y1, x2, y2) =>
  '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke-width="14" stroke-linecap="round" style="stroke:var(--color-text-on-panel);stroke-opacity:.08"/>' +
  '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke-width="3" stroke-linecap="round" style="stroke:var(--color-text-on-panel);stroke-opacity:.2"/>';
const MOLECULE =
  '<svg class="scr-login__art" viewBox="0 0 600 852" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">' +
  '<defs><radialGradient id="scr-orb" cx="38%" cy="32%" r="72%">' +
  '<stop offset="0" style="stop-color:var(--color-text-on-panel);stop-opacity:.16"/>' +
  '<stop offset=".7" style="stop-color:var(--color-text-on-panel);stop-opacity:.03"/>' +
  '<stop offset="1" style="stop-color:var(--color-text-on-panel);stop-opacity:.12"/></radialGradient></defs>' +
  [[60, 120, 3], [300, 40, 2], [520, 120, 4], [140, 300, 2], [560, 700, 3], [300, 790, 2]].map(([x, y, r]) =>
    '<circle cx="' + x + '" cy="' + y + '" r="' + r * 6 + '" style="fill:var(--color-text-on-panel);fill-opacity:.04"/>').join('') +
  BOND(420, 300, 540, 440) + BOND(540, 440, 640, 360) + BOND(540, 440, 420, 610) + BOND(420, 300, 360, 180) +
  ORB(360, 180, 30) + ORB(420, 300, 54) + ORB(640, 360, 70) + ORB(540, 440, 96) + ORB(420, 610, 72) + ORB(40, 650, 66) +
  '</svg>';
const loginScreen = () =>
  '<div class="scr-login">' +
  '<section class="scr-login__panel" aria-label="서비스 소개">' + MOLECULE +
  '<div class="scr-login__brand">' + LOGO + '<span>Enterprise PLM</span></div>' +
  '<div class="scr-login__hero"><p class="scr-login__eyebrow">PLM SYSTEM</p><h2>Product Lifecycle<br>Management</h2>' +
  '<p>제품 개발의 전 과정을 하나로 잇는 통합 PLM 플랫폼.</p></div>' +
  '<div class="scr-login__contact"><p class="scr-login__eyebrow">SERVICE CONTACT</p><p>기술 지원 · help@example.com</p><p>CAD 지원 · cad@example.com</p></div>' +
  '</section>' +
  '<main class="scr-login__main"><div class="scr-login__box">' +
  '<div class="scr-login__logo">' + LOGO + '<b>Enterprise PLM</b></div>' +
  '<h1>환영합니다</h1><p class="scr-login__lead">로그인 후 PLM 시스템을 이용해 주세요.</p>' +
  '<div class="scr-login__form">' +
  '<div class="scr-login__field"><label for="scr-login-id">아이디</label><input class="input input--lg" id="scr-login-id" autocomplete="username" placeholder="사번 또는 ID 입력"></div>' +
  '<div class="scr-login__field"><label for="scr-login-pw">비밀번호</label><input class="input input--lg" id="scr-login-pw" type="password" autocomplete="current-password" placeholder="비밀번호 입력"></div>' +
  '<label class="checkbox"><input type="checkbox">아이디 저장</label>' +
  '<button type="button" class="btn btn--primary btn--filled btn--lg scr-login__submit">로그인</button>' +   // 예시 화면 — 제출 없음
  '</div><p class="scr-login__copy">© 2026 Enterprise PLM · 가상 화면</p></div></main></div>';

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

// ── 화면 지도 (TD-104 반영 7) ── 화면마다 영역 상자 + 영역 이름 + 쓰는 블록 · 컴포넌트. 「언제」 한 줄로 어떤 화면을 고르는지
// 상자 색 = 토큰(브랜드 · 화면 모드를 따름). 문서용 그림이라 화면 마크업과 따로
const R = (area, name, uses = '', kind = '') => '<div class="scr-map__r' + (kind ? ' scr-map__r--' + kind : '') + '" style="grid-area:' + area + '">' +
  (name ? '<b>' + name + '</b>' : '') + (uses ? '<span>' + uses + '</span>' : '') + '</div>';
const MAPS = [
  ['로그인', '처음 들어올 때', '"panel form"', '1fr 1fr', '1fr',
    R('panel', '브랜드 패널', '서비스 소개 · 문의처', 'panel') + R('form', '로그인 폼', 'Input · Checkbox · Button', 'focus')],
  ['홈', '로그인 뒤 첫 화면 — 할 일 요약', '"rail top" "rail info" "rail cards"', '16px 1fr', '16px auto 1fr',
    R('rail', '', '', 'nav') + R('top', '상단 바', '', 'bar') + R('info', '내 정보 · 숫자 카드', 'Card') + R('cards', '카드 3열 × 2', 'Card · Empty', 'focus')],
  ['문서 검색', '목록에서 조건으로 찾을 때', '"rail sub top" "rail sub search" "rail sub list"', '16px 24% 1fr', '16px auto 1fr',
    R('rail', '', '', 'nav') + R('sub', '메뉴 패널', '메뉴 · 폴더 트리', 'nav') + R('top', '상단 바', '', 'bar') +
    R('search', '검색 조건', 'SearchForm', 'focus') + R('list', '결과 목록', 'Table · Status Chip', 'focus')],
  ['문서 등록', '새로 등록 · 편집할 때', '"title" "form" "file"', '1fr', '16px 1fr auto',
    R('title', '창 제목 줄', '', 'bar') + R('form', '접는 섹션 · 2열 폼', 'Accordion · Input · Date Picker', 'focus') + R('file', '첨부', '업로더')],
  ['프로젝트 상세', '하나를 열어 자세히 보고 관리할 때', '"rail tree top" "rail tree head" "rail tree sec"', '16px 24% 1fr', '16px auto 1fr',
    R('rail', '', '', 'nav') + R('tree', '산출물 패널', '트리 · 상태 점', 'nav') + R('top', '상단 바', '', 'bar') +
    R('head', '상세 머리', 'Button · Status Chip') + R('sec', '접는 섹션', 'Accordion · Progress · Table', 'focus')],
];
export const 화면_지도 = {
  parameters: { controls: { disable: true } },
  render: () => '<div class="scr-maps">' + MAPS.map(([name, when, areas, cols, rows, inner]) =>
    '<figure class="scr-map"><figcaption><b>' + name + '</b><span>' + when + '</span></figcaption>' +
    '<div class="scr-map__frame" style="grid-template-areas:' + areas.replace(/"/g, "'") + ';grid-template-columns:' + cols + ';grid-template-rows:' + rows + '">' + inner + '</div></figure>').join('') + '</div>',
};

// ── 상세 머리 — 보기 · 편집 중 · 잠김 (TD-104 반영 5 · 업무 정책) ── 같은 머리에서 버튼만 바뀐다
// 잠김 = 다른 사람이 수정 중. 편집 버튼은 aria-disabled(포커스는 받음) + 이유 문구를 늘 보이게, 버튼이 aria-describedby 로 그 문구를 읽음
const LOCK = '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>';
const headTitle = (extra = '') => '<div class="detail-header__title"><span class="detail-icon">' + svg(I.project, 24) + '</span>' +
  '<h2>브레이크 캘리퍼 경량화 개발</h2><span class="detail-code">PJT-2026-014</span>' + pchip('delay') + extra + '</div>';
const headView = () => '<div class="detail-header">' + headTitle() + '<div class="detail-header__actions">' +
  btn('수정', 'btn--secondary btn--outlined') + btn('태스크 추가', 'btn--secondary btn--outlined', I.plus) + btn('결재 요청', 'btn--primary btn--filled') + '</div></div>';
const headEdit = () => '<div class="detail-header">' + headTitle() + '<div class="detail-header__actions">' +
  btn('취소', 'btn--secondary btn--transparent') + btn('저장', 'btn--primary btn--filled') + '</div></div>';
const headLocked = () => '<div class="detail-header">' +
  headTitle('<span class="scr-lock" id="lock-reason">' + svg(LOCK, 14) + '김도윤 님이 수정 중 · 10:24부터</span>') + '<div class="detail-header__actions">' +
  '<button type="button" class="btn btn--secondary btn--outlined" aria-disabled="true" aria-describedby="lock-reason">수정</button>' +
  '<button type="button" class="btn btn--secondary btn--outlined" aria-disabled="true" aria-describedby="lock-reason">' + svg(I.plus, 14) + '태스크 추가</button>' +
  btn('결재 요청', 'btn--primary btn--filled') + '</div></div>';
const headStage = (label, inner) => '<div class="scr-state"><p class="scr-state__label">' + label + '</p><div class="scr-detail scr-state__box">' + inner + '</div></div>';
export const 상세_머리_상태 = {
  parameters: src([headView(), headEdit(), headLocked()].join('\n')),
  render: () => '<div class="scr-states">' + headStage('보기', headView()) + headStage('편집 중', headEdit()) + headStage('잠김 — 다른 사람이 수정 중', headLocked()) + '</div>',
};

export const 로그인 = {
  parameters: src(loginScreen()),
  render: () => frame(loginScreen()),
};

export const 홈 = {
  parameters: src(homeBody()),
  render: () => frame(homeScreen()),
};

export const 문서_검색 = {
  parameters: src(listScreen()),
  render: () => wireSearchDetail(frame(listScreen())),
};

// 시안 2 — 쪽 이동을 넣은 DS 제안(이전 버전에는 없음, 위 pager 주석)
export const 문서_검색_시안_2 = {
  parameters: src(listScreen({ paging: true })),
  render: () => wireSearchDetail(frame(listScreen({ paging: true }))),
};

export const 문서_등록 = {
  parameters: src(registerPop()),
  render: () => wireSearchDetail(frame(listScreen() + '<div class="scr-dim"></div><div class="scr-window">' + registerPop() + '</div>')),
};

export const 프로젝트_상세 = {
  parameters: src(detailBody()),
  render: () => frame(detailScreen()),
};
