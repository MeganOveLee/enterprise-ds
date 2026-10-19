// Form/고르는 법 — 문서 화면은 ChooseForm.mdx. 비슷한 입력 컴포넌트 중 무엇을 쓰는지 한 표로 (TD-104 반영 3)
// 기준 문장은 새로 만들지 않고 각 컴포넌트 문서의 구성 · 「언제 쓰고 쓰지 말지」에서 가져온다
import { matrix } from './_matrix.js';

const svg = (d, s = 14) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const CAL = '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>';
const link = (name, path) => '<a class="text-link no-arrow" href="./?path=/docs/' + path + '--docs" target="_top">' + name + '</a>';
const code = (t) => '<code>' + t + '</code>';
const note = (t) => '<span class="sb-note">' + t + '</span>';
const dp = (label, value) => '<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon" aria-label="' + label + ' 달력">' + svg(CAL) + '</button>' +
  '<input class="ui-datepicker__input" aria-label="' + label + '" placeholder="YYYY-MM-DD" value="' + value + '"></div>';

const ROWS = [
  ['글 · 숫자 직접 입력',
    '<input class="input" aria-label="문서 명" value="브레이크 캘리퍼 조립 사양서" style="width:240px">',
    link('Input', 'form-input') + ' ' + code('.input'), '라벨은 칸 위에 늘 보이게 둡니다.'],
  ['정해진 값 중 하나',
    '<select class="select" aria-label="작업현황" style="width:160px"><option>작업 중</option><option>검토 중</option><option>승인</option></select>',
    link('Input', 'form-input') + ' ' + code('.select'), '값이 정해져 있으면 직접 입력 대신 선택으로 받습니다.'],
  ['두세 개 중 하나',
    '<div class="radio-group" role="radiogroup" aria-label="처리 구분"><label class="radio"><input type="radio" name="cf-r" checked><span class="radio__mark"></span>정규</label><label class="radio"><input type="radio" name="cf-r"><span class="radio__mark"></span>긴급</label></div>',
    link('Selection Controls', 'form-selection-controls') + ' ' + code('.radio'), '선택지가 두세 개면 펼쳐 두어 누르지 않아도 모두 보입니다.'],
  ['값 여러 개',
    '<div class="checkSelect" style="width:160px"><div class="selected-text" role="button" tabindex="0" aria-haspopup="true" aria-expanded="false" aria-label="작업현황: 작업 중 외 1 (검토 중)">작업 중 외 1</div></div>',
    link('Multi Select', 'form-multi-select') + ' ' + code('.checkSelect'), '두 개 이상 고르면 「첫 값 외 N」으로 줄입니다.'],
  ['켜기 · 끄기 — 저장 후 적용',
    '<label class="checkbox"><input type="checkbox" checked>결재 포함</label>',
    link('Selection Controls', 'form-selection-controls') + ' ' + code('.checkbox'), '[저장]을 눌러야 적용되는 값.'],
  ['켜기 · 끄기 — 바로 적용',
    '<label class="switch"><input type="checkbox" role="switch" checked>알림 받기</label>',
    link('Selection Controls', 'form-selection-controls') + ' ' + code('.switch'), '저장 버튼 없이 바로 바뀌는 값.'],
  ['날짜 · 기간',
    '<div class="ui-datepicker-range">' + dp('등록일 시작', '2026-10-01') + '<span class="ui-datepicker-range__sep">~</span>' + dp('등록일 끝', '2026-10-31') + '</div>',
    link('Date Picker', 'form-date-picker') + ' ' + code('.ui-datepicker'), '기간은 두 칸을 한 묶음으로 두어 시작 · 종료가 뒤집히지 않게 합니다.'],
  ['보여 주기만 하는 값',
    '<input class="input" aria-label="문서 분류" value="/제품 문서/설계 문서" readonly style="width:200px">',
    link('Input', 'form-input') + ' ' + code('readonly'), '편집만 막고 값은 읽고 복사할 수 있습니다.'],
];

export default {
  title: 'Form/고르는 법',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 ChooseForm.mdx
  parameters: { controls: { disable: true } },
};

export const 고르는_표 = {
  render: () => matrix(['미리보기', '컴포넌트', '기준'], ROWS.map(([when, view, comp, why]) => [when, [view, comp, note(why)]]), { full: true }),
};
