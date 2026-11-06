// Form/Floating Button — 문서 화면은 FloatingButton.mdx. 지도 · 목록 위에 떠 있는 동작 하나 (DS-ADR-049, TD-172)
// 지도 자리는 회색 판(실제 지도 그림은 Blocks · Screens 에서)
import { svg, I, phone } from './_mobile.js';

const map = (inner) => '<div class="sb-phone__map">' + inner + '</div>';
const fab = (label, cls, icon, pos) => '<button type="button" class="btn ' + cls + ' fab ' + pos + '">' + svg(I[icon]) + label + '</button>';
const fabIcon = (label, cls, icon, pos) => '<button type="button" class="btn ' + cls + ' fab fab--icon ' + pos + '" aria-label="' + label + '">' + svg(I[icon]) + '</button>';

export default {
  title: 'Form/Floating Button',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 주_행동 = { render: () => phone(map(fab('버스 부르기', 'btn--primary btn--filled', 'bus', 'fab--center'))) };
export const 아이콘만 = { render: () => phone(map(fabIcon('내 위치로 이동', 'btn--secondary btn--outlined', 'locate', 'fab--end'))) };
