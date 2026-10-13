/** 위쪽 도구 막대 「Figma ↗」 — 포트폴리오로 보는 사람이 어느 페이지에서든 Figma 원본(UI Kit 첫 페이지 = 한 장 요약)으로 바로 가게 (10/13)
 * 페이지마다 링크를 달지 않는다는 결정(입구는 소개 하나)은 그대로 — 이건 페이지 밖, 도구 막대 한 곳 */
import React from 'react';
import { addons, types } from 'storybook/manager-api';

const FIGMA = 'https://www.figma.com/design/99ff5JQYQPCdY3xRBWHHlO/?node-id=8111-5';
const ICON = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%224%204%2056%2056%22%20id%3D%22figma%22%3E%3Cpath%20fill%3D%22%23161616%22%20fill-rule%3D%22evenodd%22%20d%3D%22m60%2C12c0-4.42-3.58-8-8-8H12c-4.42%2C0-8%2C3.58-8%2C8v40c0%2C4.42%2C3.58%2C8%2C8%2C8h40c4.42%2C0%2C8-3.58%2C8-8V12h0Z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%230cc2ff%22%20fill-rule%3D%22evenodd%22%20d%3D%22m39.01%2C25.01c3.87%2C0%2C7.01%2C3.14%2C7.01%2C7.01s-3.14%2C7.01-7.01%2C7.01-7.01-3.14-7.01-7.01%2C3.14-7.01%2C7.01-7.01h0Z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%23ff7568%22%20fill-rule%3D%22evenodd%22%20d%3D%22m46%2C18c0-3.87-3.13-7-7-7h-14.02c-3.87%2C0-7%2C3.13-7%2C7s3.13%2C7%2C7%2C7h14.02c3.87%2C0%2C7-3.13%2C7-7h0Z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%23af5bff%22%20fill-rule%3D%22evenodd%22%20d%3D%22m31.99%2C25.01h-7.01c-1.86%2C0-3.64.74-4.95%2C2.05-1.31%2C1.31-2.05%2C3.09-2.05%2C4.95s.74%2C3.64%2C2.05%2C4.95c1.31%2C1.31%2C3.09%2C2.05%2C4.95%2C2.05h7.01v-14h0Z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%23ff4611%22%20fill-rule%3D%22evenodd%22%20d%3D%22m31.99%2C11h-7.01c-1.86%2C0-3.64.74-4.95%2C2.05-1.31%2C1.31-2.05%2C3.09-2.05%2C4.95s.74%2C3.64%2C2.05%2C4.95c1.31%2C1.31%2C3.09%2C2.05%2C4.95%2C2.05h7.01v-14h0Z%22%3E%3C/path%3E%3Cpath%20fill%3D%22%2300e681%22%20fill-rule%3D%22evenodd%22%20d%3D%22m32%2C38.99h-7.01c-1.86%2C0-3.64.74-4.95%2C2.05-1.31%2C1.31-2.05%2C3.09-2.05%2C4.95s.74%2C3.64%2C2.05%2C4.95c1.31%2C1.31%2C3.09%2C2.05%2C4.95%2C2.05h0c1.86%2C0%2C3.64-.74%2C4.95-2.05%2C1.31-1.31%2C2.05-3.09%2C2.05-4.95v-7h0Z%22%3E%3C/path%3E%3C/svg%3E';
const h = React.createElement;

addons.register('ds-figma-link', () => {
  addons.add('ds-figma-link/tool', {
    type: types.TOOL,
    title: 'Figma에서 보기',
    match: ({ viewMode }) => viewMode === 'docs' || viewMode === 'story',
    render: () => h('a', {
      href: FIGMA,
      target: '_blank',
      rel: 'noreferrer',
      title: 'Figma UI Kit — 첫 페이지가 한 장 요약입니다 (새 탭)',
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'center', height: 28, margin: '0 4px 0 8px', padding: '0 10px 0 6px',
        borderRadius: 6, background: '#161616', color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1, textDecoration: 'none', whiteSpace: 'nowrap',
      },
    }, h('img', { src: ICON, alt: '', width: 18, height: 18, style: { display: 'block', borderRadius: 4 } }), 'Figma에서 보기 ↗'),
  });
});
