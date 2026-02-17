( function ( blocks, element, blockEditor, components, i18n ) {
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

	function sanitizeItems( items ) {
		if ( ! Array.isArray( items ) || ! items.length ) {
			return [
				{
					question: __( 'Ny fråga', 'frost-child' ),
					answer: __( 'Skriv svar här.', 'frost-child' ),
				},
			];
		}

		return items.map( function ( item ) {
			return {
				question: item && typeof item.question === 'string' ? item.question : '',
				answer: item && typeof item.answer === 'string' ? item.answer : '',
			};
		} );
	}

	blocks.registerBlockType( 'frost-child/faq-dropdown', {
		title: __( 'FAQ Dropdown', 'frost-child' ),
		icon: 'editor-help',
		category: 'widgets',
		description: __( 'FAQ accordion med flera expanderbara frågor och svar.', 'frost-child' ),
		supports: {
			html: false,
		},
		attributes: {
			items: {
				type: 'array',
				default: [],
			},
		},

		edit: function ( props ) {
			var attrs = props.attributes;
			var setAttributes = props.setAttributes;
			var items = sanitizeItems( attrs.items );
			var openState = useState( 0 );
			var openIndex = openState[ 0 ];
			var setOpenIndex = openState[ 1 ];
			var blockProps = useBlockProps( { className: 'frost-child-faq-dropdown' } );

			function updateItem( index, key, value ) {
				var next = items.slice();
				next[ index ] = {
					question: next[ index ].question,
					answer: next[ index ].answer,
				};
				next[ index ][ key ] = value;
				setAttributes( { items: next } );
			}

			function addItem() {
				setAttributes( {
					items: items.concat( [
						{
							question: __( 'Ny fråga', 'frost-child' ),
							answer: __( 'Skriv svar här.', 'frost-child' ),
						},
					] ),
				} );
				setOpenIndex( items.length );
			}

			function removeItem( index ) {
				if ( items.length <= 1 ) {
					return;
				}

				var next = items.filter( function ( _, i ) {
					return i !== index;
				} );
				setAttributes( { items: next } );

				if ( openIndex === index ) {
					setOpenIndex( -1 );
				} else if ( openIndex > index ) {
					setOpenIndex( openIndex - 1 );
				}
			}

			var inspectorItems = items.map( function ( item, index ) {
				return el(
					PanelBody,
					{
						title: __( 'Fråga', 'frost-child' ) + ' ' + ( index + 1 ),
						initialOpen: index === 0,
						key: 'item-panel-' + index,
					},
					el( TextControl, {
						label: __( 'Fråga', 'frost-child' ),
						value: item.question,
						onChange: function ( value ) {
							updateItem( index, 'question', value );
						},
					} ),
					el( TextareaControl, {
						label: __( 'Svar', 'frost-child' ),
						value: item.answer,
						onChange: function ( value ) {
							updateItem( index, 'answer', value );
						},
						rows: 5,
					} ),
					el(
						Button,
						{
							isDestructive: true,
							onClick: function () {
								removeItem( index );
							},
							disabled: items.length <= 1,
						},
						__( 'Ta bort fråga', 'frost-child' )
					)
				);
			} );

			var previewItems = items.map( function ( item, index ) {
				var isOpen = openIndex === index;
				return el(
					'div',
					{
						className: 'frost-child-faq-dropdown__item' + ( isOpen ? ' is-open' : '' ),
						key: 'preview-item-' + index,
					},
					el(
						'button',
						{
							type: 'button',
							className: 'frost-child-faq-dropdown__trigger',
							onClick: function () {
								setOpenIndex( isOpen ? -1 : index );
							},
							'aria-expanded': isOpen ? 'true' : 'false',
						},
						el( 'span', { className: 'frost-child-faq-dropdown__question' }, item.question || __( 'Skriv fråga...', 'frost-child' ) ),
						el( 'span', { className: 'frost-child-faq-dropdown__icon', 'aria-hidden': 'true' }, '⌄' )
					),
					el(
						'div',
						{ className: 'frost-child-faq-dropdown__panel', hidden: ! isOpen },
						el( 'div', { className: 'frost-child-faq-dropdown__answer' }, item.answer || __( 'Skriv svar...', 'frost-child' ) )
					)
				);
			} );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					inspectorItems,
					el(
						PanelBody,
						{ title: __( 'Lägg till', 'frost-child' ), initialOpen: false },
						el(
							Button,
							{
								variant: 'primary',
								onClick: addItem,
							},
							__( 'Lägg till ny fråga', 'frost-child' )
						)
					)
				),
				el( 'div', blockProps, previewItems )
			);
		},

		save: function ( props ) {
			var items = sanitizeItems( props.attributes.items );
			var blockProps = blockEditor.useBlockProps.save( { className: 'frost-child-faq-dropdown' } );

			return el(
				'div',
				blockProps,
				items.map( function ( item, index ) {
					var panelId = 'frost-child-faq-panel-' + index;

					return el(
						'div',
						{ className: 'frost-child-faq-dropdown__item', key: 'saved-item-' + index },
						el(
							'button',
							{
								type: 'button',
								className: 'frost-child-faq-dropdown__trigger',
								'aria-expanded': 'false',
								'aria-controls': panelId,
							},
							el( 'span', { className: 'frost-child-faq-dropdown__question' }, item.question || '' ),
							el( 'span', { className: 'frost-child-faq-dropdown__icon', 'aria-hidden': 'true' }, '⌄' )
						),
						el(
							'div',
							{
								className: 'frost-child-faq-dropdown__panel',
								id: panelId,
								hidden: true,
							},
							el( 'div', { className: 'frost-child-faq-dropdown__answer' }, item.answer || '' )
						)
					);
				} )
			);
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );