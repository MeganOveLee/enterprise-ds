// Blocks/Map Controls — 문서 화면은 MapControls.mdx. 모바일 앱 전용 조합 (css/blocks/mobility.css, TD-172)
// 버튼 = 떠 있는 버튼(.fab) 그대로. 시안 — 버튼: A 하나씩 · B 붙은 묶음 · C 글자 알약 / 이름표: A 진한 면 · B 흰 면 · C 누르는 이름표
// 지도 그림 자리는 회색 판 · 길 선, 자리는 견본 전용 클래스(.sb-at--*, stories/_mobile.css)
import { svg, I, phone } from './_mobile.js';

const map = (inner) => '<div class="sb-phone__map"><span class="sb-map__road" aria-hidden="true"></span>' + inner + '</div>';
const iconFab = (icon, label) => '<button type="button" class="btn btn--secondary btn--outlined fab fab--icon" aria-label="' + label + '">' + svg(I[icon]) + '</button>';
const textFab = (icon, label) => '<button type="button" class="btn btn--secondary btn--outlined fab">' + svg(I[icon]) + label + '</button>';
const btns = (inner, cls = '') => '<div class="map-btns' + (cls ? ' ' + cls : '') + ' sb-at sb-at--end">' + inner + '</div>';
const back = '<div class="sb-at sb-at--start">' + iconFab('back', '뒤로') + '</div>';
const label = (name, cls = '', at = 'sb-at--stop') => '<span class="map-label' + (cls ? ' ' + cls : '') + ' sb-at ' + at + '">' + name + '</span>';
const car = '<span class="map-tag sb-at sb-at--car"><span class="map-tag__plate">70바 1234</span><span>14:05–14:12 도착</span></span>';

export default {
  title: 'Blocks/Map Controls',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 버튼_하나씩 = { render: () => phone(map(back + btns(iconFab('info', '운행 정보') + iconFab('locate', '내 위치로 이동')) + label('장호원읍사무소 앞'))) };
export const 버튼_묶음 = { render: () => phone(map(back + btns(iconFab('info', '운행 정보') + iconFab('locate', '내 위치로 이동'), 'map-btns--group') + label('장호원읍사무소 앞'))) };
export const 글자_알약 = { render: () => phone(map(back + btns(textFab('info', '운행 정보') + iconFab('locate', '내 위치로 이동')) + label('장호원읍사무소 앞'))) };

export const 이름표_진한_면 = { render: () => phone(map(label('장호원읍사무소 앞 정류장') + car)) };
export const 이름표_흰_면 = { render: () => phone(map(label('장호원읍사무소 앞', 'map-label--outline', 'sb-at--stop2') + label('장호원 터미널', 'map-label--outline'))) };
export const 누르는_이름표 = {
  render: () => phone(map('<button type="button" class="map-label map-label--action sb-at sb-at--stop"><span class="map-label__name">장호원읍사무소 앞</span><span class="map-label__action">여기서 타기</span></button>')),
};
export const 차_태그 = { render: () => phone(map(car + label('장호원읍사무소 앞 정류장'))) };
