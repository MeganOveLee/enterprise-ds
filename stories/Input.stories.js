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
  // 값이 없으면 빈 값 옵션 「선택」 = placeholder(보조 글자색, Figma Select placeholder Default)
  if (kind === 'select') return `<select class="select${c}"${a}>${value ? `<option>${value}</option>` : '<option value="">선택</option>'}<option>설계 변경</option></select>`;
  if (kind === 'textarea') return `<textarea class="textarea${c}"${a} rows="3" placeholder="${placeholder}">${value}</textarea>`;
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
    state: { control: 'inline-radio', options: ['default', 'error', 'disabled', 'readonly'], description: '상태 — 오류 = `aria-invalid="true"`. 셀렉트에서 readonly를 고르면 readonly 텍스트 필드로 그림(셀렉트는 readonly가 없음)' },
    value: { control: 'text', description: '값' },
    placeholder: { control: 'text', description: 'placeholder — 입력 전 안내 글자' },
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
    ['쓰임', [note('글자 · 숫자를 직접 입력<br>부품 번호 · 이름 · 검색어'), note('정해진 목록에서 하나 선택<br>구분 · 상태'), note('여러 줄을 입력 — 사유 · 비고<br>기본 높이 180, rows를 주면 그 줄 수만큼<br>높이는 세로로만 늘릴 수 있음')]],
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

// 지우기(×) — 조회 조건 칸에 값이 있을 때만(DS-ADR-042). data-ds-clear 를 달면 js/clear.js 가 버튼을 붙임. 편집 폼 · 읽기 전용 칸에는 붙지 않음
const CLEAR = [
  '<div class="form-grid-2">',
  '  <div class="ff-field"><label class="search-label" for="in-clear-no">문서 번호</label><div class="td"><input class="input" id="in-clear-no" value="DOC-2610" data-ds-clear></div></div>',
  '  <div class="ff-field"><label class="search-label" for="in-clear-ro">문서 분류</label><div class="td"><input class="input" id="in-clear-ro" value="/제품 문서/설계 문서" readonly data-ds-clear></div></div>',
  '</div>',
];
export const 지우기 = {
  parameters: html(CLEAR),
  render: () => '<div style="max-width:480px">' + CLEAR.join('') + '</div>',
};

export const Locked = {
  parameters: html(LOCKED),
  render: () => matrix(['비활성', '읽기 전용'], [
    ['미리보기', LOCKED],
    ['속성', [code('disabled'), code('readonly')]],
    ['쓰임', [
      note('지금 입력할 수 없는 필드 — 조건이 맞으면 활성<br>Tab 순서에서 빠지고, 값은 제출되지 않음'),
      note('값을 표시만 하는 필드 — 상세 화면 · 결재가 끝난 문서<br>Tab으로 이동해 값을 복사할 수 있고, 값은 제출됨'),
    ]],
  ], { full: true }),
};

// ── 셀렉트 목록 — js/select.js 가 select 를 같은 목록(.ui-select)으로 바꿈. 왼쪽 = 눌러 보기, 오른쪽 = 열린 모습(정지 화면) ──
const SEL_OPTS = ['전체', '작업 중', '검토 중', '승인', '반려'];
const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
const openList = (id, pick, act) => '<div class="ui-select"><div class="ui-select__trigger is-open" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="true" aria-controls="' + id + '-list" aria-labelledby="' + id + '-lb" aria-activedescendant="' + id + '-opt-' + act + '">' +
  '<span class="ui-select__value">' + SEL_OPTS[pick] + '</span><span class="ui-select__chevron">' + CHEV + '</span></div>' +
  '<div class="ui-select__menu show" role="listbox" id="' + id + '-list" aria-labelledby="' + id + '-lb">' +
  SEL_OPTS.map((o, i) => '<div class="ui-select__option' + (i === pick ? ' is-selected' : '') + (i === act ? ' is-active' : '') + '" role="option" id="' + id + '-opt-' + i + '" aria-selected="' + (i === pick) + '">' + o + '</div>').join('') + '</div></div>';
