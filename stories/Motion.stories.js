// Foundation/Motion — 문서 화면은 Motion.mdx. 움직임 세 가지 견본: 빛(지금 처리 중) · 깜빡임(봐야 할 경고 = 지연, 두근 박동) · 정지(저장된 값) + 인터랙션 12가지(아래)
// TD-48 — 빛은 지금 처리 중일 때만, 첫 자리 = 첨부 업로더 올리는 중 막대. 값은 tokens.css 모션 토큰
// 견본은 실제 컴포넌트 마크업 그대로(업로더 · 상태 표시 · 진행률 막대) — 화면에서 보는 움직임과 같음
import { fileIcon } from './_fileicon.js';
import { emptyArt } from './_illustrations.js';

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
const planText = (pct, plan) => '진행률 ' + pct + '%, 계획 ' + plan + '%, ' + (plan > pct ? (plan - pct) + '%p 늦음' : plan < pct ? (pct - plan) + '%p 빠름' : '계획대로');
const bar = (k, pct, name, plan) =>
  '<div class="progress-bar progress-bar--' + k + '" role="progressbar" aria-label="' + name + ' 진행률" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"' +
  (plan === undefined ? '' : ' aria-valuetext="' + planText(pct, plan) + '"') + '>' +
  '<div class="pbar-fill" style="width:' + pct + '%"></div><span class="progress-bar__label">' + pct + '%</span>' +
  (plan === undefined ? '' : '<span class="progress-bar__plan" style="--plan:' + plan + '%" aria-hidden="true"></span>') + '</div>';
// 진행 현황 한 줄 — Screens › 프로젝트 상세와 같은 마크업(상태 표시 + 「전체 진행률」 머리 + 계획 표식 막대). 머리 글자 배치만 화면 쪽 스타일이라 여기선 인라인
const meta = (pct, plan) => '<div style="display:flex;align-items:baseline;gap:12px;font-size:var(--body-sm);color:var(--color-text-muted)">' +
  '<b style="font-size:var(--body-md);font-weight:var(--font-weight-semibold);color:var(--color-text-base)">전체 진행률</b>' +
  '<span>계획 ' + plan + '% · 실적 ' + pct + '%' + (plan > pct ? ' · <b style="font-weight:var(--font-weight-semibold);color:var(--color-text-danger-bold)">' + (plan - pct) + '%p 늦음</b>' : '') + '</span></div>';
const summary = (k, pct, plan) => '<div class="progress-row" style="gap:var(--spacing-24)">' + status(k) +
  '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:6px">' + meta(pct, plan) + '<div class="progress-row">' + bar(k, pct, '전체', plan) + '</div></div></div>';

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

// 깜빡임(Pulse) — 지연 상태 표시의 막대 5개가 두근 · 두근 · 쉼(statusPulse, 밝기만), 같은 줄 진행률 막대는 같은 박자로 붉은 번짐 + 두 박동에 한 번 옅은 빛(TD-123 · TD-108 46).
// 다른 상태는 정지. 상태는 옆 글자가 알려 주고 막대는 꾸밈(aria-hidden). 마크업 = Screens › 프로젝트 상세 진행 현황과 같음
export const 깜빡임 = {
  parameters: html(summary('delay', 58, 64)),
  render: () => box(summary('delay', 58, 64), '720px'),
};

// 정지 — 저장된 값(진행 상태 표시 + 진행률 막대). 지금 바뀌는 중이 아니라 움직이지 않음(값이 바뀔 때만 채움이 늘어남)
export const 정지 = {
  parameters: html(summary('progress', 72, 70)),
  render: () => box(summary('progress', 72, 70), '720px'),
};

// ── 인터랙션 12가지 (DS-ADR-041, TD-108 44번) ── 견본마다 실제 컴포넌트 마크업 + 누르면 움직이는 짧은 스크립트(제품은 화면 스크립트가 dsMotion 을 부름)
// 동작 줄이기 설정이면 움직이지 않고 결과만 보임(js/motion.js · components.css 「인터랙션」)
const el = (h, w = '560px') => { const d = document.createElement('div'); d.style.maxWidth = w; d.innerHTML = h; return d; };
const M = () => window.dsMotion;
const btn = (t, cls, attrs = '') => '<button type="button" class="btn ' + cls + '"' + attrs + '>' + t + '</button>';
const CHECK12 = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-4.9"/></svg>';
const GRIP = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="6" cy="4" r="1.2"/><circle cx="10" cy="4" r="1.2"/><circle cx="6" cy="8" r="1.2"/><circle cx="10" cy="8" r="1.2"/><circle cx="6" cy="12" r="1.2"/><circle cx="10" cy="12" r="1.2"/></svg>';
const row = (h) => '<div class="sb-row">' + h + '</div>';

