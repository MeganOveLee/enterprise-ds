/* =====================================================================
 * filter-panel.js - 필터 패널(.filter-pop) 여닫기 · 조건 고르기 · 개수
 * 검색 조건이 많은 목록 화면에서 자주 쓰는 조건 두세 개는 조건 단추(.checkSelect--filter)로 바에 두고, 나머지는 「필터」 단추 하나의 두 칸 패널에 둔다.
 * 모양은 components.css 「필터 패널」.
 *
 * 마크업:
 *   <div class="filter-pop-wrap">
 *     <button class="btn btn--secondary btn--outlined filter-trigger" aria-expanded="false" aria-controls="ID">필터<span class="filter-trigger__count" hidden></span></button>
 *     <div class="filter-pop" id="ID" role="dialog" aria-label="필터" hidden>
 *       <div class="filter-pop__main">
 *         <div class="filter-pop__fields" role="tablist" aria-orientation="vertical"> <button role="tab" class="filter-pop__field" aria-controls="칸ID">이름<span class="filter-pop__count" hidden></span></button> … </div>
 *         <div class="filter-pop__pane" role="tabpanel" id="칸ID"> 찾기 칸(.filter-pop__search) · .filter-pop__options(.checkbox) · 날짜 · 입력칸 · [data-filter-clear] </div> …
 *       </div>
 *       <div class="filter-pop__foot"><button data-filter-clear-all>모두 지우기</button> …</div>
 *     </div>
 *   </div>
 *   불러오기만 하면 화면의 .filter-pop-wrap 이 모두 동작. 나중에 그린 것은 window.enhanceFilterPanels(영역)
 *
 * 개수: 조건 줄 배지 = 그 조건에 고른 값 수(체크 수, 입력칸 · 날짜 칸은 값이 든 칸마다 1). 「필터」 단추 = 값이 걸린 조건 수(Jira 업무 목록과 같음)
 * 자리: 단추 왼쪽 끝에 맞춰 열고, 오른쪽이 화면 밖으로 나가면 오른쪽 끝에 맞춤(.filter-pop--end). 마크업에 --end 를 붙이면 늘 오른쪽 끝
 * 필터 더 보기(다른 방법): 바에 [필터 더 보기] 체크 목록(js/multiselect.js data-display="add")을 두고, 고른 조건의 단추(select[data-filter-field])만 바에 보인다
 * 조건 묶음(고급 검색): .criteria-group 안 조건 줄(속성 · 연산자 · 값)과 하위 묶음을 더하고 빼며, 맨 바깥 묶음 위 .criteria-expr 에 괄호식을 쓴다
 * 키보드: 「필터」 단추 Enter · Space = 열고 고른 조건으로 / 조건 목록 ↑ ↓ = 조건 바꾸기 / Esc = 닫고 「필터」 단추로 / 바깥을 누르면 닫힘
 * ===================================================================== */
