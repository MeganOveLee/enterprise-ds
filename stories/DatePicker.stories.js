// Form/Date Picker — 문서 화면은 DatePicker.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
const dp = (label, value = '', extra = '', cls = '') =>
  `<div class="ui-datepicker${cls}"><button type="button" class="ui-datepicker__icon">${ICON}</button>` +
  `<input class="ui-datepicker__input" aria-label="${label}" placeholder="YYYY-MM-DD" value="${value}"${extra}></div>`;
// 기간 — x1 · c1 = 시작일 칸 속성 · 상자 클래스, x2 = 종료일 칸 속성
const range = (a, b, { x1 = '', c1 = '', x2 = '' } = {}) =>
  '<div class="ui-datepicker-range">' + dp('시작일', a, x1, c1) + '<span class="ui-datepicker-range__sep">~</span>' + dp('종료일', b, x2) + '</div>';
const ST = { default: '', error: ' aria-invalid="true"', disabled: ' disabled', readonly: ' readonly' };

export default {
  title: 'Form/Date Picker',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 DatePicker.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 하나 = {
  render: () => `<div style="max-width:200px">${dp('납기일', '2026-10-06')}</div>`,
};

export const 기간 = {
  parameters: { docs: { description: { story: '`.ui-datepicker-range` 안의 두 칸은 서로 min/max가 걸립니다. 종료일은 시작일보다 앞 날짜를 못 고릅니다.' } } },
  render: () => `<div style="max-width:420px"><div class="ui-datepicker-range">${dp('시작일', '2026-10-06')}<span class="ui-datepicker-range__sep">~</span>${dp('종료일', '2026-10-20')}</div></div>`,
};

export const 고를_수_있는_범위 = {
  parameters: { docs: { description: { story: '`min` · `max` 밖의 날짜는 비활성(취소선)으로 보입니다.' } } },
  render: () => `<div style="max-width:200px">${dp('희망일', '2026-10-15', ' min="2026-10-10" max="2026-10-25"')}</div>`,
};

// ── 펼친 달력 — 날짜 상태 클래스. 실제 달력(js/datepicker.js)을 한 번 열어 그 모습을 옆에 고정해 둠(눌러지지 않는 그림) ──
const DAY_SRC = [
  '<!-- 달력은 js/datepicker.js 가 그린다. 날짜 칸의 상태 클래스 -->',
  '<button class="datepicker__day is-today" aria-current="date">     <!-- 오늘 -->',
  '<button class="datepicker__day is-selected" aria-selected="true"> <!-- 고른 날 -->',
  '<button class="datepicker__day is-in-range">                      <!-- 기간 사이 -->',
  '<button class="datepicker__day is-range-end">                     <!-- 기간의 다른 쪽 끝 -->',
  '<button class="datepicker__day is-disabled" aria-disabled="true"> <!-- 선택 가능 범위 밖 -->',
  '<button class="datepicker__day is-outside">                       <!-- 앞 · 뒤 달 -->',
].join('\n');
export const 펼친_달력 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: DAY_SRC } } },
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap';
    el.innerHTML = '<div style="width:420px">' + range('2026-10-06', '2026-10-20') + '</div><div class="dp-static" inert aria-hidden="true" style="min-height:300px"></div>';
    setTimeout(() => {
      const inp = el.querySelector('.ui-datepicker__input'); if (!inp) return;
      inp.click();
      setTimeout(() => {
        const pop = document.querySelector('.datepicker.is-open');
        if (pop) { const c = pop.cloneNode(true); c.removeAttribute('id'); c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id')); c.style.cssText = 'position:static;display:block'; el.querySelector('.dp-static').appendChild(c); }
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));   // 실제 달력은 닫음(바깥 누름)
      }, 250);
    }, 500);
    return el;
  },
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) — 미리보기만 ──
const wide = (h) => '<div style="width:100%;max-width:360px">' + h + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: 구성 「기간」 · DS-ADR-016 — 두 칸이 서로 min/max를 잡아 기간이 뒤집히지 않음
    { title: '기간은 기간 묶음으로',
      do: [wide(range('2026-10-06', '2026-10-20')), '시작일 · 종료일은 .ui-datepicker-range로 묶어 기간이 뒤집히지 않게 합니다.'],
      dont: [wide('<div class="sb-row" style="gap:8px;flex-wrap:nowrap">' + dp('시작일', '2026-10-20') + dp('종료일', '2026-10-06') + '</div>'),
        '두 칸을 따로 두면 종료일이 시작일보다 앞서도 막지 못합니다.'] },
    // 근거: DS-ADR-016 직접 입력 · 구성 「상태」 — 읽기 전용이면 달력이 열리지 않음
    { title: '입력받는 칸은 직접 입력도 열어 두기',
      do: ['<div style="width:200px">' + dp('납기일', '2026-10-06') + '</div>', '날짜를 직접 입력하거나 달력으로 고를 수 있게 둡니다.'],
      dont: ['<div style="width:200px">' + dp('납기일', '2026-10-06', ST.readonly) + '</div>', '입력받을 칸에 readonly를 붙이면 입력도 달력도 막힙니다.'] },
  ]),
};

