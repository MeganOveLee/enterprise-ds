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
export const Checkbox = { render: (a) => ck(a.label, opt(a)) };

export const 부분_선택 = {
  parameters: html([ck('전체 선택'), '<!-- 부분 선택은 속성이 없어 스크립트로 켠다: input.indeterminate = true -->']),
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = ck('전체 선택');
    el.querySelector('input').indeterminate = true;
    return el;
  },
};

export const Radio = {
  args: { label: '긴급' },
  render: (a) => `<div role="radiogroup" aria-label="처리 구분" class="sb-row">${rd('g1', '정규', ' checked')}${rd('g1', a.label, opt(a))}</div>`,
};

export const Switch = { args: { label: '자동 저장' }, render: (a) => sw(a.label, opt(a)) };

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) — 미리보기만 ──
const saveForm = (ctl) => '<div class="sb-row" style="gap:12px">' + ctl + '<button type="button" class="btn btn--primary btn--filled">저장</button></div>';
const stack = (h) => '<div style="display:grid;gap:8px">' + h + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = doDont([
      // 근거: 구성 「스위치」 — 누르는 즉시 적용되는 설정에만, 저장해야 적용되는 값은 체크박스
      { title: '저장해야 적용되는 값은 체크박스',
        do: [saveForm(ck('결재 포함')), '저장을 눌러야 적용되는 값은 체크박스로 받습니다.'],
        dont: [saveForm(sw('결재 포함')), '스위치는 누르는 즉시 적용되는 것으로 읽힙니다.'] },
      // 근거: 예시 「체크박스 · 라디오」 — 여러 개는 체크박스, 하나만은 라디오
      { title: '하나만 고르는 값은 라디오',
        do: ['<div role="radiogroup" aria-label="처리 구분" class="sb-row">' + rd('dd-sel-g1', '정규', ' checked') + rd('dd-sel-g1', '긴급') + '</div>',
          '둘 중 하나만 고르는 값은 라디오로 묶습니다.'],
        dont: ['<div class="sb-row">' + ck('정규', ' checked') + ck('긴급', ' checked') + '</div>',
          '체크박스로 두면 서로 맞지 않는 값을 함께 고를 수 있습니다.'] },
      // 근거: 예시 「부분 선택」 — 「전체 선택」 아래 항목 중 일부만 골랐을 때
      { title: '일부만 골랐을 때는 부분 선택',
        do: [stack(ck('전체 선택', ' data-ind') + ck('사양서', ' checked') + ck('도면', ' checked') + ck('시험 성적서')),
          '아래 항목 중 일부만 고르면 「전체 선택」을 부분 선택으로 표시합니다.'],
        dont: [stack(ck('전체 선택') + ck('사양서', ' checked') + ck('도면', ' checked') + ck('시험 성적서')),
          '꺼진 채로 두면 아무것도 고르지 않은 것처럼 보입니다.'] },
    ]);
    el.querySelectorAll('[data-ind]').forEach((i) => { i.indeterminate = true; });
    return el;
  },
};

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: html([
    '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
    ck('결재 포함', ' checked disabled'),
    rd('d', '보류', ' checked disabled'),
    sw('자동 저장', ' checked disabled'),
  ]),
  // 행 = 상태, 열 = 종류 (상태가 7개라 열로 두면 칸이 좁아 글자가 줄바꿈됨 — Input · Date Picker와 같은 방향)
  render: () => {
    enablePseudo();
    const na = '<span class="sb-h">—</span>';
    const rows = [
      ['꺼짐', [ck('결재 포함'), rd('a', '정규'), sw('자동 저장')]],
      ['Hovered', [ck('결재 포함', ' class="ps-hover"'), rd('h', '정규', ' class="ps-hover"'), sw('자동 저장', ' class="ps-hover"')]],
      ['Focused', [ck('결재 포함', ' class="ps-focus-visible"'), rd('f', '정규', ' class="ps-focus-visible"'), sw('자동 저장', ' class="ps-focus-visible"')]],
      ['켜짐', [ck('결재 포함', ' checked'), rd('b', '긴급', ' checked'), sw('자동 저장', ' checked')]],
      ['부분 선택', [ck('결재 포함', ' data-ind'), na, na]],
      ['disabled', [ck('결재 포함', ' disabled'), rd('c', '보류', ' disabled'), sw('자동 저장', ' disabled')]],
      ['켜짐+disabled', [ck('결재 포함', ' disabled checked'), rd('d', '보류', ' disabled checked'), sw('자동 저장', ' disabled checked')]],
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
