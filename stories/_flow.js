// Blocks 문서 공통 — 「기본 화면 → 누르면 열리는 창」 틀 (TD-103). 모양은 ./_flow.css
// flow({ base, open }) — base · open = { html, w, h, title, where }. trigger = 누르는 버튼 이름(화살표 줄 글자), how = 열리는 방식(새 창 · 화면 이동)
// 기본 화면에서 누르는 버튼에는 MARK 클래스를 붙인다(점선 테두리만, 문서 전용)
import './_flow.css';

export const MARK = 'flow-mark';
const DOWN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16M6 14l6 6 6-6"/></svg>';

// 실제 크기(w × h)로 그리고 칸 너비에 맞게 줄임 — Screens 화면 틀과 같은 방식
const fit = (html, w, h) => {
  const el = document.createElement('div');
  el.className = 'flow__fit';
  el.style.maxWidth = (w + 2) + 'px';
  el.style.aspectRatio = (w + 2) + ' / ' + (h + 2);
  el.innerHTML = '<div class="flow__inner" style="width:' + w + 'px;height:' + h + 'px">' + html + '</div>';
  const go = () => { const k = Math.min(1, (el.clientWidth - 2) / w); if (k > 0) el.firstChild.style.transform = 'scale(' + k + ')'; };
  if (window.ResizeObserver) new ResizeObserver(go).observe(el);
  requestAnimationFrame(go);
  return el;
};
// 을 / 를 — 버튼 이름 마지막 글자의 받침으로 고름([등록]을 · [BOM 비교]를)
const josa = (t) => { const c = t.replace(/[\]\s]+$/, '').slice(-1).charCodeAt(0) - 0xac00; return c >= 0 && c < 11172 && c % 28 === 0 ? '를' : '을'; };
const label = (no, title, where) => '<p class="flow__label"><span class="flow__no" aria-hidden="true">' + no + '</span><b>' + title + '</b><span>' + where + '</span></p>';

export const flow = ({ base, open, trigger, how }) => {
  const root = document.createElement('div');
  root.className = 'flow';
  root.insertAdjacentHTML('beforeend', label(1, base.title || '기본 화면', base.where));
  root.appendChild(fit(base.html, base.w, base.h));
  root.insertAdjacentHTML('beforeend', '<p class="flow__arrow">' + DOWN + '<span><b>' + trigger + '</b>' + josa(trigger) + ' 누르면 ' + how + '</span></p>');
  root.insertAdjacentHTML('beforeend', label(2, open.title || '열리는 창', open.where));
  root.appendChild(fit(open.html, open.w, open.h));
  return root;
};

// 한 장만 실제 크기로(흐름 없이) — 같은 창의 다른 상태 카드
export const shot = (html, w, h) => fit(html, w, h);

// 접는 섹션 눌러 보기 — Accordion 문서와 같은 동작(토글이 aria-expanded 를 바꾸고, aria-controls 로 이은 내용에 hidden). 제품에서는 화면 스크립트가 같은 일을 함
const MINUS = '<path d="M6 12h12"/>';
const PLUS = '<path d="M12 5v14M5 12h14"/>';
const tg = (d) => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
export const toggleIcon = (open) => tg(open ? MINUS : PLUS);
export const wireSections = (root) => {
  root.querySelectorAll('.section-toggle[aria-controls]').forEach((b) => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      const title = b.getAttribute('aria-label').replace(/ (접기|펼치기)$/, '');
      b.setAttribute('aria-expanded', String(open));
      b.setAttribute('aria-label', title + (open ? ' 접기' : ' 펼치기'));
      b.innerHTML = toggleIcon(open);
      const panel = root.querySelector('#' + b.getAttribute('aria-controls'));
      if (panel) panel.hidden = !open;
    });
  });
  return root;
};
