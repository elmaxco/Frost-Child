(function (blocks, element, blockEditor, components, i18n) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var useState = element.useState;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var Button = components.Button;
	var Notice = components.Notice;

	function timesToText(times) {
		if (!Array.isArray(times)) {
			return '';
		}
		return times.join('\n');
	}

	function textToTimes(value) {
		return String(value || '')
			.split(/\r?\n/)
			.map(function (row) {
				return row.trim();
			})
			.filter(Boolean);
	}

	function normalizeTime(value) {
		var input = String(value || '').trim();
		var match = input.match(/^(\d{1,2}):(\d{2})$/);
		if (!match) {
			return '';
		}

		var hour = parseInt(match[1], 10);
		var minute = parseInt(match[2], 10);
		if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
			return '';
		}

		var hourText = String(hour).padStart(2, '0');
		var minuteText = String(minute).padStart(2, '0');
		return hourText + ':' + minuteText;
	}

	blocks.registerBlockType('frost-child/booking-calendar', {
		title: __('Booking Calendar', 'frost-child'),
		icon: 'calendar-alt',
		category: 'widgets',
		description: __('Calendar for selecting a date and booking a time.', 'frost-child'),
		supports: {
			html: false,
			align: ['wide', 'full'],
		},
		attributes: {
			title: { type: 'string', default: 'Prata med Elektriker' },
			badgeText: { type: 'string', default: 'Dryft' },
			meetingLength: { type: 'string', default: '15 min' },
			times: {
				type: 'array',
				default: ['07:45', '08:00', '12:15', '12:30', '13:30'],
			},
			ctaText: { type: 'string', default: 'Boka möte' },
			confirmationText: { type: 'string', default: 'Tack! Din bokning är registrerad.' },
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var newTimeState = useState('');
			var newTime = newTimeState[0];
			var setNewTime = newTimeState[1];
			var blockProps = useBlockProps({ className: 'frost-child-booking-calendar is-editor-preview' });
			var timeList = Array.isArray(attributes.times) ? attributes.times : [];
			var normalizedNewTime = normalizeTime(newTime);
			var firstDate = new Date();
			var dateLabel = firstDate.toLocaleDateString('sv-SE', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __('Booking Calendar', 'frost-child'), initialOpen: true },
						el(TextControl, {
							label: __('Title', 'frost-child'),
							value: attributes.title,
							onChange: function (value) {
								setAttributes({ title: value });
							},
						}),
						el(TextControl, {
							label: __('Badge text', 'frost-child'),
							value: attributes.badgeText,
							onChange: function (value) {
								setAttributes({ badgeText: value });
							},
						}),
						el(TextControl, {
							label: __('Meeting length', 'frost-child'),
							value: attributes.meetingLength,
							onChange: function (value) {
								setAttributes({ meetingLength: value });
							},
						}),
						el(TextareaControl, {
							label: __('Times (one per line)', 'frost-child'),
							help: __('Example: 07:45', 'frost-child'),
							value: timesToText(timeList),
							onChange: function (value) {
								setAttributes({ times: textToTimes(value) });
							},
						}),
						el(TextControl, {
							label: __('Add time (HH:MM)', 'frost-child'),
							placeholder: '09:30',
							value: newTime,
							onChange: function (value) {
								setNewTime(value);
							},
						}),
						el(Button, {
							variant: 'secondary',
							disabled: !normalizedNewTime,
							onClick: function () {
								if (!normalizedNewTime) {
									return;
								}

								var exists = timeList.some(function (time) {
									return String(time).trim() === normalizedNewTime;
								});
								if (exists) {
									setNewTime('');
									return;
								}

								var nextTimes = timeList
									.concat([normalizedNewTime])
									.map(function (time) {
										return String(time).trim();
									})
									.filter(Boolean)
									.sort();

								setAttributes({ times: nextTimes });
								setNewTime('');
							},
						}, __('Add time', 'frost-child')),
						el(TextControl, {
							label: __('Button text', 'frost-child'),
							value: attributes.ctaText,
							onChange: function (value) {
								setAttributes({ ctaText: value });
							},
						}),
						el(TextControl, {
							label: __('Confirmation text', 'frost-child'),
							value: attributes.confirmationText,
							onChange: function (value) {
								setAttributes({ confirmationText: value });
							},
						})
					)
				),
				el(
					'div',
					blockProps,
					el('div', { className: 'frost-child-booking-calendar__calendar' },
						el('div', { className: 'frost-child-booking-calendar__badge' }, attributes.badgeText || 'Dryft'),
						el('h3', { className: 'frost-child-booking-calendar__title' }, attributes.title || __('Prata med Elektriker', 'frost-child')),
						el('p', { className: 'frost-child-booking-calendar__month' }, __('Kalender visas på frontend med månadsvy.', 'frost-child'))
					),
					el('div', { className: 'frost-child-booking-calendar__times' },
						el('p', { className: 'frost-child-booking-calendar__meta-label' }, __('Möteslängd', 'frost-child')),
						el('div', { className: 'frost-child-booking-calendar__meeting-length' }, attributes.meetingLength || '15 min'),
						el('h4', { className: 'frost-child-booking-calendar__times-title' }, __('Vilken tid passar bäst?', 'frost-child')),
						el('p', { className: 'frost-child-booking-calendar__selected-date' }, __('Visar tider för', 'frost-child') + ' ' + dateLabel),
						timeList.length
							? el(
								'div',
								{ className: 'frost-child-booking-calendar__time-list' },
								timeList.slice(0, 5).map(function (time, index) {
									return el(
										'div',
										{ key: index, className: 'frost-child-booking-calendar__time-button is-preview' },
										time
									);
								})
							)
							: el(Notice, { status: 'warning', isDismissible: false }, __('Lägg till minst en tid i sidopanelen.', 'frost-child')),
						el('button', { type: 'button', className: 'frost-child-booking-calendar__book-button', disabled: true }, attributes.ctaText || __('Boka möte', 'frost-child'))
					)
				)
			);
		},

		save: function (props) {
			var attributes = props.attributes;
			var blockProps = blockEditor.useBlockProps.save({ className: 'frost-child-booking-calendar' });
			var times = Array.isArray(attributes.times) ? attributes.times : [];

			return el(
				'div',
				Object.assign({}, blockProps, {
					'data-title': attributes.title || '',
					'data-badge-text': attributes.badgeText || '',
					'data-meeting-length': attributes.meetingLength || '',
					'data-times': JSON.stringify(times),
					'data-cta-text': attributes.ctaText || '',
					'data-confirmation-text': attributes.confirmationText || '',
				}),
				el('div', { className: 'frost-child-booking-calendar__calendar' }),
				el('div', { className: 'frost-child-booking-calendar__times' })
			);
		},
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
