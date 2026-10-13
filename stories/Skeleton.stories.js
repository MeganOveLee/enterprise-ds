// Feedback/Skeleton — 문서 화면은 Skeleton.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시
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
  parameters: { docs: { description: { story: '목록 화면 — 실제 그리드와 같은 열 비율로' } } },
  render: () => busy([1, 2, 3, 4, 5].map(() =>
    `<div class="skeleton-grid-row">${block('16px', '16px')}${block()}${block()}${block()}${block()}</div>`).join(''), 'max-width:720px'),
};

export const 상세_폼 = {
  parameters: { docs: { description: { story: '등록 · 상세 팝업 — 라벨 | 입력칸' } } },
  render: () => busy(`<div class="skeleton-form">${[1, 2, 3, 4].map(() => `${line('80px')}${block()}`).join('')}</div>`, 'max-width:480px'),
};

export const 카드 = {
  parameters: { docs: { description: { story: '대시보드 — 제목 · 숫자 · 차트 자리' } } },
  render: () => `<div class="sb-row" style="align-items:stretch">${[1, 2, 3].map(() =>
    busy(`<div class="skeleton-card"><span class="skeleton-title" aria-hidden="true"></span>${block('80px', '28px')}<div style="height:12px"></div>${block('100%', '64px')}</div>`, 'width:220px')).join('')}</div>`,
};
