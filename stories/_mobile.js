// 모바일 컴포넌트 견본 조각 (TD-172) — 아이콘 · 틀. 모양은 ./_mobile.css · css/components.css
import './_mobile.css';

export const svg = (d, s = 24) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
export const I = {
  back: '<path d="M15 5l-7 7 7 7"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  more: '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 18v3M16 18v3"/><circle cx="8" cy="14.5" r="1"/><circle cx="16" cy="14.5" r="1"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/>',
  hospital: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 8v8M15 8v8M9 12h6"/>',   // 병원 = H, 십자 모양 없음 (DS-ADR-050)
  cart: '<path d="M3 4h2l2.4 11h11L21 7H6.2"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
  next: '<path d="M9 6l6 6-6 6"/>',
  locate: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  check: '<path d="M5 12l4 4 10-10"/>',
  minus: '<path d="M5 12h14"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>',
  ticket: '<path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5z"/><path d="M14 5v14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  redo: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
};
// 장소 아이콘 = 컬러 솔리드. 색은 .place--{종류} 가 정함. 병원 · 약국은 H(십자 없음, DS-ADR-050)
export const solid = (d, s = 24, cls = '') => '<svg' + (cls ? ' class="' + cls + '"' : '') + ' width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="' + d + '"/></svg>';
export const P = {
  home: 'M12 3.2 2.6 11.4a1 1 0 0 0 .66 1.75H5V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-6.85h1.74a1 1 0 0 0 .66-1.75z',
  medical: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm3.5 4.5v9h2V13h3v3.5h2v-9h-2V11h-3V7.5z',
  market: 'M4 4h16l1.5 5a3 3 0 0 1-5 2.2 3 3 0 0 1-4.5 0 3 3 0 0 1-4.5 0A3 3 0 0 1 2.5 9zM5 13.3a4.6 4.6 0 0 0 2.5-.3 4.7 4.7 0 0 0 4.5.6 4.7 4.7 0 0 0 4.5-.6 4.6 4.6 0 0 0 2.5.3V20a1 1 0 0 1-1 1h-3.5v-4.5h-5V21H6a1 1 0 0 1-1-1z',
  welfare: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.5 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a7 7 0 0 1 14 0v.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5zm15.2 1h4.3a.5.5 0 0 0 .5-.5V20a5.5 5.5 0 0 0-7.4-5.2A8.4 8.4 0 0 1 17.2 21z',
  public: 'M12 2.5 2.5 7.5V9h19V7.5zM4 10.5h3v7H4zm6.5 0h3v7h-3zm6.5 0h3v7h-3zM2.5 19h19v2.5h-19z',
};
// 하단 탭 채운 아이콘 — 선 아이콘 I 와 같은 모양(지금 화면 표시)
export const F = {
  home: P.home,
  bus: 'M7 2h10a3 3 0 0 1 3 3v12a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-2 0v-2H8v2a1 1 0 0 1-2 0v-2H5a1 1 0 0 1-1-1V5a3 3 0 0 1 3-3zM6 6v4h12V6zm2 7.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  list: 'M3 5h3v2.5H3zm5 0h13v2.5H8zm-5 5.75h3v2.5H3zm5 0h13v2.5H8zM3 16.5h3V19H3zm5 0h13V19H8z',
  user: 'M12 3a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM3.5 21a8.5 8.5 0 0 1 17 0z',
  star: 'M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z',
  ticket: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5z',
};
export const PLACE = { home: '집', medical: '병원 · 약국', market: '시장 · 마트', welfare: '복지관 · 경로당', public: '관공서 · 은행' };
export const phone = (inner, cls = '') => '<div class="sb-phone' + (cls ? ' ' + cls : '') + '">' + inner + '</div>';
export const body = (inner, cls = '') => '<div class="sb-phone__body' + (cls ? ' ' + cls : '') + '">' + inner + '</div>';
export const iconBtn = (icon, label, attrs = '') => '<button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="' + label + '"' + attrs + '>' + svg(I[icon]) + '</button>';
export const html = (code) => ({ docs: { source: { code } } });
