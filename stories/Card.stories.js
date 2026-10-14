// Data Display/Card — 문서 화면은 Card.mdx. Figma 이름은 Basic card, DS 클래스는 .card
// 홈 대시보드 · 결재 목록처럼 한 주제의 내용을 묶는 상자: 카드 머리(.card-header) + 목록(.card-list) 또는 빈 상태(.empty--card). 여러 장은 .card-grid
// 목록 앞 칸(90)은 화면이 채움 — 상태 칩은 DS에 아직 없어서 여기서는 글자만
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const svg = (d, s = 16) => '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const INBOX = '<path d="M4 13l2.5-7h11L20 13v6H4z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>';

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
const more = () => '<button type="button" class="btn btn--secondary btn--transparent btn--sm">전체 보기</button>';
const head = (title, count, right = '') =>
  '<div class="card-header"><h3 class="card-title">' + title + (count !== '' && count !== undefined ? '<span class="card-title-count">' + count + '</span>' : '') + '</h3>' + right + '</div>';
const row = ([lead, title, date], x = '', visited = false) =>
  '<li><a href="#"' + (x.trim() ? ' class="' + x.trim() + '"' : '') + '><span>' + lead + '</span><span class="item-title' + (visited ? ' is-visited' : '') + '">' + title + '</span><span class="item-date">' + date + '</span></a></li>';
const list = (n = 5, visited = -1) => '<ul class="card-list">' + ROWS.slice(0, n).map((r, i) => row(r, '', i === visited)).join('') + '</ul>';
const empty = (t = '진행 중인 활동 업무가 없어요', d = '배정된 활동이 생기면 여기에 보여요.') =>
  '<div class="empty empty--card" role="status"><span class="empty__icon">' + svg(INBOX, 32) + '</span><p class="empty__title">' + t + '</p><p class="empty__desc">' + d + '</p></div>';
const card = ({ title = '결재 업무', count = 2, rows = 5, withMore = true, visited = -1 } = {}) =>
  '<section class="card">' + head(title, count, withMore ? more() : '') + (rows > 0 ? list(rows, visited) : empty()) + '</section>';
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
  card({ title: '결재 업무', count: 2, rows: 3 }) + card({ title: '나의 태스크', count: 5, rows: 3 }) + card({ title: '활동 업무', count: 0, rows: 0, withMore: false }) + '</div>';
export const 카드_그리드 = {
  parameters: { docs: { source: { code: grid3() } } },
  render: () => '<div style="min-width:900px">' + grid3() + '</div>',
};

// ── 전체 상태 — 목록 한 줄 ──
export const 전체_상태 = {
  parameters: { controls: { disable: true }, docs: { source: { language: 'html', code: '<!-- 줄 = <li><a href> · 읽은 항목 = .item-title.is-visited · Hovered · Focused 는 CSS가 표시 -->' } } },
  render: () => {
    enablePseudo();
    const one = (x, visited) => '<ul class="card-list" style="width:420px;margin:0 4px">' + row(ROWS[0], x, visited) + '</ul>';
    return matrix(['목록 한 줄 (.card-list li > a)'], [
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
    rows: { control: { type: 'range', min: 0, max: 8, step: 1 }, description: '목록 줄 수 — `.card-list li` (0이면 빈 상태 `.empty--card`)' },
    withMore: { control: 'boolean', description: '머리 오른쪽 버튼(전체 보기)' },
    visited: { control: { type: 'number', min: -1, max: 7 }, description: '읽은 줄(0부터, -1 = 없음) — `.item-title.is-visited`' },
  },
  args: { title: '결재 업무', count: '2', rows: 5, withMore: true, visited: -1 },
  parameters: { docs: { source: { transform: (_, { args }) => card(args) } } },
  render: (a) => box(card(a)),
};
