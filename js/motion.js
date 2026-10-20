/* =====================================================================
 * motion.js - 인터랙션 스크립트 (window.dsMotion)
 * 뜻이 있는 한 번짜리 움직임에 필요한 몫만. 모양 · 시간은 components.css 「인터랙션」 절과 모션 토큰이 정한다.
 *
 * 사용:
 *   <script src="js/motion.js"></script>   — 불러오면 끌어 순서 바꾸기([data-ds-reorder]) · [다음 차이]([data-ds-next-diff])가 자동으로 붙음
 *   dsMotion.roll(요소, 값)                 숫자 굴러가기 — 대시보드 카드 · 결재 배지 · 검색 결과 건수
 *   dsMotion.flash(행)                      방금 바뀐 행 — 저장 · 추가 직후 한 번
 *   dsMotion.pop(상태 칩)                   상태 칩이 바뀐 직후 한 번 튐(글자 · 색은 화면 스크립트가 먼저 바꿈)
 *   dsMotion.done(버튼, { text, message })  처리 끝 — 버튼 자리에 「✓ 저장됨」을 잠깐, 결과 문장은 알림 자리로
 *   dsMotion.nextDiff(표)                   다음 차이 행으로 내려가 한 번 표시, 포커스는 그 행 링크로
 *   dsMotion.undoToast({ message, onUndo, onCommit })   되돌리기 토스트 — --duration-undo 동안, 마우스 · 포커스가 있으면 멈춤
 *   dsMotion.reorderInit(영역)              나중에 그린 [data-ds-reorder] 목록에 붙임
 *   dsMotion.announce(문장)                 화면 읽기 프로그램 알림(role="status" 자리 하나를 같이 씀)
 *
 * Enterprise DS v1.0 (DS-ADR-041, TD-108 44번)
 *   - 동작 줄이기 설정(prefers-reduced-motion)이면 움직이지 않고 결과만 — 숫자는 바로 바뀌고 줄은 바로 자리를 바꿈
 *   - 움직임은 꾸밈이고 뜻은 글자가 맡는다: 숫자 · 상태 · 결과는 글자로도 읽히게 둔다
 * ===================================================================== */
