// Form/Selection Controls — 문서 화면은 Selection.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const ck = (t, o = '') => `<label class="checkbox"><input type="checkbox"${o}>${t}</label>`;
const rd = (n, t, o = '') => `<label class="radio"><input type="radio" name="${n}"${o}><span class="radio__mark"></span>${t}</label>`;
const sw = (t, o = '') => `<label class="switch"><input type="checkbox" role="switch"${o}>${t}</label>`;
const opt = ({ checked, disabled }) => (checked ? ' checked' : '') + (disabled ? ' disabled' : '');
const html = (lines) => ({ controls: { disable: true }, docs: { source: { language: 'html', code: lines.join('\n') } } });

export default {
  title: 'Form/Selection Controls',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Selection.mdx
  argTypes: {
    label: { control: 'text', description: '글자' },
    checked: { control: 'boolean', description: '선택됨 — `checked`' },
    disabled: { control: 'boolean', description: '비활성 — `disabled`' },
  },
  args: { label: '결재 포함', checked: false, disabled: false },
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const Checkbox = {
  render: (a) => '<div class="checkbox-group" role="group" aria-label="포함 항목">' + ck(a.label, opt(a)) + ck('첨부 파일 포함', ' checked') + ck('이력 포함') + '</div>',
};

const TREE = (all) => '<div style="display:grid;gap:8px">' + ck('전체 선택', all) +
  '<div class="checkbox-group" role="group" aria-label="문서 종류" style="display:grid;gap:8px;padding-left:24px">' + ck('사양서', ' checked') + ck('도면', ' checked') + ck('시험 성적서') + '</div></div>';
export const 부분_선택 = {
  parameters: html(['<!-- 하위 항목 중 일부만 선택 = 「전체 선택」을 부분 선택으로. 속성이 없어 스크립트로 켠다: input.indeterminate = true -->', TREE(' data-ind')]),
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = TREE(' data-ind');
    el.querySelector('[data-ind]').indeterminate = true;
    return el;
  },
};

export const Radio = {
  args: { label: '긴급' },
  render: (a) => `<div class="radio-group" role="radiogroup" aria-label="처리 구분">${rd('g1', '정규', ' checked')}${rd('g1', a.label, opt(a))}</div>`,
};

export const Switch = { args: { label: '자동 저장' }, render: (a) => sw(a.label, opt(a)) };

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 27번 ① ② ③) — 미리보기만 ──
const saveForm = (ctl) => '<div class="sb-row" style="gap:12px">' + ctl + '<button type="button" class="btn btn--primary btn--filled">저장</button></div>';
// 폼 한 행 = 라디오 묶음 필드 + 옆 텍스트 필드. stack = 라디오를 세로로 쌓은 잘못된 예
const formRow = (name, stack) => '<div class="form-grid-2" style="width:460px;text-align:left">' +
  '<div class="ff-field"><span class="search-label" id="' + name + '-lb">결재 방식</span><div class="radio-group" role="radiogroup" aria-labelledby="' + name + '-lb"' + (stack ? ' style="flex-direction:column;align-items:flex-start;row-gap:8px"' : '') + '>' +
  rd(name, '순차', ' checked') + rd(name, '병렬') + rd(name, '합의') + '</div></div>' +
  '<div class="ff-field"><label class="search-label" for="' + name + '-t">문서 명</label><div class="td"><input class="input" id="' + name + '-t" placeholder="문서 명 입력"></div></div></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '라벨은 긍정형으로',
      do: [ck('메일 알림 받기', ' checked'), '라벨은 선택했을 때 일어나는 일을 긍정형으로 씁니다.'],
      dont: [ck('메일 알림 받지 않기'), '부정형 라벨은 선택하면 꺼지는 것이라, 뜻을 한 번 더 뒤집어 읽어야 합니다.'] },
    { title: '라디오 · 체크박스는 가로 한 줄',
      do: [formRow('dd-sel-a', false), '옵션은 필드 안에 가로 한 줄로 둡니다. 옵션이 5개부터는 드롭다운(라디오 → 셀렉트, 체크박스 → 다중 선택)을 씁니다.'],
      dont: [formRow('dd-sel-b', true), '세로로 쌓으면 폼 행 높이가 늘어나 옆 필드와 줄이 맞지 않습니다.'] },
    // 근거: 구성 「토글 스위치」 — 누르는 즉시 적용되는 설정에만, 저장해야 적용되는 값은 체크박스
    { title: '저장 버튼이 있는 폼에는 체크박스',
      do: [saveForm(ck('결재 포함')), '저장을 눌러야 적용되는 값은 체크박스로 받습니다.'],
      dont: [saveForm(sw('결재 포함')), '토글 스위치는 누르는 즉시 적용되는 것으로 읽힙니다.'] },
  ]),
};

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: html([
    '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
    ck('결재 포함', ' checked disabled'),
    rd('d', '정규', ' checked disabled'),
    sw('자동 저장', ' checked disabled'),
  ]),
  // 행 = 상태, 열 = 종류 (상태가 7개라 열로 두면 칸이 좁아 글자가 줄바꿈됨 — Input · Date Picker와 같은 방향)
  render: () => {
    enablePseudo();
    const na = '<span class="sb-h">—</span>';
    // 라디오는 행마다 name 을 따로 — 같은 name 이면 켠 라디오가 서로를 끔
    const row = (name, n, o) => [name, [ck('결재 포함', o), rd('st-' + n, '정규', o), sw('자동 저장', o)]];
    const rows = [
      row('Default', 'a', ''),
      row('Hovered', 'h', ' class="ps-hover"'),
      row('Pressed', 'p', ' class="ps-active"'),
      row('Focused', 'f', ' class="ps-focus-visible"'),
      row('Checked', 'b', ' checked'),
      row('Checked · Hovered', 'bh', ' checked class="ps-hover"'),
      row('Checked · Pressed', 'bp', ' checked class="ps-active"'),
      row('Checked · Focused', 'bf', ' checked class="ps-focus-visible"'),
      ['Indeterminate', [ck('결재 포함', ' data-ind'), na, na]],
      ['Indeterminate · Focused', [ck('결재 포함', ' data-ind class="ps-focus-visible"'), na, na]],
      row('Disabled', 'c', ' disabled'),
      row('Checked · Disabled', 'd', ' disabled checked'),
    ];
    const el = document.createElement('div');
    el.innerHTML = matrix(['.checkbox', '.radio', '.switch'], rows, { full: true });
    el.querySelectorAll('[data-ind]').forEach((i) => { i.indeterminate = true; });
    return el;
  },
};

// ── Playground ──
export const Playground = {
  argTypes: { kind: { control: 'inline-radio', options: ['checkbox', 'radio', 'switch'], description: '종류 — `.checkbox` · `.radio` · `.switch`' } },
  args: { kind: 'checkbox' },
  render: (a) => (a.kind === 'radio'
    ? '<div role="radiogroup" aria-label="처리 구분">' + rd('pg', a.label, opt(a)) + '</div>'
    : (a.kind === 'switch' ? sw : ck)(a.label, opt(a))),
};
