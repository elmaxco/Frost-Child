(function (blocks, element, blockEditor, components, i18n) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var RangeControl = components.RangeControl;

	var LETTERS = [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F',
		'G',
		'H',
		'I',
		'J',
		'K',
		'L',
		'M',
		'N',
		'O',
		'P',
		'Q',
		'R',
		'S',
		'T',
		'U',
		'V',
		'W',
		'X',
		'Y',
		'Z',
		'Å',
		'Ä',
		'Ö',
	];

	function renderLetters(allLabel) {
		var children = [];
		children.push(
			el(
				'button',
				{ type: 'button', className: 'frost-child-alphabet-filter__letter is-active', disabled: true },
				allLabel || 'ALLA'
			)
		);
		LETTERS.forEach(function (letter) {
			children.push(
				el('button', { type: 'button', className: 'frost-child-alphabet-filter__letter', disabled: true }, letter)
			);
		});
		return children;
	}

	blocks.registerBlockType('frost-child/alphabet-filter', {
		title: __('A–Ö filter', 'frost-child'),
		icon: 'search',
		category: 'widgets',
		description: __('Sök + A–Ö-filtrering för inlägg.', 'frost-child'),
		supports: {
			html: false,
		},
		attributes: {
			postType: { type: 'string', default: 'post' },
			perPage: { type: 'number', default: 100 },
			placeholder: { type: 'string', default: 'Sök efter ...' },
			allLabel: { type: 'string', default: 'ALLA' },
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;

			var blockProps = useBlockProps({ className: 'frost-child-alphabet-filter is-editor' });

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __('Inställningar', 'frost-child'), initialOpen: true },
						el(TextControl, {
							label: __('Post type (slug)', 'frost-child'),
							help: __('Ex: post, page, comic, komiker ...', 'frost-child'),
							value: attributes.postType,
							onChange: function (value) {
								setAttributes({ postType: value });
							},
						}),
						el(RangeControl, {
							label: __('Antal per sida', 'frost-child'),
							min: 1,
							max: 200,
							value: attributes.perPage,
							onChange: function (value) {
								setAttributes({ perPage: value });
							},
						}),
						el(TextControl, {
							label: __('Placeholder', 'frost-child'),
							value: attributes.placeholder,
							onChange: function (value) {
								setAttributes({ placeholder: value });
							},
						}),
						el(TextControl, {
							label: __('Text för "ALLA"', 'frost-child'),
							value: attributes.allLabel,
							onChange: function (value) {
								setAttributes({ allLabel: value });
							},
						})
					)
				),
				el(
					'div',
					blockProps,
					el(
						'div',
						{ className: 'frost-child-alphabet-filter__row' },
						el(
							'div',
							{ className: 'frost-child-alphabet-filter__searchWrap' },
							el('span', { className: 'frost-child-alphabet-filter__searchIcon', 'aria-hidden': 'true' }, '⌕'),
							el('input', {
								type: 'search',
								className: 'frost-child-alphabet-filter__search',
								disabled: true,
								placeholder: attributes.placeholder || 'Sök efter ...',
								value: '',
							})
						),
						el(
							'div',
							{ className: 'frost-child-alphabet-filter__letters', role: 'tablist', 'aria-label': __('Filtrera på bokstav', 'frost-child') },
							renderLetters(attributes.allLabel)
						)
					),
					el(
						'div',
						{ className: 'frost-child-alphabet-filter__hint' },
						__('Förhandsvisning i editor. På frontend blir bokstäverna klickbara och resultat hämtas.', 'frost-child')
					)
				)
			);
		},

		save: function (props) {
			var attributes = props.attributes;
			var blockProps = blockEditor.useBlockProps.save({ className: 'frost-child-alphabet-filter' });

			var letters = [];
			letters.push(
				el(
					'button',
					{
						type: 'button',
						className: 'frost-child-alphabet-filter__letter is-active',
						'data-letter': 'ALLA',
						'aria-pressed': 'true',
					},
					attributes.allLabel || 'ALLA'
				)
			);
			LETTERS.forEach(function (letter) {
				letters.push(
					el(
						'button',
						{
							type: 'button',
							className: 'frost-child-alphabet-filter__letter',
							'data-letter': letter,
							'aria-pressed': 'false',
						},
						letter
					)
				);
			});

			return el(
				'div',
				Object.assign({}, blockProps, {
					'data-post-type': attributes.postType || 'post',
					'data-per-page': String(attributes.perPage || 100),
					'data-placeholder': attributes.placeholder || 'Sök efter ...',
					'data-all-label': attributes.allLabel || 'ALLA',
				}),
				el(
					'div',
					{ className: 'frost-child-alphabet-filter__row' },
					el(
						'div',
						{ className: 'frost-child-alphabet-filter__searchWrap' },
						el('span', { className: 'frost-child-alphabet-filter__searchIcon', 'aria-hidden': 'true' }, '⌕'),
						el('input', {
							type: 'search',
							className: 'frost-child-alphabet-filter__search',
							placeholder: attributes.placeholder || 'Sök efter ...',
							'autocomplete': 'off',
						})
					),
					el(
						'div',
						{ className: 'frost-child-alphabet-filter__letters', role: 'tablist', 'aria-label': 'Filtrera på bokstav' },
						letters
					)
				),
				el('div', { className: 'frost-child-alphabet-filter__status', 'aria-live': 'polite' }),
				el('ul', { className: 'frost-child-alphabet-filter__results' })
			);
		},
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
