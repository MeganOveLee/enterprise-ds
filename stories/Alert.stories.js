// Feedback/Alert — 문서 화면은 Alert.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

// 상태 아이콘 = Figma Icons 세트와 같은 모양(16 격자, 선 1) — info · check · alert-triangle · x-circle · x (TD-108 32번)
const svg = (d) => '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  info: '<circle cx="8" cy="8" r="5.56"/><path d="M8 8v2.22M8 5.78h.01"/>',
  success: '<path d="m3.56 8 2.77 2.78 6.11-6.11"/>',
  warning: '<path d="M7.05 3.48 2.35 11.33a1.11 1.11 0 0 0 .95 1.67h9.4a1.11 1.11 0 0 0 .95-1.67L8.95 3.48a1.11 1.11 0 0 0-1.9 0z"/><path d="M8 6.33v2.23M8 10.78h.01"/>',
  danger: '<circle cx="8" cy="8" r="5.56"/><path d="m6.33 6.33 3.34 3.34m0-3.34-3.34 3.34"/>',
  close: '<path d="m4.67 4.67 6.66 6.66m0-6.66-6.66 6.66"/>',
};
const ICON = { info: 'info', success: 'success', warning: 'warning', danger: 'danger', brand: 'info', neutral: 'info' };   // 브랜드 · 중립은 정보 아이콘
const ROLE = { danger: 'alert' };   // 바로 알려야 하는 것만 alert, 나머지는 status

// 줄 하나 — status: info · success · warning · danger · brand · neutral. list = 설명 안 목록(여러 건)
const alert = ({ status = 'info', title = '', desc = '', list = null, close = false, plain = false } = {}) =>
  '<div class="alert' + (status !== 'info' ? ' alert--' + status : '') + (plain ? ' alert--plain' : '') + '" role="' + (ROLE[status] || 'status') + '">' +
  '<span class="alert__icon">' + svg(I[ICON[status]]) + '</span>' +
  '<div class="alert__body">' + (title ? '<strong class="alert__title">' + title + '</strong>' : '') +
  (list ? '<div class="alert__desc"><ul>' + list.map((t) => '<li>' + t + '</li>').join('') + '</ul></div>' : desc ? '<span class="alert__desc">' + desc + '</span>' : '') + '</div>' +
  (close ? '<button type="button" class="btn btn--secondary btn--transparent btn--icon alert__close" aria-label="알림 닫기">' + svg(I.close) + '</button>' : '') +
  '</div>';
const stack = (items, w = '640px') => '<div style="display:flex;flex-direction:column;gap:8px;max-width:' + w + '">' + items.join('') + '</div>';

