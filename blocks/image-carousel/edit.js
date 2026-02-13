( function ( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var useState = element.useState;
	var InspectorControls = blockEditor.InspectorControls;
	var MediaUpload = blockEditor.MediaUpload;
	var MediaUploadCheck = blockEditor.MediaUploadCheck;
	var PanelBody = components.PanelBody;
	var RangeControl = components.RangeControl;
	var ToggleControl = components.ToggleControl;
	var SelectControl = components.SelectControl;
	var Button = components.Button;
	var TextControl = components.TextControl;
	var Card = components.Card;
	var CardBody = components.CardBody;
	var ColorPicker = components.ColorPicker;
	var BaseControl = components.BaseControl;
	var __ = i18n.__;

	blocks.registerBlockType( 'frost-child/image-carousel', {
		edit: function ( props ) {
			var attrs = props.attributes;
			var images = attrs.images || [];
			var setAttributes = props.setAttributes;
			var activeTab = useState( 'images' );
			var currentTab = activeTab[0];
			var setCurrentTab = activeTab[1];
			var urlInputState = useState( '' );
			var urlInput = urlInputState[0];
			var setUrlInput = urlInputState[1];
			var previewIndex = useState( 0 );
			var currentPreview = previewIndex[0];
			var setCurrentPreview = previewIndex[1];

			/* ---------- helpers ---------- */
			function addImageFromMedia( media ) {
				var newImage = {
					id: Date.now() + Math.random(),
					url: media.url,
					alt: media.alt || '',
					caption: '',
					overlayText: '',
					mediaId: media.id,
				};
				setAttributes( { images: images.concat( [ newImage ] ) } );
			}

			function addImageFromUrl() {
				if ( ! urlInput.trim() ) return;
				var newImage = {
					id: Date.now() + Math.random(),
					url: urlInput.trim(),
					alt: '',
					caption: '',
					overlayText: '',
					mediaId: 0,
				};
				setAttributes( { images: images.concat( [ newImage ] ) } );
				setUrlInput( '' );
			}

			function updateImage( index, field, value ) {
				var updated = images.map( function ( img, i ) {
					if ( i !== index ) return img;
					var copy = {};
					for ( var k in img ) copy[ k ] = img[ k ];
					copy[ field ] = value;
					return copy;
				} );
				setAttributes( { images: updated } );
			}

			function removeImage( index ) {
				setAttributes( { images: images.filter( function ( _, i ) { return i !== index; } ) } );
				if ( currentPreview >= images.length - 1 ) setCurrentPreview( Math.max( 0, images.length - 2 ) );
			}

			function moveImage( from, to ) {
				if ( to < 0 || to >= images.length ) return;
				var updated = images.slice();
				var item = updated.splice( from, 1 )[ 0 ];
				updated.splice( to, 0, item );
				setAttributes( { images: updated } );
			}

			/* ---------- Inspector Controls ---------- */
			var inspector = el(
				InspectorControls, null,

				/* -- Carousel Settings -- */
				el( PanelBody, { title: __( 'Karusellinställningar', 'frost-child' ), initialOpen: true },
					el( RangeControl, {
						label: __( 'Synliga bilder (desktop)', 'frost-child' ),
						help: __( 'På mobil visas alltid 1 bild.', 'frost-child' ),
						min: 1, max: 6, value: attrs.visibleSlides,
						onChange: function ( v ) { setAttributes( { visibleSlides: v } ); },
					} ),
					el( ToggleControl, {
						label: __( 'Autoplay', 'frost-child' ),
						checked: attrs.autoplay,
						onChange: function ( v ) { setAttributes( { autoplay: v } ); },
					} ),
					attrs.autoplay && el( RangeControl, {
						label: __( 'Autoplay-hastighet (ms)', 'frost-child' ),
						min: 1000, max: 15000, step: 500,
						value: attrs.autoplaySpeed,
						onChange: function ( v ) { setAttributes( { autoplaySpeed: v } ); },
					} ),
					el( RangeControl, {
						label: __( 'Övergångshastighet (ms)', 'frost-child' ),
						min: 100, max: 2000, step: 50,
						value: attrs.transitionSpeed,
						onChange: function ( v ) { setAttributes( { transitionSpeed: v } ); },
					} ),
					el( ToggleControl, {
						label: __( 'Pausa vid hover', 'frost-child' ),
						checked: attrs.pauseOnHover,
						onChange: function ( v ) { setAttributes( { pauseOnHover: v } ); },
					} ),
					el( ToggleControl, {
						label: __( 'Oändlig loop', 'frost-child' ),
						checked: attrs.infinite,
						onChange: function ( v ) { setAttributes( { infinite: v } ); },
					} )
				),

				/* -- Appearance -- */
				el( PanelBody, { title: __( 'Utseende', 'frost-child' ), initialOpen: false },
					el( RangeControl, {
						label: __( 'Bildhöjd (px)', 'frost-child' ),
						min: 150, max: 800, step: 10,
						value: attrs.imageHeight,
						onChange: function ( v ) { setAttributes( { imageHeight: v } ); },
					} ),
					el( SelectControl, {
						label: __( 'Bildpassning', 'frost-child' ),
						value: attrs.imageFit,
						options: [
							{ label: 'Cover', value: 'cover' },
							{ label: 'Contain', value: 'contain' },
							{ label: 'Fill', value: 'fill' },
						],
						onChange: function ( v ) { setAttributes( { imageFit: v } ); },
					} ),
					el( RangeControl, {
						label: __( 'Mellanrum (px)', 'frost-child' ),
						min: 0, max: 60, value: attrs.gap,
						onChange: function ( v ) { setAttributes( { gap: v } ); },
					} ),
					el( RangeControl, {
						label: __( 'Hörnradie (px)', 'frost-child' ),
						min: 0, max: 50, value: attrs.borderRadius,
						onChange: function ( v ) { setAttributes( { borderRadius: v } ); },
					} ),
					el( SelectControl, {
						label: __( 'Textplacering', 'frost-child' ),
						value: attrs.captionPosition,
						options: [
							{ label: __( 'Under bilden', 'frost-child' ), value: 'below' },
							{ label: __( 'Ovanpå bilden', 'frost-child' ), value: 'overlay' },
							{ label: __( 'Ingen text', 'frost-child' ), value: 'none' },
						],
						onChange: function ( v ) { setAttributes( { captionPosition: v } ); },
					} )
				),

				/* -- Arrows -- */
				el( PanelBody, { title: __( 'Pilar', 'frost-child' ), initialOpen: false },
					el( ToggleControl, {
						label: __( 'Visa pilar', 'frost-child' ),
						checked: attrs.showArrows,
						onChange: function ( v ) { setAttributes( { showArrows: v } ); },
					} ),
					attrs.showArrows && el( Fragment, null,
						el( SelectControl, {
							label: __( 'Pilstil', 'frost-child' ),
							value: attrs.arrowStyle,
							options: [
								{ label: __( 'Cirkel', 'frost-child' ), value: 'circle' },
								{ label: __( 'Fyrkantig', 'frost-child' ), value: 'square' },
								{ label: __( 'Avrundad', 'frost-child' ), value: 'rounded' },
								{ label: __( 'Minimal', 'frost-child' ), value: 'minimal' },
								{ label: __( 'Ingen bakgrund', 'frost-child' ), value: 'none' },
							],
							onChange: function ( v ) { setAttributes( { arrowStyle: v } ); },
						} ),
						el( RangeControl, {
							label: __( 'Pilstorlek (px)', 'frost-child' ),
							min: 24, max: 72, value: attrs.arrowSize,
							onChange: function ( v ) { setAttributes( { arrowSize: v } ); },
						} ),
						el( BaseControl, { label: __( 'Pilfärg', 'frost-child' ) },
							el( ColorPicker, {
								color: attrs.arrowColor,
								onChangeComplete: function ( c ) { setAttributes( { arrowColor: c.hex } ); },
								disableAlpha: true,
							} )
						),
						attrs.arrowStyle !== 'none' && el( BaseControl, { label: __( 'Pil-bakgrundsfärg', 'frost-child' ) },
							el( ColorPicker, {
								color: attrs.arrowBgColor,
								onChangeComplete: function ( c ) { setAttributes( { arrowBgColor: c.hex } ); },
								disableAlpha: true,
							} )
						)
					)
				),

				/* -- Dots -- */
				el( PanelBody, { title: __( 'Prickar', 'frost-child' ), initialOpen: false },
					el( ToggleControl, {
						label: __( 'Visa prickar', 'frost-child' ),
						checked: attrs.showDots,
						onChange: function ( v ) { setAttributes( { showDots: v } ); },
					} )
				)
			);

			/* ---------- Add images area ---------- */
			var addArea = el( 'div', { className: 'ic-add-area' },
				el( 'h4', null, __( 'Lägg till bilder', 'frost-child' ) ),
				el( 'div', { className: 'ic-add-row' },
					el( MediaUploadCheck, null,
						el( MediaUpload, {
							onSelect: addImageFromMedia,
							allowedTypes: [ 'image' ],
							render: function ( ref ) {
								return el( Button, {
									variant: 'secondary',
									onClick: ref.open,
									className: 'ic-upload-btn',
								}, __( '📁 Välj från mediabiblioteket', 'frost-child' ) );
							},
						} )
					)
				),
				el( 'div', { className: 'ic-add-row ic-url-row' },
					el( TextControl, {
						placeholder: __( 'Klistra in bild-URL...', 'frost-child' ),
						value: urlInput,
						onChange: setUrlInput,
						className: 'ic-url-input',
					} ),
					el( Button, {
						variant: 'primary',
						onClick: addImageFromUrl,
						disabled: ! urlInput.trim(),
					}, __( '➕ Lägg till URL', 'frost-child' ) )
				)
			);

			/* ---------- Image list editor ---------- */
			var imageList = images.length > 0
				? el( 'div', { className: 'ic-image-list' },
					images.map( function ( img, idx ) {
						return el( Card, { key: img.id, className: 'ic-image-card' },
							el( CardBody, null,
								el( 'div', { className: 'ic-card-header' },
									el( 'img', {
										src: img.url,
										alt: img.alt,
										className: 'ic-thumb',
									} ),
									el( 'div', { className: 'ic-card-actions' },
										el( 'span', { className: 'ic-card-number' }, '#' + ( idx + 1 ) ),
										el( Button, {
											icon: 'arrow-up-alt2', isSmall: true,
											disabled: idx === 0,
											onClick: function () { moveImage( idx, idx - 1 ); },
											label: __( 'Flytta upp', 'frost-child' ),
										} ),
										el( Button, {
											icon: 'arrow-down-alt2', isSmall: true,
											disabled: idx === images.length - 1,
											onClick: function () { moveImage( idx, idx + 1 ); },
											label: __( 'Flytta ner', 'frost-child' ),
										} ),
										el( Button, {
											isDestructive: true, isSmall: true,
											onClick: function () { removeImage( idx ); },
										}, __( 'Ta bort', 'frost-child' ) )
									)
								),
								el( TextControl, {
									label: __( 'Alt-text', 'frost-child' ),
									value: img.alt,
									onChange: function ( v ) { updateImage( idx, 'alt', v ); },
								} ),
								attrs.captionPosition !== 'none' && el( TextControl, {
									label: attrs.captionPosition === 'overlay'
										? __( 'Overlay-text', 'frost-child' )
										: __( 'Bildtext', 'frost-child' ),
									value: attrs.captionPosition === 'overlay' ? img.overlayText : img.caption,
									onChange: function ( v ) {
										updateImage( idx, attrs.captionPosition === 'overlay' ? 'overlayText' : 'caption', v );
									},
								} ),
								el( MediaUploadCheck, null,
									el( MediaUpload, {
										onSelect: function ( media ) { updateImage( idx, 'url', media.url ); },
										allowedTypes: [ 'image' ],
										render: function ( ref ) {
											return el( Button, {
												isSmall: true, variant: 'tertiary',
												onClick: ref.open,
											}, __( '🔄 Byt bild', 'frost-child' ) );
										},
									} )
								)
							)
						);
					} )
				)
				: el( 'div', { className: 'ic-empty' },
					el( 'p', null, __( 'Inga bilder ännu. Lägg till bilder ovan.', 'frost-child' ) )
				);

			/* ---------- Preview ---------- */
			var maxPreview = Math.min( attrs.visibleSlides, images.length );
			var preview = images.length > 0
				? el( 'div', { className: 'ic-preview' },
					el( 'h4', null, __( 'Förhandsgranskning', 'frost-child' ) ),
					el( 'div', {
						className: 'ic-preview-track',
						style: {
							'--ic-visible': maxPreview,
							'--ic-gap': attrs.gap + 'px',
							'--ic-height': attrs.imageHeight + 'px',
							'--ic-radius': attrs.borderRadius + 'px',
						},
					},
						images.slice( 0, maxPreview ).map( function ( img, idx ) {
							return el( 'div', { key: img.id, className: 'ic-preview-slide' },
								el( 'img', {
									src: img.url, alt: img.alt,
									style: { objectFit: attrs.imageFit },
								} ),
								attrs.captionPosition === 'overlay' && img.overlayText &&
									el( 'div', { className: 'ic-preview-overlay' }, img.overlayText ),
								attrs.captionPosition === 'below' && img.caption &&
									el( 'div', { className: 'ic-preview-caption' }, img.caption )
							);
						} )
					)
				) : null;

			/* ---------- render ---------- */
			return el( Fragment, null,
				inspector,
				el( 'div', { className: 'ic-editor-wrap' },
					el( 'div', { className: 'ic-editor-header' },
						el( 'span', { className: 'ic-icon dashicons dashicons-images-alt2' } ),
						el( 'span', { className: 'ic-title' }, __( 'Image Carousel', 'frost-child' ) ),
						images.length > 0 && el( 'span', { className: 'ic-count' }, images.length + ' ' + __( 'bilder', 'frost-child' ) )
					),
					preview,
					addArea,
					imageList
				)
			);
		},

		save: function ( props ) {
			var attrs = props.attributes;
			var images = attrs.images || [];
			if ( ! images.length ) return null;

			var arrowSvg = el( 'svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' },
				el( 'polyline', { points: '15 18 9 12 15 6' } )
			);
			var arrowSvgRight = el( 'svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '3', strokeLinecap: 'round', strokeLinejoin: 'round' },
				el( 'polyline', { points: '9 18 15 12 9 6' } )
			);

			var dataAttrs = {
				'data-visible': attrs.visibleSlides,
				'data-autoplay': attrs.autoplay ? 'true' : 'false',
				'data-autoplay-speed': attrs.autoplaySpeed,
				'data-transition-speed': attrs.transitionSpeed,
				'data-pause-hover': attrs.pauseOnHover ? 'true' : 'false',
				'data-infinite': attrs.infinite ? 'true' : 'false',
				'data-arrow-style': attrs.arrowStyle,
			};

			var wrapStyle = {
				'--ic-visible': attrs.visibleSlides,
				'--ic-gap': attrs.gap + 'px',
				'--ic-height': attrs.imageHeight + 'px',
				'--ic-radius': attrs.borderRadius + 'px',
				'--ic-transition': attrs.transitionSpeed + 'ms',
				'--ic-arrow-color': attrs.arrowColor,
				'--ic-arrow-bg': attrs.arrowBgColor,
				'--ic-arrow-size': attrs.arrowSize + 'px',
			};

			var slides = images.map( function ( img, idx ) {
				return el( 'div', { key: idx, className: 'ic-slide' },
					el( 'div', { className: 'ic-slide-inner' },
						el( 'img', {
							src: img.url,
							alt: img.alt || '',
							loading: idx === 0 ? 'eager' : 'lazy',
							style: { objectFit: attrs.imageFit },
						} ),
						attrs.captionPosition === 'overlay' && img.overlayText &&
							el( 'div', { className: 'ic-overlay-text' }, img.overlayText ),
						attrs.captionPosition === 'below' && img.caption &&
							el( 'div', { className: 'ic-caption' }, img.caption )
					)
				);
			} );

			return el( 'div',
				Object.assign( {}, blockEditor.useBlockProps.save(), dataAttrs, { style: wrapStyle, className: 'ic-carousel ic-caption-' + attrs.captionPosition } ),
				el( 'div', { className: 'ic-track-wrapper' },
					el( 'div', { className: 'ic-track' }, slides )
				),
				attrs.showArrows && el( 'button', { className: 'ic-arrow ic-arrow-prev', 'aria-label': 'Previous' }, arrowSvg ),
				attrs.showArrows && el( 'button', { className: 'ic-arrow ic-arrow-next', 'aria-label': 'Next' }, arrowSvgRight ),
				attrs.showDots && el( 'div', { className: 'ic-dots' },
					images.map( function ( _, idx ) {
						return el( 'button', { key: idx, className: 'ic-dot' + ( idx === 0 ? ' active' : '' ), 'data-index': idx, 'aria-label': 'Go to slide ' + ( idx + 1 ) } );
					} )
				)
			);
		},
	} );
} )(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor,
	window.wp.components,
	window.wp.i18n
);
