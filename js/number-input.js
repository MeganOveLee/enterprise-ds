/* =====================================================================
 * number-input.js - 숫자 버튼(− 숫자 +)
 * 범위가 넓거나 어른 · 어린이처럼 종류별 수를 셀 때. 선택지가 서넛이면 목록 행이 낫다
 *
 * 마크업:
 *   <div class="number-input" role="group" aria-labelledby="제목 id" data-min="1" data-max="9">
 *     <button type="button" class="number-input__btn" data-step="-1" aria-label="인원 줄이기">svg</button>
 *     <output class="number-input__value" aria-live="polite">1</output><span class="number-input__unit">명</span>
 *     <button type="button" class="number-input__btn" data-step="1" aria-label="인원 늘리기">svg</button>
 *   </div>
 *
 * 동작: 누르면 data-min ~ data-max 안에서 하나씩. 끝에 닿은 버튼은 disabled. 바뀐 값은 화면 읽기 프로그램이 읽음(aria-live)
 *   값이 바뀌면 묶음에 'change' 이벤트(detail.value). 고른 값을 버튼 글자에 넣는 것은 chips.js 의 data-choice-for 와 같은 규칙
 *   (묶음 id 를 data-choice-for 로 가리키고, 값 = 숫자 + 단위)
 * ===================================================================== */
(function () {
    'use strict';
    function parts(box) {
        return { out: box.querySelector('.number-input__value'), unit: box.querySelector('.number-input__unit'), btns: box.querySelectorAll('.number-input__btn') };
    }
    function sync(box) {
        var p = parts(box), v = parseInt(p.out.textContent, 10) || 0;
        var min = parseInt(box.getAttribute('data-min') || '0', 10), max = parseInt(box.getAttribute('data-max') || '99', 10);
        Array.prototype.forEach.call(p.btns, function (b) {
            var step = parseInt(b.getAttribute('data-step'), 10);
            b.disabled = step < 0 ? v <= min : v >= max;
        });
        if (box.id) {
            var text = v + (p.unit ? p.unit.textContent : '');
            Array.prototype.forEach.call(document.querySelectorAll('[data-choice-for="' + box.id + '"]'), function (b) {
                b.textContent = (b.getAttribute('data-choice-text') || '{value}').replace('{value}', text);
            });
        }
        return v;
    }
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.number-input__btn');
        if (!btn || btn.disabled) return;
        var box = btn.closest('.number-input'), p = parts(box);
        p.out.textContent = (parseInt(p.out.textContent, 10) || 0) + parseInt(btn.getAttribute('data-step'), 10);
        var v = sync(box);
        box.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { value: v } }));
        if (btn.disabled) { var other = Array.prototype.filter.call(p.btns, function (b) { return b !== btn; })[0]; if (other) other.focus(); }   // 끝에 닿아 버튼이 꺼지면 포커스를 반대 버튼으로
    });
    function init(root) { Array.prototype.forEach.call((root || document).querySelectorAll('.number-input'), sync); }
    window.dsNumberInputInit = init;
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
    else init();
})();
