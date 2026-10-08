// Form/Button — 문서 화면은 Button.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 표 · 전체 조합 · Playground
// 예시는 미리보기와 「코드 보기」가 같은 마크업 문자열을 쓴다 (코드 = 그대로 붙여 쓰는 마크업)
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const STAR = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/></svg>';
const X = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const DOWN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
const SPIN = '<span class="spinner spinner--sm spinner--neutral" aria-hidden="true"></span>';

// 글자 버튼 한 줄
const btn = ({ label = '저장', emphasis = 'primary', shape = 'filled', disabled = false, loading = false, icon = false, extra = '', attrs = '' } = {}) =>
  '<button type="button" class="btn btn--' + emphasis + ' btn--' + shape + (loading ? ' is-loading' : '') + (extra ? ' ' + extra : '') + '"' +
  (disabled ? ' disabled' : '') + (loading ? ' aria-busy="true"' : '') + attrs + '>' +
  (loading ? SPIN : icon ? STAR : '') + (loading ? '처리 중' : label) + '</button>';
// 아이콘만 있는 버튼
const iconBtn = ({ shape = 'outlined', label = '닫기', glyph = X, extra = '', attrs = '', disabled = false } = {}) =>
  '<button type="button" class="btn btn--secondary btn--' + shape + ' btn--icon' + (extra ? ' ' + extra : '') + '" aria-label="' + label + '"' +
  attrs + (disabled ? ' disabled' : '') + '>' + glyph + '</button>';
// 펼침 버튼
const expandBtn = ({ open = false, extra = '', disabled = false } = {}) =>
  '<button type="button" class="btn btn--secondary btn--outlined btn--expand' + (extra ? ' ' + extra : '') + '" aria-expanded="' + open + '"' +
  (disabled ? ' disabled' : '') + '>상세검색</button>';
const toggleBtn = ({ on = false, extra = '', disabled = false } = {}) =>
  iconBtn({ shape: 'transparent', label: '즐겨찾기', glyph: STAR, extra, attrs: ' aria-pressed="' + on + '"', disabled });

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
export const Basic = {
  parameters: html(BASIC),
  render: () => '<div class="sb-row" style="justify-content:flex-end">' + BASIC.join('') + '</div>',
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
    ['클래스', [code('.btn'), code('.btn') + note(' + 글자 앞 svg'), code('.btn--icon'), code('.btn--expand')]],
    ['쓰임', [note('기본'), note('아이콘 14 × 14'), note('정사각형, 아이콘 16 × 16<br>이름은 aria-label'), note('영역을 접고 펴는 버튼<br>글자 오른쪽 화살표')]],
  ], { full: true }),
};

const TOGGLE = [toggleBtn({ on: false }), toggleBtn({ on: true }), expandBtn({ open: false }), expandBtn({ open: true })];
export const Toggle = {
  parameters: html(TOGGLE),
  render: () => matrix([code('false') + note('<br>꺼짐 · 접힘'), code('true') + note('<br>켜짐 · 펼침')], [
    ['켜고 끄기 ' + code('aria-pressed'), [TOGGLE[0], TOGGLE[1]]],
    ['접고 펴기 ' + code('aria-expanded'), [TOGGLE[2], TOGGLE[3]]],
  ], { full: true }),
};

const UTILITY = ['<button type="button" class="btn btn--excel">' + DOWN + '엑셀 다운로드</button>'];
export const Utility = {
  parameters: html(UTILITY),
  render: () => matrix(['엑셀 다운로드'], [
    ['미리보기', UTILITY],
    ['클래스', [code('.btn--excel')]],
    ['쓰임', [note('엑셀 내려받기 전용. 브랜드와 상관없이 고정 초록')]],
  ], { full: true }),
};

// ── 전체 조합 ──
const STATES = ['Default', 'Hovered', 'Pressed', 'Focused', 'Disabled'];
const PS = ['', 'ps-hover', 'ps-active', 'ps-focus-visible'];

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
    return matrix(STATES.concat(['Loading']), rows, { full: true });
  },
};

export const IconStates = {
  parameters: html([
    iconBtn({ label: '닫기' }),
    toggleBtn({ on: true }),
    expandBtn({ open: true }),
  ]),
  render: () => {
    enablePseudo();
    const set = (make) => PS.map((p) => make({ extra: p })).concat([make({ disabled: true })]);
    return matrix(STATES, [
      ['아이콘만 · outlined', set((o) => iconBtn({ shape: 'outlined', ...o }))],
      ['아이콘만 · transparent', set((o) => iconBtn({ shape: 'transparent', ...o }))],
      ['켜고 끄기 · 꺼짐', set((o) => toggleBtn({ on: false, ...o }))],
      ['켜고 끄기 · 켜짐', set((o) => toggleBtn({ on: true, ...o }))],
      ['접고 펴기 · 접힘', set((o) => expandBtn({ open: false, ...o }))],
      ['접고 펴기 · 펼침', set((o) => expandBtn({ open: true, ...o }))],
    ], { full: true });
  },
};

// ── Playground ──
export const Playground = {};
