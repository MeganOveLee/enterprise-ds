// 빈 상태 일러스트 — 폴더 + 이유 배지. 색은 CSS 클래스(.empty-illo__*)가 토큰으로 칠한다 → 브랜드 · 다크 따라감.
// 경로는 새로 그림(10/8). 배지 글리프는 Feedback/Empty 픽토그램과 같은 모양을 작은 원에 맞게 줄인 것.
const FOLDER = 'M22 22H44.5C46 22 47.3 22.8 48 24.1L50.6 28.9C51.1 29.6 51.9 30 52.8 30H98C100.2 30 102 31.8 102 34V76C102 78.2 100.2 80 98 80H22C19.8 80 18 78.2 18 76V26C18 23.8 19.8 22 22 22Z';
const GLYPH = {
  search: '<circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/>',
  network: '<path d="M11 21a19 19 0 0 1 26 0M17 28a10 10 0 0 1 14 0"/><circle cx="24" cy="35" r="2" fill="currentColor" stroke="none"/><path d="m10 10 28 28"/>',
  error: '<path d="M24 6 44 40H4z"/><path d="M24 19v10"/><circle cx="24" cy="34" r="2" fill="currentColor" stroke="none"/>',
};
/** @param {'empty'|'search'|'network'|'error'} type */
export const emptyIllo = (type = 'empty') => {
  const badge = GLYPH[type]
    ? `<circle class="empty-illo__badge" cx="98" cy="77" r="16"/>` +
      `<g class="empty-illo__glyph" transform="translate(88 67) scale(.4167)">${GLYPH[type]}</g>`
    : '';
  return `<svg class="empty-illo" viewBox="0 0 120 104" aria-hidden="true" focusable="false">` +
    `<ellipse class="empty-illo__shadow" cx="60" cy="97" rx="44" ry="5"/>` +
    `<rect class="empty-illo__paper" x="28" y="5" width="64" height="44" rx="3"/>` +
    `<path class="empty-illo__line" d="M38 14H82M38 23H82"/>` +
    `<path class="empty-illo__folder" d="${FOLDER}"/>` +
    `<path class="empty-illo__tint" d="${FOLDER}"/>` +
    badge + `</svg>`;
};
