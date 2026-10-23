#!/usr/bin/env node
/* ============================================================================
 * tokens/*.json (값의 원본) → css/tokens.css · css/brands/*.css (생성 파일)
 *                           → tokens/build/resolved.json (브랜드 × 모드 최종 값, Figma 대조용)
 *
 *   npm run tokens          만들기
 *   npm run tokens:check    만들어 보고 저장소의 CSS 와 다르면 실패 (CI)
 *
 * Style Dictionary 가 하는 일: JSON 읽기 · 참조 검사(없는 이름을 가리키면 빌드 실패) · CSS 쓰기.
 * 값은 바꾸지 않는다 — 참조 {이름} 을 var(--이름) 으로 되돌려 쓰기만 해서, 다크 모드 · 브랜드 전환이
 * 지금처럼 CSS 캐스케이드로 계산된다 (DS-ADR-045).
 * ============================================================================ */
import fs from 'node:fs';
import path from 'node:path';
import StyleDictionary from 'style-dictionary';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const T = p => path.join(ROOT, 'tokens', p);
const CHECK = process.argv.includes('--check');

const brandFiles = fs.readdirSync(T('brands')).filter(f => f.endsWith('.json') && !f.startsWith('_')).sort();
const DEFAULT_BRAND = T('brands/default.json');
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8'));

/* ---- CSS 한 블록 쓰기 ------------------------------------------------------ */
const toCssValue = v => String(v).replace(/\{([a-z0-9-]+)\}/gi, 'var(--$1)');
const indentBlock = (raw, pad = '  ') => raw.split('\n').map((l, i) => (i ? pad + l : l)).join('\n');

function cssBlock(file) {
  const src = readJson(file);
  const eds = src.$extensions?.eds ?? {};
  const lines = [];
  if (src.$description) lines.push(src.$description, '');
  lines.push(`${eds.selector} {`);
  const names = Object.keys(src).filter(k => !k.startsWith('$'));
  names.forEach((name, i) => {
    const t = src[name];
    for (const c of t.$extensions?.eds?.before ?? []) {
      if (i) lines.push('');
      lines.push('  ' + indentBlock(c));
    }
    const decl = `  --${name}: ${toCssValue(t.$value)};`;
    if (!t.$description) { lines.push(decl); return; }
    const [first, ...rest] = t.$description.split('\n');
    const head = decl.length < 46 ? decl.padEnd(46) : decl + ' ';
    const pad = ' '.repeat(head.length + 3);
    lines.push(`${head}/* ${[first, ...rest.map(l => pad + l)].join('\n')} */`);
  });
  for (const c of eds.after ?? []) lines.push('', '  ' + indentBlock(c));
  lines.push('}');
  return lines.join('\n');
}

/* ---- Style Dictionary: 파일마다 한 번 — 참조 검사 + 블록 쓰기 ----------------- */
StyleDictionary.registerFormat({
  name: 'eds/css-block',
  format: ({ options }) => cssBlock(options.file),
});

/* 주석(설명 · 블록 주석)에 든 {브랜드} 같은 글자를 참조로 읽지 않도록, 참조 검사 전에 주석을 뺀다.
   주석은 CSS 를 쓸 때 원본 JSON 에서 다시 읽는다 */
StyleDictionary.registerPreprocessor({
  name: 'eds/strip-comments',
  preprocessor: dict => {
    const walk = o => {
      if (!o || typeof o !== 'object') return;
      delete o.$description;
      if (o.$extensions) delete o.$extensions.eds;
      Object.values(o).forEach(walk);
    };
    walk(dict);
    return dict;
  },
});

async function render(file, include) {
  const sd = new StyleDictionary({
    preprocessors: ['eds/strip-comments'],
    include,
    source: [file],
    log: { warnings: 'disabled', verbosity: process.env.TOKENS_VERBOSE ? 'verbose' : 'silent' },
    platforms: {
      css: {
        transforms: ['name/kebab'],
        files: [{ destination: 'out.css', format: 'eds/css-block', options: { file } }],
      },
    },
  });
  const [out] = await sd.formatPlatform('css');   // 참조가 끊겼으면 여기서 오류
  return out.output;
}

