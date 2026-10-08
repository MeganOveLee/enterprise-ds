// 문서 표 도우미 — 스토리 안에 그리는 설계표 · 토큰표 · 램프.
// 값 칸은 그려진 결과에서 읽어 온다 → 도구 막대에서 브랜드 · 모드를 바꾸면 미리보기와 값이 함께 바뀐다.
// 여러 줄 템플릿 문자열 대신 문자열 이어 붙이기 (스토리북 색인기 오인 방지, _matrix.js와 같은 방식)
import { toHex } from './_foundation.js';

const STYLE = [
  '.dt-root { font-size: var(--body-sm); color: var(--color-text-base); }',
  '.dt { width: 100%; border-collapse: collapse; }',
  '.dt th { padding: 0 12px 8px; text-align: left; font-size: 12px; font-weight: var(--font-weight-semibold); color: var(--color-text-muted); border-bottom: 1px solid var(--color-border-base); white-space: nowrap; }',
  '.dt td { padding: 10px 12px; vertical-align: middle; border-bottom: 1px solid var(--color-border-subtle); }',
  '.dt tbody tr:last-child td { border-bottom: 0; }',
  '.dt code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 12px; color: var(--color-text-brand); white-space: nowrap; }',
  '.dt-c-sw { width: 56px; } .dt-c-val { width: 150px; } .dt-c-act { width: 72px; text-align: right; }',
  '.dt-use { color: var(--color-text-muted); }',
  '.dt-val { font-variant-numeric: tabular-nums; white-space: nowrap; }',
  '.dt-en { margin-left: 6px; font-size: 12px; font-weight: 400; color: var(--color-text-muted); }',
  '.dt-sub { display: block; margin-top: 2px; font-size: 12px; color: var(--color-text-muted); }',
  '.dt-dash { color: var(--color-text-disabled); }',
  '.dt-prev { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }',
  '.dt-probe { position: absolute; visibility: hidden; pointer-events: none; }',
  '.dt-sw { width: 40px; height: 28px; border-radius: var(--radius-md); box-sizing: border-box; border: 1px solid var(--color-border-subtle); }',
  '.dt-sw.is-text { display: grid; place-items: center; background: var(--color-bg-base); font-size: 16px; font-weight: var(--font-weight-bold); }',
  '.dt-sw.is-border { border-width: 2px; border-style: solid; background: var(--color-bg-base); }',
  '.dt-sw.is-icon { display: grid; place-items: center; background: var(--color-bg-base); }',
  ".dt-sw.is-icon::before { content: ''; width: 14px; height: 14px; border-radius: 50%; background: currentColor; }",
  '.dt-sw.is-inverse { background: var(--color-bg-inverse); }',
  '.dt-copy { height: 24px; padding: 0 10px; white-space: nowrap; border: 1px solid var(--color-border-base); border-radius: var(--radius-sm); background: var(--color-bg-base); color: var(--color-text-muted); font: inherit; font-size: 12px; cursor: pointer; }',
  '.dt-copy:hover { border-color: var(--color-border-strong); color: var(--color-text-base); }',
  '.dt-fam + .dt-fam { margin-top: 20px; }',
  '.dt-fam__name { margin: 0 0 8px; font-size: 13px; font-weight: var(--font-weight-semibold); }',
  '.dt-fam__name span { margin-left: 8px; font-size: 12px; font-weight: 400; color: var(--color-text-muted); }',
  '.dt-ramp { display: grid; grid-template-columns: repeat(var(--n, 10), minmax(0, 1fr)); gap: 8px; }',
  '.dt-tile__sw { height: 48px; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); }',
  '.dt-tile b { display: block; margin-top: 6px; font-size: 12px; font-weight: var(--font-weight-semibold); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
  '.dt-tile span { display: block; font-size: 12px; color: var(--color-text-muted); font-variant-numeric: tabular-nums; }',
].join('\n');

function ensureStyle() {
  if (document.getElementById('dt-style')) return;
  const s = document.createElement('style');
  s.id = 'dt-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

// 「복사」 버튼 — 페이지에 한 번만 건다
if (typeof document !== 'undefined' && !window.__dtCopy) {
  window.__dtCopy = true;
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy);
    const was = b.textContent;
    b.textContent = '복사됨';
    setTimeout(() => { b.textContent = was; }, 1200);
  });
}

