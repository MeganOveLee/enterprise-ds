// Screens — DS 클래스와 토큰만으로 짠 PLM 업무 화면 (실제 크기 1440 × 900, 가상 데이터)
// 문서 화면은 Screens.mdx. 도구 막대의 브랜드 · 화면 모드를 그대로 따른다.
// 마크업은 문자열 이어 붙이기 — 스토리북 색인기가 여러 줄 HTML 템플릿을 MDX로 잘못 읽는 일을 피함
import './_screens.css';

const W = 1440;
const H = 900;

// ── 아이콘 (직접 그린 선 아이콘, currentColor) ──
const svg = (d, s = 20) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  change: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v3a4 4 0 0 0 4 4h5.5"/><path d="M13 13l2.5 2.5L13 18"/>',
  part: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  project: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  approve: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',
  setting: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  prev: '<path d="M15 6l-6 6 6 6"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  clip: '<path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17.5a2 2 0 0 1-3-3l7.5-7.5"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
};

// ── 데이터 (가상) ──
const STATUS = { 작성: ['neutral', '작성 중'], 검토: ['info', '검토 중'], 승인: ['success', '승인'], 보류: ['warning', '보류'], 반려: ['danger', '반려'] };
const ROWS = [
  ['ECR-2026-0142', '브레이크 캘리퍼 홀 위치 2mm 이동', '설계 변경', '검토', '김도윤', '설계1팀', '2026-10-13', 'A.2'],
  ['ECR-2026-0141', '하우징 재질 변경 (AL6061 → AL7075)', '부품 변경', '승인', '이서연', '재료기술팀', '2026-10-12', 'B.1'],
  ['ECR-2026-0139', '커넥터 핀 배열 도면 개정', '도면 개정', '작성', '박지훈', '전장설계팀', '2026-10-10', 'A.1'],
  ['ECR-2026-0137', '브래킷 체결 볼트 M8 → M10', '설계 변경', '승인', '최하은', '설계2팀', '2026-10-08', 'C.3'],
  ['ECR-2026-0136', '실링 고무 경도 조정', '부품 변경', '보류', '정우진', '재료기술팀', '2026-10-07', 'A.4'],
  ['ECR-2026-0134', '방열판 핀 간격 확대', '설계 변경', '검토', '김도윤', '설계1팀', '2026-10-06', 'B.2'],
  ['ECR-2026-0131', '조립 도면 공차 표기 정정', '도면 개정', '반려', '한지민', '품질기술팀', '2026-10-02', 'A.3'],
  ['ECR-2026-0129', '센서 브래킷 형상 단순화', '설계 변경', '승인', '오세훈', '설계2팀', '2026-09-30', 'D.1'],
  ['ECR-2026-0127', '케이블 하네스 길이 40mm 연장', '부품 변경', '검토', '윤가람', '전장설계팀', '2026-09-26', 'A.2'],
  ['ECR-2026-0124', '표면 처리 사양 변경 (아노다이징)', '부품 변경', '승인', '이서연', '재료기술팀', '2026-09-23', 'B.4'],
  ['ECR-2026-0122', '파트 리스트 품번 체계 정리', '도면 개정', '작성', '박지훈', '전장설계팀', '2026-09-19', 'A.1'],
  ['ECR-2026-0119', '모터 마운트 진동 흡수 패드 추가', '설계 변경', '보류', '최하은', '설계2팀', '2026-09-17', 'C.1'],
];

const chip = (k) => '<span class="scr-chip scr-chip--' + STATUS[k][0] + '">' + STATUS[k][1] + '</span>';
const ck = (label, extra = '') => '<label class="checkbox"><input type="checkbox" aria-label="' + label + '"' + extra + '></label>';
const dp = (label, value) =>
  '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon">' + svg(I.cal, 14) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"></div>';
const btn = (t, cls, icon = '') => '<button type="button" class="btn ' + cls + '">' + (icon ? svg(icon, 14) : '') + t + '</button>';

// ── 화면 조각 ──
const LNB = [['home', '홈'], ['doc', '문서'], ['change', '설계 변경', true], ['part', '부품'], ['project', '프로젝트'], ['approve', '결재'], ['setting', '설정']];
const lnb = () =>
  '<aside class="main-menu"><div class="scr-lnb__logo"><span class="scr-lnb__mark">P</span></div>' +
  '<nav aria-label="주 메뉴"><ul class="scr-lnb">' +
  LNB.map(([ic, t, on]) => '<li><a href="#"' + (on ? ' class="is-active" aria-current="page"' : '') + '>' + svg(I[ic]) + t + '</a></li>').join('') +
  '</ul></nav></aside>';

