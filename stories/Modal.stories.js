// Overlay/Modal — 문서 화면은 Modal.mdx. Figma 이름은 Modal, DS 클래스는 .pop(팝업 창)
// 제품은 상세 · 등록 화면을 새 창으로 띄우고, .pop 이 그 창 한 장을 채우는 틀(높이 100vh · 내용이 넘치면 창 안에서 스크롤)
// 같은 페이지 위에 띄우는 대화 상자(덮개 · 포커스 가두기 · role="dialog")는 DS에 아직 없음 — Screens 문서 등록 화면의 덮개는 화면 보조 CSS
// 여기서는 창 크기를 정해 둔 틀(win) 안에 .pop 을 그림. 높이만 틀에 맞추고(100vh → 100%) 나머지 규칙은 DS 그대로
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
const btn = (t, cls) => '<button type="button" class="btn ' + cls + '">' + t + '</button>';

// ── 조각 ──
const top = ({ title = '문서 상세', version = 'A.2', buttons = '' } = {}) =>
  '<div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.doc, 16) + '</span><h3>' + title + '</h3>' +
  (version ? '<span class="version">' + version + '</span>' : '') + '</div>' +
  '<div class="top-btn-area">' + buttons + '<button type="button" class="pop-close" aria-label="닫기">' + svg(I.close, 14) + '</button></div></div>';
const TABS = ['기본 정보', '첨부 파일', '결재 이력'];
const tabs = (list = TABS) =>
  '<div class="tab"><ul role="tablist" aria-label="문서 상세">' +
  list.map((t, i) => '<li role="tab" tabindex="' + (i ? -1 : 0) + '" aria-selected="' + !i + '"' + (i ? '' : ' class="is-active"') + '>' + t + '</li>').join('') + '</ul></div>';
const DL = [['문서 번호', 'DOC-2610-0013'], ['버전', 'A.2'], ['문서 명', '브레이크 캘리퍼 조립 사양서', 3], ['작업현황', '검토 중'], ['담당자', '김도윤 · 설계1팀'], ['등록일', '2026-10-06'], ['수정일', '2026-10-13']];
const FILES = [['캘리퍼 조립 사양서_A.2.pdf', '2.4 MB'], ['체결 토크 시험 결과.xlsx', '318 KB'], ['조립도_BRK-20417.dwg', '5.1 MB']];
const fileItem = ([n, size], x = '') => '<li>' + svg(I.file, 14) + '<span class="file-name">' + n + '</span><span class="file-size">' + size + '</span>' +
  '<button type="button" class="file-dl' + x + '" aria-label="' + n + ' 내려받기">' + svg(I.down, 14) + '</button></li>';
const files = (list = FILES) => '<ul class="file-download-list">' + list.map((f) => fileItem(f)).join('') + '</ul>';
// 값 보기 — 라벨 · 값 두 쌍이 한 줄, 첨부 목록도 한 줄 전체(dd.span-3)로
const dl = () => '<div class="pro_table"><dl class="detail-dl">' +
  DL.map(([k, v, span]) => '<dt>' + k + '</dt><dd' + (span ? ' class="span-3"' : '') + '>' + v + '</dd>').join('') +
  '<dt>첨부 파일</dt><dd class="span-3">' + files() + '</dd></dl></div>';

// 상세 창 — 제목 줄 + 탭 + 내용(.contents) = 값 보기 · 첨부 목록
const viewPop = ({ title, version, withTabs = true } = {}) =>
  top({ title, version, buttons: btn('수정', 'btn--secondary btn--outlined') + btn('개정', 'btn--secondary btn--outlined') }) +
  (withTabs ? tabs() : '') +
  '<div class="contents">' + dl() + '</div>';

// 등록 창 — 탭 없음. 제목 줄 버튼 = 임시 저장 · 등록, 내용(.product) = 라벨 위 폼 (Input 문서와 같은 칸)
const field = (label, control, { req = false, id = '', col2 = false } = {}) =>
  '<div class="ff-field' + (col2 ? ' col-2' : '') + '"><label class="search-label"' + (id ? ' for="' + id + '"' : '') + '>' + label +
  (req ? '<span class="required" aria-hidden="true"></span>' : '') + '</label><div class="td">' + control + '</div></div>';
