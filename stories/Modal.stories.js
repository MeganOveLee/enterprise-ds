// Overlay/Modal — 문서 화면은 Modal.mdx. Figma 이름 = Modal(🗣️ Feedback Components 4060:886), DS 클래스 = .modal
// 같은 페이지 위에 뜨는 확인 창. 열기 · 닫기 · 포커스 가두기 · Esc = js/modal.js(.storybook/preview-head.html 에서 일반 스크립트로 불러옴)
// 견본은 크기를 정한 틀(frame) 안에 그림 — 틀에 transform 을 두면 position: fixed 인 덮개가 화면 전체가 아니라 틀 안만 덮음
// 늘 열려 있는 견본(정지 그림)은 문서 화면을 막지 않도록 aria-modal 을 빼고 그림. 실제 마크업(aria-modal · hidden)은 「코드 보기」
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  minus: '<path d="M6 12h12"/>',
};
const btn = (t, cls, attrs = '') => '<button type="button" class="btn ' + cls + '"' + attrs + '>' + t + '</button>';

// ── 확인 창 조각 ──
const TEXT = { title: '저장하지 않은 내용이 있습니다', desc: '저장하지 않고 나가면 바뀐 내용이 사라집니다.' };
// 버튼 3개 — 순서 [저장 안 함] [취소] [저장], 열 때 포커스 = [취소] (TD-108 1번 A · 2번). ps = 정지 그림용 상태 클래스
const FOOT = (ps = {}) =>
  btn('저장 안 함', 'btn--destructive btn--outlined' + (ps.discard || ''), ' data-modal-close="discard"') +
  btn('취소', 'btn--secondary btn--transparent' + (ps.cancel || ''), ' data-modal-close="cancel" data-modal-initial') +
  btn('저장', 'btn--primary btn--filled' + (ps.save || ''), ' data-modal-close="save"');
const CLOSE = (ps = '') => '<button type="button" class="btn btn--secondary btn--transparent btn--icon' + ps + '" data-modal-close="cancel" aria-label="닫기">' + svg(I.close, 16) + '</button>';
// 창(.modal__dialog) — live = 실제로 여닫는 창(aria-modal), 아니면 정지 그림
const dialog = ({ id, title = TEXT.title, desc = TEXT.desc, close = true, foot = FOOT(), live = false, style = '' }) =>
  '<div class="modal__dialog" role="dialog"' + (live ? ' aria-modal="true"' : '') + ' aria-labelledby="' + id + '-title" aria-describedby="' + id + '-desc"' + (style ? ' style="' + style + '"' : '') + '>' +
  '<div class="modal__header"><h2 class="modal__title" id="' + id + '-title">' + title + '</h2>' + (close ? CLOSE() : '') + '</div>' +
  '<div class="modal__body"><p id="' + id + '-desc">' + desc + '</p></div>' +
  '<div class="modal__footer">' + foot + '</div></div>';
const modal = (o) => '<div class="modal" id="' + o.id + '"' + (o.live ? ' hidden' : '') + '>' + dialog(o) + '</div>';

// 「코드 보기」 — 실제로 쓰는 마크업(닫힌 상태 · aria-modal)
const CODE = ({ title = TEXT.title, desc = TEXT.desc, close = true } = {}) => [
  '<!-- 여는 버튼: 바뀐 내용이 있을 때 화면 스크립트가 window.modalOpen(\'unsaved-modal\', 이 버튼) — 또는 data-modal-open="unsaved-modal" -->',
  '<div class="modal" id="unsaved-modal" hidden>',
  '  <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="unsaved-modal-title" aria-describedby="unsaved-modal-desc">',
  '    <div class="modal__header">',
  '      <h2 class="modal__title" id="unsaved-modal-title">' + title + '</h2>',
  close ? '      <button type="button" class="btn btn--secondary btn--transparent btn--icon" data-modal-close="cancel" aria-label="닫기"><svg …/></button>' : null,
  '    </div>',
  '    <div class="modal__body"><p id="unsaved-modal-desc">' + desc + '</p></div>',
  '    <div class="modal__footer">',
  '      <button type="button" class="btn btn--destructive btn--outlined" data-modal-close="discard">저장 안 함</button>',
  '      <button type="button" class="btn btn--secondary btn--transparent" data-modal-close="cancel" data-modal-initial>취소</button>',
  '      <button type="button" class="btn btn--primary btn--filled" data-modal-close="save">저장</button>',
  '    </div>',
  '  </div>',
  '</div>',
  '<script>',
  '  document.getElementById(\'unsaved-modal\').addEventListener(\'modal:close\', (e) => {',
  '    // e.detail.action = \'discard\'(저장 안 함) · \'cancel\'(취소 · Esc · 닫기) · \'save\'(저장)',
  '  });',
  '</script>',
].filter((l) => l !== null).join('\n');

