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
// compact = Figma 버튼 · 설명 없이 브랜드 · 화면 모드 버튼만(다른 문서의 안내 문장 안)
const FIGMA_URL = 'https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5';
const ICON = {   // Storybook 아이콘 paintbrush · mirror(.storybook/preview.js 도구 막대 icon 과 같음)
  brand: 'M11.854.146a.5.5 0 00-.708 0L2.983 8.31a2.24 2.24 0 00-1.074.6C.677 10.14.24 11.902.085 12.997 0 13.6 0 14 0 14s.4 0 1.002-.085c1.095-.155 2.857-.592 4.089-1.824a2.24 2.24 0 00.6-1.074l8.163-8.163a.5.5 0 000-.708l-2-2zM5.6 9.692l.942-.942L5.25 7.457l-.942.943A2.242 2.242 0 015.6 9.692zm1.649-1.65L12.793 2.5 11.5 1.207 5.957 6.75 7.25 8.043zM4.384 9.617a1.25 1.25 0 010 1.768c-.767.766-1.832 1.185-2.78 1.403-.17.04-.335.072-.49.098.027-.154.06-.318.099-.49.219-.947.637-2.012 1.403-2.779a1.25 1.25 0 011.768 0z',
  mode: 'M1 1.504a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-11zm1 10.5h10v-10l-10 10z',
};
const TOOLS = [   // 글자 = .storybook/preview.js globalTypes 와 같게
  { key: 'brand', label: '브랜드', items: [['e3ps', 'E3PS'], ['fashion', 'Fashion · 패션 리테일'], ['precision', 'Precision · 자동차 부품']] },
  { key: 'mode', label: '화면 모드 (라이트 / 다크)', items: [['light', '라이트'], ['dark', '다크']] },
];
const readGlobals = () => {
  const c = document.documentElement.classList;
  return { brand: c.contains('theme-fashion') ? 'fashion' : c.contains('theme-precision') ? 'precision' : 'e3ps', mode: document.body.classList.contains('dark-mode') ? 'dark' : 'light' };
};
let selSeq = 0;
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
export const Toolbar = ({ compact = false, figmaIcon }) => {
  const [g, setG] = React.useState(readGlobals);
  React.useEffect(() => {
    const ch = addons.getChannel();
    const on = ({ globals }) => setG({ brand: globals.brand, mode: globals.mode });
    ch.on('globalsUpdated', on);
    return () => ch.off('globalsUpdated', on);
  }, []);
  const set = (key, value) => { addons.getChannel().emit('updateGlobals', { globals: { [key]: value } }); setG((o) => ({ ...o, [key]: value })); };
  const bar = h('span', { className: 'ds-tb' + (compact ? ' ds-tb--compact' : '') },
    compact ? null : h('a', { className: 'ds-tb__figma', href: FIGMA_URL, target: '_blank', rel: 'noreferrer' },
      figmaIcon ? h('img', { src: figmaIcon, alt: '', width: 18, height: 18 }) : null, 'Figma에서 보기 ↗'),
    compact ? null : h('span', { className: 'ds-tb__sep', 'aria-hidden': true }),
    TOOLS.map((t) => h(ToolSelect, { key: t.key, tool: t, value: g[t.key], onPick: set })));
  return compact ? bar : h('div', { className: 'ds-tbrow' }, bar, h('span', { className: 'ds-tb__note' }, '맨 위 막대와 같은 버튼이에요'));
};
