// 문서(MDX) 블록 — 페이지 머리 · 섹션 · 예시 카드. 모양은 .storybook/preview-head.html 의 .ds-* 규칙
// 카드 = 머리(제목 · 설명) + 미리보기(스토리) + 코드 보기(접힘). 제목이 없으면 머리를 그리지 않는다
import React from 'react';
import { Story, Source } from '@storybook/addon-docs/blocks';
import { addons } from 'storybook/preview-api';

const h = React.createElement;

export const PageHead = ({ eyebrow, title, lead, children }) =>
  h('header', { className: 'ds-head' },
    eyebrow ? h('p', { className: 'ds-eyebrow' }, eyebrow) : null,
    h('h1', null, title),
    lead ? h('p', { className: 'ds-lead' }, lead) : null,
    children);

export const Section = ({ title, en, desc, children }) =>
  h('section', { className: 'ds-sec' },
    h('h2', null, title, en ? h('span', { className: 'ds-en' }, en) : null),
    desc ? h('p', { className: 'ds-sec__desc' }, desc) : null,
    children);

export const Card = ({ of, title, en, desc, code = true, children }) =>
  h('section', { className: 'ds-card' },
    title ? h('header', { className: 'ds-card__head' },
      h('h3', { className: 'ds-card__title' }, title, en ? h('span', { className: 'ds-en' }, en) : null),
      desc ? h('p', { className: 'ds-card__desc' }, desc) : null) : null,
    of ? h('div', { className: 'ds-card__body' }, h(Story, { of })) : null,
    children ? h('div', { className: 'ds-card__extra' }, children) : null,
    of && code ? h('details', { className: 'ds-card__code' }, h('summary', null, '코드 보기'), h(Source, { of })) : null);

