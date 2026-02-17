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

	function initBlock(block) {
		if (!block || block.dataset.bookingCalendarBound === '1') {
			return;
		}
		block.dataset.bookingCalendarBound = '1';

		const title = block.dataset.title || 'Prata med Elektriker';
		const meetingLength = block.dataset.meetingLength || '15 min';
		const timezoneLabel = block.dataset.timezoneLabel || '';
		const times = parseTimes(block.dataset.times);
		const ctaText = block.dataset.ctaText || 'Boka möte';
		const confirmationText = block.dataset.confirmationText || 'Tack! Din bokning är registrerad.';

		const calendarRoot = block.querySelector('.frost-child-booking-calendar__calendar');
		const timesRoot = block.querySelector('.frost-child-booking-calendar__times');
		if (!calendarRoot || !timesRoot) {
			return;
		}

		const today = new Date();
		let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
		let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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

			const timezoneEl = document.createElement('p');
			timezoneEl.className = 'frost-child-booking-calendar__timezone';
			timezoneEl.textContent = timezoneLabel;

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
			timesRoot.appendChild(timezoneEl);
			timesRoot.appendChild(list);
			timesRoot.appendChild(cta);
			timesRoot.appendChild(confirmation);
		}

		function renderCalendar() {
			calendarRoot.innerHTML = '';

			const heading = document.createElement('h2');
			heading.className = 'frost-child-booking-calendar__title';
			heading.textContent = title;

			const monthWrap = document.createElement('div');
			monthWrap.className = 'frost-child-booking-calendar__month-wrap';

			const prev = document.createElement('button');
			prev.type = 'button';
			prev.className = 'frost-child-booking-calendar__month-nav';
			prev.setAttribute('aria-label', 'Föregående månad');
			prev.textContent = '‹';

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
				if (sameDate(cellDate, selectedDate)) {
					dayBtn.classList.add('is-selected');
				}

				dayBtn.addEventListener('click', () => {
					selectedDate = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
					selectedTime = '';
					renderCalendar();
					renderTimesPanel();
				});

				daysGrid.appendChild(dayBtn);
			});

			prev.addEventListener('click', () => {
				visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
				renderCalendar();
			});

			next.addEventListener('click', () => {
				visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
				renderCalendar();
			});

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
