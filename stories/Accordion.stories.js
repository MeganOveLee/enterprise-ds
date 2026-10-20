// Data Display/Accordion — 문서 화면은 Accordion.mdx. 여기 스토리는 MDX 카드 안에 들어가는 예시 · 전체 상태
// 접는 섹션 = 상세 화면 · 등록 창의 섹션 접기(제품 전체가 같은 토글, 10/14). DS 클래스: .seach_arm + .section-toggle + 내용(.pro_table · .table_list)
// 예시는 눌러 볼 수 있게 토글을 이어 둔다(wire) — 제품에서는 화면 스크립트가 같은 일을 함
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const svg = (d) => '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
const MINUS = '<path d="M6 12h12"/>';
const PLUS = '<path d="M12 5v14M5 12h14"/>';

let uid = 0;
// 토글 하나 — 펼침 = 빼기, 접힘 = 더하기. 이름(aria-label)은 「제목 + 접기/펼치기」
const toggle = (title, open, { controls = '', extra = '' } = {}) =>
  '<button type="button" class="section-toggle' + (extra ? ' ' + extra : '') + '" aria-expanded="' + open + '" aria-label="' + title + (open ? ' 접기' : ' 펼치기') + '"' +
  (controls ? ' aria-controls="' + controls + '"' : '') + '>' + svg(open ? MINUS : PLUS) + '</button>';
// 섹션 헤더 + 내용. h = 제목 단계(화면 제목 h2 아래 = h3, 창 제목 h3 아래 = h4)
const section = (title, body, { open = true, right = '', h = 'h3' } = {}) => {
  const id = 'acc-' + (++uid);
  return '<div class="seach_arm"><div class="leftbt">' + toggle(title, open, { controls: id }) + '<' + h + '>' + title + '</' + h + '></div>' +
    (right ? '<div class="rightbt">' + right + '</div>' : '') + '</div>' +
    '<div class="pro_table" id="' + id + '"' + (open ? '' : ' hidden') + '>' + body + '</div>';
};
const ro = (label, value) => '<div class="ff-field"><span class="search-label">' + label + '</span><div class="td"><div class="ff-readonly">' + value + '</div></div></div>';
const INFO = '<div class="form-grid-2">' + ro('문서 번호', 'DOC-2610-0012') + ro('버전', 'A.3') + ro('등록자', '이서연') + ro('등록일', '2026-10-12') + '</div>';
const NOTE = '<div class="form-grid-2">' + ro('변경 사유', '하우징 재질 변경(알루미늄 → 마그네슘)에 따른 검토') + ro('관련 부품', 'BRK-20417') + '</div>';
// 등록 창 — 같은 섹션, 내용은 입력 필드
let fid = 0;
const inp = (label, ph, req) => { const id = 'acc-f' + (++fid); return '<div class="ff-field"><label class="search-label" for="' + id + '">' + label + (req ? '<span class="required" aria-hidden="true"></span>' : '') + '</label><div class="td"><input class="input" id="' + id + '"' + (req ? ' aria-required="true"' : '') + ' placeholder="' + ph + '"></div></div>'; };
const INFO_IN = () => '<div class="form-grid-2">' + ro('문서 번호', '저장하면 자동으로 매겨집니다') + inp('문서 명', '문서 명 입력', true) + '</div>';
const NOTE_IN = () => '<div class="form-grid-2">' + inp('변경 사유', '변경 사유 입력') + inp('관련 부품', '품번 입력') + '</div>';

// 눌러 보기 — 토글이 aria-expanded 를 바꾸고, aria-controls 로 이은 내용에 hidden 을 붙였다 뗌. 아이콘 · 이름도 같이 바뀜
const wire = (html) => {
  const root = document.createElement('div');
  root.innerHTML = html;
  root.querySelectorAll('.section-toggle[aria-controls]').forEach((b) => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      const title = b.getAttribute('aria-label').replace(/ (접기|펼치기)$/, '');
      b.setAttribute('aria-expanded', String(open));
      b.setAttribute('aria-label', title + (open ? ' 접기' : ' 펼치기'));
      b.innerHTML = svg(open ? MINUS : PLUS);
      const panel = root.querySelector('#' + b.getAttribute('aria-controls'));
      if (panel) panel.hidden = !open;
    });
  });
  return root;
};
const html = (code) => ({ controls: { disable: true }, docs: { source: { language: 'html', code } } });

