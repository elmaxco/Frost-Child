(function (blocks, element, blockEditor, components, i18n) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;

	blocks.registerBlockType('frost-child/simple-dropdown', {
		title: __('Simple Dropdown', 'frost-child'),
		icon: 'arrow-down-alt2',
		category: 'widgets',
		description: __('A simple dropdown button with two links.', 'frost-child'),
		supports: {
			html: false,
		},
		attributes: {
			buttonText: { type: 'string', default: 'Om oss' },
			link1Label: { type: 'string', default: 'Läs mer om oss' },
			link1Url: { type: 'string', default: '#' },
			link2Label: { type: 'string', default: 'Möt oss på Dryft' },
			link2Url: { type: 'string', default: '#' },
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps({ className: 'frost-child-simple-dropdown is-open' });

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __('Dropdown', 'frost-child'), initialOpen: true },
						el(TextControl, {
							label: __('Button text', 'frost-child'),
							value: attributes.buttonText,
							onChange: function (value) {
								setAttributes({ buttonText: value });
							},
						}),
						el(TextControl, {
							label: __('Link 1 label', 'frost-child'),
							value: attributes.link1Label,
							onChange: function (value) {
								setAttributes({ link1Label: value });
							},
						}),
						el(TextControl, {
							label: __('Link 1 URL', 'frost-child'),
							value: attributes.link1Url,
							onChange: function (value) {
								setAttributes({ link1Url: value });
							},
						}),
						el(TextControl, {
							label: __('Link 2 label', 'frost-child'),
							value: attributes.link2Label,
							onChange: function (value) {
								setAttributes({ link2Label: value });
							},
						}),
						el(TextControl, {
							label: __('Link 2 URL', 'frost-child'),
							value: attributes.link2Url,
							onChange: function (value) {
								setAttributes({ link2Url: value });
							},
						})
					)
				),
				el(
					'div',
					blockProps,
					el(
						'button',
						{ type: 'button', className: 'frost-child-simple-dropdown__button', disabled: true },
						attributes.buttonText || 'Om oss',
						el('span', { className: 'frost-child-simple-dropdown__arrow', 'aria-hidden': 'true' }, '⌵')
					),
					el(
						'div',
						{ className: 'frost-child-simple-dropdown__panel' },
						el(
							'a',
							{ className: 'frost-child-simple-dropdown__link', href: attributes.link1Url || '#' },
							attributes.link1Label || ''
						),
						el(
							'a',
							{ className: 'frost-child-simple-dropdown__link', href: attributes.link2Url || '#' },
							attributes.link2Label || ''
						)
					)
				)
			);
		},

		save: function (props) {
			var attributes = props.attributes;
			var blockProps = blockEditor.useBlockProps.save({ className: 'frost-child-simple-dropdown' });

			return el(
				'div',
				blockProps,
				el(
					'button',
					{ type: 'button', className: 'frost-child-simple-dropdown__button', 'aria-expanded': 'false' },
					attributes.buttonText || 'Om oss',
					el('span', { className: 'frost-child-simple-dropdown__arrow', 'aria-hidden': 'true' }, '⌵')
				),
				el(
					'div',
					{ className: 'frost-child-simple-dropdown__panel' },
					el(
						'a',
						{ className: 'frost-child-simple-dropdown__link', href: attributes.link1Url || '#' },
						attributes.link1Label || ''
					),
					el(
						'a',
						{ className: 'frost-child-simple-dropdown__link', href: attributes.link2Url || '#' },
						attributes.link2Label || ''
					)
				)
			);
		},
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
