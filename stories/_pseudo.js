// :hover · :active · :focus-visible 상태를 정적으로 보여 주는 도우미.
// 컴포넌트 CSS의 해당 규칙을 복제해 .ps-hover · .ps-active · .ps-focus-visible 클래스로 다시 건다
// (storybook-addon-pseudo-states와 같은 방식). DS CSS는 건드리지 않고 문서 화면에서만 쓴다.
const MAP = [
  [/:hover/g, '.ps-hover'],
  [/:active/g, '.ps-active'],
  [/:focus-visible/g, '.ps-focus-visible'],
];
const HAS = /:(hover|active|focus-visible)/;
let ready = false;

export function enablePseudo() {
  if (ready) return;
  ready = true;
  const tag = document.createElement('style');
  tag.id = 'ds-pseudo-states';
  document.head.appendChild(tag);
  const out = tag.sheet;
  const add = (text) => { try { out.insertRule(text, out.cssRules.length); } catch (e) { /* 바꿀 수 없는 선택자는 건너뜀 */ } };
  const walk = (rules, media) => {
    for (const r of rules) {
      if (r.type === CSSRule.STYLE_RULE && HAS.test(r.selectorText)) {
        const sel = r.selectorText.split(',')
          .filter((p) => HAS.test(p))
          .map((p) => MAP.reduce((s, [re, cls]) => s.replace(re, cls), p.trim()))
          .join(', ');
        const body = sel + ' { ' + r.style.cssText + ' }';
        add(media ? '@media ' + media + ' { ' + body + ' }' : body);
      } else if (r.type === CSSRule.MEDIA_RULE) {
        walk(r.cssRules, r.conditionText);
      }
    }
  };
  for (const sheet of Array.from(document.styleSheets)) {
    if (sheet === out) continue;
    let rules;
    try { rules = sheet.cssRules; } catch (e) { continue; }   // 다른 도메인 CSS(글꼴 CDN)는 읽을 수 없음
    walk(rules, '');
  }
}
