const ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
const dp = (label, value = '', extra = '') =>
  `<div class="ui-datepicker"><button type="button" class="ui-datepicker__icon">${ICON}</button>` +
  `<input class="ui-datepicker__input" aria-label="${label}" placeholder="YYYY-MM-DD" value="${value}"${extra}></div>`;

export default {
  title: 'Form/Date Picker',
  tags: ['!dev'],   // 개별 예시는 메뉴에서 숨기고 Docs 페이지 안 섹션으로만 (MDX 문서는 그대로 보이게 파일마다 지정)
  parameters: {
    docs: { description: { component:
      '`.ui-datepicker` + `js/datepicker.js`. 칸을 누르면 달력이 열리고(포커스는 칸에 그대로), 아이콘이나 **Alt+↓**는 달력 안으로 포커스를 옮깁니다. ' +
      '방향키 · Home/End · PageUp/Down(Shift = 연도) · Enter · **Esc**(칸으로 복귀). 날짜를 누르면 바로 닫힙니다(취소/적용 없음). 직접 입력도 됩니다. ' +
      'WAI-ARIA APG Date Picker Dialog 패턴. (DS-ADR-016)' } },
  },
};

export const 하나 = {
  render: () => `<div style="max-width:200px">${dp('납기일', '2026-10-06')}</div>`,
};

export const 기간 = {
  parameters: { docs: { description: { story: '`.ui-datepicker-range` 안의 두 칸은 서로 min/max가 걸립니다. 종료일은 시작일보다 앞 날짜를 못 고릅니다.' } } },
  render: () => `<div style="max-width:420px"><div class="ui-datepicker-range">${dp('시작일', '2026-10-06')}<span class="ui-datepicker-range__sep">~</span>${dp('종료일', '2026-10-20')}</div></div>`,
};

export const 고를_수_있는_범위 = {
  parameters: { docs: { description: { story: '`min` · `max` 밖의 날짜는 비활성(취소선)으로 보입니다.' } } },
  render: () => `<div style="max-width:200px">${dp('희망일', '2026-10-15', ' min="2026-10-10" max="2026-10-25"')}</div>`,
};
