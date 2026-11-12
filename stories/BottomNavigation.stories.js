// Navigation/Bottom Navigation: 문서 화면은 BottomNavigation.mdx. 모바일 앱 첫 단계 화면 사이를 오가는 하단 탭 (DS-ADR-049)
// 시안 A 막대(추천) · B 알약 표시 · C 떠 있는 알약. 아이콘 = 선 ↔ 채움 짝, 지금 화면만 채움 
import { svg, solid, I, F, phone, body } from './_mobile.js';

const icons = (k) => '<span class="bottom-nav__icons">' + svg(I[k]).replace('<svg ', '<svg class="bottom-nav__icon" ') + solid(F[k], 24, 'bottom-nav__icon--on') + '</span>';
const nav = (items, current = 0, mod = '') =>
  '<nav class="bottom-nav' + (mod ? ' bottom-nav--' + mod : '') + '" aria-label="주 메뉴">' +
  items.map(([icon, label], i) => '<a class="bottom-nav__item" href="#"' + (i === current ? ' aria-current="page"' : '') + '>' + icons(icon) + label + '</a>').join('') +
  '</nav>';
const THREE = [['bus', '호출'], ['list', '이용 내역'], ['user', '내 정보']];
const FOUR = [['bus', '호출'], ['ticket', '예약'], ['list', '이용 내역'], ['user', '내 정보']];
const FIVE = [['home', '홈'], ['bus', '호출'], ['star', '즐겨찾기'], ['list', '이용 내역'], ['user', '내 정보']];

export default {
  title: 'Navigation/Bottom Navigation',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 막대 = { render: () => phone(body('') + nav(FOUR)) };
export const 알약_표시 = { render: () => phone(body('') + nav(FOUR, 0, 'indicator')) };
export const 떠_있는_알약 = { render: () => phone('<div class="sb-phone__map">' + nav(FOUR, 0, 'floating') + '</div>') };
export const 항목_셋 = { render: () => phone(body('') + nav(THREE)) };
export const 항목_다섯 = { render: () => phone(body('') + nav(FIVE, 3)) };
