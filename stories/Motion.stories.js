// Foundation/Motion: 문서 화면은 Motion.mdx. 움직임 세 가지 견본: 빛(지금 처리 중) · 깜빡임(봐야 할 경고 = 지연, 두근 박동) · 정지(저장된 값) + 기다림 두 가지(처리 중 글자 · 단계 목록) + 로고 로더. 한 번짜리 인터랙션은 Interaction.stories.js
// : 빛은 지금 처리 중일 때만, 첫 자리 = 첨부 업로더 올리는 중 막대. 값은 tokens.css 모션 토큰
// 견본은 실제 컴포넌트 마크업 그대로(업로더 · 상태 표시 · 진행률 막대): 화면에서 보는 움직임과 같음
import { fileIcon } from './_fileicon.js';
import { MARK_PATHS } from './_lnbicons.js';
import { doDont } from './_dodont.js';

const html = (code) => ({ docs: { source: { language: 'html', code } } });
const box = (h, w = '560px') => '<div style="max-width:' + w + '">' + h + '</div>';

// 업로더 파일 줄: pct 가 있으면 올리는 중(막대 + %), 없으면 올린 파일(이름 = 내려받기 링크)
const file = (n, pct, size) => '<li class="file-item">' + fileIcon(n) +
  (pct === undefined ? '<a href="#" class="file-name">' + n + '</a>'
    : '<span class="file-name">' + n + '</span><progress max="100" value="' + pct + '" aria-label="' + n + ' 올리는 중">' + pct + '%</progress>') +
  '<span class="file-size">' + (pct === undefined ? size : pct + '% · ' + size) + '</span></li>';
const uploader = (rows) => '<div class="resumable"><ul class="fileList">' + rows.map((r) => file(...r)).join('') + '</ul></div>';

const status = (k) =>
  '<div class="status-block status-block--' + k + '"><div class="status-segments status-segments--' + k + '" aria-hidden="true">' +
  '<span class="status-segments__bar"></span>'.repeat(5) + '</div><span class="status-text"></span></div>';
const planText = (pct, plan) => '진행률 ' + pct + '%, 계획 ' + plan + '%, ' + (plan > pct ? (plan - pct) + '%p 늦음' : plan < pct ? (pct - plan) + '%p 빠름' : '계획대로');
const bar = (k, pct, name, plan) =>
  '<div class="progress-bar progress-bar--' + k + '" role="progressbar" aria-label="' + name + ' 진행률" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"' +
  (plan === undefined ? '' : ' aria-valuetext="' + planText(pct, plan) + '"') + '>' +
  '<div class="pbar-fill" style="width:' + pct + '%"></div><span class="progress-bar__label">' + pct + '%</span>' +
  (plan === undefined ? '' : '<span class="progress-bar__plan" style="--plan:' + plan + '%" aria-hidden="true"></span>') + '</div>';
// 진행 현황 한 줄: Screens › 프로젝트 상세와 같은 마크업(상태 표시 + 「전체 진행률」 머리 + 계획 표식 막대). 머리 글자 배치만 화면 쪽 스타일이라 여기선 인라인
const meta = (pct, plan) => '<div style="display:flex;align-items:baseline;gap:12px;font-size:var(--body-sm);color:var(--color-text-muted)">' +
  '<b style="font-size:var(--body-md);font-weight:var(--font-weight-semibold);color:var(--color-text-base)">전체 진행률</b>' +
  '<span>계획 ' + plan + '% · 실적 ' + pct + '%' + (plan > pct ? ' · <b style="font-weight:var(--font-weight-semibold);color:var(--color-text-danger-bold)">' + (plan - pct) + '%p 늦음</b>' : '') + '</span></div>';
const summary = (k, pct, plan) => '<div class="progress-row" style="gap:var(--spacing-24)">' + status(k) +
  '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">' + meta(pct, plan) + '<div class="progress-row">' + bar(k, pct, '전체', plan) + '</div></div></div>';

