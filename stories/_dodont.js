// 「언제 쓰고 쓰지 말지」(Do · Don't) — 한 줄 = 상황 하나. 왼쪽 ✓ 이렇게 · 오른쪽 ✕ 이렇게 하지 않음 (TD-70, 10/17)
// 미리보기는 DS 클래스 그대로라 도구 막대의 브랜드 · 화면 모드를 따른다. 틀 모양은 .storybook/preview-head.html 의 .sb-dd
// 색만으로 구분하지 않도록 머리에 ✓ · ✕ 와 글자를 같이 둔다
const pane = (kind, [view, text]) =>
  '<div class="sb-dd__pane sb-dd__pane--' + kind + '"><div class="sb-dd__view">' + view + '</div>' +
  '<p class="sb-dd__text"><b>' + (kind === 'do' ? '✓ 이렇게' : '✕ 이렇게 하지 않음') + '</b>' + text + '</p></div>';

export const doDont = (rows) =>
  '<div class="sb-dd">' + rows.map((r) =>
    '<section class="sb-dd__row"><h4 class="sb-dd__title">' + r.title + '</h4>' + pane('do', r.do) + pane('dont', r.dont) + '</section>').join('') + '</div>';
