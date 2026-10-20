// Navigation/Tabs — 문서 화면은 Tabs.mdx. 같은 자리의 내용을 나눠 보여 주는 탭
// DS 탭은 두 자리: 팝업(상세 창) 탭 .pop .tab · LNB 서브 패널 탭 .main-sub-tabs
// 여기 스토리는 누르면 탭이 바뀌는 짧은 스크립트를 붙여 눌러 볼 수 있게 함(제품은 탭 로더 스크립트)
// 팝업 탭이 넘치면 js/tabs.js 가 ◀ ▶ 를 붙임(TD-108 28번) — 그린 뒤 window.dsTabsInit(영역)
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const POP_TABS = ['기본 정보', '첨부 파일', '결재 이력', '관련 도면'];
const MANY_TABS = ['기본 정보', '첨부 파일', '결재 이력', '관련 도면', '관련 부품', '변경 이력', '배포 이력', '연관 프로젝트', '권한', '의견'];
const btn = (t, cls) => '<button type="button" class="btn ' + cls + '">' + t + '</button>';

// 팝업 탭 — ul > li (이전 버전 마크업 그대로), 접근성 속성을 더해 키보드로도 고를 수 있게
const popTabs = (tabs = POP_TABS, active = 0, { actions = true, liX = [] } = {}) =>
  '<div class="tab"><ul role="tablist" aria-label="문서 상세">' +
  tabs.map((t, i) => '<li role="tab" tabindex="' + (i === active ? 0 : -1) + '" aria-selected="' + (i === active) + '"' +
    ' class="' + [i === active ? 'is-active' : '', liX[i] || ''].join(' ').trim() + '">' + t + '</li>').join('') + '</ul>' +
  (actions ? '<div class="tab-actions">' + btn('수정', 'btn--secondary btn--outlined') + btn('개정', 'btn--secondary btn--outlined') + '</div>' : '') + '</div>';
const popFrame = (inner) => '<div class="pop" style="height:auto;min-width:0;overflow:visible">' + inner +
  '<div style="padding:24px 16px;color:var(--color-text-muted);font-size:var(--body-sm)">탭 내용(.contents)</div></div>';

// 패널 탭 — button. 탭이 하나뿐이면 .is-single 로 줄 전체를 숨김
const panelTabs = (tabs = ['메뉴', '폴더'], active = 0, x = []) =>
  '<div class="main-sub-tabs" role="tablist" aria-label="LNB 서브 패널">' +
  tabs.map((t, i) => '<button type="button" role="tab" aria-selected="' + (i === active) + '" tabindex="' + (i === active ? 0 : -1) + '" class="sub-tab' + (i === active ? ' is-active' : '') + (x[i] || '') + '">' + t + '</button>').join('') + '</div>';
const XI = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const panelFrame = (inner) => '<aside class="main-sub" aria-label="문서 관리 메뉴" style="height:auto"><div class="main-sub-header"><h3>문서 관리</h3><button type="button" class="sub-close" aria-label="메뉴 닫기">' + XI + '</button></div>' + inner + '<div style="padding:24px 16px;color:var(--color-text-muted);font-size:var(--body-sm)">패널 내용</div></aside>';

// 누르면 바뀜 + ← → 로 옆 탭, Home · End 로 처음 · 끝 (WAI-ARIA APG Tabs, 자동 선택)
const wire = (root) => {
  root.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const pick = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(t, false));
      t.addEventListener('keydown', (e) => {
        const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (k === undefined) return;
        e.preventDefault();
        pick(tabs[(k + tabs.length) % tabs.length], true);
      });
    });
  });
  return root;
};
// 넘침 ◀ ▶ (js/tabs.js) — 스토리는 화면에 붙기 전에 그려지므로 직접 붙임. 크기는 화면에 붙은 뒤 스크립트가 잼(ResizeObserver)
const tabsInit = (el) => { if (window.dsTabsInit) window.dsTabsInit(el); return el; };
const live = (html, maxW = '720px') => { const el = document.createElement('div'); el.style.maxWidth = maxW; el.innerHTML = html; return tabsInit(wire(el)); };

