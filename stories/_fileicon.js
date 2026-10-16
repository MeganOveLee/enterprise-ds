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
