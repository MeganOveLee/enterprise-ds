/* =====================================================================
 * chips.js - 칩 고르기 · 칩 줄 넘침 ◀ ▶ (DS-ADR-049 · 050, TD-172)
 *
 * 고르기 (문서 전체에 한 번 — 나중에 그린 칩도 따로 붙이지 않아도 됨):
 *   - 여럿 고르기 .chip[aria-pressed] — 누르면 켜고 끔
 *   - 하나 고르기 [role="radiogroup"] 안 .chip[role="radio"] — 누르면 그것만 고름. 방향키(← → ↑ ↓) · Home · End 로 옮기며 고름
 *     Tab 은 고른 칩 하나에만 멈춤(나머지 tabindex="-1") — 라디오 묶음과 같은 키보드 규칙
 *   - 바로가기(a · aria-pressed 없는 button)는 건드리지 않음
 *
 * 한 줄 칩 줄(.chip-group--scroll)이 놓인 칸보다 길면 양 끝에 화살표 버튼을 두고 줄을 옆으로 민다.
 * 손가락으로 미는 것과 같은 일을 버튼 한 번 누르기로도 할 수 있게 — 마우스 · 밀기가 어려운 사람도 끝까지 볼 수 있음.
 *
 * 사용:
 *   불러오기만 하면 화면의 .chip-group--scroll 이 모두 대상(tabs.js 와 같은 방식). 이미 붙은 줄은 건너뜀
 *   나중에 그린 줄은 window.dsChipsInit(영역) 으로 직접 붙임
 *
 * 동작 (tabs.js 의 탭 넘침과 같은 규칙):
 *   - 줄을 .chip-scroll 로 감싸고 앞뒤에 아이콘 버튼(.btn--secondary.btn--outlined.btn--icon)을 넣음
 *   - 넘칠 때만 버튼을 보임(.chip-scroll.is-overflow). 끝에 닿은 쪽 버튼은 disabled
 *   - 누르면 보이는 폭의 3/4만큼 밀림. 모션 줄이기 설정이면 바로 이동
 *   - 버튼은 Tab 순서에 넣지 않음(tabindex="-1") — 키보드로 칩에 포커스가 가면 줄이 따라 밀림
 *   - 크기가 바뀌면 다시 잼(ResizeObserver)
 * ===================================================================== */
(function () {
    'use strict';

    var ICON = {
        prev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
        next: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
    };
    var LABEL = { prev: '앞 칩 보기', next: '다음 칩 보기' };

    function reducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    function button(dir) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn btn--secondary btn--outlined btn--icon chip-scroll__btn chip-scroll__btn--' + dir;
        b.setAttribute('aria-label', LABEL[dir]);
        b.tabIndex = -1;
        b.innerHTML = ICON[dir];
        return b;
    }
    function update(wrap, track, prev, next) {
        var max = track.scrollWidth - track.clientWidth;
        var over = max > 1;
        wrap.classList.toggle('is-overflow', over);
        prev.disabled = !over || track.scrollLeft <= 1;
        next.disabled = !over || track.scrollLeft >= max - 1;
    }
    function attach(track) {
        if (track.closest('.chip-scroll')) return;
        var wrap = document.createElement('div');
        wrap.className = 'chip-scroll';
        track.parentNode.insertBefore(wrap, track);
        var prev = button('prev'), next = button('next');
        wrap.appendChild(prev);
        wrap.appendChild(track);
        wrap.appendChild(next);
        var go = function (sign) {
            track.scrollBy({ left: sign * track.clientWidth * 0.75, behavior: reducedMotion() ? 'auto' : 'smooth' });
        };
        prev.addEventListener('click', function () { go(-1); });
        next.addEventListener('click', function () { go(1); });
        var redo = function () { update(wrap, track, prev, next); };
        track.addEventListener('scroll', redo, { passive: true });
        if (window.ResizeObserver) new ResizeObserver(redo).observe(track);
        redo();
    }
    /* ---- 고르기 ---- */
    function radios(group) {
        return Array.prototype.filter.call(group.querySelectorAll('[role="radio"]'), function (r) { return !r.disabled; });
    }
    function check(radio, focus) {
        var group = radio.closest('[role="radiogroup"]');
        if (!group) return;
        radios(group).forEach(function (r) {
            var on = r === radio;
            r.setAttribute('aria-checked', on ? 'true' : 'false');
            r.tabIndex = on ? 0 : -1;
        });
        if (focus) radio.focus();
    }
    document.addEventListener('click', function (e) {
        var chip = e.target.closest && e.target.closest('.chip, .chip-tile');
        if (!chip || chip.disabled) return;
        if (chip.getAttribute('role') === 'radio') { check(chip, false); return; }
        if (chip.hasAttribute('aria-pressed')) chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
    document.addEventListener('keydown', function (e) {
        var radio = e.target.closest && e.target.closest('[role="radiogroup"] [role="radio"]');
        if (!radio) return;
        var list = radios(radio.closest('[role="radiogroup"]')), i = list.indexOf(radio), n = list.length, to = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = (i + 1) % n;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = (i - 1 + n) % n;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = n - 1;
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); check(radio, false); return; }
        if (to < 0) return;
        e.preventDefault();
        check(list[to], true);
    });

    function init(root) {
        Array.prototype.forEach.call((root || document).querySelectorAll('.chip-group--scroll'), attach);
    }
    window.dsChipsInit = init;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
    else init();
})();
