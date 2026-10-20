// Form/Multi Select — 문서 화면은 MultiSelect.mdx. 여러 값을 고르는 드롭다운(.checkSelect)
// Figma UI Kit 「Option」 · 「Option group」과 같은 짝. 여닫기 · 표시 글자는 js/multiselect.js(TD-101 10/19 — 이전 버전 화면 스크립트에서 화면 동작만 옮김)
// 「고른 값 줄여 보기」 카드는 그 스크립트로 바꾼 것, 나머지 카드는 같은 마크업을 짧은 스크립트(wire)로 눌러 볼 수 있게 함
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';
import { doDont } from './_dodont.js';

const STATUS = ['작업 중', '검토 중', '승인', '반려', '폐기'];
const label = (picked) => (picked.length ? picked.join(', ') : '전체');   // 화면 읽기 · title 용 = 고른 값 전체
// 트리거 글자 — 하나면 그 값, 두 개 이상이면 「첫 값 외 N」(10/15 결정 · DS-ADR-022)
const shown = (picked) => (picked.length < 2 ? label(picked)
  : '<span class="selected-text__value">' + picked[0] + '</span> <span class="selected-text__more">외 ' + (picked.length - 1) + '</span>');
// 화면 읽기 이름 = 보이는 글자(「첫 값 외 N」)를 그대로 담고 나머지 값을 괄호로 — 보이는 글자와 이름이 어긋나지 않게(WCAG 2.5.3)
const spoken = (name, picked) => name + ': ' + (picked.length < 2 ? label(picked) : picked[0] + ' 외 ' + (picked.length - 1) + ' (' + picked.slice(1).join(', ') + ')');
const option = (t, on, extra = '') =>
  '<label class="option' + extra + '"><input type="checkbox"' + (on ? ' checked' : '') + '><span>' + t + '</span></label>';
// open = 펼침, picked = 고른 값, search = 검색 필드, extraBox = 트리거 클래스, disabled = 비활성 트리거
const box = ({ name = '작업현황', items = STATUS, picked = [], open = false, search = true, extraBox = '', hoverAt = -1, disabled = false } = {}) =>
  '<div class="checkSelect">' +
  '<div class="selected-text' + extraBox + '" role="button" tabindex="' + (disabled ? -1 : 0) + '"' + (disabled ? ' aria-disabled="true"' : '') + ' aria-haspopup="true" aria-expanded="' + open + '" aria-label="' + spoken(name, picked) + '"' + (picked.length > 1 ? ' title="' + label(picked) + '"' : '') + '>' + shown(picked) + '</div>' +
  '<div class="options' + (open ? ' show' : '') + '" role="group" aria-label="' + name + '">' +
  (search ? '<input class="search-text" type="text" aria-label="' + name + ' 검색" placeholder="검색">' : '') +
  '<div>' + items.map((t, i) => option(t, picked.includes(t), i === hoverAt ? ' ps-hover' : '')).join('') + '</div>' +
  '</div></div>';

// 눌러 볼 수 있게 — 트리거 누르면 여닫기, 고르면 글자 갱신, 검색하면 거르기, 바깥 · Esc 로 닫기
const wire = (root) => {
  root.querySelectorAll('.checkSelect').forEach((cs) => {
    const btn = cs.querySelector('.selected-text');
    const list = cs.querySelector('.options');
    const name = list.getAttribute('aria-label');
    const set = (open) => { list.classList.toggle('show', open); btn.setAttribute('aria-expanded', String(open)); };
    const sync = () => {
      const picked = [...cs.querySelectorAll('.option input:checked')].map((i) => i.nextElementSibling.textContent);
      btn.innerHTML = shown(picked);
      btn.setAttribute('aria-label', spoken(name, picked));
      if (picked.length > 1) btn.setAttribute('title', label(picked)); else btn.removeAttribute('title');
    };
    btn.addEventListener('click', () => set(!list.classList.contains('show')));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!list.classList.contains('show')); } });
    cs.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
    cs.addEventListener('change', sync);
    const q = cs.querySelector('.search-text');
    if (q) q.addEventListener('input', () => cs.querySelectorAll('.option').forEach((o) => { o.style.display = o.textContent.includes(q.value.trim()) ? '' : 'none'; }));
    document.addEventListener('click', (e) => { if (!cs.contains(e.target)) set(false); });
  });
  return root;
};
const live = (html, minH = 0) => {
  const el = document.createElement('div');
  el.style.cssText = 'max-width:240px' + (minH ? ';min-height:' + minH + 'px' : '');
  el.innerHTML = html;
  return wire(el);
};