export default {
  title: 'Navigation/Tabs',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Tabs.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 팝업_탭 = {
  parameters: { docs: { source: { code: '<div class="pop">\n  ' + popTabs() + '\n  <div class="contents">…</div>\n</div>' } } },
  render: () => live(popFrame(popTabs())),
};
export const 패널_탭 = {
  parameters: { docs: { source: { code: panelTabs() } } },
  render: () => live(panelFrame(panelTabs()), '280px'),
};
// 탭이 많을 때 — 탭 10개 · 창 폭 720. 탭 이름은 한 줄, 넘치면 탭 목록 양 끝에 ◀ ▶ (js/tabs.js), 오른쪽 버튼은 그대로
export const 탭이_많을_때 = {
  parameters: { docs: { source: { code: '<script src="js/tabs.js"></script>   <!-- 넘칠 때만 ◀ ▶ 를 붙임. 나중에 그린 탭 줄은 window.dsTabsInit(영역) -->\n\n' +
    '<div class="pop">\n  ' + popTabs(MANY_TABS) + '\n  <div class="contents">…</div>\n</div>' } } },
  render: () => live(popFrame(popTabs(MANY_TABS))),
};

// ── 전체 상태 — Hovered = 옅은 브랜드 바탕(LNB 메뉴와 같음), Focused = 안쪽 포커스 테두리(LNB 레일과 같음). 선택한 탭도 같은 규칙 (TD-108 29번) ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 선택된 탭 = .is-active + aria-selected="true" · Hovered · Focused 는 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    const one = (x, active) => '<div class="pop" style="height:auto;min-width:0;overflow:visible;background:transparent"><div class="tab" style="padding:0;border:0"><ul role="tablist">' +
      '<li role="tab" tabindex="0" aria-selected="' + active + '" class="' + (active ? 'is-active' : '') + x + '">첨부 파일</li></ul></div></div>';
    const two = (x, active) => '<div class="main-sub-tabs" role="tablist" style="border:0;width:96px"><button type="button" role="tab" aria-selected="' + active + '" class="sub-tab' + (active ? ' is-active' : '') + x + '">폴더</button></div>';
    return matrix(['팝업 탭', '패널 탭'], [
      ['Default', [one('', false), two('', false)]],
      ['Hovered', [one(' ps-hover', false), two(' ps-hover', false)]],
      ['Focused', [one(' ps-focus-visible', false), two(' ps-focus-visible', false)]],
      ['Selected', [one('', true), two('', true)]],
      ['Selected · Hovered', [one(' ps-hover', true), two(' ps-hover', true)]],
      ['Selected · Focused', [one(' ps-focus-visible', true), two(' ps-focus-visible', true)]],
    ]);
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    kind: { control: 'inline-radio', options: ['팝업 탭', '패널 탭'], description: '자리 — `.pop .tab` · `.main-sub-tabs`' },
    tabs: { control: 'object', description: '탭 이름' },
    active: { control: { type: 'number', min: 0, max: 9 }, description: '선택된 탭(0부터) — `.is-active` + `aria-selected="true"`' },
    actions: { control: 'boolean', description: '팝업 탭 오른쪽 버튼 — `.tab-actions`' },
  },
  args: { kind: '팝업 탭', tabs: POP_TABS, active: 0, actions: true },
  parameters: { docs: { source: { transform: (_, { args }) => (args.kind === '패널 탭' ? panelTabs(args.tabs, args.active) : popTabs(args.tabs, args.active, { actions: args.actions })) } } },
  render: (a) => {
    const tabs = a.tabs && a.tabs.length ? a.tabs : POP_TABS;
    const i = Math.min(Math.max(0, a.active), tabs.length - 1);
    return a.kind === '패널 탭' ? live(panelFrame(panelTabs(tabs, i)), '280px') : live(popFrame(popTabs(tabs, i, { actions: a.actions })));
  },
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 22번 ① · ⓐ · ⓑ, ⓑ 그림 = 30번) — 미리보기만, 코드는 위 예시 카드에 ──
const ddPanel = (tabs) => '<div class="main-sub" style="align-self:flex-start;height:auto;width:240px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden"><div class="main-sub-header"><h3>문서 관리</h3></div>' + tabs +
  '<div style="padding:16px;color:var(--color-text-muted);font-size:var(--body-sm)">패널 내용</div></div>';