let uid = 0;   // 한 문서 화면에 등록 창이 두 번 그려질 수 있어 라벨 · 칸 id 를 겹치지 않게
const registerPop = ({ title = '문서 등록' } = {}, u = 'mdl' + (++uid)) =>
  top({ title, version: '', buttons: btn('임시 저장', 'btn--secondary btn--outlined') + btn('등록', 'btn--primary btn--filled') }) +
  '<div class="product"><div class="pro_table"><div class="form-grid-2">' +
  field('문서 분류', '<div class="ff-readonly">/제품 문서/설계 문서/사양서</div>') +
  field('문서 번호', '<div class="ff-readonly">저장하면 자동으로 매겨집니다</div>') +
  field('문서 명', '<input class="input" id="' + u + '-name" aria-required="true" placeholder="문서 명 입력">', { req: true, id: u + '-name' }) +
  field('작업현황', '<select class="select" id="' + u + '-state"><option>작업 중</option><option>검토 중</option></select>', { id: u + '-state' }) +
  field('설명', '<textarea class="textarea" id="' + u + '-desc" rows="3" placeholder="문서의 목적 · 변경 내용을 적어 주세요"></textarea>', { id: u + '-desc', col2: true }) +
  '</div></div></div>';

// 창 크기를 정한 틀 — 제품의 새 창 한 장. 좁은 화면에서는 틀 안에서 가로로 밀림(.pop 최소 폭 600)
const win = (inner, h = 440) =>
  '<div style="max-width:760px;height:' + h + 'px;overflow-x:auto;overflow-y:hidden;border:1px solid var(--color-border-base);border-radius:var(--radius-card)">' +
  '<div class="pop" style="height:100%">' + inner + '</div></div>';

export default {
  title: 'Overlay/Modal',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Modal.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 상세_창 = {
  parameters: { docs: { source: { code: '<div class="pop">\n  ' + viewPop() + '\n</div>' } } },
  render: () => win(viewPop()),
};
export const 등록_창 = {
  parameters: { docs: { source: { code: '<div class="pop">\n  ' + registerPop() + '\n</div>' } } },
  render: () => win(registerPop(), 400),
};

// ── 전체 상태 — 창 안의 아이콘 버튼 두 개 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 닫기 · 내려받기 = 아이콘 버튼. aria-label 로 이름을 붙임 · Hovered · Focused 는 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    const close = (x) => '<button type="button" class="pop-close' + x + '" aria-label="닫기">' + svg(I.close, 14) + '</button>';
    const dlBtn = (x) => '<ul class="file-download-list" style="width:72px"><li style="justify-content:center;border:0;background:transparent;padding:0">' +
      '<button type="button" class="file-dl' + x + '" aria-label="내려받기">' + svg(I.down, 14) + '</button></li></ul>';
    return matrix(['닫기', '내려받기'], [
      ['Default', [close(''), dlBtn('')]],
      ['Hovered', [close(' ps-hover'), dlBtn(' ps-hover')]],
      ['Focused', [close(' ps-focus-visible'), dlBtn(' ps-focus-visible')]],
    ]);
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    kind: { control: 'inline-radio', options: ['상세', '등록'], description: '창 종류 — 제목 줄 버튼과 내용이 바뀜' },
    title: { control: 'text', description: '창 제목 — `.top-title-area h3`' },
    version: { control: 'text', description: '버전 칩 — `.version` (비우면 없음, 상세 창만)' },
    withTabs: { control: 'boolean', description: '탭 줄 — `.tab` (상세 창만)' },
    height: { control: { type: 'range', min: 280, max: 640, step: 20 }, description: '틀 높이 — 내용이 넘치면 창 안에서 스크롤, 제목 줄은 위에 붙어 있음' },
  },
  args: { kind: '상세', title: '문서 상세', version: 'A.2', withTabs: true, height: 440 },
  parameters: { docs: { source: { transform: (_, { args }) => '<div class="pop">\n  ' + (args.kind === '등록' ? registerPop(args) : viewPop(args)) + '\n</div>' } } },
  render: (a) => win(a.kind === '등록' ? registerPop(a) : viewPop(a), a.height),
};