const SEL_SRC = [
  '<!-- 불러오기만 하면 화면의 보이는 단일 select 가 모두 같은 목록으로 바뀝니다. 바꾸지 않을 select 는 class="no-ui" -->',
  '<script src="js/select.js"></script>',
  '',
  '<label class="search-label" for="state">작업현황</label>',
  '<select class="select" id="state">' + SEL_OPTS.map((o) => '<option>' + o + '</option>').join('') + '</select>',
  '',
  '<!-- 바뀐 뒤(스크립트가 그림) — 원래 select 는 숨어서 값 · 폼 제출 · change 를 그대로 맡음 -->',
  '<div class="ui-select">',
  '  <div class="ui-select__trigger" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-controls="…-list" aria-labelledby="state-label">',
  '    <span class="ui-select__value">전체</span><span class="ui-select__chevron">…</span>',
  '  </div>',
  '  <div class="ui-select__menu" role="listbox" id="…-list">',
  '    <div class="ui-select__option is-selected" role="option" aria-selected="true">전체</div> …',
  '  </div>',
  '  <select class="select ui-select__native" id="state" aria-hidden="true" tabindex="-1">…</select>',
  '</div>',
];
export const 선택_목록 = {
  parameters: html(SEL_SRC),
  render: () => {
    const el = document.createElement('div');
    el.innerHTML = matrix(['눌러 보기', '열린 모습'], [
      ['미리보기', ['<div class="form-grid-2" style="grid-template-columns:1fr;width:220px;text-align:left"><div class="ff-field"><label class="search-label" for="in-sel-live">작업현황</label><div class="td">' +
        '<select class="select" id="in-sel-live">' + SEL_OPTS.map((o) => '<option>' + o + '</option>').join('') + '</select></div></div></div>',
        '<div class="form-grid-2" style="grid-template-columns:1fr;width:220px;min-height:208px;text-align:left"><div class="ff-field"><span class="search-label" id="in-sel-open-lb">작업현황</span><div class="td">' + openList('in-sel-open', 2, 3) + '</div></div></div>']],
      ['쓰임', [note('누르거나 ↓ · Enter로 열고, ↑↓로 옮겨 Enter로 고릅니다<br>Esc = 고르지 않고 닫기 · 글자 입력 = 그 글자로 시작하는 항목'), note('고른 항목 = 옅은 브랜드 바탕 + 브랜드 글자 + 오른쪽 ✓<br>키보드로 옮긴 항목 = 테두리(포커스는 상자에 둠)')]],
    ], { full: true });
    setTimeout(() => { const sel = el.querySelector('#in-sel-live'); if (sel && window.buildCustomSelect) window.buildCustomSelect(sel); }, 0);
    return el;
  },
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 25번 ① ~ ④) ──
const ff = (label, ctl, id, req = false) => '<div class="form-grid-2" style="grid-template-columns:1fr;width:220px;text-align:left"><div class="ff-field"><label class="search-label" for="' + id + '">' + label + (req ? '<span class="required" aria-hidden="true"></span>' : '') + '</label><div class="td">' + ctl + '</div></div></div>';
const one = (ctl) => '<div style="width:220px">' + ctl + '</div>';
const pair = (a, b) => '<div style="display:grid;gap:12px">' + a + b + '</div>';
// 라벨 글자에 별표 · (필수)를 직접 쓴 잘못된 예 — .required 없이
const rawLabel = (label, ctl, id) => '<div class="form-grid-2" style="grid-template-columns:1fr;width:220px;text-align:left"><div class="ff-field"><label class="search-label" for="' + id + '">' + label + '</label><div class="td">' + ctl + '</div></div></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '라벨은 필드 위에',
      do: [ff('문서 번호', '<input class="input" id="dd-no" placeholder="예: DOC-2610-0013">', 'dd-no'),
        '라벨(.search-label)을 필드 위에 두고 for · id로 연결합니다. placeholder는 입력 예시에만 씁니다.'],
      dont: [one('<input class="input" aria-label="문서 번호" placeholder="문서 번호">'),
        'placeholder를 라벨 대신 쓰면 입력을 시작하는 순간 사라져, 무엇을 입력하는 필드인지 알 수 없습니다.'] },
    { title: '필수 표시는 .required 한 가지로',
      do: [pair(ff('문서 명', '<input class="input" id="dd-rq1" aria-required="true">', 'dd-rq1', true), ff('문서 분류', '<input class="input" id="dd-rq2" aria-required="true">', 'dd-rq2', true)),
        '필수 필드는 모두 라벨 뒤 .required로 표시하고, 필드에는 aria-required를 붙입니다.'],
      dont: [pair(rawLabel('문서 명 *', '<input class="input" id="dd-rq3">', 'dd-rq3'), rawLabel('문서 분류 (필수)', '<input class="input" id="dd-rq4">', 'dd-rq4')),
        '별표와 「(필수)」를 섞어 쓰면 같은 뜻이 서로 다른 표시로 보입니다.'] },
    { title: '여러 줄 입력은 텍스트 영역',
      do: [ff('변경 사유', '<textarea class="textarea" id="dd-why" rows="3">고객 요청으로 브래킷 홀 위치를 2mm 옮기고, 도면 주석을 함께 고칩니다.</textarea>', 'dd-why'),
        '사유 · 설명처럼 길이가 정해지지 않은 입력은 텍스트 영역(.textarea)으로 받습니다.'],
      dont: [ff('변경 사유', '<input class="input" id="dd-why2" value="고객 요청으로 브래킷 홀 위치를 2mm 옮기고, 도면 주석을 함께 고칩니다.">', 'dd-why2'),
        '한 줄 필드에 긴 글을 넣으면 앞뒤가 가려져, 입력한 내용을 한눈에 확인할 수 없습니다.'] },
    { title: '오류는 빨간 테두리와 오류 문구를 함께',
      do: [ff('문서 명', '<input class="input" id="dd-nm" aria-invalid="true" aria-describedby="dd-nm-err"><span class="field-error-msg" id="dd-nm-err">문서 명을 입력해 주십시오.</span>', 'dd-nm'),
        '필드에 aria-invalid를 붙여 빨간 테두리로 표시하고, 아래에 오류 문구(.field-error-msg)를 aria-describedby로 연결해 함께 둡니다.'],
      dont: [pair(ff('문서 명', '<input class="input" id="dd-nm2" aria-invalid="true">', 'dd-nm2'),
          ff('문서 분류', '<input class="input" id="dd-nm3" aria-describedby="dd-nm3-err"><span class="field-error-msg" id="dd-nm3-err">문서 분류를 선택해 주십시오.</span>', 'dd-nm3')),
        '테두리만 있으면 무엇을 고칠지 알 수 없고, 문구만 있으면 어느 필드의 오류인지 찾기 어렵습니다.'] },
  ]),
};

