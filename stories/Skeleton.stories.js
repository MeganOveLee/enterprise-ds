// Feedback/Skeleton — 문서 화면은 Skeleton.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시
import { doDont } from './_dodont.js';
const line = (w) => `<span class="skeleton-line" aria-hidden="true"${w ? ` style="width:${w}"` : ''}></span>`;
const block = (w, h) => `<span class="skeleton-block" aria-hidden="true" style="${w ? 'width:' + w + ';' : ''}${h ? 'height:' + h : ''}"></span>`;
const busy = (inner, style = '') => `<div aria-busy="true" style="${style}"><span class="sr-only">불러오는 중</span>${inner}</div>`;

export default {
  title: 'Feedback/Skeleton',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Skeleton.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

export const 조각 = {
  name: '조각 (Segment)',
  render: () => busy(`<span class="skeleton-title" aria-hidden="true"></span>${line()}${line()}${line()}<div style="height:16px"></div>${block('120px', '80px')}`, 'max-width:360px'),
};

export const 그리드_행 = {
  parameters: { docs: { description: { story: '목록 화면의 자리 표시자입니다. 실제 그리드와 같은 열 비율로 그립니다.' } } },
  render: () => busy([1, 2, 3, 4, 5].map(() =>
    `<div class="skeleton-grid-row">${block('16px', '16px')}${block()}${block()}${block()}${block()}</div>`).join(''), 'max-width:720px'),
};

const field = () => `<div class="skeleton-field">${line()}${block()}</div>`;
export const 상세_폼 = {
  parameters: { docs: { description: { story: '등록 창의 자리 표시자입니다(라벨 위 · 입력 필드 2열).' } } },
  render: () => busy(`<div class="skeleton-form">${[1, 2, 3, 4].map(field).join('')}</div>`, 'max-width:560px'),
};

export const 카드 = {
  parameters: { docs: { description: { story: '대시보드 카드의 자리 표시자입니다(제목 · 숫자 · 차트 자리).' } } },
  render: () => `<div style="display:flex;flex-wrap:wrap;gap:16px">${[1, 2, 3].map(() =>
    busy(`<div class="skeleton-card"><span class="skeleton-title" aria-hidden="true"></span>${block('80px', '28px')}<div style="height:12px"></div>${block('100%', '64px')}</div>`, 'width:220px')).join('')}</div>`,
};

// ── Do · Don't ── 미리보기만, 코드는 위 예시 카드에
const gridRow = () => `<div class="skeleton-grid-row">${block('16px', '16px')}${block()}${block()}${block()}${block()}</div>`;
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '실제 크기 · 모양에 맞춥니다',
      do: [busy([1, 2, 3].map(gridRow).join(''), 'flex:1;min-width:0'),
        '실제 목록과 같은 열 비율 · 행 높이로 그려, 내용이 들어와도 배치가 바뀌지 않습니다.'],
      dont: [busy(`${line()}${line()}${line('60%')}`, 'flex:1;min-width:0'),
        '실제 배치와 다른 회색 막대를 두면 내용이 들어올 때 배치가 바뀌어 화면이 흔들립니다.'] },
  ]),
};
const optSrc = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

// ── 시안 — A 빛(추천, 위 「조각」) · B 깜빡임 · C 정지. 묶음(aria-busy)에 클래스 하나 ──
const optSkel = (cls) => '<div class="sb-field ' + cls + '" aria-busy="true"><span class="sr-only">불러오는 중</span><span class="skeleton-title" aria-hidden="true"></span><span class="skeleton-line" aria-hidden="true"></span><span class="skeleton-line" aria-hidden="true"></span><span class="skeleton-line" aria-hidden="true"></span></div>';
export const 시안_깜빡임 = { parameters: optSrc(optSkel('skeleton--pulse')), render: () => optSkel('skeleton--pulse') };
export const 시안_정지 = { parameters: optSrc(optSkel('skeleton--static')), render: () => optSkel('skeleton--static') };
