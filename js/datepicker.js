/* =====================================================================
 * datepicker.js - 자체 캘린더 컴포넌트
 * 사용:
 *   .ui-datepicker__input 와 .ui-datepicker__icon 에 자동 attach
 *   외부 클릭 -> 닫힘 / Cancel -> 닫힘 / Apply -> input 값 채우고 닫힘
 * calendar / month / year 디자인 반영.
 *
 * Enterprise DS v1.0 (2026-10-06, DS-ADR-016) — 이전 버전에서 직접 만든 달력에 접근성 · 키보드를 덧붙임
 *   - 팝업 role="dialog" + 날짜표 role="grid", 날짜 칸 aria-selected · aria-current="date" · aria-label("2026년 10월 6일 화요일")
 *   - 키보드(APG date picker dialog): ←→ 하루 · ↑↓ 일주일 · Home/End 주의 처음/끝 · PageUp/Down 한 달(Shift = 1년)
 *     Enter/Space 선택 · Esc 닫고 입력칸으로 · Tab 은 달력 안에서만 돈다
 *   - 입력칸 직접 입력 허용(readonly 해제). 마우스 클릭은 달력을 열되 포커스는 입력칸에 둠.
 *     키보드로 열기 = 달력 아이콘 버튼(Tab 으로 도달) 또는 입력칸에서 Alt+↓
 *   - 고를 수 없는 날짜: input 의 min / max (YYYY-MM-DD). .ui-datepicker-range 안 두 칸은 서로의 min/max 를 자동으로 잡아
 *     기간이 뒤집히지 않게 하고, 그 사이 날짜를 .is-in-range 로 표시
 * ===================================================================== */