export default {
  title: 'Feedback/Alert',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Alert.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
const ddField = (label, id, err = '') => '<div class="form-grid-2" style="grid-template-columns:1fr"><div class="ff-field"><label class="search-label" for="' + id + '">' + label + '</label><div class="td">' +
  '<input class="input" id="' + id + '"' + (err ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '') + '>' + (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '') + '</div></div></div>';
export const 입력_확인 = {
  render: () => stack([alert({ status: 'danger', title: '필수 항목을 모두 입력해 주십시오' }), ddField('문서 명', 'al-v1', '문서 명을 입력해 주십시오')]),
};
export const 안내 = {
  render: () => stack([
    alert({ status: 'warning', title: '결재 중인 문서는 수정할 수 없습니다', desc: '결재가 끝나거나 회수한 뒤에 수정해 주십시오.' }),
    alert({ status: 'info', title: '검색 결과는 최근 1년 문서만 표시됩니다', desc: '기간을 바꾸면 이전 문서도 검색할 수 있습니다.' }),
  ]),
};
export const 결과 = {
  render: () => stack([alert({ status: 'success', title: '12건이 일괄 등록되었습니다' })]),
};
export const 공지 = {
  render: () => stack([alert({ status: 'brand', title: '결재선을 저장해 두고 다시 쓸 수 있습니다', close: true })]),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 12번 ① ② ③) ── 미리보기만, 코드는 위 예시 카드에
const col = (items) => '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px">' + items.join('') + '</div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // ① 쌓이는 알림은 Toast. Alert는 화면 안 자리에 남는 안내라 한 영역에 하나
    { title: '한 영역에 Alert 하나',
      do: [col([alert({ status: 'danger', title: '필수 항목 2개가 비어 있습니다', list: ['문서 명을 입력해 주십시오.', '문서 구분을 선택해 주십시오.'] })]),
        '알릴 내용이 여러 건이면 Alert 하나의 설명 안에 목록으로 모읍니다.'],
      dont: [col([alert({ status: 'danger', title: '문서 명을 입력해 주십시오' }), alert({ status: 'danger', title: '문서 구분을 선택해 주십시오' })]),
        'Alert를 여러 개 쌓으면 내용이 밀려 무엇부터 읽을지 알 수 없습니다.'] },
    // ② 상태 색 = 내용의 뜻(구성 「상태」 정의)
    { title: '상태 색은 내용과 맞춤',
      do: [col([alert({ status: 'danger', title: '저장하지 못했습니다', desc: '네트워크 연결을 확인한 뒤 다시 저장해 주십시오.' })]),
        '오류 · 실패는 위험(.alert--danger)으로 표시합니다.'],
      dont: [col([alert({ status: 'info', title: '저장하지 못했습니다', desc: '네트워크 연결을 확인한 뒤 다시 저장해 주십시오.' })]),
        '오류를 정보 색으로 두면 참고 안내처럼 보여 지나칩니다.'] },
    // ③ 오류는 해결할 때까지 남김
    { title: '오류 Alert에는 닫기 버튼 없음',
      do: [col([alert({ status: 'danger', title: '결재선이 지정되지 않았습니다', desc: '결재선을 지정한 뒤 다시 요청해 주십시오.' })]),
        '오류 Alert는 원인을 해결할 때까지 화면에 남겨 둡니다.'],
      dont: [col([alert({ status: 'danger', title: '결재선이 지정되지 않았습니다', desc: '결재선을 지정한 뒤 다시 요청해 주십시오.', close: true })]),
        '닫기 버튼이 있으면 원인을 해결하지 않고 오류만 닫을 수 있습니다.'] },
  ]),
};

// ── 전체 상태 — 행 = 상태, 열 = 모양 ── 오류(위험)에는 닫기 버튼을 두지 않음(Do · Don't ③)
const STATES = [['정보', 'info'], ['성공', 'success'], ['경고', 'warning'], ['위험', 'danger'], ['브랜드', 'brand'], ['중립', 'neutral']];
export const 전체_상태 = {
  render: () => matrix(['테두리 (기본)', '테두리 없음 (.alert--plain)', '설명 · 닫기'],
    STATES.map(([name, s]) => [name, [
      alert({ status: s, title: name + ' 알림' }),
      alert({ status: s, plain: true, title: name + ' 알림' }),
      alert({ status: s, title: name + ' 알림', desc: '설명은 14px Regular로 씁니다.', close: s !== 'danger' }),
    ]]), { wide: true, full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    status: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger', 'brand', 'neutral'], description: '상태 — `.alert--{상태}` (info 는 기본이라 클래스 없음). 위험만 role="alert"' },
    plain: { control: 'boolean', description: '테두리 없음 — `.alert--plain`' },
    title: { control: 'text', description: '제목 — `.alert__title` (16px SemiBold)' },
    desc: { control: 'text', description: '설명 — `.alert__desc` (14px Regular, 비우면 없음)' },
    close: { control: 'boolean', description: '닫기 버튼 — `.alert__close` (아이콘 버튼 28 + aria-label). 위험에는 두지 않음' },
  },
  args: { status: 'info', plain: false, title: '검색 결과는 최근 1년 문서만 표시됩니다', desc: '기간을 바꾸면 이전 문서도 검색할 수 있습니다.', close: false },
  render: (a) => stack([alert(a)]),
};
