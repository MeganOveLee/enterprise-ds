// LNB 레일 메뉴 아이콘 · 레일 로고 마크 · 검색 조건 헤더 아이콘 — Figma 🧭 App Shell 「LNB/Rail」 · 🧱 Blocks 와 같은 모양 (TD-108). App Shell · Screens · Blocks 문서가 같이 씀
// 아이콘 = Figma Icons 라인 세트(lucide 모양, 24 칸 · 선 1.5). 세트 아이콘은 lucide 원본(24 칸 · 선 1.8)을 5/6로 줄인 모양이라
//   viewBox 를 -2.4 ~ 26.4 로 넓혀 같은 크기 · 같은 선 굵기로 그린다. 설계 변경(file-search)만 세트에서 24 칸 · 선 1.5 그대로
// 제품은 메뉴마다 그림 파일 경로를 --lnb-icon 에 넣는다(DS에는 그림 경로 없음) — 여기서는 같은 그림을 data URI 로
const WIDE = '-2.4 -2.4 28.8 28.8';
const ICONS = {
  work: [WIDE, 1.8, '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'],   // clipboard
  doc: [WIDE, 1.8, '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>'],   // file-text
  drawing: [WIDE, 1.8, '<path d="M12 2 2 7l10 5 10-5z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>'],   // layers
  part: [WIDE, 1.8, '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'],   // settings
  project: [WIDE, 1.8, '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'],   // briefcase
  change: ['0 0 24 24', 1.5, '<path d="M20 10.42V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h8M8.5 7v3M7 8.5h3M7 14h3M7 17h3M14 8.5h3"/><circle cx="16.75" cy="16.75" r="3"/><path d="m18.9 18.9 2.1 2.1"/>'],   // file-search
  user: [WIDE, 1.8, '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'],   // user — 레일 관리자 · GNB 사용자 메뉴 버튼
  bench: [WIDE, 1.8, '<path d="M18 20V10M12 20V4M6 20v-6"/>'],   // bar-chart — 긴 이름 예시(벤치마킹 관리)
  sliders: [WIDE, 1.8, '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'],   // sliders — 검색 조건 섹션 헤더
};
const body = (name, stroke) => {
  const [vb, w, d] = ICONS[name];
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" fill="none" stroke="' + stroke + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"';
};
// 레일 아이콘 = mask 그림(.menu_icon 의 --lnb-icon) — 글자색으로 칠해짐
export const lnbMask = (name) => "url('data:image/svg+xml," + encodeURIComponent(body(name, 'black') + '>' + ICONS[name][2] + '</svg>') + "')";
// 같은 그림을 인라인 svg 로(currentColor) — GNB 사용자 아이콘 · 바로가기 타일 · 검색 조건 헤더
export const lnbSvg = (name, s = 24) => body(name, 'currentColor').replace('<svg ', '<svg width="' + s + '" height="' + s + '" ') + ' aria-hidden="true">' + ICONS[name][2] + '</svg>';

// 레일 로고 마크 = 가상 제품 로고(모든 브랜드 레일 · 로그인 · 로고형 GNB, TD-101). Figma 「LNB/Mark」와 같은 그림. label 이 없으면 읽기에서 뺌(옆에 제품 이름 글자가 있을 때):
// 브랜드 타일 + 부품(육면체) + 둘레 궤도(0.55) + 궤도 끝 포인트색 점. 타일 · 점 색은 브랜드를 따름.
// 로고 = 브랜드 자산이라 모서리는 고정이고, 점은 브랜드 파일의 포인트색(--accent-500)을 그대로 씀 — 화면 코드에서 원색을 쓰는 유일한 곳
export const lnbLogo = (label = 'Enterprise PLM', cls = '') =>
  '<svg' + (cls ? ' class="' + cls + '"' : '') + ' width="34" height="34" viewBox="0 0 34 34"' + (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' +
  '<rect width="34" height="34" rx="8" style="fill:var(--color-bg-brand)"/>' +
  '<path d="M4.4 21.6A12.5 12.5 0 1 1 27.6 21.6" fill="none" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--color-icon-on-color);opacity:.55"/>' +
  '<g fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--color-icon-on-color)">' +
  '<path d="M16 10.2l6 3.45v6.9L16 24l-6-3.45v-6.9z"/><path d="M10 13.65l6 3.45 6-3.45M16 17.1V24"/></g>' +
  '<circle cx="27.6" cy="21.6" r="2.9" stroke-width="1.6" style="fill:var(--accent-500);stroke:var(--color-bg-brand)"/></svg>';
