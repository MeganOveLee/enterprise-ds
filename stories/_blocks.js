// 문서(MDX) 블록 — 페이지 머리 · 섹션 · 예시 카드. 모양은 .storybook/preview-head.html 의 .ds-* 규칙
// 카드 = 머리(제목 · 설명) + 미리보기(스토리) + 코드 보기(접힘). 제목이 없으면 머리를 그리지 않는다
import React from 'react';
import { Story, Source } from '@storybook/addon-docs/blocks';

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
