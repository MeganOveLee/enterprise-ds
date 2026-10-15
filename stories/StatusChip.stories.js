// Data Display/Status Chip — 문서 화면은 StatusChip.mdx. 이전 버전 .status-chip 값 그대로, 색만 DS 상태 토큰
import { matrix } from './_matrix.js';

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
