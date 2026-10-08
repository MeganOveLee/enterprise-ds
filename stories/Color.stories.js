// Foundation/Color — 문서 화면은 Color.mdx. 여기 스토리는 MDX 카드 안에 들어가는 표 · 램프
import { ramps, tokenTable } from './_tables.js';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const css = (lines) => ({ docs: { source: { language: 'css', code: lines.join('\n') } } });

export default {
  title: 'Foundation/Color',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Color.mdx
};

// ── 원색 램프 (Primitive) ──
export const Brand = {
  parameters: css([
    '/* 브랜드 파일 css/brands/{브랜드}.css 가 바꾸는 값은 이 11개뿐 */',
    ':root.theme-sample {',
    '  --brand-50: #F3F0FE;  /* … */  --brand-500: #6D4ADB;  /* … */  --brand-900: #261754;',
    '  --accent-500: #F2A93B;',
    '}',
    '/* 화면 코드는 원색 대신 의미 토큰을 쓴다 */',
    '.badge { background: var(--color-bg-brand-subtle); color: var(--color-text-brand); }',
  ]),
  render: () => ramps([
    { prefix: 'brand', steps: STEPS },
    { name: '포인트', note: 'Accent — 작은 강조 한 가지', prefix: 'accent', steps: [500] },
  ]),
};

export const Neutral = {
  parameters: css([
    '/* 의미 토큰이 중립 단계를 가리킨다 — 다크는 같은 이름에 다른 단계 */',
    '--color-bg-subtle:  var(--neutral-200);   /* 다크: neutral-950 */',
    '--color-text-muted: var(--neutral-600);   /* 다크: neutral-400 */',
  ]),
  render: () => ramps([{ prefix: 'neutral', steps: [50, 100, 200, 300, 400, 500, 600, 700, 750, 800, 850, 900, 950] }]),
};

export const Status = {
  parameters: css([
    '/* 상태색도 의미 토큰을 거쳐 쓴다 */',
    '--color-text-danger:        var(--red-600);',
    '--color-bg-success-subtle:  var(--green-50);',
  ]),
  render: () => ramps([
    { name: '빨강', note: '위험 · 오류', prefix: 'red', steps: STEPS },
    { name: '초록', note: '성공', prefix: 'green', steps: STEPS },
    { name: '노랑', note: '주의', prefix: 'yellow', steps: STEPS },
    { name: '파랑', note: '안내', prefix: 'blue', steps: STEPS },
  ]),
};

// ── 의미 토큰 (Semantic) ──
export const Background = {
  parameters: css([
    '.card  { background: var(--color-bg-base); }',
    '.page  { background: var(--color-bg-subtle); }',
    '.notice--info { background: var(--color-bg-info-subtle); }',
  ]),
  render: () => tokenTable('bg', [
    ['color-bg-base', '카드 · 팝업 등 기본 면'],
    ['color-bg-muted', '살짝 가라앉은 면'],
    ['color-bg-subtle', '페이지 바닥'],
    ['color-bg-header', '섹션 머리 띠'],
    ['color-bg-input', '입력 가능한 칸'],
    ['color-bg-readonly', '읽기 전용 칸'],
    ['color-bg-disabled', '쓸 수 없는 요소'],
    ['color-bg-selected', '선택된 날짜 · 현재 페이지'],
    ['color-bg-brand', '브랜드 채움 면'],
    ['color-bg-brand-subtle', '옅은 브랜드 면 (배지 등)'],
    ['color-bg-inverse', '반전 면 (툴팁 등)'],
    ['color-bg-danger', '위험 채움'],
    ['color-bg-danger-subtle', '위험 안내 바탕'],
    ['color-bg-info-subtle', '안내 바탕'],
    ['color-bg-success-subtle', '성공 바탕'],
    ['color-bg-warning-subtle', '주의 바탕'],
  ]),
};

export const Text = {
  parameters: css([
    '.desc  { color: var(--color-text-muted); }',
    '.error { color: var(--color-text-danger); }',
  ]),
  render: () => tokenTable('text', [
    ['color-text-base', '본문'],
    ['color-text-muted', '보조 설명'],
    ['color-text-disabled', '쓸 수 없는 글자'],
    ['color-text-label', '폼 라벨'],
    ['color-text-brand', '브랜드 강조 글자'],
    ['color-text-link-visited', '방문한 링크'],
    ['color-text-danger', '오류 메시지'],
    ['color-text-info', '안내'],
    ['color-text-success', '성공'],
    ['color-text-warning', '주의'],
    ['color-text-inverse', '반전 면 위 글자', 'is-inverse'],
  ]),
};

export const Border = {
  parameters: css([
    '.card  { border: 1px solid var(--color-border-base); }',
    '.input { border: 1px solid var(--color-border-input); }',
  ]),
  render: () => tokenTable('border', [
    ['color-border-base', '기본 구분선 · 카드 테두리'],
    ['color-border-subtle', '안쪽 가는 구분선'],
    ['color-border-strong', '강한 구분'],
    ['color-border-input', '입력칸 · 체크박스 (대비 3:1)'],
    ['color-border-input-hover', '입력칸 위에 마우스를 올렸을 때'],
    ['color-border-brand', '브랜드 테두리'],
    ['color-border-focus', '포커스 링 (모든 컴포넌트 공용)'],
    ['color-border-disabled', '쓸 수 없는 요소'],
    ['color-border-danger', '오류 입력칸'],
    ['color-border-info', '안내'],
    ['color-border-success', '성공'],
    ['color-border-warning', '주의'],
  ]),
};

export const Icon = {
  parameters: css([
    '.icon        { color: var(--color-icon-muted); }',
    '.icon--error { color: var(--color-icon-danger); }',
  ]),
  render: () => tokenTable('icon', [
    ['color-icon-base', '기본 아이콘'],
    ['color-icon-muted', '보조 아이콘'],
    ['color-icon-disabled', '쓸 수 없는 아이콘'],
    ['color-icon-brand', '브랜드 아이콘'],
    ['color-icon-favorite', '즐겨찾기 별'],
    ['color-icon-danger', '위험'],
    ['color-icon-info', '안내'],
    ['color-icon-success', '성공'],
    ['color-icon-warning', '주의'],
  ]),
};
