// Feedback/고르는 법 — 문서 화면은 ChooseFeedback.mdx. 피드백 컴포넌트의 표준 이름 · 정의 · 고르는 기준을 한 표로
// 이름 · 정의 = 공개 DS 문서(KRDS · Carbon · Polaris · Atlassian)의 표준 용어
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
const note = (t) => '<span class="sb-note" style="display:block;text-align:left">' + t + '</span>';
const left = (h) => '<div style="text-align:left">' + h + '</div>';

// [표준 이름, 미리보기, 컴포넌트 링크 · 클래스, 정의, 고르는 기준]
const ROWS = [
  ['인라인 알림',
    '<div class="alert alert--warning" role="status" style="max-width:280px"><span class="alert__icon">' + svg(I.warning) + '</span><div class="alert__body"><strong class="alert__title">결재 중에는 수정할 수 없어요</strong></div></div>',
    link('Alert', 'feedback-alert') + ' ' + code('.alert'), '화면 안에 배치되어, 해결하거나 닫을 때까지 남는 상태 메시지입니다.', '현재 화면의 안내 · 경고 · 오류. 서버 검증 오류는 필드 오류와 함께 표시합니다.'],
  ['토스트',
    '<div class="toast toast--success" style="max-width:260px"><span class="toast__icon">' + svg(I.success) + '</span><span class="toast__msg">저장했어요.</span></div>',
    link('Toast', 'feedback-toast') + ' ' + code('.toast'), '사용자 동작의 결과를 잠시 표시하고 사라지는 알림입니다.', '저장 · 삭제의 결과. 입력 오류 · 긴 설명 · 중요한 내용에는 쓰지 않습니다.'],
  ['툴팁',
    '<div style="padding-top:36px"><span class="has-tooltip"><button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="첨부 받기" aria-describedby="cfb-tt">' + svg(I.down) + '</button><span class="tooltip is-open" role="tooltip" id="cfb-tt">첨부 받기</span></span></div>',
    link('Tooltip', 'feedback-tooltip') + ' ' + code('.tooltip'), '포인터를 올리거나 포커스가 갔을 때 나타나는 짧은 보조 설명입니다.', '라벨 없는 아이콘 버튼. 필수 정보 · 오류 · 링크가 필요한 설명에는 쓰지 않습니다.'],
  ['빈 상태',
    '<div class="empty empty--card" role="status" style="max-width:240px;border:1px solid var(--color-border-base);border-radius:var(--radius-card)"><span class="empty__icon">' + INBOX + '</span><p class="empty__title">결재할 문서가 없어요</p><p class="empty__desc">결재 요청이 오면 이 목록에 표시돼요.</p></div>',
    link('Empty', 'feedback-empty') + ' ' + code('.empty'), '표시할 데이터가 없을 때 이유와 다음 동작을 안내하는 영역입니다.', '데이터 없음 · 검색 결과 없음. 표 · 카드 · 페이지 단위로 배치합니다.'],
  ['스피너',
    '<div class="loading" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span><p class="loading__text">문서 목록을 불러오는 중입니다</p></div>',
    link('Loading', 'feedback-loading') + ' ' + code('.loading'), '처리 중임을 알리는 회전 표시입니다.', '1초 이상 걸리고 진행률을 모를 때. 한 영역에 하나만 둡니다.'],
  ['스켈레톤',
    '<div style="display:grid;gap:8px;width:220px" aria-hidden="true"><span class="skeleton-title"></span><span class="skeleton-line"></span><span class="skeleton-line" style="width:70%"></span></div>',
    link('Skeleton', 'feedback-skeleton') + ' ' + code('.skeleton-line'), '콘텐츠가 들어올 자리를 실제 크기 · 모양으로 미리 표시하는 자리 표시자입니다.', '첫 로드의 표 · 카드. 버튼 · 입력 필드 · 토스트에는 쓰지 않습니다.'],
  ['진행 바',
    '<div class="progress-bar progress-bar--progress" role="progressbar" aria-label="전체 진행률" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100" style="width:180px"><div class="pbar-fill" style="width:58%"></div><span class="progress-bar__label">58%</span></div>',
    link('Progress', 'feedback-progress') + ' ' + code('.progress-bar'), '작업이 얼마나 진행됐는지 비율로 표시하는 막대입니다.', '진행률을 셀 수 있는 작업, 프로젝트 · 태스크의 진행률.'],
];

export default {
  title: 'Feedback/고르는 법',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ChooseFeedback.mdx
  parameters: { controls: { disable: true } },
};

export const 고르는_표 = {
  render: () => matrix(['미리보기', '컴포넌트', '정의', '고르는 기준'], ROWS.map(([name, view, comp, def, why]) => [name, [left(view), comp, note(def), note(why)]]), { full: true }),
};
