// Feedback/Loading — 문서 화면은 Loading.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · Playground
// 브랜드 로더 로고 — 브랜드(제품)에 로고 로더가 있으면 로고, 없으면 스피너 --lg (Fashion · Precision)
const LOGO = { default: new URL('../assets/brand/default-logo.svg', import.meta.url).href };   // 가상 제품 마크 (Screens 레일과 같은 모양)
const brandLoader = (src) =>
  `<span class="brand-loader" style="--brand-loader-width:72px" aria-hidden="true"><img class="brand-loader__base" src="${src}" alt=""><img class="brand-loader__fill" src="${src}" alt=""></span>`;

import { doDont } from './_dodont.js';

const spin = (size = '', tone = '') =>
  `<span class="spinner${size ? ' spinner--' + size : ''}${tone ? ' spinner--' + tone : ''}" aria-hidden="true"></span>`;

export default {
  title: 'Feedback/Loading',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Loading.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

export const 스피너_크기 = {
  render: () => `<div class="sb-row" style="gap:24px">
    ${spin('sm')} ${spin()} ${spin('lg')} ${spin('', 'neutral')}
  </div>`,
  parameters: { docs: { description: { story: '`--sm` 16 (버튼 · 셀 안) · 기본 24 (영역) · `--lg` 40 (페이지 · 팝업) · `--neutral` 회색' } } },
};

export const 구성_3단계 = {
  render: () => `<div class="sb-row" style="align-items:flex-start;gap:32px">
    <div class="loading" role="status">${spin()}<span class="sr-only">불러오는 중</span></div>
    <div class="loading" role="status" aria-live="polite">${spin()}<p class="loading__text">문서 목록을 불러오는 중입니다</p></div>
    <div class="loading" role="status" aria-live="polite">${spin('lg')}
      <p class="loading__text">도면 2,481건을 엑셀로 만드는 중입니다</p>
      <p class="loading__sub">1분 정도 걸릴 수 있어요</p>
      <div class="loading__actions"><button type="button" class="btn btn--secondary btn--outlined">취소</button></div>
    </div>
  </div>`,
};

export const 영역_오버레이 = {
  name: '영역 오버레이 (Overlay)',
  render: () => `<div style="position:relative;max-width:480px;border:1px solid var(--color-border-base);border-radius:var(--radius-card)">
    <div style="padding:16px">
      <div class="skeleton-title" style="animation:none"></div>
      <p style="margin:0">오버레이가 이 영역을 덮어 조작을 막아요. 부모에 position: relative가 필요해요.</p>
      <p style="margin:8px 0 0">그리드 · 팝업 본문을 다시 불러올 때 써요.</p>
    </div>
    <div class="loading loading--overlay" role="status" aria-live="polite">${spin()}<p class="loading__text">다시 불러오는 중</p></div>
  </div>`,
};

export const 페이지_로딩 = {
  render: (_, { globals }) => {
    const logo = LOGO[globals.brand];
    return `<div style="position:relative;height:240px;max-width:640px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">
      <div class="loading loading--overlay" role="status" aria-live="polite">${logo ? brandLoader(logo) : spin('lg')}<p class="loading__text">화면을 불러오는 중입니다</p></div>
    </div>`;
  },
  parameters: { docs: { description: { story:
    '페이지 전체를 처음 불러올 때만 — 브랜드에 로고 로더가 있으면 로고가 왼쪽부터 채워지고(Default), 없으면 스피너 `--lg`(Fashion · Precision). ' +
    '영역 · 버튼 안은 언제나 스피너. 로고 이미지는 원본 그대로 두 장 겹쳐 쓰고(아래 회색 · 위 원본), 모션 줄이기 설정이면 느리게.' } } },
};

export const 버튼_안 = {
  render: () => `<div class="sb-row">
    <button type="button" class="btn btn--primary btn--filled is-loading" aria-busy="true">${spin('sm', 'neutral')}저장 중</button>
    <span class="loading loading--inline" role="status">${spin('sm')}<span class="loading__text">확인 중</span></span>
  </div>`,
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) ── 미리보기만, 코드는 위 예시 카드에
const ddArea = (inner) => `<div style="position:relative;flex:1;min-height:140px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">${inner}</div>`;
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: Loading 구성 「시간 규칙」 — 10초가 넘을 것 같으면 진행 상황 + 취소
    { title: '오래 걸리는 일은 문구와 취소까지',
      do: [`<div class="loading" role="status" aria-live="polite">${spin('lg')}<p class="loading__text">도면 2,481건을 엑셀로 만드는 중입니다</p><p class="loading__sub">1분 정도 걸릴 수 있어요</p>` +
        `<div class="loading__actions"><button type="button" class="btn btn--secondary btn--outlined">취소</button></div></div>`,
        '10초가 넘을 것 같은 작업은 진행 상황과 취소를 함께 둡니다.'],
      dont: [`<div class="loading" role="status">${spin('lg')}<span class="sr-only">불러오는 중</span></div>`,
        '스피너만 두면 얼마나 기다릴지, 멈출 수 있는지 알 수 없습니다.'] },
    // 근거: Loading 예시 「버튼 · 글자 줄 안」(누른 버튼의 처리 중 상태) · 「영역 오버레이」(그리드 · 팝업 본문을 다시 불러올 때)
    { title: '저장 대기는 버튼 안에서',
      do: [`<button type="button" class="btn btn--primary btn--filled is-loading" aria-busy="true">${spin('sm', 'neutral')}저장 중</button>`,
        '누른 버튼의 처리 중 상태로 기다림을 알립니다.'],
      dont: [ddArea(`<div style="padding:16px;display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn btn--secondary btn--outlined">취소</button><button type="button" class="btn btn--primary btn--filled">저장</button></div>` +
        `<div class="loading loading--overlay" role="status" aria-live="polite">${spin('lg')}<p class="loading__text">저장하는 중입니다</p></div>`),
        '영역 오버레이는 본문을 다시 불러올 때만 쓰고, 저장 대기에는 쓰지 않습니다.'] },
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
    (a.cancel ? '<div class="loading__actions"><button type="button" class="btn btn--secondary btn--outlined">취소</button></div>' : '') + '</div>',
};
