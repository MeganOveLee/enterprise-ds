#!/usr/bin/env node
/* ============================================================================
 * Figma 변수(tokens/figma/export.json) ↔ 토큰 최종 값(tokens/build/resolved.json) 대조 (DS-ADR-045)
 *
 *   npm run tokens:figma            다른 곳을 보고만 함
 *   npm run tokens:figma -- --strict  다른 곳이 있으면 실패 (이름 연결이 다 맞춰진 뒤 CI 에서 켬)
 *
 * export.json 은 Figma 개발 플러그인 figma-plugin/token-export 로 받는다.
 * 이름 연결 순서: ① 변수의 코드 문법(WEB) var(--이름) ② tokens/figma/map.json ③ 이름의 / · 공백 → -
 * 모드 연결: tokens/figma/map.json 의 modes, 없으면 모드 이름에 브랜드 이름 · light · dark 가 들어 있는지로.
 * ============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const EXPORT = path.join(ROOT, 'tokens/figma/export.json');
const MAP = path.join(ROOT, 'tokens/figma/map.json');
const STRICT = process.argv.includes('--strict');

if (!fs.existsSync(EXPORT)) {
  console.log('tokens/figma/export.json 이 아직 없음 — Figma 플러그인으로 내보낸 뒤 대조한다 (건너뜀)');
  process.exit(0);
}
const exp = JSON.parse(fs.readFileSync(EXPORT, 'utf8'));
const resolved = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/build/resolved.json'), 'utf8'));
const map = fs.existsSync(MAP) ? JSON.parse(fs.readFileSync(MAP, 'utf8')) : {};
const names = map.names ?? {};

/* ---- Figma 쪽: 이름 · 별칭 풀기 ------------------------------------------- */
const vars = {};   // "컬렉션/이름" → { col, v }
for (const col of exp.collections) for (const v of col.variables) vars[`${col.name}/${v.name}`] = { col, v };
const cssName = (key, v) => {
  if (key in names) return names[key];                       // null = 대조하지 않음
  const m = v.web && v.web.match(/var\(--([a-z0-9-]+)\)/i);
  if (m) return m[1];
  return v.name.toLowerCase().replace(/[\/\s]+/g, '-');
};
const pickMode = (col, brand, mode) => {
  const fixed = map.modes?.[col.name];
  if (fixed) return fixed[`${brand}/${mode}`] ?? fixed[brand] ?? fixed[mode] ?? col.modes[0];
  const lower = col.modes.map(m => m.toLowerCase());
  const i = lower.findIndex(m => m.includes(brand)); if (i >= 0) return col.modes[i];
  const j = lower.findIndex(m => m.includes(mode)); if (j >= 0) return col.modes[j];
  return col.modes[0];
};
function figmaValue(key, brand, mode, seen = []) {
  const { col, v } = vars[key];
  const val = v.values[pickMode(col, brand, mode)];
  if (val && val.alias) {
    if (seen.includes(val.alias) || !vars[val.alias]) return { broken: val.alias };
    return figmaValue(val.alias, brand, mode, [...seen, key]);
  }
  return { type: v.type, val };
}

/* ---- 값 맞추기 ---------------------------------------------------------- */
function rgba(s) {
  s = String(s).trim();
  if (s === 'transparent') return [0, 0, 0, 0];
  let m = s.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1]; if (h.length <= 4) h = [...h].map(c => c + c).join('');
    const n = i => parseInt(h.slice(i, i + 2), 16);
    return [n(0), n(2), n(4), h.length === 8 ? n(6) / 255 : 1];
  }
  m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) { const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; }
  return null;
}
function num(s) {
  const m = String(s).trim().match(/^(-?[\d.]+)(px|rem|s|ms)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === 'rem' ? n * 16 : m[2] === 'ms' ? n / 1000 : n;
}
function same(f, css) {
  if (f.type === 'COLOR') {
    const c = rgba(css); if (!c) return false;
    const [r, g, b] = rgba(f.val.hex);
    return c[0] === r && c[1] === g && c[2] === b && Math.abs(c[3] - f.val.alpha) < 0.01;
  }
  if (f.type === 'FLOAT') { const n = num(css); return n !== null && Math.abs(n - f.val) < 0.01; }
  return String(f.val).trim() === String(css).trim();
}
const show = f => f.broken ? `끊긴 별칭 ${f.broken}` : f.type === 'COLOR' ? `${f.val.hex}${f.val.alpha < 1 ? ' / ' + f.val.alpha : ''}` : String(f.val);

/* ---- 대조 --------------------------------------------------------------- */
const rows = [], cssOnly = new Set(Object.keys(resolved['default/light']));
let ok = 0, skipped = 0;
for (const [key, { v }] of Object.entries(vars)) {
  const css = cssName(key, v);
  if (css === null || v.type === 'BOOLEAN') { skipped++; continue; }
  if (!(css in resolved['default/light'])) { rows.push(['Figma 에만', key, `→ --${css}`, '']); continue; }
  cssOnly.delete(css);
  for (const combo of Object.keys(resolved)) {
    const [brand, mode] = combo.split('/');
    const f = figmaValue(key, brand, mode);
    if (!f.broken && same(f, resolved[combo][css])) ok++;
    else rows.push(['값이 다름', `${key} (${combo})`, show(f), resolved[combo][css]]);
  }
}
const lines = [
  `## Figma 변수 ↔ 토큰 대조 — ${exp.file} (${exp.exportedAt.slice(0, 10)})`,
  '', `일치 ${ok} · 다름 ${rows.filter(r => r[0] === '값이 다름').length} · Figma 에만 ${rows.filter(r => r[0] === 'Figma 에만').length} · CSS 에만 ${cssOnly.size} · 건너뜀 ${skipped}`, '',
  '| 구분 | Figma 변수 | Figma 값 | CSS 값 |', '| --- | --- | --- | --- |',
  ...rows.slice(0, 200).map(r => `| ${r.join(' | ')} |`),
  ...(cssOnly.size ? ['', `CSS 에만 있는 이름(앞 40개): ${[...cssOnly].sort().slice(0, 40).map(n => '--' + n).join(' · ')}${cssOnly.size > 40 ? ' …' : ''}`] : []),
];
const report = lines.join('\n');
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
if (STRICT && rows.length) process.exit(1);
