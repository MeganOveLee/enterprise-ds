// Feedback/Tooltip — 문서 화면은 Tooltip.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
// 문서에서는 마우스 없이도 보이게 .is-open 으로 열어 둔 예시가 있음 — 제품에서는 마우스 · 키보드 포커스가 오면 열림
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

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
// 툴팁이 들어갈 자리 — 위(또는 아래)에 툴팁 높이만큼 비워 둠. center = 표 셀 가운데(긴 툴팁 240이 셀 안에 들어가게 셀 폭 300)
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
  // 셀 가운데에 둠 — 왼쪽 끝에 두면 폭 240 툴팁이 셀 밖으로 나가 왼쪽이 잘렸음
  render: () => stage(tip({ icon: 'help', label: '행 높이 도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 셀이 있는 그리드만 40입니다.', open: true }), 120, 'end', true),
};
// 셀 왼쪽 · 오른쪽 끝 — 가운데 맞춤이면 폭 240 툴팁이 셀 밖으로 잘림 → .tooltip--start · --end (TD-93, 10/17)
const edge = (inner, justify) => '<div style="display:flex;align-items:end;justify-content:' + justify + ';min-height:120px;padding:8px 0;border-inline:1px dashed var(--color-border-strong);width:300px">' + inner + '</div>';
export const 끝_맞춤 = {
  render: () => '<div class="sb-row" style="gap:24px;padding:8px 24px">' +
    edge(tip({ icon: 'help', label: '행 높이 도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 셀이 있는 그리드만 40입니다.', open: true, side: 'start' }), 'flex-start') +
    edge(tip({ icon: 'help', label: '행 높이 도움말', text: '관련 객체 그리드는 행 높이 30을 씁니다. 편집 셀이 있는 그리드만 40입니다.', open: true, side: 'end' }), 'flex-end') + '</div>',
};
export const 아래쪽 = {
  render: () => stage(tip({ icon: 'down', label: '첨부 받기', text: '첨부 받기', bottom: true, open: true }), 80, 'start'),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 18번 ① ②) ── 미리보기만, 코드는 위 예시 카드에
const ddStage = (inner) => '<div style="flex:1;display:flex;align-items:end;justify-content:center;gap:8px;min-height:104px">' + inner + '</div>';   // 가운데 — 긴 툴팁도 판 안에
const textTip = (t) => { const id = 'tt' + (++uid); return '<span class="has-tooltip"><button type="button" class="btn btn--secondary btn--outlined" aria-describedby="' + id + '">' + svg(I.print) + t + '</button><span class="tooltip is-open" role="tooltip" id="' + id + '">' + t + '</span></span>'; };
// 툴팁 안 링크 — Don't 그림용. 어두운 바탕 위라 글자색은 툴팁 글자색 그대로, 밑줄로 링크임을 표시
const linkTip = () => { const id = 'tt' + (++uid); return '<span class="has-tooltip"><button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="행 높이 도움말" aria-describedby="' + id + '">' + svg(I.help) + '</button>' +
  '<span class="tooltip is-open" role="tooltip" id="' + id + '">편집 그리드의 행 높이는 40입니다. <a href="#" style="color:inherit;text-decoration:underline;white-space:nowrap">기준 보기</a></span></span>'; };
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // ① 라벨 없는 아이콘 버튼 ↔ 글자가 있는 버튼에 같은 글자
    { title: '라벨 없는 아이콘 버튼에',
      do: [ddStage(tip({ icon: 'print', label: '인쇄', text: '인쇄', open: true })),
        '글자가 없는 아이콘 버튼에 이름을 툴팁으로 보여 줍니다.'],
      dont: [ddStage(textTip('인쇄')),
        '보이는 글자를 툴팁으로 되풀이하면 읽을 것만 늘어납니다.'] },
    // ② 짧은 한 줄 ↔ 링크 · 버튼이 든 툴팁
    { title: '짧은 한 줄로',
      do: [ddStage(tip({ icon: 'help', label: '행 높이 도움말', text: '편집 그리드의 행 높이는 40입니다.', open: true })),
        '툴팁에는 짧은 설명 한 줄만 둡니다.'],
      dont: [ddStage(linkTip()),
        '툴팁 안 링크 · 버튼은 스크린 리더가 설명 글로만 읽어 누를 수 없습니다.'] },
  ]),
};

// ── 전체 상태 — 행 = 가로 맞춤, 열 = 위치. 점선 = 셀 경계(시작 · 끝 맞춤은 컨트롤을 셀 끝에) ──
const LONG = '관련 객체 그리드는 행 높이 30을 씁니다. 편집 셀이 있는 그리드만 40입니다.';
const cell = (inner, justify, bottom) => '<div style="display:flex;align-items:' + (bottom ? 'start' : 'end') + ';justify-content:' + justify + ';min-height:110px;width:300px;padding:8px 0;border-inline:1px dashed var(--color-border-strong)">' + inner + '</div>';
const SIDES = [['가운데 (기본)', '', 'center'], ['시작 (.tooltip--start)', 'start', 'flex-start'], ['끝 (.tooltip--end)', 'end', 'flex-end']];
export const 전체_상태 = {
  render: () => matrix(['위 (기본)', '아래 (.tooltip--bottom)'],
    SIDES.map(([name, side, justify]) => [name, [false, true].map((bottom) =>
      cell(tip({ icon: 'help', label: '도움말', text: LONG, bottom, side, open: true }), justify, bottom))]),
  { wide: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    text: { control: 'text', description: '설명 — `.tooltip` (role="tooltip", 폭 240까지)' },
    bottom: { control: 'boolean', description: '아래쪽 — `.tooltip--bottom` (위가 좁을 때)' },
    side: { control: 'inline-radio', options: ['center', 'start', 'end'], description: '가로 맞춤 — center = 클래스 없음(기본) · `.tooltip--start` · `.tooltip--end` (셀 끝 컨트롤)' },
    open: { control: 'boolean', description: '열어 두기 — `.is-open` (문서용. 제품은 마우스 · 포커스로 열림)' },
  },
  args: { text: '첨부 받기', bottom: false, side: 'center', open: true },
  render: (a) => cell(tip({ icon: 'down', label: '첨부 받기', text: a.text, bottom: a.bottom, side: a.side === 'center' ? '' : a.side, open: a.open }), a.side === 'start' ? 'flex-start' : a.side === 'end' ? 'flex-end' : 'center', a.bottom),
};
