// Data Display/Card — 문서 화면은 Card.mdx. Figma 이름은 Card(10/16 Basic card에서 바꿈), DS 클래스는 .card
// 홈 대시보드 · 결재 목록처럼 한 주제의 내용을 묶는 상자: 카드 머리(.card-header) + 목록(.card-list) 또는 빈 상태(.empty--card). 여러 장은 .card-grid
// 목록 앞 칸(90) = 상태(.status-chip) · 헤더 오른쪽 = 이동 링크(.card-more)
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const INBOX = '<path d="M4 13l2.5-7h11L20 13v6H4z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>';

const TONE = { '결재 대기': 'warning', 승인: 'success', 반려: 'danger' };
const chip = (label, tone = TONE[label]) => '<span class="status-chip status-chip--' + tone + '">' + label + '</span>';
const ROWS = [
  ['결재 대기', '하우징 재질 변경 검토 보고서', '10-13'],
  ['결재 대기', '모터 마운트 진동 시험 계획서', '10-12'],
  ['승인', '브래킷 체결 토크 시험 성적서', '10-09'],
  ['반려', '실링 고무 경도 측정 결과', '10-08'],
  ['승인', '방열판 핀 간격 해석 자료', '10-07'],
  ['승인', '센서 브래킷 형상 검토서', '10-06'],
  ['결재 대기', '양산 이관 체크리스트', '10-05'],
  ['승인', '캘리퍼 조립도 개정 요청', '10-02'],
];
const more = () => '<a href="#" class="card-more">전체 보기</a>';
const head = (title, count, right = '') =>
  '<div class="card-header"><h3 class="card-title">' + title + (count !== '' && count !== undefined ? '<span class="card-title-count">' + count + '</span>' : '') + '</h3>' + right + '</div>';
// 태스크 — 마감까지 남은 날(D-n)을 상태 칩으로
const TASKS = [['1일 지남', '캘리퍼 조립 사양 검토', '10-12', 'danger'], ['D-1', '하우징 재질 변경 승인 요청', '10-14', 'warning'], ['D-3', '방열판 핀 간격 해석 보완', '10-16', 'info']];
// 행 = 링크 하나(<li><a href>). 제목이 길면 CSS 가 말줄임 — 전체 이름은 title 속성으로
const row = ([lead, title, date, tone], x = '', visited = false) =>
  '<li><a href="#"' + (x.trim() ? ' class="' + x.trim() + '"' : '') + '>' + chip(lead, tone) + '<span class="item-title' + (visited ? ' is-visited' : '') + '" title="' + title + '">' + title + '</span><span class="item-date">' + date + '</span></a></li>';
const list = (n = 5, visited = -1, data = ROWS) => '<ul class="card-list">' + data.slice(0, n).map((r, i) => row(r, '', i === visited)).join('') + '</ul>';
const empty = (t = '진행 중인 활동 업무가 없습니다', d = '배정된 활동이 생기면 여기에 표시됩니다.') =>
  '<div class="empty empty--card" role="status"><span class="empty__icon">' + svg(INBOX, 32) + '</span><p class="empty__title">' + t + '</p><p class="empty__desc">' + d + '</p></div>';
const card = ({ title = '결재 업무', count = 2, rows = 5, withMore = true, visited = -1, data = ROWS } = {}) =>
  '<section class="card">' + head(title, count, withMore ? more() : '') + (rows > 0 ? list(rows, visited, data) : empty()) + '</section>';
const box = (h, w = '560px') => '<div style="max-width:' + w + '">' + h + '</div>';