const gnb = () =>
  '<header class="gnb"><div class="breadcrumb"><span>설계 변경</span><span aria-hidden="true">›</span><span class="crumb-current">설계 변경 요청</span></div>' +
  '<div class="header-actions">' +
  '<button type="button" class="theme-toggle-btn" aria-label="화면 모드 바꾸기"><span class="icon-moon">' + svg(I.moon, 16) + '</span><span class="icon-sun">' + svg(I.sun, 16) + '</span></button>' +
  '<div class="user-info"><span class="scr-avatar">김</span>김도윤 <span class="scr-total">설계1팀</span></div>' +
  '<button type="button" class="logout-btn" aria-label="로그아웃">' + svg(I.logout, 18) + '</button>' +
  '</div></header>';

const searchForm = () =>
  '<div class="seach_arm"><div class="leftbt">' + svg(I.search, 16) + '<h4>검색 조건</h4></div>' +
  '<div class="rightbt">' + btn('초기화', 'btn--secondary btn--transparent') + btn('조회', 'btn--secondary btn--filled', I.search) + '</div></div>' +
  '<div class="pro_table"><table class="mainTable"><colgroup>' +
  '<col style="width:96px"><col><col style="width:96px"><col><col style="width:96px"><col></colgroup><tbody>' +
  '<tr><th scope="row">요청 번호</th><td><div class="td"><input class="input" aria-label="요청 번호" placeholder="ECR-"></div></td>' +
  '<th scope="row">제목</th><td><div class="td"><input class="input" aria-label="제목" placeholder="제목에 들어간 말"></div></td>' +
  '<th scope="row">구분</th><td><div class="td"><select class="select" aria-label="구분"><option>전체</option><option>설계 변경</option><option>부품 변경</option><option>도면 개정</option></select></div></td></tr>' +
  '<tr><th scope="row">상태</th><td><div class="td"><select class="select" aria-label="상태"><option>전체</option><option>작성 중</option><option>검토 중</option><option>승인</option><option>보류</option><option>반려</option></select></div></td>' +
  '<th scope="row">요청일</th><td><div class="td"><div class="ui-datepicker-range">' + dp('요청일 시작', '2026-09-01') + '<span class="ui-datepicker-range__sep">~</span>' + dp('요청일 끝', '2026-10-13') + '</div></div></td>' +
  '<th scope="row">요청자</th><td><div class="td"><input class="input" aria-label="요청자" placeholder="이름 또는 부서">' +
  '<label class="checkbox"><input type="checkbox" checked>내 요청만</label></div></td></tr>' +
  '</tbody></table></div>';

const grid = () =>
  '<div class="seach_arm"><div class="leftbt">' + svg(I.list, 16) + '<h4>검색 결과</h4><span class="scr-total">총 <b>128</b>건</span>' +
  '<select class="select" aria-label="한 쪽에 보일 개수"><option>20개씩</option><option>50개씩</option></select></div>' +
  '<div class="rightbt">' + '<button type="button" class="btn btn--excel">' + svg(I.down, 14) + '엑셀 다운로드</button>' +
  btn('삭제', 'btn--destructive btn--outlined') + btn('요청 등록', 'btn--primary btn--filled', I.plus) + '</div></div>' +
  '<div class="table_list"><div class="list"><table class="scr-grid"><colgroup>' +
  '<col style="width:44px"><col style="width:150px"><col><col style="width:100px"><col style="width:92px"><col style="width:84px"><col style="width:110px"><col style="width:108px"><col style="width:68px"></colgroup>' +
  '<thead><tr><th class="is-center">' + ck('전체 선택') + '</th><th>요청 번호</th><th>제목</th><th>구분</th><th>상태</th><th>요청자</th><th>부서</th><th>요청일</th><th class="is-center">버전</th></tr></thead><tbody>' +
  ROWS.map((r, i) => '<tr' + (i === 0 ? ' class="is-selected"' : '') + '>' +
    '<td class="is-center">' + ck(r[0] + ' 선택', i === 0 ? ' checked' : '') + '</td>' +
    '<td class="is-num">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + chip(r[3]) + '</td>' +
    '<td>' + r[4] + '</td><td>' + r[5] + '</td><td class="is-date">' + r[6] + '</td><td class="is-center">' + r[7] + '</td></tr>').join('') +
  '</tbody></table></div>' +
  '<nav class="ui-pagination" aria-label="쪽 이동">' +
  '<button type="button" class="ui-pagination__btn is-disabled" aria-label="이전 쪽">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="ui-pagination__btn is-active" aria-current="page">1</button>' +
  [2, 3, 4, 5].map((n) => '<button type="button" class="ui-pagination__btn">' + n + '</button>').join('') +
  '<span class="ui-pagination__ellipsis">…</span><button type="button" class="ui-pagination__btn">7</button>' +
  '<button type="button" class="ui-pagination__btn" aria-label="다음 쪽">' + svg(I.next, 14) + '</button></nav></div>';

