// Blocks/Search Form: 문서 화면은 SearchForm.mdx. 검색 조건 영역 = 섹션 헤더(.seach_arm) + 조건 영역(.pro_table > .form-grid-2.form-grid--6)
// 문서 = 방식별 섹션: A 칸 여러 줄(기본 · 접고 펴기) · B 조건 단추 한 줄 바(기본 · 필터 더 보기) · 고급 검색(조건 그룹). 한 행에 조건 최대 6칸. 동작은 ./_search.js (Screens 문서 검색과 같음)
// A · B 기본 본보기 = 칸 · 단추마다 상태를 다르게 둔 그림 + 번호 표시(data-no). 번호별 이름 · 클래스 표(해부표)는 SearchForm.mdx 기본 카드 아래 (Figma 🧱 Blocks 「Search Form」과 같은 구성)
import './_flow.css';
import { wireSearchDetail, EXPAND_LABEL, EXPAND_COUNT } from './_search.js';
import { lnbSvg } from './_lnbicons.js';

const ico = (d) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const SEARCH = '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>';
const RESET = '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>';
const CAL = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>';
const field = (label, control, span, no) =>
  '<div class="ff-field' + (span ? ' span-' + span : '') + '"' + (no ? ' data-no="' + no + '"' : '') + '><label class="search-label">' + label + '</label><div class="td">' + control + '</div></div>';
