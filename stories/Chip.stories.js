// Form/Chip — 문서 화면은 Chip.mdx. 누르는 칩(바로가기 · 필터). 표시만 하는 칩은 Data Display/Status Chip (DS-ADR-049, TD-172)
import { svg, I, phone, body } from './_mobile.js';

const link = (icon, label) => '<a class="chip" href="#">' + (icon ? svg(I[icon]) : '') + label + '</a>';
const toggle = (label, on = false) => '<button type="button" class="chip" aria-pressed="' + on + '">' + (on ? svg(I.check) : '') + label + '</button>';
const group = (items, scroll = false, label = '') => '<div class="chip-group' + (scroll ? ' chip-group--scroll' : '') + '"' + (label ? ' role="group" aria-label="' + label + '"' : '') + '>' + items.join('') + '</div>';

export default {
  title: 'Form/Chip',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 바로가기 = { render: () => phone(body(group([link('home', '집'), link('hospital', '이천의료원'), link('cart', '관고전통시장')]))) };
export const 필터 = { render: () => phone(body(group([toggle('전체', true), toggle('이번 주'), toggle('지난달'), toggle('취소한 이용')], false, '이용 내역 기간'))) };
export const 한_줄_스크롤 = { render: () => phone(body(group([link('home', '집'), link('hospital', '이천의료원'), link('cart', '관고전통시장'), link('pin', '이천시청'), link('pin', '설봉공원')], true))) };
