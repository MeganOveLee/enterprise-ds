// Blocks(조합)/ExportColumns — 문서 화면은 ExportColumns.mdx. 결과 목록의 [Excel]로 여는 「내보낼 열 고르기」 창
// 근거: 이전 버전 common/excelExportModal.jsp(전 화면 공통 레이아웃에 포함) · esolution3.search.js xlsxExport() — 제목 · 안내 · 「전체 선택」 · 버튼 글자 그대로
//   이전 버전은 DS 밖 클래스(ex_modal-*)로 그렸던 것 → 창 틀 Modal(.pop) · 체크박스(.checkbox) · 2열 칸(.form-grid-2) · 버튼으로 조합
//   이전 버전과 다른 점: 「전체 선택」이 일부만 고르면 부분 선택(Selection 「부분 선택」)으로 바뀜
//   같은 페이지 위에 띄우는 덮개 · 포커스 가두기는 DS에 없음(Modal 문서) — 여기서는 창 한 장만 그림
const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const I = {
  excel: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9l6 6M15 9l-6 6"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
};
// 내보낼 열 = Screens 문서 검색 결과 목록의 열(체크 열 제외). 이전 버전도 그리드에 보이는 머리 글자를 그대로 목록으로 만듦
const COLS = ['No.', '문서 번호', '문서 명', '파일', '버전', '작업현황', '등록자', '등록일', '수정자', '수정일'];
const ck = (t, o = '') => '<label class="checkbox"><input type="checkbox"' + o + '>' + t + '</label>';

// off = 꺼 둔 열 이름들. 하나라도 꺼져 있으면 「전체 선택」은 부분 선택(스크립트가 켬)
const panel = ({ off = [] } = {}) => {
  return '<div class="pop">' +
    '<div class="top"><div class="top-title-area"><span class="doc-type-badge">' + svg(I.excel, 16) + '</span><h3>엑셀 내보내기 — 컬럼 선택</h3></div>' +
    '<div class="top-btn-area"><button type="button" class="btn btn--secondary btn--outlined" data-xc="close">취소</button>' +
    '<button type="button" class="btn btn--primary btn--filled">선택한 컬럼만 내보내기</button></div></div>' +
    '<div class="product"><p class="section-meta">필요한 헤더 컬럼에 체크하세요.</p>' +
    '<div class="pro_table"><div class="form-grid-2" role="group" aria-label="내보낼 컬럼">' +
    '<div class="ff-field col-2">' + ck('전체 선택', ' data-xc="all"' + (off.length ? '' : ' checked')) + '</div>' +
    COLS.map((c) => ck(c, ' data-xc="col"' + (off.includes(c) ? '' : ' checked'))).join('') +
    '</div></div></div></div>';
};
// 여는 자리 — 결과 목록 머리 줄의 [Excel] (Screens 문서 검색과 같은 줄)
const head = () =>
  '<div class="seach_arm" style="margin-top:0"><div class="leftbt">' + svg(I.list, 16) + '<h4>검색 결과 (10/128)</h4></div>' +
  '<div class="rightbt"><button type="button" class="btn btn--excel" data-xc="open">' + svg(I.excel, 14) + 'Excel</button></div></div>';

// 미리보기 틀 — 창 폭만 정함(.pop 최소 폭 600 · 높이 100vh 는 새 창 기준이라 여기서는 내용 높이). 창 테두리는 미리보기용
const frame = (inner) => '<div style="max-width:520px">' + inner + '</div>';
const fit = (h) => '<div style="border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' +
  h.replace('<div class="pop"', '<div class="pop" style="height:auto;min-width:0"') + '</div>';

// 동작 — 「전체 선택」 ↔ 열 체크 맞추기, [Excel] 열기 · [취소] 닫기
const wire = (root) => {
  root.querySelectorAll('.pop').forEach((pop) => {
    const all = pop.querySelector('[data-xc="all"]');
    const cols = [...pop.querySelectorAll('[data-xc="col"]')];
    const sync = () => {
      const on = cols.filter((c) => c.checked).length;
      all.checked = on === cols.length;
      all.indeterminate = on > 0 && on < cols.length;
    };
    all.addEventListener('change', () => { cols.forEach((c) => { c.checked = all.checked; }); sync(); });
    cols.forEach((c) => c.addEventListener('change', sync));
    sync();
  });
  const open = root.querySelector('[data-xc="open"]');
  const win = root.querySelector('[data-xc="win"]');
  if (open && win) {
    open.addEventListener('click', () => { win.hidden = false; win.querySelector('[data-xc="all"]').focus(); });
    win.querySelector('[data-xc="close"]').addEventListener('click', () => { win.hidden = true; open.focus(); });
  }
  return root;
};
const mount = (html) => { const el = document.createElement('div'); el.innerHTML = html; return wire(el); };

const CODE_OPEN = head() + '\n\n<!-- [Excel]을 누르면 여는 창 -->\n' + panel();

export default {
  title: 'Blocks/ExportColumns',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ExportColumns.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 열_선택 = {
  parameters: { docs: { source: { code: CODE_OPEN } } },
  render: () => mount(frame(head() + '<div data-xc="win" style="margin-top:12px">' + fit(panel()) + '</div>')),
};
export const 일부만_고른_모습 = {
  parameters: { docs: { source: { code: panel({ off: ['No.', '파일', '수정자', '수정일'] }) + '\n<!-- 일부만 고르면 「전체 선택」은 부분 선택: input.indeterminate = true (스크립트) -->' } } },
  render: () => mount(frame(fit(panel({ off: ['No.', '파일', '수정자', '수정일'] })))),
};
