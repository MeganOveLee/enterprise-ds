/** 위쪽 도구 막대 「Figma ↗」: 처음 보는 사람이 어느 페이지에서든 Figma 원본(UI Kit 첫 페이지 = 한 장 요약)으로 바로 가게 
 * 페이지마다 링크를 달지 않는다는 결정(입구는 소개 하나)은 그대로: 이건 페이지 밖, 도구 막대 한 곳 */
import React from 'react';
import { addons, types, useGlobals } from 'storybook/manager-api';
import { Select, Separator } from 'storybook/internal/components';
import { BrowserIcon, MobileIcon, PaintBrushIcon, MirrorIcon } from '@storybook/icons';

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
      title: 'Figma UI Kit: 첫 페이지가 한 장 요약입니다 (새 탭)',
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'center', height: 28, margin: '0 4px 0 8px', padding: '0 10px 0 6px',
        borderRadius: 6, background: '#161616', color: '#fff', fontSize: 12, fontWeight: 600, lineHeight: 1, textDecoration: 'none', whiteSpace: 'nowrap',
      },
    }, h('img', { src: ICON, alt: '', width: 18, height: 18, style: { display: 'block', borderRadius: 4 } }), 'Figma에서 보기 ↗'),
  });
});

/** 기기 · 브랜드 · 화면 모드(DS-ADR-055): 기기를 먼저 고르고, 브랜드 목록은 그 기기의 브랜드만 보인다.
 * PLM 웹 = Default · OOTB 고르기, 모바일 앱 = Mobility 하나라 이름표로만 보인다.
 * 기본 도구 막대(preview.js globalTypes toolbar)는 쓰지 않고 여기서 세 칸을 그린다: 기기가 맨 앞에 오고, 브랜드 목록이 기기를 따라 바뀌게 */
const DEVICES = [
  { value: 'web', title: 'PLM 웹', icon: BrowserIcon },
  { value: 'mobile', title: '모바일 앱', icon: MobileIcon },
];
const BRANDS = {
  web: [{ value: 'default', title: 'Default' }, { value: 'ootb', title: 'OOTB · Windchill 화면 리디자인' }],
  mobile: [{ value: 'mobility', title: 'Mobility' }],
};
const MODES = [{ value: 'light', title: '라이트' }, { value: 'dark', title: '다크' }];
const DEVICE_BRAND = { web: 'default', mobile: 'mobility' };   // 기기를 바꾸면 그 기기의 대표 브랜드로
const BRAND_DEVICE = { default: 'web', ootb: 'web', mobility: 'mobile' };
const deviceOf = (g) => (g.device === 'mobile' ? 'mobile' : 'web');

const pick = (label, options, value, onSelect, Icon) => h(Select, {
  key: label + value,   // 고른 값이 바뀌면 다시 그려 지금 값을 보인다
  ariaLabel: label, tooltip: label, options, defaultOptions: [value], showSelectedOptionTitle: true,
  icon: h(Icon), onSelect,
}, label);

const GlobalsTool = () => {
  const [globals, updateGlobals] = useGlobals();
  const device = deviceOf(globals);
  const brands = BRANDS[device];
  const brand = brands.some((b) => b.value === globals.brand) ? globals.brand : DEVICE_BRAND[device];
  const setDevice = (v) => updateGlobals({ device: v, brand: BRANDS[v].some((b) => b.value === globals.brand) ? globals.brand : DEVICE_BRAND[v] });
  return h(React.Fragment, null,
    h(Separator),   // Figma 링크와 고르는 칸 사이 선(기본 도구 막대와 같은 자리)
    pick('기기', DEVICES.map((d) => ({ value: d.value, title: d.title, icon: h(d.icon) })), device, setDevice, device === 'mobile' ? MobileIcon : BrowserIcon),
    brands.length > 1
      ? pick('브랜드', brands, brand, (v) => updateGlobals({ brand: v }), PaintBrushIcon)
      : h('span', {
        title: '모바일 앱 브랜드는 ' + brands[0].title + ' 하나입니다', 'aria-label': '브랜드 ' + brands[0].title,
        style: { display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'center', height: 28, padding: '0 8px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' },
      }, h(PaintBrushIcon), brands[0].title),
    pick('화면 모드', MODES, globals.mode === 'dark' ? 'dark' : 'light', (v) => updateGlobals({ mode: v }), MirrorIcon));
};

addons.register('ds-globals', () => {
  addons.add('ds-globals/tool', {
    type: types.TOOL,
    title: '기기 · 브랜드 · 화면 모드',
    match: ({ viewMode }) => viewMode === 'docs' || viewMode === 'story',
    render: () => h(GlobalsTool),
  });
});

/** 왼쪽 메뉴 거르기와 기기 · 브랜드 맞추기(DS-ADR-055)
 * 스토리 파일 meta tags: device-mobile = 모바일 앱 전용, device-web = PLM 웹 전용, 표시 없음 = 공통 · 문서 · Foundation
 * 처음 열 때: 주소에 brand가 있으면 기기를 그 브랜드에, device만 있으면 브랜드를 그 기기에 맞춘다
 * 그 뒤: 문서 안 브랜드 버튼으로 브랜드가 바뀌면 기기가, 기기가 바뀌면 브랜드가 따라간다 */
const urlHas = (key) => {
  try { return new RegExp('(^|;)' + key + ':').test(new URLSearchParams(window.location.search).get('globals') || ''); } catch (e) { return false; }
};

addons.register('ds-device-filter', (api) => {
  let current;
  let currentBrand;
  const apply = ({ globals } = {}) => {
    if (!globals) return;
    const device = deviceOf(globals);
    const first = currentBrand === undefined;
    const brandChanged = !first && globals.brand !== currentBrand;
    currentBrand = globals.brand;
    const brandDevice = BRAND_DEVICE[globals.brand];
    if (brandDevice && brandDevice !== device) {
      // 기기와 브랜드가 어긋남: 처음에는 주소를, 그 뒤에는 방금 바뀐 쪽을 따른다
      const followBrand = first ? (urlHas('brand') || !urlHas('device')) : brandChanged;
      api.updateGlobals(followBrand ? { device: brandDevice } : { brand: DEVICE_BRAND[device] });
      if (followBrand) return;
    }
    if (device === current) return;
    current = device;
    const hide = device === 'mobile' ? 'device-web' : 'device-mobile';
    api.experimental_setFilter('ds-device', (item) => !(item.tags || []).includes(hide));
  };
  api.on('setGlobals', apply);
  api.on('globalsUpdated', apply);
});
