// Blocks(조합)/SearchForm — 문서 화면은 SearchForm.mdx. 검색 조건 영역 = 제목줄(.seach_arm) + 조건 칸(.pro_table > .form-grid-2)
// 이번 카드: 상세 검색 펼침 — 대표 조건 한 줄만 보이고 나머지는 [상세 검색 펼치기](.btn--expand)로 펼침. 동작은 ./_search.js (Screens 문서 검색과 같음)
import { wireSearchDetail, EXPAND_LABEL } from './_search.js';

const ico = (d) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const SEARCH = '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>';
const RESET = '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>';
const FILTER = '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>';
const CAL = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>';
const field = (label, control, span, cls = '') =>
  '<div class="ff-field' + (span ? ' span-' + span : '') + (cls ? ' ' + cls : '') + '"><label class="search-label">' + label + '</label><div class="td">' + control + '</div></div>';
const input = (label, value = '', ro = false) => '<input class="input" aria-label="' + label + '"' + (value ? ' value="' + value + '"' : '') + (ro ? ' readonly' : '') + '>';
const select = (label, opts, pick) => '<select class="select" aria-label="' + label + '">' + opts.map((o) => '<option' + (o === pick ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
const dp = (label, value = '') => '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon" aria-label="' + label + ' 달력">' + ico(CAL) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"></div>';
const range = (label, a = '', b = '') => '<div class="ui-datepicker-range">' + dp(label + ' 시작', a) + '<span class="ui-datepicker-range__sep">~</span>' + dp(label + ' 끝', b) + '</div>';

let uid = 0;
const searchForm = ({ open = false } = {}) => {
  const id = 'sf-detail-' + (++uid);
  return '<div style="background:var(--color-bg-subtle);padding:16px"><section class="product" style="padding:0">' +
    '<div class="seach_arm" style="margin-top:0"><div class="leftbt">' + ico(FILTER) + '<h4>검색 조건</h4></div>' +
    '<div class="rightbt">' +
      '<button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button>' +
      '<button type="button" class="btn btn--secondary btn--outlined btn--expand" aria-expanded="' + open + '" aria-controls="' + id + '">' + EXPAND_LABEL + '</button>' +
      '<button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '검색 조건 초기화</button>' +
    '</div></div>' +
    '<div class="pro_table"><div class="form-grid-2 form-grid--6">' +
      field('문서 분류', input('문서 분류', '/제품 문서/설계 문서', true)) + field('문서 번호', input('문서 번호')) + field('문서 명', input('문서 명')) +
      field('작업현황', select('작업현황', ['전체', '작업 중', '검토 중', '승인', '반려'])) + field('등록일', range('등록일', '2026-09-01'), 2) +
    '</div><div class="search-detail" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2 form-grid--6"><div class="search-divider">상세 검색</div>' +
      field('버전', '<div class="radio-group" role="radiogroup" aria-label="버전">' +
        '<label class="radio"><input type="radio" name="' + id + '-v" checked><span class="radio__mark"></span>최신 버전</label>' +
        '<label class="radio"><input type="radio" name="' + id + '-v"><span class="radio__mark"></span>모든 버전</label></div>', 2) +
      field('등록자', select('등록자', ['', '김도윤', '이서연'])) + field('수정자', select('수정자', ['', '김도윤', '이서연'])) +
      field('수정일', range('수정일'), 2) +
    '</div></div></div></section></div>';
};
const mount = (html) => { const el = document.createElement('div'); el.innerHTML = html; return wireSearchDetail(el); };

export default {
  title: 'Blocks/SearchForm',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 SearchForm.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 상세_검색_펼침 = {
  parameters: { docs: { source: { code: searchForm() } } },
  render: () => mount(searchForm()),
};
export const 펼친_모습 = {
  parameters: { docs: { source: { code: searchForm({ open: true }) } } },
  render: () => mount(searchForm({ open: true })),
};
