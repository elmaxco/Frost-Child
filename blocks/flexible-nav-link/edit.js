(function (blocks, element, blockEditor, components, i18n) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;

	blocks.registerBlockType('frost-child/flexible-nav-link', {
		title: __('Flexible Nav Link', 'frost-child'),
		icon: 'admin-links',
		category: 'design',
		parent: ['frost-child/flexible-navigation'],
		supports: {
			reusable: false,
			html: false,
		},
		attributes: {
			label: { type: 'string', default: 'Kontakta oss' },
			url: { type: 'string', default: '#' },
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps({ className: 'frost-child-flex-nav-link' });

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __('Link', 'frost-child'), initialOpen: true },
						el(TextControl, {
							label: __('Label', 'frost-child'),
							value: attributes.label,
							onChange: function (value) {
								setAttributes({ label: value });
							},
						}),
						el(TextControl, {
							label: __('URL', 'frost-child'),
							value: attributes.url,
							onChange: function (value) {
								setAttributes({ url: value });
							},
						})
					)
				),
				el(
					'div',
					blockProps,
					el(
						'a',
						{ className: 'frost-child-flex-nav__quick-link', href: attributes.url || '#' },
						attributes.label || ''
					)
				)
			);
		},

		save: function (props) {
			var attributes = props.attributes;
			var blockProps = blockEditor.useBlockProps.save({ className: 'frost-child-flex-nav-link' });

			return el(
				'div',
				blockProps,
				el(
					'a',
					{ className: 'frost-child-flex-nav__quick-link', href: attributes.url || '#' },
					attributes.label || ''
				)
			);
		},
	});
})(window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n);
