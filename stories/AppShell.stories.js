// Navigation/App Shell — 문서 화면은 AppShell.mdx. 모든 업무 화면이 함께 쓰는 틀: 상단 바(GNB) · 페이지 머리 · 보조 메뉴 패널
// 아이콘 메뉴(.main-menu) 항목 · 보조 메뉴(.ui-submenu)는 이전 버전 개발 마크업 그대로 — 값만 DS 토큰 (TD-45 45-3)
import { railLogo } from './_logo.js';
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { folderIcon } from './_fileicon.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  prev: '<path d="M15 6l-6 6 6 6"/>', next: '<path d="M9 6l6 6-6 6"/>',
  user: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>', down: '<path d="M6 9l6 6 6-6"/>', search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
};

const history = (x = '') =>
  '<div class="nav-history"><button type="button" class="nav-history-btn' + x + '" aria-label="뒤로">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="nav-history-btn" aria-label="앞으로">' + svg(I.next, 14) + '</button></div>';
const crumbs = (list) => '<div class="breadcrumb">' + list.map((c, i) => i < list.length - 1 ? '<span>' + c + '</span><span aria-hidden="true">&gt;</span>' : '<span class="crumb-current" aria-current="page">' + c + '</span>').join('') + '</div>';
const count = (title, n) => '<div class="menu-container"><button type="button" class="menu-toggle" aria-haspopup="true" aria-expanded="false"><span class="title">' + title + '</span><span class="count">' + n + '</span></button></div>';
// 사용자 메뉴 버튼 = 사용자 아이콘만(이름 없음). 누르면 사용자 메뉴(화면 모드 · 로그아웃 포함)가 펼쳐짐
const userBtn = (x = '') => '<div class="menu-container"><button type="button" class="menu-toggle' + x + '" aria-label="사용자 메뉴" aria-haspopup="true" aria-expanded="false">' + svg(I.user, 20) + '</button></div>';
const actions = (a = 2, b = 0) => '<div class="header-actions">' + userBtn() + count('결재업무', a) + count('활동업무', b) + '</div>';   // 이전 버전 상단 바 그대로: 사용자 아이콘 · 결재업무 · 활동업무만 (10/16 세영)

const gnb = ({ list = ['Home', '문서 관리', '문서 검색'], a = 2, b = 0 } = {}) =>
  '<header class="gnb"><div style="display:flex;align-items:center">' + history() + crumbs(list) + '</div>' + actions(a, b) + '</header>';
const gnbLogo = () =>
  '<header class="gnb"><div class="logo-container"><span class="logo-mark" aria-hidden="true">E</span><span class="logo-text">Enterprise PLM</span><span class="logo-version">v1.0</span></div>' + actions(3, 1) + '</header>';
const frame = (h, w = '100%') => '<div style="max-width:' + w + ';border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' + h + '</div>';