export default {
  title: 'Foundation/Motion',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Motion.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// 빛: 시스템이 지금 처리 중(곧 끝남). 채운 부분 안에서만 흰 띠가 지나감
const UP = [['BRK-20417_조립사양_B2.pdf', undefined, '1.8 MB'], ['BRK-20417_캘리퍼.dwg', 64, '3.2 / 5.0 MB']];
export const 빛 = {
  parameters: html(file('BRK-20417_캘리퍼.dwg', 64, '3.2 / 5.0 MB')),
  render: () => box(uploader(UP)),
};

// 깜빡임(Pulse): 지연 상태 표시의 막대 5개가 두근 · 두근 · 쉼(statusPulse, 밝기만), 같은 줄 진행률 막대는 두 박동에 한 번 옅은 빛 + 붉은 번짐.
// 다른 상태는 정지. 상태는 옆 글자가 알려 주고 막대는 꾸밈(aria-hidden). 마크업 = Screens › 프로젝트 상세 진행 현황과 같음
export const 깜빡임 = {
  parameters: html(summary('delay', 58, 64)),
  render: () => box(summary('delay', 58, 64), '720px'),
};

// 정지: 저장된 값(진행 상태 표시 + 진행률 막대). 지금 바뀌는 중이 아니라 움직이지 않음(값이 바뀔 때만 채움이 늘어남)
export const 정지 = {
  parameters: html(summary('progress', 72, 70)),
  render: () => box(summary('progress', 72, 70), '720px'),
};

// ── 기다림 두 가지 (DS-ADR-041 · DS-ADR-053) ── 몇 초 걸리는 처리에서 멈춘 화면이 아님을 알림. 반복 움직임이라 Motion에 둠
const el = (h, w = '560px') => { const d = document.createElement('div'); d.style.maxWidth = w; d.innerHTML = h; return d; };
const M = () => window.dsMotion;
const btn = (t, cls, attrs = '') => '<button type="button" class="btn ' + cls + '"' + attrs + '>' + t + '</button>';
const CHECK12 = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-4.9"/></svg>';
const row = (h) => '<div class="sb-row">' + h + '</div>';

// 처리 중 글자: 몇 초 걸리는 처리의 안내 문구에 빛이 지나감(Shimmer 와 같은 뜻 · 같은 한 바퀴). 문구 앞에 스피너(3 ~ 10초 = 스피너 + 안내 문구, Loading 시간 규칙)
const SHIMMER = '<div class="loading" role="status">\n  <div class="loading loading--inline">\n    <span class="spinner spinner--sm" aria-hidden="true"></span>\n    <p class="loading__text text-shimmer">BOM 두 판을 비교하는 중입니다</p>\n  </div>\n  <p class="loading__sub">BRK-20417 · 부품 214개</p>\n</div>';
export const 처리_중_글자 = {
  parameters: html(SHIMMER),
  render: () => el(SHIMMER),
};

// 단계 목록: 끝난 단계 체크 · 지금 단계 도는 고리 · 남은 단계 빈 원
const STEPS = ['도면 파일 확인', '부품 214개 대조', '차이 3건 정리'];
const stepItem = (t, st) => '<li class="steps__item' + (st ? ' is-' + st : '') + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="steps__mark" aria-hidden="true">' + CHECK12 + '</span>' + t + (st === 'done' ? '<span class="sr-only"> 완료</span>' : '') + '</li>';
const steps = (at) => '<ol class="steps" aria-label="BOM 비교 단계">' + STEPS.map((t, i) => stepItem(t, i < at ? 'done' : i === at ? 'current' : '')).join('') + '</ol>';
export const 단계_목록 = {
  parameters: html('<div class="loading" role="status">\n  ' + steps(1) + '\n</div>'),
  render: () => {
    const d = el('<div class="loading" role="status" style="align-items:flex-start">' + steps(0) + '</div>' + row(btn('다시 보기', 'btn--secondary btn--outlined')), '360px');
    let timers = [];
    const play = () => {
      timers.forEach(clearTimeout); timers = [];
      const box = d.querySelector('.loading');
      box.innerHTML = steps(0);
      if (M() && M().reducedMotion()) { box.innerHTML = steps(STEPS.length); return; }
      for (let i = 1; i <= STEPS.length; i++) timers.push(setTimeout(() => { box.innerHTML = steps(i); }, i * 1100));
    };
    d.querySelector('.btn').addEventListener('click', play);
    setTimeout(play, 300);
    return d;
  },
};

// ── 로고 로더 (DS-ADR-043) ── 페이지 전체 첫 로딩. 심볼 조각 다섯이 바깥에서 차례로 모여 맞물림 · 그림 한 장 로고는 왼쪽부터 채움
const IMG_LOGO = new URL('../assets/brand/default-logo.svg', import.meta.url).href;   // 가상 제품 마크(그림 한 장으로 쓸 때의 견본)
const LOADER_PIECES = '<span class="brand-loader" aria-hidden="true">' + '<svg viewBox="0 0 130 129">' + MARK_PATHS.map((d, i) => '<path class="brand-loader__piece brand-loader__piece--' + (i + 1) + '" d="' + d + '"/>').join('') + '</svg>' + '</span>';
const LOADER_CODE = '<span class="brand-loader" aria-hidden="true">\n    <svg viewBox="0 0 130 129">\n' + [1, 2, 3, 4, 5].map((n) => '      <path class="brand-loader__piece brand-loader__piece--' + n + '" d="…"/>').join('\n') + '\n    </svg>\n  </span>';   // 코드 보기: 조각 좌표는 줄임
const LOADER_IMAGE = (src) => '<span class="brand-loader brand-loader--image" style="--brand-loader-width:72px" aria-hidden="true"><img class="brand-loader__base" src="' + src + '" alt=""><img class="brand-loader__fill" src="' + src + '" alt=""></span>';
const loaderFig = (inner, t, d) => '<figure style="margin:0;display:grid;justify-items:center;gap:10px;padding:24px 12px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);background:var(--color-bg-base);text-align:center">' +
  inner + '<figcaption style="font-size:var(--body-sm);color:var(--color-text-muted);line-height:1.5"><b style="display:block;color:var(--color-text-base);font-size:var(--body-md);font-weight:var(--font-weight-semibold)">' + t + '</b>' + d + '</figcaption></figure>';
export const 로고_로더 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code:
    '<div class="loading loading--overlay" role="status" aria-live="polite">\n  ' + LOADER_PIECES + '\n  <p class="loading__text">화면을 불러오는 중입니다</p>\n</div>\n\n<!-- 로고가 그림 한 장뿐인 브랜드 -->\n' + LOADER_IMAGE('logo.png') } } },
  render: () => '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,240px));gap:16px">' +
    loaderFig(LOADER_PIECES, '조각이 맞물리는 로고 .brand-loader', '심볼 조각 다섯이 바깥에서 차례로 모여 하나로 맞물립니다. 흩어진 정보가 한 화면으로 모이는 모습입니다.') +
    loaderFig(LOADER_IMAGE(IMG_LOGO), '그림 한 장 로고 .brand-loader--image', '로고가 그림 파일 한 장뿐인 브랜드는 흐린 로고 위로 원래 로고가 왼쪽부터 채워집니다.') + '</div>',
};