export const 전체_상태 = {
  parameters: html([
    '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
    '<!-- select는 readonly가 안 된다 — 값만 보여 줄 때는 readonly input -->',
    field({ kind: 'input', state: 'error', value: 'BRK-20417', placeholder: '부품 번호 입력' }) + '   <!-- 오류 -->',
    field({ kind: 'input', state: 'disabled', value: 'BRK-20417', placeholder: '부품 번호 입력' }),
    field({ kind: 'input', state: 'readonly', value: 'BRK-20417', placeholder: '부품 번호 입력' }),
    field({ kind: 'input', state: 'default', value: '', placeholder: '아이디', cls: 'input--lg' }) + '   <!-- 큰 필드 -->',
    field({ kind: 'select', state: 'default', value: '' }) + '   <!-- 빈 값 옵션 = placeholder -->',
  ]),
  render: () => {
    enablePseudo();
    const st = [['Default', 'default', ''], ['Filled', 'default', 'v'], ['Hovered', 'default', 'v', 'ps-hover'], ['Focused', 'default', 'v', 'ps-focus'],
      ['Error', 'error', 'v'], ['Disabled', 'disabled', 'v'], ['Readonly', 'readonly', 'v']];
    // 셀렉트는 js/select.js 가 .ui-select 로 바꾸므로, Hovered · Focused 는 바뀐 트리거에 상태 클래스를 붙여 그림
    const trig = (cls) => '<div class="ui-select"><div class="ui-select__trigger ' + cls + '" role="combobox" tabindex="-1" aria-haspopup="listbox" aria-expanded="false" aria-label="상태 예시"><span class="ui-select__value">' + val.select + '</span><span class="ui-select__chevron">' + CHEV + '</span></div></div>';
    const val = { input: 'BRK-20417', lg: 'kim.minsu', select: '설계 변경', textarea: '홀 위치 2mm 이동' };
    const ph = { input: '부품 번호 입력', lg: '아이디', select: '', textarea: '변경 사유' };
    // 열 = 종류. 큰 필드(.input--lg) = Figma Text Field Size=Large
    const kinds = ['input', 'lg', 'select', 'textarea'];
    const head = { input: '.input', lg: '.input.input--lg', select: '.select', textarea: '.textarea' };
    const na = '<span class="sb-h">—</span>';
    const rows = st.map(([name, state, v, cls]) =>
      [name, kinds.map((k) => (k === 'select' && state === 'readonly' ? na
        : k === 'select' && cls ? trig(cls)
        : k === 'lg' ? field({ kind: 'input', state, value: v ? val.lg : '', placeholder: ph.lg, cls: 'input--lg' + (cls ? ' ' + cls : '') })
        : field({ kind: k, state, value: v ? val[k] : '', placeholder: ph[k] || name, cls })))]);
    return matrix(kinds.map((k) => head[k]), rows, { full: true }) +
      '<p class="sb-note" style="margin:8px 0 0">셀렉트에는 Readonly가 없습니다(네이티브 select는 readonly가 되지 않음). 값만 표시할 때는 readonly 텍스트 필드를 씁니다.</p>';
  },
};

