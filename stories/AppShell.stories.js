// Navigation/App Shell — 문서 화면은 AppShell.mdx. 모든 업무 화면이 함께 쓰는 레이아웃: GNB · LNB(레일 · 서브 패널) · 페이지 헤더 · 푸터
// LNB 레일(.main-menu) · 서브 메뉴(.ui-submenu) 마크업은 제품 마크업 그대로, 값만 DS 토큰
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { folderIcon } from './_fileicon.js';
import { doDont } from './_dodont.js';
import { lnbMask, lnbSvg, lnbLogo } from './_lnbicons.js';

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
// 사용자 메뉴 버튼 = 사용자 아이콘 24(Figma GNB/Top bar › user — 원 없는 사람 윤곽)만, 이름 없음. 누르면 사용자 메뉴(화면 모드 · 로그아웃 포함)가 펼쳐짐
const userBtn = (x = '') => '<div class="menu-container"><button type="button" class="menu-toggle' + x + '" aria-label="사용자 메뉴" aria-haspopup="true" aria-expanded="false">' + lnbSvg('user', 24) + '</button></div>';
const actions = (a = 2, b = 0) => '<div class="header-actions">' + userBtn() + count('결재업무', a) + count('활동업무', b) + '</div>';   // GNB 오른쪽 = 사용자 아이콘 · 결재업무 · 활동업무

const gnb = ({ list = ['Home', '문서 관리', '문서 검색'], a = 2, b = 0 } = {}) =>
  '<header class="gnb"><div style="display:flex;align-items:center">' + history() + crumbs(list) + '</div>' + actions(a, b) + '</header>';
// 로고형 GNB — LNB 레일이 없는 화면 틀에서 GNB 왼쪽에 로고(TD-122). 세 가지:
//   워드마크 = 제품 이름이 든 로고 그림 한 장(.brand-logo) + 버전 — 이전 버전 상단 바(top.jsp: 로고 그림 + 버전 + 뒤로 · 앞으로)와 같은 구성
//   심볼 + 텍스트 = 마크 + 제품 이름 글자 + 버전 — 로고 그림이 마크뿐인 제품. 글자 마크(.logo-mark)를 쓰는 제품도 같은 자리
//   심볼 = 마크만, 제품 이름은 마크의 이름(aria-label) — GNB 왼쪽 자리가 좁을 때(DS 제안, 이전 버전에 없음)
// 워드마크 견본 그림 = 가상 제품 「Enterprise PLM」의 마크 + 글자를 한 장으로 그린 것(실제 회사 로고 아님)
const wordmark = () => '<svg class="brand-logo" width="168" height="28" viewBox="0 0 168 28" role="img" aria-label="Enterprise PLM">' +
  '<g transform="scale(.8235)">' + lnbLogo('', '').replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '') + '</g>' +
  '<text x="36" y="19.5" font-size="15" font-weight="700" letter-spacing=".4" style="fill:var(--color-text-base);font-family:var(--font-family-accent)">Enterprise</text>' +
  '<text x="121" y="19.5" font-size="15" font-weight="700" letter-spacing=".4" style="fill:var(--color-text-brand);font-family:var(--font-family-accent)">PLM</text></svg>';
const LOGO = {
  wordmark: () => wordmark() + '<span class="logo-version">v1.0</span>',
  symbolText: () => lnbLogo('', 'brand-logo') + '<span class="logo-text">Enterprise PLM</span><span class="logo-version">v1.0</span>',
  symbol: () => lnbLogo('Enterprise PLM', 'brand-logo'),
};
const gnbLogo = (kind = 'symbolText') =>
  '<header class="gnb"><div class="logo-container">' + LOGO[kind]() + '</div>' + actions(3, 1) + '</header>';
const frame = (h, w = '100%') => '<div style="max-width:' + w + ';border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' + h + '</div>';