export default {
  title: 'Navigation/App Shell',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 AppShell.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 상단_바 = { parameters: { docs: { source: { code: gnb() } } }, render: () => frame(gnb()) };
export const 상단_바_로고 = { parameters: { docs: { source: { code: gnbLogo() } } }, render: () => frame(gnbLogo()) };
export const 개수_배지 = {
  render: () => '<div style="display:flex;gap:24px;align-items:center">' + count('결재업무', 0) + count('결재업무', 3) + count('결재업무', 12) + count('결재업무', '99+') + '</div>',
};
export const 페이지_머리 = {
  render: () => frame('<div style="padding:16px 24px;display:flow-root;background:var(--color-bg-subtle)"><div class="page-head" style="margin:0"><div class="page-title-area"><h1>문서 검색</h1>' +
    '<button type="button" class="favorite-icon" aria-label="즐겨찾기에 추가" aria-pressed="false" style="border:0;background:transparent;padding:0;display:inline-flex">' + svg(I.star, 18) + '</button></div>' +
    crumbs(['Home', '문서 관리', '문서 검색']) + '</div></div>'),
};
// 폴더 트리 = DS .tree — 단계는 --tree-level, 끝 항목도 꺾쇠 칸을 비워 둠 (TD-75)
const FOLDERS = [[0, '제품 문서', true], [1, '설계 문서', true, true], [2, '사양서'], [2, '시험 성적서'], [1, '품질 문서', false], [1, '양식']];
const tree = () => '<ul class="tree" role="tree" aria-label="문서 폴더">' + FOLDERS.map(([lv, t, open, on]) =>
  '<li class="tree__item" role="treeitem"' + (open !== undefined ? ' aria-expanded="' + open + '"' : '') + (on ? ' aria-selected="true"' : '') + ' style="--tree-level:' + lv + '">' +
  '<span class="tree__caret">' + (open !== undefined ? svg(open ? I.down : I.next, 12) : '') + '</span>' +
  '<span class="tree__icon">' + folderIcon(!!open) + '</span>' + t + '</li>').join('') + '</ul>';
const panel = (tabX = '') =>
  '<aside class="main-sub" aria-label="문서 관리 메뉴" style="height:360px">' +
  '<div class="main-sub-header"><h3>문서 관리</h3><button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>' +
  '<div class="main-sub-tabs" role="tablist"><button type="button" class="sub-tab is-active" role="tab" aria-selected="true">메뉴</button><button type="button" class="sub-tab' + tabX + '" role="tab" aria-selected="false">폴더</button></div>' +
  '<div class="main-sub-content"><div class="tree-section" style="margin-top:0;border-top:0"><div class="tree-controls">' +
  '<select class="select" aria-label="제품군"><option>전체 제품군</option><option>제동 부품</option></select>' +
  '<div class="tree-search-wrap">' + svg(I.search, 14) + '<input class="tree-search-input" aria-label="폴더 검색" placeholder="폴더 검색"></div></div>' +
  tree() +
  '</div></div></aside>';
export const 보조_메뉴_패널 = { parameters: { docs: { source: { code: panel() } } }, render: () => '<div style="display:flex">' + panel() + '</div>' };
export const 바닥 = { render: () => frame('<footer class="gnb-footer">© 2026 Enterprise PLM</footer>') };

// ── 아이콘 메뉴 · 보조 메뉴 (이전 버전 개발 마크업) ──
const RAIL = {
  work: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  drawing: '<path d="M4 20 20 4M4 20v-6M4 20h6"/>',
  part: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  admin: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2.5"/><path d="M8 17a4 4 0 0 1 8 0"/>',
};
// 아이콘 = mask 그림 — 제품은 메뉴마다 그림 파일 경로를 --lnb-icon 에 넣음
const railIcon = (d) => "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>') + "')";
const railItem = (ic, t, { current = false, liX = '', aX = '' } = {}) =>
  '<li class="' + liX.trim() + '"><div class="menu_icon_box"><div class="menu_icon" style="--lnb-icon:' + railIcon(RAIL[ic]) + '"><a href="#" class="' + aX.trim() + '" aria-label="' + t + '"' + (current ? ' aria-current="page"' : '') + '></a></div></div><span aria-hidden="true">' + t + '</span></li>';
const LOGO_MARK = '<svg width="34" height="34" viewBox="0 0 34 34" role="img" aria-label="홈"><rect width="34" height="34" rx="8" style="fill:var(--color-bg-brand)"/><path d="M16 10.2l6 3.45v6.9L16 24l-6-3.45v-6.9z" fill="none" stroke-width="2" stroke-linejoin="round" style="stroke:var(--color-icon-on-color)"/></svg>';
const rail = () =>
  '<aside class="main-menu" style="height:440px"><a class="lnb-logo" href="#">' + railLogo(LOGO_MARK, '홈') + '</a><nav aria-label="주 메뉴"><ul>' +
  railItem('work', '업무관리') + railItem('doc', '문서관리', { current: true }) + railItem('drawing', '도면관리') + railItem('part', '부품관리') +
  '</ul><ul>' + railItem('admin', '관리자') + '</ul></nav></aside>';
export const 아이콘_메뉴 = { parameters: { docs: { source: { code: rail() } } }, render: () => '<div style="display:flex">' + rail() + '</div>' };

const subMenu = () =>
  '<div class="ui-submenu"><ul>' +
  '<li class="ui-submenu-flat"><a href="#" aria-current="page">문서 검색</a></li>' +
  '<li class="ui-submenu-flat"><a href="#">문서 등록</a></li>' +
  '<li class="ui-submenu-group"><div class="ui-submenu-title"><a href="#" aria-expanded="true" aria-controls="sm-cr">설계 변경<span>3</span></a></div>' +
  '<ul class="ui-submenu-list" id="sm-cr"><li><a href="#">변경 요청</a></li><li><a href="#">변경 지시</a></li><li><a href="#">변경 이력</a></li></ul></li>' +
  '<li class="ui-submenu-group"><div class="ui-submenu-title"><a href="#" aria-expanded="false" aria-controls="sm-tp">양식 관리<span>2</span></a></div>' +
  '<ul class="ui-submenu-list" id="sm-tp" hidden><li><a href="#">문서 양식</a></li><li><a href="#">결재선 양식</a></li></ul></li>' +
  '</ul></div>';
const subPanel = () =>
  '<aside class="main-sub" aria-label="문서 관리 메뉴" style="height:440px"><div class="main-sub-header"><h3>문서 관리</h3><button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>' +
  '<div class="main-sub-content">' + subMenu() + '</div></aside>';
export const 보조_메뉴 = { parameters: { docs: { source: { code: subMenu() } } }, render: () => '<div style="display:flex">' + subPanel() + '</div>' };

// ── 사용자 메뉴 (이전 버전 개발 마크업) — 상단 바 사용자 아이콘을 누르면 펼침 ──
const UM = {
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  palette: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/><path d="M12 21a2 2 0 0 1 0-4h1.5a2.5 2.5 0 0 0 0-5"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
// 줄 아이콘 = mask 그림 — 제품은 줄마다 그림 파일 경로를 --row-icon 에 넣음
const umRow = (ic, label, ctrl, x = '') => '<div class="section-title' + x + '" style="--row-icon:' + railIcon(UM[ic]) + '">' + label + ctrl + '</div>';
const umLang = (x = '') => '<div class="custom-select"><div class="selected' + x + '" role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-label="언어 설정: 한국어">한국어</div>' +
  '<ul class="options" role="listbox" aria-label="언어"><li role="option" aria-selected="true" class="active">한국어</li><li role="option" aria-selected="false">영어</li></ul></div>';
const umSwitch = (on = false, x = '') => '<button type="button" class="' + x.trim() + '" role="switch" aria-checked="' + on + '" aria-label="화면 모드"></button>';
const umDownload = (x = '') => '<button type="button" class="' + x.trim() + '" aria-label="뷰어 다운로드">다운로드</button>';
const umLogout = (x = '') => '<button type="button" class="logout-btn' + x + '">' + svg(I.logout, 17) + '로그아웃</button>';
const userMenu = ({ name = '김도윤', org = '설계1팀' } = {}) =>
  '<div class="dropdown-content-top">' +
  '<div class="section user-info"><div class="user-avatar">' + svg(I.user, 18) + '</div><div class="user-meta"><span>' + name + '</span><span class="user-org">' + org + '</span></div></div>' +
  '<div class="section">' +
  umRow('map', '사이트맵', '<a href="#" aria-label="사이트맵"></a>') +
  umRow('palette', '메뉴 색상 변경', '<button type="button" class="menu-color-toggle" aria-label="메뉴 색상 변경"></button>') +
  umRow('key', '비밀번호 변경', '<a href="#" aria-label="비밀번호 변경"></a>') +
  umRow('globe', '언어 설정', umLang()) +
  umRow('moon', '화면 모드', umSwitch()) +
  umRow('download', '뷰어 다운로드', umDownload()) +
  '</div><div class="section"><div class="logoutBtn">' + umLogout() + '</div></div></div>';
export const 사용자_메뉴 = { parameters: { docs: { source: { code: userMenu() } } }, render: () => '<div style="padding:8px">' + userMenu() + '</div>' };

export const 사용자_메뉴_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시. 화면 모드 켬 = aria-checked="true" (이전 버전 마크업 #theme-toggle-button 은 다크 모드일 때) -->' } } },
  render: () => {
    enablePseudo();
    // 줄 하나만 잘라 보여 줌 — 규칙이 「로그아웃 버튼이 든 펼침」에만 걸리므로 빈 로그아웃 자리를 숨겨 둠
    const box = (h) => '<div class="dropdown-content-top" style="border-radius:0;box-shadow:none"><div class="section">' + h + '</div><div class="logoutBtn" hidden></div></div>';
    const foot = (h) => '<div class="dropdown-content-top" style="border-radius:0;box-shadow:none"><div class="section"><div class="logoutBtn">' + h + '</div></div></div>';
    const link = (x) => box(umRow('map', '사이트맵', '<a href="#" class="' + x.trim() + '" aria-label="사이트맵"></a>', x.includes('hover') ? ' ps-hover' : ''));
    const dl = (x) => box(umRow('download', '뷰어 다운로드', umDownload(x)));
    const lang = (x) => box(umRow('globe', '언어 설정', umLang(x)));
    const sw = (on, x = '') => box(umRow('moon', '화면 모드', umSwitch(on, x)));
    return matrix(['줄 링크', '내려받기', '언어', '화면 모드', '로그아웃'], [
      ['Default', [link(''), dl(''), lang(''), sw(false), foot(umLogout())]],
      ['Hovered', [link(' ps-hover'), dl(' ps-hover'), '—', '—', foot(umLogout(' ps-hover'))]],
      ['Focused', [link(' ps-focus-visible'), dl(' ps-focus-visible'), lang(' ps-focus-visible'), sw(false, ' ps-focus-visible'), foot(umLogout(' ps-focus-visible'))]],
      ['켬', ['—', '—', '—', sw(true), '—']],
    ]);
  },
};

// 아이콘 메뉴 · 보조 메뉴 상태 — Hovered · Focused 는 정지 화면 클래스(.ps-*)
export const 메뉴_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 지금 화면 = a 에 aria-current="page"(이전 버전 .active · .in 도 받음). Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    // 상태마다 영역 이름을 따로 — 같은 이름 없는 영역이 여러 개면 화면 읽기에서 구분이 안 됨(접근성 검사 landmark-unique)
    const one = (o) => '<aside class="main-menu" aria-label="아이콘 메뉴 예시 — ' + o.name + '" style="height:auto;width:60px;border:0"><nav aria-label="주 메뉴 예시 — ' + o.name + '"><ul>' + railItem('doc', '문서관리', o) + '</ul></nav></aside>';
    const flat = (o) => '<div class="ui-submenu" style="width:200px;padding:0;text-align:start"><ul><li class="ui-submenu-flat"><a href="#" class="' + (o.aX || '') + '"' + (o.current ? ' aria-current="page"' : '') + '>문서 검색</a></li></ul></div>';
    const list = (o) => '<div class="ui-submenu" style="width:200px;padding:0;text-align:start"><ul class="ui-submenu-list" style="margin-left:0"><li><a href="#" class="' + (o.aX || '') + '"' + (o.current ? ' aria-current="page"' : '') + '>변경 요청</a></li></ul></div>';
    return matrix(['아이콘 메뉴', '보조 메뉴', '3단계 목록'], [
      ['Default', [one({ name: 'Default' }), flat({}), list({})]],
      ['Hovered', [one({ name: 'Hovered', liX: 'ps-hover', aX: 'ps-hover' }), flat({ aX: 'ps-hover' }), list({ aX: 'ps-hover' })]],
      ['Focused', [one({ name: 'Focused', aX: 'ps-focus-visible' }), flat({ aX: 'ps-focus-visible' }), list({ aX: 'ps-focus-visible' })]],
      ['지금 화면', [one({ name: '지금 화면', current: true }), flat({ current: true }), list({ current: true })]],
    ]);
  },
};

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- Hovered · Pressed · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->' } } },
  render: () => {
    enablePseudo();
    const nh = (x) => '<button type="button" class="nav-history-btn' + x + '" aria-label="뒤로">' + svg(I.prev, 14) + '</button>';
    const wrapGnb = (h) => '<div class="gnb" style="height:auto;padding:4px;border:0;background:transparent;display:inline-flex">' + h + '</div>';
    const close = (x) => '<div class="main-sub-header" style="height:auto;padding:0;border:0"><button type="button" class="sub-close' + x + '" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>';
    const tab = (x, on) => '<div class="main-sub-tabs" style="border:0;width:72px"><button type="button" class="sub-tab' + (on ? ' is-active' : '') + x + '">폴더</button></div>';
    const row = (x) => [wrapGnb('<div class="nav-history" style="margin:0">' + nh(x) + '</div>'), userBtn(x), close(x), tab(x, false)];
    return matrix(['뒤로 · 앞으로', '사용자 메뉴', '패널 닫기', '패널 탭'], [
      ['Default', row('')],
      ['Hovered', row(' ps-hover')],
      ['Pressed', [wrapGnb('<div class="nav-history" style="margin:0">' + nh(' ps-active') + '</div>'), '—', '—', '—']],
      ['Focused', row(' ps-focus-visible')],
      ['선택됨', ['—', '—', '—', tab('', true)]],
    ]) + '<p class="sb-note" style="margin:8px 0 0">포커스는 버튼과 같은 2px 바깥 테두리입니다. 사용자 메뉴 · 업무 개수 버튼(.menu-toggle)은 마우스 올림 모양 없이 포커스만 있습니다.</p>';
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    path: { control: 'text', description: '위치 — 「›」 없이 쉼표로 구분 (마지막 = 지금 화면, aria-current="page")' },
    approvals: { control: 'text', description: '결재업무 개수 — `.menu-toggle .count`' },
    activities: { control: 'text', description: '활동업무 개수' },
  },
  args: { path: 'Home, 문서 관리, 문서 검색', approvals: '2', activities: '0' },
  parameters: { docs: { source: { transform: (_, { args }) => gnb({ list: String(args.path).split(',').map((x) => x.trim()).filter(Boolean), a: args.approvals, b: args.activities }) } } },
  render: (a) => frame(gnb({ list: String(a.path).split(',').map((x) => x.trim()).filter(Boolean), a: a.approvals, b: a.activities })),
};