// 셀렉트 옵션 행 상태 — Figma Option Type=Text(Selected × State)와 짝. 열린 목록 안 한 행만 정지 화면으로
const optCell = (text, { cls = '', sel = false, dis = false } = {}) =>
  '<div class="ui-select__menu show" role="listbox" aria-label="옵션 상태 예시" style="position:static;box-shadow:none;width:200px;min-width:0;margin:0 auto;text-align:left">' +
  '<div class="ui-select__option' + (sel ? ' is-selected' : '') + (cls ? ' ' + cls : '') + '" role="option" aria-selected="' + sel + '"' + (dis ? ' aria-disabled="true"' : '') + '>' + text + '</div></div>';
export const 옵션_상태 = {
  parameters: html([
    '<!-- 상태는 select.js 가 붙인다: 고른 항목 .is-selected + aria-selected="true" · 키보드 위치 .is-active · 막힌 항목 aria-disabled="true" -->',
    '<div class="ui-select__option is-selected" role="option" aria-selected="true">검토 중</div>',
    '<div class="ui-select__option" role="option" aria-selected="false" aria-disabled="true">폐기</div>',
  ]),
  render: () => {
    enablePseudo();
    return matrix(['고르지 않은 항목', '고른 항목 (.is-selected)'], [
      ['Default', [optCell('작업 중'), optCell('검토 중', { sel: true })]],
      ['Hovered', [optCell('작업 중', { cls: 'ps-hover' }), optCell('검토 중', { sel: true, cls: 'ps-hover' })]],
      ['Pressed', [optCell('작업 중', { cls: 'ps-active' }), optCell('검토 중', { sel: true, cls: 'ps-active' })]],
      ['키보드 위치 (.is-active)', [optCell('작업 중', { cls: 'is-active' }), optCell('검토 중', { sel: true, cls: 'is-active' })]],
      ['Disabled', [optCell('폐기', { dis: true }), optCell('폐기', { sel: true, dis: true })]],
    ], { full: true });
  },
};

// ── Playground ──
export const Playground = {};
