// Navigation/App Shell — 문서 화면은 AppShell.mdx. 모든 업무 화면이 함께 쓰는 틀: 상단 바(GNB) · 페이지 머리 · 보조 메뉴 패널
// 아이콘 메뉴(.main-menu)의 항목은 개발 마크업이라 DS 클래스가 없음 — 틀만 여기, 항목 모양은 Screens 참고
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  prev: '<path d="M15 6l-6 6 6 6"/>', next: '<path d="M9 6l6 6-6 6"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  user: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.5 18.5a6 6 0 0 1 11 0"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>', search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
};

const history = (x = '') =>
  '<div class="nav-history"><button type="button" class="nav-history-btn' + x + '" aria-label="뒤로">' + svg(I.prev, 14) + '</button>' +
  '<button type="button" class="nav-history-btn" aria-label="앞으로">' + svg(I.next, 14) + '</button></div>';
const crumbs = (list) => '<div class="breadcrumb">' + list.map((c, i) => i < list.length - 1 ? '<span>' + c + '</span><span aria-hidden="true">›</span>' : '<span class="crumb-current" aria-current="page">' + c + '</span>').join('') + '</div>';
const theme = (x = '') => '<button type="button" class="theme-toggle-btn' + x + '" aria-label="화면 모드 바꾸기"><span class="icon-moon">' + svg(I.moon, 18) + '</span><span class="icon-sun">' + svg(I.sun, 18) + '</span></button>';
const count = (title, n) => '<div class="menu-container"><button type="button" class="menu-toggle" aria-haspopup="true" aria-expanded="false"><span class="title">' + title + '</span><span class="count">' + n + '</span></button></div>';
const user = '<div class="user-info">' + svg(I.user, 20) + '김도윤</div>';
const logout = (x = '') => '<button type="button" class="logout-btn' + x + '" aria-label="로그아웃">' + svg(I.logout, 18) + '</button>';
const actions = (a = 2, b = 0) => '<div class="header-actions">' + theme() + user + count('결재업무', a) + count('활동업무', b) + logout() + '</div>';

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
const panel = (tabX = '') =>
  '<aside class="main-sub" style="height:360px">' +
  '<div class="main-sub-header"><h3>문서 관리</h3><button type="button" class="sub-close" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>' +
  '<div class="main-sub-tabs" role="tablist"><button type="button" class="sub-tab is-active" role="tab" aria-selected="true">메뉴</button><button type="button" class="sub-tab' + tabX + '" role="tab" aria-selected="false">폴더</button></div>' +
  '<div class="main-sub-content"><div class="tree-section" style="margin-top:0;border-top:0"><div class="tree-controls">' +
  '<select class="select" aria-label="제품군"><option>전체 제품군</option><option>제동 부품</option></select>' +
  '<div class="tree-search-wrap">' + svg(I.search, 14) + '<input class="tree-search-input" aria-label="폴더 검색" placeholder="폴더 검색"></div></div>' +
  '<div style="flex:1;display:flex;align-items:center;justify-content:center;border:1px dashed var(--color-border-base);border-radius:var(--radius-panel);color:var(--color-text-muted);font-size:var(--body-sm)">폴더 트리 (그리드 위젯)</div>' +
  '</div></div></aside>';
export const 보조_메뉴_패널 = { parameters: { docs: { source: { code: panel() } } }, render: () => '<div style="display:flex">' + panel() + '</div>' };
export const 바닥 = { render: () => frame('<footer class="gnb-footer">© 2026 Enterprise PLM</footer>') };

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- Hovered · Pressed · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->' } } },
  render: () => {
    enablePseudo();
    const nh = (x) => '<button type="button" class="nav-history-btn' + x + '" aria-label="뒤로">' + svg(I.prev, 14) + '</button>';
    const wrapGnb = (h) => '<div class="gnb" style="height:auto;padding:4px;border:0;background:transparent;display:inline-flex">' + h + '</div>';
    const close = (x) => '<div class="main-sub-header" style="height:auto;padding:0;border:0"><button type="button" class="sub-close' + x + '" aria-label="메뉴 닫기">' + svg(I.close, 14) + '</button></div>';
    const tab = (x, on) => '<div class="main-sub-tabs" style="border:0;width:72px"><button type="button" class="sub-tab' + (on ? ' is-active' : '') + x + '">폴더</button></div>';
    const row = (x) => [wrapGnb('<div class="nav-history" style="margin:0">' + nh(x) + '</div>'), theme(x), logout(x), close(x), tab(x, false)];
    return matrix(['뒤로 · 앞으로', '화면 모드', '로그아웃', '패널 닫기', '패널 탭'], [
      ['Default', row('')],
      ['Hovered', row(' ps-hover')],
      ['Pressed', [wrapGnb('<div class="nav-history" style="margin:0">' + nh(' ps-active') + '</div>'), '—', '—', '—', '—']],
      ['Focused', row(' ps-focus-visible')],
      ['선택됨', ['—', '—', '—', '—', tab('', true)]],
    ]) + '<p class="sb-note" style="margin:8px 0 0">포커스는 버튼과 같은 2px 바깥 테두리입니다. 업무 개수 버튼(.menu-toggle)은 마우스 올림 모양 없이 포커스만 있습니다.</p>';
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
