// Overlay/Bottom Sheet — 문서 화면은 BottomSheet.mdx. 화면 아래에서 올라오는 층 (DS-ADR-049, TD-172)
// 덮개 · 열기 · 닫기 · 포커스 가두기 · Esc = 확인 창과 같은 js/modal.js. 창 클래스만 .modal--sheet · .sheet
// 늘 열려 있는 견본(정지 그림)은 문서 화면을 막지 않도록 aria-modal 을 빼고 그림
// 인원 고르기 세 시안 — 1 목록 행(추천) · 2 숫자 버튼 · 3 나란한 칸. 고른 값이 주 버튼 글자에 들어감(확인 창 없음)
import { svg, I, phone, body, iconBtn } from './_mobile.js';

const check = svg(I.check).replace('<svg ', '<svg class="list-item__check" ');
const row = (value, desc, on = false) =>
  '<li><button type="button" class="list-item" role="radio" aria-checked="' + on + '"' + (on ? '' : ' tabindex="-1"') + ' data-value="' + value + '"><span class="list-item__icon">' + svg(I.people) + '</span>' +
  '<span class="list-item__text"><span class="list-item__title">' + value + '</span>' + (desc ? '<span class="list-item__desc">' + desc + '</span>' : '') + '</span>' +
  '<span class="list-item__end">' + check + '</span></button></li>';
const callBtn = (id, value) => '<button type="button" class="btn btn--primary btn--filled btn--lg" data-modal-close="save" data-choice-for="' + id + '" data-choice-text="{value} 호출하기">' + value + ' 호출하기</button>';

// 1 목록 행
const listBody = (id) => '<ul class="list-items" role="radiogroup" id="' + id + '" aria-label="탑승 인원">' + row('1명', '', true) + row('2명', '보호자와 함께') + row('3명 이상', '기사님께 미리 알립니다') + '</ul>';
// 2 숫자 버튼
const numberBody = (id) => '<p class="sb-label" id="' + id + '-label">타시는 분(본인 포함)</p>' +
  '<div class="number-input" role="group" id="' + id + '" aria-labelledby="' + id + '-label" data-min="1" data-max="4">' +
  '<button type="button" class="number-input__btn" data-step="-1" aria-label="인원 줄이기">' + svg(I.minus) + '</button>' +
  '<output class="number-input__value" aria-live="polite">1</output><span class="number-input__unit">명</span>' +
  '<button type="button" class="number-input__btn" data-step="1" aria-label="인원 늘리기">' + svg(I.plus) + '</button></div>';
// 3 나란한 칸
const seg = (v, on = false) => '<button type="button" class="segmented__item" role="radio" aria-checked="' + on + '"' + (on ? '' : ' tabindex="-1"') + ' data-value="' + v + '">' + v + '</button>';
const segBody = (id) => '<div class="segmented" role="radiogroup" id="' + id + '" aria-label="탑승 인원">' + seg('1명', true) + seg('2명') + seg('3명') + seg('4명') + '</div>';

const sheet = ({ id, live = false, kind = 'list', look = '' }) => {
  const choice = id + '-choice';
  const inner = kind === 'number' ? numberBody(choice) : kind === 'segmented' ? segBody(choice) : listBody(choice);
  return '<div class="modal modal--sheet" id="' + id + '"' + (live ? ' hidden' : '') + '>' +
    '<div class="modal__dialog sheet' + (look ? ' sheet--' + look : '') + '" role="dialog"' + (live ? ' aria-modal="true"' : '') + ' aria-labelledby="' + id + '-title">' +
    (look === 'handle' ? '<span class="sheet__handle" aria-hidden="true"></span>' : '') +
    '<div class="modal__header"><h2 class="modal__title" id="' + id + '-title">몇 분이 타시나요?</h2>' + iconBtn('close', '닫기', ' data-modal-close="cancel"') + '</div>' +
    '<div class="modal__body">' + inner + '</div>' +
    '<div class="modal__footer">' + callBtn(choice, '1명') + '</div>' +
    '</div></div>';
};

export default {
  title: 'Overlay/Bottom Sheet',
  tags: ['!dev', '!autodocs'],
  parameters: { docs: { source: { language: 'html' } } },
};

export const 인원_목록_행 = {
  parameters: { docs: { source: { code: sheet({ id: 'ride-sheet', live: true }) } } },
  render: () => phone(body('') + sheet({ id: 'ride-sheet-list' }), 'sb-phone--tall'),
};
export const 인원_숫자_버튼 = {
  parameters: { docs: { source: { code: sheet({ id: 'ride-sheet', live: true, kind: 'number' }) } } },
  render: () => phone(body('') + sheet({ id: 'ride-sheet-number', kind: 'number' }), 'sb-phone--tall'),
};
export const 인원_나란한_칸 = {
  parameters: { docs: { source: { code: sheet({ id: 'ride-sheet', live: true, kind: 'segmented' }) } } },
  render: () => phone(body('') + sheet({ id: 'ride-sheet-seg', kind: 'segmented' }), 'sb-phone--tall'),
};
// 시트 모양 시안 — A 닫기 버튼(추천) · B 손잡이 · C 화면 가득 
export const 닫기_버튼 = { render: () => phone(body('') + sheet({ id: 'sheet-a' }), 'sb-phone--tall') };
export const 손잡이 = { render: () => phone(body('') + sheet({ id: 'sheet-b', look: 'handle' }), 'sb-phone--tall') };
export const 화면_가득 = { render: () => phone(body('') + sheet({ id: 'sheet-c', look: 'full' }), 'sb-phone--tall') };
export const 직접_열어_보기 = {
  render: () => phone(body('<button type="button" class="btn btn--primary btn--filled btn--lg" data-modal-open="ride-sheet-live">탑승 인원 고르기</button>') + sheet({ id: 'ride-sheet-live', live: true }), 'sb-phone--tall'),
};
