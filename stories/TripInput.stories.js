// Blocks/Trip Input: 문서 화면은 TripInput.mdx. 모바일 앱 전용 조합 (css/blocks/mobility.css)
// 시안 A 두 칸 세로(추천) · B 한 줄 · C 타는 곳 한 칸. 칸은 누르면 장소 고르기가 열리는 button
import { svg, I, phone, body } from './_mobile.js';

// id = 문서 화면에 카드 여럿이 함께 그려져도 겹치지 않게 시안마다 앞말을 둠
const stop = (id, kind, label, place, hint = '') => {
  const empty = !place;
  return '<div class="trip-input__stop trip-input__stop--' + kind + '"><span class="trip-input__mark" aria-hidden="true"></span>' +
    '<span class="trip-input__label" id="' + id + '-' + kind + '">' + label + '</span>' +
    '<button type="button" class="trip-input__field' + (empty ? ' trip-input__field--empty' : '') + '" data-label="' + label + '" aria-labelledby="' + id + '-' + kind + ' ' + id + '-' + kind + '-place">' +
    '<span class="trip-input__place" id="' + id + '-' + kind + '-place">' + (place || '도착할 곳 고르기') + '</span>' +
    (hint ? '<span class="trip-input__hint">' + hint + '</span>' : '') + '</button></div>';
};
const box = (inner, cls = '') => '<div class="trip-input' + (cls ? ' ' + cls : '') + '" role="group" aria-label="출발 · 도착">' + inner + '</div>';
const swap = '<button type="button" class="btn btn--secondary btn--transparent btn--icon trip-input__swap" aria-label="출발 · 도착 바꾸기">' + svg(I.swap) + '</button>';

export default {
  title: 'Blocks/Trip Input',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 두_칸 = { render: () => phone(body(box(stop('ta', 'start', '어디서 타요', '장호원읍사무소 앞 정류장', '지금 위치에서 걸어서 3분 · 바꾸기') + stop('ta', 'end', '어디로 가요', '')))) };
export const 두_칸_고른_뒤 = { render: () => phone(body(box(stop('tb', 'start', '어디서 타요', '장호원읍사무소 앞 정류장', '지금 위치에서 걸어서 3분 · 바꾸기') + stop('tb', 'end', '어디로 가요', '이천의료원 장례식장 앞 정류장', '타고 18분')))) };
export const 한_줄 = { render: () => phone(body(box(stop('tc', 'start', '출발', '장호원읍사무소 앞') + stop('tc', 'end', '도착', '장호원 터미널') + swap, 'trip-input--inline'))) };
export const 타는_곳_한_칸 = { render: () => phone(body(box(stop('td', 'start', '어디서 타요', '장호원읍사무소 앞 정류장', '지도를 움직여 타는 곳 맞추기'), 'trip-input--pickup'))) };
