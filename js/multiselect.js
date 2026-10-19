/* =====================================================================
 * multiselect.js - 다중 선택(.checkSelect) 여닫기 · 표시 글자
 * <select class="checkSelect" multiple> 를 표시 상자 + 체크박스 목록(.checkSelect)으로 바꾼다. 모양은 components.css 「checkSelect」.
 *
 * 사용:
 *   불러오기만 하면 화면의 select.checkSelect[multiple] 이 모두 바뀜(이전 버전과 같은 방식)
 *   목록 위 검색 칸 = data-searchBox="true"(옵션 안에서 거르기), 아무것도 고르지 않았을 때 글자 = placeholder(없으면 「전체」)
 *   나중에 그린 select 는 window.buildMultiSelect(select) · window.enhanceMultiSelects(영역)
 *   값 · 이름 · 폼 제출은 원래 select 가 그대로 맡는다(숨겨서 둠, option.selected 를 맞춤). change 는 목록을 닫을 때 값이 바뀌었으면 한 번
 *   포함하지 않는 것: 서버에 물어 옵션을 채우는 사람 검색(이전 버전 data-url) — 서버 주소 · 응답 형식이 시스템마다 달라 각 시스템이 맡음
 *
 * Enterprise DS v1.0 (2026-10-19, TD-101) — 이전 버전 화면 스크립트(다중 선택 변환)에서 화면 동작만 옮기고 접근성을 덧붙임
 *   - 표시 상자 = role="button" + aria-haspopup · aria-expanded · aria-controls, 목록 = role="group"(체크박스 묶음, 이름 = 칸 이름)
 *   - 표시 글자 = 하나면 그 값, 두 개 이상이면 「첫 값 외 N」(DS-ADR-022). 화면 읽기 이름 = 「칸 이름: 보이는 글자 (나머지 값)」, 고른 값 전체는 title
 *   - 키보드: 표시 상자 Enter · Space · ↓ = 열고 첫 칸(검색 또는 첫 옵션)으로 / 목록 ↑ ↓ = 옵션 사이 이동, Space = 고르기 · 풀기, Tab = 다음 옵션
 *     Esc = 닫고 표시 상자로, 목록 밖으로 포커스가 나가거나 바깥을 누르면 닫힘
 * ===================================================================== */
