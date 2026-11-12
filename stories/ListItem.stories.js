// Data Display/List Item — 문서 화면은 ListItem.mdx. 모바일 앱 목록 한 줄 (DS-ADR-049)
// 시안 A 구분선 행(추천) · B 묶음 카드 · C 행마다 카드 + 뒤 원형 동작 버튼 
import { svg, solid, I, P, phone, body } from './_mobile.js';

const icon = (k) => P[k] ? '<span class="list-item__icon place--' + k + '">' + solid(P[k]) + '</span>' : '<span class="list-item__icon">' + svg(I[k]) + '</span>';
const item = ({ icon: ic, title, desc, end = '', arrow = false, tag = 'a' }) =>
  (tag === 'a' ? '<a class="list-item" href="#">' : '<' + tag + ' class="list-item">') +
  (ic ? icon(ic) : '') +
  '<span class="list-item__text"><span class="list-item__title">' + title + '</span>' + (desc ? '<span class="list-item__desc">' + desc + '</span>' : '') + '</span>' +
  (end || arrow ? '<span class="list-item__end">' + end + (arrow ? svg(I.next) : '') + '</span>' : '') +
  '</' + tag + '>';
const list = (items, label, mod = '') => '<ul class="list-items' + (mod ? ' list-items--' + mod : '') + '" aria-label="' + label + '">' + items.map((i) => '<li>' + item(i) + (i.action ? '<button type="button" class="list-item__action" aria-label="' + i.action + '">' + svg(I.redo) + '</button>' : '') + '</li>').join('') + '</ul>';
const PLACES = [
  { icon: 'home', title: '집', desc: '경기도 이천시 중리동', arrow: true },
  { icon: 'medical', title: '이천의료원', desc: '경기도 이천시 경충대로', arrow: true },
  { icon: 'market', title: '관고전통시장', desc: '경기도 이천시 관고동', arrow: true },
];

export default {
  title: 'Data Display/List Item',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 구분선_행 = { render: () => phone(body(list(PLACES, '즐겨찾는 곳'), 'sb-phone__body--flush')) };
export const 묶음_카드 = { render: () => phone(body(list(PLACES, '즐겨찾는 곳', 'grouped'))) };
export const 행마다_카드 = {
  render: () => phone(body(list([
    { title: '이천종합터미널 → 이천시청', desc: '2026-11-05 오전 9:12 · 1명', action: '이천종합터미널에서 이천시청 다시 부르기' },
    { title: '설봉공원 → 이천의료원', desc: '2026-11-03 오후 2:40 · 2명', action: '설봉공원에서 이천의료원 다시 부르기' },
    { title: '관고전통시장 → 집', desc: '2026-10-30 오전 11:05 · 1명', action: '관고전통시장에서 집 다시 부르기' },
  ], '최근 이용', 'cards'))),
};
export const 이용_내역 = {
  render: () => phone(body(list([
    { title: '이천종합터미널 → 이천시청', desc: '2026-11-05 오전 9:12 · 1명', end: '1,450원', arrow: true },
    { title: '설봉공원 → 이천의료원', desc: '2026-11-03 오후 2:40 · 2명', end: '2,900원', arrow: true },
    { title: '관고전통시장 → 집', desc: '2026-10-30 오전 11:05 · 1명', end: '취소', arrow: true },
  ], '이용 내역'), 'sb-phone__body--flush')),
};