export default {
  title: 'Navigation/App Shell',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 AppShell.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 상단_바 = { parameters: { docs: { source: { code: gnb() } } }, render: () => frame(gnb()) };
export const 상단_바_로고 = { parameters: { docs: { source: { code: gnbLogo() } } }, render: () => frame(gnbLogo()) };
export const 상단_바_워드마크 = { parameters: { docs: { source: { code: gnbLogo('wordmark') } } }, render: () => frame(gnbLogo('wordmark')) };
export const 상단_바_심볼 = { parameters: { docs: { source: { code: gnbLogo('symbol') } } }, render: () => frame(gnbLogo('symbol')) };
export const 개수_배지 = {
  render: () => '<div style="display:flex;gap:24px;align-items:center">' + count('결재업무', 0) + count('결재업무', 3) + count('결재업무', 12) + count('결재업무', '99+') + '</div>',
};
export const 페이지_머리 = {
  render: () => frame('<div style="padding:16px 24px;display:flow-root;background:var(--color-bg-subtle)"><div class="page-head" style="margin:0"><div class="page-title-area"><h1>문서 검색</h1>' +
    '<button type="button" class="favorite-icon" aria-label="즐겨찾기에 추가" aria-pressed="false" style="border:0;background:transparent;padding:0;display:inline-flex">' + svg(I.star, 18) + '</button></div>' +
    crumbs(['Home', '문서 관리', '문서 검색']) + '</div></div>'),
};
// 폴더 트리 = DS .tree — 단계는 --tree-level, 끝 항목도 꺾쇠 칸을 비워 둠 (TD-75). 폴더 아이콘 = 그림 자산(솔리드 · 라인, ./_fileicon.js)
const FOLDERS = [[0, '제품 문서', true], [1, '설계 문서', true, true], [2, '사양서'], [2, '시험 성적서'], [1, '품질 문서', false], [1, '양식']];
const tree = () => '<ul class="tree" role="tree" aria-label="문서 폴더">' + FOLDERS.map(([lv, t, open, on]) =>
  '<li class="tree__item" role="treeitem"' + (open !== undefined ? ' aria-expanded="' + open + '"' : '') + (on ? ' aria-selected="true"' : '') + ' style="--tree-level:' + lv + '">' +
  '<span class="tree__caret">' + (open !== undefined ? svg(open ? I.down : I.next, 12) : '') + '</span>' +
  folderIcon(!!open) + t + '</li>').join('') + '</ul>';
const panel = (tabX = '') =>
  '<aside class="main-sub" aria-label="문서 관리 메뉴" style="height:360px">' +
  '<div class="main-sub-header"><h3>문서 관리</h3><button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 16) + '</button></div>' +
  '<div class="main-sub-tabs" role="tablist"><button type="button" class="sub-tab" role="tab" aria-selected="false">메뉴</button><button type="button" class="sub-tab is-active' + tabX + '" role="tab" aria-selected="true">폴더</button></div>' +
  '<div class="main-sub-content"><div class="tree-section" style="margin-top:0;border-top:0"><div class="tree-controls">' +
  '<select class="select" aria-label="제품군"><option>전체 제품군</option><option>제동 부품</option></select>' +
  '<div class="tree-search-wrap">' + svg(I.search, 12) + '<input class="tree-search-input" aria-label="폴더 검색" placeholder="폴더 검색"></div></div>' +
  tree() +
  '</div></div></aside>';
export const 보조_메뉴_패널 = { parameters: { docs: { source: { code: panel() } } }, render: () => '<div style="display:flex">' + panel() + '</div>' };
export const 바닥 = { render: () => frame('<footer class="gnb-footer">© 2026 Enterprise PLM</footer>') };

// ── LNB 레일 · 서브 메뉴 ──
// 아이콘 = Figma 「LNB/Rail」 아이콘(./_lnbicons.js, Screens 와 같음). mask 그림 — 제품은 메뉴마다 그림 파일 경로를 --lnb-icon 에 넣음
// 사용자 메뉴 행 아이콘도 같은 mask 방식(--row-icon)
const railIcon = (d) => "url('data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>') + "')";
const railItem = (ic, t, { current = false, liX = '', aX = '', spanStyle = '' } = {}) =>
  '<li class="' + liX.trim() + '"><div class="menu_icon_box"><div class="menu_icon" style="--lnb-icon:' + lnbMask(ic) + '"><a href="#" class="' + aX.trim() + '" aria-label="' + t + '"' + (current ? ' aria-current="page"' : '') + '></a></div></div><span aria-hidden="true"' + (spanStyle ? ' style="' + spanStyle + '"' : '') + '>' + t + '</span></li>';
// 메뉴 이름이 길면 띄어쓰기에서 두 줄(「벤치마킹 관리」)
const rail = () =>
  '<aside class="main-menu" style="height:520px"><a class="lnb-logo" href="#">' + lnbLogo('홈') + '</a><nav aria-label="주 메뉴"><ul>' +
  railItem('work', '업무 관리') + railItem('doc', '문서 관리', { current: true }) + railItem('drawing', '도면 관리') + railItem('part', '부품 관리') + railItem('bench', '벤치마킹 관리') +
  '</ul><ul>' + railItem('user', '관리자') + '</ul></nav></aside>';
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
  '<aside class="main-sub" aria-label="문서 관리 메뉴" style="height:440px"><div class="main-sub-header"><h3>문서 관리</h3><button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 16) + '</button></div>' +
  '<div class="main-sub-content">' + subMenu() + '</div></aside>';
export const 보조_메뉴 = { parameters: { docs: { source: { code: subMenu() } } }, render: () => '<div style="display:flex">' + subPanel() + '</div>' };

// ── 사용자 메뉴 — GNB 사용자 아이콘을 누르면 열림 ──
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
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시. 화면 모드 켬 = aria-checked="true" -->' } } },
  render: () => {
    enablePseudo();
    // 행 하나만 잘라 보여 줌 — 규칙이 「로그아웃 버튼이 든 펼침」에만 걸리므로 빈 로그아웃 자리를 숨겨 둠
    // 카드 폭 안에 3열이 들어가게 패널 폭 220(제품 258)
    const box = (h) => '<div class="dropdown-content-top" style="border-radius:0;box-shadow:none;width:220px"><div class="section">' + h + '</div><div class="logoutBtn" hidden></div></div>';
    const foot = (h) => '<div class="dropdown-content-top" style="border-radius:0;box-shadow:none;width:220px"><div class="section"><div class="logoutBtn">' + h + '</div></div></div>';
    const link = (x) => box(umRow('map', '사이트맵', '<a href="#" class="' + x.trim() + '" aria-label="사이트맵"></a>', x.includes('hover') ? ' ps-hover' : ''));
    const dl = (x) => box(umRow('download', '뷰어 다운로드', umDownload(x)));
    const lang = (x) => box(umRow('globe', '언어 설정', umLang(x)));
    const sw = (on, x = '') => box(umRow('moon', '화면 모드', umSwitch(on, x)));
    // 행 = 항목, 열 = 상태
    return matrix(['Default', 'Hovered', 'Focused'], [
      ['행 링크', [link(''), link(' ps-hover'), link(' ps-focus-visible')]],
      ['내려받기', [dl(''), dl(' ps-hover'), dl(' ps-focus-visible')]],
      ['언어', [lang(''), '—', lang(' ps-focus-visible')]],
      ['화면 모드 · 끔', [sw(false), '—', sw(false, ' ps-focus-visible')]],
      ['화면 모드 · 켬', [sw(true), '—', sw(true, ' ps-focus-visible')]],
      ['로그아웃', [foot(umLogout()), foot(umLogout(' ps-hover')), foot(umLogout(' ps-focus-visible'))]],
    ]);
  },
};

