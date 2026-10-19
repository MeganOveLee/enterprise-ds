// Blocks(조합)/SearchForm — 문서 화면은 SearchForm.mdx. 검색 조건 영역 = 제목줄(.seach_arm) + 조건 칸(.pro_table > .form-grid-2)
// 예시 카드 = 사용자가 보는 결과 세 가지(TD-104 반영 1): 첫 줄 + 상세 검색 · 모든 조건 · 펼친 채 시작
// 고르는 기준 = 조건이 한 줄(6칸)에 들어가는가. 넘치면 첫 줄만 보이고 나머지는 상세 검색. 동작은 ./_search.js (Screens 문서 검색과 같음)
import { wireSearchDetail, EXPAND_LABEL } from './_search.js';
import { doDont } from './_dodont.js';

const ico = (d) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const SEARCH = '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>';
const RESET = '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>';
const FILTER = '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>';
const CAL = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>';
const CHEVRON = '<polyline points="6 9 12 15 18 9"/>';
const field = (label, control, span) =>
  '<div class="ff-field' + (span ? ' span-' + span : '') + '"><label class="search-label">' + label + '</label><div class="td">' + control + '</div></div>';
const input = (label, value = '', ro = false) => '<input class="input" aria-label="' + label + '"' + (value ? ' value="' + value + '"' : '') + (ro ? ' readonly' : '') + '>';
const select = (label, opts, pick) => '<select class="select" aria-label="' + label + '">' + opts.map((o) => '<option' + (o === pick ? ' selected' : '') + '>' + o + '</option>').join('') + '</select>';
const dp = (label, value = '') => '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon" aria-label="' + label + ' 달력">' + ico(CAL) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"></div>';
const range = (label, a = '', b = '') => '<div class="ui-datepicker-range">' + dp(label + ' 시작', a) + '<span class="ui-datepicker-range__sep">~</span>' + dp(label + ' 끝', b) + '</div>';

let uid = 0;
// 문서 검색 — 조건이 한 줄(6칸)을 넘는 화면. 첫 줄 = 자주 쓰는 조건, 나머지 = 상세 검색
const docFirst = () => field('문서 분류', input('문서 분류', '/제품 문서/설계 문서', true)) + field('문서 번호', input('문서 번호')) + field('문서 명', input('문서 명')) +
  field('작업현황', select('작업현황', ['전체', '작업 중', '검토 중', '승인', '반려'])) + field('등록일', range('등록일', '2026-09-01'), 2);
const docDetail = (id) => field('버전', '<div class="radio-group" role="radiogroup" aria-label="버전">' +
    '<label class="radio"><input type="radio" name="' + id + '-v" checked><span class="radio__mark"></span>최신 버전</label>' +
    '<label class="radio"><input type="radio" name="' + id + '-v"><span class="radio__mark"></span>모든 버전</label></div>', 2) +
  field('등록자', select('등록자', ['', '김도윤', '이서연'])) + field('수정자', select('수정자', ['', '김도윤', '이서연'])) +
  field('수정일', range('수정일'), 2);
// 결재함 검색 — 조건이 한 줄에 다 들어가는 화면
const approvalAll = () => field('문서 명', input('문서 명')) + field('결재 상태', select('결재 상태', ['전체', '결재 대기', '승인', '반려'])) + field('요청일', range('요청일', '2026-10-01'), 2);

// expand: 'text' = [상세 검색 펼치기] · 'icon' = 화살표만(Don't 견본) · 'none' = 버튼 없음
const searchForm = ({ first, detail, open = false, expand = detail ? 'text' : 'none', cols = 6 }) => {
  const id = 'sf-detail-' + (++uid);
  const btn = expand === 'none' ? '' : expand === 'icon'
    ? '<button type="button" class="btn btn--secondary btn--outlined btn--icon" aria-label="펼치기" aria-expanded="false">' + ico(CHEVRON) + '</button>'
    : '<button type="button" class="btn btn--secondary btn--outlined btn--expand" aria-expanded="' + open + '"' + (detail ? ' aria-controls="' + id + '"' : '') + '>' + EXPAND_LABEL + '</button>';
  return '<section class="product" style="padding:0">' +
    '<div class="seach_arm" style="margin-top:0"><div class="leftbt">' + ico(FILTER) + '<h4>검색 조건</h4></div>' +
    '<div class="rightbt">' +
      '<button type="button" class="btn btn--primary btn--filled">' + ico(SEARCH) + '검색</button>' + btn +
      '<button type="button" class="btn btn--secondary btn--transparent">' + ico(RESET) + '검색 조건 초기화</button>' +
    '</div></div>' +
    '<div class="pro_table"><div class="form-grid-2 form-grid--6"' + (cols === 6 ? '' : ' style="grid-template-columns:repeat(' + cols + ',minmax(0,1fr))"') + '>' + first() + '</div>' +
    (detail ? '<div class="search-detail" id="' + id + '"' + (open ? '' : ' hidden') + '><div class="form-grid-2 form-grid--6"><div class="search-divider">상세 검색</div>' + detail(id) + '</div></div>' : '') +
    '</div></section>';
};
// 미리보기 바탕 = 목록 화면의 내용 영역(bg-subtle). 「코드 보기」에는 검색 영역만
const stage = (html) => { const el = document.createElement('div'); el.style.cssText = 'background:var(--color-bg-subtle);padding:16px'; el.innerHTML = html; return wireSearchDetail(el); };
const story = (opts) => { const html = searchForm(opts); return { parameters: { docs: { source: { code: html } } }, render: () => stage(searchForm(opts)) }; };

export default {
  title: 'Blocks/SearchForm',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 SearchForm.mdx
  parameters: { controls: { disable: true }, docs: { source: { language: 'html' } } },
};

export const 첫_줄_상세_검색 = story({ first: docFirst, detail: docDetail });
export const 모든_조건 = story({ first: approvalAll });
export const 펼친_채_시작 = story({ first: docFirst, detail: docDetail, open: true });

// ── 언제 쓰고 쓰지 말지 (Do · Don't) ── 미리보기만, 코드는 위 예시 카드에
// 반쪽 폭 견본 — 칸 3개 · 3열로 줄임(미리보기 전용 배치)
const small = (html) => '<div style="background:var(--color-bg-subtle);padding:12px">' + html + '</div>';
const approvalMini = () => field('문서 명', input('문서 명')) + field('결재 상태', select('결재 상태', ['전체', '결재 대기', '승인', '반려'])) + field('요청일', dp('요청일', '2026-10-01'));
const docMini = () => field('문서 번호', input('문서 번호')) + field('문서 명', input('문서 명')) + field('작업현황', select('작업현황', ['전체', '작업 중', '검토 중']));
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => { const el = document.createElement('div'); el.innerHTML = doDont([
    { title: '접을 조건이 없으면 펼치기 버튼도 두지 않음',
      do: [small(searchForm({ first: approvalMini, cols: 3 })), '조건이 한 줄에 다 들어가면 모두 보이고 버튼을 두지 않습니다.'],
      dont: [small(searchForm({ first: approvalMini, cols: 3, expand: 'text' })), '눌러도 펼쳐지는 것이 없는 버튼이 생깁니다.'] },
    { title: '펼치기 버튼에는 글자를 함께',
      do: [small(searchForm({ first: docMini, detail: docDetail, cols: 3 })), '「상세 검색 펼치기」 글자와 화살표를 함께 둡니다.'],
      dont: [small(searchForm({ first: docMini, detail: docDetail, cols: 3, expand: 'icon' })), '화살표만 있으면 무엇이 펼쳐지는지 알 수 없습니다.'] },
  ]); return wireSearchDetail(el); },
};
