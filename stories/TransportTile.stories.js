// Blocks/Transport Tile: 문서 화면은 TransportTile.mdx. 모바일 앱 전용 조합 (css/blocks/mobility.css)
// 시안 A 큰 타일 하나(추천, 쉬운 화면) · B 격자 · C 줄 타일. 이름은 하는 일로, 그림은 DS 아이콘
import { svg, I, phone, body } from './_mobile.js';

const tile = (icon, name, desc = '', cls = '', meta = '') => '<a class="transport-tile' + (cls ? ' ' + cls : '') + '" href="#">' +
  '<span class="transport-tile__icon">' + svg(I[icon]) + '</span><span class="transport-tile__name">' + name + '</span>' +
  (desc ? '<span class="transport-tile__desc">' + desc + '</span>' : '') + (meta ? '<span class="transport-tile__meta">' + meta + '</span>' : '') + '</a>';

export default {
  title: 'Blocks/Transport Tile',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 큰_타일_하나 = { render: () => phone(body(tile('bus', '버스 부르기', '부르면 찾아오는 버스', 'transport-tile--primary'))) };
export const 격자 = {
  render: () => phone(body('<div class="transport-tiles">' +
    '<div class="transport-tiles__row">' + tile('bus', '버스 부르기', '부르면 찾아오는 버스') + tile('route', '정해진 길로 타기', '노선을 따라 도는 버스') + '</div>' +
    '<div class="transport-tiles__row transport-tiles__row--sm">' + tile('pin', '정류장 찾기', '', 'transport-tile--sm') + tile('star', '자주 가는 곳', '', 'transport-tile--sm') + tile('list', '이용 내역', '', 'transport-tile--sm') + tile('ticket', '내 승차권', '', 'transport-tile--sm') + '</div>' +
    '</div>')),
};
export const 줄_타일 = {
  render: () => phone(body('<div class="sb-stack">' +
    tile('bus', '버스 부르기', '부르면 찾아오는 버스', 'transport-tile--row', '14:05–14:12 도착') +
    tile('route', '정해진 길로 타기', '노선을 따라 도는 버스', 'transport-tile--row', '20분마다') +
    tile('phone', '전화로 부르기', '상담원이 대신 불러 드려요', 'transport-tile--row', '취소 수수료 없음') +
    '</div>')),
};