// Do · Don't: 근거: 규칙 「Shimmer는 처리 중에만 사용합니다」 · 「한 자리에는 박자 하나만 둡니다」
const delayRow = (name) => '<div class="progress-row" style="gap:var(--spacing-16)">' + status('delay') + '<span style="font-size:var(--body-sm)">' + name + '</span></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '빛(Shimmer)은 지금 처리 중인 곳에만 씁니다',
      do: [uploader(UP), '올리는 중인 파일 막대에만 빛이 지나갑니다. 다 올린 파일 줄은 움직이지 않습니다.'],
      dont: [row('<span class="status-chip status-chip--success"><span class="text-shimmer">승인</span></span><span style="font-size:var(--body-sm);color:var(--color-text-muted)">저장된 상태 값</span>'), '저장이 끝난 상태 값에 빛을 두면 아직 처리 중인 것으로 읽힙니다.'] },
    { title: '경고 박동은 화면의 대표 막대 한 곳에서만 뜁니다',
      do: [summary('delay', 58, 64), '프로젝트 전체 진행 현황 한 곳만 뜁니다. 표 안의 지연은 상태 칩 글자로 알립니다.'],
      dont: ['<div style="display:grid;gap:8px">' + delayRow('설계 검토') + delayRow('시제품 제작') + delayRow('양산 준비') + '</div>', '여러 곳이 함께 뛰면 어디를 먼저 봐야 할지 알 수 없습니다.'] },
  ]),
};
