// :hover · :active · :focus-visible · :focus · :focus-within 상태를 정적으로 보여 주는 도우미.
// 컴포넌트 CSS의 해당 규칙을 복제해 .ps-hover · .ps-active · .ps-focus-visible · .ps-focus · .ps-focus-within 클래스로 다시 건다
// (storybook-addon-pseudo-states와 같은 방식). DS CSS는 건드리지 않고 문서 화면에서만 쓴다.
// 입력칸은 :focus, 날짜 칸 상자는 :focus-within으로 포커스를 그린다 (2026-10-13 추가)
const MAP = [
  [/:hover/g, '.ps-hover'],
  [/:active/g, '.ps-active'],
  [/:focus-visible/g, '.ps-focus-visible'],
  [/:focus-within/g, '.ps-focus-within'],
  [/:focus(?![-\w])/g, '.ps-focus'],
];
const HAS = /:(hover|active|focus)/;
let ready = false;

export function enablePseudo() {
  if (ready) return;
  ready = true;
  // 복제한 규칙을 원래 규칙 바로 뒤에 넣는다 — 같은 구체성 규칙 사이의 순서(캐스케이드)를 실제와 같게.
  // 예전처럼 맨 끝 <style>에 모으면 .btn--transparent.ps-hover 가 뒤에 오는 켜짐 규칙(aria-pressed)을 이겨,
  // 정지 화면의 켜짐 + 마우스 올림 글자색이 실제와 달랐음 (10/13)
  const convert = (r) => r.selectorText.split(',')
    .filter((p) => HAS.test(p))
    .map((p) => MAP.reduce((s, [re, cls]) => s.replace(re, cls), p.trim()))
    .join(', ') + ' { ' + r.style.cssText + ' }';
  const fix = (owner) => {   // owner = 스타일시트 또는 @media 규칙
    const jobs = [];
    for (let i = 0; i < owner.cssRules.length; i++) {
      const r = owner.cssRules[i];
      if (r.type === CSSRule.STYLE_RULE && HAS.test(r.selectorText)) jobs.push([i, convert(r)]);
      else if (r.type === CSSRule.MEDIA_RULE) fix(r);
    }
    for (let k = jobs.length - 1; k >= 0; k--) {   // 뒤에서부터 넣어야 앞쪽 번호가 밀리지 않음
      try { owner.insertRule(jobs[k][1], jobs[k][0] + 1); } catch (e) { /* 바꿀 수 없는 선택자는 건너뜀 */ }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    try { sheet.cssRules; } catch (e) { continue; }   // 다른 도메인 CSS(글꼴 CDN)는 읽을 수 없음
    fix(sheet);
  }
}
