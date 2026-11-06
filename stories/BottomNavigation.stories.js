// Navigation/Bottom Navigation — 문서 화면은 BottomNavigation.mdx. 모바일 앱 첫 단계 화면 사이를 오가는 하단 탭 (DS-ADR-049, TD-172)
import { svg, I, phone, body } from './_mobile.js';

const nav = (items, current = 0) =>
  '<nav class="bottom-nav" aria-label="주 메뉴">' +
  items.map(([icon, label], i) => '<a class="bottom-nav__item" href="#"' + (i === current ? ' aria-current="page"' : '') + '>' + svg(I[icon]) + label + '</a>').join('') +
  '</nav>';
const THREE = [['bus', '호출'], ['list', '이용 내역'], ['user', '내 정보']];
const FIVE = [['home', '홈'], ['bus', '호출'], ['star', '즐겨찾기'], ['list', '이용 내역'], ['user', '내 정보']];

export default {
  title: 'Navigation/Bottom Navigation',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 항목_셋 = { render: () => phone(body('') + nav(THREE)) };
export const 항목_다섯 = { render: () => phone(body('') + nav(FIVE, 3)) };