(function () {
    'use strict';

    function valuesIn(pane) {
        var n = 0;
        pane.querySelectorAll('input, select, textarea').forEach(function (el) {
            if (el.classList.contains('filter-pop__search') || el.disabled) return;
            if (el.type === 'checkbox' || el.type === 'radio') { if (el.checked && !el.hasAttribute('data-filter-default')) n++; }
            else if (el.value && el.value.trim()) n++;
        });
        return n;
    }
    function setCount(el, n) { if (!el) return; el.textContent = n ? String(n) : ''; el.hidden = !n; }

    function wire(wrap) {
        if (!wrap || wrap.dataset.filterDone) return;
        wrap.dataset.filterDone = '1';
        var trigger = wrap.querySelector('.filter-trigger');
        var pop = wrap.querySelector('.filter-pop');
        if (!trigger || !pop) return;
        var autoEnd = { fixed: pop.classList.contains('filter-pop--end') };   // 마크업에 --end 를 붙였으면 늘 왼쪽으로
        var tabs = [].slice.call(pop.querySelectorAll('.filter-pop__field'));
        var panes = tabs.map(function (t) { return pop.querySelector('#' + t.getAttribute('aria-controls')); });

        function update() {
            var fields = 0;
            tabs.forEach(function (t, i) { var n = panes[i] ? valuesIn(panes[i]) : 0; setCount(t.querySelector('.filter-pop__count'), n); if (n) fields++; });
            setCount(trigger.querySelector('.filter-trigger__count'), fields);
            trigger.classList.toggle('is-applied', fields > 0);
            trigger.setAttribute('aria-label', '필터' + (fields ? ': 걸린 조건 ' + fields + '개' : ''));
        }
        function select(i, focus) {
            tabs.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (panes[k]) panes[k].hidden = !on; });
            if (focus) tabs[i].focus();
        }
        function current() { var i = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }); return i < 0 ? 0 : i; }
        function isOpen() { return !pop.hidden; }
        function place() {   // 오른쪽이 화면 밖으로 나가면 단추 오른쪽 끝에 맞춰 왼쪽으로 펼침(.filter-pop--end)
            if (autoEnd.fixed) return;
            pop.classList.remove('filter-pop--end');
            if (pop.getBoundingClientRect().right > document.documentElement.clientWidth - 8) pop.classList.add('filter-pop--end');
        }
        function open() {
            if (isOpen()) return;
            document.dispatchEvent(new CustomEvent('ds-popup-open', { detail: wrap }));
            pop.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            place();
            if (tabs.length) tabs[current()].focus();
        }
        function close(refocus) {
            if (!isOpen()) return;
            pop.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            if (refocus) trigger.focus();
        }

        trigger.addEventListener('click', function () { if (isOpen()) close(false); else open(); });
        tabs.forEach(function (t, i) { t.addEventListener('click', function () { select(i, false); }); });
        pop.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { e.preventDefault(); close(true); return; }
            var at = tabs.indexOf(document.activeElement);
            if (at < 0 || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
            e.preventDefault();
            select((at + (e.key === 'ArrowDown' ? 1 : tabs.length - 1)) % tabs.length, true);
        });
        pop.addEventListener('input', function (e) {
            var q = e.target.closest('.filter-pop__search');
            if (q) {
                var word = q.value.trim().toLowerCase();
                q.closest('.filter-pop__pane').querySelectorAll('.filter-pop__options > *').forEach(function (o) { o.hidden = !!word && o.textContent.toLowerCase().indexOf(word) < 0; });
                return;
            }
            update();
        });
        pop.addEventListener('change', update);
        pop.addEventListener('click', function (e) {
            var one = e.target.closest('[data-filter-clear]'), all = e.target.closest('[data-filter-clear-all]');
            if (!one && !all) return;
            (all ? panes : [one.closest('.filter-pop__pane')]).forEach(function (p) {
                if (!p) return;
                p.querySelectorAll('input, select, textarea').forEach(function (el) {
                    if (el.type === 'checkbox' || el.type === 'radio') el.checked = el.hasAttribute('data-filter-default');
                    else if (!el.classList.contains('filter-pop__search')) el.value = '';
                });
            });
            update();
        });
        document.addEventListener('ds-popup-open', function (e) { if (e.detail !== wrap) close(false); });
        document.addEventListener('mousedown', function (e) { if (isOpen() && !wrap.contains(e.target) && !e.target.closest('.datepicker')) close(false); }, true);

        select(current(), false);
        update();
        if (isOpen()) place();   // 펼친 채 그린 것(문서 견본)
    }

    // 필터 더 보기: <select class="checkSelect" multiple data-display="add"> 의 옵션 값 = 바에 숨겨 둔 조건 단추의 data-filter-field.
    // 고르면 그 조건 단추가 나타나고, 풀면 단추가 빠지며 그 조건의 값도 비운다. 처음에 고르지 않은 조건 단추는 숨긴다
    function syncAdd(sel) {
        var bar = sel.closest('.search-bar') || document;
        [].forEach.call(sel.options, function (o) {
            bar.querySelectorAll('select[data-filter-field="' + o.value.replace(/"/g, '\\"') + '"]').forEach(function (f) {
                var w = (f.parentElement && f.parentElement.closest('.checkSelect')) || f;   // select 자신도 .checkSelect 라 부모부터 찾음
                if (!o.selected && !w.hidden) { [].forEach.call(f.options, function (x) { x.selected = false; }); f.dispatchEvent(new Event('change', { bubbles: true })); }
                w.hidden = !o.selected;
            });
        });
    }
    document.addEventListener('change', function (e) { if (e.target.matches && e.target.matches('select[data-display="add"]')) syncAdd(e.target); });

    // 조건 묶음(.criteria-group): [조건 추가] = 묶음 끝에 새 조건 줄, [하위 묶음 추가] = 묶음 안에 새 묶음(조건 줄 하나). 둘 다 맨 바깥 묶음 안 template.criteria-template 의 줄 · 묶음을 복제,
    // [묶음 지우기] = 하위 묶음을 통째로 뺌, 빼기(×) = 조건 줄 하나만 뺌. 값이 바뀔 때마다 맨 바깥 묶음 위 식(.criteria-expr)을 다시 씀
    function txt(el) {
        if (!el) return '';
        if (el.tagName === 'SELECT') return el.multiple ? [].map.call(el.selectedOptions, function (o) { return o.text; }).join(', ') : (el.selectedOptions[0] ? el.selectedOptions[0].text : '');
        return el.value.trim();
    }
    function rowExpr(row) {
        var val = row.querySelector('.criteria-row__value');
        var parts = val ? [].filter.call(val.querySelectorAll('input, select'), function (f) { return f.type !== 'search' && f.type !== 'hidden'; }).map(txt).filter(Boolean) : [];
        if (!parts.length) return '';
        return txt(row.querySelector('.criteria-row__field')) + ' ' + txt(row.querySelector('.criteria-row__op')) + ' ' + parts.join(' ~ ');
    }
    function groupExpr(g) {
        var join = ' ' + (txt(g.querySelector(':scope > .criteria-group__head .criteria-group__join')) || '및') + ' ';
        var body = g.querySelector(':scope > .criteria-group__body');
        var items = body ? [].map.call(body.children, function (c) { return c.classList.contains('criteria-row') ? rowExpr(c) : c.classList.contains('criteria-group') ? groupExpr(c) : ''; }).filter(function (t) { return t && t !== '( )'; }) : [];
        return '(' + (items.length ? items.join(join) : ' ') + ')';
    }
    function wireCriteria(root) {
        if (!root || root.dataset.criteriaDone || (root.parentElement && root.parentElement.closest('.criteria-group'))) return;   // 맨 바깥 묶음에만 건다
        root.dataset.criteriaDone = '1';
        var expr = root.previousElementSibling && root.previousElementSibling.classList.contains('criteria-expr') ? root.previousElementSibling : null;
        var tpl = root.querySelector('template.criteria-template');
        var seq = 0;
        function update() { if (expr) expr.textContent = groupExpr(root); }
        function enhance(el) { if (window.enhanceSelects) window.enhanceSelects(el); }
        function newRow() {
            var row = tpl.content.querySelector('.criteria-row').cloneNode(true);
            row.querySelectorAll('[id]').forEach(function (x) { x.id += '-' + (++seq); });
            return row;
        }
        function firstField(el) { var f = el.querySelector('.criteria-row__field'); var t = f && f.parentElement.querySelector('.ui-select__trigger'); (t || f).focus(); }
        root.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-criteria]');
            if (!btn || !root.contains(btn)) return;
            var g = btn.closest('.criteria-group'), body = g.querySelector(':scope > .criteria-group__body'), kind = btn.getAttribute('data-criteria');
            if (kind === 'add-row' && tpl) { var r = newRow(); body.appendChild(r); enhance(r); firstField(r); }
            else if (kind === 'add-group' && tpl) {
                var sub = tpl.content.querySelector('.criteria-group').cloneNode(true);
                sub.querySelector('.criteria-group__body').appendChild(newRow());
                body.appendChild(sub); enhance(sub); firstField(sub);
            }
            else if (kind === 'remove-group' && g !== root) { var add = g.parentElement.closest('.criteria-group').querySelector(':scope > .criteria-group__head [data-criteria="add-group"]'); g.remove(); if (add) add.focus(); }
            else if (kind === 'remove-row') { var row = btn.closest('.criteria-row'), next = g.querySelector(':scope > .criteria-group__head [data-criteria="add-row"]'); row.remove(); if (next) next.focus(); }
            update();
        });
        root.addEventListener('change', update);
        root.addEventListener('input', update);
        update();
    }

    function enhanceFilterPanels(root) {
        (root || document).querySelectorAll('.filter-pop-wrap').forEach(wire);
        (root || document).querySelectorAll('select[data-display="add"]').forEach(syncAdd);
        (root || document).querySelectorAll('.criteria-group').forEach(wireCriteria);
    }
    window.enhanceFilterPanels = enhanceFilterPanels;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { enhanceFilterPanels(document); });
    else enhanceFilterPanels(document);
})();
