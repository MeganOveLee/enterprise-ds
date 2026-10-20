/* =====================================================================
 * select.js - 선택 목록(단일 select) 모양 통일
 * 브라우저마다 다르게 그려지는 <select> 의 열린 목록(크롬 기본 파란 강조 · 운영체제 목록 등)을
 * 화면 전체에서 같은 목록(.ui-select)으로 바꾼다. 닫힌 상자는 .select 와 같은 모양.
 *
 * 사용:
 *   불러오기만 하면 화면의 보이는 단일 select 가 모두 바뀜(이전 버전과 같은 방식).
 *   제외 = class="no-ui" · multiple(다중 선택은 multiselect.js) · 숨은 select(라이브러리가 자기 위젯으로 쓰는 것)
 *   나중에 그린 select 는 window.buildCustomSelect(select) 또는 window.enhanceSelects(영역) 으로 직접 바꿈
 *   값 · 이름 · 폼 제출 · onchange 는 원래 select 가 그대로 맡는다(숨겨서 둠). 고르면 select.value 를 바꾸고 change 를 보냄
 *
 * Enterprise DS v1.0 (2026-10-19, TD-101) — 이전 버전 화면 스크립트(커스텀 단일 셀렉트)를 옮기고 접근성 · 키보드를 덧붙임
 *   - 역할: 상자 role="combobox"(aria-haspopup="listbox" · aria-expanded · aria-controls) + 목록 role="listbox" + 항목 role="option"(aria-selected)
 *     이름은 select 의 <label for> · aria-labelledby · aria-label 을 그대로 잇고, aria-describedby · aria-invalid · aria-required · disabled 도 옮김
 *   - 키보드(APG select-only combobox): 닫힘 = ↓ ↑ Enter Space Alt+↓ 로 열기, Home/End, 글자 입력 = 열고 그 글자로 시작하는 항목으로
 *     열림 = ↑ ↓ Home End PageUp PageDown 으로 이동, Enter · Space 고르고 닫기, Esc 고르지 않고 닫기, Tab 고르고 다음 칸으로
 *     포커스는 상자에 두고 aria-activedescendant 로 지금 항목을 알림
 *   - 목록은 열 때 body 로 옮겨 fixed 로 띄움 — 표 칸 · 창(.pop)처럼 넘침을 자르는 영역에서도 잘리지 않게(이전 버전과 같음)
 * ===================================================================== */
