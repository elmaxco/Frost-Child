(() => {
	const SELECTOR = '.frost-child-booking-calendar';
	const WEEKDAYS = ['MÅN', 'TIS', 'ONS', 'TOR', 'FRE', 'LÖR', 'SÖN'];

	function parseTimes(raw) {
		if (!raw) {
			return [];
		}
		try {
			const parsed = JSON.parse(raw);
			if (!Array.isArray(parsed)) {
				return [];
			}
			return parsed
				.map((item) => String(item || '').trim())
				.filter(Boolean);
		} catch (error) {
			return [];
		}
	}

	function toMonthLabel(date) {
		const formatted = date.toLocaleDateString('sv-SE', {
			year: 'numeric',
			month: 'long',
		});
		return formatted.charAt(0).toUpperCase() + formatted.slice(1);
	}

	function toLongDate(date) {
		return date.toLocaleDateString('sv-SE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}

	function dayIndexMondayFirst(date) {
		return (date.getDay() + 6) % 7;
	}

	function buildMonthGrid(year, month) {
		const firstOfMonth = new Date(year, month, 1);
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const prefix = dayIndexMondayFirst(firstOfMonth);
		const cells = [];

		for (let i = 0; i < prefix; i += 1) {
			cells.push(null);
		}
		for (let day = 1; day <= daysInMonth; day += 1) {
			cells.push(new Date(year, month, day));
		}
		while (cells.length % 7 !== 0) {
			cells.push(null);
		}
		return cells;
	}

	function sameDate(left, right) {
		return (
			left.getFullYear() === right.getFullYear() &&
			left.getMonth() === right.getMonth() &&
			left.getDate() === right.getDate()
		);
	}

	function startOfDay(date) {
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	}

	function easterSunday(year) {
		const a = year % 19;
		const b = Math.floor(year / 100);
		const c = year % 100;
		const d = Math.floor(b / 4);
		const e = b % 4;
		const f = Math.floor((b + 8) / 25);
		const g = Math.floor((b - f + 1) / 3);
		const h = (19 * a + b - d - g + 15) % 30;
		const i = Math.floor(c / 4);
		const k = c % 4;
		const l = (32 + 2 * e + 2 * i - h - k) % 7;
		const m = Math.floor((a + 11 * h + 22 * l) / 451);
		const month = Math.floor((h + l - 7 * m + 114) / 31);
		const day = ((h + l - 7 * m + 114) % 31) + 1;
		return new Date(year, month - 1, day);
	}

	function addDays(date, days) {
		const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		copy.setDate(copy.getDate() + days);
		return copy;
	}

	function toDateKey(date) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function swedishHolidayKeys(year) {
		const easter = easterSunday(year);
		const midsummerEve = (() => {
			for (let day = 19; day <= 25; day += 1) {
				const candidate = new Date(year, 5, day);
				if (candidate.getDay() === 5) {
					return candidate;
				}
			}
			return new Date(year, 5, 20);
		})();
		const allSaintsDay = (() => {
			for (let day = 31; day <= 37; day += 1) {
				const candidate = new Date(year, 9, day);
				if (candidate.getDay() === 6) {
					return candidate;
				}
			}
			return new Date(year, 10, 1);
		})();

		const holidays = [
			new Date(year, 0, 1),
			new Date(year, 0, 6),
			addDays(easter, -2),
			addDays(easter, -1),
			easter,
			addDays(easter, 1),
			new Date(year, 4, 1),
			addDays(easter, 39),
			addDays(easter, 49),
			new Date(year, 5, 6),
			midsummerEve,
			addDays(midsummerEve, 1),
			allSaintsDay,
			new Date(year, 11, 24),
			new Date(year, 11, 25),
			new Date(year, 11, 26),
			new Date(year, 11, 31),
		];

		return new Set(holidays.map(toDateKey));
	}

	function isWeekend(date) {
		const day = date.getDay();
		return day === 0 || day === 6;
	}

	function isHoliday(date, cache) {
		const year = date.getFullYear();
		if (!cache[year]) {
			cache[year] = swedishHolidayKeys(year);
		}
		return cache[year].has(toDateKey(date));
	}

	function isBlockedDate(date, today, holidayCache) {
		const normalized = startOfDay(date);
		if (normalized < today) {
			return true;
		}
		if (isWeekend(normalized)) {
			return true;
		}
		if (isHoliday(normalized, holidayCache)) {
			return true;
		}
		return false;
	}

	function findNextAvailableDate(fromDate, today, holidayCache) {
		let candidate = startOfDay(fromDate);
		for (let i = 0; i < 400; i += 1) {
			if (!isBlockedDate(candidate, today, holidayCache)) {
				return candidate;
			}
			candidate = addDays(candidate, 1);
		}
		return startOfDay(today);
	}

	function initBlock(block) {
		if (!block || block.dataset.bookingCalendarBound === '1') {
			return;
		}
		block.dataset.bookingCalendarBound = '1';

		const title = block.dataset.title || 'Prata med Elektriker';
		const badgeText = block.dataset.badgeText || 'Dryft';
		const meetingLength = block.dataset.meetingLength || '15 min';
		const times = parseTimes(block.dataset.times);
		const ctaText = block.dataset.ctaText || 'Boka möte';
		const confirmationText = block.dataset.confirmationText || 'Tack! Din bokning är registrerad.';

		const calendarRoot = block.querySelector('.frost-child-booking-calendar__calendar');
		const timesRoot = block.querySelector('.frost-child-booking-calendar__times');
		if (!calendarRoot || !timesRoot) {
			return;
		}

		const today = startOfDay(new Date());
		const minVisibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		const holidayCache = {};
		let selectedDate = findNextAvailableDate(today, today, holidayCache);
		let visibleMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
		let selectedTime = '';

		function renderTimesPanel() {
			timesRoot.innerHTML = '';

			const metaLabel = document.createElement('p');
			metaLabel.className = 'frost-child-booking-calendar__meta-label';
			metaLabel.textContent = 'Möteslängd';

			const meeting = document.createElement('div');
			meeting.className = 'frost-child-booking-calendar__meeting-length';
			meeting.textContent = meetingLength;

			const titleEl = document.createElement('h3');
			titleEl.className = 'frost-child-booking-calendar__times-title';
			titleEl.textContent = 'Vilken tid passar bäst?';

			const selectedDateEl = document.createElement('p');
			selectedDateEl.className = 'frost-child-booking-calendar__selected-date';
			selectedDateEl.textContent = 'Visar tider för ' + toLongDate(selectedDate);

			const list = document.createElement('div');
			list.className = 'frost-child-booking-calendar__time-list';

			times.forEach((time) => {
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'frost-child-booking-calendar__time-button';
				btn.textContent = time;
				if (time === selectedTime) {
					btn.classList.add('is-selected');
				}
				btn.addEventListener('click', () => {
					selectedTime = time;
					renderTimesPanel();
				});
				list.appendChild(btn);
			});

			if (!times.length) {
				const empty = document.createElement('p');
				empty.textContent = 'Inga tider tillgängliga.';
				list.appendChild(empty);
			}

			const cta = document.createElement('button');
			cta.type = 'button';
			cta.className = 'frost-child-booking-calendar__book-button';
			cta.textContent = ctaText;
			cta.disabled = !selectedTime;

			const confirmation = document.createElement('div');
			confirmation.className = 'frost-child-booking-calendar__confirmation';

			cta.addEventListener('click', () => {
				if (!selectedTime) {
					return;
				}
				confirmation.textContent = confirmationText + ' (' + toLongDate(selectedDate) + ' ' + selectedTime + ')';
				block.dispatchEvent(
					new CustomEvent('frostChildBookingSubmit', {
						detail: {
							date: selectedDate.toISOString().slice(0, 10),
							time: selectedTime,
							dateLabel: toLongDate(selectedDate),
						},
					})
				);
			});

			timesRoot.appendChild(metaLabel);
			timesRoot.appendChild(meeting);
			timesRoot.appendChild(titleEl);
			timesRoot.appendChild(selectedDateEl);
			timesRoot.appendChild(list);
			timesRoot.appendChild(cta);
			timesRoot.appendChild(confirmation);
		}

		function renderCalendar() {
			calendarRoot.innerHTML = '';

			const heading = document.createElement('h2');
			heading.className = 'frost-child-booking-calendar__title';
			heading.textContent = title;

			const badge = document.createElement('div');
			badge.className = 'frost-child-booking-calendar__badge';
			badge.textContent = badgeText;

			const monthWrap = document.createElement('div');
			monthWrap.className = 'frost-child-booking-calendar__month-wrap';

			const prev = document.createElement('button');
			prev.type = 'button';
			prev.className = 'frost-child-booking-calendar__month-nav';
			prev.setAttribute('aria-label', 'Föregående månad');
			prev.textContent = '‹';
			if (visibleMonth <= minVisibleMonth) {
				prev.disabled = true;
				prev.setAttribute('aria-disabled', 'true');
			}

			const month = document.createElement('p');
			month.className = 'frost-child-booking-calendar__month';
			month.textContent = toMonthLabel(visibleMonth);

			const next = document.createElement('button');
			next.type = 'button';
			next.className = 'frost-child-booking-calendar__month-nav';
			next.setAttribute('aria-label', 'Nästa månad');
			next.textContent = '›';

			monthWrap.appendChild(prev);
			monthWrap.appendChild(month);
			monthWrap.appendChild(next);

			const weekdays = document.createElement('div');
			weekdays.className = 'frost-child-booking-calendar__weekdays';
			WEEKDAYS.forEach((weekday) => {
				const item = document.createElement('div');
				item.className = 'frost-child-booking-calendar__weekday';
				item.textContent = weekday;
				weekdays.appendChild(item);
			});

			const daysGrid = document.createElement('div');
			daysGrid.className = 'frost-child-booking-calendar__days';

			const cells = buildMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth());
			cells.forEach((cellDate) => {
				const dayBtn = document.createElement('button');
				dayBtn.type = 'button';
				dayBtn.className = 'frost-child-booking-calendar__day';

				if (!cellDate) {
					dayBtn.disabled = true;
					daysGrid.appendChild(dayBtn);
					return;
				}

				dayBtn.textContent = String(cellDate.getDate());
				const blocked = isBlockedDate(cellDate, today, holidayCache);
				if (blocked) {
					dayBtn.disabled = true;
					dayBtn.setAttribute('aria-disabled', 'true');
				}
				if (sameDate(cellDate, selectedDate)) {
					dayBtn.classList.add('is-selected');
				}

				dayBtn.addEventListener('click', () => {
					if (blocked) {
						return;
					}
					selectedDate = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
					selectedTime = '';
					renderCalendar();
					renderTimesPanel();
				});

				daysGrid.appendChild(dayBtn);
			});

			prev.addEventListener('click', () => {
				if (visibleMonth <= minVisibleMonth) {
					return;
				}
				visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
				renderCalendar();
			});

			next.addEventListener('click', () => {
				visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
				renderCalendar();
			});

			calendarRoot.appendChild(badge);
			calendarRoot.appendChild(heading);
			calendarRoot.appendChild(monthWrap);
			calendarRoot.appendChild(weekdays);
			calendarRoot.appendChild(daysGrid);
		}

		renderCalendar();
		renderTimesPanel();
	}

	function init() {
		const blocks = Array.from(document.querySelectorAll(SELECTOR));
		blocks.forEach(initBlock);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