export default {
  title: 'Form/Multi Select',
  tags: ['!dev', '!autodocs'],   // 메뉴에는 문서 한 장만, 문서는 MultiSelect.mdx
  parameters: { docs: { source: { language: 'html' } } },
};

// ── 예시 ──
const SRC_SELECT = '<label class="search-label" for="state">작업현황</label>\n<select class="checkSelect" id="state" multiple data-searchBox="true">\n' +
  STATUS.map((t, i) => '  <option' + (i < 3 ? ' selected' : '') + '>' + t + '</option>').join('\n') + '\n</select>';
export const 기본 = {
  parameters: { docs: { source: { code: '<!-- 불러오기만 하면 select.checkSelect[multiple] 이 모두 바뀝니다. 목록 위 검색 필드 = data-searchBox="true" -->\n<script src="js/multiselect.js"></script>\n\n' +
    SRC_SELECT + '\n\n<!-- 바뀐 뒤(스크립트가 그림) -->\n' + box({ picked: ['작업 중', '검토 중', '승인'] }) } } },
  render: () => {
    const el = document.createElement('div');
    el.style.cssText = 'max-width:240px;min-height:40px';
    const [lab, ...rest] = SRC_SELECT.replace('id="state"', 'id="ms-live"').replace('for="state"', 'for="ms-live"').split('\n');
    el.innerHTML = '<div class="form-grid-2" style="grid-template-columns:1fr"><div class="ff-field">' + lab + '<div class="td">' + rest.join('') + '</div></div></div>';
    setTimeout(() => { const sel = el.querySelector('#ms-live'); if (sel && window.buildMultiSelect) window.buildMultiSelect(sel); }, 0);
    return el;
  },
};
export const 펼친_모습 = {
  parameters: { docs: { source: { code: box({ picked: ['작업 중'], open: true }) } } },
  render: () => live(box({ picked: ['작업 중'], open: true }), 250),
};
const KINDS = ['설계 사양서', '시험 성적서', '도면', '회의록', '검토 보고서'];   // 다중 선택은 옵션 5개부터 (4개까지는 체크박스 그룹, TD-108 26번)
export const 검색_없이 = {
  parameters: { docs: { source: { code: box({ name: '문서 분류', items: KINDS, picked: ['설계 사양서', '도면'], open: true, search: false }) } } },
  render: () => live(box({ name: '문서 분류', items: KINDS, picked: ['설계 사양서', '도면'], open: true, search: false }), 210),
};

// ── 언제 쓰고 쓰지 말지 (Do · Don't, TD-108 26번 ① ②) — 미리보기만. 펼친 목록은 틀 높이를 잡아 미리보기 안에 둠 ──
const fit = (h, w = 200, ht = 0) => '<div style="width:' + w + 'px' + (ht ? ';height:' + ht + 'px' : '') + '">' + h + '</div>';
const KIND3 = ['사양서', '도면', '시험 성적서'];
const group = '<div class="form-grid-2" style="grid-template-columns:1fr;width:240px;text-align:left"><div class="ff-field"><span class="search-label" id="dd-ms-kind">문서 분류</span>' +
  '<div class="checkbox-group" role="group" aria-labelledby="dd-ms-kind">' + KIND3.map((t, i) => '<label class="checkbox"><input type="checkbox"' + (i === 1 ? ' checked' : '') + '>' + t + '</label>').join('') + '</div></div></div>';