// 문서 안 도구 막대 — 화면 맨 위 Storybook 도구 막대와 같은 모양 · 같은 아이콘 · 같은 글자 · 같은 열림 목록(10/15 08:17 피드백).
// 값 = 실제 막대에서 잰 것(버튼 28 · 안쪽 0 7 · 모서리 4 · 바탕 rgba(0,109,235,.07) · 글자 12 굵게 rgb(0,85,184) · 아이콘 14,
// 목록 180 · 안쪽 4 · 줄 32 · 모서리 6). 고르면 실제 막대 · 주소(URL)도 같이 바뀐다(updateGlobals)
// 소개 한 곳에만 둔다 — 처음 온 사람에게 「여기를 눌러 보라」고 알리는 용도(10/15 08:37). 다른 문서는 맨 위 막대로 충분
// 막대 전체 = 맨 위 막대와 같은 줄(10:17 피드백): 왼쪽 격자 · 배경 · 윤곽선 아이콘, Figma · 구분선 · 브랜드 · 화면 모드, 오른쪽 끝 전체 화면. 폭은 미리보기 카드 전체
const FIGMA_URL = 'https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5';
const ICON = {   // Storybook 아이콘 paintbrush · mirror(.storybook/preview.js 도구 막대 icon 과 같음)
  brand: 'M11.854.146a.5.5 0 00-.708 0L2.983 8.31a2.24 2.24 0 00-1.074.6C.677 10.14.24 11.902.085 12.997 0 13.6 0 14 0 14s.4 0 1.002-.085c1.095-.155 2.857-.592 4.089-1.824a2.24 2.24 0 00.6-1.074l8.163-8.163a.5.5 0 000-.708l-2-2zM5.6 9.692l.942-.942L5.25 7.457l-.942.943A2.242 2.242 0 015.6 9.692zm1.649-1.65L12.793 2.5 11.5 1.207 5.957 6.75 7.25 8.043zM4.384 9.617a1.25 1.25 0 010 1.768c-.767.766-1.832 1.185-2.78 1.403-.17.04-.335.072-.49.098.027-.154.06-.318.099-.49.219-.947.637-2.012 1.403-2.779a1.25 1.25 0 011.768 0z',
  mode: 'M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zm1 10.5h10v-10l-10 10z',
};
// 맨 위 막대의 나머지 버튼(격자 · 배경 · 윤곽선 · 전체 화면) — 실제 막대에서 뽑은 Storybook 아이콘 그대로. 문서 안에서는 모양만(누르지 않음)
const DECO = {
  grid: ['M1 1.504a.5.5 0 01.5-.5H6a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5H1.5a.5.5 0 01-.5-.5v-4.5zm1 4v-3.5h3.5v3.5H2zM7.5 1.504a.5.5 0 01.5-.5h4.5a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5v-4.5zm1 4v-3.5H12v3.5H8.5zM1.5 7.504a.5.5 0 00-.5.5v4.5a.5.5 0 00.5.5H6a.5.5 0 00.5-.5v-4.5a.5.5 0 00-.5-.5H1.5zm.5 1v3.5h3.5v-3.5H2zM7.5 8.004a.5.5 0 01.5-.5h4.5a.5.5 0 01.5.5v4.5a.5.5 0 01-.5.5H8a.5.5 0 01-.5-.5v-4.5zm1 4v-3.5H12v3.5H8.5z'],
  bg: ['M6.25 4.254a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zm-.5 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z', 'M13 1.504v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11a.5.5 0 01.5-.5h11a.5.5 0 01.5.5zM2 9.297V2.004h10v5.293L9.854 5.15a.5.5 0 00-.708 0L6.5 7.797 5.354 6.65a.5.5 0 00-.708 0L2 9.297zM9.5 6.21l2.5 2.5v3.293H2V10.71l3-3 3.146 3.146a.5.5 0 00.708-.707L7.207 8.504 9.5 6.21z'],
  outline: ['M2 2.004v2H1v-2.5a.5.5 0 01.5-.5H4v1H2zM1 9.004v-4h1v4H1zM1 10.004v2.5a.5.5 0 00.5.5H4v-1H2v-2H1zM10 13.004h2.5a.5.5 0 00.5-.5v-2.5h-1v2h-2v1zM12 4.004h1v-2.5a.5.5 0 00-.5-.5H10v1h2v2zM9 12.004v1H5v-1h4zM9 1.004v1H5v-1h4zM13 9.004h-1v-4h1v4zM7 8.004a1 1 0 100-2 1 1 0 000 2z'],
  full: ['M1.5 1h2a.5.5 0 010 1h-.793l3.147 3.146a.5.5 0 11-.708.708L2 2.707V3.5a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM10 1.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-.793L8.854 5.854a.5.5 0 11-.708-.708L11.293 2H10.5a.5.5 0 01-.5-.5zM12.5 10a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1h.793L8.146 8.854a.5.5 0 11.708-.708L12 11.293V10.5a.5.5 0 01.5-.5zM2 11.293V10.5a.5.5 0 00-1 0v2a.5.5 0 00.5.5h2a.5.5 0 000-1h-.793l3.147-3.146a.5.5 0 10-.708-.708L2 11.293z'],
};
const deco = (k) => h('span', { key: k, className: 'ds-tb__ico' }, h('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none' }, DECO[k].map((d, i) => h('path', { key: i, fillRule: 'evenodd', clipRule: 'evenodd', d, fill: 'currentColor' }))));
const TOOLS = [   // 글자 = .storybook/preview.js globalTypes 와 같게
  { key: 'brand', label: '브랜드', items: [['e3ps', 'E3PS'], ['fashion', 'Fashion · 패션 리테일'], ['precision', 'Precision · 자동차 부품']] },
  { key: 'mode', label: '화면 모드 (라이트 / 다크)', items: [['light', '라이트'], ['dark', '다크']] },
];
const readGlobals = () => {
  const c = document.documentElement.classList;
  return { brand: c.contains('theme-fashion') ? 'fashion' : c.contains('theme-precision') ? 'precision' : 'e3ps', mode: document.body.classList.contains('dark-mode') ? 'dark' : 'light' };
};
let selSeq = 0;
// 처음 온 사람에게 「여기를 눌러 보세요」(TD-42 08:35 ④ 제안) — 한 번 누르면 다시 안 보임(다시 그려져도 · 새로 열어도)
let hintSeen = (() => { try { return localStorage.getItem('eds-tb-hint') === '1'; } catch (e) { return false; } })();
let refocus = null;   // 고른 뒤 문서가 다시 그려져도 키보드 포커스를 같은 버튼으로 되돌림(바디로 빠지지 않게)
const ToolSelect = ({ tool, value, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const id = React.useRef('ds-tbsel-' + (++selSeq)).current;
  const wrap = React.useRef(null), btn = React.useRef(null), list = React.useRef(null);
  const cur = tool.items.findIndex(([v]) => v === value);
  React.useEffect(() => { if (refocus && refocus.key === tool.key && Date.now() - refocus.t < 3000) { refocus = null; if (btn.current) btn.current.focus(); } }, []);
  React.useEffect(() => {
    if (!open) return undefined;
    const out = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', out);
    if (list.current) list.current.focus();
    return () => document.removeEventListener('mousedown', out);
  }, [open]);
  const openList = () => { setActive(Math.max(cur, 0)); setOpen(true); };
  const pick = (i) => { refocus = { key: tool.key, t: Date.now() }; onPick(tool.key, tool.items[i][0]); setOpen(false); if (btn.current) btn.current.focus(); };
  const onListKey = (e) => {
    const n = tool.items.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % n); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + n) % n); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(n - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); if (e.key === 'Escape' && btn.current) btn.current.focus(); }
  };
  const title = cur >= 0 ? tool.items[cur][1] : tool.items[0][1];
  return h('span', { className: 'ds-tbsel', ref: wrap },
    h('button', { type: 'button', ref: btn, className: 'ds-tbsel__btn', 'aria-label': tool.label + ' ' + title, 'aria-haspopup': 'listbox', 'aria-expanded': open, 'aria-controls': open ? id : undefined,
      onClick: () => (open ? setOpen(false) : openList()),
      onKeyDown: (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); openList(); } } },
      h('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', 'aria-hidden': true }, h('path', { fillRule: 'evenodd', clipRule: 'evenodd', d: ICON[tool.key], fill: 'currentColor' })),
      title),
    open ? h('span', { className: 'ds-tbsel__list', role: 'listbox', id, 'aria-label': tool.label, tabIndex: -1, ref: list, onKeyDown: onListKey, 'aria-activedescendant': id + '-' + active },
      tool.items.map(([v, t], i) => h('span', { key: v, id: id + '-' + i, role: 'option', 'aria-selected': i === cur, className: 'ds-tbsel__opt' + (i === active ? ' is-active' : ''),
        onMouseEnter: () => setActive(i), onClick: () => pick(i) }, t))) : null);
};
export const Toolbar = ({ figmaIcon }) => {
  const [g, setG] = React.useState(readGlobals);
  React.useEffect(() => {
    const ch = addons.getChannel();
    const on = ({ globals }) => setG({ brand: globals.brand, mode: globals.mode });
    ch.on('globalsUpdated', on);
    return () => ch.off('globalsUpdated', on);
  }, []);
  const [hint, setHint] = React.useState(!hintSeen);
  const done = (e) => { if (!hint || !e.target.closest('.ds-tbsel')) return; hintSeen = true; try { localStorage.setItem('eds-tb-hint', '1'); } catch (err) { /* 저장 안 돼도 이번 화면에서는 사라짐 */ } setHint(false); };
  const set = (key, value) => { addons.getChannel().emit('updateGlobals', { globals: { [key]: value } }); setG((o) => ({ ...o, [key]: value })); };
  const bar = h('div', { className: 'ds-tb' + (hint ? ' ds-tb--hint' : ''), onPointerDownCapture: done,
      onKeyDownCapture: (e) => { if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) done(e); } },
    h('span', { className: 'ds-tb__deco', 'aria-hidden': true }, ['grid', 'bg', 'outline'].map(deco)),
    h('a', { className: 'ds-tb__figma', href: FIGMA_URL, target: '_blank', rel: 'noreferrer' },
      figmaIcon ? h('img', { src: figmaIcon, alt: '', width: 18, height: 18 }) : null, 'Figma에서 보기 ↗'),
    h('span', { className: 'ds-tb__sep', 'aria-hidden': true }),
    h('span', { className: 'ds-tb__sels' }, TOOLS.map((t) => h(ToolSelect, { key: t.key, tool: t, value: g[t.key], onPick: set }))),
    hint ? h('span', { className: 'ds-tb__hint', 'aria-hidden': true }, '눌러 보세요') : null,
    h('span', { className: 'ds-tb__deco ds-tb__end', 'aria-hidden': true }, deco('full')));
  return h('div', { className: 'ds-tbrow' }, bar);
};
