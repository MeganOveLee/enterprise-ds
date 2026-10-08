// 「전체 상태 · 조합」 예시를 표로 그린다 — 행 = 상태(또는 조합), 열 = 변형.
// rows: [[행 이름, [칸 HTML, ...]], ...] · wide: 칸 폭을 고정할지(입력칸처럼 늘어나는 요소) · full: 표를 카드 너비에 맞춤
// 템플릿 문자열 대신 문자열 이어 붙이기 — 스토리북 색인기가 여러 줄 HTML을 MDX로 잘못 읽는 일을 피함
export const matrix = (cols, rows, { wide = false, full = false } = {}) =>
  '<table class="sb-table' + (full ? ' sb-table--full' : '') + '"><thead><tr><th></th>' +
  cols.map((c) => '<th>' + c + '</th>').join('') +
  '</tr></thead><tbody>' +
  rows.map(([name, cells]) =>
    '<tr><th scope="row">' + name + '</th>' +
    cells.map((c) => '<td' + (wide ? ' class="sb-wide"' : '') + '>' + c + '</td>').join('') + '</tr>').join('') +
  '</tbody></table>';