// 1 처리 중 글자 — 몇 초 걸리는 처리의 안내 문구에 빛이 지나감(Shimmer 와 같은 뜻 · 같은 한 바퀴). 문구 앞에 스피너(3 ~ 10초 = 스피너 + 안내 문구, Loading 시간 규칙)
const SHIMMER = '<div class="loading" role="status">\n  <div class="loading loading--inline">\n    <span class="spinner spinner--sm" aria-hidden="true"></span>\n    <p class="loading__text text-shimmer">BOM 두 판을 비교하는 중입니다</p>\n  </div>\n  <p class="loading__sub">BRK-20417 · 부품 214개</p>\n</div>';
export const 처리_중_글자 = {
  parameters: html(SHIMMER),
  render: () => el(SHIMMER),
};

// 2 단계 목록 — 끝난 단계 체크 · 지금 단계 도는 고리 · 남은 단계 빈 원
const STEPS = ['도면 파일 확인', '부품 214개 대조', '차이 3건 정리'];
const stepItem = (t, st) => '<li class="steps__item' + (st ? ' is-' + st : '') + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="steps__mark" aria-hidden="true">' + CHECK12 + '</span>' + t + (st === 'done' ? '<span class="sr-only"> 완료</span>' : '') + '</li>';
const steps = (at) => '<ol class="steps" aria-label="BOM 비교 단계">' + STEPS.map((t, i) => stepItem(t, i < at ? 'done' : i === at ? 'current' : '')).join('') + '</ol>';
export const 단계_목록 = {
  parameters: html('<div class="loading" role="status">\n  ' + steps(1) + '\n</div>'),
  render: () => {
    const d = el('<div class="loading" role="status" style="align-items:flex-start">' + steps(0) + '</div>' + row(btn('다시 보기', 'btn--secondary btn--outlined')), '360px');
    let timers = [];
    const play = () => {
      timers.forEach(clearTimeout); timers = [];
      const box = d.querySelector('.loading');
      box.innerHTML = steps(0);
      if (M() && M().reducedMotion()) { box.innerHTML = steps(STEPS.length); return; }
      for (let i = 1; i <= STEPS.length; i++) timers.push(setTimeout(() => { box.innerHTML = steps(i); }, i * 1100));
    };
    d.querySelector('.btn').addEventListener('click', play);
    setTimeout(play, 300);
    return d;
  },
};

// 3 숫자 굴러가기 — 업무 개수가 바뀌는 순간 자릿수가 굴러감. 읽는 값은 안의 숨김 글자
const kpi = (t, id) => '<div class="card" style="flex:1;gap:4px"><span class="card-title" style="font-size:var(--body-sm)">' + t + '</span><b data-kpi="' + id + '" style="font-size:28px;font-weight:700"></b></div>';
export const 숫자_굴러가기 = {
  parameters: html('<b id="wait-count"></b>\n<script>dsMotion.roll(document.getElementById("wait-count"), 12);   // 값이 바뀔 때마다 같은 함수로 — 11</script>'),
  render: () => {
    const d = el('<div style="display:flex;gap:12px">' + kpi('결재 대기', 'a') + kpi('이번 주 승인', 'b') + '</div>' + row(btn('1건 승인', 'btn--primary btn--filled') + btn('처음으로', 'btn--secondary btn--transparent')), '420px');
    d.style.display = 'grid'; d.style.gap = '12px';
    const a = d.querySelector('[data-kpi="a"]'), b = d.querySelector('[data-kpi="b"]');
    let va = 12, vb = 9;
    const reset = () => { va = 12; vb = 9; M().roll(a, va); M().roll(b, vb); };
    const [go, back] = d.querySelectorAll('.btn');
    go.addEventListener('click', () => { if (va > 0) { va -= 1; vb += 1; M().roll(a, va); M().roll(b, vb); } });
    back.addEventListener('click', reset);
    requestAnimationFrame(() => M() && reset());
    return d;
  },
};

