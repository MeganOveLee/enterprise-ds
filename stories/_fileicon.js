// 그림 자산(DS-ADR-037) — 첨부 파일 형식 아이콘 · 폴더 트리 아이콘. 두 모양(솔리드 · 라인)을 함께 내고,
// 어느 쪽이 보일지는 브랜드 파일 토큰(--art-solid · --art-line)이 정한다. 두 svg 모두 aria-hidden — 뜻은 옆 파일 이름 · 폴더 이름이 맡음

// ── 첨부 파일 형식 아이콘 ── 파일 이름(또는 확장자)을 받아 형식마다 색 + 형식 글자
// 상세 창 첨부 목록(.file-download-list) · 등록 창 업로더(.resumable) · 홈 최근 문서가 같이 씀
// 색은 DS .file-icon--<형식>(components.css). 표에 없는 형식 = 흐린 회색 FILE
//   솔리드 = 종이 + 색 띠, 띠 안 형식 글자는 종이색(--color-bg-base)으로 뚫음 — 다크에서 띠가 밝아져도 읽힘
//   라인   = Figma Icons 「file」 윤곽(아래는 열어 둠) + 아래에 형식 글자(형식 색)
const TYPES = {
  pdf: ['pdf', 'PDF'],
  xls: ['xls', 'XLS'], xlsx: ['xls', 'XLS'], csv: ['xls', 'XLS'],
  doc: ['doc', 'DOC'], docx: ['doc', 'DOC'],
  ppt: ['ppt', 'PPT'], pptx: ['ppt', 'PPT'],
  dwg: ['dwg', 'DWG'],
  zip: ['zip', 'ZIP'],
};
const label = (text, x, y, fill) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="5" font-weight="700" font-family="Arial, sans-serif" style="fill:' + fill + '">' + text + '</text>';
const fileSolid = (text) => '<svg class="ds-art__solid" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
  '<path d="M4.5 1.5h7.5l4 4v12.2a.8.8 0 0 1-.8.8H4.5a.8.8 0 0 1-.8-.8V2.3a.8.8 0 0 1 .8-.8z" stroke-width="1.2" style="fill:var(--color-bg-base);stroke:currentColor"/>' +
  '<path d="M12 1.5v4h4" fill="none" stroke-width="1.2" style="stroke:currentColor"/>' +
  '<rect x="1.5" y="9.6" width="13.6" height="6.4" rx="1.2" style="fill:currentColor"/>' +
  label(text, 8.3, 14.5, 'var(--color-bg-base)') + '</svg>';
// 윤곽 = Figma Icons file(20 격자 · 선 1.25)의 가운데 선. 형식 글자 자리만큼 아래를 열어 둠
const fileLine = (text) => '<svg class="ds-art__line" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
  '<path d="M4.44 12V4.44a1.39 1.39 0 0 1 1.39-1.39h4.86l4.87 4.87V12M10.69 3.05v4.87h4.87" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>' +
  label(text, 10, 17.3, 'currentColor') + '</svg>';

export const fileIcon = (name) => {
  const ext = String(name).toLowerCase().split('.').pop();
  const [type, text] = TYPES[ext] || ['file', 'FILE'];
  return '<span class="file-icon file-icon--' + type + ' ds-art">' + fileSolid(text) + fileLine(text) + '</span>';
};

// ── 폴더 트리 아이콘 ── 색 = .tree__icon 글자색(--color-icon-warning), 두 모양 같은 색
//   솔리드 = Figma 「solid/folder」 · 「solid/folder-open」 모양(뒤판 옅게 0.55 + 앞판, 열리면 종이 한 장 = 종이색)
//   라인   = Figma Icons 「folder」(20 격자 · 선 1.25), 열림 = lucide folder-open(24 격자 · 선 1.5 = 같은 굵기)
const FOLDER_BACK = 'M5.29 4.3a.86.86 0 0 0-.74-.46H2.59a.83.83 0 0 0-.83.83v11.52c0 .45.37.83.83.83h14c.46 0 .82-.38.82-.83V6.32a.83.83 0 0 0-.82-.83H6.38a.86.86 0 0 1-.73-.46z';
const FOLDER_FRONT = 'M2.52 7.9l-.68 8.23c-.04.48.34.9.82.9h14.01c.43 0 .78-.33.82-.76l.69-8.23a.83.83 0 0 0-.82-.9H3.33a.82.82 0 0 0-.81.76z';
const FOLDER_OPEN_FRONT = 'M4.33 10.05l-2.5 6.08c-.18.47.17.9.66.9h14.01c.35 0 .67-.21.79-.54l1.87-5.76a.82.82 0 0 0-.69-1.01H5a.8.8 0 0 0-.67.33z';
const FOLDER_LINE = 'M3.02 3.71C3.4 3.34 3.91 3.13 4.44 3.13H7.92C8.13 3.13 8.32 3.23 8.44 3.4L9.64 5.21H15.56C16.09 5.21 16.6 5.42 16.98 5.8C17.36 6.18 17.57 6.69 17.57 7.22V14.86C17.57 15.4 17.36 15.91 16.98 16.29C16.6 16.66 16.09 16.88 15.56 16.88H4.44C3.91 16.88 3.4 16.66 3.02 16.29C2.64 15.91 2.43 15.4 2.43 14.86V5.14C2.43 4.6 2.64 4.09 3.02 3.71ZM4.44 4.38C4.24 4.38 4.05 4.46 3.9 4.6C3.76 4.74 3.68 4.94 3.68 5.14V14.86C3.68 15.06 3.76 15.26 3.9 15.4C4.05 15.54 4.24 15.63 4.44 15.63H15.56C15.76 15.63 15.95 15.54 16.1 15.4C16.24 15.26 16.32 15.06 16.32 14.86V7.22C16.32 7.02 16.24 6.83 16.1 6.68C15.95 6.54 15.76 6.46 15.56 6.46H9.31C9.1 6.46 8.9 6.35 8.79 6.18L7.58 4.38H4.44Z';
const FOLDER_OPEN_LINE = 'm6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2';
const folderSolid = (open, s) => '<svg class="ds-art__solid" width="' + s + '" height="' + s + '" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
  '<path d="' + FOLDER_BACK + '" style="fill:currentColor;fill-opacity:.55"/>' +
  (open ? '<rect x="3.9" y="6.1" width="11.8" height="8.57" rx=".57" style="fill:var(--color-bg-base)"/><path d="' + FOLDER_OPEN_FRONT + '" style="fill:currentColor"/>'
        : '<path d="' + FOLDER_FRONT + '" style="fill:currentColor"/>') + '</svg>';
const folderLine = (open, s) => open
  ? '<svg class="ds-art__line" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="' + FOLDER_OPEN_LINE + '"/></svg>'
  : '<svg class="ds-art__line" width="' + s + '" height="' + s + '" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="' + FOLDER_LINE + '" style="fill:currentColor"/></svg>';

/** 폴더 트리 행의 아이콘 자리 — <span class="tree__icon ds-art"> + 솔리드 · 라인 */
export const folderIcon = (open = false, s = 16) => '<span class="tree__icon ds-art">' + folderSolid(open, s) + folderLine(open, s) + '</span>';
