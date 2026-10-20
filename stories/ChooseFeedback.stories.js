// Feedback/고르는 법 — 문서 화면은 ChooseFeedback.mdx. 피드백 컴포넌트의 표준 이름 · 정의 · 고르는 기준을 한 표로
// 이름 · 정의 = 공개 DS 문서(KRDS · Carbon · Polaris · Atlassian)의 표준 용어. 고르는 기준 = 언제 고르는지 + 대신 쓸 컴포넌트(쓰는 법은 각 문서의 Do · Don't)
import { matrix } from './_matrix.js';

// Alert · Toast 상태 아이콘(Figma Icons 모양, 16 격자) · 툴팁 받기 아이콘(24 격자)
const svg16 = (d) => '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  warning: '<path d="M7.05 3.48 2.35 11.33a1.11 1.11 0 0 0 .95 1.67h9.4a1.11 1.11 0 0 0 .95-1.67L8.95 3.48a1.11 1.11 0 0 0-1.9 0z"/><path d="M8 6.33v2.23M8 10.78h.01"/>',
  success: '<path d="m3.56 8 2.77 2.78 6.11-6.11"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
const INBOX = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/></svg>';
const link = (name, path) => '<a class="text-link no-arrow" href="./?path=/docs/' + path + '--docs" target="_top">' + name + '</a>';
const code = (t) => '<code>' + t + '</code>';
const note = (t) => '<span class="sb-note" style="display:block;text-align:left">' + t + '</span>';
const left = (h) => '<div style="text-align:left;min-width:0">' + h + '</div>';
const block = (w, h) => '<span class="skeleton-block" style="width:' + w + ';height:' + h + '"></span>';

// [표준 이름, 미리보기, 컴포넌트 링크 · 클래스, 정의, 고르는 기준]
const ROWS = [
  ['인라인 알림',
    '<div class="alert alert--warning" role="status"><span class="alert__icon">' + svg16(I.warning) + '</span><div class="alert__body"><strong class="alert__title">결재 중에는 수정할 수 없습니다</strong></div></div>',
    link('Alert', 'feedback-alert') + ' ' + code('.alert'), '화면 안에 배치되어, 해결하거나 닫을 때까지 남는 상태 메시지입니다.', '현재 화면의 안내 · 경고 · 오류를 해결하거나 닫을 때까지 보여 줄 때. 잠깐 알리고 끝나는 결과는 토스트입니다.'],
  ['토스트',
    '<div class="toast toast--success" style="width:auto"><span class="toast__icon">' + svg16(I.success) + '</span><span class="toast__msg">저장되었습니다.</span></div>',
    link('Toast', 'feedback-toast') + ' ' + code('.toast'), '사용자 동작의 결과를 잠시 표시하고 사라지는 알림입니다.', '저장 · 삭제처럼 방금 한 동작의 결과. 입력 오류는 필드 오류, 화면에 남길 내용은 인라인 알림입니다.'],
  ['툴팁',
    '<div style="padding-top:36px"><span class="has-tooltip"><button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="첨부 받기" aria-describedby="cfb-tt">' + svg(I.down) + '</button><span class="tooltip tooltip--start is-open" role="tooltip" id="cfb-tt">첨부 받기</span></span></div>',
    link('Tooltip', 'feedback-tooltip') + ' ' + code('.tooltip'), '포인터를 올리거나 포커스가 갔을 때 나타나는 짧은 보조 설명입니다.', '라벨 없는 아이콘 버튼의 이름 · 짧은 설명. 꼭 알아야 할 정보 · 오류는 화면 안 글이나 인라인 알림입니다.'],
  ['빈 상태',
    '<div class="empty empty--card" role="status" style="border:1px solid var(--color-border-base);border-radius:var(--radius-card)"><span class="empty__icon">' + INBOX + '</span><p class="empty__title">결재할 문서가 없습니다</p><p class="empty__desc">결재 요청이 오면 이 목록에 표시됩니다.</p></div>',
    link('Empty', 'feedback-empty') + ' ' + code('.empty'), '표시할 데이터가 없을 때 이유와 다음 동작을 안내하는 영역입니다.', '데이터 없음 · 검색 결과 없음 · 불러오기 오류로 표 · 카드 · 페이지에 보여 줄 내용이 없을 때.'],
  ['스피너',
    '<div class="loading" role="status" aria-live="polite"><span class="spinner" aria-hidden="true"></span><p class="loading__text">문서 목록을 불러오는 중입니다</p></div>',
    link('Loading', 'feedback-loading') + ' ' + code('.loading'), '처리 중임을 알리는 회전 표시입니다.', '1초 이상 걸리고 진행률을 모를 때. 진행률을 셀 수 있으면 진행 바, 첫 로드의 표 · 카드는 스켈레톤입니다.'],
  ['스켈레톤',
    '<div aria-hidden="true" style="border:1px solid var(--color-border-subtle);border-radius:var(--radius-card)">' +
      [1, 2].map(() => '<div class="skeleton-grid-row" style="grid-template-columns:16px 2fr 1fr;gap:12px">' + block('16px', '16px') + block('100%', '16px') + block('100%', '16px') + '</div>').join('') + '</div>',
    link('Skeleton', 'feedback-skeleton') + ' ' + code('.skeleton-*'), '콘텐츠가 들어올 자리를 실제 크기 · 모양으로 미리 표시하는 자리 표시자입니다.', '첫 로드에서 표 · 카드의 배치를 미리 보여 줄 때. 버튼 · 입력 필드 · 토스트 안 대기는 스피너입니다.'],
  ['진행 바',
    '<div class="progress-bar progress-bar--progress" role="progressbar" aria-label="전체 진행률" aria-valuenow="58" aria-valuemin="0" aria-valuemax="100"><div class="pbar-fill" style="width:58%"></div><span class="progress-bar__label">58%</span></div>',
    link('Progress', 'feedback-progress') + ' ' + code('.progress-bar'), '작업이 얼마나 진행됐는지 비율로 표시하는 막대입니다.', '진행률을 셀 수 있는 작업, 프로젝트 · 태스크의 진행률. 진행률을 모르면 스피너입니다.'],
];

export default {
  title: 'Feedback/고르는 법',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ChooseFeedback.mdx
  parameters: { controls: { disable: true } },
};

// 첫 열 = 표준 이름. 공용 표(matrix)의 첫 열 머리는 숨김 글자라 여기서 보이는 머리로 바꿈
export const 고르는_표 = {
  render: () => matrix(['미리보기', '컴포넌트', '정의', '고르는 기준'], ROWS.map(([name, view, comp, def, why]) => [name, [left(view), comp, note(def), note(why)]]), { full: true })
    .replace('<th><span class="sr-only">구분</span></th>', '<th>표준 이름</th>')
    .replace('<table class="sb-table sb-table--full">', '<table class="sb-table sb-table--full" style="table-layout:fixed"><colgroup><col style="width:96px"><col style="width:260px"><col style="width:150px"><col><col></colgroup>'),
};
