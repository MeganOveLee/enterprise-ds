// Feedback/Toast — 문서 화면은 Toast.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태 · Playground
// 제품에서 .toast-region 은 화면 오른쪽 아래에 고정(position: fixed). 문서에서는 정해진 크기의 틀 오른쪽 아래에 그림
import { matrix } from './_matrix.js';
import { doDont } from './_dodont.js';

// 상태 아이콘 = Alert와 같은 Figma Icons 모양(16 격자, 선 1)
const svg = (d) => '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  info: '<circle cx="8" cy="8" r="5.56"/><path d="M8 8v2.22M8 5.78h.01"/>',
  success: '<path d="m3.56 8 2.77 2.78 6.11-6.11"/>',
  warning: '<path d="M7.05 3.48 2.35 11.33a1.11 1.11 0 0 0 .95 1.67h9.4a1.11 1.11 0 0 0 .95-1.67L8.95 3.48a1.11 1.11 0 0 0-1.9 0z"/><path d="M8 6.33v2.23M8 10.78h.01"/>',
  danger: '<circle cx="8" cy="8" r="5.56"/><path d="m6.33 6.33 3.34 3.34m0-3.34-3.34 3.34"/>',
  close: '<path d="m4.67 4.67 6.66 6.66m0-6.66-6.66 6.66"/>',
};

// 토스트 하나 — status: info · success · warning · danger. 위험만 role="alert"(나머지는 영역의 status 가 읽음). title = 선택(제목 줄)
const toast = ({ status = 'info', title = '', msg = '', action = '', close = true } = {}) =>
  '<div class="toast' + (status !== 'info' ? ' toast--' + status : '') + '"' + (status === 'danger' ? ' role="alert"' : '') + '>' +
  '<span class="toast__icon">' + svg(I[status]) + '</span>' +
  (title ? '<div class="toast__body"><strong class="toast__title">' + title + '</strong><span class="toast__msg">' + msg + '</span></div>' : '<span class="toast__msg">' + msg + '</span>') +
  (action ? '<button type="button" class="btn btn--secondary btn--transparent toast__action">' + action + '</button>' : '') +
  (close ? '<button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="알림 닫기">' + svg(I.close) + '</button>' : '') +
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
  render: () => stage([toast({ status: 'success', msg: '저장되었습니다.' })], 120),
};
export const 동작이_있는_알림 = {
  render: () => stage([
    toast({ status: 'success', msg: '문서 3건이 결재 요청되었습니다.', action: '보기' }),
    toast({ status: 'danger', msg: '저장하지 못했습니다. 네트워크 연결을 확인해 주십시오.', action: '다시 시도' }),
  ], 230),
};
export const 제목_줄 = {
  render: () => stage([toast({ status: 'success', title: '결재 요청 완료', msg: '문서 3건이 결재 요청되었습니다.', action: '보기' })], 150),
};
export const 쌓임 = {
  render: () => stage([
    toast({ status: 'success', msg: '문서가 저장되었습니다.' }),
    toast({ status: 'success', msg: '첨부 파일 2개가 업로드되었습니다.' }),
    toast({ status: 'success', msg: '결재가 요청되었습니다.' }),
  ], 260),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 17번 ① ② ③) ── 미리보기만, 코드는 위 예시 카드에
const col = (items) => '<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px">' + items.join('') + '</div>';
const field = (id, err = '') => '<div class="form-grid-2" style="grid-template-columns:1fr;align-self:stretch"><div class="ff-field"><label class="search-label" for="' + id + '">문서 명</label><div class="td">' +
  '<input class="input" id="' + id + '"' + (err ? ' aria-invalid="true" aria-describedby="' + id + '-err"' : '') + '>' + (err ? '<span class="field-error-msg" id="' + id + '-err">' + err + '</span>' : '') + '</div></div></div>';
const DOCS = ['DOC-2610-0011', 'DOC-2610-0012', 'DOC-2610-0013'];
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // ① 입력 오류 = 필드에 빨간 테두리 + 오류 문구(Input 문서와 같은 표시)
    { title: '입력 오류는 필드에 표시',
      do: [col([field('dd-ts-nm', '문서 명을 입력해 주십시오')]),
        '입력 오류는 그 필드에 빨간 테두리와 오류 문구를 함께 표시합니다.'],
      dont: [col([field('dd-ts-nm2'), toast({ status: 'danger', msg: '문서 명을 입력해 주십시오.' })]),
        '토스트는 사라지고 어느 필드인지 가리키지 않아 고칠 곳을 찾기 어렵습니다.'] },
    // ② 일괄 처리 = 건수를 적은 토스트 하나
    { title: '일괄 처리 결과는 토스트 하나',
      do: [col([toast({ status: 'success', msg: '문서 3건이 결재 요청되었습니다.' })]),
        '여러 건을 한 번에 처리한 결과는 건수를 적은 토스트 하나로 알립니다.'],
      dont: [col(DOCS.map((n) => toast({ status: 'success', msg: n + ' 문서가 결재 요청되었습니다.' }))),
        '건마다 토스트를 띄우면 쌓여서 화면을 가리고 결과를 세기 어렵습니다.'] },
    // ③ 한두 줄 — 사라지기 전에 읽을 수 있는 길이
    { title: '문장은 한두 줄',
      do: [col([toast({ status: 'success', msg: '저장되었습니다.' })]),
        '방금 한 동작의 결과만 한두 줄로 적습니다.'],
      dont: [col([toast({ status: 'success', msg: '저장되었습니다. 결재선은 팀장 → 부서장 순서이고 첨부 파일 2개가 함께 저장되었으며, 결재 요청은 목록 화면의 [결재 요청]에서 할 수 있습니다.' })]),
        '긴 설명은 사라지기 전에 다 읽을 수 없습니다. 화면에 남길 내용은 Alert로 둡니다.'] },
  ]),
};

// ── 전체 상태 — 행 = 상태, 열 = 구성 ──
const STATES = [['정보', 'info'], ['성공', 'success'], ['경고', 'warning'], ['위험', 'danger']];
export const 전체_상태 = {
  render: () => matrix(['문구 + 닫기', '제목 + 두 줄 문구 + 동작 버튼'],
    STATES.map(([name, s]) => [name, [
      toast({ status: s, msg: name + ' 알림' }),
      toast({ status: s, title: name + ' 알림', msg: '글이 길면 줄을 바꿔 두 줄로 표시합니다.', action: '보기' }),
    ]]), { full: true }),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    status: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'], description: '상태 — `.toast--{상태}` (info 는 기본이라 클래스 없음). 아이콘 색만 바뀜' },
    title: { control: 'text', description: '제목 — `.toast__title` (선택, 비우면 없음. 있으면 `.toast__body`로 문구와 묶음)' },
    msg: { control: 'text', description: '문구 — `.toast__msg`' },
    action: { control: 'text', description: '동작 버튼 — `.btn.btn--secondary.btn--transparent.toast__action` (비우면 없음)' },
    close: { control: 'boolean', description: '닫기 버튼 (아이콘 버튼 28 + aria-label)' },
  },
  args: { status: 'success', title: '', msg: '저장되었습니다.', action: '', close: true },
  render: (a) => stage([toast(a)], 150),
};
