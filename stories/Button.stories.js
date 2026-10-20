// Form/Button — 문서 화면은 Button.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 표 · 전체 조합 · Playground
// 예시는 미리보기와 「코드 보기」가 같은 마크업 문자열을 쓴다 (코드 = 그대로 붙여 쓰는 마크업)
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const STAR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/></svg>';
const X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
// 엑셀 내려받기 아이콘 — Figma Button Type=Excel 의 엑셀 그림과 같은 구성(X 칸 + 표 줄)을 선 아이콘으로. 상표 로고는 그리지 않음 (TD-108)
const SHEET = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l4 6M11 9l-4 6M14.5 9H18M14.5 12H18M14.5 15H18"/></svg>';
// 처리 중 스피너 — 크기 · 색은 버튼이 정함(글자색 14, 아이콘만 있는 버튼 16)
const SPIN = '<span class="spinner" aria-hidden="true"></span>';

// 글자 버튼 한 줄
const btn = ({ label = '저장', emphasis = 'primary', shape = 'filled', disabled = false, loading = false, icon = false, extra = '', attrs = '' } = {}) =>
  '<button type="button" class="btn btn--' + emphasis + ' btn--' + shape + (loading ? ' is-loading' : '') + (extra ? ' ' + extra : '') + '"' +
  (disabled ? ' disabled' : '') + (loading ? ' aria-busy="true"' : '') + attrs + '>' +
  (loading ? SPIN : icon ? STAR : '') + (loading ? '처리 중' : label) + '</button>';
// 아이콘만 있는 버튼 — 처리 중이면 아이콘 자리에 스피너
const iconBtn = ({ emphasis = 'secondary', shape = 'outlined', label = '닫기', glyph = X, extra = '', attrs = '', disabled = false, loading = false } = {}) =>
  '<button type="button" class="btn btn--' + emphasis + ' btn--' + shape + ' btn--icon' + (loading ? ' is-loading' : '') + (extra ? ' ' + extra : '') + '" aria-label="' + label + '"' +
  attrs + (disabled ? ' disabled' : '') + (loading ? ' aria-busy="true"' : '') + '>' + (loading ? SPIN : glyph) + '</button>';
// 펼침 버튼
const expandBtn = ({ open = false, extra = '', disabled = false } = {}) =>
  '<button type="button" class="btn btn--secondary btn--outlined btn--expand' + (extra ? ' ' + extra : '') + '" aria-expanded="' + open + '"' +
  (disabled ? ' disabled' : '') + '><span class="t-open">상세 검색 펼치기</span><span class="t-close">상세 검색 접기</span></button>';
const CHEV = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const iconExpand = ({ open = false, extra = '', disabled = false } = {}) =>
  iconBtn({ shape: 'transparent', label: '왼쪽 메뉴', glyph: CHEV, extra, attrs: ' aria-expanded="' + open + '"', disabled });
const toggleBtn = ({ on = false, extra = '', disabled = false } = {}) =>
  iconBtn({ shape: 'transparent', label: '즐겨찾기', glyph: STAR, extra: 'btn--favorite' + (extra ? ' ' + extra : ''), attrs: ' aria-pressed="' + on + '"', disabled });   // 켜짐 = 노란 채움 별(TD-120)

const note = (t) => '<span class="sb-note">' + t + '</span>';
const code = (t) => '<code>' + t + '</code>';
const html = (lines) => ({ controls: { disable: true }, docs: { source: { language: 'html', code: lines.join('\n') } } });