// 4 방금 바뀐 행 — 저장 직후 그 행이 옅은 브랜드 바탕으로 떴다가 사라짐
const DOCS = [['DOC-2610-0013', '브레이크 캘리퍼 조립 사양서', 'B.2'], ['DOC-2610-0012', '하우징 재질 변경 검토 보고서', 'A.3'], ['DOC-2610-0011', '커넥터 핀 배열 설계 기준', 'A.1']];
const docTable = '<div class="table_list"><div class="list"><table class="grid-table" aria-label="문서 목록"><colgroup><col style="width:140px"><col><col style="width:64px"></colgroup>' +
  '<thead><tr><th>문서 번호</th><th>문서 명</th><th>버전</th></tr></thead><tbody>' +
  DOCS.map(([n, t, v]) => '<tr><td><a href="#" class="grid-custom-rows-link">' + n + '</a></td><td class="is-left">' + t + '</td><td>' + v + '</td></tr>').join('') + '</tbody></table></div></div>';
export const 방금_바뀐_행 = {
  parameters: html('<tr class="is-flash">…</tr>   <!-- 또는 dsMotion.flash(행) — 저장 · 추가 직후 한 번 -->'),
  render: () => {
    const d = el(docTable + row(btn('개정 저장', 'btn--primary btn--filled')));
    d.style.display = 'grid'; d.style.gap = '12px';
    let rev = 3;
    d.querySelector('.btn').addEventListener('click', () => {
      rev += 1;
      const tr = d.querySelectorAll('tbody tr')[1];
      tr.lastElementChild.textContent = 'A.' + rev;
      M().flash(tr);
      M().announce('DOC-2610-0012 버전 A.' + rev + '로 저장되었습니다.');
    });
    return d;
  },
};

// 5 상태 칩이 바뀜 — 승인 직후 칩이 한 번 튀며 새 색으로
export const 상태_칩_바뀜 = {
  parameters: html('<span class="status-chip status-chip--success is-changed">승인</span>   <!-- 또는 글자 · 색을 바꾼 뒤 dsMotion.pop(칩) -->'),
  render: () => {
    const d = el(row('<span style="font-size:var(--body-sm);color:var(--color-text-muted)">DOC-2610-0012 · 하우징 재질 변경 검토 보고서</span><span class="status-chip status-chip--warning">검토</span>') +
      row(btn('승인', 'btn--primary btn--filled') + btn('처음으로', 'btn--secondary btn--transparent')));
    d.style.display = 'grid'; d.style.gap = '12px';
    const chip = d.querySelector('.status-chip');
    const [ok, back] = d.querySelectorAll('.btn');
    ok.addEventListener('click', () => { chip.className = 'status-chip status-chip--success'; chip.textContent = '승인'; M().pop(chip); });
    back.addEventListener('click', () => { chip.className = 'status-chip status-chip--warning'; chip.textContent = '검토'; });
    return d;
  },
};

// 6 누르면 살짝 들어감 — 누르는 동안 버튼 · 페이지 번호가 96%로
const PRESS = row(btn('등록', 'btn--primary btn--filled') + btn('임시 저장', 'btn--secondary btn--outlined') + btn('필터 초기화', 'btn--secondary btn--transparent')) +
  '<nav class="ui-pagination" aria-label="페이지 이동" style="justify-content:flex-start">' + [1, 2, 3].map((n) => '<button type="button" class="ui-pagination__btn' + (n === 1 ? ' is-active" aria-current="page' : '') + '">' + n + '</button>').join('') + '</nav>';
export const 누름 = {
  parameters: html('<button type="button" class="btn btn--primary btn--filled">등록</button>   <!-- 클래스 추가 없음 — 누르는 동안 --scale-press -->'),
  render: () => { const d = el(PRESS); d.style.display = 'grid'; d.style.gap = '12px'; return d; },
};