(function () {
    'use strict';

    function reducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    function cssTime(name, fallback) {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        if (!v) return fallback;
        return v.slice(-2) === 'ms' ? parseFloat(v) : parseFloat(v) * 1000;
    }
    /* 클래스를 떼고 다시 붙여 같은 움직임을 처음부터 */
    function restart(el, cls) {
        if (!el) return;
        el.classList.remove(cls);
        void el.offsetWidth;
        el.classList.add(cls);
    }
    function once(el, cls, ms) {
        restart(el, cls);
        clearTimeout(el['_ds_' + cls]);
        el['_ds_' + cls] = setTimeout(function () { el.classList.remove(cls); }, ms + 100);
    }

    /* ── 알림 자리 ── 화면에 하나. 같은 문장을 다시 알려도 읽히게 비웠다가 넣음 */
    var live = null;
    function announce(text) {
        if (!live) {
            live = document.createElement('div');
            live.className = 'sr-only';
            live.setAttribute('role', 'status');
            live.setAttribute('aria-live', 'polite');
            document.body.appendChild(live);
        }
        live.textContent = '';
        setTimeout(function () { live.textContent = text; }, 60);
    }

    /* ── 3 숫자 굴러가기 ── */
    function rollColumn() {
        var c = document.createElement('span');
        c.className = 'ds-roll__col';
        for (var d = 0; d <= 9; d++) { var s = document.createElement('span'); s.textContent = d; c.appendChild(s); }
        return c;
    }
    function roll(el, value) {
        if (!el) return;
        var text = String(value);
        var instant = reducedMotion() || el.getAttribute('data-ds-roll') !== 'on';
        if (el.getAttribute('data-ds-roll') !== 'on') {
            el.classList.add('ds-roll');
            el.innerHTML = '<span class="sr-only"></span><span class="ds-roll__digits" aria-hidden="true"></span>';
            el.setAttribute('data-ds-roll', 'on');
        }
        var sr = el.firstChild, box = el.lastChild;
        sr.textContent = text;
        while (box.children.length < text.length) box.insertBefore(rollColumn(), box.firstChild);
        while (box.children.length > text.length) box.removeChild(box.firstChild);
        for (var i = 0; i < text.length; i++) {
            var col = box.children[i], n = Number(text[i]);
            if (isNaN(n)) n = 0;
            if (instant) col.style.transition = 'none';
            col.style.transform = 'translateY(' + (-1.2 * n) + 'em)';
            if (instant) { void col.offsetWidth; col.style.transition = ''; }
        }
    }

    /* ── 4 방금 바뀐 행 · 5 상태 칩 ── */
    function flash(el) { if (el && !reducedMotion()) once(el, 'is-flash', cssTime('--duration-once', 1600)); }
    function pop(el) { if (el && !reducedMotion()) once(el, 'is-changed', cssTime('--duration-slow', 400)); }

    /* ── 8 처리 끝 체크 ── */
    var CHECK = '<svg class="ds-check" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 6.2l2.3 2.3 4.7-4.9"/></svg>';
    function done(btn, opts) {
        if (!btn) return;
        opts = opts || {};
        if (btn._dsDone) { clearTimeout(btn._dsDone.t); btn.innerHTML = btn._dsDone.html; }
        var html = btn.innerHTML;
        btn.classList.remove('is-loading');
        btn.removeAttribute('aria-busy');
        btn.classList.add('is-done');
        btn.innerHTML = CHECK + (opts.text || '저장됨');
        announce(opts.message || '저장되었습니다.');
        btn._dsDone = {
            html: html,
            t: setTimeout(function () {
                btn.classList.remove('is-done');
                btn.innerHTML = html;
                btn._dsDone = null;
            }, opts.ms || 1600)
        };
    }

    /* ── 9 다음 차이로 ── 표 안 비교 결과 줄(.compare-row--similar · --unassigned)을 차례로 */
    var DIFF = '.compare-row--similar, .compare-row--unassigned';
    function scroller(el) {
        for (var p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            var oy = getComputedStyle(p).overflowY;
            if ((oy === 'auto' || oy === 'scroll') && p.scrollHeight > p.clientHeight) return p;
        }
        return null;
    }
    function nextDiff(table, out) {
        if (!table) return null;
        var rows = table.querySelectorAll('tbody tr');
        var diffs = [];
        for (var i = 0; i < rows.length; i++) if (rows[i].matches(DIFF)) diffs.push(rows[i]);
        if (!diffs.length) { if (out) out.textContent = '차이 없음'; return null; }
        var was = table.hasAttribute('data-ds-diff-at') ? Number(table.getAttribute('data-ds-diff-at')) : -1;
        var at = isNaN(was) ? 0 : (was + 1) % diffs.length;
        table.setAttribute('data-ds-diff-at', at);
        var row = diffs[at];
        var box = scroller(row);
        if (box) {
            var head = table.tHead ? table.tHead.offsetHeight : 0;
            var top = row.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - head - row.offsetHeight;
            box.scrollTo({ top: Math.max(0, top), behavior: reducedMotion() ? 'auto' : 'smooth' });
        } else {
            row.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
        }
        if (!reducedMotion()) once(row, 'is-hit', cssTime('--duration-once', 1600));
        var link = row.querySelector('a, button, [tabindex]');
        if (link) link.focus({ preventScroll: true });
        var pos = '차이 ' + (at + 1) + ' / ' + diffs.length;
        if (out) out.textContent = pos; else announce(pos);
        return row;
    }
    /* [다음 차이] 버튼: data-ds-next-diff="#표 id", 위치 글자: data-ds-diff-pos="#표 id" (선택) */
    document.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-ds-next-diff]');
        if (!b) return;
        var sel = b.getAttribute('data-ds-next-diff');
        var root = b.closest('.ui-compare, .sb-ds') || document;
        var table = root.querySelector(sel) || document.querySelector(sel);
        var out = document.querySelector('[data-ds-diff-pos="' + sel + '"]');
        nextDiff(table, out);
    });

    /* ── 11 되돌리기 토스트 ── */
    var UNDO_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.25"/><path d="M8 4.75v3.5M8 11h.01"/></svg>';
    function region() {
        var r = document.querySelector('.toast-region');
        if (!r) {
            r = document.createElement('div');
            r.className = 'toast-region';
            r.setAttribute('role', 'status');
            document.body.appendChild(r);
        }
        return r;
    }
    function undoToast(opts) {
        opts = opts || {};
        var ms = opts.ms || cssTime('--duration-undo', 5000);
        var t = document.createElement('div');
        t.className = 'toast toast--undo';
        t.innerHTML = '<span class="toast__icon">' + UNDO_ICON + '</span>' +
            '<span class="toast__msg"></span>' +
            '<button type="button" class="btn btn--secondary btn--transparent toast__action">' + (opts.action || '되돌리기') + '</button>' +
            '<span class="toast__timer" aria-hidden="true"></span>';
        t.querySelector('.toast__msg').textContent = opts.message || '삭제되었습니다.';
        t.querySelector('.toast__timer').style.animationDuration = ms + 'ms';
        (opts.region || region()).appendChild(t);

        var left = ms, started = Date.now(), timer = null, closed = false;
        function close(commit) {
            if (closed) return;
            closed = true;
            clearTimeout(timer);
            if (t.parentNode) t.parentNode.removeChild(t);
            if (commit) { if (opts.onCommit) opts.onCommit(); }
            else if (opts.onUndo) opts.onUndo();
        }
        function run() { started = Date.now(); timer = setTimeout(function () { close(true); }, left); }
        function pause() {
            if (closed || t.classList.contains('is-paused')) return;
            clearTimeout(timer);
            left = Math.max(0, left - (Date.now() - started));
            t.classList.add('is-paused');
        }
        function resume() {
            if (closed || !t.classList.contains('is-paused')) return;
            if (t.matches(':hover') || t.contains(document.activeElement)) return;
            t.classList.remove('is-paused');
            run();
        }
        t.addEventListener('mouseenter', pause);
        t.addEventListener('focusin', pause);
        t.addEventListener('mouseleave', resume);
        t.addEventListener('focusout', function () { setTimeout(resume, 0); });
        t.querySelector('.toast__action').addEventListener('click', function () {
            close(false);
            announce(opts.undone || '되돌렸습니다.');
        });
        run();
        return { close: function () { close(true); }, undo: function () { close(false); }, el: t };
    }

    /* ── 10 끌어 순서 바꾸기 ── 목록(ol · ul)이나 표 몸통(tbody)에 data-ds-reorder. 줄마다 손잡이 .reorder-handle */
    function items(list) {
        return Array.prototype.filter.call(list.children, function (c) { return c.querySelector('.reorder-handle'); });
    }
    function nameOf(item) {
        var h = item.querySelector('.reorder-handle');
        var n = item.getAttribute('data-ds-name') || (h && h.getAttribute('data-ds-name'));
        if (!n && h) n = (h.getAttribute('aria-label') || '').replace(/\s*순서 바꾸기$/, '');   /* 손잡이 이름 「○○ 순서 바꾸기」의 ○○ */
        return n || (item.textContent || '').trim().split(/\s+/).slice(0, 2).join(' ');
    }
    /* FLIP — 바꾸기 전 자리를 재고, 바꾼 뒤 그 차이만큼 되돌렸다가 제자리로 */
    function flip(list, mutate, skip) {
        var before = new Map();
        items(list).forEach(function (it) { before.set(it, it.getBoundingClientRect().top); });
        mutate();
        if (reducedMotion() || !Element.prototype.animate) return;
        var dur = cssTime('--duration-base', 200);
        var ease = getComputedStyle(document.documentElement).getPropertyValue('--ease-standard').trim() || 'ease-out';
        items(list).forEach(function (it) {
            if (it === skip || !before.has(it)) return;
            var d = before.get(it) - it.getBoundingClientRect().top;
            if (Math.abs(d) < 1) return;
            it.animate([{ transform: 'translateY(' + d + 'px)' }, { transform: 'none' }], { duration: dur, easing: ease });
        });
    }
    function moved(list, item) {
        var all = items(list);
        var idx = all.indexOf(item) + 1;
        flash(item);
        announce(nameOf(item) + ', ' + all.length + '개 중 ' + idx + '번째로 옮겼습니다.');
        list.dispatchEvent(new CustomEvent('ds-reorder', { bubbles: true, detail: { item: item, index: idx - 1, order: all } }));
    }
    function reorderList(list) {
        if (!list || list.getAttribute('data-ds-reorder-on') === 'on') return;
        list.setAttribute('data-ds-reorder-on', 'on');
        var drag = null;

        list.addEventListener('keydown', function (e) {
            var h = e.target.closest && e.target.closest('.reorder-handle');
            if (!h || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
            var all = items(list);
            var it = all.filter(function (x) { return x.contains(h); })[0];
            if (!it) return;
            e.preventDefault();
            var i = all.indexOf(it);
            var to = e.key === 'ArrowUp' ? i - 1 : i + 1;
            if (to < 0 || to >= all.length) return;
            flip(list, function () {
                if (e.key === 'ArrowUp') list.insertBefore(it, all[to]);
                else list.insertBefore(it, all[to].nextSibling);
            });
            h.focus();
            moved(list, it);
        });

        list.addEventListener('pointerdown', function (e) {
            var h = e.target.closest && e.target.closest('.reorder-handle');
            if (!h || e.button !== 0) return;
            var it = items(list).filter(function (x) { return x.contains(h); })[0];
            if (!it) return;
            e.preventDefault();
            h.setPointerCapture(e.pointerId);
            var line = document.createElement('div');
            line.className = 'reorder-drop';
            line.hidden = true;
            document.body.appendChild(line);
            drag = { it: it, h: h, y0: e.clientY, line: line, to: null };
            it.classList.add('is-dragging');
        });
        list.addEventListener('pointermove', function (e) {
            if (!drag) return;
            drag.it.style.transform = 'translateY(' + (e.clientY - drag.y0) + 'px)';
            var others = items(list).filter(function (x) { return x !== drag.it; });
            if (!others.length) return;
            var idx = others.length;
            for (var i = 0; i < others.length; i++) {
                var r = others[i].getBoundingClientRect();
                if (e.clientY < r.top + r.height / 2) { idx = i; break; }
            }
            drag.to = idx;
            var lr = list.getBoundingClientRect();
            var y = others[idx] ? others[idx].getBoundingClientRect().top - 1 : others[others.length - 1].getBoundingClientRect().bottom + 1;
            drag.line.hidden = false;
            drag.line.style.left = lr.left + 'px';
            drag.line.style.width = lr.width + 'px';
            drag.line.style.top = y + 'px';
        });
        function end() {
            if (!drag) return;
            var d = drag;
            drag = null;
            d.line.parentNode && d.line.parentNode.removeChild(d.line);
            d.it.classList.remove('is-dragging');
            d.it.style.transform = '';
            if (d.to === null) return;
            var others = items(list).filter(function (x) { return x !== d.it; });
            var before = items(list).indexOf(d.it);
            flip(list, function () {
                var ref = others[d.to];
                if (ref) list.insertBefore(d.it, ref);
                else list.insertBefore(d.it, others[others.length - 1].nextSibling);
            }, d.it);
            if (items(list).indexOf(d.it) !== before) moved(list, d.it);
            d.h.focus({ preventScroll: true });
        }
        list.addEventListener('pointerup', end);
        list.addEventListener('pointercancel', end);
    }
    function reorderInit(root) {
        root = root || document;
        var lists = [];
        if (root.matches && root.matches('[data-ds-reorder]')) lists.push(root);
        Array.prototype.push.apply(lists, root.querySelectorAll ? root.querySelectorAll('[data-ds-reorder]') : []);
        lists.forEach(reorderList);
    }

    window.dsMotion = {
        roll: roll,
        flash: flash,
        pop: pop,
        done: done,
        nextDiff: nextDiff,
        undoToast: undoToast,
        reorderInit: reorderInit,
        announce: announce,
        reducedMotion: reducedMotion
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { reorderInit(document); });
    else reorderInit(document);
})();
