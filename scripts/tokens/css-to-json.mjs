#!/usr/bin/env node
/* ============================================================================
 * CSS 토큰 파일 → DTCG JSON (tokens/)
 *
 * 한 번 옮길 때와, 저장소 밖에 둔 비공개 브랜드 CSS(고객사 브랜드)를 JSON 으로 바꿀 때 쓴다.
 * 평소에는 쓰지 않는다 — 값의 원본은 tokens/*.json 이고 CSS 는 build.mjs 가 만든다 (DS-ADR-045).
 *
 *   node scripts/tokens/css-to-json.mjs css/tokens.css          → tokens/core.json · vendor.json · dark.json
 *   node scripts/tokens/css-to-json.mjs css/brands/acme.css     → tokens/brands/acme.json
 *
 * 옮기는 규칙
 *   var(--이름)              → {이름}            (DTCG 참조)
 *   값 바로 뒤 같은 줄 주석    → $description     (생성 CSS 에 다시 주석으로 찍힘)
 *   선언 앞 블록 주석         → $extensions.eds.before (원문 그대로, 생성 CSS 에 그대로 찍힘)
 *   규칙 앞 머리 주석         → 파일 맨 위 $description
 * ============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const BLOCK_FILE = { ':root': 'core', 'body': 'vendor', 'body.dark-mode': 'dark' };

/* 규칙 들여쓰기(2칸)를 뺀 원문 주석 */
const rawComment = (c, indent = '  ') =>
  c.toString().split('\n').map((l, i) => (i && l.startsWith(indent) ? l.slice(indent.length) : l)).join('\n');

/* 같은 줄 주석 → 사람이 읽는 설명 (줄마다 앞뒤 공백 제거) */
const descText = c => c.text.split('\n').map(l => l.trim()).filter(Boolean).join('\n');

export const typeOf = (name, v) => {
  if (/^font-family/.test(name)) return 'fontFamily';
  if (/^cubic-bezier\(/.test(v)) return 'cubicBezier';
  if (/^(#[0-9a-f]{3,8}|rgba?\(.*\)|transparent)$/i.test(v)) return 'color';
  if (/^-?[\d.]+(px|rem|em|%)$/.test(v) || v === '0') return 'dimension';
  if (/^[\d.]+m?s$/.test(v)) return 'duration';
  if (/^-?[\d.]+$/.test(v)) return 'number';
  return undefined;   // 계산식 · 그림자 · 키워드 — 문자열 그대로
};

function ruleToJson(rule, header) {
  const out = {};
  if (header.length) out.$description = header.join('\n\n');
  out.$extensions = { eds: { selector: rule.selector } };
  let pending = [];      // 다음 선언 앞에 찍을 블록 주석
  let last = null;       // 마지막 선언 (같은 줄 주석을 붙일 곳)
  for (const n of rule.nodes) {
    if (n.type === 'comment') {
      if (last && n.source.start.line === last.decl.source.end.line) {
        last.token.$description = descText(n);
      } else {
        pending.push(rawComment(n));
      }
      continue;
    }
    if (n.type !== 'decl' || !n.prop.startsWith('--')) throw new Error(`토큰이 아닌 선언: ${n.toString()}`);
    if (/var\([^)]*,/.test(n.value)) throw new Error(`대체값이 있는 var() 는 옮기지 않음: ${n.toString()}`);
    const name = n.prop.slice(2);
    const value = n.value.replace(/var\(--([a-z0-9-]+)\)/gi, '{$1}');
    const token = { $value: value };
    const t = typeOf(name, value);
    if (t) token.$type = t;
    if (pending.length) { token.$extensions = { eds: { before: pending } }; pending = []; }
    out[name] = token;
    last = { decl: n, token };
  }
  if (pending.length) out.$extensions.eds.after = pending;
  return out;
}

const [, , src] = process.argv;
if (!src) { console.error('사용법: node scripts/tokens/css-to-json.mjs <파일.css>'); process.exit(1); }
const root = postcss.parse(fs.readFileSync(src, 'utf8'), { from: src });
const isBrand = src.includes(`${path.sep}brands${path.sep}`) || src.includes('/brands/');
let header = [];
const written = [];
for (const n of root.nodes) {
  if (n.type === 'atrule' && n.name === 'charset') continue;
  if (n.type === 'comment') { header.push(n.toString()); continue; }
  if (n.type !== 'rule') throw new Error(`알 수 없는 노드: ${n.type}`);
  const sel = n.selector.replace(/\s+/g, ' ').trim();
  const base = isBrand ? `brands/${path.basename(src, '.css')}` : BLOCK_FILE[sel];
  if (!base) throw new Error(`알 수 없는 선택자: ${sel}`);
  const json = ruleToJson(n, header);
  json.$extensions.eds.selector = n.selector;   // 줄바꿈 포함 원문 (예: ":root,\n:root.theme-default")
  header = [];
  const dest = path.join('tokens', `${base}.json`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(json, null, 2) + '\n');
  written.push(`${dest} (${Object.keys(json).filter(k => !k.startsWith('$')).length})`);
}
console.log(written.join('\n'));
