// Form/Multi Select — 문서 화면은 MultiSelect.mdx. 여러 값을 고르는 드롭다운(.checkSelect)
// Figma UI Kit 「Option」 · 「Option group」과 같은 짝. 제품에서는 위젯 스크립트가 여닫기 · 표시 글자를 맡고,
// 여기 스토리는 같은 일을 하는 짧은 스크립트로 눌러 볼 수 있게 함
import { matrix } from './_matrix.js';
import { enablePseudo } from './_pseudo.js';

const STATUS = ['작업 중', '검토 중', '승인', '반려', '폐기'];
const label = (picked) => (picked.length ? picked.join(', ') : '전체');
const option = (t, on, extra = '') =>
  '<label class="option' + extra + '"><input type="checkbox"' + (on ? ' checked' : '') + '><span>' + t + '</span></label>';
// open = 펼침, picked = 고른 값, search = 검색 칸, extraBox = 표시 상자 클래스
const box = ({ name = '작업현황', items = STATUS, picked = [], open = false, search = true, extraBox = '', hoverAt = -1 } = {}) =>
  '<div class="checkSelect">' +
  '<div class="selected-text' + extraBox + '" role="button" tabindex="0" aria-haspopup="true" aria-expanded="' + open + '" aria-label="' + name + ': ' + label(picked) + '">' + label(picked) + '</div>' +
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
      btn.textContent = label(picked);
      btn.setAttribute('aria-label', name + ': ' + label(picked));
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
  parameters: { docs: { source: { code: box({ picked: ['작업 중', '검토 중'] }) } } },
  render: () => live(box({ picked: ['작업 중', '검토 중'] }), 40),
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
      '<!-- 고른 항목 = 체크박스 checked → 옅은 브랜드 바탕 + 굵은 글자 -->',
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
      ['고른 값 있음 · 고른 항목', [cell(box({ picked: ['작업 중', '검토 중'] })), opt('작업 중', true)]],
      ['Focused', ['—', '<div class="checkSelect" style="width:200px;text-align:left"><div class="options show" style="position:static;box-shadow:none"><div><label class="option"><input type="checkbox" class="ps-focus-visible"><span>작업 중</span></label></div></div></div>']],
      ['펼침', [cell('<div class="checkSelect"><div class="selected-text" role="button" tabindex="0" aria-haspopup="true" aria-expanded="true" aria-label="작업현황: 작업 중">작업 중</div><div class="options show" style="display:none"></div></div>'), '—']],
    ]) + '<p class="sb-note" style="margin:8px 0 0">비활성 모양은 아직 없습니다(입력칸의 disabled 규칙을 위젯에 맞춰 붙일지 결정 필요).</p>';
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
