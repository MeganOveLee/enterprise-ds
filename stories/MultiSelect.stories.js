// Form/Multi Select — 문서 화면은 MultiSelect.mdx. 여러 값을 고르는 드롭다운(.checkSelect)
// Figma UI Kit 「Option」 · 「Option group」과 같은 짝. 제품에서는 위젯 스크립트가 여닫기 · 표시 글자를 맡고,
// 여기 스토리는 같은 일을 하는 짧은 스크립트로 눌러 볼 수 있게 함
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const STATUS = ['작업 중', '검토 중', '승인', '반려', '폐기'];
const label = (picked) => (picked.length ? picked.join(', ') : '전체');   // 화면 읽기 · title 용 = 고른 값 전체
// 표시 상자 글자 — 하나면 그 값, 두 개 이상이면 「첫 값 외 N」(10/15 결정 · DS-ADR-022)
const shown = (picked) => (picked.length < 2 ? label(picked)
  : '<span class="selected-text__value">' + picked[0] + '</span> <span class="selected-text__more">외 ' + (picked.length - 1) + '</span>');
// 화면 읽기 이름 = 보이는 글자(「첫 값 외 N」)를 그대로 담고 나머지 값을 괄호로 — 보이는 글자와 이름이 어긋나지 않게(WCAG 2.5.3)
const spoken = (name, picked) => name + ': ' + (picked.length < 2 ? label(picked) : picked[0] + ' 외 ' + (picked.length - 1) + ' (' + picked.slice(1).join(', ') + ')');
const option = (t, on, extra = '') =>
  '<label class="option' + extra + '"><input type="checkbox"' + (on ? ' checked' : '') + '><span>' + t + '</span></label>';
// open = 펼침, picked = 고른 값, search = 검색 칸, extraBox = 표시 상자 클래스
const box = ({ name = '작업현황', items = STATUS, picked = [], open = false, search = true, extraBox = '', hoverAt = -1 } = {}) =>
  '<div class="checkSelect">' +
  '<div class="selected-text' + extraBox + '" role="button" tabindex="0" aria-haspopup="true" aria-expanded="' + open + '" aria-label="' + spoken(name, picked) + '"' + (picked.length > 1 ? ' title="' + label(picked) + '"' : '') + '>' + shown(picked) + '</div>' +
  '<div class="options' + (open ? ' show' : '') + '" role="group" aria-label="' + name + '">' +
  (search ? '<input class="search-text" type="text" aria-label="' + name + ' 검색" placeholder="검색">' : '') +
  '<div>' + items.map((t, i) => option(t, picked.includes(t), i === hoverAt ? ' ps-hover' : '')).join('') + '</div>' +
  '</div></div>';

// 눌러 볼 수 있게 — 표시 상자 누르면 여닫기, 고르면 글자 갱신, 검색하면 거르기, 바깥 · Esc 로 닫기
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
export const 기본 = {
  parameters: { docs: { source: { code: box({ picked: ['작업 중', '검토 중', '승인'] }) } } },
  render: () => live(box({ picked: ['작업 중', '검토 중', '승인'] }), 40),
};
export const 펼친_모습 = {
  parameters: { docs: { source: { code: box({ picked: ['작업 중'], open: true }) } } },
  render: () => live(box({ picked: ['작업 중'], open: true }), 250),
};
export const 검색_없이 = {
  parameters: { docs: { source: { code: box({ name: '버전', items: ['최신 버전', '모든 버전'], picked: ['최신 버전'], open: true, search: false }) } } },
  render: () => live(box({ name: '버전', items: ['최신 버전', '모든 버전'], picked: ['최신 버전'], open: true, search: false }), 120),
};

// ── 전체 상태 ──
export const 전체_상태 = {
  parameters: {
    controls: { disable: true },
    docs: { source: { language: 'html', code: [
      '<!-- 펼침 = .options 에 .show (위젯 스크립트가 붙임). 표시 상자는 펼친 동안 포커스 테두리 + 링 -->',
      '<!-- 고른 항목 = 체크박스 checked → 옅은 브랜드 바탕 + 반굵게. 두 개 이상이면 표시 상자 = 「첫 값 외 N」 -->',
      option('작업 중', true), option('검토 중', false),
    ].join('\n') } },
  },
  render: () => {
    enablePseudo();
    const cell = (h) => '<div style="width:200px;text-align:left">' + h + '</div>';
    const opt = (t, on, x = '') => '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none">' +
      '<div>' + option(t, on, x) + '</div></div></div>';
    return matrix(['표시 상자', '옵션 행'], [
      ['Default', [cell(box({ picked: [] })), opt('작업 중', false)]],
      ['Hovered', [cell(box({ picked: [], extraBox: ' ps-hover' })), opt('작업 중', false, ' ps-hover')]],
      ['고른 값 하나 · 고른 항목', [cell(box({ picked: ['작업 중'] })), opt('작업 중', true)]],
      ['고른 값 여럿', [cell(box({ picked: ['작업 중', '검토 중', '승인'] })), '—']],
      ['긴 값 여럿', [cell(box({ name: '분류', items: ['설계 변경 요청서', '부품 승인 원', '검사 성적서'], picked: ['설계 변경 요청서', '부품 승인 원'] })), '—']],
      ['Focused', ['—', '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none"><div><label class="option"><input type="checkbox" class="ps-focus-visible"><span>작업 중</span></label></div></div></div>']],
      ['Disabled', ['—', '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none"><div><label class="option"><input type="checkbox" disabled><span>폐기</span></label></div></div></div>']],
      ['펼침', [cell('<div class="checkSelect"><div class="selected-text" role="button" tabindex="0" aria-haspopup="true" aria-expanded="true" aria-label="작업현황: 작업 중">작업 중</div><div class="options show" style="display:none"></div></div>'), '—']],
    ]) + '<p class="sb-note" style="margin:8px 0 0">표시 상자의 비활성 모양은 아직 없습니다(입력칸의 disabled 규칙을 위젯에 맞춰 붙일지 결정 필요). 옵션 행 비활성은 체크박스 비활성 + 흐린 글자입니다.</p>';
  },
};

// ── Playground ──
export const Playground = {
  argTypes: {
    name: { control: 'text', description: '칸 이름 — 표시 상자 · 옵션 묶음의 이름' },
    items: { control: 'object', description: '옵션 목록' },
    picked: { control: 'object', description: '고른 값 — 체크박스 checked' },
    search: { control: 'boolean', description: '옵션 위 검색 칸 — `.search-text`' },
    open: { control: 'boolean', description: '펼침 — `.options.show`' },
  },
  args: { name: '작업현황', items: STATUS, picked: ['작업 중'], search: true, open: true },
  parameters: { docs: { source: { transform: (_, { args }) => box({ name: args.name, items: args.items || [], picked: args.picked || [], search: args.search, open: args.open }) } } },
  render: (a) => live(box({ name: a.name, items: a.items || [], picked: a.picked || [], search: a.search, open: a.open }), a.open ? 260 : 40),
};
