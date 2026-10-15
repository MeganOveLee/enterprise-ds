// Foundation/Shadow — 문서 화면은 Shadow.mdx. Spacing · Radius 문서에 있던 그림자를 따로 뺌(10/15 세영 — 10/13 최종 목차의 Foundation › Shadow)
import { mount } from './_foundation.js';

export default {
  title: 'Foundation/Shadow',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Shadow.mdx
};
const css = (lines) => ({ docs: { source: { language: 'css', code: lines.join('\n') } } });

export const 그림자 = {
  parameters: css(['.card { box-shadow: var(--shadow-core); }', '.datepicker { box-shadow: var(--shadow-popover); }', '.pop-area { box-shadow: var(--shadow-modal); }']),
  render: () => mount(`<div style="display:flex;gap:16px;flex-wrap:wrap;padding:16px;background:var(--color-bg-subtle);border-radius:var(--radius-lg)">
    ${[['core', '카드 · 달력 화살표'], ['popover', '드롭다운 · 달력 · 다중 선택 목록'], ['modal', '인페이지 팝업']].map(([n, use]) => `
    <div class="fd-card" style="flex:1 1 180px;box-shadow:var(--shadow-${n})"><code>--shadow-${n}</code><div class="fd-use">${use}</div></div>`).join('')}
  </div>
  <p class="fd-use" style="margin:8px 0 0">그림자는 역할(카드 · 떠 있는 층 · 덮개 층)로 나눕니다. 면 구분은 주로 배경색 차이와 테두리로 하고, 그림자는 바닥에서 뜬 정도만 나타냅니다.</p>`),
};