(function () {
    'use strict';

    var seq = 0;

    function nameOf(sel) {
        if (sel.getAttribute('aria-label')) return sel.getAttribute('aria-label');
        var lid = sel.getAttribute('aria-labelledby');
        var lab = lid ? document.getElementById(lid) : (sel.id ? document.querySelector('label[for="' + sel.id.replace(/"/g, '\\"') + '"]') : null);
        return lab ? lab.textContent.replace(/\s*\*\s*$/, '').trim() : (sel.getAttribute('data-name') || sel.name || '');
    }
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    function buildMultiSelect(sel) {
        if (!sel || sel.dataset.uiMultiDone) return;
        sel.dataset.uiMultiDone = '1';
        var uid = 'ui-multi-' + (++seq);
        var name = nameOf(sel);
        var empty = sel.getAttribute('placeholder') || '전체';
        var withSearch = sel.getAttribute('data-searchBox') === 'true' || sel.getAttribute('data-searchbox') === 'true';

        var wrap = document.createElement('div');
        wrap.className = 'checkSelect';
        if (sel.getAttribute('data-width')) wrap.style.width = sel.getAttribute('data-width');

        var box = document.createElement('div');
        box.className = 'selected-text';
        box.setAttribute('role', 'button');
        box.setAttribute('tabindex', '0');
        box.setAttribute('aria-haspopup', 'true');
        box.setAttribute('aria-expanded', 'false');
        box.setAttribute('aria-controls', uid + '-list');
        if (sel.disabled) { box.setAttribute('aria-disabled', 'true'); box.setAttribute('tabindex', '-1'); }   // 비활성 = 열리지 않고 Tab 순서에서 빠짐

        var list = document.createElement('div');
        list.className = 'options';
        list.id = uid + '-list';
        list.setAttribute('role', 'group');
        list.setAttribute('aria-label', name);

        var search = null;
        if (withSearch) {
            search = document.createElement('input');
            search.type = 'text';
            search.className = 'search-text';
            search.setAttribute('aria-label', name + ' 검색');
            search.placeholder = sel.getAttribute('data-placeholder') || '검색';
            list.appendChild(search);
        }
        var holder = document.createElement('div');
        list.appendChild(holder);

        function buildOptions() {
            holder.innerHTML = '';
            [].forEach.call(sel.options, function (o, i) {
                if (o.value === '' && !o.textContent.trim()) return;   // 빈 안내 옵션은 목록에 넣지 않음
                var lab = document.createElement('label');
                lab.className = 'option';
                lab.innerHTML = '<input type="checkbox" value="' + esc(o.value) + '"' + (o.selected ? ' checked' : '') + (o.disabled ? ' disabled' : '') + '><span>' + esc(o.label || o.textContent) + '</span>';
                lab.firstChild.setAttribute('data-index', String(i));
                holder.appendChild(lab);
            });
        }
        function picked() { return [].filter.call(sel.options, function (o) { return o.selected; }).map(function (o) { return o.label || o.textContent; }); }
        function render() {
            var p = picked();
            if (p.length < 2) box.textContent = p.length ? p[0] : empty;
            else box.innerHTML = '<span class="selected-text__value">' + esc(p[0]) + '</span> <span class="selected-text__more">외 ' + (p.length - 1) + '</span>';
            box.setAttribute('aria-label', name + ': ' + (p.length < 2 ? (p[0] || empty) : p[0] + ' 외 ' + (p.length - 1) + ' (' + p.slice(1).join(', ') + ')'));
            if (p.length > 1) box.setAttribute('title', p.join(', ')); else box.removeAttribute('title');
            box.classList.toggle('is-placeholder', !p.length);
        }
        function boxes() { return [].slice.call(holder.querySelectorAll('input[type="checkbox"]')).filter(function (c) { return !c.disabled && c.closest('.option').style.display !== 'none'; }); }

        var before = '';
        function isOpen() { return list.classList.contains('show'); }
        function open(focusFirst) {
            if (sel.disabled || isOpen()) return;
            document.dispatchEvent(new CustomEvent('ds-popup-open', { detail: wrap }));   // 다른 다중 선택 · 선택 목록은 닫힘(한 번에 하나)
            before = picked().join('\u0000');
            list.classList.add('show');
            box.setAttribute('aria-expanded', 'true');
            if (focusFirst) { var f = search || boxes()[0]; if (f) f.focus(); }
        }
        function close(refocus) {
            if (!isOpen()) return;
            list.classList.remove('show');
            box.setAttribute('aria-expanded', 'false');
            if (search && search.value) { search.value = ''; filter(); }
            if (refocus) box.focus();
            if (picked().join('\u0000') !== before) sel.dispatchEvent(new Event('change', { bubbles: true }));
        }
        document.addEventListener('ds-popup-open', function (e) { if (e.detail !== wrap) close(false); });
        function filter() {
            var q = search ? search.value.trim().toLowerCase() : '';
            holder.querySelectorAll('.option').forEach(function (o) { o.style.display = !q || o.textContent.toLowerCase().indexOf(q) >= 0 ? '' : 'none'; });
        }

        box.addEventListener('click', function () { if (isOpen()) close(false); else open(false); });
        box.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); if (isOpen() && e.key !== 'ArrowDown') close(false); else open(true); }
            else if (e.key === 'Escape') { close(false); }
        });
        holder.addEventListener('change', function (e) {
            var c = e.target;
            if (!c || c.type !== 'checkbox') return;
            var o = sel.options[Number(c.getAttribute('data-index'))];
            if (o) o.selected = c.checked;
            render();
        });
        list.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
            if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
            e.preventDefault();
            var all = boxes();
            if (!all.length) return;
            var i = all.indexOf(document.activeElement);
            if (e.key === 'ArrowDown') (all[i + 1] || all[0]).focus();
            else if (i <= 0 && search) search.focus();
            else (all[i - 1] || all[all.length - 1]).focus();
        });
        if (search) search.addEventListener('input', filter);
        wrap.addEventListener('focusout', function (e) { if (isOpen() && e.relatedTarget && !wrap.contains(e.relatedTarget)) close(false); });
        document.addEventListener('mousedown', function (e) { if (isOpen() && !wrap.contains(e.target)) close(false); }, true);

        // 배치: select 자리에 wrap — 안에 표시 상자 · 목록 · 숨은 select
        sel.parentNode.insertBefore(wrap, sel);
        wrap.appendChild(box);
        wrap.appendChild(list);
        wrap.appendChild(sel);
        sel.style.display = 'none';
        sel.setAttribute('aria-hidden', 'true');
        sel.setAttribute('tabindex', '-1');

        buildOptions();
        render();

        // 밖에서 값 · 옵션을 바꿔도 따라감 — option.selected 대입 후 change, 폼 초기화, 옵션을 나중에 채움
        sel.addEventListener('change', function () { holder.querySelectorAll('input[type="checkbox"]').forEach(function (c) { var o = sel.options[Number(c.getAttribute('data-index'))]; if (o) c.checked = o.selected; }); render(); });
        if (sel.form) sel.form.addEventListener('reset', function () { setTimeout(function () { buildOptions(); render(); }, 0); });
        if (window.MutationObserver) new MutationObserver(function () { buildOptions(); render(); }).observe(sel, { childList: true, subtree: true });
    }

    function enhanceMultiSelects(root) {
        (root || document).querySelectorAll('select.checkSelect[multiple]').forEach(buildMultiSelect);
    }

    window.buildMultiSelect = buildMultiSelect;
    window.enhanceMultiSelects = enhanceMultiSelects;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { enhanceMultiSelects(document); });
    else enhanceMultiSelects(document);
})();
