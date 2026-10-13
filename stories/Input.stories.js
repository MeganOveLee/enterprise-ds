// Form/Input — 문서 화면은 Input.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 표 · 전체 상태 · Playground
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

const note = (t) => '<span class="sb-note">' + t + '</span>';
const code = (t) => '<code>' + t + '</code>';
const html = (lines) => ({ controls: { disable: true }, docs: { source: { language: 'html', code: lines.join('\n') } } });

export default {
  title: 'Form/Input',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Input.mdx
  render: (args) => `<div style="max-width:280px">${field(args)}</div>`,
  argTypes: {
    kind: { control: 'inline-radio', options: ['input', 'select', 'textarea'], description: '종류 — `.input` · `.select` · `.textarea`' },
    state: { control: 'inline-radio', options: ['default', 'error', 'disabled', 'readonly'], description: '상태 — 오류 = `aria-invalid="true"`' },
    value: { control: 'text', description: '값' },
    placeholder: { control: 'text', description: '빈 칸 안내 글자' },
  },
  args: { kind: 'input', state: 'default', value: '', placeholder: '부품 번호 입력' },
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
const KIND = [
  field({ kind: 'input', state: 'default', value: '', placeholder: '부품 번호 입력' }),
  field({ kind: 'select', state: 'default', value: '', placeholder: '구분' }),
  field({ kind: 'textarea', state: 'default', value: '', placeholder: '변경 사유' }),
];
export const Kind = {
  parameters: html(KIND),
  render: () => matrix(['한 줄 입력', '선택', '여러 줄 입력'], [
    ['미리보기', KIND],
    ['클래스', [code('.input'), code('.select'), code('.textarea')]],
    ['쓰임', [note('글자 · 숫자를 직접 넣음<br>부품 번호 · 이름 · 검색어'), note('정해진 목록에서 하나 고름<br>구분 · 상태'), note('여러 줄을 넣음 — 사유 · 비고<br>높이는 세로로만 늘릴 수 있음')]],
  ], { full: true }),
};

const LOCKED = [
  field({ kind: 'input', state: 'disabled', value: 'BRK-20417', placeholder: '부품 번호' }),
  field({ kind: 'input', state: 'readonly', value: 'BRK-20417', placeholder: '부품 번호' }),
];
export const Locked = {
  parameters: html(LOCKED),
  render: () => matrix(['비활성', '읽기 전용'], [
    ['미리보기', LOCKED],
    ['속성', [code('disabled'), code('readonly')]],
    ['쓰임', [
      note('지금은 쓸 수 없는 칸 — 조건이 맞으면 열림<br>Tab으로 가지 않고, 폼을 보낼 때 값이 빠짐'),
      note('값을 보여 주기만 하는 칸 — 상세 화면 · 결재 끝난 문서<br>Tab으로 들어가 값을 복사할 수 있고, 값은 함께 보내짐'),
    ]],
  ], { full: true }),
};

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: html([
    '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
    field({ kind: 'input', state: 'error', value: 'BRK-20417', placeholder: '부품 번호 입력' }) + '   <!-- 오류 -->',
    field({ kind: 'input', state: 'disabled', value: 'BRK-20417', placeholder: '부품 번호 입력' }),
    field({ kind: 'input', state: 'readonly', value: 'BRK-20417', placeholder: '부품 번호 입력' }),
  ]),
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

// ── Playground ──
export const Playground = {};