const listScreen = () =>
  '<div style="display:flex;height:100%">' + lnb() +
  '<div class="main-layout"><div class="main-body"><div class="main-nav-layout"><div class="main-area">' + gnb() +
  '<div class="main-content"><div class="page-head"><div class="page-title-area"><h1>설계 변경 요청</h1>' +
  '<span class="favorite-icon" aria-label="즐겨찾기">' + svg(I.star, 16) + '</span></div></div>' +
  '<div class="searchLayout"><div class="product">' + searchForm() + grid() + '</div></div>' +
  '</div></div></div></div></div></div>';

// 상세 — 제품에서는 새 창(.pop). 여기서는 목록 위에 띄운 창
const detailPop = () =>
  '<div class="pop"><div class="top"><div class="top-title-area">' +
  '<span class="doc-type-badge">' + svg(I.change, 16) + '</span><h3>브레이크 캘리퍼 홀 위치 2mm 이동</h3><span class="version">A.2</span>' + chip('검토') + '</div>' +
  '<div class="top-btn-area">' + btn('수정', 'btn--secondary btn--outlined') + btn('결재 요청', 'btn--primary btn--filled') +
  '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>' +
  '<div class="tab"><ul role="tablist"><li class="is-active" role="tab" aria-selected="true">기본 정보</li><li role="tab">관련 부품 3</li><li role="tab">결재 이력</li><li role="tab">변경 이력</li></ul></div>' +
  '<div class="contents">' +
  '<div class="seach_arm"><div class="leftbt">' + svg(I.info, 16) + '<h4>기본 정보</h4></div></div>' +
  '<div class="pro_table"><dl class="detail-dl">' +
  '<dt>요청 번호</dt><dd>ECR-2026-0142</dd><dt>구분</dt><dd>설계 변경</dd>' +
  '<dt>요청자</dt><dd>김도윤 · 설계1팀</dd><dt>요청일</dt><dd>2026-10-13</dd>' +
  '<dt>대상 부품</dt><dd>BRK-20417 브레이크 캘리퍼</dd><dt>적용 예정일</dt><dd><div class="ui-datepicker" style="width:180px">' +
  '<button type="button" class="ui-datepicker__icon">' + svg(I.cal, 14) + '</button><input class="ui-datepicker__input" aria-label="적용 예정일" value="2026-10-27" readonly></div></dd>' +
  '<dt>변경 사유</dt><dd class="span-3"><textarea class="textarea" aria-label="변경 사유" readonly>조립 시 볼트 간섭 발생 — 장착 홀을 바깥쪽으로 2mm 옮겨 공구 진입 공간을 확보한다. 강도 해석 결과 안전율 1.8 → 1.7로 기준 안.</textarea></dd>' +
  '</dl></div>' +
  '<div class="seach_arm"><div class="leftbt">' + svg(I.clip, 16) + '<h4>첨부 파일</h4><span class="scr-total">2개</span></div></div>' +
  '<ul class="file-download-list">' +
  [['BRK-20417_rev-A2.pdf', '1.8 MB'], ['간섭검토_결과.xlsx', '96 KB']].map(([n, s]) =>
    '<li>' + svg(I.file, 14) + '<span class="file-name">' + n + '</span><span class="file-size">' + s + '</span>' +
    '<button type="button" class="file-dl" aria-label="' + n + ' 내려받기">' + svg(I.down, 14) + '</button></li>').join('') + '</ul>' +
  '<div class="seach_arm"><div class="leftbt">' + svg(I.approve, 16) + '<h4>결재선</h4></div></div>' +
  '<div class="table_list"><div class="list"><table class="scr-grid"><colgroup><col style="width:90px"><col style="width:160px"><col><col style="width:110px"></colgroup>' +
  '<thead><tr><th>단계</th><th>결재자</th><th>의견</th><th>처리일</th></tr></thead><tbody>' +
  '<tr><td>작성</td><td>김도윤 · 설계1팀</td><td>' + chip('승인') + '</td><td class="is-date">2026-10-13</td></tr>' +
  '<tr><td>검토</td><td>이서연 · 재료기술팀</td><td>' + chip('검토') + '</td><td class="is-date">—</td></tr>' +
  '<tr><td>승인</td><td>오세훈 · 설계2팀</td><td>' + chip('작성') + '</td><td class="is-date">—</td></tr>' +
  '</tbody></table></div></div>' +
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

export const 목록_검색 = {
  parameters: src(listScreen()),
  render: () => frame(listScreen()),
};

export const 상세_팝업 = {
  parameters: src(detailPop()),
  render: () => frame(listScreen() + '<div class="scr-dim"></div><div class="scr-window">' + detailPop() + '</div>'),
};
