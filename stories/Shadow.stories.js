// Foundation/Shadow — 문서 화면은 Shadow.mdx
import { mount } from './_foundation.js';

export default {
  title: 'Foundation/Shadow',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Shadow.mdx
};
const css = (lines) => ({ docs: { source: { language: 'css', code: lines.join('\n') } } });

export const 그림자 = {
  parameters: css(['.card { box-shadow: var(--shadow-core); }', '.datepicker { box-shadow: var(--shadow-popover); }', '.pop-area { box-shadow: var(--shadow-modal); }']),
  render: () => mount(`<div style="display:flex;gap:16px;flex-wrap:wrap;padding:16px;background:var(--color-bg-subtle);border-radius:var(--radius-lg)">
    ${[['core', '카드'], ['popover', '드롭다운 · 달력 · 다중 선택 목록 · 사용자 메뉴 · 토스트'], ['modal', '모달(같은 페이지 위 창)']].map(([n, use]) => `
    <div class="fd-card" style="flex:1 1 180px;box-shadow:var(--shadow-${n})"><code>--shadow-${n}</code><div class="fd-use">${use}</div></div>`).join('')}
  </div>`),
};
