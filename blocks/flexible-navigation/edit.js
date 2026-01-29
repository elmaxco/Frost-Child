(function (blocks, element, blockEditor, components, i18n) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InnerBlocks = blockEditor.InnerBlocks;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var RangeControl = components.RangeControl;

	blocks.registerBlockType('frost-child/flexible-navigation', {
		title: __('Flexible Navigation', 'frost-child'),
		description: __('A navigation-like container that lets you add any blocks.', 'frost-child'),
		icon: 'menu',
		category: 'design',
		supports: {
			align: ['wide', 'full'],
			anchor: true,
			html: false,
		},
		attributes: {
			toggleLabel: { type: 'string', default: 'Meny' },
			breakpoint: { type: 'number', default: 960 },
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps({
				className: 'frost-child-flex-nav',
			});

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __('Settings', 'frost-child'), initialOpen: true },
						el(TextControl, {
							label: __('Mobile toggle label', 'frost-child'),
							value: attributes.toggleLabel,
							onChange: function (value) {
								setAttributes({ toggleLabel: value });
							},
						}),
						el(RangeControl, {
							label: __('Mobile breakpoint (px)', 'frost-child'),
							value: attributes.breakpoint,
							min: 480,
							max: 1440,
							step: 10,
							onChange: function (value) {
								setAttributes({ breakpoint: value });
							},
						}),
					)
				),
				el(
					'nav',
					Object.assign({}, blockProps, {
						'aria-label': __('Site navigation', 'frost-child'),
						'data-breakpoint': attributes.breakpoint || 960,
					}),
					el(
						'div',
						{ className: 'frost-child-flex-nav__bar' },
						el(
							'div',
							{ className: 'frost-child-flex-nav__toggle-wrap' },
							el(
								'button',
								{ type: 'button', className: 'frost-child-flex-nav__toggle', disabled: true, 'aria-label': attributes.toggleLabel || 'Meny' },
								el('span', { className: 'frost-child-flex-nav__toggle-text' }, attributes.toggleLabel || 'Meny')
							)
						),
						el(
							'div',
							{ className: 'frost-child-flex-nav__panel is-open' },
							el(
								'button',
								{ type: 'button', className: 'frost-child-flex-nav__close', disabled: true, 'aria-label': __('Close menu', 'frost-child') },
								'×'
							),
							el(InnerBlocks, {
								renderAppender: InnerBlocks.ButtonBlockAppender,
							})
						)
					)
				)
			);
		},

		save: function (props) {
			var attributes = props.attributes;
			var blockProps = blockEditor.useBlockProps.save({
				className: 'frost-child-flex-nav',
			});

			return el(
				'nav',
				Object.assign({}, blockProps, {
					'aria-label': 'Site navigation',
					'data-breakpoint': attributes.breakpoint || 960,
				}),
				el(
					'div',
					{ className: 'frost-child-flex-nav__bar' },
					el(
						'button',
						{
							type: 'button',
							className: 'frost-child-flex-nav__toggle',
							'aria-label': attributes.toggleLabel || 'Meny',
							'aria-expanded': 'false',
						},
						el('span', { className: 'frost-child-flex-nav__toggle-text' }, attributes.toggleLabel || 'Meny')
					),
					el(
						'div',
						{ className: 'frost-child-flex-nav__panel' },
						el(
							'button',
							{ type: 'button', className: 'frost-child-flex-nav__close', 'aria-label': 'Stäng' },
							'×'
						),
						el(blockEditor.InnerBlocks.Content)
					)
				)
			);
		},
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