export default {
  title: 'Data Display/Card',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Card.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
export const 목록_카드 = {
  parameters: { docs: { source: { code: card() } } },
  render: () => box(card()),
};
export const 빈_카드 = {
  parameters: { docs: { source: { code: card({ title: '활동 업무', count: 0, rows: 0, withMore: false }) } } },
  render: () => box(card({ title: '활동 업무', count: 0, rows: 0, withMore: false })),
};
const grid3 = () => '<div class="card-grid card-grid--3">' +
  card({ title: '결재 업무', count: 2, rows: 3 }) + card({ title: '나의 태스크', count: 3, rows: 3, data: TASKS }) + card({ title: '활동 업무', count: 0, rows: 0, withMore: false }) + '</div>';
export const 카드_그리드 = {
  parameters: { docs: { source: { code: grid3() } } },
  render: () => '<div style="min-width:900px">' + grid3() + '</div>',
};

// ── 전체 상태 — 목록 한 행 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 줄 = <li><a href> · 읽은 항목 = .item-title.is-visited · Hovered · Focused 는 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    const one = (x, visited) => '<ul class="card-list" style="width:420px;margin:0 4px">' + row(ROWS[0], x, visited) + '</ul>';
    return matrix(['목록 한 행 (.card-list li > a)'], [
      ['Default', [one('', false)]],
      ['Hovered', [one(' ps-hover', false)]],
      ['Focused', [one(' ps-focus-visible', false)]],
      ['읽음', [one('', true)]],
    ]);
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    title: { control: 'text', description: '카드 제목 — `.card-title`' },
    count: { control: 'text', description: '개수 — `.card-title-count` (비우면 없음)' },
    rows: { control: { type: 'range', min: 0, max: 8, step: 1 }, description: '목록 행 수 — `.card-list li` (0이면 빈 상태 `.empty--card`)' },
    withMore: { control: 'boolean', description: '헤더 오른쪽 이동 링크 — `.card-more`' },
    visited: { control: { type: 'number', min: -1, max: 7 }, description: '읽은 줄(0부터, -1 = 없음) — `.item-title.is-visited`' },
  },
  args: { title: '결재 업무', count: '2', rows: 5, withMore: true, visited: -1 },
  parameters: { docs: { source: { transform: (_, { args }) => card(args) } } },
  render: (a) => box(card(a)),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 9번 ① ② — 홈 화면 카드 안 목록 행 기준) — 미리보기만, 코드는 위 예시 카드에 ──
const ddBox = (h) => '<div style="width:100%;align-self:flex-start">' + h + '</div>';   // 미리보기 위 정렬(TD-108 공통 · 간격)
const ddCard = (rows) => '<section class="card">' + head('결재 업무', 2, more()) + '<ul class="card-list">' + rows + '</ul></section>';
// 한 행 안에 링크 여러 곳(하지 않음 예시) — 제목 링크 + 「보기」 링크
const splitRow = ([lead, title, , tone]) =>
  '<li>' + chip(lead, tone) + '<span class="item-title"><a href="#" class="grid-custom-rows-link">' + title + '</a></span>' +
  '<span class="item-date"><a href="#" class="text-link no-arrow">보기</a></span></li>';
const LONG = [['결재 대기', '브레이크 캘리퍼 조립 사양서 개정에 따른 하우징 재질 변경 검토 보고서', '10-13'], ROWS[1], ROWS[2]];
const wrapRow = ([lead, title, date, tone]) =>
  '<li><a href="#">' + chip(lead, tone) + '<span class="item-title" style="white-space:normal">' + title + '</span><span class="item-date">' + date + '</span></a></li>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => { enablePseudo(); return doDont([
    // 근거: TD-108 9번 ① (Carbon Tile · Atlassian — 누르는 곳 하나)
    { title: '행마다 링크 한 곳',
      do: [ddBox(ddCard(row(ROWS[0]) + row(ROWS[1], ' ps-hover') + row(ROWS[2]))), '행 전체를 링크 하나(&lt;li&gt;&lt;a href&gt;)로 두어 어디를 눌러도 같은 상세로 이동합니다.'],
      dont: [ddBox(ddCard(ROWS.slice(0, 3).map(splitRow).join(''))), '한 행 안에 제목 · 「보기」처럼 같은 곳으로 가는 링크를 여러 개 두지 않습니다.'] },
    // 근거: TD-108 9번 ② · Card.mdx 구성 「목록 — 제목(.item-title, 길면 말줄임)」
    { title: '긴 이름은 말줄임 + title',
      do: [ddBox(ddCard(LONG.map((r) => row(r)).join(''))), '긴 이름은 한 줄로 줄이고(말줄임) 전체 이름은 title 속성으로 둡니다.'],
      dont: [ddBox(ddCard(LONG.map(wrapRow).join(''))), '긴 이름을 줄바꿈해 행 높이가 제각각이 되게 두지 않습니다.'] },
  ]); },
};
