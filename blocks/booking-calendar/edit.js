(function (blocks, element, blockEditor, components, i18n) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
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

	blocks.registerBlockType('frost-child/booking-calendar', {
		title: __('Booking Calendar', 'frost-child'),
		icon: 'calendar-alt',
		category: 'widgets',
		description: __('Kalender för att välja dag och boka en tid.', 'frost-child'),
		supports: {
			html: false,
			align: ['wide', 'full'],
		},
		attributes: {
			title: { type: 'string', default: 'Prata med Elektriker' },
			meetingLength: { type: 'string', default: '15 min' },
			timezoneLabel: { type: 'string', default: 'Koordinerad universell tid+01:00 (Europa/Stockholm)' },
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
			var blockProps = useBlockProps({ className: 'frost-child-booking-calendar is-editor-preview' });
			var timeList = Array.isArray(attributes.times) ? attributes.times : [];
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
						{ title: __('Bokningskalender', 'frost-child'), initialOpen: true },
						el(TextControl, {
							label: __('Rubrik', 'frost-child'),
							value: attributes.title,
							onChange: function (value) {
								setAttributes({ title: value });
							},
						}),
						el(TextControl, {
							label: __('Möteslängd', 'frost-child'),
							value: attributes.meetingLength,
							onChange: function (value) {
								setAttributes({ meetingLength: value });
							},
						}),
						el(TextControl, {
							label: __('Tidszonstext', 'frost-child'),
							value: attributes.timezoneLabel,
							onChange: function (value) {
								setAttributes({ timezoneLabel: value });
							},
						}),
						el(TextareaControl, {
							label: __('Tider (en tid per rad)', 'frost-child'),
							help: __('Exempel: 07:45', 'frost-child'),
							value: timesToText(timeList),
							onChange: function (value) {
								setAttributes({ times: textToTimes(value) });
							},
						}),
						el(TextControl, {
							label: __('Knapptext', 'frost-child'),
							value: attributes.ctaText,
							onChange: function (value) {
								setAttributes({ ctaText: value });
							},
						}),
						el(TextControl, {
							label: __('Bekräftelsetext', 'frost-child'),
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
						el('h3', { className: 'frost-child-booking-calendar__title' }, attributes.title || __('Prata med Elektriker', 'frost-child')),
						el('p', { className: 'frost-child-booking-calendar__month' }, __('Kalender visas på frontend med månadsvy.', 'frost-child'))
					),
					el('div', { className: 'frost-child-booking-calendar__times' },
						el('p', { className: 'frost-child-booking-calendar__meta-label' }, __('Möteslängd', 'frost-child')),
						el('div', { className: 'frost-child-booking-calendar__meeting-length' }, attributes.meetingLength || '15 min'),
						el('h4', { className: 'frost-child-booking-calendar__times-title' }, __('Vilken tid passar bäst?', 'frost-child')),
						el('p', { className: 'frost-child-booking-calendar__selected-date' }, __('Visar tider för', 'frost-child') + ' ' + dateLabel),
						el('p', { className: 'frost-child-booking-calendar__timezone' }, attributes.timezoneLabel || ''),
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
					'data-meeting-length': attributes.meetingLength || '',
					'data-timezone-label': attributes.timezoneLabel || '',
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
