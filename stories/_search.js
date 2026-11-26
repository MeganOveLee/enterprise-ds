// 상세 검색 펼침 동작: Screens 문서 검색 · Blocks › SearchForm 이 같이 쓴다 
// [상세 검색 펼치기](.btn--expand[aria-controls])가 영역(.search-detail)을 보이고 숨긴다. 문구 · 화살표는 CSS 가 aria-expanded 로 바꾼다
export const EXPAND_LABEL = '<span class="t-open">상세 검색 펼치기</span><span class="t-close">상세 검색 접기</span>';
// 접힌 상세 행의 걸린 개수: 버튼 안 글자 뒤에. 값은 wireSearchDetail 이 채움
export const EXPAND_COUNT = '<span class="search-detail__count" aria-hidden="true" hidden></span>';
export const wireSearchDetail = (root) => {
  root.querySelectorAll('.btn--expand[aria-controls]').forEach((b) => {
    const panel = root.querySelector('#' + b.getAttribute('aria-controls'));
    if (!panel) return;
    // 걸린 개수(.search-detail__count): 상세 행에서 값이 든 칸 수. 기본값 라디오(data-filter-default) · 첫 옵션(「전체」)을 고른 목록은 세지 않음(js/filter-panel.js 와 같은 규칙)
    const count = b.querySelector('.search-detail__count');
    const update = () => {
      if (!count) return;
      let n = 0;
      panel.querySelectorAll('input, select, textarea').forEach((el) => {
        if (el.disabled) return;
        if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked && !el.hasAttribute('data-filter-default')) n++; }
        else if (el.tagName === 'SELECT') { if (el.selectedIndex > 0) n++; }
        else if (el.value && el.value.trim()) n++;
      });
      count.textContent = n ? String(n) : '';
      count.hidden = !n;
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-label', open ? '상세 검색 접기' : '상세 검색 펼치기' + (n ? ', 걸린 조건 ' + n + '개' : ''));
    };
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); panel.hidden = !open;
      update();
    });
    panel.addEventListener('input', update);
    panel.addEventListener('change', update);
    update();
  });
  return root;
};
