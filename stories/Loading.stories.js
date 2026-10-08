// 브랜드 로더 로고 — 브랜드(제품)에 로고 로더가 있으면 로고, 없으면 스피너 --lg (이퍼플)
const LOGO = { e3ps: new URL('../assets/brand/e3ps-logo.png', import.meta.url).href };
const brandLoader = (src) =>
  `<span class="brand-loader" aria-hidden="true"><img class="brand-loader__base" src="${src}" alt=""><img class="brand-loader__fill" src="${src}" alt=""></span>`;

const spin = (size = '', tone = '') =>
  `<span class="spinner${size ? ' spinner--' + size : ''}${tone ? ' spinner--' + tone : ''}" aria-hidden="true"></span>`;

export default {
  title: 'Feedback/Loading',
  tags: ['!dev'],   // 개별 예시는 메뉴에서 숨기고 Docs 페이지 안 섹션으로만 (MDX 문서는 그대로 보이게 파일마다 지정)
  parameters: {
    docs: { description: { component:
      '진행률을 모를 때 쓰는 스피너와, 스피너 · 문구 · 취소를 묶은 `.loading`. ' +
      '**시간 규칙** — 3초 미만은 스피너만 · 3~10초는 안내 문구 · 10초가 넘을 것 같으면 진행률 + 취소(가능하면 백그라운드). ' +
      '알림은 `role="status"`가 맡고 스피너는 장식(`aria-hidden`). 모션 줄이기 설정이면 느리게 돌아요.' } },
  },
};

export const 스피너_크기 = {
  render: () => `<div class="sb-row" style="gap:24px">
    ${spin('sm')} ${spin()} ${spin('lg')} ${spin('', 'neutral')}
  </div>`,
  parameters: { docs: { description: { story: '`--sm` 16 (버튼 · 셀 안) · 기본 24 (영역) · `--lg` 40 (페이지 · 팝업) · `--neutral` 회색' } } },
};

export const 구성_3단계 = {
  render: () => `<div class="sb-row" style="align-items:flex-start;gap:32px">
    <div class="loading" role="status">${spin()}<span class="sr-only">불러오는 중</span></div>
    <div class="loading" role="status" aria-live="polite">${spin()}<p class="loading__text">문서 목록을 불러오는 중입니다</p></div>
    <div class="loading" role="status" aria-live="polite">${spin('lg')}
      <p class="loading__text">도면 2,481건을 엑셀로 만드는 중입니다</p>
      <p class="loading__sub">1분 정도 걸릴 수 있어요</p>
      <div class="loading__actions"><button type="button" class="btn btn--secondary btn--outlined">취소</button></div>
    </div>
  </div>`,
};

export const 영역_오버레이 = {
  name: '영역 오버레이 (Overlay)',
  render: () => `<div style="position:relative;max-width:480px;border:1px solid var(--color-border-base);border-radius:var(--radius-lg)">
    <div style="padding:16px">
      <div class="skeleton-title" style="animation:none"></div>
      <p style="margin:0">오버레이가 이 영역을 덮어 조작을 막아요. 부모에 position: relative가 필요해요.</p>
      <p style="margin:8px 0 0">그리드 · 팝업 본문을 다시 불러올 때 써요.</p>
    </div>
    <div class="loading loading--overlay" role="status" aria-live="polite">${spin()}<p class="loading__text">다시 불러오는 중</p></div>
  </div>`,
};

export const 페이지_로딩 = {
  render: (_, { globals }) => {
    const logo = LOGO[globals.brand];
    return `<div style="position:relative;height:240px;max-width:640px;border:1px solid var(--color-border-base);border-radius:var(--radius-lg);overflow:hidden">
      <div class="loading loading--overlay" role="status" aria-live="polite">${logo ? brandLoader(logo) : spin('lg')}<p class="loading__text">화면을 불러오는 중입니다</p></div>
    </div>`;
  },
  parameters: { docs: { description: { story:
    '페이지 전체를 처음 불러올 때만 — 브랜드에 로고 로더가 있으면 로고가 왼쪽부터 채워지고(E3PS), 없으면 스피너 `--lg`(이퍼플). ' +
    '영역 · 버튼 안은 언제나 스피너. 로고 이미지는 원본 그대로 두 장 겹쳐 쓰고(아래 회색 · 위 원본), 모션 줄이기 설정이면 느리게.' } } },
};

export const 버튼_안 = {
  render: () => `<div class="sb-row">
    <button type="button" class="btn btn--primary btn--filled is-loading" aria-busy="true">${spin('sm', 'neutral')}저장 중</button>
    <span class="loading loading--inline" role="status">${spin('sm')}<span class="loading__text">확인 중</span></span>
  </div>`,
};
