// Feedback/Tooltip — 문서 화면은 Tooltip.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
// 문서에서는 마우스 없이도 보이게 .is-open 으로 열어 둔 예시가 있음 — 제품에서는 마우스 · 키보드 포커스가 오면 열림
import { matrix } from './_matrix.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  print: '<path d="M7 9V4h10v5M7 17H5v-6h14v6h-2M7 14h10v6H7z"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.6"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
};
let uid = 0;
// 툴팁 하나 — 컨트롤(아이콘 버튼) + 툴팁. open = 문서에서 열어 둔 모습, bottom = 아래쪽
const tip = ({ icon = 'down', label = '첨부 받기', text = '첨부 받기', bottom = false, open = false, side = '' } = {}) => {
  const id = 'tt' + (++uid);
  return '<span class="has-tooltip"><button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="' + label + '" aria-describedby="' + id + '">' + svg(I[icon]) + '</button>' +
    '<span class="tooltip' + (bottom ? ' tooltip--bottom' : '') + (side ? ' tooltip--' + side : '') + (open ? ' is-open' : '') + '" role="tooltip" id="' + id + '">' + text + '</span></span>';
};
// 툴팁이 들어갈 자리 — 위(또는 아래)에 툴팁 높이만큼 비워 둠. center = 표 칸 가운데(긴 툴팁 240이 칸 안에 들어가게 칸 폭 300)
const stage = (inner, h = 120, align = 'end', center = false) => '<div style="display:flex;align-items:' + align + ';gap:8px;min-height:' + h + 'px;padding:8px 24px' + (center ? ';justify-content:center;min-width:300px' : '') + '">' + inner + '</div>';

export default {
  title: 'Feedback/Tooltip',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Tooltip.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 아이콘_버튼_설명 = {
  render: () => stage(tip({ icon: 'down', label: '첨부 받기', text: '첨부 받기', open: true }) + tip({ icon: 'print', label: '인쇄', text: '인쇄' }) + tip({ icon: 'reset', label: '검색 조건 초기화', text: '검색 조건 초기화' }), 80),
};
export const 도움말 = {
  // 칸 가운데에 둠 — 왼쪽 끝에 두면 폭 240 툴팁이 칸 밖으로 나가 왼쪽이 잘렸음
  render: () => stage(tip({ icon: 'help', label: '행 높이 도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 칸이 있는 그리드만 40입니다.', open: true }), 120, 'end', true),
};
// 칸 왼쪽 · 오른쪽 끝 — 가운데 맞춤이면 폭 240 툴팁이 칸 밖으로 잘림 → .tooltip--start · --end (TD-93, 10/17)
const edge = (inner, justify) => '<div style="display:flex;align-items:end;justify-content:' + justify + ';min-height:120px;padding:8px 0;border-inline:1px dashed var(--color-border-strong);width:300px">' + inner + '</div>';
export const 끝_맞춤 = {
  render: () => '<div class="sb-row" style="gap:24px;padding:8px 24px">' +
    edge(tip({ icon: 'help', label: '행 높이 도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 칸이 있는 그리드만 40입니다.', open: true, side: 'start' }), 'flex-start') +
    edge(tip({ icon: 'help', label: '행 높이 도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 칸이 있는 그리드만 40입니다.', open: true, side: 'end' }), 'flex-end') + '</div>',
};
export const 아래쪽 = {
  render: () => stage(tip({ icon: 'down', label: '첨부 받기', text: '첨부 받기', bottom: true, open: true }), 80, 'start'),
};

// ── 전체 상태 — 행 = 글 길이, 열 = 위치 ──
export const 전체_상태 = {
  render: () => matrix(['위 (기본)', '아래 (.tooltip--bottom)'], [
    ['짧은 설명', [stage(tip({ text: '첨부 받기', open: true }), 70, 'end', true), stage(tip({ text: '첨부 받기', bottom: true, open: true }), 70, 'start', true)]],
    ['긴 설명', [stage(tip({ icon: 'help', label: '도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 칸이 있는 그리드만 40입니다.', open: true }), 110, 'end', true), stage(tip({ icon: 'help', label: '도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 칸이 있는 그리드만 40입니다.', bottom: true, open: true }), 110, 'start', true)]],
  ], { wide: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    text: { control: 'text', description: '설명 — `.tooltip` (role="tooltip", 폭 240까지)' },
    bottom: { control: 'boolean', description: '아래쪽 — `.tooltip--bottom` (위가 좁을 때)' },
    open: { control: 'boolean', description: '열어 두기 — `.is-open` (문서용. 제품은 마우스 · 포커스로 열림)' },
  },
  args: { text: '첨부 받기', bottom: false, open: true },
  render: (a) => stage(tip({ icon: 'down', label: '첨부 받기', text: a.text, bottom: a.bottom, open: a.open }), 110, a.bottom ? 'start' : 'end'),
};