// ── 뒤 화면 — 등록 창(Popup Window) 한 장. 확인 창은 이 창의 닫기를 누를 때 뜸 ──
const field = (label, control, id, col2 = false) =>
  '<div class="ff-field' + (col2 ? ' col-2' : '') + '"><label class="search-label" for="' + id + '">' + label + '</label><div class="td">' + control + '</div></div>';
const registerWindow = (u, { live = false } = {}) =>
  '<div class="pop" style="height:100%;min-width:0">' +
  '<div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.doc, 16) + '</span><h3>문서 등록</h3></div>' +
  '<div class="top-btn-area">' + btn('임시 저장', 'btn--secondary btn--outlined') + btn('등록', 'btn--primary btn--filled') +
  '<button type="button" class="pop-close" aria-label="닫기"' + (live ? ' data-demo-close="' + u + '"' : '') + '>' + svg(I.close, 16) + '</button></div></div>' +
  '<div class="contents"><div class="seach_arm"><div class="leftbt"><button type="button" class="section-toggle" aria-expanded="true" aria-label="기본 정보 접기">' + svg(I.minus, 16) + '</button><h4>기본 정보</h4></div></div>' +
  '<div class="pro_table"><div class="form-grid-2">' +
  field('문서 명', '<input class="input" id="' + u + '-name" value="브레이크 캘리퍼 조립 사양서" data-saved="" placeholder="문서 명 입력">', u + '-name') +
  field('작업현황', '<select class="select" id="' + u + '-state"><option>작업 중</option><option>검토 중</option></select>', u + '-state') +
  field('설명', '<textarea class="textarea" id="' + u + '-desc" rows="3" data-saved="" placeholder="문서의 목적 · 변경 내용 입력">조립 순서와 체결 토크 기준</textarea>', u + '-desc', true) +
  '</div></div></div></div>';

// 틀 — 제품의 창 한 장 크기. transform 으로 덮개(fixed)를 틀 안에 가둠
const frame = (inner, h = 400) =>
  '<div style="position:relative;max-width:760px;height:' + h + 'px;overflow:hidden;transform:translateZ(0);border:1px solid var(--color-border-base);border-radius:var(--radius-card)">' + inner + '</div>';

let uid = 0;   // 한 문서 화면에 같은 견본이 여러 번 그려질 수 있어 id 를 겹치지 않게
const next = () => 'mdl' + (++uid);