// 7 탭 밑줄이 미끄러짐 — js/tabs.js 가 밑줄 하나를 고른 탭 아래로 옮김
const TABS = ['기본 정보', '첨부 파일', '결재 이력', '관련 도면'];
const popTabs = '<div class="tab"><ul role="tablist" aria-label="문서 상세">' + TABS.map((t, i) => '<li role="tab" tabindex="' + (i ? -1 : 0) + '" aria-selected="' + !i + '"' + (i ? '' : ' class="is-active"') + '>' + t + '</li>').join('') + '</ul></div>';
export const 탭_밑줄 = {
  parameters: html('<script src="js/tabs.js"></script>   <!-- 고른 탭(aria-selected · .is-active)이 바뀌면 밑줄이 따라감 -->\n' + popTabs),
  render: () => {
    const d = el('<div class="pop" style="height:auto;min-width:0;overflow:visible">' + popTabs + '</div>');
    const tabs = [...d.querySelectorAll('[role="tab"]')];
    const pick = (t, focus) => { tabs.forEach((x) => { const on = x === t; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; }); if (focus) t.focus(); };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', (e) => { const k = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key]; if (k === undefined) return; e.preventDefault(); pick(tabs[(k + tabs.length) % tabs.length], true); });
    });
    if (window.dsTabsInit) window.dsTabsInit(d);
    return d;
  },
};

// 8 저장 버튼이 체크로 — 처리 중(스피너) 뒤 같은 자리에 「✓ 저장됨」, 결과 문장은 알림 자리로
export const 처리_끝_체크 = {
  parameters: html('<button type="button" class="btn btn--primary btn--filled">저장</button>\n<script>\n  // 저장 요청이 끝나면\n  dsMotion.done(button, { text: "저장됨", message: "문서가 저장되었습니다." });\n</script>'),
  render: () => {
    const d = el(row(btn('저장', 'btn--primary btn--filled', ' style="min-width:96px"')));
    const b = d.querySelector('.btn');
    b.addEventListener('click', () => {
      if (b.classList.contains('is-loading') || b.classList.contains('is-done')) return;
      b.classList.add('is-loading'); b.setAttribute('aria-busy', 'true');
      b.innerHTML = '<span class="spinner" aria-hidden="true"></span>저장 중';
      setTimeout(() => { b.textContent = '저장'; M().done(b, { text: '저장됨', message: '문서가 저장되었습니다.' }); }, M().reducedMotion() ? 0 : 900);
    });
    return d;
  },
};

// 9 다음 차이로 — [다음 차이]가 다음 비교 결과 줄로 내려가고 그 줄이 한 번 테두리로 깜빡임
const PARTS = [['BRK-20417-01', '캘리퍼 바디', '1', '1'], ['BRK-20417-02', '피스톤 Ø54', '2', '2'], ['BRK-20417-03', '피스톤 실', '2', '2'], ['BRK-20417-04', '더스트 부트', '2', '2'],
  ['BRK-20417-05', '블리더 스크루', '1', '1'], ['BRK-20417-06', '패드 스프링', '2', '4'], ['BRK-20417-07', '가이드 핀', '2', '2'], ['BRK-20417-08', '핀 부트', '2', '2'],
  ['BRK-20417-09', '브래킷', '1', '1'], ['BRK-20417-10', '볼트 M12', '2', '—'], ['BRK-20417-11', '와셔', '4', '4'], ['BRK-20417-12', '패드 센서', '—', '1']];
const diffRow = ([n, t, a, b]) => {
  const one = a === '—' || b === '—';
  const cls = a === b ? '' : one ? ' class="compare-row--unassigned"' : ' class="compare-row--similar"';
  return '<tr' + cls + '><td><a href="#" class="grid-custom-rows-link">' + n + '</a></td><td class="is-left">' + t + '</td><td' + (a !== b && !one ? ' class="compare-qty"' : '') + '>' + a + ' → ' + b + '</td>' +
    '<td class="compare-cell">' + (a === b ? '' : one ? '한쪽에만 있음' : '수량 다름') + '</td></tr>';
};
const diffTable = '<div class="table_list"><div class="list" style="max-height:186px;overflow-y:auto"><table class="grid-table" id="bom-diff" aria-label="BOM 비교 결과"><colgroup><col style="width:120px"><col><col style="width:84px"><col style="width:96px"></colgroup>' +
  '<thead><tr><th>품목 번호</th><th>품목 명</th><th>수량</th><th>비교</th></tr></thead><tbody>' + PARTS.map(diffRow).join('') + '</tbody></table></div></div>';
export const 다음_차이 = {
  parameters: html('<button type="button" class="btn btn--secondary btn--outlined" data-ds-next-diff="#bom-diff">다음 차이</button>\n<span data-ds-diff-pos="#bom-diff">차이 3건</span>   <!-- js/motion.js 가 자동으로 붙음 -->'),
  render: () => {
    const d = el(diffTable + row(btn('다음 차이', 'btn--secondary btn--outlined', ' data-ds-next-diff="#bom-diff"') + '<span data-ds-diff-pos="#bom-diff" style="font-size:var(--body-sm);color:var(--color-text-muted)">차이 3건</span>'));
    d.style.display = 'grid'; d.style.gap = '12px';
    return d;
  },
};

