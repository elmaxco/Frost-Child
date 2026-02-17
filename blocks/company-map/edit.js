( function ( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var __ = i18n.__;
	var useBlockProps = blockEditor.useBlockProps;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var RangeControl = components.RangeControl;

	function buildMapUrl( attrs ) {
		var zoom = typeof attrs.zoom === 'number' ? attrs.zoom : 13;
		var hasCoords = attrs.latitude && attrs.longitude;
		var query = hasCoords
			? attrs.latitude + ',' + attrs.longitude
			: [ attrs.companyName, attrs.address ].filter( Boolean ).join( ' ' );

		if ( ! query ) {
			query = 'Stockholm';
		}

		return 'https://www.google.com/maps?q=' + encodeURIComponent( query ) + '&z=' + zoom + '&output=embed';
	}

	blocks.registerBlockType( 'frost-child/company-map', {
		title: __( 'Company Google Map', 'frost-child' ),
		icon: 'location-alt',
		category: 'widgets',
		description: __( 'Google Maps section with selectable company pin and editable content.', 'frost-child' ),

		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps = useBlockProps( { className: 'frost-child-company-map' } );
			var mapUrl = buildMapUrl( attributes );

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: __( 'Map Settings', 'frost-child' ), initialOpen: true },
						el( TextControl, {
							label: __( 'Company name', 'frost-child' ),
							value: attributes.companyName,
							onChange: function ( value ) {
								setAttributes( { companyName: value } );
							},
						} ),
						el( TextControl, {
							label: __( 'Address / city', 'frost-child' ),
							value: attributes.address,
							onChange: function ( value ) {
								setAttributes( { address: value } );
							},
						} ),
						el( TextControl, {
							label: __( 'Latitude (optional)', 'frost-child' ),
							help: __( 'If both latitude and longitude are set, they are used as the exact pin location.', 'frost-child' ),
							value: attributes.latitude,
							onChange: function ( value ) {
								setAttributes( { latitude: value } );
							},
						} ),
						el( TextControl, {
							label: __( 'Longitude (optional)', 'frost-child' ),
							value: attributes.longitude,
							onChange: function ( value ) {
								setAttributes( { longitude: value } );
							},
						} ),
						el( RangeControl, {
							label: __( 'Zoom', 'frost-child' ),
							min: 5,
							max: 20,
							value: attributes.zoom,
							onChange: function ( value ) {
								setAttributes( { zoom: value } );
							},
						} ),
						el( RangeControl, {
							label: __( 'Map height (px)', 'frost-child' ),
							min: 260,
							max: 800,
							step: 10,
							value: attributes.mapHeight,
							onChange: function ( value ) {
								setAttributes( { mapHeight: value } );
							},
						} )
					)
				),
				el(
					'div',
					blockProps,
					el(
						'div',
						{ className: 'frost-child-company-map__map', style: { minHeight: attributes.mapHeight + 'px' } },
						el( 'iframe', {
							className: 'frost-child-company-map__iframe',
							title: __( 'Company location map', 'frost-child' ),
							src: mapUrl,
							loading: 'lazy',
							allowFullScreen: true,
							referrerPolicy: 'no-referrer-when-downgrade',
						} )
					)
				)
			);
		},

		save: function ( props ) {
			var attributes = props.attributes;
			var blockProps = blockEditor.useBlockProps.save( { className: 'frost-child-company-map' } );
			var mapUrl = buildMapUrl( attributes );

			return el(
				'div',
				blockProps,
				el(
					'div',
					{ className: 'frost-child-company-map__map', style: { minHeight: attributes.mapHeight + 'px' } },
					el( 'iframe', {
						className: 'frost-child-company-map__iframe',
						title: __( 'Company location map', 'frost-child' ),
						src: mapUrl,
						loading: 'lazy',
						allowFullScreen: true,
						referrerPolicy: 'no-referrer-when-downgrade',
					} )
				)
			);
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );
