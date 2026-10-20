// Form/고르는 법 — 문서 화면은 ChooseForm.mdx. 입력 컴포넌트의 표준 이름 · 정의 · 고르는 기준을 한 표로
// 이름 · 정의 = 공개 DS 문서(KRDS · Carbon · Material · Atlassian · GOV.UK)의 표준 용어
// 고르는 기준의 옵션 수 = 4개까지 라디오 · 체크박스(가로 한 줄), 5개부터 드롭다운(셀렉트 · 다중 선택) — TD-108 26 · 27번
import { matrix } from './_matrix.js';

const svg = (d, s = 14) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const CAL = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>';
const link = (name, path) => '<a class="text-link no-arrow" href="./?path=/docs/' + path + '--docs" target="_top">' + name + '</a>';
const code = (t) => '<code>' + t + '</code>';
const note = (t) => '<span class="sb-note" style="display:block;text-align:left">' + t + '</span>';
const left = (h) => '<div style="text-align:left">' + h + '</div>';
const dp = (label, value) => '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon" aria-label="' + label + ' 달력">' + svg(CAL) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"></div>';

// [표준 이름, 미리보기, 컴포넌트 링크 · 클래스, 정의, 고르는 기준]
const ROWS = [
  ['텍스트 입력 필드',
    '<input class="input" aria-label="문서 명" placeholder="문서 명 입력" style="width:200px">',
    link('Input', 'form-input') + ' ' + code('.input'), '한 줄의 짧은 텍스트를 입력하는 필드입니다.', '값을 미리 알 수 없는 자유 입력. 여러 줄이면 텍스트 영역을 씁니다.'],
  ['텍스트 영역',
    '<textarea class="textarea" aria-label="설명" rows="2" placeholder="변경 내용 입력" style="width:200px"></textarea>',
    link('Input', 'form-input') + ' ' + code('.textarea'), '여러 줄의 텍스트를 입력하는 필드입니다.', '설명 · 의견처럼 길이가 정해지지 않은 입력.'],
  ['셀렉트',
    '<select class="select" aria-label="작업현황" style="width:160px"><option>작업 중</option><option>검토 중</option><option>승인</option></select>',
    link('Input', 'form-input') + ' ' + code('.select'), '옵션 목록을 펼쳐 하나를 선택하는 요소입니다.', '하나를 선택하고 옵션이 5개 이상일 때. 4개까지는 라디오 버튼.'],
  ['다중 선택 드롭다운',
    '<div class="checkSelect" style="width:160px"><div class="selected-text" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-label="작업현황: 작업 중 외 1 (검토 중)" title="작업 중, 검토 중"><span class="selected-text__value">작업 중</span> <span class="selected-text__more">외 1</span></div></div>',
    link('Multi Select', 'form-multi-select') + ' ' + code('.checkSelect'), '옵션 목록에서 여러 값을 선택하고, 결과를 「첫 값 외 N」으로 표시하는 드롭다운입니다.', '여러 값을 선택하고 옵션이 5개 이상일 때. 4개까지는 체크박스 그룹.'],
  ['라디오 버튼',
    '<div class="radio-group" role="radiogroup" aria-label="처리 구분"><label class="radio"><input type="radio" name="cf-r" checked><span class="radio__mark"></span>정규</label><label class="radio"><input type="radio" name="cf-r"><span class="radio__mark"></span>긴급</label></div>',
    link('Selection Controls', 'form-selection-controls') + ' ' + code('.radio'), '여러 옵션 중 하나만 선택하는 요소입니다. 새로 선택하면 이전 선택이 해제됩니다.', '옵션 2 ~ 4개, 가로 한 줄(.radio-group). 5개부터는 셀렉트.'],
  ['체크박스',
    '<label class="checkbox"><input type="checkbox" checked>결재 포함</label>',
    link('Selection Controls', 'form-selection-controls') + ' ' + code('.checkbox'), '여러 옵션을 0개 이상 독립적으로 선택하는 요소입니다.', '옵션 4개까지, 가로 한 줄(.checkbox-group). 5개부터는 다중 선택 드롭다운. 저장 · 적용 같은 확정 동작이 따로 있을 때.'],
  ['토글 스위치',
    '<label class="switch"><input type="checkbox" role="switch" checked>알림 받기</label>',
    link('Selection Controls', 'form-selection-controls') + ' ' + code('.switch'), '켜짐 · 꺼짐 두 상태를 즉시 전환하는 요소입니다.', '누르는 즉시 적용될 때만. 저장이 필요하면 체크박스.'],
  ['날짜 입력 필드',
    '<div style="width:200px">' + dp('등록일', '2026-10-01') + '</div>',   // 미리보기 칸 폭 안에 — 기간 묶음(280)은 칸 밖으로 넘쳐 옆 칸을 덮었음
    link('Date Picker', 'form-date-picker') + ' ' + code('.ui-datepicker'), '날짜나 기간을 직접 입력하거나 달력에서 선택하는 필드입니다.', '아는 날짜는 직접 입력, 요일 · 인접 날짜가 중요하면 달력. 기간은 범위 필드(.ui-datepicker-range).'],
  ['읽기 전용 상태',
    '<input class="input" aria-label="문서 분류" value="/제품 문서/설계 문서" readonly style="width:200px">',
    link('Input', 'form-input') + ' ' + code('readonly'), '값을 표시하지만 수정할 수 없는 상태입니다. 값은 제출됩니다.', '권한 · 잠김이면 읽기 전용, 다른 입력 전까지 잠시 못 쓰면 비활성(disabled).'],
];

export default {
  title: 'Form/고르는 법',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ChooseForm.mdx
  parameters: { controls: { disable: true } },
};

export const 고르는_표 = {
  render: () => matrix(['미리보기', '컴포넌트', '정의', '고르는 기준'], ROWS.map(([name, view, comp, def, why]) => [name, [left(view), comp, note(def), note(why)]]), { full: true }),
};
