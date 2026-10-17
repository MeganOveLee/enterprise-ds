// Data Display/Status Chip — 문서 화면은 StatusChip.mdx. 이전 버전 .status-chip 값 그대로, 색만 DS 상태 토큰
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
export const 진행_상태 = { render: () => row([chip('success', '완료'), chip('info', '진행'), chip('danger', '지연'), chip('neutral', '예정'), chip('warning', '보류')]) };

// ── 전체 상태 ──
const TONES = [['중립', 'neutral', '폐기'], ['정보', 'info', '작업 중'], ['성공', 'success', '승인'], ['경고', 'warning', '검토 중'], ['위험', 'danger', '반려']];
export const 전체_상태 = {
  render: () => matrix(['칩', '클래스'], TONES.map(([n, t, l]) => [n, [chip(t, l), '<code>.status-chip--' + t + '</code>']])),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'info', 'success', 'warning', 'danger'], description: '상태 — `.status-chip--{상태}` (이전 버전 --error 도 받음)' },
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
