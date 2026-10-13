// Form/Date Picker — 문서 화면은 DatePicker.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
import { matrix } from './_matrix.js';

const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
const dp = (label, value = '', extra = '', cls = '') =>
  `<div class="ui-datepicker${cls}"><button type="button" class="ui-datepicker__icon">${ICON}</button>` +
  `<input class="ui-datepicker__input" aria-label="${label}" placeholder="YYYY-MM-DD" value="${value}"${extra}></div>`;
const range = (a, b, cls = '') =>
  '<div class="ui-datepicker-range">' + dp('시작일', a, '', cls) + '<span class="ui-datepicker-range__sep">~</span>' + dp('종료일', b) + '</div>';

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

// ── 전체 상태 ── (Focused = 달력이 열렸거나 칸에 포커스가 있을 때와 같은 모습)
export const 전체_상태 = {
  parameters: {
    controls: { disable: true },
    docs: { source: { language: 'html', code: [
      '<!-- Focused 는 칸에 포커스가 있거나 달력이 열렸을 때 CSS가 표시한다 (클래스 불필요) -->',
      dp('납기일'),
      range('2026-10-06', '2026-10-20'),
    ].join('\n') } },
  },
  render: () => matrix(['하나', '기간'], [
    ['빈 칸', [dp('납기일'), range('', '')]],
    ['값 있음', [dp('납기일', '2026-10-06'), range('2026-10-06', '2026-10-20')]],
    ['Focused', [dp('납기일', '2026-10-06', '', ' is-active'), range('2026-10-06', '2026-10-20', ' is-active')]],
  ], { full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    label: { control: 'text', description: '칸 이름 — `aria-label`' },
    value: { control: 'text', description: '값 — YYYY-MM-DD' },
    min: { control: 'text', description: '고를 수 있는 첫날 — `min`' },
    max: { control: 'text', description: '고를 수 있는 마지막 날 — `max`' },
  },
  args: { label: '납기일', value: '2026-10-15', min: '2026-10-10', max: '2026-10-25' },
  render: (a) => '<div style="max-width:200px">' +
    dp(a.label, a.value, (a.min ? ' min="' + a.min + '"' : '') + (a.max ? ' max="' + a.max + '"' : '')) + '</div>',
};
