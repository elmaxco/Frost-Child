(function (wp) {
	var registerBlockType = wp.blocks.registerBlockType;
	var createElement = wp.element.createElement;
	var __ = wp.i18n.__;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var TextControl = wp.components.TextControl;
	var Button = wp.components.Button;

	function createDefaultItem() {
		return {
			label: __('New button', 'frost-child'),
			url: '#',
		};
	}

	function normalizeItem(item) {
		return {
			label: item && item.label ? item.label : '',
			url: item && item.url ? item.url : '#',
		};
	}

	registerBlockType('frost-child/pill-link-buttons', {
		title: __('Knapprad (Pill)', 'frost-child'),
		icon: 'button',
		category: 'widgets',
		description: __('Responsiv knapprad med redigerbar text och länk.', 'frost-child'),
		supports: {
			html: false,
			align: true,
			spacing: {
				margin: true,
				padding: true,
			},
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps({ className: 'frost-child-pill-links is-editor' });
			var items = Array.isArray(attributes.items) ? attributes.items.map(normalizeItem) : [];

			if (items.length === 0) {
				items = [createDefaultItem()];
			}

			var setItems = function (nextItems) {
				setAttributes({
					items: nextItems.length ? nextItems : [createDefaultItem()],
				});
			};

			var updateItem = function (index, field, value) {
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index]);
				nextItems[index][field] = value;
				setItems(nextItems);
			};

			var addItem = function () {
				setItems(items.concat([createDefaultItem()]));
			};

			var removeItem = function (index) {
				var nextItems = items.filter(function (_item, itemIndex) {
					return itemIndex !== index;
				});
				setItems(nextItems);
			};

			return createElement(
				'div',
				blockProps,
				createElement(
					'div',
					{ className: 'frost-child-pill-links__grid' },
					items.map(function (item, index) {
						return createElement(
							'div',
							{ key: index, className: 'frost-child-pill-links__item' },
							createElement(
								'div',
								{ className: 'frost-child-pill-links__preview' },
								createElement(
									'span',
									{ className: 'frost-child-pill-links__label' },
									item.label || __('Button text', 'frost-child')
								),
								createElement(
									'span',
									{ className: 'frost-child-pill-links__arrow', 'aria-hidden': 'true' },
									'›'
								)
							),
							createElement(TextControl, {
								label: __('Text', 'frost-child'),
								value: item.label,
								onChange: function (value) {
									updateItem(index, 'label', value);
								},
							}),
							createElement(TextControl, {
								label: __('Link', 'frost-child'),
								value: item.url,
								onChange: function (value) {
									updateItem(index, 'url', value);
								},
								placeholder: 'https://',
							}),
							createElement(
								Button,
								{
									variant: 'link',
									isDestructive: true,
									onClick: function () {
										removeItem(index);
									},
								},
								__('Remove button', 'frost-child')
							)
						);
					})
				),
				createElement(
					Button,
					{
						variant: 'primary',
						onClick: addItem,
						className: 'frost-child-pill-links__add',
					},
					__('Add button', 'frost-child')
				)
			);
		},

		save: function (props) {
			var items = Array.isArray(props.attributes.items) ? props.attributes.items.map(normalizeItem) : [];
			var blockProps = wp.blockEditor.useBlockProps.save({ className: 'frost-child-pill-links' });

			return createElement(
				'div',
				blockProps,
				createElement(
					'div',
					{ className: 'frost-child-pill-links__grid' },
					items.map(function (item, index) {
						var href = item.url && item.url.trim() ? item.url : '#';
						return createElement(
							'a',
							{ key: index, className: 'frost-child-pill-links__link', href: href },
							createElement(
								'span',
								{ className: 'frost-child-pill-links__label' },
								item.label
							),
							createElement(
								'span',
								{ className: 'frost-child-pill-links__arrow', 'aria-hidden': 'true' },
								'›'
							)
						);
					})
				)
			);
		},
	});
})(window.wp);