const GEN = '/* ⚙️ 생성 파일 — 고치지 말 것. 원본은 tokens/{SRC}, 만들기는 npm run tokens (DS-ADR-045) */';
const files = {};
const core = T('core.json');
const parts = [
  await render(core, [DEFAULT_BRAND]),
  await render(T('vendor.json'), [core, DEFAULT_BRAND]),
  await render(T('dark.json'), [core, DEFAULT_BRAND]),
];
files['css/tokens.css'] = ['@charset "UTF-8";', GEN.replace('{SRC}', 'core.json · vendor.json · dark.json'), parts.join('\n\n\n')].join('\n') + '\n';
for (const f of brandFiles) {
  files[`css/brands/${f.replace('.json', '.css')}`] =
    ['@charset "UTF-8";', GEN.replace('{SRC}', `brands/${f}`), await render(T(`brands/${f}`), [core])].join('\n') + '\n';
}

/* ---- 최종 값 (브랜드 × 모드) — CSS 캐스케이드와 같은 규칙으로 푼다 ---------------
 *   html(:root) 층 = core + 브랜드     → 시맨틱이 여기서 계산됨
 *   body 층       = vendor (+ dark)   → body 에 다시 선언된 이름만 body 값으로 다시 계산, 나머지는 html 값을 물려받음 */
const tokensOf = f => Object.fromEntries(Object.entries(readJson(f)).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, v.$value]));
function resolver(decls, parent) {
  const memo = {};
  const get = (name, stack = []) => {
    if (!(name in decls)) {
      if (parent) return parent(name);
      throw new Error(`정의되지 않은 토큰: ${name} (${stack.join(' → ')})`);
    }
    if (name in memo) return memo[name];
    if (stack.includes(name)) throw new Error(`순환 참조: ${[...stack, name].join(' → ')}`);
    return (memo[name] = String(decls[name]).replace(/\{([a-z0-9-]+)\}/gi, (_, r) => get(r, [...stack, name])));
  };
  return get;
}
const resolved = {};
const coreT = tokensOf(core), vendorT = tokensOf(T('vendor.json')), darkT = tokensOf(T('dark.json'));
for (const f of brandFiles) {
  const brand = f.replace('.json', '');
  const html = resolver({ ...coreT, ...tokensOf(T(`brands/${f}`)) });
  for (const mode of ['light', 'dark']) {
    const bodyDecls = mode === 'dark' ? { ...vendorT, ...darkT } : vendorT;
    const body = resolver(bodyDecls, html);
    const names = [...new Set([...Object.keys(coreT), ...Object.keys(tokensOf(T(`brands/${f}`))), ...Object.keys(bodyDecls)])].sort();
    resolved[`${brand}/${mode}`] = Object.fromEntries(names.map(n => [n, body(n)]));
  }
}
files['tokens/build/resolved.json'] = JSON.stringify(resolved, null, 2) + '\n';

/* ---- 쓰기 또는 대조 ------------------------------------------------------- */
let stale = [];
for (const [rel, text] of Object.entries(files)) {
  const dest = path.join(ROOT, rel);
  const now = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
  if (CHECK) { if (now !== text) stale.push(rel); continue; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (now !== text) fs.writeFileSync(dest, text);
}
if (CHECK && stale.length) {
  console.error(`토큰 JSON 과 생성 파일이 다릅니다. npm run tokens 로 다시 만들고 함께 커밋하세요:\n  ${stale.join('\n  ')}`);
  process.exit(1);
}
console.log(CHECK ? '토큰 생성 파일 = JSON 과 일치' : `만듦: ${Object.keys(files).join(' · ')}`);
