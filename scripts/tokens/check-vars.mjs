#!/usr/bin/env node
/* 정의되지 않은 CSS 변수 검사 — Claude 작업용 6-5 측정 방법 2번을 자동으로 (DS-ADR-045)
 * 쓰는 이름(var(--x)) − 정의된 이름(--x:) 이 비어 있어야 통과. 대체값이 있는 var(--x, …) 는 뺀다 */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const files = ['css/tokens.css', 'css/globals.css', 'css/components.css',
  ...fs.readdirSync(path.join(ROOT, 'css/brands')).filter(f => f.endsWith('.css')).map(f => `css/brands/${f}`)];
/* 예외 — 마크업이 넣는 이름. DS 에는 값이 없고 제품이 요소마다 그림 경로를 style 로 넣는다
 *   --lnb-icon  LNB 레일 메뉴 아이콘 (components.css .menu_icon)
 *   --row-icon  사용자 메뉴 줄 아이콘 (components.css .section-title) */
const FROM_MARKUP = new Set(['--lnb-icon', '--row-icon']);
const strip = s => s.replace(/\/\*[\s\S]*?\*\//g, '');
const defined = new Set(), used = new Map();
for (const f of files) {
  const src = strip(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  for (const [, n] of src.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(n);
  for (const [, n, rest] of src.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,|\))/gi)) {
    if (rest === ',') continue;
    if (!used.has(n)) used.set(n, f);
  }
}
const missing = [...used].filter(([n]) => !defined.has(n) && !FROM_MARKUP.has(n));
if (missing.length) {
  console.error(`정의되지 않은 변수 ${missing.length}개:\n` + missing.map(([n, f]) => `  ${n}  (${f})`).join('\n'));
  process.exit(1);
}
console.log(`정의되지 않은 변수 없음 — 쓰는 이름 ${used.size}개 · 파일 ${files.length}개`);