export default {
  title: 'Data Display/Accordion',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 Accordion.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
// 상자형 — 상세 화면(.pop 밖). 섹션 헤더 + 내용이 한 상자, 접으면 헤더만 둥근 상자
const META = '<span class="section-meta"><b>2</b>건</span>';   // 헤더 오른쪽 글자 = .section-meta
// 두 예시는 같은 섹션(기본 정보 · 변경 내용 펼침, 첨부 파일 접힘) — 놓이는 자리만 다름
const BOX = () => section('기본 정보', INFO) + section('변경 내용', NOTE) + section('첨부 파일', '', { open: false, right: META });
export const 상자형 = {
  parameters: html(section('기본 정보', '<!-- 내용: 폼 · 값(.form-grid-2) -->') + '\n' + section('첨부 파일', '', { open: false, right: META })),
  render: () => wire('<div style="max-width:720px">' + BOX() + '</div>'),
};

// 등록 창(.pop) 안 — 같은 섹션 상자, 제목은 창 제목(h3) 아래 h4 (.pop 높이는 문서용으로 풂)
const POP = () => '<div class="pop" style="height:auto;min-width:0"><div class="contents">' +
  section('기본 정보', INFO_IN(), { h: 'h4' }) + section('변경 내용', NOTE_IN(), { h: 'h4' }) + section('첨부 파일', '', { open: false, right: META, h: 'h4' }) + '</div></div>';
export const 이어지는_형 = {
  parameters: html('<div class="pop">\n  <div class="contents">\n    ' + section('기본 정보', '<!-- 내용 -->', { h: 'h4' }) + '\n  </div>\n</div>'),
  render: () => wire('<div style="max-width:720px">' + POP() + '</div>'),
};

// ── 전체 상태 — 토글 하나의 모습. Hovered · Focused 는 상호작용 상태를 고정해 표시(_pseudo.js) ──
const PS = ['', 'ps-hover', 'ps-focus-visible'];
export const 전체_상태 = {
  parameters: html(toggle('기본 정보', true) + '\n' + toggle('기본 정보', false)),
  render: () => {
    enablePseudo();
    return matrix(['Default', 'Hovered', 'Focused'], [
      ['펼침 ' + '<code>aria-expanded="true"</code>', PS.map((p) => toggle('기본 정보', true, { extra: p }))],
      ['접힘 ' + '<code>aria-expanded="false"</code>', PS.map((p) => toggle('기본 정보', false, { extra: p }))],
    ]);
  },
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 8번 ② ③) — 미리보기만, 코드는 위 예시 카드에 ──
const ddWrap = (h) => '<div style="width:100%;align-self:flex-start">' + h + '</div>';   // 미리보기 위 정렬(TD-108 공통 · 간격)
const sub = (t) => '<div class="ff-divider">' + t + '</div>';   // 섹션 안 소제목 = .form-grid-2 .ff-divider
const CHANGE_SUB = '<div class="form-grid-2">' + sub('도면 변경') + ro('도면 번호', 'DWG-20417') + ro('개정', 'B') + sub('부품 변경') + ro('품번', 'BRK-20417') + ro('재질', '마그네슘') + '</div>';
const CHANGE_NEST = section('도면 변경', '<div class="form-grid-2">' + ro('도면 번호', 'DWG-20417') + ro('개정', 'B') + '</div>', { h: 'h4' }) +
  section('부품 변경', '<div class="form-grid-2">' + ro('품번', 'BRK-20417') + ro('재질', '마그네슘') + '</div>', { h: 'h4' });
let ddf = 0;
const reqIn = (label, ph) => { const id = 'acc-dd' + (++ddf); return '<div class="ff-field"><label class="search-label" for="' + id + '">' + label + '<span class="required" aria-hidden="true"></span></label><div class="td"><input class="input" id="' + id + '" aria-required="true" placeholder="' + ph + '"></div></div>'; };
const REQ = () => '<div class="form-grid-2">' + reqIn('문서 명', '문서 명 입력') + reqIn('문서 분류', '문서 분류 입력') + '</div>';
const NEED = '<span class="section-meta">필수</span>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    // 근거: TD-108 8번 ② (Carbon · Atlassian Accordion — 중첩하지 않음). 나눌 내용이 많으면 상세 창 탭으로
    { title: '접는 섹션은 한 단계, 안쪽은 소제목',
      do: [ddWrap(section('변경 내용', CHANGE_SUB)), '섹션 안을 더 나눌 때는 접는 섹션 대신 소제목(.ff-divider)을 둡니다. 내용이 길면 상세 창 탭으로 나눕니다.'],
      dont: [ddWrap(section('변경 내용', CHANGE_NEST)), '접는 섹션 안에 접는 섹션을 다시 두지 않습니다.'] },
    // 근거: TD-108 8번 ③ (필수 입력을 접힌 섹션에 숨기지 않음)
    { title: '필수 입력이 있는 섹션은 펼친 채 시작',
      do: [ddWrap(section('기본 정보', REQ(), { h: 'h4', right: NEED }) + section('첨부 파일', '', { open: false, h: 'h4' })), '필수 입력이 있는 섹션은 펼친 상태로 시작하고, 선택 입력만 있는 섹션을 접어 둡니다.'],
      dont: [ddWrap(section('기본 정보', REQ(), { open: false, h: 'h4', right: NEED }) + section('첨부 파일', '', { open: false, h: 'h4' })), '필수 입력이 있는 섹션을 접힌 채로 시작하지 않습니다.'] },
  ]),
};
