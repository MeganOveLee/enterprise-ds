// Navigation/Tabs — 문서 화면은 Tabs.mdx. 같은 자리의 내용을 나눠 보여 주는 탭
// DS 탭은 두 자리에만 있음: 팝업(상세 · 등록 창) 탭 .pop .tab · 보조 메뉴 패널 탭 .main-sub-tabs. 어디서나 쓰는 단독 .tabs 는 아직 없음
// 여기 스토리는 누르면 탭이 바뀌는 짧은 스크립트를 붙여 눌러 볼 수 있게 함(제품은 탭 로더 스크립트)
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const POP_TABS = ['기본 정보', '첨부 파일', '결재 이력', '관련 도면'];
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
  '<div class="main-sub-tabs" role="tablist" aria-label="보조 메뉴">' +
  tabs.map((t, i) => '<button type="button" role="tab" aria-selected="' + (i === active) + '" tabindex="' + (i === active ? 0 : -1) + '" class="sub-tab' + (i === active ? ' is-active' : '') + (x[i] || '') + '">' + t + '</button>').join('') + '</div>';
const panelFrame = (inner) => '<aside class="main-sub" style="height:auto">' + inner + '<div style="padding:24px 16px;color:var(--color-text-muted);font-size:var(--body-sm)">패널 내용</div></aside>';

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
const live = (html, maxW = '720px') => { const el = document.createElement('div'); el.style.maxWidth = maxW; el.innerHTML = html; return wire(el); };

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

// ── 전체 상태 ──
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
      ['선택됨', [one('', true), two('', true)]],
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

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) — 미리보기만, 코드는 위 예시 카드에 ──
const ddPanel = (tabs) => '<div class="main-sub" style="height:auto;width:240px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden"><div class="main-sub-header"><h3>문서 관리</h3></div>' + tabs +
  '<div style="padding:16px;color:var(--color-text-muted);font-size:var(--body-sm)">패널 내용</div></div>';
const ddPop = (tabs) => '<div class="pop" style="height:auto;min-width:0;width:100%;overflow:visible">' + popTabs(tabs, 0, { actions: false }) + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: Tabs.mdx 구성 「패널 탭 — 탭이 하나뿐이면 .is-single로 줄 전체를 숨깁니다」
    { title: '탭이 하나면 탭 줄을 숨김',
      do: [ddPanel(panelTabs(['메뉴']).replace('class="main-sub-tabs"', 'class="main-sub-tabs is-single"')), '탭이 하나뿐이면 .is-single로 탭 줄을 숨깁니다.'],
      dont: [ddPanel(panelTabs(['메뉴'])), '고를 것이 없는 탭 한 칸을 남겨 두지 않습니다.'] },
    // 근거: Tabs.mdx 머리 설명 「같은 자리의 내용을 나눠 보여 주는 탭」 · 화면 이동은 App Shell 보조 메뉴(.ui-submenu)
    { title: '같은 창 안의 내용 전환에만',
      do: [ddPop(['기본 정보', '첨부 파일', '결재 이력']), '한 문서의 내용을 나눠 보여 줄 때 씁니다.'],
      dont: [ddPop(['문서 검색', '문서 등록', '도면 검색']), '다른 화면으로 가는 메뉴는 탭이 아니라 보조 메뉴로 둡니다.'] },
  ]),
};
