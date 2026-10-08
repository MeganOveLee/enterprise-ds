import { matrix } from './_matrix.js';

const ck = (t, o = '') => `<label class="checkbox"><input type="checkbox"${o}>${t}</label>`;
const rd = (n, t, o = '') => `<label class="radio"><input type="radio" name="${n}"${o}><span class="radio__mark"></span>${t}</label>`;
const sw = (t, o = '') => `<label class="switch"><input type="checkbox" role="switch"${o}>${t}</label>`;
const opt = ({ checked, disabled }) => (checked ? ' checked' : '') + (disabled ? ' disabled' : '');

export default {
  title: 'Form/Selection Controls',
  tags: ['!dev'],   // 개별 예시는 메뉴에서 숨기고 Docs 페이지 안 섹션으로만 (MDX 문서는 그대로 보이게 파일마다 지정)
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: '결재 포함', checked: false, disabled: false },
  parameters: {
    docs: { description: { component:
      '`.checkbox` · `.radio` · `.switch` — 네이티브 input을 그대로 써서 키보드 · 스크린리더가 기본으로 동작합니다. ' +
      '선택됨 + 비활성은 연회색. 스위치는 `role="switch"`. (DS-ADR-015)' } },
  },
};

export const Checkbox = { render: (a) => ck(a.label, opt(a)) };

export const 부분_선택 = {
  parameters: { controls: { disable: true }, docs: { description: { story: '`indeterminate`는 HTML 속성이 아니라 스크립트로 켭니다.' } } },
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

export const 전체_상태 = {
  parameters: { controls: { disable: true } },
  render: () => {
    const na = '<span class="sb-h">—</span>';
    const rows = [
      ['checkbox', [ck('결재 포함'), ck('결재 포함', ' checked'), ck('결재 포함', ' data-ind'), ck('결재 포함', ' disabled'), ck('결재 포함', ' disabled checked')]],
      ['radio', [rd('a', '정규'), rd('b', '긴급', ' checked'), na, rd('c', '보류', ' disabled'), rd('d', '보류', ' disabled checked')]],
      ['switch', [sw('자동 저장'), sw('자동 저장', ' checked'), na, sw('자동 저장', ' disabled'), sw('자동 저장', ' disabled checked')]],
    ];
    const el = document.createElement('div');
    el.innerHTML = matrix(['꺼짐', '켜짐', '부분 선택', 'disabled', '켜짐+disabled'], rows);
    el.querySelectorAll('[data-ind]').forEach((i) => { i.indeterminate = true; });
    return el;
  },
};