export default {
  title: 'Form/Button',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Button.mdx
  render: (args) => btn(args),
  argTypes: {
    label: { control: 'text', description: '버튼 글자' },
    emphasis: { control: 'inline-radio', options: ['primary', 'secondary', 'destructive'], description: '중요도 — `.btn--{중요도}`' },
    shape: { control: 'inline-radio', options: ['filled', 'outlined', 'transparent'], description: '모양 — `.btn--{모양}`' },
    icon: { control: 'boolean', description: '왼쪽 아이콘' },
    disabled: { control: 'boolean', description: '비활성 — `disabled`' },
    loading: { control: 'boolean', description: '처리 중 — `.is-loading` + `aria-busy="true"`' },
  },
  args: { label: '저장', emphasis: 'primary', shape: 'filled', icon: false, disabled: false, loading: false },
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
const BASIC = [
  btn({ emphasis: 'secondary', shape: 'transparent', label: '취소' }),
  btn({ emphasis: 'secondary', shape: 'outlined', label: '임시저장' }),
  btn({ label: '저장' }),
];
// 버튼 묶음 = .button_group (Figma 「Button stack」). 팝업 제목 줄 오른쪽은 .pop .top-btn-area 가 같은 일을 함
export const Basic = {
  parameters: html(['<div class="button_group">'].concat(BASIC.map((b) => '  ' + b), ['</div>'])),
  render: () => '<div class="sb-row" style="justify-content:flex-end"><div class="button_group">' + BASIC.join('') + '</div></div>',
};

// 크기 — 작은 버튼 = Figma 「Small Button」(.btn--sm), 큰 버튼 = 큰 칸(.input--lg)과 짝(.btn--lg)
const SIZE = [
  btn({ emphasis: 'secondary', shape: 'outlined', label: '조회', extra: 'btn--sm' }),
  btn({ emphasis: 'secondary', shape: 'outlined', label: '조회' }),
  btn({ emphasis: 'secondary', shape: 'outlined', label: '조회', extra: 'btn--lg' }),
];
export const Size = {
  parameters: html(SIZE),
  render: () => matrix(['작은 버튼', '기본', '큰 버튼'], [
    ['미리보기', SIZE],
    ['클래스', [code('.btn--sm'), note('클래스 없음'), code('.btn--lg')]],
    ['쓰임', [note('좁은 자리 — 카드 머리 · 알림 닫기'), note('대부분의 버튼'), note('큰 칸과 짝인 단독 폼의 주 동작 하나<br>(로그인)')]],
  ], { full: true }),
};

const EMPHASIS = [btn({ label: '저장' }), btn({ emphasis: 'secondary', label: '조회' }), btn({ emphasis: 'destructive', label: '삭제' })];
export const Emphasis = {
  parameters: html(EMPHASIS),
  render: () => matrix(['primary', 'secondary', 'destructive'], [
    ['미리보기', EMPHASIS],
    ['클래스', [code('.btn--primary'), code('.btn--secondary'), code('.btn--destructive')]],
    ['쓰임', [note('핵심 동작 — 등록 · 저장 · 확인<br>한 영역에 하나만'), note('보조 동작 — 조회 · 취소 · 닫기 · 초기화'), note('되돌릴 수 없는 동작 — 삭제')]],
  ], { full: true }),
};

const STYLE = [btn({ label: '저장' }), btn({ shape: 'outlined', label: '저장' }), btn({ shape: 'transparent', label: '저장' })];
export const Style = {
  parameters: html(STYLE),
  render: () => matrix(['filled', 'outlined', 'transparent'], [
    ['미리보기', STYLE],
    ['클래스', [code('.btn--filled'), code('.btn--outlined'), code('.btn--transparent')]],
    ['쓰임', [note('가장 강하게 — 채운 면'), note('중간 — 테두리'), note('가장 약하게 — 글자만')]],
  ], { full: true }),
};

const TYPE = [
  btn({ emphasis: 'secondary', shape: 'outlined', label: '즐겨찾기' }),
  btn({ emphasis: 'secondary', shape: 'outlined', label: '즐겨찾기', icon: true }),
  iconBtn({ label: '닫기' }),
  expandBtn(),
];
export const Type = {
  parameters: html(TYPE),
  render: () => matrix(['글자', '아이콘 + 글자', '아이콘만', '펼침'], [
    ['미리보기', TYPE],
    ['클래스', [note('클래스 없음'), note('글자 앞 svg · ') + code('&lt;i class="icon-*"&gt;'), code('.btn--icon'), code('.btn--expand')]],
    ['쓰임', [note('기본'), note('svg 또는 아이콘 글꼴 14 × 14'), note('정사각형, 아이콘 16 × 16<br>이름은 aria-label'), note('영역을 접고 펴는 버튼<br>글자 오른쪽 화살표')]],
  ], { full: true }),
};

const TOGGLE = [toggleBtn({ on: false }), toggleBtn({ on: true }), expandBtn({ open: false }), expandBtn({ open: true }), iconExpand({ open: false }), iconExpand({ open: true })];
export const Toggle = {
  parameters: html(TOGGLE),
  render: () => matrix([code('false') + note('<br>꺼짐 · 접힘'), code('true') + note('<br>켜짐 · 펼침')], [
    ['켜고 끄기<br>' + code('aria-pressed'), [TOGGLE[0], TOGGLE[1]]],
    ['접고 펴기<br>' + code('aria-expanded'), [TOGGLE[2], TOGGLE[3]]],
    ['아이콘만 접고 펴기<br>' + code('aria-expanded'), [TOGGLE[4], TOGGLE[5]]],
  ], { full: true }),
};

const UTILITY = ['<button type="button" class="btn btn--excel">' + SHEET + '엑셀 다운로드</button>'];
export const Utility = {
  parameters: html(UTILITY),
  render: () => matrix(['엑셀 다운로드'], [
    ['미리보기', UTILITY],
    ['클래스', [code('.btn--excel')]],
    ['쓰임', [note('엑셀 내려받기 전용. 브랜드와 상관없이 고정 초록<br>아이콘은 다른 버튼과 같은 14')]],
  ], { full: true }),
};

// ── 업무 동작별 버튼 (TD-104 반영 4) ── 행 = 동작, 근거 = DS-ADR-009 대응표 · Screens 화면. 같은 동작은 화면이 달라도 같은 버튼
const SRCH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/></svg>';
const RST = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>';
const UP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';
const raw = (cls, inner, attrs = '') => '<button type="button" class="btn ' + cls + '"' + attrs + '>' + inner + '</button>';
const ACTIONS = [
  ['등록 · 저장 · 결재 요청', '영역의 핵심 동작 하나', raw('btn--primary btn--filled', '등록'), '.btn--primary.btn--filled'],
  ['검색', '검색 조건 영역의 [검색]', raw('btn--primary btn--filled', SRCH + '검색'), '.btn--primary.btn--filled'],
  ['조회 · 선택 · 수정 · 임시 저장', '핵심 동작 옆의 보조 동작', raw('btn--secondary btn--outlined', '수정'), '.btn--secondary.btn--outlined'],
  ['초기화 · 취소', '되돌리거나 그만두는 동작', raw('btn--secondary btn--transparent', RST + '검색 조건 초기화'), '.btn--secondary.btn--transparent'],
  ['삭제', '되돌릴 수 없는 동작. 목록 전체 삭제는 transparent', raw('btn--destructive btn--outlined', '삭제'), '.btn--destructive.btn--outlined'],
  ['엑셀 내려받기', '엑셀 파일을 받는 버튼 하나', UTILITY[0], '.btn--excel'],
  ['순서 이동 · 닫기', '아이콘만, 이름은 aria-label', raw('btn--secondary btn--transparent btn--icon', UP, ' aria-label="위로 이동"'), '.btn--secondary.btn--transparent.btn--icon'],
];
export const 업무_동작 = {
  parameters: html(ACTIONS.map((a) => a[2])),
  render: () => matrix(['버튼', '클래스', '쓰는 자리'], ACTIONS.map(([name, where, b, cls]) => [name, [b, code(cls), note(where)]]), { full: true }),
};

// ── 전체 조합 ──
const STATES = ['Default', 'Hovered', 'Pressed', 'Focused', 'Disabled'];
const PS = ['', 'ps-hover', 'ps-active', 'ps-focus-visible'];

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-70) ── 미리보기만, 코드는 위 예시 카드에
const grp = (h) => '<div class="button_group">' + h + '</div>';
const box = (h) => '<div style="width:140px;padding:6px 0;outline:1px dashed var(--color-border-strong);outline-offset:4px">' + h + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '핵심 동작은 하나만 강조',
      do: [grp(btn({ label: '취소', emphasis: 'secondary', shape: 'transparent' }) + btn({ label: '임시 저장', emphasis: 'secondary', shape: 'outlined' }) + btn({ label: '등록' })),
        'primary는 등록 · 저장 · 검색처럼 그 영역의 핵심 동작 하나에만 씁니다. 나머지는 secondary입니다.'],
      dont: [grp(btn({ label: '취소' }) + btn({ label: '임시 저장' }) + btn({ label: '등록' })),
        '모두 primary면 어느 것이 핵심 동작인지 보이지 않습니다.'] },
    { title: '빨강은 되돌릴 수 없는 동작에만',
      do: [grp(btn({ label: '수정', emphasis: 'secondary', shape: 'outlined' }) + btn({ label: '삭제', emphasis: 'destructive', shape: 'outlined' })),
        'destructive는 삭제처럼 되돌릴 수 없는 동작에만 씁니다. 색은 동작의 종류가 아니라 중요도로 정합니다.'],
      dont: [grp(btn({ label: '수정', emphasis: 'destructive' }) + btn({ label: '삭제', emphasis: 'destructive' })),
        '수정 · 저장에도 빨강을 쓰면 정말 위험한 동작이 묻힙니다.'] },
    { title: '라벨은 짧은 동사로, 한 줄',
      do: [box(btn({ label: '결재 요청' })),
        '동사로 짧게 씁니다. 버튼이 들어갈 자리가 좁으면 자리를 넓힙니다.'],
      dont: [box(btn({ label: '선택한 문서를 결재 요청합니다' })),
        '문장형 라벨은 버튼이 자리 밖으로 넘칩니다. 줄을 바꾸거나 줄임표로 자르지도 않습니다.'] },
    { title: '초록 엑셀 버튼은 엑셀 내려받기에만',
      do: [UTILITY[0], '브랜드와 상관없이 고정된 초록입니다. 엑셀 파일을 내려받는 버튼 하나에만 씁니다.'],
      dont: ['<button type="button" class="btn btn--excel">저장</button>', '다른 동작에 쓰면 엑셀 버튼과 구분되지 않습니다.'] },
    { title: '큰 버튼은 단독 폼의 주 동작에만',
      do: ['<div style="display:grid;gap:8px;width:240px"><input class="input input--lg" aria-label="아이디" placeholder="아이디"><button type="button" class="btn btn--primary btn--filled btn--lg">로그인</button></div>',
        '로그인처럼 칸이 몇 개뿐인 폼의 주 동작 하나에만, 큰 칸(.input--lg)과 짝으로 씁니다.'],
      dont: ['<div class="sb-row" style="gap:8px"><input class="input" aria-label="문서 번호" placeholder="문서 번호" style="width:140px"><button type="button" class="btn btn--primary btn--filled btn--lg">검색</button></div>',
        '검색 · 목록 화면에서 크게 쓰면 옆 칸과 높이가 어긋납니다.'] },
  ]),
};

