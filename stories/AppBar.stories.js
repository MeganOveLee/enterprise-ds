// Navigation/App Bar — 문서 화면은 AppBar.mdx. 모바일 앱 화면 맨 위 막대 (DS-ADR-049)
// 시안 A 왼쪽 제목(추천) · B 가운데 제목 · C 큰 제목. 제목은 짧은 고정 문구, 경로 같은 긴 내용은 본문(Blocks/Route Summary)
import { svg, I, phone, body, iconBtn } from './_mobile.js';
import { route } from './_route.js';

const bar = ({ title, back = true, end = '', center = false, large = false, scroll = '' }) =>
  '<header class="app-bar' + (center ? ' app-bar--center' : '') + (large ? ' app-bar--large' : '') + '"' + (scroll ? ' data-app-bar-scroll="#' + scroll + '"' : '') + '>' +
  '<div class="app-bar__start">' + (back ? iconBtn('back', '뒤로') : '') + '</div>' +
  '<h1 class="app-bar__title">' + title + '</h1>' +
  '<div class="app-bar__end">' + end + '</div></header>';
const history = () => '<ul class="list-items" aria-label="이용 내역">' + [
  ['이천종합터미널 → 이천시청', '2026-11-05 오전 9:12 · 1명'], ['설봉공원 → 이천의료원', '2026-11-03 오후 2:40 · 2명'], ['관고전통시장 → 집', '2026-10-30 오전 11:05 · 1명'],
  ['집 → 창전동 경로당', '2026-10-28 오전 10:20 · 1명'], ['이천시청 → 관고전통시장', '2026-10-24 오후 1:15 · 1명'], ['이천의료원 → 집', '2026-10-21 오후 4:02 · 2명'],
  ['집 → 서울약국', '2026-10-17 오전 9:48 · 1명'], ['이천종합터미널 → 설봉공원', '2026-10-12 오전 8:30 · 3명'],
].map(([t, d]) => '<li><a class="list-item" href="#"><span class="list-item__text"><span class="list-item__title">' + t + '</span><span class="list-item__desc">' + d + '</span></span><span class="list-item__end">' + svg(I.next) + '</span></a></li>').join('') + '</ul>';

export default {
  title: 'Navigation/App Bar',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 왼쪽_제목 = { render: () => phone(bar({ title: '이용 내역 상세', end: iconBtn('more', '더 보기') }) + body(route(['관고전통시장', '설봉공원']))) };
export const 가운데_제목 = { render: () => phone(bar({ title: '이용 내역', back: false, center: true, end: iconBtn('close', '닫기') }) + body('')) };
export const 큰_제목 = { render: () => phone(bar({ title: '이용 내역', back: false, large: true, end: iconBtn('more', '더 보기'), scroll: 'history-large' }) + '<div class="sb-phone__body sb-phone__body--flush" id="history-large">' + history() + '</div>', 'sb-phone--tall') };
export const 뒤로와_제목 = { render: () => phone(bar({ title: '버스 부르기' }) + body('')) };
