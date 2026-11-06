/* =====================================================================
 * app-bar.js - 큰 제목 앱 상단 바 줄이기 (TD-172)
 * .app-bar--large 는 처음에 제목을 크게 두고, 내용을 내리면 작은 제목(.is-collapsed)으로 줄인다
 * 내려가는 영역 = data-app-bar-scroll 이 가리키는 요소(선택자), 없으면 화면(window)
 * 줄어드는 기준 = 큰 제목 줄의 높이만큼 내려갔을 때. 다시 맨 위로 오면 크게
 * 나중에 그린 막대는 window.dsAppBarInit(영역)
 * ===================================================================== */
(function () {
    'use strict';
    function attach(bar) {
        if (bar.dataset.appBarReady) return;
        bar.dataset.appBarReady = 'true';
        var sel = bar.getAttribute('data-app-bar-scroll');
        var area = sel ? document.querySelector(sel) : null;
        var title = bar.querySelector('.app-bar__title');
        var limit = title ? title.offsetHeight : 0;
        var top = function () { return area ? area.scrollTop : window.scrollY; };
        var redo = function () { bar.classList.toggle('is-collapsed', top() > limit); };
        (area || window).addEventListener('scroll', redo, { passive: true });
        redo();
    }
    function init(root) { Array.prototype.forEach.call((root || document).querySelectorAll('.app-bar--large'), attach); }
    window.dsAppBarInit = init;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
    else init();
})();
