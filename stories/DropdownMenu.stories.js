// Overlay/Dropdown Menu: 문서 화면은 DropdownMenu.mdx. 버튼을 누르면 열리는 동작 목록(DS-ADR-056). 여닫기 · 키보드 = js/menu.js
import { matrix } from './_matrix.js';

const svg = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  chev: '<polyline points="6 9 12 15 18 9"></polyline>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"></path>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V4H4v12h4"></path>',
  rev: '<path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5"></path><path d="M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"></path>',
  del: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path>',
  doc: '<path d="M6 3h8l4 4v14H6z"></path><path d="M14 3v4h4"></path>',
  part: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"></path><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"></path>',
  change: '<path d="M4 7h13l-3-3M20 17H7l3 3"></path>',
  clip: '<path d="M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7"></path>',
  link: '<path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1"></path>',
};
const ITEMS = [['편집', 'edit'], ['다른 이름으로 저장', 'copy'], ['개정', 'rev'], null, ['삭제', 'del', 'danger'], ['폐기', null, 'disabled']];
const item = ([t, ic, kind]) => '<button type="button" class="ui-menu__item' + (kind === 'danger' ? ' ui-menu__item--danger' : '') + '" role="menuitem" tabindex="-1"' + (kind === 'disabled' ? ' aria-disabled="true"' : '') + '>' + (ic ? svg(I[ic]) : '') + t + '</button>';
const list = (id, open) => '<div class="ui-menu__list" role="menu" id="' + id + '" aria-labelledby="' + id + '-btn"' + (open ? '' : ' hidden') + '>' +
  ITEMS.map((i) => (i ? item(i) : '<div class="ui-menu__divider" role="separator"></div>')).join('') + '</div>';
const menu = (id, open = false) => '<div class="ui-menu"><button type="button" class="btn btn--secondary btn--outlined" id="' + id + '-btn" aria-haspopup="menu" aria-expanded="' + open + '" aria-controls="' + id + '">작업 ' + svg(I.chev) + '</button>' + list(id, open) + '</div>';
// 시안 B · 찾기와 묶음(DS-ADR-076): 항목이 많은 메뉴. 묶음 = [제목, [[이름, 아이콘, 단축키]]]
const GROUPS = [
  ['만들기', [['새 문서', 'doc', 'Shift+D'], ['새 부품', 'part', 'Shift+P'], ['새 변경 요청', 'change']]],
  ['붙이기', [['첨부 파일 추가', 'clip'], ['링크 추가', 'link']]],
];
const sItem = ([t, ic, key]) => '<button type="button" class="ui-menu__item" role="menuitem" tabindex="-1">' + svg(I[ic]) + t + (key ? '<span class="ui-menu__shortcut">' + key + '</span>' : '') + '</button>';
const searchList = (id, open) => '<div class="ui-menu__list" role="menu" id="' + id + '" aria-labelledby="' + id + '-btn"' + (open ? '' : ' hidden') + '>' +
  '<div class="ui-menu__search"><input type="search" class="input" aria-label="메뉴 항목 찾기" placeholder="메뉴 항목 찾기"></div>' +
  GROUPS.map(([g, its], k) => (k ? '<div class="ui-menu__divider" role="separator"></div>' : '') + '<div class="ui-menu__group-label" role="presentation">' + g + '</div>' + its.map(sItem).join('')).join('') +
  '<div class="ui-menu__empty" hidden>찾는 항목이 없습니다</div></div>';