(function() {
    'use strict';

    var MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    var WEEKDAYS_KO = ['일','월','화','수','목','금','토'];
    function labelOf(d) { return d.getFullYear() + '년 ' + (d.getMonth()+1) + '월 ' + d.getDate() + '일 ' + WEEKDAYS_KO[d.getDay()] + '요일'; }
    function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
    function addMonths(d, n) {   /* 31일 → 다음 달 말일처럼 넘치면 그 달 마지막 날로 */
        var last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
        return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
    }
    function dayKey(d) { return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate(); }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function formatDate(d) { return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
    function parseDate(s) {
        if (!s) return null;
        var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (!m) return null;
        return new Date(parseInt(m[1],10), parseInt(m[2],10)-1, parseInt(m[3],10));
    }
    function parseTimeParts(s) {
        var m = s && s.match(/[T ](\d{1,2}):(\d{1,2})/);
        return m ? { h: parseInt(m[1],10), min: parseInt(m[2],10) } : { h: 0, min: 0 };
    }
    function formatDateTime(d) { return formatDate(d) + '  ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':00'; }   /* T 대신 공백 2칸 = 읽기 쉽게. save()의 replace("T"," ")는 무해 (세영 2026-08-05) */
    function sameDay(a, b) {
        return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
    }

    function Datepicker(input) {
        this.input = input;
        this.icon = input.parentElement.querySelector('.ui-datepicker__icon');
        var initial = parseDate(input.value);
        this.today = new Date();
        this.viewYear = initial ? initial.getFullYear() : this.today.getFullYear();
        this.viewMonth = initial ? initial.getMonth() : this.today.getMonth();
        this.selectedDate = initial;
        this.tempSelected = initial;   /* Apply 누르기 전 임시 */
        this.hasTime = input.dataset.hasTime === 'true';   /* datetime-local 변환분만 시간 UI */
        var tp = parseTimeParts(input.value);
        this.hour = tp.h; this.minute = tp.min;   /* 24h 내부 저장 */
        this.popup = null;
        this.openDropdown = null;
        this.focusDate = null;   /* 키보드 포커스가 있는 날짜 (roving tabindex) */
        this.dialogId = 'dp-' + (++Datepicker.seq);
        if (this.icon) {
            this.icon.setAttribute('aria-label', '날짜 선택');
            this.icon.setAttribute('aria-haspopup', 'dialog');
            this.icon.setAttribute('aria-expanded', 'false');
            this.icon.tabIndex = 0;   /* 키보드로 달력을 여는 입구 */
        }
        this.bindTrigger();
    }

    Datepicker.seq = 0;

    Datepicker.prototype.bindTrigger = function() {
        var self = this;
        /* 아이콘 = 달력으로 포커스 이동 / 입력칸 클릭 = 달력은 열되 타이핑 계속 */
        if (this.icon) this.icon.addEventListener('click', function(e) { e.stopPropagation(); self.open(true); });
        this.input.addEventListener('click', function(e) { e.stopPropagation(); self.open(false); });
        this.input.addEventListener('keydown', function(e) {
            if (e.altKey && e.key === 'ArrowDown') { e.preventDefault(); self.open(true); }
            else if (e.key === 'Escape' && self.popup) { e.preventDefault(); self.close(); }
        });
        /* 직접 입력 — YYYY-MM-DD 로 읽히면 달력도 그 달로 */
        this.input.addEventListener('input', function() {
            var d = parseDate(self.input.value);
            if (d && self.popup) { self.selectedDate = d; self.tempSelected = d; self.viewYear = d.getFullYear(); self.viewMonth = d.getMonth(); self.render(false); }
        });
        this.input.addEventListener('change', function() { syncRange(self.input); });
    };

    Datepicker.prototype.open = function(moveFocus) {
        if (this.popup) { if (moveFocus) this.focusGrid(); return; }
        var initial = parseDate(this.input.value);
        if (initial) {
            this.viewYear = initial.getFullYear();
            this.viewMonth = initial.getMonth();
            this.selectedDate = initial;
            this.tempSelected = initial;
        } else {
            /* 비어있으면 오늘 기준 view 만 잡고 tempSelected 는 비워둠 */
            this.viewYear = this.today.getFullYear();
            this.viewMonth = this.today.getMonth();
            this.tempSelected = null;
        }
        this.focusDate = this.tempSelected || this.today;
        this.render(moveFocus);
        this.bindOutside();
        if (this.icon) this.icon.setAttribute('aria-expanded', 'true');
    };

    Datepicker.prototype.close = function(returnFocus) {
        if (this.icon) this.icon.setAttribute('aria-expanded', 'false');
        if (this.popup && returnFocus) this.input.focus();   /* Esc · 선택 후 입력칸으로 복귀 */
        if (this.popup) {
            if (this.popup.parentNode) this.popup.parentNode.removeChild(this.popup);
            this.popup = null;
        }
        if (this.outsideHandler) {
            document.removeEventListener('mousedown', this.outsideHandler);
            this.outsideHandler = null;
        }
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler, true);
            window.removeEventListener('resize', this.scrollHandler);
            this.scrollHandler = null;
        }
    };

    Datepicker.prototype.bindOutside = function() {
        var self = this;
        this.outsideHandler = function(e) {
            if (self.popup && !self.popup.contains(e.target) && e.target !== self.input && e.target !== self.icon) {
                self.close();
            }
        };
        /* fixed popup → 스크롤/리사이즈 시 위치 재계산 */
        this.scrollHandler = function() {
            if (!self.input.isConnected) { self.close(); return; }   /* 칸이 화면에서 사라졌으면 달력도 닫음 */
            if (self.popup) self.positionPopup();
        };
        setTimeout(function() {
            document.addEventListener('mousedown', self.outsideHandler);
            window.addEventListener('scroll', self.scrollHandler, true);
            window.addEventListener('resize', self.scrollHandler);
        }, 0);
    };

    /* popup 은 body 에 attach + position:fixed 로 input 좌표에 띄움.
     * wrapper(.ui-datepicker) 가 overflow:hidden 이어도 영향 없음. */
    Datepicker.prototype.positionPopup = function() {
        var rect = this.input.getBoundingClientRect();
        var host = this.input.closest('.ui-datepicker') || this.input;  // 좌측 아이콘 포함 컨테이너 기준으로 좌측 정렬 (세영 2026-07-10)
        var hrect = host.getBoundingClientRect();
        this.popup.style.position = 'fixed';
        // 아래 공간 부족하면 위로 뒤집어 열기(flip-up). 좌우도 화면 안에 물리게 클램프. 크기는 getBoundingClientRect로 = .datepicker의 transform:scale(0.92) 반영된 실측(offsetHeight는 축소전이라 갭 생김) (세영 2026-08-07)
        var prect = this.popup.getBoundingClientRect();
        var ph = prect.height || 320;
        var pw = prect.width || 280;
        var top;
        if ((window.innerHeight - rect.bottom) < (ph + 8) && rect.top > (ph + 8)) {
            top = rect.top - ph - 4;   // 위로 뒤집기
        } else {
            top = rect.bottom + 4;     // 기본(아래)
        }
        var left = hrect.left;
        if (left + pw > window.innerWidth - 8) { left = window.innerWidth - pw - 8; }
        if (left < 8) { left = 8; }
        this.popup.style.top = top + 'px';
        this.popup.style.left = left + 'px';
    };

    Datepicker.prototype.render = function(moveFocus) {
        var hadFocus = this.popup && this.popup.contains(document.activeElement);
        if (this.popup) { this.popup.parentNode.removeChild(this.popup); }
        var popup = document.createElement('div');
        popup.className = 'datepicker is-open';
        popup.id = this.dialogId;
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-modal', 'true');
        popup.setAttribute('aria-label', '날짜 선택');
        popup.innerHTML = this.buildHTML();
        document.body.appendChild(popup);
        this.popup = popup;
        this.positionPopup();
        var self = this;
        requestAnimationFrame(function () { if (self.popup) self.positionPopup(); });   // 최종 렌더 높이로 재배치 → flip-up 시 인풋과 갭 방지 (세영 2026-08-07)
        this.bindEvents();
        if (moveFocus || hadFocus) this.focusGrid();
    };

    Datepicker.prototype.buildHTML = function() {
        var year = this.viewYear, month = this.viewMonth;
        var firstDay = new Date(year, month, 1);
        var lastDay = new Date(year, month + 1, 0);
        var startOffset = (firstDay.getDay() + 6) % 7;   /* Mon 시작 = 0 */
        var daysHTML = '';
        var minD = parseDate(this.input.getAttribute('min')), maxD = parseDate(this.input.getAttribute('max'));
        var rng = rangeOf(this.input);   /* 기간 칸이면 {start, end} */
        var fd = this.focusDate;
        if (!fd || fd.getFullYear() !== year || fd.getMonth() !== month) fd = this.focusDate = (this.tempSelected && this.tempSelected.getFullYear() === year && this.tempSelected.getMonth() === month) ? this.tempSelected : new Date(year, month, 1);
        /* 동적 5주/6주 — 35칸 안에 다 들어가면 5주, 안 되면 6주 */
        var needed = startOffset + lastDay.getDate();
        var totalCells = needed > 35 ? 42 : 35;
        for (var i = 0; i < totalCells; i++) {
            var dayNum = i - startOffset + 1;
            var cellDate, isOutside = false;
            if (dayNum < 1) {
                var prevLast = new Date(year, month, 0).getDate();
                cellDate = new Date(year, month - 1, prevLast + dayNum);
                isOutside = true;
            } else if (dayNum > lastDay.getDate()) {
                cellDate = new Date(year, month + 1, dayNum - lastDay.getDate());
                isOutside = true;
            } else {
                cellDate = new Date(year, month, dayNum);
            }
            var cls = 'datepicker__day';
            var isToday = sameDay(cellDate, this.today), isSel = sameDay(cellDate, this.tempSelected);
            var isDis = (minD && dayKey(cellDate) < dayKey(minD)) || (maxD && dayKey(cellDate) > dayKey(maxD));
            if (isOutside) cls += ' is-outside';
            if (isToday) cls += ' is-today';
            if (isSel) cls += ' is-selected';
            if (isDis) cls += ' is-disabled';
            if (rng && rng.start && rng.end && dayKey(cellDate) > dayKey(rng.start) && dayKey(cellDate) < dayKey(rng.end)) cls += ' is-in-range';
            if (i % 7 === 0) daysHTML += '<div class="datepicker__week" role="row">';
            daysHTML += '<button type="button" role="gridcell" class="' + cls + '"'
                + ' tabindex="' + (sameDay(cellDate, fd) ? '0' : '-1') + '"'
                + ' aria-selected="' + (isSel ? 'true' : 'false') + '"'
                + (isToday ? ' aria-current="date"' : '')
                + (isDis ? ' aria-disabled="true"' : '')
                + ' aria-label="' + labelOf(cellDate) + '"'
                + ' data-year="' + cellDate.getFullYear() + '" data-month="' + cellDate.getMonth() + '" data-day="' + cellDate.getDate() + '">' + cellDate.getDate() + '</button>';
            if (i % 7 === 6) daysHTML += '</div>';
        }
        var weekdaysHTML = WEEKDAYS.map(function(w, i) { return '<div class="datepicker__weekday" role="columnheader" aria-label="' + WEEKDAYS_KO[(i + 1) % 7] + '요일">' + w + '</div>'; }).join('');
        return ''
            + '<div class="datepicker__topbar">'
            +   '<button type="button" class="btn btn--secondary btn--filled datepicker__today-btn" data-act="today">Today</button>'   /* .btn 체계 (DS-ADR-016) */
            + '</div>'
            + '<div class="datepicker__header">'
            +   '<button type="button" class="datepicker__nav" data-act="prev" aria-label="이전 달">'
            +     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
            +   '</button>'
            +   '<div class="datepicker__title-area" id="' + this.dialogId + '-title" aria-live="polite">'
            +     '<button type="button" class="datepicker__month-btn" data-act="month-toggle" aria-haspopup="listbox" aria-expanded="false" aria-label="월 선택, ' + (month + 1) + '월">' + MONTHS_EN[month] + '</button>'
            +     '<button type="button" class="datepicker__year-btn" data-act="year-toggle" aria-haspopup="listbox" aria-expanded="false" aria-label="연도 선택, ' + year + '년">' + year + '</button>'
            +   '</div>'
            +   '<button type="button" class="datepicker__nav" data-act="next" aria-label="다음 달">'
            +     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
            +   '</button>'
            + '</div>'
            + '<div role="grid" aria-labelledby="' + this.dialogId + '-title">'
            +   '<div class="datepicker__weekdays" role="row">' + weekdaysHTML + '</div>'
            +   '<div class="datepicker__grid">' + daysHTML + '</div>'
            + '</div>'
            + (this.hasTime ? this.buildTimeBar() : '');
    };

    /* 시간 줄 = 오전/오후 드롭다운(년/월 버튼과 동일) + 시·분 타이핑 (피그마 보충 · 세영 2026-08-05) */
    Datepicker.prototype.buildTimeBar = function() {
        var h = this.hour || 0;
        var ampm = h < 12 ? '오전' : '오후';
        var h12 = h % 12; if (h12 === 0) h12 = 12;
        return ''
            + '<div class="datepicker__timebar">'
            +   '<button type="button" class="datepicker__ampm-btn" data-act="ampm-toggle">' + ampm + '</button>'
            +   '<input type="text" class="datepicker__time-input" data-part="hour" maxlength="2" value="' + pad(h12) + '">'
            +   '<span class="datepicker__time-colon">:</span>'
            +   '<input type="text" class="datepicker__time-input" data-part="min" maxlength="2" value="' + pad(this.minute || 0) + '">'
            +   '<button type="button" class="datepicker__confirm-btn" data-act="confirm">확인</button>'
            + '</div>';
    };

    /* 선택 날짜+시간을 input 값으로 기록 (datetime = YYYY-MM-DDTHH:mm:ss) */
    Datepicker.prototype.writeValue = function() {
        if (!this.selectedDate) return;
        var d = new Date(this.selectedDate);
        if (this.hasTime) { d.setHours(this.hour || 0, this.minute || 0, 0, 0); this.input.value = formatDateTime(d); }
        else { this.input.value = formatDate(d); }
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    Datepicker.prototype.bindEvents = function() {
        var self = this;
        this.popup.addEventListener('click', function(e) {
            var t = e.target.closest('[data-act]');
            if (t) {
                var act = t.dataset.act;
                if (act === 'prev') { self.viewMonth--; if (self.viewMonth < 0) { self.viewMonth = 11; self.viewYear--; } self.render(); }
                else if (act === 'next') { self.viewMonth++; if (self.viewMonth > 11) { self.viewMonth = 0; self.viewYear++; } self.render(); }
                else if (act === 'today') {
                    self.selectedDate = new Date(self.today);
                    self.tempSelected = self.selectedDate;
                    if (self.hasTime) { self.hour = self.today.getHours(); self.minute = self.today.getMinutes(); self.writeValue(); self.render(); }
                    else { self.input.value = formatDate(self.selectedDate); self.input.dispatchEvent(new Event('change', { bubbles: true })); self.close(true); }
                }
                else if (act === 'month-toggle') { self.openMonthDropdown(t); }
                else if (act === 'year-toggle') { self.openYearDropdown(t); }
                else if (act === 'ampm-toggle') { self.openAmpmDropdown(t); }
                else if (act === 'confirm') { self.writeValue(); self.close(true); }   /* 시간형 달력 완료 = 값 확정 후 달력만 닫기(팝업창은 유지) (세영 2026-08-06) */
                return;
            }
            var dayBtn = e.target.closest('.datepicker__day');
            if (dayBtn && dayBtn.getAttribute('aria-disabled') === 'true') return;
            if (dayBtn) {
                self.selectedDate = new Date(parseInt(dayBtn.dataset.year,10), parseInt(dayBtn.dataset.month,10), parseInt(dayBtn.dataset.day,10));
                self.tempSelected = self.selectedDate;
                /* 시간형이면 시간 세팅 위해 열어둠, 날짜전용이면 즉시 닫기(기존 autoClose) */
                if (self.hasTime) { self.writeValue(); self.render(); }
                else { self.input.value = formatDate(self.selectedDate); self.input.dispatchEvent(new Event('change', { bubbles: true })); self.close(true); }
            }
        });
        this.popup.addEventListener('keydown', function(e) { self.onKeydown(e); });
        /* 시·분 타이핑 → 값 갱신(재렌더 없이 포커스 유지) */
        if (this.hasTime) {
            this.popup.querySelectorAll('.datepicker__time-input').forEach(function(inp) {
                inp.addEventListener('input', function() {
                    var v = inp.value.replace(/[^0-9]/g, ''); inp.value = v;
                    var n = parseInt(v, 10); if (isNaN(n)) return;
                    if (inp.dataset.part === 'hour') {
                        if (n < 1) n = 1; if (n > 12) n = 12;
                        self.hour = (n % 12) + (self.hour >= 12 ? 12 : 0);
                    } else {
                        if (n > 59) n = 59;
                        self.minute = n;
                    }
                    self.writeValue();
                });
                inp.addEventListener('blur', function() {
                    if (inp.dataset.part === 'hour') { var h12 = self.hour % 12; if (h12 === 0) h12 = 12; inp.value = pad(h12); }
                    else { inp.value = pad(self.minute); }
                });
            });
        }
    };

    Datepicker.prototype.focusGrid = function() {
        if (!this.popup) return;
        var cell = this.popup.querySelector('.datepicker__day[tabindex="0"]');
        if (cell) cell.focus();
    };

    Datepicker.prototype.moveFocus = function(d) {
        this.focusDate = d;
        if (d.getFullYear() !== this.viewYear || d.getMonth() !== this.viewMonth) {
            this.viewYear = d.getFullYear(); this.viewMonth = d.getMonth();
            this.render(true);   /* 다른 달로 넘어가면 다시 그리고 같은 날짜로 포커스 */
            return;
        }
        var key = '[data-year="' + d.getFullYear() + '"][data-month="' + d.getMonth() + '"][data-day="' + d.getDate() + '"]';
        var cells = this.popup.querySelectorAll('.datepicker__day');
        var target = this.popup.querySelector('.datepicker__day' + key + ':not(.is-outside)') || this.popup.querySelector('.datepicker__day' + key);
        for (var i = 0; i < cells.length; i++) cells[i].tabIndex = -1;
        if (target) { target.tabIndex = 0; target.focus(); }
    };

    Datepicker.prototype.onKeydown = function(e) {
        var self = this;
        /* 드롭다운이 열려 있으면 그 안에서만 */
        if (this.openDropdown && this.openDropdown.contains(e.target)) {
            var items = Array.prototype.slice.call(this.openDropdown.querySelectorAll('.datepicker__dropdown-item'));
            var idx = items.indexOf(e.target);
            if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[idx]).focus(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); (items[idx - 1] || items[idx]).focus(); }
            else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.closeDropdown(true); }
            else if (e.key === 'Tab') { e.preventDefault(); }
            return;
        }
        if (e.key === 'Escape') { e.preventDefault(); this.close(true); return; }
        if (e.key === 'Tab') {   /* 포커스 가두기 */
            var f = Array.prototype.filter.call(this.popup.querySelectorAll('button, input, [tabindex="0"]'), function(el) { return el.tabIndex >= 0 && !el.disabled; });
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            return;
        }
        var cell = e.target.closest && e.target.closest('.datepicker__day');
        if (!cell) return;
        var d = new Date(+cell.dataset.year, +cell.dataset.month, +cell.dataset.day), n = null;
        var dow = (d.getDay() + 6) % 7;   /* 월요일 시작 */
        switch (e.key) {
            case 'ArrowLeft':  n = addDays(d, -1); break;
            case 'ArrowRight': n = addDays(d, 1); break;
            case 'ArrowUp':    n = addDays(d, -7); break;
            case 'ArrowDown':  n = addDays(d, 7); break;
            case 'Home':       n = addDays(d, -dow); break;
            case 'End':        n = addDays(d, 6 - dow); break;
            case 'PageUp':     n = addMonths(d, e.shiftKey ? -12 : -1); break;
            case 'PageDown':   n = addMonths(d, e.shiftKey ? 12 : 1); break;
            case 'Enter': case ' ': e.preventDefault(); cell.click(); return;
            default: return;
        }
        e.preventDefault();
        self.moveFocus(n);
    };

    Datepicker.prototype.openAmpmDropdown = function(btn) {
        this.closeDropdown();
        var self = this;
        var dd = document.createElement('div');
        dd.className = 'datepicker__dropdown is-open';
        var cur = self.hour < 12 ? '오전' : '오후';
        dd.innerHTML = ['오전','오후'].map(function(o) { return '<button type="button" role="option" aria-selected="' + (o === cur) + '" class="datepicker__dropdown-item ' + (o === cur ? 'is-selected' : '') + '" data-ampm="' + o + '">' + o + '</button>'; }).join('');
        this.popup.appendChild(dd);
        var rect = btn.getBoundingClientRect();
        var popupRect = this.popup.getBoundingClientRect();
        dd.style.top = (rect.bottom - popupRect.top + 4) + 'px';
        dd.style.left = (rect.left - popupRect.left) + 'px';
        this.openDropdown = dd; this.afterDropdown(dd, btn);
        dd.addEventListener('click', function(e) {
            var item = e.target.closest('[data-ampm]');
            if (item) {
                var wantPm = item.dataset.ampm === '오후';
                if (wantPm !== (self.hour >= 12)) { self.hour = (self.hour + 12) % 24; }
                self.closeDropdown(); self.writeValue(); self.render();
            }
        });
    };

    /* 드롭다운: listbox + 열리면 선택 항목으로 포커스, ↑↓ 이동, Esc 는 드롭다운만 닫고 버튼으로 */
    Datepicker.prototype.afterDropdown = function(dd, btn) {
        dd.setAttribute('role', 'listbox');
        btn.setAttribute('aria-expanded', 'true');
        this.dropdownBtn = btn;
        var sel = dd.querySelector('.is-selected') || dd.querySelector('.datepicker__dropdown-item');
        if (sel) { sel.focus(); if (sel.scrollIntoView) sel.scrollIntoView({ block: 'nearest' }); }
    };

    Datepicker.prototype.closeDropdown = function(returnFocus) {
        if (this.dropdownBtn) { this.dropdownBtn.setAttribute('aria-expanded', 'false'); if (returnFocus) this.dropdownBtn.focus(); this.dropdownBtn = null; }
        if (this.openDropdown) {
            this.openDropdown.parentNode.removeChild(this.openDropdown);
            this.openDropdown = null;
        }
    };

    Datepicker.prototype.openMonthDropdown = function(btn) {
        this.closeDropdown();
        var self = this;
        var dd = document.createElement('div');
        dd.className = 'datepicker__dropdown is-open';
        var html = '';
        for (var i = 0; i < 12; i++) {
            html += '<button type="button" role="option" aria-selected="' + (i === self.viewMonth) + '" class="datepicker__dropdown-item ' + (i === self.viewMonth ? 'is-selected' : '') + '" data-m="' + i + '">' + MONTHS_EN[i] + '</button>';
        }
        dd.innerHTML = html;
        this.popup.appendChild(dd);
        var rect = btn.getBoundingClientRect();
        var popupRect = this.popup.getBoundingClientRect();
        dd.style.top = (rect.bottom - popupRect.top + 4) + 'px';
        dd.style.left = (rect.left - popupRect.left) + 'px';
        this.openDropdown = dd; this.afterDropdown(dd, btn);
        dd.addEventListener('click', function(e) {
            var item = e.target.closest('[data-m]');
            if (item) { self.viewMonth = parseInt(item.dataset.m, 10); self.focusDate = null; self.closeDropdown(); self.render(true); }
        });
    };

    Datepicker.prototype.openYearDropdown = function(btn) {
        this.closeDropdown();
        var self = this;
        var dd = document.createElement('div');
        dd.className = 'datepicker__dropdown is-open';
        var startYear = self.viewYear - 6;
        var html = '';
        for (var y = startYear; y < startYear + 12; y++) {
            html += '<button type="button" role="option" aria-selected="' + (y === self.viewYear) + '" class="datepicker__dropdown-item ' + (y === self.viewYear ? 'is-selected' : '') + '" data-y="' + y + '">' + y + '</button>';
        }
        dd.innerHTML = html;
        this.popup.appendChild(dd);
        var rect = btn.getBoundingClientRect();
        var popupRect = this.popup.getBoundingClientRect();
        dd.style.top = (rect.bottom - popupRect.top + 4) + 'px';
        dd.style.left = (rect.left - popupRect.left) + 'px';
        this.openDropdown = dd; this.afterDropdown(dd, btn);
        dd.addEventListener('click', function(e) {
            var item = e.target.closest('[data-y]');
            if (item) { self.viewYear = parseInt(item.dataset.y, 10); self.focusDate = null; self.closeDropdown(); self.render(true); }
        });
    };

    /* 네이티브 <input type="date" class="typeDate"> → ui-datepicker 위젯 마크업으로 자동 변환.
     * customselect.js / input.js 와 동일 패턴 (JSP 무수정, class 이름만으로 전역 적용).
     * value 는 YYYY-MM-DD 유지 → 백엔드 name/id 그대로라 검색 파라미터 호환. */
    var CAL_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';

    function convertNativeDates() {
        /* 검색폼(.mainTable) native date + 팝업(.pop) native datetime-local 변환.
         * datetime-local → hasTime 플래그로 시간 UI 활성. (등록/수정 폼·그리드는 스코프 밖) */
        var list = [];
        document.querySelectorAll('.mainTable input[type="date"]').forEach(function(i) { list.push(i); });
        document.querySelectorAll('.pop input[type="datetime-local"]').forEach(function(i) { list.push(i); });
        list.forEach(function(input) {
            if (input._converted) return;
            input._converted = true;
            var isDateTime = input.getAttribute('type') === 'datetime-local';

            var wrap = document.createElement('div');
            wrap.className = 'ui-datepicker';

            var icon = document.createElement('button');
            icon.type = 'button';
            icon.className = 'ui-datepicker__icon';
            icon.innerHTML = CAL_ICON;   /* tabindex · aria 는 Datepicker 생성자에서 */

            /* input 자리에 wrap 삽입 후, wrap 안으로 아이콘+input 이동 */
            input.parentNode.insertBefore(wrap, input);
            input.setAttribute('type', 'text');
            /* readonly 해제 — 직접 입력 허용 (명세 4항). placeholder 가 형식을 알려줌 */
            input.setAttribute('inputmode', 'numeric');
            input.classList.remove('typeDate', 'w100');
            input.classList.add('ui-datepicker__input');
            if (isDateTime) { input.dataset.hasTime = 'true'; if (input.value) input.value = input.value.replace('T', '  '); if (!input.placeholder) input.placeholder = 'YYYY-MM-DD --:--'; }
            else if (!input.placeholder) input.placeholder = 'YYYY-MM-DD';

            wrap.appendChild(icon);
            wrap.appendChild(input);
        });
    }

    /* 기간(.ui-datepicker-range) — 두 칸이 서로 min/max 를 잡아 기간이 뒤집히지 않게 */
    function rangeInputs(input) {
        var r = input.closest && input.closest('.ui-datepicker-range');
        if (!r) return null;
        var list = r.querySelectorAll('.ui-datepicker__input');
        return list.length === 2 ? list : null;
    }
    function rangeOf(input) {
        var l = rangeInputs(input);
        return l ? { start: parseDate(l[0].value), end: parseDate(l[1].value) } : null;
    }
    function syncRange(input) {
        var l = rangeInputs(input);
        if (!l) return;
        if (l[0].value) l[1].setAttribute('min', l[0].value.slice(0, 10)); else l[1].removeAttribute('min');
        if (l[1].value) l[0].setAttribute('max', l[1].value.slice(0, 10)); else l[0].removeAttribute('max');
    }

    /* 만든 달력 목록 — 칸이 DOM에서 빠지면(부분 갱신 · 팝업 닫힘 · Storybook 스토리 전환) 열린 달력을 닫고 목록에서 뺀다 */
    var instances = [];
    function cleanup() {
        instances = instances.filter(function(dp) {
            if (dp.input.isConnected) return true;
            dp.close();
            return false;
        });
    }

    function init() {
        cleanup();
        convertNativeDates();
        document.querySelectorAll('.ui-datepicker__input').forEach(function(input) {
            if (input._datepicker) return;
            input._datepicker = new Datepicker(input);
            instances.push(input._datepicker);
            syncRange(input);
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    window.Datepicker = Datepicker;
    window.datepickerInit = init;
    window.datepickerCleanup = cleanup;
})();
