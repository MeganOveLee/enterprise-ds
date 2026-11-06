// Data Display/Badge — 문서 화면은 Badge.mdx. 표시만 하는 작은 알림(점 · 개수 · 글자) (조사-8 2-4, TD-172)
import { svg, I, phone, body } from './_mobile.js';

const bellBtn = (label, badge) => '<span class="badge-anchor"><button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="' + label + '">' + svg(I.bell) + '</button>' + badge + '</span>';
const bar = (end) => '<header class="app-bar"><h1 class="app-bar__title">이동</h1><div class="app-bar__end">' + end + '</div></header>';
const navItem = (icon, text, badge, cur = false) => '<a class="bottom-nav__item" href="#"' + (cur ? ' aria-current="page"' : '') + (badge ? ' aria-label="' + text + ', ' + badge[1] + '"' : '') + '><span class="badge-anchor">' + svg(I[icon]) + (badge ? '<span class="badge ' + badge[0] + '" aria-hidden="true">' + (badge[2] || '') + '</span>' : '') + '</span>' + text + '</a>';
const row = (title, badges, desc) => '<li><a class="list-item" href="#"><span class="list-item__icon">' + svg(I.bus) + '</span><span class="list-item__text"><span class="list-item__title">' + title + badges + '</span><span class="list-item__desc">' + desc + '</span></span><span class="list-item__end">' + svg(I.next) + '</span></a></li>';

export default {
  title: 'Data Display/Badge',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 점 = { render: () => phone(bar(bellBtn('알림, 새 알림 있음', '<span class="badge badge--dot" aria-hidden="true"></span>')) + body('') ) };
export const 개수 = {
  render: () => phone(bar(bellBtn('알림, 새 알림 3개', '<span class="badge badge--count" aria-hidden="true">3</span>')) + body('') +
    '<nav class="bottom-nav" aria-label="주 메뉴">' + navItem('bus', '호출', null, true) + navItem('ticket', '예약', ['badge--count', '확인할 예약 12개', '12']) + navItem('list', '이용 내역') + navItem('user', '내 정보', ['badge--count', '새 소식 120개', '99+']) + '</nav>'),
};
export const 글자 = {
  render: () => phone(body('<ul class="list-items" aria-label="정류장 도착 정보">' +
    row('똑버스 이천 1', '<span class="badge badge--label">1대 운행중</span>', '이천터미널 방면 · 5분 뒤 도착') +
    row('똑버스 이천 2', '<span class="badge badge--new" aria-label="새 노선">N</span>', '설봉공원 방면 · 12분 뒤 도착') +
    row('똑버스 이천 3', '', '관고전통시장 방면 · 운행 준비 중') + '</ul>', 'sb-phone__body--flush')),
};
