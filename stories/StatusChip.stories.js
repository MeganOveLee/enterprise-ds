// Data Display/Status Chip — 문서 화면은 StatusChip.mdx. 색 = DS 상태 토큰(bg-*-subtle + text-*-bold)
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

const chip = (tone, label) => '<span class="status-chip' + (tone ? ' status-chip--' + tone : '') + '">' + label + '</span>';
const row = (items) => '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + items.join('') + '</div>';

export default {
  title: 'Data Display/Status Chip',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 StatusChip.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 작업_현황 = { render: () => row([chip('info', '작업 중'), chip('warning', '검토 중'), chip('success', '승인'), chip('danger', '반려'), chip('neutral', '폐기')]) };
export const 진행_상태 = { render: () => row([chip('success', '완료'), chip('info', '진행 중'), chip('danger', '지연'), chip('neutral', '예정'), chip('warning', '승인 대기')]) };

// ── 상태 색 — 상태마다 정의 · 클래스 · 토큰 ──
const TONES = [
  ['중립', 'neutral', '폐기', '진행하지 않는 상태 — 폐기 · 예정', 'bg-muted', 'text-muted'],
  ['정보', 'info', '작업 중', '진행 중인 상태 — 작업 중 · 진행 중', 'bg-info-subtle', 'text-info-bold'],
  ['성공', 'success', '승인', '끝난 상태 — 승인 · 완료', 'bg-success-subtle', 'text-success-bold'],
  ['경고', 'warning', '검토 중', '확인을 기다리는 상태 — 검토 중 · 승인 대기', 'bg-warning-subtle', 'text-warning-bold'],
  ['위험', 'danger', '반려', '문제가 생긴 상태 — 반려 · 지연', 'bg-danger-subtle', 'text-danger-bold'],
];
const note = (t) => '<span class="sb-note">' + t + '</span>';
export const 전체_상태 = {
  render: () => matrix(['칩', '뜻', '클래스', '토큰'], TONES.map(([n, t, l, mean, bg, fg]) => [n, [chip(t, l), note(mean), '<code>.status-chip--' + t + '</code>', '<code>--color-' + bg + '</code><br><code>--color-' + fg + '</code>']]), { full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'info', 'success', 'warning', 'danger'], description: '상태 — `.status-chip--{상태}`' },
    label: { control: 'text', description: '글자 — 짧은 상태 이름' },
  },
  args: { tone: 'info', label: '작업 중' },
  render: (a) => chip(a.tone, a.label),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 10번 ① ②) — 미리보기만, 코드는 위 예시 카드에 ──
// ① 두 화면(검색 결과 · 홈 카드)에 같은 상태를 놓고 색만 비교
const place = (name, chips) => '<div style="display:flex;align-items:center;gap:8px"><span class="sb-note" style="width:64px">' + name + '</span>' + chips.join('') + '</div>';
const twoPlaces = (home) => '<div style="display:grid;gap:8px">' + place('검색 결과', [chip('success', '승인'), chip('danger', '반려'), chip('warning', '검토 중')]) + place('홈 카드', home) + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: TD-108 10번 ① · StatusChip.mdx 「상태 색」 (Carbon Tag · Atlassian Lozenge)
    { title: '같은 상태는 모든 화면에서 같은 색',
      do: [twoPlaces([chip('success', '승인'), chip('danger', '반려'), chip('warning', '검토 중')]), '같은 상태 이름은 어느 화면에서나 같은 상태 색(승인 = success)을 씁니다.'],
      dont: [twoPlaces([chip('info', '승인'), chip('warning', '반려'), chip('neutral', '검토 중')]), '화면마다 같은 상태를 다른 색으로 표시하지 않습니다.'] },
    // 근거: TD-108 10번 ② · Playground 「글자 — 짧은 상태 이름」
    { title: '상태 이름은 짧게(2~4자)',
      do: [row([chip('warning', '검토 중'), chip('success', '승인')]), '상태 이름은 「검토 중」 「승인」처럼 2~4자로 씁니다.'],
      dont: [row([chip('warning', '검토 의견 반영 후 재상신 대기'), chip('success', '승인')]), '「검토 의견 반영 후 재상신 대기」처럼 문장형 글자를 칩에 넣지 않습니다.'] },
  ]),
};
