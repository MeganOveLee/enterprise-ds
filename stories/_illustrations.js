// 빈 상태 일러스트 — 그림 자산(DS-ADR-037). 두 모양을 함께 내고, 어느 쪽이 보일지는 브랜드 파일 토큰(--art-solid · --art-line)이 정한다
//   솔리드 = 폴더 + 유형 배지(.empty-illo, 색은 .empty-illo__* 가 토큰으로 칠함)
//   라인   = 선 픽토그램(48 격자 · 선 2, currentColor = .empty__icon 색)
// 크기는 배치가 정한다(components.css .empty · 표 아래 · .empty--card · .empty--page). 두 svg 모두 aria-hidden — 뜻은 제목 글자가 맡음
// 유형: 'empty'(데이터 없음) · 'search'(검색 결과 없음) · 'network'(네트워크 오류) · 'error'(서버 오류)
const FOLDER = 'M22 22H44.5C46 22 47.3 22.8 48 24.1L50.6 28.9C51.1 29.6 51.9 30 52.8 30H98C100.2 30 102 31.8 102 34V76C102 78.2 100.2 80 98 80H22C19.8 80 18 78.2 18 76V26C18 23.8 19.8 22 22 22Z';
// 배지 글리프 = 라인 픽토그램과 같은 모양을 작은 원에 맞게 줄인 것
const GLYPH = {
  search: '<circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/>',
  network: '<path d="M11 21a19 19 0 0 1 26 0M17 28a10 10 0 0 1 14 0"/><circle cx="24" cy="35" r="2" fill="currentColor" stroke="none"/><path d="m10 10 28 28"/>',
  error: '<path d="M24 6 44 40H4z"/><path d="M24 19v10"/><circle cx="24" cy="34" r="2" fill="currentColor" stroke="none"/>',
};
// 라인 픽토그램 — inbox · search · wifi-off · alert
const LINE = {
  empty: '<path d="M6 28 12 10h24l6 18v10H6z"/><path d="M6 28h11l3 5h8l3-5h11"/>',
  search: '<circle cx="21" cy="21" r="12"/><path d="m30 30 10 10"/>',
  network: '<path d="M6 18a26 26 0 0 1 36 0M12 25a17 17 0 0 1 24 0M18 32a8 8 0 0 1 12 0"/><circle cx="24" cy="38" r="1.5" fill="currentColor"/><path d="m8 8 32 32"/>',
  error: '<path d="M24 6 44 40H4z"/><path d="M24 19v10"/><circle cx="24" cy="34" r="1.5" fill="currentColor"/>',
};

/** 솔리드 일러스트 svg 하나. 감싸는 .ds-art 가 없으면 브랜드와 상관없이 늘 보임(문서의 두 모양 비교용) */
export const emptyIllo = (type = 'empty') => {
  const badge = GLYPH[type]
    ? `<g class="empty-illo__mark"><circle class="empty-illo__badge" cx="98" cy="77" r="16"/>` +
      `<g class="empty-illo__glyph" transform="translate(88 67) scale(.4167)">${GLYPH[type]}</g></g>`
    : '';
  return `<svg class="ds-art__solid empty-illo" viewBox="0 0 120 104" aria-hidden="true" focusable="false">` +
    `<ellipse class="empty-illo__shadow" cx="60" cy="97" rx="44" ry="5"/>` +
    `<rect class="empty-illo__paper" x="28" y="5" width="64" height="44" rx="3"/>` +
    `<path class="empty-illo__line" d="M38 14H82M38 23H82"/>` +
    `<path class="empty-illo__folder" d="${FOLDER}"/>` +
    `<path class="empty-illo__tint" d="${FOLDER}"/>` +
    badge + `</svg>`;
};

/** 라인 픽토그램 svg 하나 */
export const emptyLine = (type = 'empty') =>
  `<svg class="ds-art__line" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${LINE[type] || LINE.empty}</svg>`;

/** 빈 상태 그림 자리 — .empty 안 맨 앞에 둠. 솔리드 · 라인을 함께 넣고 브랜드 파일이 하나만 보이게 함 */
export const emptyArt = (type = 'empty') => `<span class="empty__icon ds-art">${emptyIllo(type)}${emptyLine(type)}</span>`;
