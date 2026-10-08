import { matrix } from './_matrix.js';

const field = ({ kind, state, value, placeholder }) => {
  const a = ` aria-label="${placeholder || '입력'}"` +
    (state === 'error' ? ' aria-invalid="true"' : '') +
    (state === 'disabled' ? ' disabled' : '') +
    (state === 'readonly' && kind !== 'select' ? ' readonly' : '');
  if (kind === 'select') return `<select class="select"${a}><option>${value || '선택'}</option><option>설계 변경</option></select>`;
  if (kind === 'textarea') return `<textarea class="textarea"${a} rows="2" placeholder="${placeholder}">${value}</textarea>`;
  return `<input class="input"${a} placeholder="${placeholder}" value="${value}">`;
};

export default {
  title: 'Form/Input',
  tags: ['!dev'],   // 개별 예시는 메뉴에서 숨기고 Docs 페이지 안 섹션으로만 (MDX 문서는 그대로 보이게 파일마다 지정)
  render: (args) => `<div style="max-width:280px">${field(args)}</div>`,
  argTypes: {
    kind: { control: 'inline-radio', options: ['input', 'select', 'textarea'], description: '`.input` · `.select` · `.textarea`' },
    state: { control: 'inline-radio', options: ['default', 'error', 'disabled', 'readonly'], description: '오류 = `aria-invalid="true"`' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: { kind: 'input', state: 'default', value: '', placeholder: '부품 번호 입력' },
  parameters: {
    docs: { description: { component:
      '입력칸 셋은 한 곳에 정의하고 화면별 규칙은 크기만 바꿉니다. 높이 `--size-input` 28 · 테두리 `--color-border-input` (DS-ADR-010 · 013). ' +
      '입력칸에는 Pressed 상태가 없습니다. readonly는 회색 박스 — 한 줄 · 여러 줄 · 상세 폼이 같은 모양이고 테두리는 연하게(DS-ADR-017).' } },
  },
};

export const Playground = {};

export const 전체_상태 = {
  parameters: { controls: { disable: true } },
  render: () => {
    const st = [['기본', 'default', ''], ['값 있음', 'default', 'v'], ['error', 'error', 'v'], ['disabled', 'disabled', 'v'], ['readonly', 'readonly', 'v']];
    const val = { input: 'BRK-20417', select: '설계 변경', textarea: '홀 위치 2mm 이동' };
    const ph = { input: '부품 번호 입력', select: '', textarea: '변경 사유' };
    const kinds = ['input', 'select', 'textarea'];
    const rows = st.map(([name, state, v]) =>
      [name, kinds.map((k) => field({ kind: k, state, value: v ? val[k] : '', placeholder: ph[k] || name }))]);
    return matrix(kinds.map((k) => '.' + k), rows, { wide: true });
  },
};
