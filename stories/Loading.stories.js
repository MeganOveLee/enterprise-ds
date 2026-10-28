// Feedback/Loading — 문서 화면은 Loading.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · Playground
// 브랜드 로더 — 브랜드(제품)에 로고 로더가 있으면 마크 조각이 맞춰지는 로더(DS-ADR-043), 없으면 스피너 --lg (Fashion · Precision)
// 마크 = 가상 제품 마크(Screens 레일과 같은 모양)의 심볼 조각 다섯(_lnbicons.js MARK_PATHS, 10/28 새 로고)
import { MARK_PATHS } from './_lnbicons.js';
const MARK_PIECES = '<svg viewBox="0 0 130 129">' + MARK_PATHS.map((d, i) => '<path class="brand-loader__piece brand-loader__piece--' + (i + 1) + '" d="' + d + '"/>').join('') + '</svg>';
const LOGO = { default: true };
const brandLoader = () => '<span class="brand-loader" aria-hidden="true">' + MARK_PIECES + '</span>';

import { doDont } from './_dodont.js';

const spin = (size = '', tone = '') =>
  `<span class="spinner${size ? ' spinner--' + size : ''}${tone ? ' spinner--' + tone : ''}" aria-hidden="true"></span>`;

export default {
  title: 'Feedback/Loading',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Loading.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

const cap = (inner, t) => `<div style="display:flex;flex-direction:column;align-items:center;gap:8px">${inner}<span class="sb-note">${t}</span></div>`;
export const 스피너_크기 = {
  render: () => `<div style="display:flex;gap:40px;align-items:flex-end">
    ${cap(spin('sm'), '.spinner--sm 16')} ${cap(spin(), '.spinner 24')} ${cap(spin('lg'), '.spinner--lg 40')}
  </div>`,
};
export const 스피너_색 = {
  render: () => `<div style="display:flex;gap:40px;align-items:flex-end">
    ${cap(spin(), '.spinner (브랜드)')} ${cap(spin('', 'neutral'), '.spinner--neutral (회색)')}
  </div>`,
};

export const 구성_3단계 = {
  render: () => `<div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:32px">
    <div class="loading" role="status">${spin()}<span class="sr-only">불러오는 중</span></div>
    <div class="loading" role="status" aria-live="polite">${spin()}<p class="loading__text">문서 목록을 불러오는 중입니다</p></div>
    <div class="loading" role="status" aria-live="polite">${spin('lg')}
      <p class="loading__text">도면 2,481건을 엑셀로 만드는 중입니다</p>
      <p class="loading__sub">1분 정도 걸릴 수 있습니다</p>
      <div class="loading__actions"><button type="button" class="btn btn--secondary btn--transparent">취소</button></div>
    </div>
  </div>`,
};

const ROWS_T = [['DOC-2610-0013', '브레이크 캘리퍼 조립 사양서'], ['DOC-2610-0012', '하우징 재질 변경 검토 보고서'], ['DOC-2610-0011', '커넥터 핀 배열 설계 기준']];
const table = (rows = ROWS_T) => `<div class="table_list"><div class="list"><table class="grid-table"><colgroup><col style="width:140px"><col></colgroup>
      <thead><tr><th>문서 번호</th><th>문서 명</th></tr></thead>
      <tbody>${rows.map(([n, t]) => `<tr><td><a href="#" class="grid-custom-rows-link" tabindex="-1">${n}</a></td><td class="is-left">${t}</td></tr>`).join('')}</tbody></table></div></div>`;
export const 영역_오버레이 = {
  name: '영역 오버레이 (Overlay)',
  render: () => `<div style="position:relative;max-width:520px">
    ${table()}
    <div class="loading loading--overlay" role="status" aria-live="polite">${spin()}<p class="loading__text">다시 불러오는 중</p></div>
  </div>`,
};

// 스피너 ↔ 로고 로더 — 쓰는 곳이 다름. 로고 로더는 로고가 있는 브랜드(Default) 모양으로 그림 (TD-108 14번)
const fig = (inner, name, use) => `<div style="flex:1 1 280px;min-width:0;display:flex;flex-direction:column;gap:8px">${inner}
  <p style="margin:0;font-size:var(--body-sm);color:var(--color-text-base)"><b>${name}</b></p><p class="sb-note" style="margin:0">${use}</p></div>`;
export const 스피너와_로고_로더 = {
  render: () => `<div style="display:flex;flex-wrap:wrap;gap:24px;max-width:760px">
    ${fig(`<div style="position:relative">${table()}<div class="loading loading--overlay" role="status" aria-live="polite">${spin()}<p class="loading__text">다시 불러오는 중</p></div></div>`,
      '스피너 <code>.spinner</code>', '표 · 카드 · 창 본문 같은 영역, 버튼 · 셀 안. 처리 중임만 알립니다.')}
    ${fig(`<div style="position:relative;height:124px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden"><div class="loading loading--overlay" role="status" aria-live="polite">${brandLoader()}<p class="loading__text">화면을 불러오는 중입니다</p></div></div>`,
      '로고 로더 <code>.brand-loader</code>', '페이지 전체를 처음 불러올 때(로그인 직후 · 화면 전환)만. 로고 로더가 없는 브랜드는 스피너 lg를 씁니다.')}
  </div>`,
};

export const 페이지_로딩 = {
  render: (_, { globals }) => {
    const logo = LOGO[globals.brand];
    return `<div style="position:relative;height:240px;max-width:640px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">
      <div class="loading loading--overlay" role="status" aria-live="polite">${logo ? brandLoader() : spin('lg')}<p class="loading__text">화면을 불러오는 중입니다</p></div>
    </div>`;
  },
  parameters: { docs: { description: { story:
    '페이지 전체를 처음 불러올 때만 — 브랜드에 로고 로더가 있으면 마크 조각이 하나로 맞물리고(Default), 없으면 스피너 `--lg`(Fashion · Precision). ' +
    '영역 · 버튼 안은 언제나 스피너. 모션 줄이기 설정이면 멈추지 않고 느리게.' } } },
};

export const 버튼_안 = {
  render: () => `<button type="button" class="btn btn--primary btn--filled is-loading" aria-busy="true">${spin('sm', 'neutral')}저장 중</button>`,
};
export const 인라인 = {
  render: () => `<p style="margin:0;font-size:var(--body-sm)">문서 번호 중복 <span class="loading loading--inline" role="status">${spin('sm')}<span class="loading__text">확인 중</span></span></p>`,
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 14번 ① ② ③) ── 미리보기만, 코드는 위 예시 카드에
const ddArea = (inner, style = '') => `<div style="position:relative;flex:1;min-width:0;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden;background:var(--color-bg-base)${style ? ';' + style : ''}">${inner}</div>`;
// 작은 목록 화면 — 검색 조건 행 + 표. over = 'table'(표만 덮음) · 'page'(화면 전체를 덮음)
const miniPage = (over) => {
  const cover = `<div class="loading loading--overlay" role="status" aria-live="polite">${spin()}<p class="loading__text">다시 불러오는 중</p></div>`;
  return ddArea(`<div style="display:flex;align-items:center;gap:8px;padding:12px">
      <label class="search-label" for="dd-ld-q-${over}" style="margin:0;white-space:nowrap">문서 명</label><input class="input" id="dd-ld-q-${over}" style="flex:1;min-width:0" placeholder="문서 명 입력">
      <button type="button" class="btn btn--primary btn--filled">검색</button></div>
    <div style="position:relative;padding:0 12px 12px">${table()}${over === 'table' ? cover : ''}</div>${over === 'page' ? cover : ''}`);
};
// 카드 — 카드 제목 + 본문 로딩
const ddCard = (inner) => ddArea(`<p style="margin:0;padding:12px 16px;border-bottom:1px solid var(--color-border-subtle);font-size:var(--body-md);font-weight:var(--font-weight-semibold);color:var(--color-text-base)">결재할 문서</p>
    <div class="loading" role="status" aria-live="polite" style="min-height:104px">${inner}</div>`);
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // ① 영역 로딩 = 그 영역에만 덮개
    { title: '영역 로딩은 그 영역에만 덮개',
      do: [miniPage('table'),
        '표를 다시 불러올 때는 표 영역에만 덮개를 둡니다. 검색 조건은 그대로 쓸 수 있습니다.'],
      dont: [miniPage('page'),
        '화면 전체를 덮으면 다시 불러오지 않는 검색 조건까지 막힙니다.'] },
    // ② 버튼 처리 중 = 버튼 안 스피너(.is-loading)
    { title: '버튼 처리 중은 버튼 안 스피너',
      do: [`<button type="button" class="btn btn--secondary btn--transparent">취소</button><button type="button" class="btn btn--primary btn--filled is-loading" aria-busy="true">${spin('sm', 'neutral')}저장 중</button>`,
        '누른 버튼의 처리 중 상태(.is-loading)로 버튼 안에 스피너를 둡니다.'],
      dont: [`<button type="button" class="btn btn--secondary btn--transparent">취소</button><button type="button" class="btn btn--primary btn--filled">저장</button>${spin('sm')}`,
        '버튼 옆에 따로 스피너를 두면 어느 동작이 처리 중인지 알기 어렵고, 버튼을 다시 누를 수 있습니다.'] },
    // ③ 로고 로더 = 페이지 전체 첫 로딩에만
    { title: '로고 로더는 페이지 전체 첫 로딩에만',
      do: [ddCard(`${spin()}<span class="sr-only">불러오는 중</span>`),
        '표 · 카드 안 로딩은 스피너로 표시합니다.'],
      dont: [ddCard(`${brandLoader()}<span class="sr-only">불러오는 중</span>`),
        '표 · 카드 안에 로고를 두면 페이지 전체를 다시 불러오는 것처럼 보입니다.'] },
  ]),
};

// ── Playground ──
export const Playground = {
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', '기본', 'lg'], description: '스피너 크기 — `.spinner--sm` 16 · 기본 24 · `.spinner--lg` 40' },
    tone: { control: 'inline-radio', options: ['브랜드', 'neutral'], description: '색 — 기본 브랜드 · `.spinner--neutral` 회색' },
    text: { control: 'text', description: '안내 문구 `.loading__text` (비우면 스피너만 + 숨김 글자)' },
    cancel: { control: 'boolean', description: '취소 버튼 `.loading__actions` — 10초가 넘을 것 같을 때' },
  },
  args: { size: '기본', tone: '브랜드', text: '문서 목록을 불러오는 중입니다', cancel: false },
  render: (a) => '<div class="loading" role="status" aria-live="polite">' +
    spin(a.size === '기본' ? '' : a.size, a.tone === 'neutral' ? 'neutral' : '') +
    (a.text ? '<p class="loading__text">' + a.text + '</p>' : '<span class="sr-only">불러오는 중</span>') +
    (a.cancel ? '<div class="loading__actions"><button type="button" class="btn btn--secondary btn--transparent">취소</button></div>' : '') + '</div>',
};