export const AllStates = {
  parameters: html([
    '<!-- Hovered · Pressed · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
    btn({ disabled: true }),
    btn({ loading: true }),
  ]),
  render: () => {
    enablePseudo();
    const label = { primary: '저장', secondary: '조회', destructive: '삭제' };
    const rows = [];
    for (const e of ['primary', 'secondary', 'destructive']) {
      for (const s of ['filled', 'outlined', 'transparent']) {
        const a = { label: label[e], emphasis: e, shape: s };
        rows.push([e + ' · ' + s, PS.map((p) => btn({ ...a, extra: p })).concat([btn({ ...a, disabled: true }), btn({ ...a, loading: true })])]);
      }
    }
    // 엑셀 버튼 — 올림 · 누름은 전용 초록 단계, 포커스 · 비활성 · 처리 중은 다른 버튼과 같은 규칙
    const xl = (cls = '', dis = false, load = false) => '<button type="button" class="btn btn--excel' + (load ? ' is-loading' : '') + (cls ? ' ' + cls : '') + '"' + (dis ? ' disabled' : '') + (load ? ' aria-busy="true"' : '') + '>' + (load ? SPIN + '처리 중' : SHEET + 'Excel') + '</button>';
    rows.push(['excel', PS.map((p) => xl(p)).concat([xl('', true), xl('', false, true)])]);
    return matrix(STATES.concat(['Loading']), rows, { full: true });
  },
};