const ddPop = (tabs) => '<div class="pop" style="align-self:flex-start;height:auto;min-width:0;width:100%;overflow:visible">' + popTabs(tabs, 0, { actions: false }) + '</div>';
// ⓑ — 같은 이름이 두 곳(서브 메뉴 · 탭)에 있는 것을 점선으로 표시(문서 미리보기 전용 표시)
const DUP = 'outline:2px dashed var(--color-border-danger);outline-offset:2px';
const SUBMENU = ['문서 검색', '문서 등록', '문서 양식'];
const ddScreen = () => '<div style="align-self:flex-start;display:flex;width:100%;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' +
  '<aside class="main-sub" aria-label="문서 관리 메뉴" style="height:auto;width:132px;flex:none"><div class="main-sub-header"><h3>문서 관리</h3></div>' +
  '<div class="main-sub-content"><div class="ui-submenu"><ul style="' + DUP + '">' +
  SUBMENU.map((t, i) => '<li class="ui-submenu-flat"><a href="#"' + (i ? '' : ' aria-current="page"') + '>' + t + '</a></li>').join('') + '</ul></div></div></aside>' +
  '<div style="flex:1;min-width:0;display:grid;align-content:start;gap:8px;padding:12px;background:var(--color-bg-subtle)">' +
  '<p style="margin:0;font-size:var(--heading-sm);font-weight:var(--font-weight-semibold);color:var(--color-text-base)">문서 검색</p>' +
  '<div class="pop" style="height:auto;min-width:0;overflow:visible"><div class="tab" style="padding:0 8px"><ul role="tablist" aria-label="문서 검색 화면" style="' + DUP + '">' +
  SUBMENU.map((t, i) => '<li role="tab" tabindex="' + (i ? -1 : 0) + '" aria-selected="' + !i + '"' + (i ? '' : ' class="is-active"') + '>' + t + '</li>').join('') + '</ul></div>' +
  '<div style="padding:12px;color:var(--color-text-muted);font-size:var(--body-sm)">검색 조건 · 결과 표</div></div></div></div>';
const ddDetail = () => '<div class="pop" style="align-self:flex-start;height:auto;min-width:0;width:100%;overflow:visible;border:1px solid var(--color-border-base);border-radius:var(--radius-card)">' +
  '<div class="top"><div class="top-title-area"><h3>문서 상세 · DOC-2026-0012</h3></div></div>' + popTabs(POP_TABS, 0, { actions: false }) +
  '<div style="padding:12px 16px;color:var(--color-text-muted);font-size:var(--body-sm)">문서 DOC-2026-0012의 기본 정보</div></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = doDont([
      // 근거: TD-108 22번 ① (Carbon · Atlassian Tabs — 탭 이름은 짧게)
      { title: '탭 이름은 짧은 명사',
        do: [ddPop(['기본 정보', '첨부 파일', '결재 이력']), '탭 이름은 「기본 정보」 「첨부 파일」처럼 짧은 명사로 씁니다.'],
        dont: [ddPop(['문서 기본 정보 보기', '첨부된 파일 목록', '결재 진행 이력 확인']), '「첨부된 파일 목록」처럼 문장형 이름을 쓰지 않습니다. 탭 줄이 길어져 넘칩니다.'] },
      // 근거: Tabs.mdx 구성 「패널 탭 — 탭이 하나뿐이면 .is-single로 탭 줄을 숨깁니다」
      { title: '탭이 하나면 탭 줄을 숨김',
        do: [ddPanel(panelTabs(['메뉴']).replace('class="main-sub-tabs"', 'class="main-sub-tabs is-single"')), '탭이 하나뿐이면 .is-single로 탭 줄을 숨깁니다.'],
        dont: [ddPanel(panelTabs(['메뉴'])), '고를 것이 없는 탭 한 칸을 남겨 두지 않습니다.'] },
      // 근거: Tabs.mdx 머리 설명 「같은 영역의 내용을 나누어 표시」 · 화면 이동은 LNB 서브 패널의 서브 메뉴(.ui-submenu) — 그림 = TD-108 30번 B
      { title: '같은 창 안의 내용 전환에만',
        do: [ddDetail(), '한 문서 안의 내용을 나눌 때 씁니다. 상세 창 제목 아래에 둡니다.'],
        dont: [ddScreen(), 'LNB 서브 메뉴에 있는 화면 이동 메뉴를 화면 안 탭으로 또 두지 않습니다.'] },
    ]);
    return tabsInit(el);
  },
};
