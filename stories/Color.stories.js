// Foundation/Color — 문서 화면은 Color.mdx. 여기 스토리는 MDX 카드 안에 들어가는 표 · 램프
import { ramps, tokenTable } from './_tables.js';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const css = (lines) => ({ docs: { source: { language: 'css', code: lines.join('\n') } } });
const stackTables = (...els) => { const w = document.createElement('div'); w.style.cssText = 'display:grid;gap:16px'; els.forEach((e) => w.appendChild(e)); return w; };

export default {
  title: 'Foundation/Color',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Color.mdx
};

// ── 원색 램프 (Primitive) ──
export const Brand = {
  parameters: css([
    '/* 브랜드 파일 css/brands/{브랜드}.css 가 바꾸는 색은 이 램프와 accent (형태는 Foundation › Spacing · Radius · Size) */',
    ':root.theme-fashion {',
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
    { name: '노랑', note: '경고', prefix: 'yellow', steps: STEPS },
    { name: '파랑', note: '정보', prefix: 'blue', steps: STEPS },
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
    ['color-bg-checked', '선택된 체크박스 · 라디오'],
    ['color-bg-inverse-soft', '한 단계 옅은 반전 면'],
    ['color-bg-danger', '위험 채움'],
    ['color-bg-info', '정보 채움'],
    ['color-bg-success', '성공 채움'],
    ['color-bg-warning', '경고 채움'],
    ['color-bg-danger-subtle', '위험 옅은 바탕'],
    ['color-bg-info-subtle', '정보 옅은 바탕'],
    ['color-bg-success-subtle', '성공 옅은 바탕'],
    ['color-bg-warning-subtle', '경고 옅은 바탕'],
    ['color-bg-row-alt', '표 짝수 행(얼룩)'],
    ['color-bg-grid-header', '표 헤더 행'],
    ['color-bg-grid-row-hover', '표 행 Hovered'],
    ['color-bg-grid-row-selected', '표 행 Selected'],
    ['color-bg-lnb-hover', 'LNB 메뉴 Hovered'],
    ['color-bg-lnb-active', 'LNB 메뉴 현재 화면'],
    ['color-bg-panel', '사용자 메뉴 헤더 · 로그아웃 행'],
    ['color-bg-panel-2', '사용자 메뉴 몸통'],
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
    ['color-text-info', '정보'],
    ['color-text-success', '성공'],
    ['color-text-warning', '경고'],
    ['color-text-danger-bold', '옅은 위험 바탕 위 글자'],
    ['color-text-info-bold', '옅은 정보 바탕 위 글자'],
    ['color-text-success-bold', '옅은 성공 바탕 위 글자'],
    ['color-text-warning-bold', '옅은 경고 바탕 위 글자'],
    ['color-text-on-brand-subtle', '옅은 브랜드 바탕 위 글자'],
    ['color-text-lnb-active', 'LNB 메뉴 현재 화면 글자'],
    ['color-text-inverse', '반전 면 위 글자', 'is-inverse'],
    ['color-text-on-color', '채운 색 면 위 글자', 'is-inverse'],
    ['color-text-on-panel', '사용자 메뉴 패널 위 글자', 'is-inverse'],
    ['color-text-on-panel-2', '사용자 메뉴 몸통 위 보조 글자', 'is-inverse'],
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
    ['color-border-input', '입력 필드 · 체크박스 (대비 3:1)'],
    ['color-border-input-hover', '입력 필드 Hovered'],
    ['color-border-brand', '브랜드 테두리'],
    ['color-border-focus', '포커스 링 (모든 컴포넌트 공용)'],
    ['color-border-disabled', '쓸 수 없는 요소'],
    ['color-border-danger', '오류 입력 필드 · 위험'],
    ['color-border-info', '정보'],
    ['color-border-success', '성공'],
    ['color-border-warning', '경고'],
    ['color-border-grid-outer', '표 바깥 테두리'],
    ['color-border-grid-cell', '표 셀 구분선'],
    ['color-border-grid-header-bottom', '표 헤더 행 아래 선'],
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
    ['color-icon-link-visited', '방문한 링크 아이콘'],
    ['color-icon-danger', '위험'],
    ['color-icon-info', '정보'],
    ['color-icon-success', '성공'],
    ['color-icon-warning', '경고'],
    ['color-icon-on-color', '채운 색 면 위 아이콘', 'is-inverse'],
    ['color-icon-inverse', '반전 면 위 아이콘', 'is-inverse'],
    ['color-icon-on-inverse-danger', '반전 면(토스트) 위 위험', 'is-inverse'],
    ['color-icon-on-inverse-success', '반전 면(토스트) 위 성공', 'is-inverse'],
    ['color-icon-on-inverse-warning', '반전 면(토스트) 위 경고', 'is-inverse'],
  ]),
};

