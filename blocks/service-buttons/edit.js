(function (wp) {
	var registerBlockType = wp.blocks.registerBlockType;
	var createElement = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var __ = wp.i18n.__;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var MediaUpload = wp.blockEditor.MediaUpload;
	var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
	var Button = wp.components.Button;
	var TextControl = wp.components.TextControl;
	var Placeholder = wp.components.Placeholder;

	registerBlockType('frost-child/service-buttons', {
		title: __('Service Buttons', 'frost-child'),
		icon: 'grid-view',
		category: 'widgets',
		description: __('A row of image buttons with labels and links.', 'frost-child'),
		supports: {
			html: false,
		},
		attributes: {
			items: {
				type: 'array',
				default: [
					{ label: 'Elektriker', url: '#', imageLinkUrl: '#', imageUrl: '', imageId: 0, imageAlt: '' },
					{ label: 'Rörmokare', url: '#', imageLinkUrl: '#', imageUrl: '', imageId: 0, imageAlt: '' },
					{ label: 'Målare', url: '#', imageLinkUrl: '#', imageUrl: '', imageId: 0, imageAlt: '' }
				],
			},
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var items = attributes.items || [];
			var blockProps = useBlockProps({ className: 'frost-child-service-buttons is-editor' });

			var updateItem = function (index, key, value) {
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index], {});
				nextItems[index][key] = value;
				setAttributes({ items: nextItems });
			};

			var updateImage = function (index, media) {
				if (!media) {
					return;
				}

				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index], {
					imageId: media.id || 0,
					imageUrl: media.url || '',
					imageAlt: media.alt || ''
				});
				setAttributes({ items: nextItems });
			};

			var removeImage = function (index) {
				var nextItems = items.slice();
				nextItems[index] = Object.assign({}, nextItems[index], {
					imageId: 0,
					imageUrl: '',
					imageAlt: ''
				});
				setAttributes({ items: nextItems });
			};

			var addItem = function () {
				setAttributes({
					items: items.concat([
						{ label: __('Ny knapp', 'frost-child'), url: '#', imageLinkUrl: '#', imageUrl: '', imageId: 0, imageAlt: '' }
					])
				});
			};

			var removeItem = function (index) {
				var nextItems = items.filter(function (_item, itemIndex) {
					return itemIndex !== index;
				});
				setAttributes({ items: nextItems });
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
								item.imageUrl
									? createElement('img', {
										src: item.imageUrl,
										alt: item.imageAlt || item.label || ''
									})
									: createElement(Placeholder, {
										label: __('Ingen bild vald', 'frost-child'),
										instructions: __('Välj en bild för knappen.', 'frost-child')
									}),
								createElement('p', { className: 'frost-child-service-buttons__title' }, item.label || __('Knapptext', 'frost-child'))
							),
							createElement(TextControl, {
								label: __('Text', 'frost-child'),
								value: item.label || '',
								onChange: function (value) {
									updateItem(index, 'label', value);
								}
							}),
							createElement(TextControl, {
								label: __('Länk', 'frost-child'),
								value: item.url || '',
								onChange: function (value) {
									updateItem(index, 'url', value);
								},
								placeholder: 'https://'
							}),
							createElement(TextControl, {
								label: __('Bildlänk', 'frost-child'),
								value: item.imageLinkUrl || '',
								onChange: function (value) {
									updateItem(index, 'imageLinkUrl', value);
								},
								placeholder: 'https://'
							}),
							createElement(
								'div',
								{ className: 'frost-child-service-buttons__actions' },
								createElement(MediaUploadCheck, {},
									createElement(MediaUpload, {
										onSelect: function (media) {
											updateImage(index, media);
										},
										allowedTypes: ['image'],
										value: item.imageId || 0,
										render: function (mediaProps) {
											return createElement(Button, {
												variant: 'secondary',
												onClick: mediaProps.open
											}, item.imageUrl ? __('Byt bild', 'frost-child') : __('Välj bild', 'frost-child'));
										}
									})
								),
								item.imageUrl
									? createElement(Button, {
										variant: 'tertiary',
										onClick: function () {
											removeImage(index);
										}
									}, __('Ta bort bild', 'frost-child'))
									: null,
								createElement(Button, {
									variant: 'link',
									isDestructive: true,
									onClick: function () {
										removeItem(index);
									}
								}, __('Ta bort knapp', 'frost-child'))
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
			var attributes = props.attributes;
			var items = attributes.items || [];
			var blockProps = wp.blockEditor.useBlockProps.save({ className: 'frost-child-service-buttons' });

			return createElement(
				'div',
				blockProps,
				createElement(
					'div',
					{ className: 'frost-child-service-buttons__grid' },
					items.map(function (item, index) {
						var linkUrl = item.url && item.url.trim() ? item.url : '#';
						var imageLinkUrl = item.imageLinkUrl && item.imageLinkUrl.trim() ? item.imageLinkUrl : linkUrl;
						return createElement(
							'div',
							{ key: index, className: 'frost-child-service-buttons__card' },
							createElement(
								'a',
								{ className: 'frost-child-service-buttons__media-link', href: imageLinkUrl },
								createElement(
									'span',
									{ className: 'frost-child-service-buttons__media' },
								item.imageUrl
									? createElement('img', {
										src: item.imageUrl,
										alt: item.imageAlt || item.label || ''
									})
									: null
								)
							),
							createElement('a', { className: 'frost-child-service-buttons__label-link', href: linkUrl },
								createElement('span', { className: 'frost-child-service-buttons__label' }, item.label || '')
							)
						);
					})
				)
			);
		},
	});
})(window.wp);
