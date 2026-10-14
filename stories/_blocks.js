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

// 문서 안 도구 막대 — 화면 맨 위 도구 막대와 같은 버튼을 문서 안에 그대로 보여 주고, 눌러도 실제로 바뀐다(10/14 15:46 지적: 「위쪽 도구 막대」라는 말 대신 모양을 보여 주기)
// compact = 브랜드 · 모드 버튼만(다른 문서의 안내 줄 안)
const FIGMA_URL = 'https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5';
const BRANDS = [['e3ps', 'E3PS'], ['fashion', 'Fashion'], ['precision', '자동차 부품']];
const MODES = [['light', '라이트'], ['dark', '다크']];
const readGlobals = () => {
  const c = document.documentElement.classList;
  return { brand: c.contains('theme-fashion') ? 'fashion' : c.contains('theme-precision') ? 'precision' : 'e3ps', mode: document.body.classList.contains('dark-mode') ? 'dark' : 'light' };
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
  const group = (label, key, items) => h('span', { className: 'ds-tb__group', role: 'group', 'aria-label': label },
    h('span', { className: 'ds-tb__label', 'aria-hidden': 'true' }, label),
    items.map(([v, t]) => h('button', { key: v, type: 'button', className: 'ds-tb__btn', 'aria-pressed': g[key] === v, onClick: () => set(key, v) }, t)));
  return h(compact ? 'span' : 'div', { className: 'ds-tb' + (compact ? ' ds-tb--compact' : '') },   // compact 는 안내 문장(<p>) 안에 들어가서 span
    compact ? null : h('a', { className: 'ds-tb__figma', href: FIGMA_URL, target: '_blank', rel: 'noreferrer' },
      figmaIcon ? h('img', { src: figmaIcon, alt: '', width: 16, height: 16 }) : null, 'Figma에서 보기 ↗'),
    group('브랜드', 'brand', BRANDS),
    group('화면 모드', 'mode', MODES),
    compact ? null : h('span', { className: 'ds-tb__hint' }, '화면 맨 위 막대에도 같은 버튼이 있어 어느 페이지에서나 바꿀 수 있습니다'));
};