// ── 상호작용 — 버튼 중요도별 상태 색(Hovered · Pressed)과 공통 포커스 링 (Foundation › State) ──
export const Interactive = {
  parameters: css([
    '.btn--secondary:hover { background: var(--color-bg-interactive-secondary-hover); }',
    ':focus-visible       { box-shadow: 0 0 0 3px var(--color-focus-ring); }',
  ]),
  render: () => stackTables(tokenTable('bg', [
    ['color-focus-ring', '포커스 링 바깥 번짐 (모든 요소 공용)'],
    ['color-bg-btn-primary', 'primary filled 버튼 바탕'],
    ['color-bg-btn-primary-hover', 'primary filled Hovered'],
    ['color-bg-interactive-primary-pressed', 'primary filled Pressed'],
    ['color-bg-interactive-primary-tint-pressed', 'primary outlined · transparent Pressed'],
    ['color-bg-interactive-secondary', 'secondary 바탕'],
    ['color-bg-interactive-secondary-hover', 'secondary Hovered'],
    ['color-bg-interactive-secondary-pressed', 'secondary Pressed'],
    ['color-bg-interactive-danger', 'destructive 바탕'],
    ['color-bg-interactive-danger-hover', 'destructive Hovered'],
    ['color-bg-interactive-danger-pressed', 'destructive Pressed'],
    ['color-bg-interactive-selected-hover', '선택된 항목 Hovered'],
    ['color-bg-interactive-selected-pressed', '선택된 항목 Pressed'],
    ['color-bg-btn-excel', '엑셀 버튼 바탕'],
    ['color-bg-btn-excel-hover', '엑셀 버튼 Hovered'],
    ['color-bg-btn-excel-active', '엑셀 버튼 Pressed'],
  ]), tokenTable('border', [
    ['color-border-btn-primary', 'primary 테두리'],
    ['color-border-btn-primary-hover', 'primary Hovered'],
    ['color-border-interactive-primary-hover', 'primary outlined Hovered'],
    ['color-border-interactive-primary-pressed', 'primary outlined Pressed'],
    ['color-border-interactive-secondary', 'secondary 테두리'],
    ['color-border-interactive-secondary-hover', 'secondary Hovered'],
    ['color-border-interactive-secondary-pressed', 'secondary Pressed'],
    ['color-border-interactive-danger', 'destructive 테두리'],
    ['color-border-interactive-danger-hover', 'destructive Hovered'],
    ['color-border-interactive-danger-pressed', 'destructive Pressed'],
    ['color-border-btn-excel', '엑셀 버튼 테두리'],
    ['color-border-btn-excel-hover', '엑셀 버튼 Hovered'],
  ]), tokenTable('text', [
    ['color-text-btn-primary', 'primary filled 글자'],
    ['color-text-interactive-primary-hover', 'primary outlined Hovered 글자'],
    ['color-text-interactive-primary-pressed', 'primary outlined Pressed 글자'],
    ['color-text-interactive-secondary', 'secondary 글자'],
    ['color-text-interactive-secondary-hover', 'secondary Hovered 글자'],
    ['color-text-interactive-secondary-pressed', 'secondary Pressed 글자'],
    ['color-text-interactive-danger', 'destructive 글자'],
    ['color-text-btn-excel', '엑셀 버튼 글자'],
  ]), tokenTable('icon', [
    ['color-icon-interactive-secondary', 'secondary 아이콘'],
    ['color-icon-interactive-secondary-hover', 'secondary Hovered 아이콘'],
    ['color-icon-interactive-secondary-pressed', 'secondary Pressed 아이콘'],
  ])),
};

// ── 진행 — 진행률 막대 · 범례 점의 상태별 그라데이션(시작 → 끝). 브랜드와 상관없이 고정 ──
export const ProgressTokens = {
  parameters: css(['.progress-bar--done .pbar-fill { background: linear-gradient(90deg, var(--color-progress-done-start), var(--color-progress-done-end)); }']),
  render: () => tokenTable('bg', [
    ['color-progress-done-start', '완료 시작'], ['color-progress-done-end', '완료 끝'],
    ['color-progress-progress-start', '진행 중 시작'], ['color-progress-progress-end', '진행 중 끝'],
    ['color-progress-delay-start', '지연 시작'], ['color-progress-delay-end', '지연 끝'],
    ['color-progress-plan-start', '예정 시작'], ['color-progress-plan-end', '예정 끝'],
    ['color-progress-hold-start', '보류 시작'], ['color-progress-hold-end', '보류 끝'],
  ]),
};
