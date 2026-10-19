// Feedback/고르는 법 — 문서 화면은 ChooseFeedback.mdx. 상태를 알리는 컴포넌트 중 무엇을 쓰는지 한 표로 (TD-104 반영 3)
// 기준 문장은 새로 만들지 않고 각 컴포넌트 문서의 머리 문장 · 구성 · 「언제 쓰고 쓰지 말지」에서 가져온다
import { matrix } from './_matrix.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  warning: '<path d="M12 4 21 19.5H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16 10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
const INBOX = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>';
const link = (name, path) => '<a class="text-link no-arrow" href="./?path=/docs/' + path + '--docs" target="_top">' + name + '</a>';
const code = (t) => '<code>' + t + '</code>';
const note = (t) => '<span class="sb-note">' + t + '</span>';

const ROWS = [
  ['읽고 넘어갈 조건 · 오류',
    '<div class="alert alert--warning" role="status" style="max-width:300px"><span class="alert__icon">' + svg(I.warning) + '</span><div class="alert__body"><strong class="alert__title">결재 중에는 수정할 수 없어요</strong></div></div>',
    link('Alert', 'feedback-alert') + ' ' + code('.alert'), '읽고 넘어갈 때까지 화면에 남습니다.'],
  ['방금 한 일의 결과',
    '<div class="toast toast--success" style="max-width:280px"><span class="toast__icon">' + svg(I.success) + '</span><span class="toast__msg">저장했어요.</span></div>',
    link('Toast', 'feedback-toast') + ' ' + code('.toast'), '저장 · 복사의 결과. 잠깐 뜨고 사라집니다.'],
  ['글자 없는 버튼의 이름',
    '<div style="padding-top:36px"><span class="has-tooltip"><button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="첨부 받기" aria-describedby="cfb-tt">' + svg(I.down) + '</button><span class="tooltip is-open" role="tooltip" id="cfb-tt">첨부 받기</span></span></div>',
    link('Tooltip', 'feedback-tooltip') + ' ' + code('.tooltip'), '꼭 알아야 할 내용은 툴팁 밖에 둡니다.'],
  ['보여 줄 내용이 없음',
    '<div class="empty empty--card" role="status" style="max-width:260px;border:1px solid var(--color-border-base);border-radius:var(--radius-card)"><span class="empty__icon">' + INBOX + '</span><p class="empty__title">결재할 문서가 없어요</p></div>',
    link('Empty', 'feedback-empty') + ' ' + code('.empty'), '빈 이유와 다음 행동을 함께 알립니다.'],
  ['진행률을 모르는 기다림',
    '<div class="loading" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span><p class="loading__text">문서 목록을 불러오는 중입니다</p></div>',
    link('Loading', 'feedback-loading') + ' ' + code('.loading'), '3초 미만은 스피너만, 3~10초는 문구, 더 길면 진행 상황 + 취소.'],
  ['내용이 오기 전',
    '<div style="display:grid;gap:8px;width:240px" aria-hidden="true"><span class="skeleton-title"></span><span class="skeleton-line"></span><span class="skeleton-line" style="width:70%"></span></div>',
    link('Skeleton', 'feedback-skeleton') + ' ' + code('.skeleton-line'), '실제 내용과 같은 자리 모양을 먼저 보입니다.'],
  ['진행 정도',
    '<div class="progress-bar progress-bar--progress" role="progressbar" aria-label="전체 진행률" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100" style="width:200px"><div class="pbar-fill" style="width:58%"></div><span class="progress-bar__label">58%</span></div>',
    link('Progress', 'feedback-progress') + ' ' + code('.progress-bar'), '얼마나 진행됐는지 보여 주기만 합니다.'],
];

export default {
  title: 'Feedback/고르는 법',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ChooseFeedback.mdx
  parameters: { controls: { disable: true } },
};

export const 고르는_표 = {
  render: () => matrix(['미리보기', '컴포넌트', '기준'], ROWS.map(([when, view, comp, why]) => [when, [view, comp, note(why)]]), { full: true }),
};
