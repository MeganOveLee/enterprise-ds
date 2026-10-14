// 상세 검색 펼침 동작 — Screens 문서 검색 · 조합 › SearchForm 이 같이 쓴다 (10/14)
// [상세 검색 펼치기](.btn--expand[aria-controls])가 영역(.search-detail)을 보이고 숨긴다. 문구 · 화살표는 CSS 가 aria-expanded 로 바꾼다
export const EXPAND_LABEL = '<span class="t-open">상세 검색 펼치기</span><span class="t-close">상세 검색 접기</span>';
export const wireSearchDetail = (root) => {
  root.querySelectorAll('.btn--expand[aria-controls]').forEach((b) => {
    const panel = root.querySelector('#' + b.getAttribute('aria-controls'));
    if (!panel) return;
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); panel.hidden = !open;
    });
  });
  return root;
};
