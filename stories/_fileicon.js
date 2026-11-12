// 그림 자산(DS-ADR-037) — 첨부 파일 형식 아이콘 · 폴더 트리 아이콘. 두 모양(솔리드 · 라인)을 함께 내고,
// 어느 쪽이 보일지는 브랜드 파일 토큰(--art-solid · --art-line)이 정한다. 두 svg 모두 aria-hidden — 뜻은 옆 파일 이름 · 폴더 이름이 맡음

// ── 첨부 파일 형식 아이콘 ── 파일 이름(또는 확장자)을 받아 형식마다 색 + 형식 글자
// 상세 창 첨부 목록(.file-download-list) · 등록 창 업로더(.resumable) · 홈 최근 문서가 같이 씀
// 색은 DS .file-icon--<형식>(components.css). 표에 없는 형식 = 흐린 회색 FILE
//   솔리드 = Figma 「solid/dwg · file · memo」와 같은 모양 — 색 종이(오른쪽 위 접힘) + 흰 줄 3개 + 아래 띠에 흰 형식 글자. 색 = --file-art · --file-art-band(형식별, components.css)
//   라인   = Figma Icons 「file」 윤곽(아래는 열어 둠) + 아래에 형식 글자(형식 색)
const TYPES = {
  pdf: ['pdf', 'PDF'],
  xls: ['xls', 'XLS'], xlsx: ['xls', 'XLS'], csv: ['xls', 'XLS'],
  doc: ['doc', 'DOC'], docx: ['doc', 'DOC'],
  ppt: ['ppt', 'PPT'], pptx: ['ppt', 'PPT'],
  dwg: ['dwg', 'DWG'],
  zip: ['zip', 'ZIP'],
  mp4: ['mp4', 'MP4'], mov: ['mp4', 'MP4'], avi: ['mp4', 'MP4'],
  txt: ['txt', 'TXT'], log: ['txt', 'TXT'],
};
const label = (text, x, y, fill, size = 5) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + size + '" font-weight="700" font-family="Arial, sans-serif" style="fill:' + fill + '">' + text + '</text>';
// 종이 · 띠 = Figma solid/file 벡터(20 격자)를 반올림. 줄 = 4.9 · 7.0 · 9.1 높이 0.85, 셋째 줄은 짧게
const PAGE = 'M2.68 0h10.89c.21 0 .41.08.56.23l3.74 3.69c.15.15.24.35.24.57v14.7a.81.81 0 0 1-.81.81H2.68a.81.81 0 0 1-.81-.81V.81A.81.81 0 0 1 2.68 0z';
const BAND = 'M1.87 13.66h16.26v5.53a.81.81 0 0 1-.81.81H2.68a.81.81 0 0 1-.81-.81z';
const fileSolid = (text) => '<svg class="ds-art__solid" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
  '<path d="' + PAGE + '" style="fill:var(--file-art)"/><path d="' + BAND + '" style="fill:var(--file-art-band)"/>' +
  '<g style="fill:#fff"><rect x="5.45" y="4.88" width="9.1" height=".85" rx=".42"/><rect x="5.45" y="6.99" width="9.1" height=".85" rx=".42"/><rect x="5.45" y="9.11" width="6.5" height=".85" rx=".42"/></g>' +
  label(text, 10, 18.25, '#fff', 4.2) + '</svg>';
// 윤곽 = Figma Icons file(20 격자 · 선 1.25)의 가운데 선. 형식 글자 자리만큼 아래를 열어 둠
const fileLine = (text) => '<svg class="ds-art__line" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">' +
  '<path d="M4.44 12V4.44a1.39 1.39 0 0 1 1.39-1.39h4.86l4.87 4.87V12M10.69 3.05v4.87h4.87" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>' +
  label(text, 10, 17.3, 'currentColor') + '</svg>';

// label: 옆에 파일 이름이 없는 자리(목록 표 「파일」 열)에서 true — 형식 글자를 읽어 주는 이름(role="img")
export const fileIcon = (name, { label = false } = {}) => {
  const ext = String(name).toLowerCase().split('.').pop();
  const [type, text] = TYPES[ext] || ['file', 'FILE'];
  const a11y = label ? ' role="img" aria-label="' + text + ' 파일"' : '';
  return '<span class="file-icon file-icon--' + type + ' ds-art"' + a11y + '>' + fileSolid(text) + fileLine(text) + '</span>';
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
