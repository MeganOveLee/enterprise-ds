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
 *       <div class="filter-pop__foot"><button data-filter-clear-all>모두 지우기</button><button class="… filter-pop__apply" data-filter-apply>적용</button></div>
 *     </div>
 *   </div>
 *   불러오기만 하면 화면의 .filter-pop-wrap 이 모두 동작. 나중에 그린 것은 window.enhanceFilterPanels(영역)
 *
 * 개수: 조건 줄 배지 = 그 조건에 고른 값 수(체크 수, 입력칸 · 날짜 칸은 값이 든 칸마다 1). 「필터」 단추 = 값이 걸린 조건 수(Jira 업무 목록과 같음)
 * 걸린 값: 조건 줄 이름 아래 .filter-pop__value 에 고른 값 글자(첫 값 외 N · 시작 ~ 끝). Jira 업무 목록은 개수만 보여, 무엇으로 걸렀는지는 줄마다 열어야 보임
 * 자리: 단추 왼쪽 끝에 맞춰 열고, 오른쪽이 화면이나 넘침을 자르는 조상 상자 밖으로 나가면 오른쪽 끝에 맞춤(.filter-pop--end). 마크업에 --end 를 붙이면 늘 오른쪽 끝
 * 필터 더 보기(다른 방법): 바에 [필터 더 보기] 체크 목록(js/multiselect.js data-display="add")을 두고, 고른 조건의 단추(select[data-filter-field])만 바에 보인다
 * 조건 그룹(고급 검색): .criteria-group 안 조건 줄(속성 · 연산자 · 값, 속성 종류에 따라 값 칸이 바뀜)과 하위 그룹을 더하고 빼며, 맨 바깥 그룹 앞 .criteria-expr 에 괄호식을 쓴다
 * 닫기: [적용] · Esc · 바깥 누르기. 고른 값은 고르는 즉시 걸리고(개수 배지), 닫아도 남는다
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
    // 걸린 값 글자: 체크 = 고른 이름(둘 이상이면 「첫 값 외 N」, Multi Select 와 같음 DS-ADR-022) · 날짜 칸 둘 = 「시작 ~ 끝」 · 입력칸 = 넣은 글자
    function summary(pane) {
        var picked = [].filter.call(pane.querySelectorAll('input[type="checkbox"], input[type="radio"]'), function (el) { return el.checked && !el.hasAttribute('data-filter-default'); })
            .map(function (el) { return (el.closest('label') || el).textContent.trim(); });
        if (picked.length) return picked[0] + (picked.length > 1 ? ' 외 ' + (picked.length - 1) : '');
        var vals = [].filter.call(pane.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not(.filter-pop__search), textarea'), function (el) { return el.value && el.value.trim(); })
            .map(function (el) { return el.value.trim(); });
        return pane.querySelector('.ui-datepicker-range') ? vals.join(' ~ ') : vals.join(', ');
    }

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
            tabs.forEach(function (t, i) {
                var n = panes[i] ? valuesIn(panes[i]) : 0, v = t.querySelector('.filter-pop__value');
                setCount(t.querySelector('.filter-pop__count'), n);
                if (!v) { v = document.createElement('span'); v.className = 'filter-pop__value'; t.appendChild(v); }   // 조건 이름 아래 걸린 값: 패널을 닫았다 열어도 무엇으로 걸렀는지 보임
                v.textContent = n ? summary(panes[i]) : ''; v.hidden = !n;
                if (n) fields++;
            });
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
            var edge = document.documentElement.clientWidth - 8;   // 넘침을 자르는 조상 상자(카드 · 창 · 패널)가 있으면 그 오른쪽 끝까지만
            for (var a = wrap.parentElement; a && a !== document.body; a = a.parentElement) {
                if (/(hidden|auto|scroll|clip)/.test(getComputedStyle(a).overflowX)) edge = Math.min(edge, a.getBoundingClientRect().right - 8);
            }
            if (pop.getBoundingClientRect().right > edge) pop.classList.add('filter-pop--end');
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
            if (e.target.closest('[data-filter-apply]')) { close(true); return; }   // [적용] = 닫고 [필터] 단추로. 검색 실행은 화면 스크립트가 같은 click 으로 받음
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

    // 조건 그룹(.criteria-group, 고급 검색): 그룹 머리 = 및 · 또는 + [속성 추가](목록에서 고른 속성의 줄) · [조건 추가](첫 속성 줄) · [그룹 추가](안에 그룹) · [그룹 제거](하위 그룹만).
    // 줄 = 속성 · 연산자 · 값. 속성 옵션의 data-type 에 따라 연산자와 값 칸이 바뀐다(아래 OPS, 맨 바깥 그룹 안 template.criteria-template 의 [data-criteria-value]).
    //   text 글자 · number 숫자 · bool 예/아니요 · list 목록(옵션 data-values="값|값") · user 사람(찾기 단추) · date 날짜(어제 · 오늘 · 내일 · 날짜 범위 선택 · 일 범위 선택)
    // 값이 바뀔 때마다 맨 바깥 그룹 앞 .criteria-expr 에 괄호식을 쓴다
    var OPS = { text: ['=', '≠'], number: ['=', '≠', '<', '≤', '>', '≥'], bool: ['=', '≠'], list: ['=', '≠'], user: ['=', '≠'], date: ['='] };
    function txt(el) {
        if (!el) return '';
        if (el.tagName === 'SELECT') { var o = el.selectedOptions[0]; return o && !o.hasAttribute('data-empty') ? o.text : ''; }   // 「-선택-」처럼 data-empty 옵션 = 값 없음
        return el.value.trim();
    }
    function q(v) { return "'" + v + "'"; }
    function rowExpr(row) {
        var field = row.querySelector('.criteria-row__field'), val = row.querySelector('.criteria-row__value');
        if (!field || !val) return '';
        var type = field.selectedOptions[0] ? field.selectedOptions[0].getAttribute('data-type') : 'text', v = '';
        if (type === 'date') {
            var kind = txt(val.querySelector('.criteria-date'));
            var shown = val.querySelector('.criteria-date__part:not([hidden])');
            var parts = shown ? [].map.call(shown.querySelectorAll('input'), txt) : [];
            if (!shown) v = kind;
            else if (parts.every(Boolean)) v = shown.getAttribute('data-range') === '일 범위 선택' ? parts[0] + '일 전 ~ ' + parts[1] + '일 후' : q(parts[0]) + ' ~ ' + q(parts[1]);
        } else {
            var f = val.querySelector('input:not([type="hidden"]), select');
            v = f ? txt(f) : '';
            if (v) v = type === 'number' ? v : q(v);
        }
        return v ? txt(field) + ' ' + txt(row.querySelector('.criteria-row__op')) + ' ' + v : '';
    }
    function groupExpr(g) {
        var join = ' ' + (txt(g.querySelector(':scope > .criteria-group__head .criteria-group__join')) || '및') + ' ';
        var body = g.querySelector(':scope > .criteria-group__body');
        var items = body ? [].map.call(body.children, function (c) { return c.classList.contains('criteria-row') ? rowExpr(c) : c.classList.contains('criteria-group') ? groupExpr(c) : ''; }).filter(function (t) { return t && t !== '( )'; }) : [];
        return items.length ? '( ' + items.join(join) + ' )' : '( )';
    }
    function wireCriteria(root) {
        if (!root || root.dataset.criteriaDone || (root.parentElement && root.parentElement.closest('.criteria-group'))) return;   // 맨 바깥 그룹에만 건다
        root.dataset.criteriaDone = '1';
        var expr = root.previousElementSibling && root.previousElementSibling.classList.contains('criteria-expr') ? root.previousElementSibling : null;
        var tpl = root.querySelector('template.criteria-template');
        function update() { if (expr) expr.textContent = groupExpr(root); }
        function enhance(el) {
            if (window.enhanceSelects) window.enhanceSelects(el);
            if (window.datepickerInit && el.querySelector('.ui-datepicker__input')) window.datepickerInit();
            if (window.dsClearInit) window.dsClearInit(el);
        }
        // 속성에 맞춰 연산자 옵션과 값 칸을 다시 그림. 값 칸 견본 = template 의 [data-criteria-value="종류"]
        function setType(row) {
            var field = row.querySelector('.criteria-row__field'), opt = field.selectedOptions[0];
            var type = (opt && opt.getAttribute('data-type')) || 'text', op = row.querySelector('.criteria-row__op'), val = row.querySelector('.criteria-row__value');
            op.innerHTML = OPS[type].map(function (o) { return '<option>' + o + '</option>'; }).join('');
            var src = tpl && tpl.content.querySelector('[data-criteria-value="' + type + '"]');
            val.innerHTML = src ? src.innerHTML : '';
            val.setAttribute('data-type', type);
            if (type === 'list') {
                var sel = val.querySelector('select');
                sel.insertAdjacentHTML('beforeend', (opt.getAttribute('data-values') || '').split('|').filter(Boolean).map(function (v) { return '<option>' + v + '</option>'; }).join(''));
            }
            val.querySelectorAll('[aria-label]').forEach(function (x) { x.setAttribute('aria-label', x.getAttribute('aria-label').replace('값', opt.text + ' 값')); });
            showDate(val);
        }
        function showDate(val) {
            var kind = val.querySelector('.criteria-date');
            if (!kind) return;
            var k = kind.selectedOptions[0] ? kind.selectedOptions[0].text : '';
            val.querySelectorAll('.criteria-date__part').forEach(function (p) { p.hidden = p.getAttribute('data-range') !== k; });
        }
        function newRow(attr) {
            var row = tpl.content.querySelector('.criteria-row').cloneNode(true);
            var field = row.querySelector('.criteria-row__field');
            if (attr) [].forEach.call(field.options, function (o) { o.selected = o.text === attr; });
            setType(row);
            return row;
        }
        function focusValue(r) {
            var f = [].filter.call(r.querySelectorAll('.criteria-row__value .ui-select__trigger, .criteria-row__value input, .criteria-row__value select'), function (x) { return x.offsetParent !== null; })[0];
            if (f) f.focus();
        }
        root.addEventListener('click', function (e) {
            var pick = e.target.closest('[data-criteria-attr]');
            if (pick && root.contains(pick)) {   // 속성 추가 목록: 메뉴가 닫히고 포커스를 되돌린 뒤(js/menu.js) 줄을 더함
                var body0 = pick.closest('.criteria-group').querySelector(':scope > .criteria-group__body'), attr = pick.getAttribute('data-criteria-attr');
                setTimeout(function () { var r = newRow(attr); body0.appendChild(r); enhance(r); focusValue(r); update(); }, 0);
                return;
            }
            var btn = e.target.closest('[data-criteria]');
            if (!btn || !root.contains(btn)) return;
            var g = btn.closest('.criteria-group'), body = g.querySelector(':scope > .criteria-group__body'), kind = btn.getAttribute('data-criteria');
            if (kind === 'add-row' && tpl) { var r = newRow(); body.appendChild(r); enhance(r); var f = r.querySelector('.criteria-row__field'); var t = f.parentElement.querySelector('.ui-select__trigger'); (t || f).focus(); }
            else if (kind === 'add-group' && tpl) {
                var sub = tpl.content.querySelector('.criteria-group').cloneNode(true);
                sub.querySelector('.criteria-group__body').appendChild(newRow());
                body.appendChild(sub); enhance(sub); var f2 = sub.querySelector('.criteria-row__field'); var t2 = f2.parentElement.querySelector('.ui-select__trigger'); (t2 || f2).focus();
            }
            else if (kind === 'remove-group' && g !== root) { var add = g.parentElement.closest('.criteria-group').querySelector(':scope > .criteria-group__head [data-criteria="add-group"]'); g.remove(); if (add) add.focus(); }
            else if (kind === 'remove-row') { var row = btn.closest('.criteria-row'), next = g.querySelector(':scope > .criteria-group__head [data-criteria="add-row"]'); row.remove(); if (next) next.focus(); }
            update();
        });
        root.addEventListener('change', function (e) {
            var row = e.target.closest('.criteria-row');
            if (row && e.target.classList.contains('criteria-row__field')) { setType(row); enhance(row); }
            else if (e.target.classList.contains('criteria-date')) showDate(e.target.closest('.criteria-row__value'));
            update();
        });
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
