// Navigation/App Bar — 문서 화면은 AppBar.mdx. 모바일 앱 화면 맨 위 막대 (DS-ADR-049, TD-172)
import { svg, I, phone, body, iconBtn } from './_mobile.js';

const bar = ({ title, back = true, end = '', center = false }) =>
  '<header class="app-bar' + (center ? ' app-bar--center' : '') + '">' +
  '<div class="app-bar__start">' + (back ? iconBtn('back', '뒤로') : '') + '</div>' +
  '<h1 class="app-bar__title">' + title + '</h1>' +
  '<div class="app-bar__end">' + end + '</div></header>';

export default {
  title: 'Navigation/App Bar',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 뒤로와_제목 = { render: () => phone(bar({ title: '버스 부르기' }) + body('')) };
export const 동작_하나 = { render: () => phone(bar({ title: '즐겨찾는 곳', end: iconBtn('more', '더 보기') }) + body('')) };
export const 제목_가운데 = { render: () => phone(bar({ title: '이용 내역', back: false, center: true, end: iconBtn('close', '닫기') }) + body('')) };
export const 긴_제목 = { render: () => phone(bar({ title: '이천터미널에서 관고전통시장 거쳐 이천의료원까지 이용 내역 상세', end: iconBtn('more', '더 보기') }) + body('')) };