const searchMenu = (id, open = false) => '<div class="ui-menu"><button type="button" class="btn btn--secondary btn--outlined" id="' + id + '-btn" aria-haspopup="menu" aria-expanded="' + open + '" aria-controls="' + id + '">새로 만들기 ' + svg(I.chev) + '</button>' + searchList(id, open) + '</div>';
const SEARCH_CODE = [
  '<div class="ui-menu">',
  '  <button type="button" class="btn btn--secondary btn--outlined" id="new-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="new">새로 만들기 ▾</button>',
  '  <div class="ui-menu__list" role="menu" id="new" aria-labelledby="new-btn" hidden>',
  '    <div class="ui-menu__search"><input type="search" class="input" aria-label="메뉴 항목 찾기" placeholder="메뉴 항목 찾기"></div>',
  '    <div class="ui-menu__group-label" role="presentation">만들기</div>',
  '    <button type="button" class="ui-menu__item" role="menuitem" tabindex="-1"><svg …/>새 문서<span class="ui-menu__shortcut">Shift+D</span></button>',
  '    <div class="ui-menu__divider" role="separator"></div>',
  '    <div class="ui-menu__group-label" role="presentation">붙이기</div>',
  '    <button type="button" class="ui-menu__item" role="menuitem" tabindex="-1"><svg …/>첨부 파일 추가</button>',
  '    <div class="ui-menu__empty" hidden>찾는 항목이 없습니다</div>',
  '  </div>',
  '</div>',
];
const note = (t) => '<span class="sb-note">' + t + '</span>';
const CODE = [
  '<script src="js/menu.js"></script>',
  '',
  '<div class="ui-menu">',
  '  <button type="button" class="btn btn--secondary btn--outlined" id="doc-act-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="doc-act">작업 ▾</button>',
  '  <div class="ui-menu__list" role="menu" id="doc-act" aria-labelledby="doc-act-btn" hidden>',
  '    <button type="button" class="ui-menu__item" role="menuitem" tabindex="-1"><svg …/>편집</button>',
  '    <div class="ui-menu__divider" role="separator"></div>',
  '    <button type="button" class="ui-menu__item ui-menu__item--danger" role="menuitem" tabindex="-1"><svg …/>삭제</button>',
  '    <button type="button" class="ui-menu__item" role="menuitem" tabindex="-1" aria-disabled="true">폐기</button>',
  '  </div>',
  '</div>',
];

export default {
  title: 'Overlay/Dropdown Menu',
  tags: ['!dev', '!autodocs', 'device-web'],   // 쓰는 기기 = PLM 웹 (DS-ADR-055). 모바일 앱은 Bottom Sheet
  parameters: { docs: { source: { language: 'html' } } },
};

let n = 0;
export const 예시 = {
  parameters: { docs: { source: { code: CODE.join('\n') } } },
  render: () => matrix(['눌러 보기', '열린 모습'], [
    ['미리보기', ['<div style="min-height:230px;text-align:left">' + menu('dm-live-' + (n++)) + '</div>', '<div style="min-height:230px;text-align:left">' + menu('dm-open-' + (n++), true) + '</div>']],
    ['쓰임', [note('누르거나 ↓ · Enter로 열면 첫 항목에 포커스가 갑니다<br>↑↓ · Home · End로 옮기고, Esc는 닫고 버튼으로 돌아갑니다'), note('항목을 누르면 바로 동작하고 목록이 닫힙니다<br>지우기처럼 되돌릴 수 없는 동작은 빨강 글자 · 맨 아래, 구분선으로 떼어 둡니다')]],
  ], { full: true }),
};

export const 시안_찾기와_묶음 = {
  parameters: { docs: { source: { code: SEARCH_CODE.join('\n') } } },
  render: () => matrix(['눌러 보기', '열린 모습'], [
    ['미리보기', ['<div class="sb-menu-stage">' + searchMenu('dm-sl-' + (n++)) + '</div>', '<div class="sb-menu-stage">' + searchMenu('dm-so-' + (n++), true) + '</div>']],
    ['쓰임', [note('열면 찾기 칸에 포커스가 갑니다<br>글자를 넣으면 맞는 항목만 남고, ↓로 첫 항목에 갑니다'), note('묶음 제목과 구분선으로 동작을 나눕니다<br>단축키가 있는 동작만 오른쪽에 단축키를 적습니다')]],
  ], { full: true }),
};
