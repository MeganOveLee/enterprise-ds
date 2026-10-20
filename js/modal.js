/* =====================================================================
 * modal.js - 확인 창(.modal) 열기 · 닫기 · 포커스 가두기 · Esc
 * 같은 페이지 위에 뜨는 확인 창을 연다. 열린 동안 Tab 은 창 안에서만 돌고, Esc 는 취소,
 * 닫으면 창을 연 버튼으로 포커스가 돌아간다 (WAI-ARIA APG Dialog (Modal) 패턴, TD-108).
 *
 * 마크업 (모양은 components.css 「확인 창 — Modal」):
 *   <div class="modal" id="unsaved-modal" hidden>
 *     <div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="unsaved-modal-title" aria-describedby="unsaved-modal-desc"> … </div>
 *   </div>
 *
 * 사용:
 *   여는 버튼   data-modal-open="창 id" — 누르면 연다. 화면 스크립트에서는 window.modalOpen(창 또는 창 id, 연 요소)
 *               저장하지 않고 나가기 창은 바뀐 내용이 있을 때만 화면 스크립트가 연다
 *   닫는 버튼   data-modal-close="값" — 누르면 닫고, 창(.modal)에서 'modal:close' 이벤트를 보낸다(e.detail.action = 값)
 *               저장하지 않고 나가기: discard(저장 안 함) · cancel(취소) · save(저장)
 *   Esc · 닫기(X) = cancel. 덮개를 눌러도 닫지 않는다 — 답을 골라야 하는 창이라 바깥을 잘못 눌러 선택이 지나가지 않게
 *   열 때 포커스 = data-modal-initial 이 붙은 버튼(확인 창에서는 안전한 [취소]). 없으면 창 안 첫 버튼, 그것도 없으면 창 자체
 *   window.modalClose(창 또는 창 id, 값) — 화면 스크립트에서 닫기
 *
 * 창 마크업은 <body> 바로 아래에 두는 것을 권장한다(position: fixed 가 화면 전체를 덮도록).
 * 문서 견본처럼 transform 이 있는 틀 안에 두면 그 틀 안만 덮는다.
 * ===================================================================== */
(function () {
    'use strict';

    var FOCUSABLE = 'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [contenteditable="true"], [tabindex]:not([tabindex="-1"])';
    var stack = [];   // 열린 창 — 마지막이 맨 위

    function resolve(m) {
        if (typeof m === 'string') m = document.getElementById(m);
        if (!m) return null;
        if (!m.classList.contains('modal')) m = m.closest('.modal');
        return m;
    }
    function dialogOf(m) { return m.querySelector('.modal__dialog') || m; }
    function visible(el) { return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length); }
    function focusables(m) {
        return Array.prototype.filter.call(dialogOf(m).querySelectorAll(FOCUSABLE), function (el) {
            return visible(el) && !el.closest('[hidden], [inert]');
        });
    }
    function top() { return stack[stack.length - 1] || null; }

    function open(m, opener) {
        m = resolve(m);
        if (!m || stack.indexOf(m) !== -1) return;
        m._modalOpener = opener || document.activeElement;
        m.hidden = false;
        stack.push(m);
        var dlg = dialogOf(m);
        // 창 자체도 포커스를 받을 수 있게 — 창 안 빈 곳을 눌러도 포커스가 창 밖(body)으로 빠지지 않음
        if (!dlg.hasAttribute('tabindex')) dlg.setAttribute('tabindex', '-1');
        (dlg.querySelector('[data-modal-initial]') || focusables(m)[0] || dlg).focus();
        m.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
    }

    function close(m, action) {
        m = resolve(m);
        if (!m) return;
        var i = stack.indexOf(m);
        if (i === -1) return;
        stack.splice(i, 1);
        m.hidden = true;
        var opener = m._modalOpener;
        m._modalOpener = null;
        // 연 버튼이 아직 화면에 있으면 그리로 — 화면 스크립트가 이벤트 처리 중 창을 다시 그려도 포커스가 body 로 빠지지 않게 먼저 옮김
        if (opener && opener.focus && document.contains(opener)) opener.focus();
        m.dispatchEvent(new CustomEvent('modal:close', { bubbles: true, detail: { action: action || 'cancel' } }));
    }

    // 여는 버튼 · 닫는 버튼 — 나중에 그린 마크업에도 걸리도록 문서에 한 번
    document.addEventListener('click', function (e) {
        var t = e.target.closest ? e.target : e.target.parentElement;
        if (!t) return;
        var opener = t.closest('[data-modal-open]');
        if (opener) { e.preventDefault(); open(opener.getAttribute('data-modal-open'), opener); return; }
        var closer = t.closest('[data-modal-close]');
        if (closer) {
            var m = closer.closest('.modal');
            if (m && stack.indexOf(m) !== -1) close(m, closer.getAttribute('data-modal-close') || 'cancel');
        }
    });

    // Esc = 취소 · Tab 가두기 — 맨 위 창에만
    document.addEventListener('keydown', function (e) {
        var m = top();
        if (!m) return;
        if (e.key === 'Escape' || e.key === 'Esc') {
            // 창 안 선택 목록 · 달력이 열려 있으면 그쪽이 먼저 Esc 를 받는다(그 스크립트가 기본 동작을 막음)
            if (e.defaultPrevented) return;
            e.preventDefault();
            close(m, 'cancel');
            return;
        }
        if (e.key !== 'Tab') return;
        var list = focusables(m);
        if (!list.length) { e.preventDefault(); dialogOf(m).focus(); return; }
        var dlg = dialogOf(m), first = list[0], last = list[list.length - 1], cur = document.activeElement;
        var inside = dlg.contains(cur);
        if (e.shiftKey && (cur === first || cur === dlg || !inside)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (cur === last || !inside)) { e.preventDefault(); first.focus(); }
    });

    // 덮개를 눌러도 포커스가 창 안에 남게 — 누른 곳이 포커스를 받지 않는 덮개면 포커스 이동을 막음
    document.addEventListener('mousedown', function (e) {
        var m = top();
        if (m && m.contains(e.target) && !dialogOf(m).contains(e.target)) e.preventDefault();
    });

    // 창 밖으로 포커스가 나가면(스크립트 · 마우스) 창 안으로 되돌림
    document.addEventListener('focusin', function (e) {
        var m = top();
        if (!m || m.contains(e.target)) return;
        // 창 안에서 연 선택 목록 · 달력은 body 로 옮겨져 창 밖에 있음 — 그쪽 포커스는 그대로
        if (e.target.closest && e.target.closest('.ui-select__menu, .datepicker, .checkSelect')) return;
        var list = focusables(m);
        (list[0] || dialogOf(m)).focus();
    });

    window.modalOpen = open;
    window.modalClose = close;
})();