// ── 전체 상태 ── (Hovered · Focused = 문서용 정지 화면, _pseudo.js. 오류 · 비활성 · 읽기 전용 = 입력칸과 같은 규칙, 2026-10-13)
export const 전체_상태 = {
  parameters: {
    controls: { disable: true },
    docs: { source: { language: 'html', code: [
      '<!-- Hovered · Focused 는 마우스 · 키보드에 따라 CSS가 표시한다 (클래스 불필요) -->',
      '<!-- 오류 · 비활성 · 읽기 전용은 날짜 필드(input)에 속성을 붙이면 감싸는 상자가 모양을 바꾼다 -->',
      dp('납기일', '2026-10-06', ST.error),
      dp('납기일', '2026-10-06', ST.disabled),
      dp('납기일', '2026-10-06', ST.readonly),
    ].join('\n') } },
  },
  render: () => {
    enablePseudo();
    const v1 = '2026-10-06', v2 = '2026-10-20';
    return matrix(['단일 날짜', '기간'], [
      ['Default', [dp('납기일'), range('', '')]],
      ['Filled', [dp('납기일', v1), range(v1, v2)]],
      ['Hovered', [dp('납기일', v1, '', ' ps-hover'), range(v1, v2, { c1: ' ps-hover' })]],
      ['Focused', [dp('납기일', v1, '', ' ps-focus-within'), range(v1, v2, { c1: ' ps-focus-within' })]],
      ['Error', [dp('납기일', v1, ST.error), range(v1, v2, { x2: ST.error })]],
      ['Disabled', [dp('납기일', v1, ST.disabled), range(v1, v2, { x1: ST.disabled, x2: ST.disabled })]],
      ['Readonly', [dp('납기일', v1, ST.readonly), range(v1, v2, { x1: ST.readonly, x2: ST.readonly })]],
    ], { full: true });
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    label: { control: 'text', description: '칸 이름 — `aria-label`' },
    value: { control: 'text', description: '값 — YYYY-MM-DD' },
    min: { control: 'text', description: '고를 수 있는 첫날 — `min`' },
    max: { control: 'text', description: '고를 수 있는 마지막 날 — `max`' },
    state: { control: 'inline-radio', options: ['default', 'error', 'disabled', 'readonly'], description: '상태 — 날짜 칸(input)에 `aria-invalid="true"` · `disabled` · `readonly`' },
  },
  args: { label: '납기일', value: '2026-10-15', min: '2026-10-10', max: '2026-10-25', state: 'default' },
  render: (a) => '<div style="max-width:200px">' +
    dp(a.label, a.value, (a.min ? ' min="' + a.min + '"' : '') + (a.max ? ' max="' + a.max + '"' : '') + (ST[a.state] || '')) + '</div>',
};
