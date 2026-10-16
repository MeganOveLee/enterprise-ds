// Form/Input — 문서 화면은 Input.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 표 · 전체 상태 · Playground
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

// cls = 문서용 정지 상태 클래스(ps-hover · ps-focus, _pseudo.js)
const field = ({ kind, state, value, placeholder, cls = '' }) => {
  const c = cls ? ' ' + cls : '';
  const a = ` aria-label="${placeholder || '입력'}"` +
    (state === 'error' ? ' aria-invalid="true"' : '') +
    (state === 'disabled' ? ' disabled' : '') +
    (state === 'readonly' ? ' readonly' : '');
  // 네이티브 select는 readonly가 안 됨 → 값만 보여 줄 때는 readonly input (DS-ADR-017, 2026-10-13)
  if (kind === 'select' && state === 'readonly') return `<input class="input${c}"${a} value="${value || '설계 변경'}">`;
  if (kind === 'select') return `<select class="select${c}"${a}><option>${value || '선택'}</option><option>설계 변경</option></select>`;
  if (kind === 'textarea') return `<textarea class="textarea${c}"${a} rows="2" placeholder="${placeholder}">${value}</textarea>`;
  return `<input class="input${c}"${a} placeholder="${placeholder}" value="${value}">`;
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
    state: { control: 'inline-radio', options: ['default', 'error', 'disabled', 'readonly'], description: '상태 — 오류 = `aria-invalid="true"`. select에서 readonly를 고르면 readonly input으로 그림(select는 readonly가 안 됨)' },
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
// 라벨 — 칸 위에 붙는 글자 = .search-label (Figma 「Label」). 라벨 위 · 칸 아래 짝(.ff-field)을 폼 칸(.form-grid-2)에 놓음
const LABEL = [
  '<div class="form-grid-2">',
  '  <div class="ff-field"><label class="search-label" for="in-docno">문서 번호</label><div class="td"><input class="input" id="in-docno"></div></div>',
  '  <div class="ff-field"><label class="search-label" for="in-state">작업현황</label><div class="td"><select class="select" id="in-state"><option>전체</option><option>작업 중</option></select></div></div>',
  '</div>',
];
export const Label = {
  parameters: html(LABEL),
  render: () => '<div style="max-width:480px">' + LABEL.join('') + '</div>',
};

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
// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-70) — 입력 · 선택 ──
const ff = (label, ctl, id) => '<div class="form-grid-2" style="grid-template-columns:1fr;width:220px"><div class="ff-field"><label class="search-label" for="' + id + '">' + label + '</label><div class="td">' + ctl + '</div></div></div>';
const one = (ctl) => '<div style="width:220px">' + ctl + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '라벨은 칸 위에 늘 보이게',
      do: [ff('문서 번호', '<input class="input" id="dd-no" placeholder="예: DOC-2610-0013">', 'dd-no'),
        '라벨(.search-label)을 칸 위에 두고 for · id로 잇습니다. 안내 글자는 입력 예시에만 씁니다.'],
      dont: [one('<input class="input" placeholder="문서 번호">'),
        '안내 글자만 두면 입력을 시작하는 순간 사라져, 무엇을 넣는 칸이었는지 잊습니다.'] },
    { title: '정해진 값 중에서 고를 때는 선택',
      do: [ff('작업현황', '<select class="select" id="dd-st"><option>전체</option><option>작업 중</option><option>검토 중</option></select>', 'dd-st'),
        '값이 정해져 있으면 선택(.select)으로 받습니다.'],
      dont: [ff('작업현황', '<input class="input" id="dd-st2" placeholder="작업 중 / 검토 중 중에서 입력">', 'dd-st2'),
        '직접 입력하면 같은 값을 다르게 적어 검색에서 빠집니다.'] },
    { title: '두세 개를 한눈에 비교할 때는 라디오',
      do: ['<div class="form-grid-2" style="grid-template-columns:1fr;width:220px"><div class="ff-field"><span class="search-label" id="dd-ver">버전</span><div class="radio-group" role="radiogroup" aria-labelledby="dd-ver">' +
        '<label class="radio"><input type="radio" name="dd-ver" checked><span class="radio__mark"></span>최신 버전</label><label class="radio"><input type="radio" name="dd-ver"><span class="radio__mark"></span>모든 버전</label></div></div></div>',
        '선택지가 두세 개면 라디오 묶음(.radio-group)으로 펼쳐 둡니다. 누르지 않아도 모두 보입니다.'],
      dont: [ff('버전', '<select class="select" id="dd-ver2"><option>최신 버전</option><option>모든 버전</option></select>', 'dd-ver2'),
        '두 개뿐인 값을 선택 안에 숨기면 다른 값이 있는지 열어 봐야 압니다.'] },
    { title: '보여 주기만 하는 값은 읽기 전용',
      do: [ff('문서 분류', '<input class="input" id="dd-cls" value="/제품 문서/설계 문서" readonly>', 'dd-cls'),
        '편집만 막고 값은 그대로 읽힙니다. 키보드로 들어가 값을 복사할 수 있습니다.'],
      dont: [ff('문서 분류', '<input class="input" id="dd-cls2" value="/제품 문서/설계 문서" disabled>', 'dd-cls2'),
        '비활성은 지금 조건에서 쓸 수 없는 칸에만 씁니다. 키보드로 들어갈 수 없어 값을 복사하기 어렵습니다.'] },
    { title: '오류는 글로 알려 주기',
      do: [ff('문서 명', '<input class="input" id="dd-nm" aria-invalid="true" aria-describedby="dd-nm-err"><span class="field-error-msg" id="dd-nm-err">문서 명을 입력해 주세요</span>', 'dd-nm'),
        '칸에 aria-invalid를 붙이고, 무엇이 틀렸는지 오류 글(.field-error-msg)로 적어 aria-describedby로 잇습니다.'],
      dont: [ff('문서 명', '<input class="input" id="dd-nm2" aria-invalid="true">', 'dd-nm2'),
        '빨간 테두리만으로는 무엇을 고쳐야 할지 모르고, 색을 구분하기 어려우면 보이지도 않습니다.'] },
  ]),
};

