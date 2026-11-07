// Form/Chip — 문서 화면은 Chip.mdx. 누르는 칩(바로가기 · 하나 고르기 · 여럿 고르기). 표시만 하는 칩은 Data Display/Status Chip
// 시안 A 장소 칩(추천) · B 원형 아이콘 칩 · C 큰 타일 (DS-ADR-049 · 050 · 051, TD-172)
import { svg, solid, I, P, PLACE, phone, body } from './_mobile.js';

const check = svg(I.check).replace('<svg ', '<svg class="chip__check" ');
const placeIcon = (k) => solid(P[k], 24, 'chip__place');
const dot = (k) => '<span class="chip__dot">' + solid(P[k]) + '</span>';
// 시안 A — 장소 칩
const place = (k, label = PLACE[k]) => '<a class="chip chip--place place--' + k + '" href="#">' + placeIcon(k) + label + '</a>';
const placeRadio = (k, on = false, label = PLACE[k]) => '<button type="button" class="chip chip--place place--' + k + '" role="radio" aria-checked="' + on + '"' + (on ? '' : ' tabindex="-1"') + '>' + placeIcon(k) + label + '</button>';
const placeToggle = (k, on = false, label = PLACE[k]) => '<button type="button" class="chip chip--place place--' + k + '" aria-pressed="' + on + '">' + placeIcon(k) + label + '</button>';
// 시안 B — 원형 아이콘 칩
const dotChip = (k, label = PLACE[k]) => '<a class="chip chip--dot place--' + k + '" href="#">' + dot(k) + label + '</a>';
// 시안 C — 큰 타일
const tile = (k, label = PLACE[k]) => '<a class="chip-tile place--' + k + '" href="#">' + dot(k) + label + '</a>';
// 필터 칩 — 회색 테두리, 고르면 선택 면
const toggle = (label, on = false) => '<button type="button" class="chip" aria-pressed="' + on + '">' + check + label + '</button>';
const radio = (label, on = false) => '<button type="button" class="chip" role="radio" aria-checked="' + on + '"' + (on ? '' : ' tabindex="-1"') + '>' + check + label + '</button>';
const group = (items, attrs = '') => '<div class="chip-group"' + (attrs ? ' ' + attrs : '') + '>' + items.join('') + '</div>';
const label = (t) => '<p class="sb-label">' + t + '</p>';

export default {
  title: 'Form/Chip',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 장소_칩 = { render: () => phone(body(group([place('home'), place('medical', '이천의료원'), place('market', '관고전통시장'), place('welfare', '창전동 경로당'), place('public', '이천시청')], 'aria-label="자주 가는 곳"'))) };
export const 장소_종류_하나_고르기 = { render: () => phone(body(label('어떤 곳인가요?') + group([placeRadio('home', true), placeRadio('medical'), placeRadio('market'), placeRadio('welfare'), placeRadio('public')], 'role="radiogroup" aria-label="장소 종류"'))) };
export const 장소_종류_여럿_고르기 = { render: () => phone(body(label('지도에 보일 곳') + group([placeToggle('home', true), placeToggle('medical', true), placeToggle('market'), placeToggle('welfare'), placeToggle('public')], 'role="group" aria-label="지도에 보일 장소 종류"'))) };
export const 원형_아이콘_칩 = { render: () => phone(body(group([dotChip('home'), dotChip('medical', '이천의료원'), dotChip('market', '관고전통시장'), dotChip('welfare', '창전동 경로당'), dotChip('public', '이천시청')], 'aria-label="자주 가는 곳"'))) };
export const 큰_타일 = { render: () => phone(body('<div class="chip-tiles" role="group" aria-label="자주 가는 곳">' + [tile('home'), tile('medical', '이천의료원'), tile('market', '관고시장'), tile('public', '주민센터')].join('') + '</div>')) };
export const 필터_여럿_고르기 = { render: () => phone(body(group([toggle('저상 버스', true), toggle('휠체어 탑승'), toggle('보호자 동반'), toggle('짐 많음')], 'role="group" aria-label="탑승 조건"'))) };
export const 필터_하나_고르기 = { render: () => phone(body(group([radio('전체', true), radio('이번 주'), radio('지난달'), radio('취소한 이용')], 'role="radiogroup" aria-label="이용 내역 기간"'))) };
// 가로 넘김 — 줄에 붙인 클래스로 시안을 고름(js/chips.js). 칩이 놓인 칸보다 길 때만 신호가 보임
const many = () => [place('home'), place('medical', '이천의료원'), place('market', '관고전통시장'), place('welfare', '창전동 경로당'), place('public', '이천시청'), place('medical', '서울약국')].join('');
const scroller = (mod) => '<div class="chip-group chip-group--scroll' + (mod ? ' chip-group--' + mod : '') + '" role="group" aria-label="자주 가는 곳">' + many() + '</div>';
export const 넘김_화살표 = { render: () => phone(body(scroller(''))) };
export const 넘김_끝_흐림 = { render: () => phone(body(scroller('fade'))) };
export const 넘김_끝_칩_잘림 = { render: () => phone(body(scroller('peek'))) };
