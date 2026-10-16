// Navigation/Link — 문서 화면은 Link.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태
// 그리드 링크(10/14 결정) — 행마다 식별자 열 하나만 항상 밑줄(.grid-custom-rows-link), 나머지 링크는 마우스 · 키보드가 올 때만 밑줄(.grid-link)
// 본문 링크(.text-link) — 표 밖 상세 정보 · 폼 안 글자 링크, 끝 「↗」= 다른 창. 내려받기는 .no-arrow (이전 버전 규칙, TD-93 3.1 대조 10/17)
// 위치 표시(.breadcrumb)는 App Shell 문서에 예시가 있어 여기서는 상단 바 · 페이지 머리 두 자리만 다시 보여 줌
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const idLink = (t, extra = '') => '<a href="#" class="grid-custom-rows-link' + (extra ? ' ' + extra : '') + '">' + t + '</a>';
const link = (t, extra = '') => '<a href="#" class="grid-link' + (extra ? ' ' + extra : '') + '">' + t + '</a>';
const crumbs = (list) => '<div class="breadcrumb">' + list.map((c, i) => i < list.length - 1 ? '<span>' + c + '</span><span aria-hidden="true">›</span>' : '<span class="crumb-current" aria-current="page">' + c + '</span>').join('') + '</div>';
const tlink = (t, extra = '') => '<a href="#" class="text-link' + (extra ? ' ' + extra : '') + '">' + t + '</a>';
const html = (lines) => ({ controls: { disable: true }, docs: { source: { language: 'html', code: lines.join('\n') } } });
const note = (t) => '<span class="sb-note">' + t + '</span>';

export default {
  title: 'Navigation/Link',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Link.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
const GRID = [idLink('DOC-2610-0012'), link('하우징 재질 변경 검토 보고서')];
export const 그리드_링크 = {
  parameters: html(GRID),
  render: () => matrix(['식별자 열', '나머지 링크'], [
    ['미리보기', GRID],
    ['클래스', ['<code>.grid-custom-rows-link</code>', '<code>.grid-link</code>']],
    ['쓰임', [note('문서 번호 · 품번처럼 행마다 하나<br>늘 밑줄 · 브랜드 글자'), note('이름 · 제목 같은 나머지<br>마우스 · 키보드가 올 때만 밑줄')]],
  ], { full: true }),
};

export const 본문_링크 = {
  parameters: html([tlink('PJT-2026-014 브레이크 캘리퍼 경량화 개발'), '<a href="#" class="text-link no-arrow" download>(양식) 사양서 양식.docx</a>']),
  render: () => matrix(['다른 창으로 열기', '내려받기'], [
    ['미리보기', [tlink('PJT-2026-014 브레이크 캘리퍼 경량화 개발'), tlink('(양식) 사양서 양식.docx', 'no-arrow')]],
    ['클래스', ['<code>.text-link</code>', '<code>.text-link.no-arrow</code>']],
    ['쓰임', [note('상세 정보 칸의 관련 문서 · 품목<br>끝 「↗」 = 다른 창으로 열림'), note('양식 · 첨부 내려받기<br>창이 열리지 않아 화살표 없음')]],
  ], { full: true }),
};

const GNB = '<header class="gnb"><div style="display:flex;align-items:center">' + crumbs(['Home', '문서 관리', '문서 검색']) + '</div></header>';
const HEAD = '<div class="page-head" style="margin:0">' + crumbs(['Home', '문서 관리', '문서 검색']) + '</div>';
export const 위치_표시 = {
  parameters: html([crumbs(['Home', '문서 관리', '문서 검색'])]),
  render: () => matrix(['상단 바 안', '페이지 머리 안'], [
    ['미리보기', ['<div style="border:1px solid var(--color-border-base);border-radius:var(--radius-card);overflow:hidden">' + GNB + '</div>', '<div style="padding:12px 16px;background:var(--color-bg-subtle)">' + HEAD + '</div>']],
    ['쓰임', [note('칸이 모두 같은 글자 — 지금 화면은 aria-current 로 읽힘'), note('흐린 글자, 지금 화면만 진하게')]],
  ], { full: true }),
};

// ── 전체 상태 — Hovered · Focused 는 마우스 · 키보드 상태를 정지 화면으로. 키보드 포커스 = 브랜드 테두리(글자 링크 규칙, TD-93 10/16) ──
const PS = ['', 'ps-hover', 'ps-focus-visible'];
export const 전체_상태 = {
  parameters: html(GRID),
  render: () => {
    enablePseudo();
    return matrix(['Default', 'Hovered', 'Focused'], [
      ['식별자 열 <code>.grid-custom-rows-link</code>', PS.map((p) => idLink('DOC-2610-0012', p))],
      ['나머지 링크 <code>.grid-link</code>', PS.map((p) => link('하우징 재질 변경 검토 보고서', p))],
    ]);
  },
};

export const 본문_링크_상태 = {
  parameters: html([tlink('PJT-2026-014 브레이크 캘리퍼 경량화 개발')]),
  render: () => {
    enablePseudo();
    return matrix(['Default', 'Hovered', 'Focused'], [
      ['다른 창으로 열기 <code>.text-link</code>', PS.map((p) => tlink('PJT-2026-014', p))],
      ['내려받기 <code>.no-arrow</code>', PS.map((p) => tlink('(양식) 사양서 양식.docx', ('no-arrow ' + p).trim()))],
    ]);
  },
};