export default {
  title: 'Overlay/Modal',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Modal.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
// 정지 그림 — 등록 창 위에 확인 창이 열린 모습. 열린 직후라 포커스가 [취소]에 있음
export const 저장하지_않고_나가기 = {
  parameters: { docs: { source: { code: CODE() } } },
  render: () => {
    enablePseudo();
    const u = next();
    return frame(registerWindow(u) + modal({ id: u + '-modal', foot: FOOT({ cancel: ' ps-focus-visible' }) }), 400);
  },
};

// 직접 열어 보기 — 등록 창의 닫기를 누르면 바뀐 내용이 있을 때만 확인 창을 엶. 고른 버튼은 아래 줄에 표시
const RESULT = {
  discard: '[저장 안 함] — 저장하지 않고 등록 창을 닫습니다.',
  cancel: '[취소] — 확인 창만 닫고 등록 창으로 돌아갑니다. 입력한 내용은 그대로입니다.',
  save: '[저장] — 저장한 뒤 등록 창을 닫습니다.',
};
let demoReady = false;
const wireDemo = () => {
  if (demoReady) return;
  demoReady = true;
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-demo-close]');
    if (!b) return;
    const u = b.getAttribute('data-demo-close');
    const box = document.getElementById(u + '-box');
    const out = document.getElementById(u + '-out');
    const dirty = box && Array.from(box.querySelectorAll('[data-saved]')).some((el) => el.value !== el.getAttribute('data-saved'));
    if (dirty && window.modalOpen) window.modalOpen(u + '-modal', b);
    else if (out) out.textContent = '바뀐 내용이 없어 확인 창 없이 등록 창을 닫습니다(견본에서는 닫지 않습니다).';
  });
  document.addEventListener('modal:close', (e) => {
    const out = document.getElementById(e.target.id.replace(/-modal$/, '') + '-out');
    if (out) out.textContent = RESULT[e.detail.action] || '';
  });
};
export const 직접_열어_보기 = {
  parameters: { docs: { source: { code: CODE() } } },
  render: () => {
    wireDemo();
    const u = next();
    return '<div id="' + u + '-box">' + frame(registerWindow(u, { live: true }) + modal({ id: u + '-modal', live: true }), 400) +
      '<p class="sb-note" id="' + u + '-out" role="status" style="margin:8px 0 0;min-height:1.6em"></p></div>';
  },
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108) — 미리보기만. 창만 그림(덮개 없이) ──
const mini = (o) => dialog({ id: next(), style: 'width:100%;margin:0;align-self:flex-start;box-shadow:none', ...o });   // 위 정렬(가운데 맞춤 margin:auto 를 풂) — 두 칸 높이가 달라도 창 위치가 맞게
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: Polaris Modal · KRDS 모달 · Cloudscape Unsaved changes — 버튼 이름은 「확인 · 예」 대신 동작 이름
    { title: '버튼 이름은 누르면 일어나는 동작으로',
      do: [mini({}), '[저장 안 함] · [저장]처럼 누르면 일어나는 일을 버튼 이름으로 씁니다. 제목을 다시 읽지 않아도 고를 수 있습니다.'],
      dont: [mini({ foot: btn('아니요', 'btn--destructive btn--outlined') + btn('취소', 'btn--secondary btn--transparent') + btn('예', 'btn--primary btn--filled') }),
        '[예] · [아니요]는 제목이 질문이 아니면 무엇에 답하는지 알 수 없습니다.'] },
    // 근거: 구성 「본문」 · Popup Window(등록 · 상세 = 새 창) · js/modal.js(Esc = 취소)
    { title: '확인 창에는 확인할 문장과 버튼만',
      do: [mini({ title: '문서를 삭제하시겠습니까?', desc: '삭제한 문서는 되돌릴 수 없습니다.', foot: btn('취소', 'btn--secondary btn--transparent') + btn('삭제', 'btn--destructive btn--outlined') }),
        '본문은 한두 문장으로 씁니다. 입력이 필요한 등록 · 수정은 Popup Window로 엽니다.'],
      dont: [mini({ title: '문서를 삭제하시겠습니까?', desc: '<label class="search-label" style="display:block;margin-bottom:4px">삭제 사유</label><textarea class="textarea" rows="2" aria-label="삭제 사유" style="width:100%"></textarea>',
        foot: btn('취소', 'btn--secondary btn--transparent') + btn('삭제', 'btn--destructive btn--outlined') }),
        '확인 창에 입력 필드를 두면 Esc · 닫기로 창이 닫힐 때 입력한 내용이 함께 사라집니다.'] },
  ]),
};

// ── 전체 상태 — 창 안의 버튼(닫기 · 푸터 버튼 3개). 모양 · 상태는 Button 과 같음 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { code: '<!-- 닫기 = .btn--secondary.btn--transparent.btn--icon · 푸터 = [저장 안 함] destructive outlined · [취소] secondary transparent · [저장] primary filled. Hovered · Focused 는 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    const row = (x) => [CLOSE(x), btn('저장 안 함', 'btn--destructive btn--outlined' + x), btn('취소', 'btn--secondary btn--transparent' + x), btn('저장', 'btn--primary btn--filled' + x)];
    return matrix(['닫기', '저장 안 함', '취소', '저장'], [
      ['Default', row('')],
      ['Hovered', row(' ps-hover')],
      ['Pressed', row(' ps-active')],
      ['Focused', row(' ps-focus-visible')],
    ]);
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    title: { control: 'text', description: '제목 — `.modal__title` (aria-labelledby). 짧은 상태 문장 또는 질문' },
    description: { control: 'text', description: '본문 — `.modal__body p` (aria-describedby). 한두 문장' },
    close: { control: 'boolean', description: '닫기 버튼(✕) — `.btn--icon` · `data-modal-close="cancel"`. 누르면 [취소]와 같음' },
  },
  args: { title: TEXT.title, description: TEXT.desc, close: true },
  parameters: { docs: { source: { transform: (_, { args }) => CODE({ title: args.title, desc: args.description, close: args.close }) } } },
  render: (a) => {
    const u = next();
    return frame(registerWindow(u) + modal({ id: u + '-modal', title: a.title, desc: a.description, close: a.close }), 400);
  },
};
