// Blocks/Search Form — 문서 화면은 SearchForm.mdx. 검색 조건 영역 = 섹션 헤더(.seach_arm) + 조건 영역(.pro_table > .form-grid-2.form-grid--6)
// 예시 카드 두 개 = 모두 보기 · 접고 펴기(눌러서 펼침). 한 행에 조건 최대 6칸. 동작은 ./_search.js (Screens 문서 검색과 같음)
// 첫 카드 그림에 번호 표시(data-no). 번호별 이름 · 클래스 표는 SearchForm.mdx 카드 아래 — 구성 표를 따로 두지 않음 (Figma 🧱 Blocks 「Search Form」과 같은 구성)
import './_flow.css';
import { wireSearchDetail, EXPAND_LABEL } from './_search.js';
import { lnbSvg } from './_lnbicons.js';

const ico = (d) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const SEARCH = '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>';
const RESET = '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>';
const CAL = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>';
const field = (label, control, span, no) =>
  '<div class="ff-field' + (span ? ' span-' + span : '') + '"' + (no ? ' data-no="' + no + '"' : '') + '><label class="search-label">' + label + '</label><div class="td">' + control + '</div></div>';
const input = (label, value = '', ro = false, ph = '') => '<input class="input" aria-label="' + label + '"' + (value ? ' value="' + value + '"' : '') + (ph ? ' placeholder="' + ph + '"' : '') + (ro ? ' readonly' : '') + '>';
const select = (label, opts, pick) => '<select class="select" aria-label="' + label + '">' + opts.map((o) => '<option' + (o === pick ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
const dp = (label, value = '') => '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon" aria-label="' + label + ' 달력">' + ico(CAL) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"></div>';
const range = (label, a = '', b = '') => '<div class="ui-datepicker-range">' + dp(label + ' 시작', a) + '<span class="ui-datepicker-range__sep">~</span>' + dp(label + ' 끝', b) + '</div>';

export default {
  title: 'Blocks/Search Form',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 SearchForm.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

let uid = 0;
// 문서 검색 — 조건이 한 줄(6칸)을 넘는 화면. 첫 줄 = 자주 쓰는 조건, 나머지 = 상세 검색
const docFirst = (n = false) => field('문서 분류', input('문서 분류', '/제품 문서/설계 문서', true)) + field('문서 번호', input('문서 번호', '', false, '문서 번호 입력'), 0, n ? 4 : 0) + field('문서 명', input('문서 명', '', false, '문서 명 입력')) +
  field('작업현황', select('작업현황', ['전체', '작업 중', '검토 중', '승인', '반려'])) + field('등록일', range('등록일'), 2, n ? 5 : 0);
const docDetail = (id) => field('버전', '<div class="radio-group" role="radiogroup" aria-label="버전">' +
    '<label class="radio"><input type="radio" name="' + id + '-v" checked><span class="radio__mark"></span>최신 버전</label>' +
    '<label class="radio"><input type="radio" name="' + id + '-v"><span class="radio__mark"></span>모든 버전</label></div>', 2) +
  field('등록자', select('등록자', ['전체', '김도윤', '이서연'])) + field('수정자', select('수정자', ['전체', '김도윤', '이서연'])) +
  field('수정일', range('수정일'), 2);

// all = 모두 보기(조건 전체를 한 격자에, 펼치기 버튼 없음) · 접고 펴기 = 첫 행 + 상세 조건(.search-detail). n = 번호 표시
const searchForm = ({ all = false, open = false, n = false }) => {
  const id = 'sf-detail-' + (++uid);
  const btn = all ? '' : '<button type="button" class="btn btn--secondary btn--outlined btn--expand" aria-expanded="' + open + '" aria-controls="' + id + '">' + EXPAND_LABEL + '</button>';
  return '<section class="product" style="padding:0">' +
    '<div class="seach_arm" style="margin-top:0"' + (n ? ' data-no="1" data-mid' : '') + '><div class="leftbt">' + lnbSvg('sliders', 18) + '<h4>검색 조건</h4></div>' +
    '<div class="rightbt">' +
      '<button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button>' + btn +
      '<button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '검색 조건 초기화</button>' +
    '</div></div>' +
    '<div class="pro_table"' + (n ? ' data-no="2"' : '') + '><div class="form-grid-2 form-grid--6"' + (n ? ' data-no="3"' : '') + '>' + docFirst(n) + (all ? docDetail(id) : '') + '</div>' +
    (all ? '' : '<div class="search-detail" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2 form-grid--6"><div class="search-divider">상세 검색</div>' + docDetail(id) + '</div></div>') +
    '</div></section>';
};
// 미리보기 바탕 = 목록 화면의 내용 영역(bg-subtle). 「코드 보기」에는 검색 영역만
const stage = (html) => { const el = document.createElement('div'); el.className = 'anno'; el.innerHTML = html; return wireSearchDetail(el); };
export const 모두_보기 = {
  parameters: { docs: { source: { code: searchForm({ all: true }) } } },
  render: () => stage(searchForm({ all: true, n: true })),
};
export const 접고_펴기 = {
  parameters: { docs: { source: { code: searchForm({}) } } },
  render: () => stage(searchForm({})),
};
