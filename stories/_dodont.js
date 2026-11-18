// Do · Don't: 한 줄 = 상황 하나. 왼쪽 Do · 오른쪽 Don't
// 미리보기는 DS 클래스 그대로라 도구 막대의 브랜드 · 화면 모드를 따른다. 틀 모양은 .storybook/preview-head.html 의 .sb-dd
// 색만으로 구분하지 않도록 설명 칸 머리에 원형 아이콘(채운 원 + 체크 · 엑스)과 글자를 같이 둔다
const MARK = {
  do: '<path d="M7.5 12.5l3 3 6-6.5"/>',
  dont: '<path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/>',
};
const icon = (kind) =>
  '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/>' +
  '<g fill="none" stroke="var(--color-icon-inverse)" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">' + MARK[kind] + '</g></svg>';
const pane = (kind, [view, text]) =>
  '<div class="sb-dd__pane sb-dd__pane--' + kind + '"><div class="sb-dd__view">' + view + '</div>' +
  '<p class="sb-dd__text"><span class="sb-dd__verdict">' + icon(kind) + (kind === 'do' ? 'Do' : "Don't") + '</span>' + text + '</p></div>';

export const doDont = (rows) =>
  '<div class="sb-dd">' + rows.map((r) =>
    '<section class="sb-dd__row"><h3 class="sb-dd__title">' + r.title + '</h3>' + pane('do', r.do) + pane('dont', r.dont) + '</section>').join('') + '</div>';
