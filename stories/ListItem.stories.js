// Data Display/List Item — 문서 화면은 ListItem.mdx. 모바일 앱 목록 한 줄 (DS-ADR-049, TD-172)
import { svg, I, phone, body } from './_mobile.js';

const item = ({ icon, title, desc, end = '', arrow = false, tag = 'a' }) =>
  '<li><' + tag + ' class="list-item"' + (tag === 'a' ? ' href="#"' : tag === 'button' ? ' type="button"' : '') + '>' +
  (icon ? '<span class="list-item__icon">' + svg(I[icon]) + '</span>' : '') +
  '<span class="list-item__text"><span class="list-item__title">' + title + '</span>' + (desc ? '<span class="list-item__desc">' + desc + '</span>' : '') + '</span>' +
  (end || arrow ? '<span class="list-item__end">' + end + (arrow ? svg(I.next) : '') + '</span>' : '') +
  '</' + tag + '></li>';
const list = (items, label) => '<ul class="list-items" aria-label="' + label + '">' + items.map(item).join('') + '</ul>';

export default {
  title: 'Data Display/List Item',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 즐겨찾는_곳 = {
  render: () => phone(body(list([
    { icon: 'home', title: '집', desc: '경기도 이천시 중리동', arrow: true },
    { icon: 'hospital', title: '이천의료원', desc: '경기도 이천시 경충대로', arrow: true },
    { icon: 'cart', title: '관고전통시장', desc: '경기도 이천시 관고동', arrow: true },
  ], '즐겨찾는 곳'), 'sb-phone__body--flush')),
};
export const 이용_내역 = {
  render: () => phone(body(list([
    { title: '이천터미널 → 이천시청', desc: '2026-11-05 오전 9:12 · 1명', end: '1,450원', arrow: true },
    { title: '설봉공원 → 이천의료원', desc: '2026-11-03 오후 2:40 · 2명', end: '2,900원', arrow: true },
    { title: '관고전통시장 → 집', desc: '2026-10-30 오전 11:05 · 1명', end: '취소', arrow: true },
  ], '이용 내역'), 'sb-phone__body--flush')),
};
export const 고르는_행 = {
  render: () => phone(body(list([
    { icon: 'people', title: '1명', tag: 'button' },
    { icon: 'people', title: '2명', desc: '보호자와 함께', tag: 'button' },
    { icon: 'people', title: '3명 이상', desc: '기사님께 미리 알립니다', tag: 'button' },
  ], '탑승 인원'), 'sb-phone__body--flush')),
};