// 작은 버튼 · 큰 버튼 상태 — Figma Small Button(7가지 모양 × 6상태) · Button Size=Large(primary filled × 6상태)와 짝.
// 작은 destructive 는 Figma에 filled 만 있지만 CSS는 세 모양 모두 됨 — 세 모양 모두 그림
export const SizeStates = {
  parameters: html([
    btn({ emphasis: 'secondary', shape: 'outlined', label: '조회', extra: 'btn--sm' }),
    btn({ label: '로그인', extra: 'btn--lg' }),
    btn({ loading: true, extra: 'btn--sm' }),
  ]),
  render: () => {
    enablePseudo();
    const label = { primary: '저장', secondary: '조회', destructive: '삭제' };
    const rows = [];
    for (const e of ['primary', 'secondary', 'destructive']) {
      for (const s of ['filled', 'outlined', 'transparent']) {
        const a = { label: label[e], emphasis: e, shape: s };
        const x = (p) => 'btn--sm' + (p ? ' ' + p : '');
        rows.push(['작은 버튼<br>' + e + ' · ' + s, PS.map((p) => btn({ ...a, extra: x(p) })).concat([btn({ ...a, extra: x(''), disabled: true }), btn({ ...a, extra: x(''), loading: true })])]);
      }
    }
    const lg = { label: '로그인' };
    const y = (p) => 'btn--lg' + (p ? ' ' + p : '');
    rows.push(['큰 버튼<br>primary · filled', PS.map((p) => btn({ ...lg, extra: y(p) })).concat([btn({ ...lg, extra: y(''), disabled: true }), btn({ ...lg, extra: y(''), loading: true })])]);
    return matrix(STATES.concat(['Loading']), rows, { full: true });
  },
};

