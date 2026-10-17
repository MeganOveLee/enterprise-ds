// Feedback/Progress — 문서 화면은 Progress.mdx. Figma 이름은 Progress bar, DS 클래스는 .progress-bar
// 프로젝트 · 태스크의 진행률 막대(.progress-bar + .pbar-fill)와 상태 표시(.status-block = 막대 5개 + 상태 글자). 상태 5가지 = 완료 · 진행 · 지연 · 예정 · 보류
// 상태 글자(완료 · 진행중 …)는 CSS가 ::before 로 넣음 — 마크업은 비워 둠. 범례 점 색은 화면이 지정(클래스 없음)
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const ST = {   // 상태 — 이름 · 범례 기호
  done: ['완료', '<path d="M5 12l4 4 10-10"/>'],
  progress: ['진행', '<path d="M9 6l6 6-6 6"/>'],
  delay: ['지연', '<path d="M12 6v7M12 17.5v.5"/>'],
  plan: ['예정', '<path d="M12 7v5l3 2"/>'],
  hold: ['보류', '<path d="M9 7v10M15 7v10"/>'],
};
const KEYS = Object.keys(ST);

// 계획 표식이 있을 때 화면 읽기 문구 — 「진행률 58%, 계획 64%, 6%p 늦음」
const planText = (pct, plan) => '진행률 ' + pct + '%, 계획 ' + plan + '%, ' + (plan > pct ? (plan - pct) + '%p 늦음' : plan < pct ? (pct - plan) + '%p 빠름' : '계획대로');
const bar = (k = 'progress', pct = 58, name = '전체', label = true, plan) =>
  '<div class="progress-bar progress-bar--' + k + '" role="progressbar" aria-label="' + name + ' 진행률" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"' +
  (plan === undefined ? '' : ' aria-valuetext="' + planText(pct, plan) + '"') + '>' +
  '<div class="pbar-fill" style="width:' + pct + '%"></div>' + (label ? '<span class="progress-bar__label">' + pct + '%</span>' : '') +
  (plan === undefined ? '' : '<span class="progress-bar__plan" style="--plan:' + plan + '%" aria-hidden="true"></span>') + '</div>';
const status = (k = 'progress') =>
  '<div class="status-block status-block--' + k + '"><div class="status-segments status-segments--' + k + '" aria-hidden="true">' +
  '<span class="status-segments__bar"></span>'.repeat(5) + '</div><span class="status-text"></span></div>';
const row = (k, pct, name, label) => '<div class="progress-row">' + status(k) + bar(k, pct, name, label) + '</div>';
const legend = (keys = ['done', 'progress', 'delay', 'plan']) =>
  '<div class="left-legend">' + keys.map((k) => '<span class="legend-item"><span class="legend-dot" style="background:var(--color-progress-' + k + '-end)">' + svg(ST[k][1], 12) + '</span>' + ST[k][0] + '</span>').join('') + '</div>';
const box = (h, w = '560px') => '<div style="max-width:' + w + '">' + h + '</div>';

