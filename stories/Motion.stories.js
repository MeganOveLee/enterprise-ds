// Foundation/Motion — 문서 화면은 Motion.mdx. 움직임 세 가지 견본: 빛(지금 처리 중) · 깜빡임(봐야 할 경고 = 지연) · 정지(저장된 값)
// TD-48(10/16 세영 승인) — 빛은 지금 처리 중일 때만, 첫 자리 = 첨부 업로더 올리는 중 막대. 값은 tokens.css 모션 토큰
// 견본은 실제 컴포넌트 마크업 그대로(업로더 · 상태 표시 · 진행률 막대) — 화면에서 보는 움직임과 같음
import { fileIcon } from './_fileicon.js';

const html = (code) => ({ docs: { source: { language: 'html', code } } });
const box = (h, w = '560px') => '<div style="max-width:' + w + '">' + h + '</div>';

// 업로더 파일 줄 — pct 가 있으면 올리는 중(막대 + %), 없으면 올린 파일(이름 = 내려받기 링크)
const file = (n, pct, size) => '<li class="file-item">' + fileIcon(n) +
  (pct === undefined ? '<a href="#" class="file-name">' + n + '</a>'
    : '<span class="file-name">' + n + '</span><progress max="100" value="' + pct + '" aria-label="' + n + ' 올리는 중">' + pct + '%</progress>') +
  '<span class="file-size">' + (pct === undefined ? size : pct + '% · ' + size) + '</span></li>';
const uploader = (rows) => '<div class="resumable"><ul class="fileList">' + rows.map((r) => file(...r)).join('') + '</ul></div>';

const status = (k) =>
  '<div class="status-block status-block--' + k + '"><div class="status-segments status-segments--' + k + '" aria-hidden="true">' +
  '<span class="status-segments__bar"></span>'.repeat(5) + '</div><span class="status-text"></span></div>';
const bar = (k, pct, name) =>
  '<div class="progress-bar progress-bar--' + k + '" role="progressbar" aria-label="' + name + ' 진행률" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
  '<div class="pbar-fill" style="width:' + pct + '%"></div><span class="progress-bar__label">' + pct + '%</span></div>';

export default {
  title: 'Foundation/Motion',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Motion.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// 빛 — 시스템이 지금 처리 중(곧 끝남). 채운 부분 안에서만 흰 띠가 지나감
const UP = [['BRK-20417_조립사양_B2.pdf', undefined, '1.8 MB'], ['BRK-20417_캘리퍼.dwg', 64, '3.2 / 5.0 MB']];
export const 빛 = {
  parameters: html(file('BRK-20417_캘리퍼.dwg', 64, '3.2 / 5.0 MB')),
  render: () => box(uploader(UP)),
};

// 깜빡임 — 지연 상태 표시의 막대 5개(statusPulse). 다른 상태는 정지(10/16 세영). 상태는 옆 글자가 알려 주고 막대는 꾸밈(aria-hidden)
export const 깜빡임 = {
  parameters: html(status('delay')),
  render: () => box('<div class="progress-row">' + status('delay') + bar('delay', 32, '시험 · 검증') + '</div>'),
};

// 정지 — 저장된 값(진행 상태 표시 + 진행률 막대). 지금 바뀌는 중이 아니라 움직이지 않음(값이 바뀔 때만 채움이 늘어남)
export const 정지 = {
  parameters: html('<div class="progress-row">' + status('progress') + bar('progress', 58, '전체') + '</div>'),
  render: () => box('<div class="progress-row">' + status('progress') + bar('progress', 58, '전체') + '</div>'),
};
