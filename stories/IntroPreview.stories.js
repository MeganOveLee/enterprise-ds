// 소개 페이지 「미리보기」 — 실제 컴포넌트 클래스로 그린 작은 업무 화면.
// 도구 막대의 브랜드 · 화면 모드를 그대로 따른다(문서 틀은 고정, 이 영역만 바뀜).
// 메뉴에는 안 보이고 소개.mdx 안에서만 쓴다
const ROWS = [
  ['ECR-0142', '브레이크 캘리퍼 홀 위치 2mm 이동', '10-13'],
  ['ECR-0139', '하우징 재질 변경 (AL6061 → AL7075)', '10-10'],
  ['ECR-0131', '커넥터 핀 배열 도면 개정', '10-02'],
];

export default {
  title: 'Internal/Intro Preview',
  tags: ['!dev', '!autodocs'],
  parameters: { controls: { disable: true } },
};

export const Sample = {
  render: () => `
<div class="intro-demo">
  <section class="card">
    <div class="card-header">
      <h3 class="card-title">설계 변경 요청 <span class="card-title-count">${ROWS.length}</span></h3>
      <div class="sb-row">
        <button type="button" class="btn btn--secondary btn--outlined">내보내기</button>
        <button type="button" class="btn btn--primary btn--filled">요청 등록</button>
      </div>
    </div>
    <div class="intro-demo__search">
      <input class="input" aria-label="부품 번호" placeholder="부품 번호">
      <select class="select" aria-label="구분"><option>전체 구분</option><option>설계 변경</option><option>도면 개정</option></select>
      <label class="checkbox"><input type="checkbox" checked>내 요청만</label>
      <button type="button" class="btn btn--secondary btn--filled">조회</button>
    </div>
    <ul class="card-list">
${ROWS.map(([no, title, date]) => `      <li><a href="#"><span class="intro-demo__no">${no}</span><span class="item-title">${title}</span><span class="item-date">${date}</span></a></li>`).join('\n')}
    </ul>
  </section>
</div>`,
};