(function () {
    'use strict';

    var CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    var seq = 0;

    function labelIdFor(sel) {
        if (sel.getAttribute('aria-labelledby')) return sel.getAttribute('aria-labelledby');
        if (!sel.id) return '';
        var lab = document.querySelector('label[for="' + sel.id.replace(/"/g, '\\"') + '"]');
        if (!lab) return '';
        if (!lab.id) lab.id = sel.id + '-label';
        return lab.id;
    }

    function buildCustomSelect(sel) {
        if (!sel || sel.dataset.uiSelectDone) return;
        sel.dataset.uiSelectDone = '1';
        var uid = 'ui-select-' + (++seq);

        var wrap = document.createElement('div');
        wrap.className = 'ui-select';
        // native select 의 너비 유틸(w10 ~ w95 = %)은 위젯에 물려줌 — 좁게 둔 셀렉트를 그대로
        (String(sel.className).match(/\bw\d+\b/g) || []).forEach(function (c) { wrap.classList.add(c); });
        if (sel.style.width) wrap.style.width = sel.style.width;   // style="width:…" 로 폭을 정한 셀렉트도 그 폭 그대로 (TD-108 — 고르는 법 미리보기가 칸 폭 전체로 늘어나던 것)

        var trigger = document.createElement('div');
        trigger.className = 'ui-select__trigger';
        trigger.id = uid;
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', uid + '-list');

        var valueSpan = document.createElement('span');
        valueSpan.className = 'ui-select__value';
        trigger.appendChild(valueSpan);
        var chev = document.createElement('span');
        chev.className = 'ui-select__chevron';
        chev.innerHTML = CHEVRON;
        trigger.appendChild(chev);

        var menu = document.createElement('div');
        menu.className = 'ui-select__menu';
        menu.id = uid + '-list';
        menu.setAttribute('role', 'listbox');
        menu.setAttribute('tabindex', '-1');
        // 목록을 눌러도 포커스는 상자에 남게(항목 · 스크롤 막대) — 포커스가 빠지면 닫히므로
        menu.addEventListener('mousedown', function (e) { e.preventDefault(); });

        // 이름 · 설명 · 상태 — 원래 select 의 것을 상자와 목록에 잇는다
        function syncAttrs() {
            var lid = labelIdFor(sel);
            var al = sel.getAttribute('aria-label');
            if (lid) { trigger.setAttribute('aria-labelledby', lid); menu.setAttribute('aria-labelledby', lid); }
            else if (al) { trigger.setAttribute('aria-label', al); menu.setAttribute('aria-label', al); }
            ['aria-describedby', 'aria-invalid', 'aria-required'].forEach(function (a) {
                var v = sel.getAttribute(a);
                if (v === null) trigger.removeAttribute(a); else trigger.setAttribute(a, v);
            });
            if (sel.required) trigger.setAttribute('aria-required', 'true');
            if (sel.disabled) { trigger.setAttribute('aria-disabled', 'true'); trigger.setAttribute('tabindex', '-1'); close(false); }
            else { trigger.removeAttribute('aria-disabled'); trigger.setAttribute('tabindex', '0'); }
        }

        var items = [];
        var active = -1;
        function buildOptions() {
            menu.innerHTML = '';
            items = [];
            [].forEach.call(sel.options, function (o, idx) {
                var d = document.createElement('div');
                d.className = 'ui-select__option';
                d.id = uid + '-opt-' + idx;
                d.setAttribute('role', 'option');
                d.setAttribute('data-value', o.value);
                if (o.disabled) d.setAttribute('aria-disabled', 'true');
                d.textContent = o.label || o.textContent || o.innerText;
                d.addEventListener('click', function () { if (!o.disabled) { choose(idx); close(true); } });
                d.addEventListener('mousemove', function () { if (!o.disabled) setActive(idx, false); });
                menu.appendChild(d);
                items.push(d);
            });
        }

        function refreshValue() {
            var opt = sel.options[sel.selectedIndex];
            valueSpan.textContent = opt ? (opt.label || opt.textContent) : '';
            valueSpan.classList.toggle('is-placeholder', !opt || opt.value === '');
            items.forEach(function (d, i) {
                var on = i === sel.selectedIndex;
                d.classList.toggle('is-selected', on);
                d.setAttribute('aria-selected', String(on));
            });
        }

        function choose(idx) {
            if (idx < 0 || idx >= sel.options.length || sel.options[idx].disabled) return;
            var changed = sel.selectedIndex !== idx;
            sel.selectedIndex = idx;
            refreshValue();
            if (changed) sel.dispatchEvent(new Event('change', { bubbles: true }));
        }

        function setActive(idx, scroll) {
            if (active >= 0 && items[active]) items[active].classList.remove('is-active');
            active = idx;
            if (idx >= 0 && items[idx]) {
                items[idx].classList.add('is-active');
                trigger.setAttribute('aria-activedescendant', items[idx].id);
                if (scroll !== false) items[idx].scrollIntoView({ block: 'nearest' });
            } else {
                trigger.removeAttribute('aria-activedescendant');
            }
        }
        // 고를 수 있는 다음 항목(막힌 항목은 건너뜀)
        function step(from, dir) {
            var i = from;
            for (var n = 0; n < items.length; n++) {
                i += dir;
                if (i < 0 || i >= items.length) return from;
                if (!sel.options[i].disabled) return i;
            }
            return from;
        }
        function first() { return step(-1, 1); }
        function last() { return step(items.length, -1); }

        function positionMenu() {
            var r = trigger.getBoundingClientRect();
            menu.style.position = 'fixed';
            menu.style.left = r.left + 'px';
            menu.style.minWidth = r.width + 'px';
            // 아래 자리가 모자라면 위로
            var h = Math.min(menu.scrollHeight, 240) + 2;
            var below = window.innerHeight - r.bottom;
            menu.style.top = (below < h + 8 && r.top > below ? Math.max(4, r.top - h - 4) : r.bottom + 4) + 'px';
        }
        function isOpen() { return menu.classList.contains('show'); }
        function open() {
            if (sel.disabled || isOpen()) return;
            document.dispatchEvent(new CustomEvent('ds-popup-open', { detail: wrap }));   // 한 번에 하나만 — 다른 선택 · 다중 선택 목록은 닫힘
            document.body.appendChild(menu);
            menu.classList.add('show');
            positionMenu();
            trigger.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            setActive(sel.selectedIndex >= 0 && !sel.options[sel.selectedIndex].disabled ? sel.selectedIndex : first());
        }
        function close(refocus) {
            if (!isOpen()) return;
            menu.classList.remove('show');
            trigger.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
            setActive(-1);
            if (menu.parentNode !== wrap) wrap.insertBefore(menu, sel);
            if (refocus) trigger.focus();
        }

        // 글자로 찾기 — 같은 글자를 이어 치면 그 글자로 시작하는 다음 항목
        var typed = '', typedAt = 0;
        function typeAhead(ch) {
            var now = Date.now();
            typed = (now - typedAt > 600 ? '' : typed) + ch.toLowerCase();
            typedAt = now;
            if (!isOpen()) open();   // 닫혀 있으면 열고 맞는 항목으로(APG)
            // 같은 글자만 되풀이하면(b b b) 그 글자로 시작하는 항목을 차례로, 아니면 친 글자 전체로 시작하는 항목
            var same = typed.split('').every(function (c) { return c === typed[0]; });
            var q = same ? typed[0] : typed;
            var start = active + (same || typed.length === 1 ? 1 : 0);
            for (var n = 0; n < items.length; n++) {
                var i = (start + n + items.length) % items.length;
                if (!sel.options[i].disabled && items[i].textContent.trim().toLowerCase().indexOf(q) === 0) { setActive(i); return; }
            }
        }

        trigger.addEventListener('click', function () { if (isOpen()) close(false); else open(); });
        trigger.addEventListener('keydown', function (e) {
            if (sel.disabled) return;
            var k = e.key;
            if (!isOpen()) {
                if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') { e.preventDefault(); open(); }
                else if (k === 'Home') { e.preventDefault(); open(); setActive(first()); }
                else if (k === 'End') { e.preventDefault(); open(); setActive(last()); }
                else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { typeAhead(k); }
                return;
            }
            if (k === 'ArrowDown') { e.preventDefault(); if (e.altKey) return; setActive(step(active, 1)); }
            else if (k === 'ArrowUp') { e.preventDefault(); if (e.altKey) { choose(active); close(false); return; } setActive(step(active, -1)); }
            else if (k === 'Home') { e.preventDefault(); setActive(first()); }
            else if (k === 'End') { e.preventDefault(); setActive(last()); }
            else if (k === 'PageDown') { e.preventDefault(); var d = active; for (var a = 0; a < 8; a++) d = step(d, 1); setActive(d); }
            else if (k === 'PageUp') { e.preventDefault(); var u = active; for (var b = 0; b < 8; b++) u = step(u, -1); setActive(u); }
            else if (k === 'Enter' || k === ' ') { e.preventDefault(); choose(active); close(false); }
            else if (k === 'Escape') { e.preventDefault(); close(false); }
            else if (k === 'Tab') { choose(active); close(false); }   // 기본 동작(다음 칸으로)은 그대로
            else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { typeAhead(k); }
        });
        document.addEventListener('ds-popup-open', function (e) { if (e.detail !== wrap) close(false); });
        trigger.addEventListener('blur', function () { setTimeout(function () { if (document.activeElement !== trigger) close(false); }, 0); });
        document.addEventListener('mousedown', function (e) { if (isOpen() && !wrap.contains(e.target) && !menu.contains(e.target)) close(false); }, true);
        window.addEventListener('scroll', function (e) { if (isOpen() && !menu.contains(e.target)) positionMenu(); }, true);
        window.addEventListener('resize', function () { if (isOpen()) positionMenu(); });

        // 라벨을 누르면 상자로 — 원래 select 는 숨어 있어 라벨 클릭을 받지 못함
        var lid = labelIdFor(sel);
        var lab = lid ? document.getElementById(lid) : null;
        if (lab && lab.tagName === 'LABEL') lab.addEventListener('click', function (e) { e.preventDefault(); if (!sel.disabled) trigger.focus(); });

        // 배치: select 자리에 wrap — 안에 상자 · 목록 · 숨은 select 순서
        sel.parentNode.insertBefore(wrap, sel);
        wrap.appendChild(trigger);
        wrap.appendChild(menu);
        wrap.appendChild(sel);
        sel.classList.add('ui-select__native');
        sel.setAttribute('aria-hidden', 'true');
        sel.setAttribute('tabindex', '-1');

        buildOptions();
        refreshValue();
        syncAttrs();

        // 상자 폭을 목록 폭에 맞춤 — 목록이 상자보다 넓게 튀어나오지 않게. 단 부모 칸 폭까지만(검색 조건 칸 정렬 유지)
        (function fitTriggerToMenu() {
            try {
                var prev = menu.style.cssText;
                menu.style.cssText = 'display:block;visibility:hidden;position:absolute;left:-9999px;width:max-content';
                var need = Math.ceil(menu.getBoundingClientRect().width);
                menu.style.cssText = prev;
                var avail = wrap.parentNode && wrap.parentNode.clientWidth ? wrap.parentNode.clientWidth : 0;
                if (avail > 0) need = Math.min(need, avail);
                if (need > trigger.offsetWidth) trigger.style.minWidth = need + 'px';
            } catch (e) { /* 재지 못하면 그대로 */ }
        })();

        // 밖에서 값 · 옵션 · 상태를 바꿔도 따라감 — select.value 대입 후 change, 폼 초기화, 옵션을 나중에 채움(AJAX), disabled · aria-invalid 토글
        sel.addEventListener('change', refreshValue);
        if (sel.form) sel.form.addEventListener('reset', function () { setTimeout(refreshValue, 0); });
        if (window.MutationObserver) {
            new MutationObserver(function () { buildOptions(); refreshValue(); }).observe(sel, { childList: true, subtree: true, characterData: true });
            new MutationObserver(syncAttrs).observe(sel, { attributes: true, attributeFilter: ['disabled', 'aria-invalid', 'aria-describedby', 'aria-required', 'required', 'aria-label', 'aria-labelledby'] });
        }
    }

    // 영역 안의 단일 select 를 모두 바꿈(나중에 그린 화면 · 팝업 내용용)
    function enhanceSelects(root) {
        (root || document).querySelectorAll('select:not([multiple]):not(.no-ui):not(.checkSelect):not(.ui-select__native)').forEach(function (sel) {
            // 라이브러리(에디터 · 그리드)가 숨겨 두고 자기 위젯으로 쓰는 select 는 건드리지 않음 — 보이는 폼 select 만
            if (getComputedStyle(sel).display === 'none') return;
            buildCustomSelect(sel);
        });
    }

    window.buildCustomSelect = buildCustomSelect;   // 이전 버전 화면 코드와 같은 이름
    window.enhanceSelects = enhanceSelects;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { enhanceSelects(document); });
    else enhanceSelects(document);
})();