export default {
  title: 'Feedback/Progress',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Progress.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 진행률_막대 = {
  parameters: { docs: { source: { code: bar() } } },
  render: () => box(bar()),
};
export const 상태_표시와_함께 = {
  parameters: { docs: { source: { code: row('delay', 58, '전체') } } },
  render: () => box(row('delay', 58, '전체')),
};
const PHASES = [['설계', 'done', 100], ['시제품 제작', 'progress', 64], ['시험 · 검증', 'delay', 32], ['양산 이관', 'plan', 0]];
const phases = () => '<div style="display:grid;gap:10px">' + PHASES.map(([n, k, p]) =>
  '<div style="display:grid;grid-template-columns:96px 1fr;align-items:center;gap:12px;font-size:var(--body-sm);color:var(--color-text-base)"><span>' + n + '</span>' + bar(k, p, n) + '</div>').join('') + '</div>';
export const 단계별_목록 = {
  parameters: { docs: { source: { code: bar('done', 100, '설계') + '\n' + bar('progress', 64, '시제품 제작') + '\n<!-- … -->' } } },
  render: () => box(phases()),
};
const planHead = '<div style="display:flex;align-items:baseline;gap:12px;font-size:var(--body-sm);color:var(--color-text-muted);margin-bottom:6px">' +
  '<b style="font-size:var(--body-md);color:var(--color-text-base)">전체 진행률</b><span>계획 64% · 실적 58% · <b style="color:var(--color-text-danger)">6%p 늦음</b></span><span style="margin-left:auto"><span class="progress-plan-key" aria-hidden="true"></span>계획</span></div>';
export const 계획_표식 = {
  parameters: { docs: { source: { code: bar('delay', 58, '전체', true, 64) } } },
  render: () => box(planHead + bar('delay', 58, '전체', true, 64)),
};
export const 범례 = {
  parameters: { docs: { source: { code: legend() } } },
  render: () => box(legend(KEYS), '360px'),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) ── 미리보기만, 코드는 위 예시 카드에
const wide = (h) => '<div style="flex:1;min-width:0">' + h + '</div>';
const keyHead = '<div style="display:flex;justify-content:flex-end;font-size:var(--body-sm);color:var(--color-text-muted);margin-bottom:6px"><span><span class="progress-plan-key" aria-hidden="true"></span>계획</span></div>';
const PLAN = [['설계', 'done', 100, 100], ['시제품 제작', 'progress', 64, 70], ['시험 · 검증', 'delay', 32, 50]];
const planRows = (keyEach = false) => '<div style="display:grid;gap:10px">' + PLAN.map(([n, k, p, pl]) =>
  '<div style="display:grid;grid-template-columns:72px 1fr' + (keyEach ? ' auto' : '') + ';align-items:center;gap:12px;font-size:var(--body-sm);color:var(--color-text-base)"><span>' + n + '</span>' + bar(k, p, n, true, pl) +
  (keyEach ? '<span style="color:var(--color-text-muted)"><span class="progress-plan-key" aria-hidden="true"></span>계획</span>' : '') + '</div>').join('') + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: Progress 구성 「계획 표식」 — 실적은 채움, 계획은 표식이라 늦음이 막대에서 바로 보임(이전 버전은 「진행/적정(%)」 숫자만)
    { title: '계획 대비는 막대 위 표식으로',
      do: [wide(bar('delay', 58, '전체', true, 64)),
        '실적은 채움, 계획은 막대 위 표식으로 그려 늦음이 바로 보입니다.'],
      dont: [wide('<div style="font-size:var(--body-sm);color:var(--color-text-base)">진행/적정(%) 58 / 64</div>'),
        '숫자만 두면 계획보다 늦었는지 따져 봐야 압니다.'] },
    // 근거: Progress 구성 「계획 표식」 — 범례는 영역마다 한 번, 막대마다 붙이지 않음
    { title: '계획 범례는 영역에 한 번',
      do: [wide(keyHead + planRows()),
        '영역 머리 오른쪽에 범례를 한 번 두고, 줄마다 같은 표식으로 읽습니다.'],
      dont: [wide(planRows(true)),
        '막대마다 범례를 붙이면 같은 글이 줄마다 반복됩니다.'] },
  ]),
};

// ── 전체 상태 — 상태 5가지 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 상태 = .progress-bar--{done|progress|delay|plan|hold} · .status-block--{같은 이름} -->' } } },
  render: () => matrix(['상태 표시 (.status-block)', '진행률 막대 (.progress-bar)', '범례 점'],
    KEYS.map((k, i) => [ST[k][0] + ' <code>' + k + '</code>', [
      status(k),
      '<div style="width:240px">' + bar(k, [100, 64, 32, 8, 45][i], ST[k][0]) + '</div>',
      '<div class="left-legend" style="padding:0"><span class="legend-item"><span class="legend-dot" style="background:var(--color-progress-' + k + '-end)">' + svg(ST[k][1], 12) + '</span>' + ST[k][0] + '</span></div>',
    ]])),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    state: { control: 'inline-radio', options: KEYS, description: '상태 — `.progress-bar--{상태}` · `.status-block--{상태}`' },
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, description: '진행률 — `.pbar-fill` 너비 · `aria-valuenow`' },
    name: { control: 'text', description: '무엇의 진행률인지 — `aria-label="{이름} 진행률"`' },
    label: { control: 'boolean', description: '가운데 % 글자 — `.progress-bar__label`' },
    withStatus: { control: 'boolean', description: '왼쪽 상태 표시 — `.status-block` (`.progress-row`로 묶음)' },
  },
  args: { state: 'progress', value: 58, name: '전체', label: true, withStatus: true },
  parameters: { docs: { source: { transform: (_, { args: a }) => (a.withStatus ? row(a.state, a.value, a.name, a.label) : bar(a.state, a.value, a.name, a.label)) } } },
  render: (a) => box(a.withStatus ? row(a.state, a.value, a.name, a.label) : bar(a.state, a.value, a.name, a.label)),
};
