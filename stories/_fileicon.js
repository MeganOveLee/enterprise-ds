// 첨부 파일 형식 아이콘 — 파일 이름(또는 확장자)을 받아 형식마다 색 + 확장자 띠를 그림
// 상세 창 첨부 목록(.file-download-list) · 등록 창 업로더(.resumable) · 홈 최근 문서가 같이 씀
// 색은 DS .file-icon--<형식>(components.css). 표에 없는 형식 = 흐린 회색 FILE
// 확장자 글자 = 종이색(--color-bg-base)으로 띠를 뚫음 — 다크에서 띠가 밝아져도 읽힘(흰 글자면 다크 DWG 띠 위에서 안 보임)
const TYPES = {
  pdf: ['pdf', 'PDF'],
  xls: ['xls', 'XLS'], xlsx: ['xls', 'XLS'], csv: ['xls', 'XLS'],
  doc: ['doc', 'DOC'], docx: ['doc', 'DOC'],
  ppt: ['ppt', 'PPT'], pptx: ['ppt', 'PPT'],
  dwg: ['dwg', 'DWG'],
  zip: ['zip', 'ZIP'],
};

export const fileIcon = (name) => {
  const ext = String(name).toLowerCase().split('.').pop();
  const [type, label] = TYPES[ext] || ['file', 'FILE'];
  return '<span class="file-icon file-icon--' + type + '"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">' +
    '<path d="M4.5 1.5h7.5l4 4v12.2a.8.8 0 0 1-.8.8H4.5a.8.8 0 0 1-.8-.8V2.3a.8.8 0 0 1 .8-.8z" stroke-width="1.2" style="fill:var(--color-bg-base);stroke:currentColor"/>' +
    '<path d="M12 1.5v4h4" fill="none" stroke-width="1.2" style="stroke:currentColor"/>' +
    '<rect x="1.5" y="9.6" width="13.6" height="6.4" rx="1.2" style="fill:currentColor"/>' +
    '<text x="8.3" y="14.5" text-anchor="middle" font-size="5" font-weight="700" font-family="Arial, sans-serif" style="fill:var(--color-bg-base)">' + label + '</text></svg></span>';
};

// 폴더 트리 아이콘 — Figma 「solid/folder」 · 「solid/folder-open」 모양(뒤판 + 앞판, 열리면 종이 한 장)을 색 토큰으로
// 색 = 감싸는 .tree__icon 의 글자색(--color-icon-warning). 뒤판은 옅게(0.55), 앞판은 진하게, 종이는 종이색(--color-bg-base)
const FOLDER_BACK = 'M5.29 4.3a.86.86 0 0 0-.74-.46H2.59a.83.83 0 0 0-.83.83v11.52c0 .45.37.83.83.83h14c.46 0 .82-.38.82-.83V6.32a.83.83 0 0 0-.82-.83H6.38a.86.86 0 0 1-.73-.46z';
const FOLDER_FRONT = 'M2.52 7.9l-.68 8.23c-.04.48.34.9.82.9h14.01c.43 0 .78-.33.82-.76l.69-8.23a.83.83 0 0 0-.82-.9H3.33a.82.82 0 0 0-.81.76z';
const FOLDER_OPEN_FRONT = 'M4.33 10.05l-2.5 6.08c-.18.47.17.9.66.9h14.01c.35 0 .67-.21.79-.54l1.87-5.76a.82.82 0 0 0-.69-1.01H5a.8.8 0 0 0-.67.33z';
export const folderIcon = (open = false, s = 16) =>
  '<svg width="' + s + '" height="' + s + '" viewBox="0 0 20 20" aria-hidden="true">' +
  '<path d="' + FOLDER_BACK + '" style="fill:currentColor;fill-opacity:.55"/>' +
  (open ? '<rect x="3.9" y="6.1" width="11.8" height="8.57" rx=".57" style="fill:var(--color-bg-base)"/><path d="' + FOLDER_OPEN_FRONT + '" style="fill:currentColor"/>'
        : '<path d="' + FOLDER_FRONT + '" style="fill:currentColor"/>') + '</svg>';
