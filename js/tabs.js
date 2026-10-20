/* =====================================================================
 * tabs.js - 팝업 탭 넘침 ◀ ▶
 * 상세 창(.pop)의 탭 목록(.tab > ul)이 탭 줄보다 길면 목록 양 끝에 화살표 버튼을 두고 목록을 옆으로 민다.
 *
 * 사용:
 *   불러오기만 하면 화면의 .pop .tab 이 모두 대상(select.js 와 같은 방식). 이미 붙은 탭 줄은 건너뜀
 *   나중에 그린 탭 줄은 window.dsTabsInit(영역) 으로 직접 붙임
 *   탭 선택(누름 · ← → · Home · End)은 화면의 탭 스크립트가 맡는다. 이 스크립트는 보이는 범위만 맞춤
 *
 * Enterprise DS v1.0 (TD-108 28번 — Carbon · Cloudscape Tabs 의 넘침 버튼과 같은 방식)
 *   - 넘칠 때만 버튼을 보임(.tab.is-overflow). 끝에 닿은 쪽 버튼은 disabled. 탭 이름은 한 줄 고정(CSS)
 *   - 버튼 = 아이콘 버튼(.btn--secondary.btn--transparent.btn--icon) · aria-label 「이전 탭 보기」 「다음 탭 보기」.
 *     키보드는 ← →로 탭을 옮기면 목록이 따라 밀리므로 버튼은 Tab 순서에 넣지 않음(tabindex="-1")
 *   - 누르면 목록이 보이는 폭의 3/4만큼 밀림. 모션 줄이기 설정이면 바로 이동
 *   - 선택한 탭(aria-selected="true" · .is-active)과 포커스가 간 탭은 늘 보이게 — 목록 안에서만 밀고 페이지는 움직이지 않음
 *   - 크기가 바뀌면(창 크기 · 탭 추가 · 글꼴 로드) 다시 잼(ResizeObserver · MutationObserver)
 *   - 오른쪽 창 버튼(.tab-actions)은 그대로 탭 줄 오른쪽 끝
 * ===================================================================== */
(function () {
    'use strict';

    var ICON = {
        prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
        next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
    };
    var LABEL = { prev: '이전 탭 보기', next: '다음 탭 보기' };
    var EDGE = 16;   /* 가려진 탭을 보일 때 목록 끝에 남기는 여유 — 다음 탭이 이어진다는 것이 보이게 */

    function reducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function makeButton(dir) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn--secondary btn--transparent btn--icon tab-scroll tab-scroll--' + dir;
        b.setAttribute('aria-label', LABEL[dir]);
        b.tabIndex = -1;
        b.innerHTML = ICON[dir];
        return b;
    }

    function initTabBar(bar) {
        if (!bar || bar.getAttribute('data-ds-tabs') === 'on') return;
        var list = null;
        for (var i = 0; i < bar.children.length; i++) {
            if (bar.children[i].tagName === 'UL' || bar.children[i].getAttribute('role') === 'tablist') { list = bar.children[i]; break; }
        }
        if (!list) return;
        bar.setAttribute('data-ds-tabs', 'on');

        var prev = makeButton('prev');
        var next = makeButton('next');
        bar.insertBefore(prev, list);
        bar.insertBefore(next, list.nextSibling);

        function maxLeft() { return Math.max(0, list.scrollWidth - list.clientWidth); }
        function go(left, instant) {
            left = Math.max(0, Math.min(maxLeft(), left));
            if (typeof list.scrollTo === 'function') list.scrollTo({ left: left, behavior: instant || reducedMotion() ? 'auto' : 'smooth' });
            else list.scrollLeft = left;
        }
        function update() {
            var over = maxLeft() > 1;
            bar.classList.toggle('is-overflow', over);
            prev.disabled = !over || list.scrollLeft <= 1;
            next.disabled = !over || list.scrollLeft >= maxLeft() - 1;
        }
        /* 탭 하나가 목록 보이는 범위 안에 들어오게 — 목록만 밀고 페이지(바깥 스크롤)는 그대로 */
        function reveal(tab, instant) {
            if (!tab || tab.parentNode !== list || maxLeft() <= 1) return;
            var lr = list.getBoundingClientRect();
            var tr = tab.getBoundingClientRect();
            var start = tr.left - lr.left + list.scrollLeft;
            var end = start + tr.width;
            var view = list.clientWidth;
            if (start < list.scrollLeft + EDGE) go(start - EDGE, instant);
            else if (end > list.scrollLeft + view - EDGE) go(end - view + EDGE, instant);
        }
        function selectedTab() {
            return list.querySelector('[aria-selected="true"]') || list.querySelector('.is-active');
        }
        function tabOf(node) {
            while (node && node !== list) {
                if (node.parentNode === list) return node;
                node = node.parentNode;
            }
            return null;
        }

        prev.addEventListener('click', function () { go(list.scrollLeft - list.clientWidth * 0.75); });
        next.addEventListener('click', function () { go(list.scrollLeft + list.clientWidth * 0.75); });

        var queued = false;
        list.addEventListener('scroll', function () {
            if (queued) return;
            queued = true;
            requestAnimationFrame(function () { queued = false; update(); });
        });
        /* 키보드 ← → · Home · End 로 옮긴 탭(포커스가 감) */
        list.addEventListener('focusin', function (e) { reveal(tabOf(e.target)); });

        if (window.MutationObserver) {
            new MutationObserver(function (records) {
                var picked = false, changed = false;
                records.forEach(function (r) { if (r.type === 'attributes') picked = true; else changed = true; });
                if (changed) update();
                if (picked) reveal(selectedTab());
            }).observe(list, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-selected', 'class'] });
        }
        if (window.ResizeObserver) {
            /* 탭 줄 폭이 바뀌면(창 크기 · 처음 화면에 붙을 때) 다시 재고 선택한 탭을 보이게 */
            new ResizeObserver(function () { update(); reveal(selectedTab(), true); }).observe(bar);
            new ResizeObserver(update).observe(list);
        } else {
            window.addEventListener('resize', update);
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);   /* 글꼴이 늦게 와 탭 폭이 바뀌는 경우 */
        update();
        reveal(selectedTab(), true);
    }

    function dsTabsInit(root) {
        root = root || document;
        var bars = [];
        if (root.matches && root.matches('.pop .tab')) bars.push(root);
        Array.prototype.push.apply(bars, root.querySelectorAll ? root.querySelectorAll('.pop .tab') : []);
        bars.forEach(initTabBar);
    }

    window.dsTabsInit = dsTabsInit;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { dsTabsInit(document); });
    else dsTabsInit(document);
})();
