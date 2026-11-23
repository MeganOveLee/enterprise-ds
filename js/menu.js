/** 드롭다운 메뉴 .ui-menu (DS-ADR-056): 버튼을 누르면 동작 목록이 열림. 문서 전체에 한 번 걸어 두어 나중에 그린 메뉴도 따로 초기화하지 않음
 * <div class="ui-menu">
 *   <button type="button" class="btn …" aria-haspopup="menu" aria-expanded="false" aria-controls="m1">작업</button>
 *   <div class="ui-menu__list" role="menu" id="m1" hidden>
 *     <button type="button" class="ui-menu__item" role="menuitem" tabindex="-1">개정</button> …
 *   </div>
 * </div>
 * 키보드: 버튼에서 ↓ · Enter · Space = 열고 첫 항목, ↑ = 열고 끝 항목 / 목록에서 ↑↓ · Home · End = 옮김, Esc = 닫고 버튼으로, Tab = 닫음
 * 항목을 누르면 닫히고 포커스는 버튼으로 돌아감. 항목의 동작은 화면 스크립트가 click 으로 받음
 * 시안 B · 찾기와 묶음(DS-ADR-076): 목록에 .ui-menu__search 칸이 있으면 열 때 찾기 칸에 포커스, 글자를 넣으면 맞지 않는 항목 · 묶음 제목 · 구분선을 숨김.
 *   찾기 칸에서 ↓ = 첫 항목, ↑ = 끝 항목, Esc = 닫음. 찾기 칸에서는 Home · End 가 글자 커서를 옮김 */
(function () {
    if (window.dsMenu) return;
    function parts(el) {
        var root = el && el.closest('.ui-menu');
        if (!root) return null;
        var btn = root.querySelector('[aria-haspopup="menu"]');
        var list = root.querySelector('.ui-menu__list');
        return btn && list ? { root: root, btn: btn, list: list } : null;
    }
    function items(list) {
        return [].filter.call(list.querySelectorAll('.ui-menu__item'), function (i) { return i.getAttribute('aria-disabled') !== 'true' && !i.hidden; });
    }
    function open(p, where) {
        closeAll(p.root);
        p.list.hidden = false;
        p.btn.setAttribute('aria-expanded', 'true');
        var q = p.list.querySelector('.ui-menu__search input');
        if (q && where !== 'last') { q.focus(); return; }
        var it = items(p.list);
        if (it.length) (where === 'last' ? it[it.length - 1] : it[0]).focus();
    }
    function close(p, focusBtn) {
        if (p.list.hidden) return;
        p.list.hidden = true;
        p.btn.setAttribute('aria-expanded', 'false');
        var q = p.list.querySelector('.ui-menu__search input');
        if (q && q.value) { q.value = ''; filter(p.list, ''); }
        if (focusBtn) p.btn.focus();
    }
    function filter(list, text) {
        var t = text.trim().toLowerCase(), any = false;
        [].forEach.call(list.querySelectorAll('.ui-menu__item'), function (i) {
            var hit = !t || i.textContent.toLowerCase().indexOf(t) !== -1;
            i.hidden = !hit; if (hit) any = true;
        });
        [].forEach.call(list.querySelectorAll('.ui-menu__group-label, .ui-menu__divider'), function (el) { el.hidden = !!t; });
        var empty = list.querySelector('.ui-menu__empty');
        if (empty) empty.hidden = any;
    }
    document.addEventListener('input', function (e) {
        if (!e.target.closest || !e.target.closest('.ui-menu__search')) return;
        var p = parts(e.target); if (p) filter(p.list, e.target.value);
    });
    function closeAll(except) {
        [].forEach.call(document.querySelectorAll('.ui-menu'), function (r) {
            if (r !== except) { var p = parts(r); if (p) close(p, false); }
        });
    }
    document.addEventListener('click', function (e) {
        var p = parts(e.target);
        if (!p) { closeAll(null); return; }
        if (p.btn.contains(e.target)) { if (p.list.hidden) open(p, 'first'); else close(p, false); return; }
        var it = e.target.closest('.ui-menu__item');
        if (it && it.getAttribute('aria-disabled') !== 'true') close(p, true);
    });
    document.addEventListener('keydown', function (e) {
        var p = parts(e.target);
        if (!p) return;
        if (p.btn.contains(e.target)) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p, 'first'); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); open(p, 'last'); }
            return;
        }
        if (!p.list.contains(e.target)) return;
        var it = items(p.list), i = it.indexOf(document.activeElement);
        if (e.target.closest('.ui-menu__search')) {
            if (e.key === 'ArrowDown' && it.length) { e.preventDefault(); it[0].focus(); }
            else if (e.key === 'ArrowUp' && it.length) { e.preventDefault(); it[it.length - 1].focus(); }
            else if (e.key === 'Escape') { e.preventDefault(); close(p, true); }
            else if (e.key === 'Tab') { close(p, false); }
            return;
        }
        if (!it.length) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); it[(i + 1) % it.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); it[(i - 1 + it.length) % it.length].focus(); }
        else if (e.key === 'Home') { e.preventDefault(); it[0].focus(); }
        else if (e.key === 'End') { e.preventDefault(); it[it.length - 1].focus(); }
        else if (e.key === 'Escape') { e.preventDefault(); close(p, true); }
        else if (e.key === 'Tab') { close(p, false); }
    });
    window.dsMenu = { open: function (el) { var p = parts(el); if (p) open(p, 'first'); }, close: function (el) { var p = parts(el); if (p) close(p, true); } };
})();
