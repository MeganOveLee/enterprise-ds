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
  parameters: { docs: { description: { story: '목록 화면 — 실제 그리드와 같은 열 비율로' } } },
  render: () => busy([1, 2, 3, 4, 5].map(() =>
    `<div class="skeleton-grid-row">${block('16px', '16px')}${block()}${block()}${block()}${block()}</div>`).join(''), 'max-width:720px'),
};

const field = () => `<div class="skeleton-field">${line()}${block()}</div>`;
export const 상세_폼 = {
  parameters: { docs: { description: { story: '등록 창 — 라벨 위 · 입력 필드 2열' } } },
  render: () => busy(`<div class="skeleton-form">${[1, 2, 3, 4].map(field).join('')}</div>`, 'max-width:560px'),
};

export const 카드 = {
  parameters: { docs: { description: { story: '대시보드 — 제목 · 숫자 · 차트 자리' } } },
  render: () => `<div style="display:flex;flex-wrap:wrap;gap:16px">${[1, 2, 3].map(() =>
    busy(`<div class="skeleton-card"><span class="skeleton-title" aria-hidden="true"></span>${block('80px', '28px')}<div style="height:12px"></div>${block('100%', '64px')}</div>`, 'width:220px')).join('')}</div>`,
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-102) ── 미리보기만, 코드는 위 예시 카드에
const gridRow = () => `<div class="skeleton-grid-row">${block('16px', '16px')}${block()}${block()}${block()}${block()}</div>`;
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: Skeleton 구성 「배치」 — 실제 그리드와 같은 비율이라 내용이 와도 자리가 흔들리지 않음
    { title: '목록 자리는 목록 행 골격으로',
      do: [busy([1, 2, 3].map(gridRow).join(''), 'flex:1;min-width:0'),
        '실제 그리드와 같은 열 비율로 행을 그려, 내용이 와도 자리가 그대로입니다.'],
      dont: [busy(block('100%', '64px'), 'flex:1;min-width:0'),
        '덩어리 하나로 덮으면 내용이 올 때 자리가 바뀌어 화면이 흔들립니다.'] },
    // 근거: Skeleton 구성 「배치」 — .skeleton-form = 라벨 위 · 입력 필드, 조각을 조합
    { title: '폼 자리는 라벨 · 입력 필드 골격으로',
      do: [busy(`<div class="skeleton-form">${[1, 2, 3, 4].map(field).join('')}</div>`, 'flex:1;min-width:0'),
        '라벨과 입력 필드를 한 쌍으로 그려 폼의 행 수가 먼저 보입니다.'],
      dont: [busy(`${line()}${line()}${line()}${line('60%')}`, 'flex:1;min-width:0'),
        '글자 줄만 늘어놓으면 라벨과 입력 필드 자리가 보이지 않습니다.'] },
  ]),
};