export const 전체_상태 = {
  parameters: html([
    '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
    '<!-- select는 readonly가 안 된다 — 값만 보여 줄 때는 readonly input -->',
    field({ kind: 'input', state: 'error', value: 'BRK-20417', placeholder: '부품 번호 입력' }) + '   <!-- 오류 -->',
    field({ kind: 'input', state: 'disabled', value: 'BRK-20417', placeholder: '부품 번호 입력' }),
    field({ kind: 'input', state: 'readonly', value: 'BRK-20417', placeholder: '부품 번호 입력' }),
  ]),
  render: () => {
    enablePseudo();
    const st = [['기본', 'default', ''], ['값 있음', 'default', 'v'], ['Hovered', 'default', 'v', 'ps-hover'], ['Focused', 'default', 'v', 'ps-focus'],
      ['error', 'error', 'v'], ['disabled', 'disabled', 'v'], ['readonly', 'readonly', 'v']];
    const val = { input: 'BRK-20417', select: '설계 변경', textarea: '홀 위치 2mm 이동' };
    const ph = { input: '부품 번호 입력', select: '', textarea: '변경 사유' };
    const kinds = ['input', 'select', 'textarea'];
    const na = '<span class="sb-h">—</span>';
    const rows = st.map(([name, state, v, cls]) =>
      [name, kinds.map((k) => (k === 'select' && state === 'readonly' ? na
        : field({ kind: k, state, value: v ? val[k] : '', placeholder: ph[k] || name, cls })))]);
    return matrix(kinds.map((k) => '.' + k), rows, { wide: true }) +
      '<p class="sb-note" style="margin:8px 0 0">select의 readonly 칸은 비워 둡니다 — 네이티브 select는 readonly가 되지 않습니다. 값만 보여 줄 때는 readonly input을 씁니다.</p>';
  },
};

// ── Playground ──
export const Playground = {};
