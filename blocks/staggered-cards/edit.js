(function (wp) {
	var registerBlockType = wp.blocks.registerBlockType;
	var createElement = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var __ = wp.i18n.__;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody = wp.components.PanelBody;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var Button = wp.components.Button;

	function createDefaultCard() {
		return {
			title: __('Nytt kort', 'frost-child'),
			text: __('Skriv text här.', 'frost-child'),
		};
	}

	function normalizeCard(card) {
		return {
			title: card && typeof card.title === 'string' ? card.title : '',
			text: card && typeof card.text === 'string' ? card.text : '',
		};
	}

	registerBlockType('frost-child/staggered-cards', {
		title: __('Förskjutna Kort', 'frost-child'),
		icon: 'columns',
		category: 'widgets',
		description: __('Sektion med förskjutna kort och avslutande CTA-kort.', 'frost-child'),
		supports: {
			html: false,
			align: true,
		},

		edit: function (props) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var cards = Array.isArray(attributes.cards) ? attributes.cards.map(normalizeCard) : [];
			var ctaTitle = typeof attributes.ctaTitle === 'string' ? attributes.ctaTitle : '';
			var ctaButtonText = typeof attributes.ctaButtonText === 'string' ? attributes.ctaButtonText : '';
			var ctaButtonUrl = typeof attributes.ctaButtonUrl === 'string' ? attributes.ctaButtonUrl : '#';
			var blockProps = useBlockProps({ className: 'frost-child-staggered-cards is-editor' });

			if (cards.length === 0) {
				cards = [createDefaultCard()];
			}

			function setCards(nextCards) {
				setAttributes({ cards: nextCards.length ? nextCards : [createDefaultCard()] });
			}

			function updateCard(index, field, value) {
				var nextCards = cards.slice();
				nextCards[index] = Object.assign({}, nextCards[index]);
				nextCards[index][field] = value;
				setCards(nextCards);
			}

			function addCard() {
				setCards(cards.concat([createDefaultCard()]));
			}

			function removeCard(index) {
				var nextCards = cards.filter(function (_card, cardIndex) {
					return cardIndex !== index;
				});
				setCards(nextCards);
			}

			return createElement(
				Fragment,
				null,
				createElement(
					InspectorControls,
					null,
					cards.map(function (card, index) {
						return createElement(
							PanelBody,
							{
								title: __('Kort', 'frost-child') + ' ' + (index + 1),
								initialOpen: index === 0,
								key: 'card-panel-' + index,
							},
							createElement(TextControl, {
								label: __('Rubrik', 'frost-child'),
								value: card.title,
								onChange: function (value) {
									updateCard(index, 'title', value);
								},
							}),
							createElement(TextareaControl, {
								label: __('Text', 'frost-child'),
								value: card.text,
								onChange: function (value) {
									updateCard(index, 'text', value);
								},
								rows: 5,
							}),
							createElement(
								Button,
								{
									variant: 'link',
									isDestructive: true,
									onClick: function () {
										removeCard(index);
									},
									disabled: cards.length <= 1,
								},
								__('Ta bort kort', 'frost-child')
							)
						);
					}),
					createElement(
						PanelBody,
						{
							title: __('CTA-kort', 'frost-child'),
							initialOpen: false,
						},
						createElement(TextControl, {
							label: __('CTA-rubrik', 'frost-child'),
							value: ctaTitle,
							onChange: function (value) {
								setAttributes({ ctaTitle: value });
							},
						}),
						createElement(TextControl, {
							label: __('Knapptext', 'frost-child'),
							value: ctaButtonText,
							onChange: function (value) {
								setAttributes({ ctaButtonText: value });
							},
						}),
						createElement(TextControl, {
							label: __('Knapp-länk', 'frost-child'),
							value: ctaButtonUrl,
							onChange: function (value) {
								setAttributes({ ctaButtonUrl: value });
							},
							placeholder: 'https://',
						})
					)
				),
				createElement(
					'div',
					blockProps,
					createElement(
						'div',
						{ className: 'frost-child-staggered-cards__stack' },
						cards.map(function (card, index) {
							return createElement(
								'div',
								{ key: index, className: 'frost-child-staggered-cards__card' },
								createElement(
									'h3',
									{ className: 'frost-child-staggered-cards__title' },
									card.title || __('Rubrik', 'frost-child')
								),
								createElement(
									'p',
									{ className: 'frost-child-staggered-cards__text' },
									card.text || __('Text...', 'frost-child')
								)
							);
						}),
						createElement(
							'div',
							{ className: 'frost-child-staggered-cards__cta' },
							createElement(
								'h3',
								{ className: 'frost-child-staggered-cards__cta-title' },
								ctaTitle || __('Vill du veta mer?', 'frost-child')
							),
							createElement(
								'span',
								{ className: 'frost-child-staggered-cards__cta-button' },
								ctaButtonText || __('Kontakta oss', 'frost-child')
							)
						)
					),
					createElement(
						Button,
						{
							variant: 'primary',
							onClick: addCard,
							className: 'frost-child-staggered-cards__add',
						},
						__('Lägg till kort', 'frost-child')
					)
				)
			);
		},

		save: function (props) {
			var cards = Array.isArray(props.attributes.cards) ? props.attributes.cards.map(normalizeCard) : [];
			var ctaTitle = typeof props.attributes.ctaTitle === 'string' ? props.attributes.ctaTitle : '';
			var ctaButtonText = typeof props.attributes.ctaButtonText === 'string' ? props.attributes.ctaButtonText : '';
			var ctaButtonUrl = typeof props.attributes.ctaButtonUrl === 'string' && props.attributes.ctaButtonUrl.trim() ? props.attributes.ctaButtonUrl : '#';
			var blockProps = wp.blockEditor.useBlockProps.save({ className: 'frost-child-staggered-cards' });

			if (!cards.length) {
				cards = [createDefaultCard()];
			}

			return createElement(
				'div',
				blockProps,
				createElement(
					'div',
					{ className: 'frost-child-staggered-cards__stack' },
					cards.map(function (card, index) {
						return createElement(
							'div',
							{ key: index, className: 'frost-child-staggered-cards__card' },
							createElement('h3', { className: 'frost-child-staggered-cards__title' }, card.title),
							createElement('p', { className: 'frost-child-staggered-cards__text' }, card.text)
						);
					}),
					createElement(
						'div',
						{ className: 'frost-child-staggered-cards__cta' },
						createElement('h3', { className: 'frost-child-staggered-cards__cta-title' }, ctaTitle),
						createElement(
							'a',
							{
								href: ctaButtonUrl,
								className: 'frost-child-staggered-cards__cta-button',
							},
							ctaButtonText
						)
					)
				)
			);
		},
	});
})(window.wp);