// 10 끌어 순서 바꾸기 — 손잡이를 끌면 놓을 자리에 선 · 나머지 줄이 비켜 줌, 키보드 = 손잡이에서 Alt + ↑ ↓
const APPROVERS = [['김도윤', '설계1팀', '검토'], ['이서연', '품질팀', '검토'], ['박지훈', '생산기술팀', '합의'], ['정우진', '설계1팀', '승인']];
const lineRow = ([n, dpt, role], i) => '<tr><td><button type="button" class="reorder-handle" aria-label="' + n + ' 순서 바꾸기" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown" aria-describedby="reorder-hint">' + GRIP + '</button></td>' +
  '<td>' + (i + 1) + '</td><td>' + dpt + '</td><td>' + n + '</td><td>' + role + '</td></tr>';
const lineTable = '<div class="table_list"><div class="list"><table class="grid-table" aria-label="결재선"><colgroup><col style="width:36px"><col style="width:52px"><col><col><col style="width:72px"></colgroup>' +
  '<thead><tr><th><span class="sr-only">순서 바꾸기</span></th><th>No.</th><th>부서</th><th>이름</th><th>역할</th></tr></thead><tbody data-ds-reorder>' + APPROVERS.map(lineRow).join('') + '</tbody></table></div></div>';
export const 끌어_순서_바꾸기 = {
  parameters: html('<tbody data-ds-reorder>\n  <tr><td><button type="button" class="reorder-handle" aria-label="김도윤 순서 바꾸기" aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown">…</button></td> … </tr>\n</tbody>\n<!-- 바뀐 순서는 ds-reorder 이벤트의 detail.order -->'),
  render: () => {
    const d = el(lineTable + '<p id="reorder-hint" class="section-meta" style="margin:0">손잡이를 끌거나, 손잡이에 포커스를 두고 Alt + ↑ ↓ 로 옮깁니다.</p>', '480px');
    d.style.display = 'grid'; d.style.gap = '8px';
    const body = d.querySelector('tbody');
    body.addEventListener('ds-reorder', () => body.querySelectorAll('tr').forEach((tr, i) => { tr.children[1].textContent = i + 1; }));
    if (M()) M().reorderInit(d);
    return d;
  },
};

// 11 되돌리기 시간 막대 — 삭제 뒤 확인 창 대신 [되돌리기] 토스트를 5초. 마우스 · 포커스가 있으면 멈춤
const FILES = ['부 첨부 · BRK-20417_시험성적서.pdf', '부 첨부 · BRK-20417_조립도.dwg'];
const fileRow = (t) => '<li style="display:flex;align-items:center;gap:8px;padding:6px 12px;border:1px solid var(--color-border-subtle);border-radius:var(--radius-card);font-size:var(--body-sm)">' + t + btn('삭제', 'btn--destructive btn--transparent btn--sm', ' style="margin-left:auto"') + '</li>';
export const 되돌리기_시간 = {
  parameters: html('<script>\n  // 삭제를 누르면 줄을 숨기고\n  dsMotion.undoToast({\n    message: "첨부 1건이 삭제되었습니다.",\n    onUndo: () => { /* 줄을 다시 보이고 dsMotion.flash(줄) */ },\n    onCommit: () => { /* 시간이 끝나면 서버에 삭제 요청 */ }\n  });\n</script>'),
  render: () => {
    const d = el('<ul style="list-style:none;margin:0;padding:0;display:grid;gap:4px">' + FILES.map(fileRow).join('') + '</ul>' +
      '<div class="toast-region" role="status" style="position:static;align-items:flex-start;min-height:72px"></div>', '420px');
    d.style.display = 'grid'; d.style.gap = '12px';
    const reg = d.querySelector('.toast-region');
    d.querySelectorAll('li').forEach((li) => {
      li.querySelector('.btn').addEventListener('click', () => {
        li.style.display = 'none';
        M().undoToast({ region: reg, message: '첨부 1건이 삭제되었습니다.', onUndo: () => { li.style.display = 'flex'; M().flash(li); }, onCommit: () => li.remove() });
      });
    });
    return d;
  },
};

