// Overlay/Dropdown Menu: 문서 화면은 DropdownMenu.mdx. 버튼을 누르면 열리는 동작 목록(DS-ADR-056). 여닫기 · 키보드 = js/menu.js
import { matrix } from './_matrix.js';

const svg = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  chev: '<polyline points="6 9 12 15 18 9"></polyline>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"></path>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V4H4v12h4"></path>',
  rev: '<path d="M4 12a8 8 0 0 1 14-5.3M20 4v5h-5"></path><path d="M20 12a8 8 0 0 1-14 5.3M4 20v-5h5"></path>',
  del: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"></path>',
};
const ITEMS = [['편집', 'edit'], ['다른 이름으로 저장', 'copy'], ['개정', 'rev'], null, ['삭제', 'del', 'danger'], ['폐기', null, 'disabled']];
const item = ([t, ic, kind]) => '<button type="button" class="ui-menu__item' + (kind === 'danger' ? ' ui-menu__item--danger' : '') + '" role="menuitem" tabindex="-1"' + (kind === 'disabled' ? ' aria-disabled="true"' : '') + '>' + (ic ? svg(I[ic]) : '') + t + '</button>';
const list = (id, open) => '<div class="ui-menu__list" role="menu" id="' + id + '" aria-labelledby="' + id + '-btn"' + (open ? '' : ' hidden') + '>' +
  ITEMS.map((i) => (i ? item(i) : '<div class="ui-menu__divider" role="separator"></div>')).join('') + '</div>';
const menu = (id, open = false) => '<div class="ui-menu"><button type="button" class="btn btn--secondary btn--outlined" id="' + id + '-btn" aria-haspopup="menu" aria-expanded="' + open + '" aria-controls="' + id + '">작업 ' + svg(I.chev) + '</button>' + list(id, open) + '</div>';
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
