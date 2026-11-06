// Overlay/Bottom Sheet — 문서 화면은 BottomSheet.mdx. 화면 아래에서 올라오는 층 (DS-ADR-049, TD-172)
// 덮개 · 열기 · 닫기 · 포커스 가두기 · Esc = 확인 창과 같은 js/modal.js. 창 클래스만 .modal--sheet · .sheet
// 늘 열려 있는 견본(정지 그림)은 문서 화면을 막지 않도록 aria-modal 을 빼고 그림
import { svg, I, phone, body, iconBtn } from './_mobile.js';

const row = (title, desc, on = false) =>
  '<li><button type="button" class="list-item" aria-pressed="' + on + '"><span class="list-item__icon">' + svg(I.people) + '</span>' +
  '<span class="list-item__text"><span class="list-item__title">' + title + '</span>' + (desc ? '<span class="list-item__desc">' + desc + '</span>' : '') + '</span>' +
  (on ? '<span class="list-item__end">' + svg(I.check) + '</span>' : '') + '</button></li>';
const sheet = ({ id, live = false }) =>
  '<div class="modal modal--sheet" id="' + id + '"' + (live ? ' hidden' : '') + '>' +
  '<div class="modal__dialog sheet" role="dialog"' + (live ? ' aria-modal="true"' : '') + ' aria-labelledby="' + id + '-title">' +
  '<div class="modal__header"><h2 class="modal__title" id="' + id + '-title">몇 분이 타시나요?</h2>' + iconBtn('close', '닫기', ' data-modal-close="cancel"') + '</div>' +
  '<div class="modal__body"><ul class="list-items" aria-label="탑승 인원">' + row('1명', '', true) + row('2명', '보호자와 함께') + row('3명 이상', '기사님께 미리 알립니다') + '</ul></div>' +
  '<div class="modal__footer"><button type="button" class="btn btn--primary btn--filled btn--lg" data-modal-close="save">1명으로 부르기</button></div>' +
  '</div></div>';

export default {
  title: 'Overlay/Bottom Sheet',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 고르고_부르기 = {
  parameters: { docs: { source: { code: sheet({ id: 'ride-sheet', live: true }) } } },
  render: () => phone(body('') + sheet({ id: 'ride-sheet-static' }), 'sb-phone--tall'),
};
export const 직접_열어_보기 = {
  render: () => phone(body('<button type="button" class="btn btn--primary btn--filled btn--lg" data-modal-open="ride-sheet-live">탑승 인원 고르기</button>') + sheet({ id: 'ride-sheet-live', live: true }), 'sb-phone--tall'),
};
