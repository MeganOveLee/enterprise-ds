// Foundation 페이지 공용 도우미 — 견본은 CSS 변수로 그리고, 옆의 값은 화면에 그려진 결과에서 읽어 온다.
// 그래서 툴바에서 브랜드 · 라이트/다크를 바꾸면 견본과 값이 같이 바뀐다.

const STYLE = `
.fd { font-size: var(--body-md); }
.fd-lead { margin: 0 0 16px; color: var(--color-text-muted); }
.fd-ramp { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 12px; }
.fd-ramp .fd-sw { height: 56px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); }
.fd-name { display: block; margin-top: 6px; font-weight: var(--font-weight-semibold); font-size: var(--body-sm); }
.fd-val  { display: block; color: var(--color-text-muted); font-size: var(--body-sm); font-variant-numeric: tabular-nums; }
.fd-list { display: grid; grid-template-columns: 48px minmax(220px, max-content) 120px 1fr; gap: 10px 16px; align-items: center; }
.fd-list .fd-item { display: contents; }
.fd-list .fd-sw { width: 48px; height: 32px; border-radius: var(--radius-md); box-sizing: border-box; }
.fd-list .fd-sw.is-bg   { border: 1px solid var(--color-border-subtle); }
.fd-list .fd-sw.is-text { display: grid; place-items: center; font-size: 18px; font-weight: var(--font-weight-bold); background: var(--color-bg-base); border: 1px solid var(--color-border-subtle); }
.fd-list .fd-sw.is-border { border-width: 2px; border-style: solid; background: var(--color-bg-base); }
.fd-list .fd-sw.is-icon { display: grid; place-items: center; background: var(--color-bg-base); border: 1px solid var(--color-border-subtle); }
.fd-list .fd-sw.is-icon::before { content: ''; width: 16px; height: 16px; border-radius: 50%; background: currentColor; }
.fd-list .fd-sw.is-inverse { background: var(--color-bg-inverse); }
.fd-list code, .fd-row code { font-size: var(--body-sm); }
.fd-use { color: var(--color-text-muted); }
.fd-head { font-size: var(--body-sm); color: var(--color-text-muted); font-weight: var(--font-weight-semibold); }
.fd-row { display: grid; grid-template-columns: minmax(150px, max-content) 90px 1fr; gap: 16px; align-items: baseline;
          padding: 12px 0; border-bottom: 1px solid var(--color-border-subtle); }
.fd-bar { height: 16px; background: var(--color-bg-brand); border-radius: var(--radius-sm); }
.fd-boxes { display: flex; flex-wrap: wrap; gap: 24px; }
.fd-box { width: 96px; height: 64px; background: var(--color-bg-brand-subtle); border: 1px solid var(--color-border-brand); }
.fd-card { width: 200px; height: 96px; background: var(--color-bg-base); border-radius: var(--radius-lg); display: grid; place-items: center; }
`;

function ensureStyle() {
  if (document.getElementById('fd-style')) return;
  const s = document.createElement('style');
  s.id = 'fd-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

// rgb(…) · rgba(…) · color(srgb …) → #RRGGBB (+ 투명도)
export function toHex(str) {
  if (!str) return '';
  const isSrgb = str.startsWith('color(srgb');
  const nums = (str.match(/-?[\d.]+/g) || []).map(Number);
  if (nums.length < 3) return str;
  let [r, g, b, a] = nums;
  if (isSrgb) { r *= 255; g *= 255; b *= 255; }
  if (a === 0) return '투명';
  const hex = '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  return a !== undefined && a < 1 ? `${hex} · ${Math.round(a * 100)}%` : hex;
}

// html 을 그리고, 다음 프레임에 [data-read] 칸을 실제 값으로 채운다.
// data-read="bg|color|border|font-size|width|radius|shadow" — 어떤 값을 읽을지, 같은 .fd-item 안의 .fd-sw 기준
export function mount(html) {
  ensureStyle();
  const el = document.createElement('div');
  el.className = 'fd';
  el.innerHTML = html;
  requestAnimationFrame(() => {
    el.querySelectorAll('[data-read]').forEach(out => {
      const item = out.closest('.fd-item');
      const sw = item && item.querySelector('.fd-sw');
      if (!sw) return;
      const cs = getComputedStyle(sw);
      const kind = out.dataset.read;
      out.textContent =
        kind === 'bg'        ? toHex(cs.backgroundColor) :
        kind === 'color'     ? toHex(cs.color) :
        kind === 'border'    ? toHex(cs.borderTopColor) :
        kind === 'font-size' ? `${parseFloat(cs.fontSize)}px` :
        kind === 'width'     ? `${parseFloat(cs.width)}px` :
        kind === 'height'    ? `${parseFloat(cs.height)}px` :
        kind === 'radius'    ? (parseFloat(cs.borderTopLeftRadius) > 999 ? '완전 둥글게' : `${parseFloat(cs.borderTopLeftRadius)}px`) :
        '';
    });
  });
  return el;
}
