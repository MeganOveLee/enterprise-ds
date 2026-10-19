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
export const 진행_상태 = { render: () => row([chip('success', '완료'), chip('info', '진행 중'), chip('danger', '지연'), chip('neutral', '예정'), chip('warning', '보류')]) };

// ── 상태 색 — 상태마다 정의 · 클래스 · 토큰 ──
const TONES = [
  ['중립', 'neutral', '폐기', '진행하지 않는 상태 — 폐기 · 예정', 'bg-muted', 'text-muted'],
  ['정보', 'info', '작업 중', '진행 중인 상태 — 작업 중 · 진행 중', 'bg-info-subtle', 'text-info-bold'],
  ['성공', 'success', '승인', '끝난 상태 — 승인 · 완료', 'bg-success-subtle', 'text-success-bold'],
  ['경고', 'warning', '검토 중', '확인을 기다리는 상태 — 검토 중 · 보류', 'bg-warning-subtle', 'text-warning-bold'],
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

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) — 미리보기만, 코드는 위 예시 카드에 ──
const ddDot = (tone, label) => '<span class="status-chip status-chip--' + tone + '"><span class="sr-only">' + label + '</span></span>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: StatusChip.mdx 구성 「상태 — 색만으로 뜻을 전하지 않도록 글자를 늘 함께 씁니다」
    { title: '색과 글자를 함께',
      do: [row([chip('success', '승인'), chip('danger', '반려'), chip('warning', '검토 중')]), '상태 이름을 늘 함께 씁니다.'],
      dont: [row([ddDot('success', '승인'), ddDot('danger', '반려'), ddDot('warning', '검토 중')]), '색 점만으로 상태를 나타내지 않습니다.'] },
    // 근거: StatusChip.stories.js Playground 「글자 — 짧은 상태 이름」 · 구성 「모양 — 높이 20 · 알약」
    { title: '글자는 짧은 상태 이름',
      do: [row([chip('warning', '검토 중')]), '한두 단어의 상태 이름만 씁니다.'],
      dont: [row([chip('warning', '검토 의견 반영 후 재상신 대기')]), '설명은 칩에 넣지 않고 상세 화면에 둡니다.'] },
  ]),
};