// LNB 레일 · 서브 메뉴 상태 — Hovered · Focused 는 정지 화면 클래스(.ps-*)
export const 메뉴_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 지금 화면 = a 에 aria-current="page". Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    // 상태마다 영역 이름을 따로 — 같은 이름 없는 영역이 여러 개면 화면 읽기에서 구분이 안 됨(접근성 검사 landmark-unique)
    const one = (o) => '<aside class="main-menu" aria-label="LNB 레일 예시 — ' + o.name + '" style="height:auto;width:60px;border:0"><nav aria-label="주 메뉴 예시 — ' + o.name + '"><ul>' + railItem('doc', '문서 관리', o) + '</ul></nav></aside>';
    const flat = (o) => '<div class="ui-submenu" style="width:200px;padding:0;text-align:start"><ul><li class="ui-submenu-flat"><a href="#" class="' + (o.aX || '') + '"' + (o.current ? ' aria-current="page"' : '') + '>문서 검색</a></li></ul></div>';
    const list = (o) => '<div class="ui-submenu" style="width:200px;padding:0;text-align:start"><ul class="ui-submenu-list" style="margin-left:0"><li><a href="#" class="' + (o.aX || '') + '"' + (o.current ? ' aria-current="page"' : '') + '>변경 요청</a></li></ul></div>';
    return matrix(['LNB 레일', '서브 메뉴', '3단계 목록'], [
      ['Default', [one({ name: 'Default' }), flat({}), list({})]],
      ['Hovered', [one({ name: 'Hovered', liX: 'ps-hover', aX: 'ps-hover' }), flat({ aX: 'ps-hover' }), list({ aX: 'ps-hover' })]],
      ['Focused', [one({ name: 'Focused', aX: 'ps-focus-visible' }), flat({ aX: 'ps-focus-visible' }), list({ aX: 'ps-focus-visible' })]],
      ['Current', [one({ name: '현재 화면', current: true }), flat({ current: true }), list({ current: true })]],
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
    const close = (x) => '<div class="main-sub-header" style="height:auto;padding:0;border:0"><button type="button" class="sub-close' + x + '" aria-label="메뉴 닫기">' + svg(I.close, 16) + '</button></div>';
    const tab = (x, on) => '<div class="main-sub-tabs" style="border:0;width:72px"><button type="button" class="sub-tab' + (on ? ' is-active' : '') + x + '">폴더</button></div>';
    const row = (x) => [wrapGnb('<div class="nav-history" style="margin:0">' + nh(x) + '</div>'), userBtn(x), close(x), tab(x, false)];
    return matrix(['뒤로 · 앞으로', '사용자 메뉴', '패널 닫기', '패널 탭'], [
      ['Default', row('')],
      ['Hovered', row(' ps-hover')],
      ['Pressed', [wrapGnb('<div class="nav-history" style="margin:0">' + nh(' ps-active') + '</div>'), '—', '—', '—']],
      ['Focused', row(' ps-focus-visible')],
      ['Selected', ['—', '—', '—', tab('', true)]],
    ]) + '<p class="sb-note" style="margin:8px 0 0">Focused = 포커스 테두리(--color-border-focus) + 바깥 3px 링(--color-focus-ring), 입력 필드와 같은 표시입니다. 패널 탭의 상태는 Tabs 문서와 같습니다. 사용자 메뉴 · 업무 개수 버튼(.menu-toggle)은 Hovered 모양 없이 Focused만 있습니다.</p>';
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

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 19번 ② ③) — 미리보기만, 코드는 위 예시 카드에 ──
const ddBar = (h) => '<div style="width:100%;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden"><header class="gnb"><div></div>' + h + '</header></div>';
const ddCounts = (a) => '<div class="header-actions">' + userBtn() + count('결재업무', a) + count('활동업무', 3) + '</div>';
// 레일 조각 — 같은 메뉴 셋, 가운데 긴 이름만 줄바꿈 ↔ 말줄임. 영역 이름은 미리보기마다 따로(접근성 검사 landmark-unique)
const ddRail = (name, spanStyle = '') => '<div style="border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' +
  '<aside class="main-menu" aria-label="LNB 레일 예시 — ' + name + '" style="height:auto;border:0"><nav aria-label="주 메뉴 예시 — ' + name + '"><ul>' +
  railItem('doc', '문서 관리') + railItem('bench', '벤치마킹 관리', { spanStyle }) + railItem('drawing', '도면 관리') + '</ul></nav></aside></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '카운트 배지는 99+까지',
      do: [ddBar(ddCounts('99+')), '100 이상은 99+로 표시해 배지 폭을 일정하게 둡니다.'],
      dont: [ddBar(ddCounts('1284')), '숫자를 그대로 쓰면 배지가 길어져 GNB 오른쪽 배치가 흔들립니다.'] },
    { title: '긴 메뉴 이름은 두 줄로',
      do: [ddRail('두 줄'), 'LNB 레일 메뉴 이름이 길면 띄어쓰기에서 두 줄로 나눕니다. 두 줄까지 표시합니다.'],
      dont: [ddRail('말줄임', 'display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'), '한 줄로 자르면 「벤치마…」처럼 이름 끝이 보이지 않아 메뉴를 구분하기 어렵습니다.'] },
  ]),
};
