// Data Display/Status Chip: 문서 화면은 StatusChip.mdx. 색 = DS 상태 토큰(bg-*-subtle + text-*-bold), 종료는 테두리(DS-ADR-056)
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
export const 작업_현황 = { render: () => row([chip('info', '작업 중'), chip('warning', '검토 중'), chip('success', '승인'), chip('danger', '반려'), chip('closed', '폐기')]) };
export const 진행_상태 = { render: () => row([chip('success', '완료'), chip('info', '진행 중'), chip('danger', '지연'), chip('neutral', '예정'), chip('warning', '승인 대기')]) };

// ── 상태 여섯 단계: 단계마다 뜻 · Windchill 상태 · 클래스 · 토큰 (DS-ADR-056) ──
const TONES = [
  ['대기', 'neutral', '예정', '아직 시작하지 않았습니다', '잠재적 · Open', '<code>--color-bg-muted</code><br><code>--color-text-muted</code>'],
  ['진행', 'info', '작업 중', '정상으로 하고 있습니다', '작업 중(In Work) · Implementation', '<code>--color-bg-info-subtle</code><br><code>--color-text-info-bold</code>'],
  ['확인 필요', 'warning', '검토 중', '누군가 조치해야 넘어갑니다', '검토 중(Under Review) · Pending Approval · Rework', '<code>--color-bg-warning-subtle</code><br><code>--color-text-warning-bold</code>'],
  ['완료', 'success', '승인', '끝났고 쓸 수 있습니다', '완료됨 · Released · Approved · Resolved', '<code>--color-bg-success-subtle</code><br><code>--color-text-success-bold</code>'],
  ['문제', 'danger', '반려', '잘못돼 되돌아갔습니다', 'Rejected', '<code>--color-bg-danger-subtle</code><br><code>--color-text-danger-bold</code>'],
  ['종료', 'closed', '폐기', '더 쓰지 않습니다', '취소됨(Canceled) · Obsolete', '바탕 없음<br><code>--color-border-base</code> 테두리<br><code>--color-text-muted</code>'],
];
const note = (t) => '<span class="sb-note">' + t + '</span>';
export const 전체_상태 = {
  render: () => matrix(['칩', '뜻', 'Windchill 상태', '클래스', '토큰'], TONES.map(([n, t, l, mean, wc, tok]) => [n, [chip(t, l), note(mean), note(wc), '<code>.status-chip--' + t + '</code>', tok]]), { full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'info', 'warning', 'success', 'danger', 'closed'], description: '상태: `.status-chip--{상태}`' },
    label: { control: 'text', description: '글자: 짧은 상태 이름' },
  },
  args: { tone: 'info', label: '작업 중' },
  render: (a) => chip(a.tone, a.label),
};

// ── Do · Don't (① ②): 미리보기만, 코드는 위 예시 카드에 ──
// ① 두 화면(검색 결과 · 홈 카드)에 같은 상태를 놓고 색만 비교
const place = (name, chips) => '<div style="display:flex;align-items:center;gap:8px"><span class="sb-note" style="width:64px">' + name + '</span>' + chips.join('') + '</div>';
const twoPlaces = (home) => '<div style="display:grid;gap:8px">' + place('검색 결과', [chip('success', '승인'), chip('danger', '반려'), chip('warning', '검토 중')]) + place('홈 카드', home) + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거:  ① · StatusChip.mdx 「상태 색」 (Carbon Tag · Atlassian Lozenge)
    { title: '같은 상태는 모든 화면에서 같은 색으로 표시합니다',
      do: [twoPlaces([chip('success', '승인'), chip('danger', '반려'), chip('warning', '검토 중')]), '같은 상태 이름은 어느 화면에서나 같은 상태 색(승인 = success)을 씁니다.'],
      dont: [twoPlaces([chip('info', '승인'), chip('warning', '반려'), chip('neutral', '검토 중')]), '화면마다 같은 상태를 다른 색으로 표시하지 않습니다.'] },
    // 근거:  ② · Playground 「글자: 짧은 상태 이름」
    { title: '상태 이름은 2~4자로 짧게 짓습니다',
      do: [row([chip('warning', '검토 중'), chip('success', '승인')]), '상태 이름은 2~4자로 짓습니다(예: 「검토 중」 「승인」).'],
      dont: [row([chip('warning', '검토 의견 반영 후 재상신 대기'), chip('success', '승인')]), '「검토 의견 반영 후 재상신 대기」처럼 문장형 글자를 칩에 넣지 않습니다.'] },
  ]),
};
const optSrc = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

// ── 시안: A 옅은 바탕(추천, 위 「작업 현황」) · B 점 + 글자 · C 진한 채움 ──
const OPT_TONES = [['success', '승인'], ['warning', '결재 대기'], ['danger', '반려'], ['info', '작업 중'], ['closed', '폐기']];
const optChips = (cls) => '<div class="sb-row">' + OPT_TONES.map(([t, l]) => '<span class="status-chip status-chip--' + t + ' ' + cls + '">' + l + '</span>').join('') + '</div>';
export const 시안_점_글자 = { parameters: optSrc(optChips('status-chip--dot')), render: () => optChips('status-chip--dot') };
export const 시안_진한_채움 = { parameters: optSrc(optChips('status-chip--bold')), render: () => optChips('status-chip--bold') };
