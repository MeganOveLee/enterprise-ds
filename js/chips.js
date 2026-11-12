/* =====================================================================
 * chips.js - 칩 고르기 · 칩 줄 넘침 ◀ ▶ (DS-ADR-049 · 050)
 *
 * 고르기 (문서 전체에 한 번: 나중에 그린 칩도 따로 붙이지 않아도 됨):
 *   - 여럿 고르기 .chip[aria-pressed]: 누르면 켜고 끔
 *   - 하나 고르기 [role="radiogroup"] 안 button[role="radio"]: 칩 · 목록 행 · 나란한 칸(.segmented) 모두. 누르면 그것만 고름
 *     방향키(← → ↑ ↓) · Home · End 로 옮기며 고름. Tab 은 고른 것 하나에만 멈춤(나머지 tabindex="-1"): 라디오 묶음과 같은 키보드 규칙
 *   - 고른 값을 버튼 글자에: <button data-choice-for="묶음 id" data-choice-text="{value} 호출하기">: 고를 때마다
 *     라디오의 data-value 를 {value} 자리에 넣음(확인 창 없이 버튼 글자로 결과를 보여 줌)
 *   - 바로가기(a · aria-pressed 없는 button)는 건드리지 않음
 *
 * 한 줄 칩 줄(.chip-group--scroll)이 놓인 칸보다 길면 양 끝에 화살표 버튼을 두고 줄을 옆으로 민다.
 * 손가락으로 미는 것과 같은 일을 버튼 한 번 누르기로도 할 수 있게: 마우스 · 밀기가 어려운 사람도 끝까지 볼 수 있음.
 *
 * 사용:
 *   불러오기만 하면 화면의 .chip-group--scroll 이 모두 대상(tabs.js 와 같은 방식). 이미 붙은 줄은 건너뜀
 *   나중에 그린 줄은 window.dsChipsInit(영역) 으로 직접 붙임
 *
 * 넘김 시안 (줄에 붙인 클래스로 고름):
 *   기본(추천)          .chip-group--scroll              숨은 칩이 있는 쪽 끝을 흐리고, 그쪽에만 화살표 버튼
 *   끝 흐림             .chip-group--scroll.chip-group--fade   흐림만, 버튼 없음
 *   끝 칩 잘림 + 힌트   .chip-group--scroll.chip-group--peek   흐림 · 버튼 없이 끝 칩이 잘려 보이고, 처음 한 번 살짝 밀렸다 돌아옴
 *
 * 동작:
 *   - 줄을 .chip-scroll(.chip-scroll--arrows · --fade · --peek)로 감쌈. 앞뒤에 숨은 칩이 있으면 .has-prev · .has-next
 *   - 화살표는 보이는 폭의 3/4만큼 밂. 모션 줄이기 설정이면 바로 이동하고, 힌트 움직임은 하지 않음
 *   - 버튼은 Tab 순서에 넣지 않음(tabindex="-1"): 키보드로 칩에 포커스가 가면 줄이 따라 밀림. 밀기와 같은 일을 누르기로(대안)
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
        b.className = 'chip-scroll__btn chip-scroll__btn--' + dir;
        b.setAttribute('aria-label', LABEL[dir]);
        b.tabIndex = -1;
        b.innerHTML = ICON[dir];
        return b;
    }
    function update(wrap, track, prev, next) {
        var max = track.scrollWidth - track.clientWidth;
        var over = max > 1;
        wrap.classList.toggle('is-overflow', over);
        wrap.classList.toggle('has-prev', over && track.scrollLeft > 1);
        wrap.classList.toggle('has-next', over && track.scrollLeft < max - 1);
        if (prev) { prev.hidden = !wrap.classList.contains('has-prev'); next.hidden = !wrap.classList.contains('has-next'); }
    }
    function variant(track) {
        if (track.classList.contains('chip-group--fade')) return 'fade';
        if (track.classList.contains('chip-group--peek')) return 'peek';
        return 'arrows';
    }
    function hint(track) {   // 끝 칩 잘림 시안: 처음 한 번 살짝 밀었다 돌아와 「옆에 더 있다」를 알림
        if (reducedMotion() || track.dataset.hinted || track.scrollWidth - track.clientWidth <= 1) return;
        track.dataset.hinted = 'true';
        var step = parseFloat(getComputedStyle(track).fontSize) * 2.5;
        setTimeout(function () {
            track.scrollTo({ left: step, behavior: 'smooth' });
            setTimeout(function () { track.scrollTo({ left: 0, behavior: 'smooth' }); }, 600);
        }, 400);
    }
    function attach(track) {
        if (track.closest('.chip-scroll')) return;
        var kind = variant(track);
        var wrap = document.createElement('div');
        wrap.className = 'chip-scroll chip-scroll--' + kind;
        track.parentNode.insertBefore(wrap, track);
        var prev = null, next = null;
        if (kind === 'arrows') { prev = button('prev'); next = button('next'); wrap.appendChild(prev); }
        wrap.appendChild(track);
        if (next) wrap.appendChild(next);
        var go = function (sign) {
            track.scrollBy({ left: sign * track.clientWidth * 0.75, behavior: reducedMotion() ? 'auto' : 'smooth' });
        };
        if (prev) { prev.addEventListener('click', function () { go(-1); }); next.addEventListener('click', function () { go(1); }); }
        var redo = function () { update(wrap, track, prev, next); };
        track.addEventListener('scroll', redo, { passive: true });
        if (window.ResizeObserver) new ResizeObserver(redo).observe(track);
        redo();
        if (kind === 'peek') hint(track);
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
        if (group.id && radio.dataset.value) {
            Array.prototype.forEach.call(document.querySelectorAll('[data-choice-for="' + group.id + '"]'), function (b) {
                b.textContent = (b.getAttribute('data-choice-text') || '{value}').replace('{value}', radio.dataset.value);
            });
        }
    }
    document.addEventListener('click', function (e) {
        if (!e.target.closest) return;
        var radio = e.target.closest('[role="radiogroup"] button[role="radio"]');
        if (radio) { if (!radio.disabled) check(radio, false); return; }
        var chip = e.target.closest('.chip[aria-pressed]');
        if (chip && !chip.disabled) chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
    document.addEventListener('keydown', function (e) {
        var radio = e.target.closest && e.target.closest('[role="radiogroup"] button[role="radio"]');
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
