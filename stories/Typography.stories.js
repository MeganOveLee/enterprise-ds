// Foundation/Typography — 문서 화면은 Typography.mdx. 여기 스토리는 MDX 카드 안에 들어가는 단계 표
import { mount } from './_foundation.js';

const SAMPLE = '설계 변경 요청서 ECR-2026-0142';

const rows = (items) => mount(items.map(([token, use, style]) => `
  <div class="fd-row fd-item">
    <code>--${token}</code>
    <span class="fd-val" data-read="font-size"></span>
    <div>
      <div class="fd-sw" style="${style}">${SAMPLE}</div>
      <div class="fd-use" style="font-size:var(--body-sm);margin-top:4px">${use}</div>
    </div>
  </div>`).join(''));

export default {
  title: 'Foundation/Typography',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Typography.mdx
};
const css = (lines) => ({ docs: { source: { language: 'css', code: lines.join('\n') } } });

export const 제목 = {
  parameters: css(['/* h1~h6 는 globals.css 가 같은 단계를 기본값으로 붙인다 */', 'h4 { font-size: var(--heading-md); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight); }']),
  render: () => rows([
    ['heading-2xl', 'h1 · 홈 인사말', 'font-size:var(--heading-2xl);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-xl',  'h2', 'font-size:var(--heading-xl);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-lg',  'h3 · 상세 화면 제목', 'font-size:var(--heading-lg);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-md',  'h4 · 페이지 헤더 · 카드 제목', 'font-size:var(--heading-md);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-sm',  'h5 · 창(팝업) 제목 · 섹션 헤더', 'font-size:var(--heading-sm);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
    ['heading-xs',  'h6', 'font-size:var(--heading-xs);font-weight:var(--font-weight-bold);line-height:var(--line-height-tight)'],
  ]),
};

export const 본문 = {
  parameters: css(['body { font-family: var(--font-family-base); font-size: var(--body-md); }', '.field-error-msg { font-size: var(--body-sm); }']),
  render: () => rows([
    ['body-lg', '강조 본문 · 큰 안내', 'font-size:var(--body-lg)'],
    ['body-md', '기본 본문 · 큰 입력 필드(로그인)', 'font-size:var(--body-md)'],
    ['body-sm', '입력 필드 · 표 셀 · 라벨 · 보조 설명 · 오류 문구 · 배지', 'font-size:var(--body-sm)'],
    ['body-xs', '레일 메뉴 이름 · 개수 배지 · 표 안 진행률 숫자', 'font-size:var(--body-xs)'],
  ]),
};

export const 굵기 = {
  parameters: css(['.pop .tab li { font-weight: var(--font-weight-medium); }', '.card-title { font-weight: var(--font-weight-semibold); }']),
  render: () => mount([
    ['regular', 400, '본문'],
    ['medium', 500, '버튼 · 탭'],
    ['semibold', 600, '라벨 · 강조 · 카드 · 창 제목'],
    ['bold', 700, '제목'],
  ].map(([n, w, use]) => `
    <div class="fd-row">
      <code>--font-weight-${n}</code><span class="fd-val">${w}</span>
      <div>
        <div style="font-size:var(--heading-sm);font-weight:var(--font-weight-${n})">${SAMPLE}</div>
        <div class="fd-use" style="font-size:var(--body-sm);margin-top:4px">${use}</div>
      </div>
    </div>`).join('')),
};