const input = (label, value = '', ro = false, ph = '') => '<input class="input" aria-label="' + label + '"' + (value ? ' value="' + value + '"' : '') + (ph ? ' placeholder="' + ph + '"' : '') + (ro ? ' readonly' : ' data-ds-clear') + '>';   // 조회 조건 칸 = 값이 있으면 지우기(×, DS-ADR-042)
const select = (label, opts, pick) => '<select class="select" aria-label="' + label + '">' + opts.map((o) => '<option' + (o === pick ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
const dp = (label, value = '') => '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon" aria-label="' + label + ' 달력">' + ico(CAL) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '" data-ds-clear></div>';
const range = (label, a = '', b = '') => '<div class="ui-datepicker-range">' + dp(label + ' 시작', a) + '<span class="ui-datepicker-range__sep">~</span>' + dp(label + ' 끝', b) + '</div>';

export default {
  title: 'Blocks/Search Form',
  tags: ['!dev', '!autodocs', 'device-web'],   // 쓰는 기기 = PLM 웹 (DS-ADR-055), 메뉴에는 문서 한 장만, 문서는 SearchForm.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

let uid = 0;
// 문서 검색: 조건이 한 줄(6칸)을 넘는 화면. 첫 줄 = 자주 쓰는 조건, 나머지 = 상세 검색
const docFirst = (n = false, v = false) => field('문서 분류', input('문서 분류', '/제품 문서/설계 문서', true)) + field('문서 번호', input('문서 번호', v ? 'DOC-2610' : '', false, '문서 번호 입력'), 0, n ? 4 : 0) + field('문서 명', input('문서 명', v ? '캘리퍼' : '', false, '문서 명 입력')) +
  field('작업현황', select('작업현황', ['전체', '작업 중', '검토 중', '승인', '반려'], v ? '검토 중' : '')) + field('등록일', v ? range('등록일', '2026-09-01', '2026-09-30') : range('등록일'), 2, n ? 5 : 0);
const docDetail = (id, v = false) => field('버전', '<div class="radio-group" role="radiogroup" aria-label="버전">' +
    '<label class="radio"><input type="radio" name="' + id + '-v" data-filter-default' + (v ? '' : ' checked') + '><span class="radio__mark"></span>최신 버전</label>' +
    '<label class="radio"><input type="radio" name="' + id + '-v"' + (v ? ' checked' : '') + '><span class="radio__mark"></span>모든 버전</label></div>', 2) +
  field('등록자', select('등록자', ['전체', '김도윤', '이서연'], v ? '김도윤' : '')) + field('수정자', select('수정자', ['전체', '김도윤', '이서연'])) +
  field('수정일', v ? range('수정일', '2026-10-01', '') : range('수정일'), 2);

// all = 모두 보기(조건 전체를 한 격자에, 펼치기 버튼 없음) · 접고 펴기 = 첫 행 + 상세 조건(.search-detail). n = 번호 표시
const searchForm = ({ all = false, open = false, n = false, v = false }) => {
  const id = 'sf-detail-' + (++uid);
  const btn = all ? '' : '<button type="button" class="btn btn--secondary btn--outlined btn--expand" aria-expanded="' + open + '" aria-controls="' + id + '">' + EXPAND_LABEL + EXPAND_COUNT + '</button>';
  return '<section class="product" style="padding:0">' +
    '<div class="seach_arm" style="margin-top:0"' + (n ? ' data-no="1" data-mid' : '') + '><div class="leftbt">' + lnbSvg('sliders', 18) + '<h4>검색 조건</h4></div>' +
    '<div class="rightbt">' +
      '<button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button>' + btn +
      '<button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '검색 조건 초기화</button>' +
    '</div></div>' +
    '<div class="pro_table"' + (n ? ' data-no="2"' : '') + '><div class="form-grid-2 form-grid--6"' + (n ? ' data-no="3"' : '') + '>' + docFirst(n, v) + (all ? docDetail(id, v) : '') + '</div>' +
    (all ? '' : '<div class="search-detail" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2 form-grid--6"><div class="search-divider">상세 검색</div>' + docDetail(id, v) + '</div></div>') +
    '</div></section>';
};
// 미리보기 바탕 = 목록 화면의 내용 영역(bg-subtle). 「코드 보기」에는 검색 영역만
const stage = (html) => { const el = document.createElement('div'); el.className = 'anno'; el.innerHTML = html; return wireSearchDetail(el); };
// 시안 A 본보기: 검색 조건 안 칸마다 값 없음 · 값 있음을 다르게 둠.
// 칸마다 값 없음 · 값 있음을 섞어 둠. 마우스 올림 · 누름은 고정하지 않고 실제로 마우스를 올리거나 눌러 본다(TD-204)
const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
const trig = (label, value, cls) => '<div class="ui-select"><div class="ui-select__trigger' + (cls ? ' ' + cls : '') + '" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-label="' + label + '"><span class="ui-select__value">' + value + '</span><span class="ui-select__chevron">' + CHEV + '</span></div></div>';
const demoField = (label, control, state, span, no) => '<div class="ff-field' + (span ? ' span-' + span : '') + '"' + (no ? ' data-no="' + no + '"' : '') + '><label class="search-label">' + label + '</label><div class="td">' + control + '</div></div>';   // state = 이 칸에 둔 상태(코드 읽는 사람용)
const demoA = () => {
  const id = 'sf-detail-' + (++uid);
  return '<section class="product" style="padding:0"><div class="seach_arm" style="margin-top:0" data-no="1" data-mid><div class="leftbt">' + lnbSvg('sliders', 18) + '<h4>검색 조건</h4></div><div class="rightbt">' +
    '<button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button><button type="button" class="btn btn--secondary btn--outlined btn--expand" aria-expanded="false" aria-controls="' + id + '">' + EXPAND_LABEL + EXPAND_COUNT + '</button>' +
    '<button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '검색 조건 초기화</button></div></div>' +
    '<div class="pro_table" data-no="2"><div class="form-grid-2 form-grid--6" data-no="3">' +
    demoField('작업현황', trig('작업현황', '전체', ''), '값 없음') +
    demoField('문서 명', '<input class="input" aria-label="문서 명" placeholder="문서 명 입력">', '값 없음') +
    demoField('문서 번호', '<input class="input" aria-label="문서 번호" placeholder="문서 번호 입력" value="DOC-2610" data-ds-clear>', '값 있음') +
    demoField('등록자', trig('등록자', '김도윤', ''), '값 있음', 0, 4) +
    demoField('등록일', range('등록일', '2026-09-01', '2026-09-30'), '값 있음', 2, 5) +
    '</div><div class="search-detail" id="' + id + '" hidden><div class="form-grid-2 form-grid--6"><div class="search-divider">상세 검색</div>' + docDetail(id) + '</div></div></div></section>';
};
// 접힌 상세 검색에 걸린 조건: 상세 행(버전 · 등록자 · 수정일)에 값을 넣고 접은 모습. [상세 검색 펼치기] 글자 뒤에 걸린 개수(.search-detail__count)
export const 접힌_상세에_걸린_조건 = {
  parameters: { docs: { source: { code: searchForm({ v: true }) } } },
  render: () => stage(searchForm({ v: true })),
};
// 가로 라벨: 라벨 왼쪽 · 칸 오른쪽 짝을 한 행에 세 쌍(.form-grid--label-side, DS-ADR-083). 조건 전체를 한 격자에 두어 열마다 라벨 폭이 맞음
const sideForm = () => searchForm({ all: true }).replace('form-grid-2 form-grid--6"', 'form-grid-2 form-grid--6 form-grid--label-side"');
export const 가로_라벨 = {
  parameters: { docs: { source: { code: sideForm() } } },
  render: () => stage(sideForm()),
};
export const 접고_펴기 = {
  parameters: { docs: { source: { code: searchForm({}) } } },
  render: () => stage(demoA()),
};
// 펼치고 값을 넣은 모습: 상세 검색을 펼치고 첫 줄 · 상세 조건에 값을 넣어 검색하기 직전. 값이 있는 칸에는 지우기(×)
export const 펼치고_값_넣기 = {
  parameters: { docs: { source: { code: searchForm({ open: true, v: true }) } } },
  render: () => stage(searchForm({ open: true, v: true })),
};
const optSrc = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

// ── B 조건 단추 한 줄 바: 기본(시안_한_줄_바, 칸 · 단추마다 상태 + 번호) · 필터 더 보기 ──

// 시안 B 결과 표: 결과 머리 = 결과 개수 + 아이콘 묶음(새로 고침 · 열 설정) | Excel, 표 = 옅은 머리(Table 머리와 정렬 2)
const XLS = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l4 6M11 9l-4 6M14.5 9H18M14.5 12H18M14.5 15H18"/></svg>';
const X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const RANK_ROWS = [['DOC-2610-0012', '브레이크 캘리퍼 조립 사양서', '검토 중', '김도윤', '2026-09-24'], ['DOC-2610-0007', '캘리퍼 피스톤 씰 재질 검토', '검토 중', '김도윤', '2026-09-11'], ['DOC-2610-0003', '캘리퍼 브래킷 체결 토크 기준', '검토 중', '김도윤', '2026-09-02']];
const rankTable = (cls) => '<table class="grid-table' + cls + '" aria-label="검색 결과"><thead><tr><th scope="col">문서 번호</th><th scope="col">문서 명</th><th scope="col">작업현황</th><th scope="col">등록자</th><th scope="col">등록일</th></tr></thead><tbody>' +
  RANK_ROWS.map(([n, t, st, w, d]) => '<tr><td><a href="#" class="grid-custom-rows-link">' + n + '</a></td><td class="is-left">' + t + '</td><td><span class="status-chip status-chip--warning">' + st + '</span></td><td>' + w + '</td><td>' + d + '</td></tr>').join('') + '</tbody></table>';

const REFRESH = '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>';
const COLUMNS = '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M10 5v14M15 5v14"/>';
const iconBtn = (label, d) => '<button type="button" class="btn btn--secondary btn--transparent btn--icon" aria-label="' + label + '">' + ico(d) + '</button>';

// 시안 B = 한 줄 바: 검색 칸 + 조건 단추(Multi Select C, .checkSelect--filter) 한 줄, 오른쪽 끝 [검색] · [초기화]. 걸린 조건은 단추 색으로만 보이고, 결과 패널 머리에는 결과 개수만(Jira 서비스 큐와 같음)
const fsel = (name, items, picked = [], search = false) => '<select class="checkSelect" multiple data-display="filter" aria-label="' + name + '"' + (search ? ' data-searchBox="true"' : '') + '>' +
  items.map((t) => '<option' + (picked.includes(t) ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>';
// 필터 패널: 바에 둔 조건 단추 밖의 나머지 조건(문서 검색 = 검색 칸 · 작업현황 · 등록자 + 아래 8개). open = 펼친 모습(예시 카드)
const SLIDERS = '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>';
let fpId = 0;
const ck = (name, t, on = false) => '<label class="checkbox"><input type="checkbox"' + (on ? ' checked' : '') + '>' + t + '</label>';
const rd = (name, t, on = false, def = false) => '<label class="radio"><input type="radio" name="' + name + '"' + (on ? ' checked' : '') + (def ? ' data-filter-default' : '') + '><span class="radio__mark"></span>' + t + '</label>';
const FP_FIELDS = [
  ['문서 분류', (id) => '<input class="input filter-pop__search" type="search" aria-label="문서 분류 검색" placeholder="문서 분류 검색"><div class="filter-pop__options">' + [['설계 문서', true], ['시험 문서'], ['회의록'], ['검토 보고서'], ['도면']].map(([t, on]) => ck(id, t, on)).join('') + '</div>'],
  ['문서 번호', () => '<input class="input" aria-label="문서 번호" placeholder="문서 번호 입력" data-ds-clear>'],
  ['버전', (id) => '<div class="filter-pop__options" role="radiogroup" aria-label="버전">' + rd(id + '-v', '최신 버전', true, true) + rd(id + '-v', '모든 버전') + '</div>'],
  ['등록일', () => range('등록일', '2026-09-01', '2026-09-30')],
  ['수정자', (id) => '<input class="input filter-pop__search" type="search" aria-label="수정자 검색" placeholder="수정자 검색"><div class="filter-pop__options">' + ['김도윤', '이서연', '박지호', '최민준', '정하은'].map((t) => ck(id, t)).join('') + '</div>'],
  ['수정일', () => range('수정일')],
  ['프로젝트', (id) => '<input class="input filter-pop__search" type="search" aria-label="프로젝트 검색" placeholder="프로젝트 검색"><div class="filter-pop__options">' + ['PJT-2601 전동 캘리퍼', 'PJT-2604 경량 하우징', 'PJT-2607 커넥터 표준화'].map((t) => ck(id, t)).join('') + '</div>'],
  ['담당 부서', (id) => '<div class="filter-pop__options">' + ['설계1팀', '설계2팀', '시험팀', '품질팀', '생산기술팀'].map((t) => ck(id, t)).join('') + '</div>'],
];
const filterPop = (open = false) => {
  const id = 'fp-' + (++fpId);
  const tabs = FP_FIELDS.map(([t], i) => '<button type="button" role="tab" class="filter-pop__field" id="' + id + '-t' + i + '" aria-controls="' + id + '-p' + i + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + t + '<span class="filter-pop__count" hidden></span></button>').join('');
  const panes = FP_FIELDS.map(([t, body], i) => '<div class="filter-pop__pane" role="tabpanel" id="' + id + '-p' + i + '" aria-labelledby="' + id + '-t' + i + '"' + (i === 0 ? '' : ' hidden') + '>' + body(id + '-' + i) +
    '<div class="filter-pop__pane-foot"><button type="button" class="btn btn--secondary btn--transparent btn--sm" data-filter-clear>지우기</button></div></div>').join('');
  return '<div class="filter-pop-wrap"><button type="button" class="btn btn--secondary btn--outlined filter-trigger" aria-haspopup="dialog" aria-expanded="' + open + '" aria-controls="' + id + '">' + ico(SLIDERS) + '필터<span class="filter-trigger__count" hidden></span></button>' +
    '<div class="filter-pop" id="' + id + '" role="dialog" aria-label="필터"' + (open ? '' : ' hidden') + '><div class="filter-pop__main"><div class="filter-pop__fields" role="tablist" aria-orientation="vertical" aria-label="조건">' + tabs + '</div>' + panes + '</div>' +
    '<div class="filter-pop__foot"><button type="button" class="btn btn--secondary btn--transparent" data-filter-clear-all>모두 지우기</button><button type="button" class="btn btn--primary btn--filled filter-pop__apply" data-filter-apply>적용</button></div></div></div>';
};
const rankBar = () => '<section class="product" style="padding:0"><div class="search-bar"><input class="input search-bar__query" type="search" aria-label="문서 검색" placeholder="문서 번호 또는 문서 명" value="캘리퍼" data-ds-clear>' +
  fsel('작업현황', ['작업 중', '검토 중', '승인', '반려', '폐기'], ['검토 중']) +
  fsel('등록자', ['김도윤', '이서연', '박지호', '최민준', '정하은'], ['김도윤'], true) + filterPop() +
  '<div class="search-bar__actions"><button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button><button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '초기화</button></div></div>' +
  '<section class="table-panel"><header class="table-panel__head"><h3 class="table-panel__title">검색 결과 ' + RANK_ROWS.length + '</h3><div class="table-panel__actions">' + iconBtn('새로 고침', REFRESH) + iconBtn('열 설정', COLUMNS) + '<span class="table-panel__sep"></span><button type="button" class="btn btn--excel">' + XLS + 'Excel</button></div></header>' +
  rankTable(' grid-table--subtle') + '</section></section>';
const stageBar = (html, minH = 0) => { const el = stage(html); if (minH) el.style.minHeight = minH + 'px';
  setTimeout(() => { el.querySelectorAll('select.checkSelect').forEach((sel) => window.buildMultiSelect && window.buildMultiSelect(sel)); if (window.enhanceFilterPanels) window.enhanceFilterPanels(el); }, 0); return el; };
// 시안 B 본보기: 조건 단추마다 값 없음 · 값 있음을 섞어 둠. 마우스 올림은 실제로 올려 본다
const demoSel = (name, items, picked, state, ps, search) => fsel(name, items, picked, search).replace('<select ', '<select data-demo-state="' + state + '"' + (ps ? ' data-demo-ps="' + ps + '"' : '') + ' ');
const demoB = () => rankBar().replace(/<input class="input search-bar__query"[^>]*>/, '<input class="input search-bar__query" data-demo-state="값 있음" type="search" aria-label="문서 검색" placeholder="문서 번호 또는 문서 명" value="캘리" data-ds-clear>')
  .replace(fsel('작업현황', ['작업 중', '검토 중', '승인', '반려', '폐기'], ['검토 중']) + fsel('등록자', ['김도윤', '이서연', '박지호', '최민준', '정하은'], ['김도윤'], true),
    demoSel('작업현황', ['작업 중', '검토 중', '승인', '반려', '폐기'], [], '값 없음') + demoSel('문서 분류', ['설계 문서', '시험 문서', '회의록'], [], '값 없음') +
    demoSel('등록자', ['김도윤', '이서연', '박지호', '최민준', '정하은'], ['김도윤'], '값 있음', '', true) + demoSel('프로젝트', ['PJT-2601 전동 캘리퍼', 'PJT-2604 경량 하우징'], ['PJT-2601 전동 캘리퍼'], '값 있음', '', true));
export const 시안_한_줄_바 = { parameters: optSrc(rankBar()), render: () => stageBar(demoB(), 460) };   // 460 = [필터]를 연 패널이 카드 안에 들어가는 높이
// 필터 더 보기: [필터 더 보기] 체크 목록에서 조건 이름을 고르면 그 조건 단추가 바에 나타남(js/filter-panel.js). 처음 = 작업현황 · 등록자 + 문서 분류(골라 둠)
const fsel2 = (name, items, picked = [], search = false, on = true) => fsel(name, items, picked, search).replace('<select ', '<select data-filter-field="' + name + '" ');
const MORE = [['문서 분류', ['설계 문서', '시험 문서', '회의록', '검토 보고서', '도면'], ['설계 문서'], true], ['수정자', ['김도윤', '이서연', '박지호', '최민준', '정하은'], [], true], ['프로젝트', ['PJT-2601 전동 캘리퍼', 'PJT-2604 경량 하우징', 'PJT-2607 커넥터 표준화'], [], true], ['담당 부서', ['설계1팀', '설계2팀', '시험팀', '품질팀', '생산기술팀'], [], false], ['버전', ['최신 버전', '모든 버전'], [], false]];
const barMore = () => '<div class="search-bar"><input class="input search-bar__query" type="search" aria-label="문서 검색" placeholder="문서 번호 또는 문서 명">' +
  fsel('작업현황', ['작업 중', '검토 중', '승인', '반려', '폐기'], ['검토 중']) + fsel('등록자', ['김도윤', '이서연', '박지호', '최민준', '정하은'], [], true) +
  MORE.map(([n, items, picked, s]) => fsel2(n, items, picked, s)).join('') +
  '<select class="checkSelect" multiple data-display="add" data-searchBox="true" data-placeholder="필터 검색" placeholder="필터 더 보기" aria-label="필터 더 보기">' + MORE.map(([n], i) => '<option value="' + n + '"' + (i === 0 ? ' selected' : '') + '>' + n + '</option>').join('') + '</select>' +
  '<div class="search-bar__actions"><button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button><button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '초기화</button></div></div>';
export const 필터_더_보기 = { parameters: optSrc(barMore()), render: () => stageBar(barMore(), 320) };
// 조건 그룹: 고급 검색의 「조건」(PLM 고급 검색과 같은 구성). 그룹 머리 = 및 · 또는 + [속성 추가] · [조건 추가] · [그룹 추가] · 하위 그룹만 [그룹 제거],
// 줄 = 속성 · 연산자 · 값 + 빼기(×). 속성 종류(data-type)에 따라 연산자와 값 칸이 바뀜(js/filter-panel.js). 줄마다 빼기와 글자 단추는 Jira 업무 목록 필터 「고급」
const PLUS = '<path d="M12 5v14M5 12h14"/>';
const FOLDER_PLUS = '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 10v6M9 13h6"/>';
const TRASH = '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>';
const STATUS_LIST = '작업 중|검토 중|승인|반려|폐기';
// [속성, 종류, 목록 값]: 종류 = text 글자 · number 숫자 · bool 예/아니요 · list 목록 · user 사람 · date 날짜
const ATTRS = [['문서 번호', 'text'], ['문서 명', 'text'], ['작업현황', 'list', STATUS_LIST], ['문서 분류', 'list', '설계 문서|시험 문서|회의록|검토 보고서|도면'], ['등록자', 'user'], ['수정자', 'user'],
  ['등록일', 'date'], ['수정일', 'date'], ['첨부 파일 수', 'number'], ['최신 버전', 'bool']];
const TYPE_NAME = { text: '글자', number: '숫자', date: '날짜', bool: '예/아니요', list: '목록', user: '사람' };
const OPS = { text: ['=', '≠'], number: ['=', '≠', '<', '≤', '>', '≥'], bool: ['=', '≠'], list: ['=', '≠'], user: ['=', '≠'], date: ['='] };
const opts = (items, pick, empty) => (empty ? '<option data-empty' + (pick ? '' : ' selected') + '>' + empty + '</option>' : '') + items.map((o) => '<option' + (o === pick ? ' selected' : '') + '>' + o + '</option>').join('');
const DATE_KINDS = ['어제', '오늘', '내일', '날짜 범위 선택', '일 범위 선택'];
// 값 칸: 속성 종류별. 날짜 = 범위 셀렉트 + 「날짜 범위 선택」 날짜 칸 둘 · 「일 범위 선택」 숫자 칸 둘
const VALUE = {
  text: (v = '') => '<input class="input" aria-label="값"' + (v ? ' value="' + v + '"' : '') + ' data-ds-clear>',
  number: (v = '') => '<input class="input" inputmode="numeric" aria-label="값"' + (v ? ' value="' + v + '"' : '') + '>',
  bool: (v = '') => '<select class="select" aria-label="값">' + opts(['아니요', '예', '정의되지 않음'], v, '-선택-') + '</select>',
  list: (v = '', list = '') => '<select class="select" aria-label="값">' + opts(list.split('|').filter(Boolean), v, '-선택-') + '</select>',
  user: (v = '') => '<span class="field-action-wrap"><input class="input" aria-label="값"' + (v ? ' value="' + v + '"' : '') + '><button type="button" class="field-action" aria-label="사용자 찾기">' + ico(SEARCH) + '</button></span>',
  date: (kind = '날짜 범위 선택', a = '', b = '') => '<select class="select criteria-date" aria-label="날짜 범위 종류">' + opts(DATE_KINDS, kind) + '</select>' +
    '<span class="criteria-date__part" data-range="날짜 범위 선택"' + (kind === '날짜 범위 선택' ? '' : ' hidden') + '>' + range('값', a, b) + '</span>' +
    '<span class="criteria-date__part" data-range="일 범위 선택"' + (kind === '일 범위 선택' ? '' : ' hidden') + '><input class="input criteria-days" inputmode="numeric" aria-label="며칠 전">일 전에서 지금부터<input class="input criteria-days" inputmode="numeric" aria-label="며칠 후">일 후</span>',
};
const attrOpts = (pick) => ATTRS.map(([n, t, l]) => '<option data-type="' + t + '"' + (l ? ' data-values="' + l + '"' : '') + (n === pick ? ' selected' : '') + '>' + n + '</option>').join('');
const crRow = (attr, value) => { const [, t] = ATTRS.find(([n]) => n === attr); return '<div class="criteria-row" role="group" aria-label="조건">' +
  '<select class="select criteria-row__field" aria-label="속성">' + attrOpts(attr) + '</select>' +
  '<select class="select criteria-row__op" aria-label="연산자">' + opts(OPS[t], OPS[t][0]) + '</select>' +
  '<div class="criteria-row__value" data-type="' + t + '">' + value.replaceAll('aria-label="값"', 'aria-label="' + attr + ' 값"') + '</div>' +
  '<button type="button" class="btn btn--secondary btn--transparent btn--icon criteria-row__remove" data-criteria="remove-row" aria-label="조건 빼기" title="조건 빼기">' + ico(X.replace(/<svg[^>]*>|<\/svg>/g, '')) + '</button></div>'; };
let crId = 0;
const addMenu = () => { const id = 'cr-add-' + (++crId); return '<div class="ui-menu criteria-add"><button type="button" class="btn btn--secondary btn--transparent" id="' + id + '-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="' + id + '">' + ico(PLUS) + '속성 추가</button>' +
  '<div class="ui-menu__list" role="menu" id="' + id + '" aria-labelledby="' + id + '-btn" hidden><div class="ui-menu__search"><input type="search" class="input" aria-label="속성 찾기" placeholder="속성 찾기"></div>' +
  Object.keys(TYPE_NAME).map((t, k) => { const its = ATTRS.filter(([, tt]) => tt === t); return its.length ? (k ? '<div class="ui-menu__divider" role="separator"></div>' : '') + '<div class="ui-menu__group-label" role="presentation">' + TYPE_NAME[t] + '</div>' +
    its.map(([n]) => '<button type="button" class="ui-menu__item" role="menuitem" tabindex="-1" data-criteria-attr="' + n + '">' + n + '</button>').join('') : ''; }).join('') +
  '<div class="ui-menu__empty" hidden>찾는 속성이 없습니다</div></div></div>'; };
const crHead = (join, sub) => '<div class="criteria-group__head"><select class="select criteria-group__join" aria-label="조건 잇기">' + opts(['및', '또는'], join) + '</select>' + addMenu() +
  '<button type="button" class="btn btn--secondary btn--transparent" data-criteria="add-row">' + ico(PLUS) + '조건 추가</button>' +
  '<button type="button" class="btn btn--secondary btn--transparent" data-criteria="add-group">' + ico(FOLDER_PLUS) + '그룹 추가</button>' +
  (sub ? '<button type="button" class="btn btn--secondary btn--transparent criteria-group__remove" data-criteria="remove-group">' + ico(TRASH) + '그룹 제거</button>' : '') + '</div>';
const crTemplate = () => '<template class="criteria-template">' + crRow(ATTRS[0][0], VALUE.text()) + '<div class="criteria-group">' + crHead('또는', true) + '<div class="criteria-group__body"></div></div>' +
  Object.keys(VALUE).map((t) => '<div data-criteria-value="' + t + '">' + VALUE[t]() + '</div>').join('') + '</template>';
const criteria = () => '<section class="product" style="padding:0"><div class="seach_arm" style="margin-top:0"><div class="leftbt">' + lnbSvg('sliders', 18) + '<h4>조건</h4></div></div>' +
  '<div class="pro_table"><p class="criteria-expr" aria-live="polite">( )</p><div class="criteria-group">' + crHead('및', false) + '<div class="criteria-group__body">' +
  crRow('등록자', VALUE.user('김도윤')) + crRow('문서 번호', VALUE.text('DOC-2610')) +
  '<div class="criteria-group">' + crHead('또는', true) + '<div class="criteria-group__body">' + crRow('작업현황', VALUE.list('검토 중', STATUS_LIST)) + crRow('작업현황', VALUE.list('승인', STATUS_LIST)) + '</div></div>' +
  crRow('등록일', VALUE.date('날짜 범위 선택', '2026-09-01', '2026-09-30')) + crRow('최신 버전', VALUE.bool('예')) + crRow('첨부 파일 수', VALUE.number('1')) +
  '</div>' + crTemplate() + '</div>' +
  '<div class="criteria-actions"><button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button><button type="button" class="btn btn--secondary btn--outlined">이 검색 저장</button></div></div></section>';
export const 조건_그룹 = { parameters: optSrc(criteria()), render: () => stageBar(criteria(), 560) };