const px = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? Math.round(n * 10) / 10 + 'px' : v; };
const READ = {
  bg: (cs) => toHex(cs.backgroundColor),
  color: (cs) => toHex(cs.color),
  border: (cs) => toHex(cs.borderTopColor),
  height: (cs) => px(cs.height),
  'padding-x': (cs) => px(cs.paddingLeft),
  radius: (cs) => px(cs.borderTopLeftRadius),
  font: (cs) => px(cs.fontSize) + ' · ' + cs.fontWeight,
  gap: (cs) => px(cs.columnGap),
  outline: (cs) => px(cs.outlineWidth) + ' 선 · ' + px(cs.outlineOffset) + ' 간격',
};

// html을 그리고 다음 프레임에 [data-live] 칸을 채운다. 기준 = 같은 [data-row] 안의 [data-probe]
export function mountDoc(html) {
  ensureStyle();
  const el = document.createElement('div');
  el.className = 'dt-root';
  el.innerHTML = html;
  requestAnimationFrame(() => {
    el.querySelectorAll('[data-live]').forEach((cell) => {
      const row = cell.closest('[data-row]');
      const probe = row && row.querySelector('[data-probe]');
      const read = READ[cell.dataset.live];
      if (probe && read) cell.textContent = read(getComputedStyle(probe));
    });
  });
  return el;
}

// 토큰표 — 미리보기 · 토큰 · 쓰임 · 값 · 복사
const SW = { bg: ['is-bg', 'background', 'bg'], text: ['is-text', 'color', 'color'], border: ['is-border', 'border-color', 'border'], icon: ['is-icon', 'color', 'color'] };
export function tokenTable(kind, rows) {
  const [cls, prop, read] = SW[kind];
  return mountDoc(
    '<table class="dt"><thead><tr><th class="dt-c-sw">미리보기</th><th>토큰</th><th>쓰임</th><th class="dt-c-val">값</th><th class="dt-c-act"></th></tr></thead><tbody>' +
    rows.map(([name, use, extra = '']) =>
      '<tr data-row>' +
      '<td><div class="dt-sw ' + cls + (extra ? ' ' + extra : '') + '" data-probe style="' + prop + ':var(--' + name + ')">' + (kind === 'text' ? '가' : '') + '</div></td>' +
      '<td><code>--' + name + '</code></td>' +
      '<td class="dt-use">' + use + '</td>' +
      '<td class="dt-val" data-live="' + read + '"></td>' +
      '<td class="dt-c-act"><button type="button" class="dt-copy" data-copy="var(--' + name + ')">복사</button></td>' +
      '</tr>').join('') +
    '</tbody></table>');
}

// 램프 — 가족별 단계 타일. families: [{ name?, note?, prefix, steps }]
export function ramps(families) {
  return mountDoc(families.map((f) =>
    '<div class="dt-fam">' +
    (f.name ? '<p class="dt-fam__name">' + f.name + (f.note ? '<span>' + f.note + '</span>' : '') + '</p>' : '') +
    '<div class="dt-ramp" style="--n:' + Math.max(f.steps.length, 10) + '">' +
    f.steps.map((s) => {
      const tok = f.prefix + '-' + s;
      return '<div class="dt-tile" data-row><div class="dt-tile__sw" data-probe style="background:var(--' + tok + ')"></div><b>' + tok + '</b><span data-live="bg"></span></div>';
    }).join('') +
    '</div></div>').join(''));
}

// 설계표 — 항목 · 토큰 · 클래스 · 미리보기 · 값. rows: [{ name, en?, sub?, tokens?, preview?, probe?, live?, value? }]
// live: READ 키 — 미리보기(또는 probe)의 [data-probe] 요소에서 실제 값을 읽는다
export function specTable(rows) {
  return mountDoc(
    '<table class="dt"><thead><tr><th>항목</th><th>토큰 · 클래스</th><th>미리보기</th><th class="dt-c-val">값</th></tr></thead><tbody>' +
    rows.map((r) =>
      '<tr data-row>' +
      '<td><b>' + r.name + '</b>' + (r.en ? '<span class="dt-en">' + r.en + '</span>' : '') + (r.sub ? '<span class="dt-sub">' + r.sub + '</span>' : '') + '</td>' +
      '<td>' + ((r.tokens && r.tokens.length) ? r.tokens.map((t) => '<code>' + t + '</code>').join('<br>') : '<span class="dt-dash">—</span>') + '</td>' +
      '<td><div class="dt-prev">' + (r.preview || '<span class="dt-dash">—</span>') + (r.probe ? '<span class="dt-probe">' + r.probe + '</span>' : '') + '</div></td>' +
      '<td class="dt-val"' + (r.live ? ' data-live="' + r.live + '"' : '') + '>' + (r.value || '') + '</td>' +
      '</tr>').join('') +
    '</tbody></table>');
}
