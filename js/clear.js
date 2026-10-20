/* 지우기(×) 버튼 — 조회 조건의 입력 · 날짜 칸에 값이 있으면 칸 오른쪽에 지우기 버튼을 붙인다 (DS-ADR-042, TD-120)
 *
 * 붙는 곳
 *   - data-ds-clear 를 단 입력 · 날짜 칸
 *   - 검색 조건 영역(.mainTable) 안의 텍스트 입력 · 날짜 칸 — 마크업은 그대로, 스크립트가 찾아 붙인다(select.js · datepicker.js 와 같은 방식)
 * 붙지 않는 곳: 편집 폼 칸 · 읽기 전용 · 비활성(지울 수 없는 값이라 버튼이 있으면 지울 수 있는 것처럼 읽힘)
 *
 * 동작: 값이 있을 때만 보임 → 누르면 값을 비우고 input · change 이벤트를 보낸 뒤 포커스를 칸으로 돌려준다
 * 접근성: <button aria-label="문서 번호 지우기"> — 이름은 칸의 aria-label 또는 <label for> 글자. Tab으로 닿고, 값이 없으면 숨어서 닿지 않음
 *
 * <span class="field-clear-wrap"><input class="input" …><button class="field-clear" aria-label="… 지우기">×</button></span>   ← 텍스트 칸(스크립트가 감쌈)
 * <div class="ui-datepicker"> … <input class="ui-datepicker__input"><button class="field-clear">×</button></div>           ← 날짜 칸(틀 안 맨 끝)
 */
(function () {
    'use strict';
    var X = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M7 7l10 10M17 7L7 17"/></svg>';
    var SCOPE = '[data-ds-clear], .mainTable input.input[type="text"], .mainTable input.input:not([type]), .mainTable .ui-datepicker__input';

    function nameOf(input) {
        var l = input.getAttribute('aria-label');
        if (l) return l;
        if (input.id) {
            var lab = document.querySelector('label[for="' + input.id + '"]');
            if (lab) return lab.textContent.trim();
        }
        return '입력';
    }
    function sync(input, btn) { btn.hidden = !input.value || input.disabled || input.readOnly; }

    function attach(input) {
        if (input._dsClear || input.readOnly || input.disabled) return;
        var host = input.closest('.ui-datepicker');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'field-clear';
        btn.setAttribute('aria-label', nameOf(input) + ' 지우기');
        btn.innerHTML = X;
        if (host) host.appendChild(btn);
        else {
            var wrap = document.createElement('span');
            wrap.className = 'field-clear-wrap';
            input.parentNode.insertBefore(wrap, input);
            wrap.appendChild(input);
            wrap.appendChild(btn);
        }
        input._dsClear = btn;
        btn.addEventListener('click', function () {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            sync(input, btn);
            input.focus();
        });
        input.addEventListener('input', function () { sync(input, btn); });
        input.addEventListener('change', function () { sync(input, btn); });
        sync(input, btn);
    }

    function init(root) { (root || document).querySelectorAll(SCOPE).forEach(attach); }
    window.dsClearInit = init;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
    else init();
})();