export const 사용_지침 = {
  parameters: { controls: { disable: true } },
  render: () => doDont([
    { title: '「전체」 옵션은 따로 두지 않음',
      do: [fit(box({ picked: [], open: true, search: false }), 200, 180),
        '아무것도 선택하지 않으면 트리거가 「전체」로 표시되므로, 「전체」 옵션은 따로 두지 않습니다.'],
      dont: [fit(box({ items: ['전체'].concat(STATUS), picked: ['전체', '검토 중'], open: true, search: false }), 200, 208),
        '「전체」 체크박스를 두면 다른 옵션과 함께 선택되어, 무엇을 고른 것인지 알 수 없습니다.'] },
    { title: '옵션이 4개까지면 체크박스 그룹',
      do: [group, '옵션이 4개까지면 체크박스 그룹(.checkbox-group)으로 펼쳐 둡니다. 다중 선택은 옵션 5개부터 씁니다.'],
      dont: [fit(box({ name: '문서 분류', items: KIND3, picked: ['도면'], open: true, search: false }), 200, 124),
        '옵션 3개를 드롭다운에 넣으면 열어 봐야 무엇을 고를 수 있는지 알 수 있습니다.'] },
  ]),
};

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: {
    controls: { disable: true },
    docs: { source: { language: 'html', code: [
      '<!-- 펼침 = .options 에 .show (위젯 스크립트가 붙임). 트리거는 펼친 동안 포커스 테두리 + 링 -->',
      '<!-- 고른 항목 = 체크박스 checked → 옅은 브랜드 바탕 + 반굵게. 두 개 이상이면 트리거 = 「첫 값 외 N」 -->',
      option('작업 중', true), option('검토 중', false),
    ].join('\n') } },
  },
  render: () => {
    enablePseudo();
    const cell = (h) => '<div style="width:200px;text-align:left">' + h + '</div>';
    const opt = (t, on, x = '') => '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none">' +
      '<div>' + option(t, on, x) + '</div></div></div>';
    return matrix(['트리거', '옵션 행'], [
      ['Default', [cell(box({ picked: [] })), opt('작업 중', false)]],
      ['Hovered', [cell(box({ picked: [], extraBox: ' ps-hover' })), opt('작업 중', false, ' ps-hover')]],
      ['Pressed', ['—', opt('작업 중', false, ' ps-active')]],
      ['고른 값 하나 · 고른 항목', [cell(box({ picked: ['작업 중'] })), opt('작업 중', true)]],
      ['고른 값 여럿', [cell(box({ picked: ['작업 중', '검토 중', '승인'] })), '—']],
      ['긴 값 여럿', [cell(box({ name: '분류', items: ['설계 변경 요청서', '부품 승인 원', '검사 성적서'], picked: ['설계 변경 요청서', '부품 승인 원'] })), '—']],
      ['Focused', [cell(box({ picked: ['작업 중'], extraBox: ' ps-focus-visible' })), '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none"><div><label class="option"><input type="checkbox" class="ps-focus-visible"><span>작업 중</span></label></div></div></div>']],
      ['Disabled', [cell(box({ picked: [], disabled: true })), '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none"><div><label class="option"><input type="checkbox" disabled><span>폐기</span></label></div></div></div>']],
      ['Disabled · 고른 항목', ['—', '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none"><div><label class="option"><input type="checkbox" checked disabled><span>폐기</span></label></div></div></div>']],
      ['펼침', [cell('<div class="checkSelect"><div class="selected-text" role="button" tabindex="0" aria-haspopup="true" aria-expanded="true" aria-label="작업현황: 작업 중">작업 중</div><div class="options show" style="display:none"></div></div>'), '—']],
    ]) + '<p class="sb-note" style="margin:8px 0 0">트리거 비활성 = 원래 select에 disabled → 스크립트가 aria-disabled="true"를 붙이고 열리지 않습니다. 옵션 행 비활성 = 체크박스 비활성 + 흐린 글자이고, 고른 채 막힌 항목은 옅은 브랜드 바탕 없이 표시합니다. 펼치면 트리거 화살표가 위를 향합니다.</p>';
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    name: { control: 'text', description: '필드 이름 — 트리거 · 옵션 묶음의 이름' },
    items: { control: 'object', description: '옵션 목록' },
    picked: { control: 'object', description: '선택한 값 — 체크박스 checked' },
    search: { control: 'boolean', description: '검색 필드(선택 사항) — data-searchBox="true" → `.search-text`' },
    open: { control: 'boolean', description: '펼침 — `.options.show`' },
  },
  args: { name: '작업현황', items: STATUS, picked: ['작업 중'], search: true, open: true },
  parameters: { docs: { source: { transform: (_, { args }) => box({ name: args.name, items: args.items || [], picked: args.picked || [], search: args.search, open: args.open }) } } },
  render: (a) => live(box({ name: a.name, items: a.items || [], picked: a.picked || [], search: a.search, open: a.open }), a.open ? 260 : 40),
};
