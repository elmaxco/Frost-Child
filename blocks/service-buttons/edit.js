(function (wp) {
	var registerBlockType = wp.blocks.registerBlockType;
	var createElement = wp.element.createElement;
	var __ = wp.i18n.__;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var MediaUpload = wp.blockEditor.MediaUpload;
	var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
	var Button = wp.components.Button;
	var TextControl = wp.components.TextControl;

	function createDefaultItem() {
		return {
			label: __('Ny tjänst', 'frost-child'),
			url: '#',
			imageUrl: '',
			imageId: 0,
			imageAlt: ''
		};
	}

	function normalizeItem(item) {
		return {
			label: item && item.label ? item.label : '',
			url: item && item.url ? item.url : '#',
			imageUrl: item && item.imageUrl ? item.imageUrl : '',
			imageId: item && item.imageId ? item.imageId : 0,
			imageAlt: item && item.imageAlt ? item.imageAlt : ''
		};
	}

	registerBlockType('frost-child/service-buttons', {
		title: __('Service Buttons', 'frost-child'),
		icon: 'grid-view',
		category: 'widgets',
		description: __('Serviceknappar med bild, text och länk.', 'frost-child'),
		supports: {
			html: false,
			align: true,
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps({ className: 'frost-child-service-buttons is-editor' });
			var items = Array.isArray(attributes.items) ? attributes.items.map(normalizeItem) : [];

			if (items.length === 0) {
				items = [createDefaultItem()];
			}

			var setItems = function (nextItems) {
				setAttributes({ items: nextItems });
			};

			var updateItem = function (index, field, value) {
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index]);
				nextItems[index][field] = value;
				setItems(nextItems);
			};

			var updateImageFromLibrary = function (index, media) {
				if (!media) {
					return;
				}
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index], {
					imageId: media.id || 0,
					imageUrl: media.url || '',
					imageAlt: media.alt || nextItems[index].imageAlt || ''
				});
				setItems(nextItems);
			};

			var updateImageUrl = function (index, value) {
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index], {
					imageUrl: value,
					imageId: 0
				});
				setItems(nextItems);
			};

			var removeImage = function (index) {
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index], {
					imageUrl: '',
					imageId: 0,
					imageAlt: ''
				});
				setItems(nextItems);
			};

			var addItem = function () {
				setItems(items.concat([createDefaultItem()]));
			};

			var removeItem = function (index) {
				var nextItems = items.filter(function (_item, itemIndex) {
					return itemIndex !== index;
				});
				setItems(nextItems.length ? nextItems : [createDefaultItem()]);
			};

			return createElement(
				'div',
				blockProps,
				createElement(
					'div',
					{ className: 'frost-child-service-buttons__grid' },
					items.map(function (item, index) {
						return createElement(
							'div',
							{ key: index, className: 'frost-child-service-buttons__item' },
							createElement(
								'div',
								{ className: 'frost-child-service-buttons__preview' },
								createElement(
									'span',
									{ className: 'frost-child-service-buttons__media' },
									item.imageUrl ? createElement('img', {
										src: item.imageUrl,
										alt: item.imageAlt || item.label || ''
									}) : null
								),
								createElement(
									'span',
									{ className: 'frost-child-service-buttons__label' },
									item.label || __('Knapptext', 'frost-child')
								)
							),
							createElement(TextControl, {
								label: __('Text', 'frost-child'),
								value: item.label,
								onChange: function (value) {
									updateItem(index, 'label', value);
								}
							}),
							createElement(TextControl, {
								label: __('Länk', 'frost-child'),
								value: item.url,
								onChange: function (value) {
									updateItem(index, 'url', value);
								},
								placeholder: 'https://'
							}),
							createElement(TextControl, {
								label: __('Bild-URL', 'frost-child'),
								value: item.imageUrl,
								onChange: function (value) {
									updateImageUrl(index, value);
								},
								placeholder: 'https://'
							}),
							createElement(TextControl, {
								label: __('Bild alt-text', 'frost-child'),
								value: item.imageAlt,
								onChange: function (value) {
									updateItem(index, 'imageAlt', value);
								}
							}),
							createElement(
								'div',
								{ className: 'frost-child-service-buttons__actions' },
								createElement(
									MediaUploadCheck,
									null,
									createElement(MediaUpload, {
										onSelect: function (media) {
											updateImageFromLibrary(index, media);
										},
										allowedTypes: ['image'],
										value: item.imageId,
										render: function (mediaProps) {
											return createElement(
												Button,
												{
													variant: 'secondary',
													onClick: mediaProps.open
												},
												item.imageUrl ? __('Byt bild', 'frost-child') : __('Välj bild', 'frost-child')
											);
										}
									})
								),
								createElement(
									Button,
									{
										variant: 'tertiary',
										onClick: function () {
											removeImage(index);
										},
										disabled: !item.imageUrl
									},
									__('Ta bort bild', 'frost-child')
								),
								createElement(
									Button,
									{
										variant: 'link',
										isDestructive: true,
										onClick: function () {
											removeItem(index);
										}
									},
									__('Ta bort knapp', 'frost-child')
								)
							)
						);
					})
				),
				createElement(
					Button,
					{
						variant: 'primary',
						onClick: addItem,
						className: 'frost-child-service-buttons__add'
					},
					__('Lägg till knapp', 'frost-child')
				)
			);
		},

		save: function (props) {
			var items = Array.isArray(props.attributes.items) ? props.attributes.items.map(normalizeItem) : [];
			var blockProps = wp.blockEditor.useBlockProps.save({ className: 'frost-child-service-buttons' });

			return createElement(
				'div',
				blockProps,
				createElement(
					'div',
					{ className: 'frost-child-service-buttons__grid' },
					items.map(function (item, index) {
						var href = item.url && item.url.trim() ? item.url : '#';
						return createElement(
							'a',
							{ key: index, className: 'frost-child-service-buttons__link', href: href },
							createElement(
								'span',
								{ className: 'frost-child-service-buttons__media' },
								item.imageUrl ? createElement('img', {
									src: item.imageUrl,
									alt: item.imageAlt || item.label || ''
								}) : null
							),
							createElement(
								'span',
								{ className: 'frost-child-service-buttons__label' },
								item.label
							)
						);
					})
				)
			);
		},
	});
})(window.wp);