export const IconStates = {
  parameters: html([
    iconBtn({ label: '닫기' }),
    iconBtn({ label: '닫기', loading: true }) + '   <!-- 처리 중 = 아이콘 자리에 스피너 16 -->',
    toggleBtn({ on: true }),
    expandBtn({ open: true }),
  ]),
  render: () => {
    enablePseudo();
    const na = '<span class="sb-h">—</span>';
    // 아이콘만 있는 버튼 = Figma Icon Button(중요도 × 모양 × 6상태). 토글 · 접고 펴기에는 처리 중이 없음
    const set = (make, load = false) => PS.map((p) => make({ extra: p })).concat([make({ disabled: true }), load ? make({ loading: true }) : na]);
    const icon = [['primary', 'filled'], ['primary', 'outlined'], ['primary', 'transparent'], ['secondary', 'filled'], ['secondary', 'outlined'], ['secondary', 'transparent']]
      .map(([e, s]) => ['아이콘만<br>' + e + ' · ' + s, set((o) => iconBtn({ emphasis: e, shape: s, ...o }), true)]);
    const set5 = (make) => PS.map((p) => make({ extra: p })).concat([make({ disabled: true })]);
    // 글자가 있는 접고 펴기 버튼(최소 폭 150)은 칸이 넓은 별도 표로 — 처리 중 열이 없음
    return matrix(STATES.concat(['Loading']), icon.concat([
      ['켜고 끄기 · 꺼짐', set((o) => toggleBtn({ on: false, ...o }))],
      ['켜고 끄기 · 켜짐', set((o) => toggleBtn({ on: true, ...o }))],
      ['아이콘 접고 펴기 · 펼침', set((o) => iconExpand({ open: true, ...o }))],
    ]), { full: true }) + '<div style="height:16px"></div>' + matrix(STATES, [
      ['접고 펴기 · 접힘', set5((o) => expandBtn({ open: false, ...o }))],
      ['접고 펴기 · 펼침', set5((o) => expandBtn({ open: true, ...o }))],
    ], { full: true });
  },
};

// ── Playground ──
export const Playground = {};
