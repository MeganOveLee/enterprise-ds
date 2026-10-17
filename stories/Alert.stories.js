// Feedback/Alert — 문서 화면은 Alert.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
// 상태 아이콘 — 정보 · 성공 · 경고 · 위험. 브랜드 · 중립은 정보 아이콘
const I = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16 10"/>',
  warning: '<path d="M12 4 21 19.5H3z"/><path d="M12 10v4.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  danger: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><circle cx="12" cy="16.2" r=".6" fill="currentColor"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};
const ICON = { info: 'info', success: 'success', warning: 'warning', danger: 'danger', brand: 'info', neutral: 'info' };
const ROLE = { danger: 'alert' };   // 바로 알려야 하는 것만 alert, 나머지는 status

// 줄 하나 — status: info · success · warning · danger · brand · neutral
const alert = ({ status = 'info', title = '', desc = '', close = false, plain = false } = {}) =>
  '<div class="alert' + (status !== 'info' ? ' alert--' + status : '') + (plain ? ' alert--plain' : '') + '" role="' + (ROLE[status] || 'status') + '">' +
  '<span class="alert__icon">' + svg(I[ICON[status]]) + '</span>' +
  '<div class="alert__body">' + (title ? '<strong class="alert__title">' + title + '</strong>' : '') + (desc ? '<span class="alert__desc">' + desc + '</span>' : '') + '</div>' +
  (close ? '<button type="button" class="btn btn--secondary btn--transparent btn--icon btn--sm alert__close" aria-label="알림 닫기">' + svg(I.close, 14) + '</button>' : '') +
  '</div>';
const stack = (items, w = '640px') => '<div style="display:flex;flex-direction:column;gap:8px;max-width:' + w + '">' + items.join('') + '</div>';

export default {
  title: 'Feedback/Alert',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Alert.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 입력_확인 = {
  render: () => stack([alert({ status: 'danger', title: '필수 항목 두 개가 비어 있어요', desc: '문서 분류 · 문서 명을 입력하세요. 칸 아래에도 빨간 문구가 함께 보여요.' })]),
};
export const 안내 = {
  render: () => stack([
    alert({ status: 'warning', title: '결재 중인 문서는 수정할 수 없어요', desc: '결재가 끝나거나 회수한 뒤에 수정하세요.' }),
    alert({ status: 'info', title: '검색 결과는 최근 1년 문서만 보여요', desc: '기간을 바꾸면 더 오래된 문서도 볼 수 있어요.' }),
  ]),
};
export const 결과 = {
  render: () => stack([alert({ status: 'success', title: '일괄 등록 12건을 모두 마쳤어요' })]),
};
export const 공지 = {
  render: () => stack([
    alert({ status: 'brand', title: '결재선을 저장해 두고 다시 쓸 수 있어요', close: true }),
    alert({ status: 'neutral', plain: true, title: '임시 저장본이 있어요 (10-14 18:20)' }),
  ]),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) ── 미리보기만, 코드는 위 예시 카드에
const col = (items) => '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px">' + items.join('') + '</div>';
const ddField = (label, id, err = '') => '<div class="form-grid-2" style="grid-template-columns:1fr"><div class="ff-field"><label class="search-label" for="' + id + '">' + label + '</label><div class="td">' +
  '<input class="input" id="' + id + '" aria-invalid="true"' + (err ? ' aria-describedby="' + id + '-err"' : '') + '>' + (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '') + '</div></div></div>';
const toastLike = (status, msg) => '<div class="toast toast--' + status + '"><span class="toast__icon">' + svg(I[status]) + '</span><span class="toast__msg">' + msg + '</span></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: 이전 「언제 쓰나」 표 1행 — 칸 아래 빨간 문구 + 폼 위 Alert(위험), 어느 칸인지 Alert에도 적음
    { title: '입력 오류는 칸 이름까지',
      do: [col([alert({ status: 'danger', title: '문서 명이 비어 있어요' }), ddField('문서 명', 'dd-al-nm', '문서 명을 입력해 주세요')]),
        '폼 위 Alert와 칸 아래 오류 글에 같은 칸 이름을 적습니다.'],
      dont: [col([alert({ status: 'danger', title: '입력값을 확인해 주세요' }), ddField('문서 명', 'dd-al-nm2')]),
        '칸 이름이 없으면 폼 전체를 다시 살펴야 합니다.'] },
    // 근거: 이전 「언제 쓰나」 표 2행(읽고 넘어갈 때까지 남음) · Toast 구성 「사라짐」(4초 뒤 닫힘)
    { title: '읽고 넘어갈 조건은 Alert로',
      do: [col([alert({ status: 'warning', title: '결재 중인 문서는 수정할 수 없어요', desc: '결재가 끝나거나 회수한 뒤에 수정하세요.' })]),
        'Alert는 사용자가 읽고 넘어갈 때까지 화면에 남습니다.'],
      dont: [toastLike('warning', '결재 중인 문서는 수정할 수 없어요.'),
        '토스트는 4초 뒤 사라져, 조건을 읽기 전에 놓칩니다.'] },
    // 근거: 이전 「언제 쓰나」 표 3행 — 저장 · 복사처럼 방금 한 일의 짧은 결과는 Toast
    { title: '방금 한 일의 짧은 결과는 토스트로',
      do: [toastLike('success', '저장했어요.'),
        '저장 · 복사의 결과는 잠깐 뜨고 사라지는 토스트로 알립니다.'],
      dont: [col([alert({ status: 'success', title: '저장했어요' })]),
        '끝난 일의 짧은 결과를 화면에 남겨 두지 않습니다.'] },
  ]),
};

// ── 전체 상태 — 행 = 상태, 열 = 모양 ──
const STATES = [['정보', 'info'], ['성공', 'success'], ['경고', 'warning'], ['위험', 'danger'], ['브랜드', 'brand'], ['중립', 'neutral']];
export const 전체_상태 = {
  render: () => matrix(['테두리 (기본)', '테두리 없음 (.alert--plain)', '설명 · 닫기'],
    STATES.map(([name, s]) => [name, [
      alert({ status: s, title: name + ' 알림' }),
      alert({ status: s, plain: true, title: name + ' 알림' }),
      alert({ status: s, title: name + ' 알림', desc: '한 줄 설명이 들어가는 자리예요.', close: true }),
    ]]), { wide: true, full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    status: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger', 'brand', 'neutral'], description: '상태 — `.alert--{상태}` (info 는 기본이라 클래스 없음). 위험만 role="alert"' },
    plain: { control: 'boolean', description: '테두리 없음 — `.alert--plain`' },
    title: { control: 'text', description: '제목 — `.alert__title` (굵게)' },
    desc: { control: 'text', description: '설명 — `.alert__desc` (12px, 비우면 없음)' },
    close: { control: 'boolean', description: '닫기 버튼 — `.alert__close` (아이콘 버튼 + aria-label)' },
  },
  args: { status: 'info', plain: false, title: '검색 결과는 최근 1년 문서만 보여요', desc: '기간을 바꾸면 더 오래된 문서도 볼 수 있어요.', close: false },
  render: (a) => stack([alert(a)]),
};
