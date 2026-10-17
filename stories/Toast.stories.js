// Feedback/Toast — 문서 화면은 Toast.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
// 제품에서 .toast-region 은 화면 오른쪽 아래에 고정(position: fixed). 문서에서는 정해진 크기의 틀 오른쪽 아래에 그림
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16 10"/>',
  warning: '<path d="M12 4 21 19.5H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.2" r=".6" fill="currentColor"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};

// 토스트 하나 — status: info · success · warning · danger. 위험만 role="alert"(나머지는 영역의 status 가 읽음)
const toast = ({ status = 'info', msg = '', action = '', close = true } = {}) =>
  '<div class="toast' + (status !== 'info' ? ' toast--' + status : '') + '"' + (status === 'danger' ? ' role="alert"' : '') + '>' +
  '<span class="toast__icon">' + svg(I[status]) + '</span>' +
  '<span class="toast__msg">' + msg + '</span>' +
  (action ? '<button type="button" class="toast__action">' + action + '</button>' : '') +
  (close ? '<button type="button" class="btn btn--secondary btn--transparent btn--icon btn--sm" aria-label="알림 닫기">' + svg(I.close, 14) + '</button>' : '') +
  '</div>';
// 화면 틀 — 회색 화면 오른쪽 아래에 영역(제품의 fixed 대신 틀 안 absolute)
const stage = (items, h = 260) =>
  '<div style="position:relative;height:' + h + 'px;max-width:720px;background:var(--color-bg-subtle);border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' +
  '<div class="toast-region" role="status" style="position:absolute;right:16px;bottom:16px">' + items.join('') + '</div></div>';

export default {
  title: 'Feedback/Toast',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Toast.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 저장_완료 = {
  render: () => stage([toast({ status: 'success', msg: '저장했어요.' })], 120),
};
export const 동작이_있는_알림 = {
  render: () => stage([
    toast({ status: 'success', msg: '문서 3건을 결재 요청했어요.', action: '보기' }),
    toast({ status: 'danger', msg: '저장하지 못했어요. 네트워크를 확인해 주세요.', action: '다시 시도' }),
  ], 190),
};
export const 쌓임 = {
  render: () => stage([
    toast({ msg: '주소를 복사했어요.' }),
    toast({ status: 'success', msg: '저장했어요.' }),
    toast({ status: 'warning', msg: '첨부 1개는 크기가 커서 빠졌어요.' }),
  ], 230),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) ── 미리보기만, 코드는 위 예시 카드에
// Alert 한 줄 — 「다시 볼 결과는 Alert」 비교용 (Alert 문서와 같은 마크업)
const alertLine = (status, title, desc = '') => '<div class="alert alert--' + status + '" role="status"><span class="alert__icon">' + svg(I[status]) + '</span>' +
  '<div class="alert__body"><strong class="alert__title">' + title + '</strong>' + (desc ? '<span class="alert__desc">' + desc + '</span>' : '') + '</div></div>';
const wide = (h) => '<div style="flex:1;min-width:0">' + h + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: Toast 예시 「저장 완료」(문구만 짧게) · 구성 「사라짐」(4초 뒤 닫힘)
    { title: '문구는 한 줄로 짧게',
      do: [toast({ status: 'success', msg: '저장했어요.' }),
        '방금 한 일의 결과만 한 줄로 적습니다.'],
      dont: [toast({ status: 'success', msg: '저장했어요. 결재선은 팀장 → 부서장 순서이고, 첨부 2개가 함께 저장되었으며, 결재 요청은 목록에서 할 수 있어요.' }),
        '글이 길면 사라지기 전에 다 읽을 수 없습니다.'] },
    // 근거: Toast 구성 「사라짐」 — 동작 버튼이 있거나 위험 알림이면 사용자가 닫을 때까지 남김
    { title: '위험 알림은 닫을 때까지',
      do: [toast({ status: 'danger', msg: '저장하지 못했어요.', action: '다시 시도' }),
        '위험 알림과 동작이 있는 알림은 닫기 버튼을 두고, 사용자가 닫을 때까지 남깁니다.'],
      dont: [toast({ status: 'danger', msg: '저장하지 못했어요.', close: false }),
        '닫기 없이 4초 뒤 사라지면 다시 시도할 기회를 놓칩니다.'] },
    // 근거: Toast 구성 아래 「화면에 남겨 둘 결과는 Alert」 · Alert 예시 「결과」(여러 건을 한 번에 처리한 결과)
    { title: '다시 볼 결과는 Alert로',
      do: [wide(alertLine('warning', '일괄 등록 12건 중 10건을 마쳤어요', '2건은 문서 명이 비어 있어 빠졌어요.')),
        '여러 건을 처리한 결과는 화면에 남는 Alert로 둡니다.'],
      dont: [toast({ status: 'warning', msg: '일괄 등록 12건 중 10건을 마쳤어요.' }),
        '토스트가 사라지면 어느 건이 빠졌는지 다시 볼 수 없습니다.'] },
  ]),
};

// ── 전체 상태 — 행 = 상태, 열 = 구성 ──
const STATES = [['정보', 'info'], ['성공', 'success'], ['경고', 'warning'], ['위험', 'danger']];
export const 전체_상태 = {
  render: () => matrix(['글자 + 닫기', '동작 버튼', '두 줄'],
    STATES.map(([name, s]) => [name, [
      toast({ status: s, msg: name + ' 알림' }),
      toast({ status: s, msg: name + ' 알림', action: '보기' }),
      toast({ status: s, msg: name + ' 알림 — 글이 길면 줄을 바꿔 두 줄로 보여요. 폭은 360까지.', action: '보기' }),
    ]]), { full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    status: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'], description: '상태 — `.toast--{상태}` (info 는 기본이라 클래스 없음). 아이콘 색만 바뀜' },
    msg: { control: 'text', description: '문구 — `.toast__msg`' },
    action: { control: 'text', description: '동작 버튼 — `.toast__action` (비우면 없음)' },
    close: { control: 'boolean', description: '닫기 버튼 (아이콘 버튼 + aria-label)' },
  },
  args: { status: 'success', msg: '저장했어요.', action: '', close: true },
  render: (a) => stage([toast(a)], 120),
};