// 12 빈 상태 배지가 한 번 움직임 — 솔리드 일러스트의 이유 배지만, 나타날 때 한 번
const emptyBox = (type, t, desc) => '<div class="empty" role="status" style="padding:16px">' + emptyArt(type) + '<p class="empty__title">' + t + '</p><p class="empty__desc">' + desc + '</p></div>';
const EMPTY2 = '<div style="display:flex;gap:24px;flex-wrap:wrap">' + emptyBox('search', '검색 결과가 없습니다', '조건을 바꿔 다시 검색해 주십시오.') + emptyBox('network', '연결이 끊겼습니다', '잠시 뒤 다시 시도해 주십시오.') + '</div>';
export const 빈_상태_배지 = {
  parameters: html('<!-- 클래스 추가 없음 — 솔리드 일러스트(.empty-illo)의 배지가 나타날 때 한 번 -->\n' + emptyBox('search', '검색 결과가 없습니다', '조건을 바꿔 다시 검색해 주십시오.')),
  render: () => {
    const d = el('<div data-empty>' + EMPTY2 + '</div>' + row(btn('다시 보기', 'btn--secondary btn--outlined')));
    d.style.display = 'grid'; d.style.gap = '12px';
    d.querySelector('.btn').addEventListener('click', () => { d.querySelector('[data-empty]').innerHTML = EMPTY2; });
    return d;
  },
};

// ── 로고 로더 (DS-ADR-043, TD-123) ── 페이지 전체 첫 로딩. 마크 조각 셋이 차례로 들어와 맞물림 · 그림 한 장 로고는 왼쪽부터 채움
const IMG_LOGO = new URL('../assets/brand/default-logo.svg', import.meta.url).href;   // 가상 제품 마크(그림 한 장으로 쓸 때의 견본)
const LOADER_PIECES = '<span class="brand-loader" aria-hidden="true"><svg viewBox="0 0 34 34">' +
  '<path class="brand-loader__arc" pathLength="1" d="M4.4 21.6A12.5 12.5 0 1 1 27.6 21.6"/>' +
  '<path class="brand-loader__piece brand-loader__piece--top" d="M16 10.2l6 3.45-6 3.45-6-3.45z"/>' +
  '<path class="brand-loader__piece brand-loader__piece--left" d="M10 13.65l6 3.45V24l-6-3.45z"/>' +
  '<path class="brand-loader__piece brand-loader__piece--right" d="M16 17.1l6-3.45v6.9L16 24z"/>' +
  '<circle class="brand-loader__dot" cx="27.6" cy="21.6" r="2.9"/></svg></span>';
const LOADER_IMAGE = (src) => '<span class="brand-loader brand-loader--image" style="--brand-loader-width:72px" aria-hidden="true"><img class="brand-loader__base" src="' + src + '" alt=""><img class="brand-loader__fill" src="' + src + '" alt=""></span>';
const loaderFig = (inner, t, d) => '<figure style="margin:0;display:grid;justify-items:center;gap:10px;padding:24px 12px;border:1px solid var(--color-border-base);border-radius:var(--radius-card);background:var(--color-bg-base);text-align:center">' +
  inner + '<figcaption style="font-size:var(--body-sm);color:var(--color-text-muted);line-height:1.5"><b style="display:block;color:var(--color-text-base);font-size:var(--body-md);font-weight:var(--font-weight-semibold)">' + t + '</b>' + d + '</figcaption></figure>';
export const 로고_로더 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code:
    '<div class="loading loading--overlay" role="status" aria-live="polite">\n  ' + LOADER_PIECES + '\n  <p class="loading__text">화면을 불러오는 중입니다</p>\n</div>\n\n<!-- 로고가 그림 한 장뿐인 브랜드 -->\n' + LOADER_IMAGE('logo.png') } } },
  render: () => '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,240px));gap:16px">' +
    loaderFig(LOADER_PIECES, '조각이 맞춰짐 .brand-loader', '흩어진 정보가 한 화면으로 모이는 중 — 마크 조각 셋이 차례로 맞물리고, 고리가 그려진 끝에 점이 찍힘') +
    loaderFig(LOADER_IMAGE(IMG_LOGO), '그림 한 장 로고 .brand-loader--image', '로고가 그림 파일 한 장뿐인 브랜드 — 흐린 로고 위로 원래 로고가 왼쪽부터 채워짐') + '</div>',
};
