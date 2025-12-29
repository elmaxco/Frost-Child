( function ( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var RangeControl = components.RangeControl;
	var Button = components.Button;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var Card = components.Card;
	var CardBody = components.CardBody;
	var __ = i18n.__;

	blocks.registerBlockType( 'frost-child/review-carousel', {
		title: __( 'Review Carousel', 'frost-child' ),
		description: __( 'Display customer reviews in a carousel format.', 'frost-child' ),
		icon: 'format-quote',
		category: 'design',
		supports: {
			align: [ 'wide', 'full' ],
			spacing: {
				margin: true,
				padding: true,
			},
		},
		attributes: {
			reviews: { type: 'array', default: [] },
			speed: { type: 'number', default: 8 },
			visibleCards: { type: 'number', default: 3 },
		},

		edit: function ( props ) {
			var reviews = props.attributes.reviews || [];
			var speed = props.attributes.speed || 8;
			var visibleCards = props.attributes.visibleCards || 3;
			var setAttributes = props.setAttributes;

			var addReview = function () {
				var newReview = {
					id: Date.now(),
					name: __( 'Review Author', 'frost-child' ),
					time: __( '1 vecka sedan', 'frost-child' ),
					rating: 5,
					text: __( 'Great product and service!', 'frost-child' ),
				};
				var updatedReviews = [ ...reviews, newReview ];
				setAttributes( { reviews: updatedReviews } );
			};

			var updateReview = function ( index, field, value ) {
				var updatedReviews = [ ...reviews ];
				updatedReviews[ index ][ field ] = value;
				setAttributes( { reviews: updatedReviews } );
			};

			var removeReview = function ( index ) {
				var updatedReviews = reviews.filter( function ( _, i ) { return i !== index; } );
				setAttributes( { reviews: updatedReviews } );
			};

			var renderStars = function ( rating ) {
				var colors = [ '#F9C63C', '#3096D0', '#ED2281', '#C3DA4A', '#F9C63C' ];
				var stars = [];
				for ( var i = 0; i < 5; i++ ) {
					var color = i < rating ? colors[ i ] : '#e0e0e0';
					stars.push(
						el(
							'svg',
							{ key: i, className: 'star-svg', width: 16, height: 16, viewBox: '0 0 16 16' },
							el( 'circle', { cx: 8, cy: 8, r: 6, fill: color } )
						)
					);
				}
				return stars;
			};

			var inspector = el(
				InspectorControls,
				null,
				el(
					PanelBody,
					{ title: __( 'Carousel Settings', 'frost-child' ), initialOpen: true },
					el( RangeControl, {
						label: __( 'Visible Cards', 'frost-child' ),
						min: 1,
						max: 5,
						value: visibleCards,
						onChange: function ( value ) {
							setAttributes( { visibleCards: value } );
						},
					} ),
					el( RangeControl, {
						label: __( 'Duration (seconds)', 'frost-child' ),
						min: 4,
						max: 20,
						value: speed,
						onChange: function ( value ) {
							setAttributes( { speed: value } );
						},
					} )
				)
			);

			var reviewsList = reviews.length > 0
				? el(
					Fragment,
					null,
					el( 'div', { className: 'review-carousel-preview', style: { '--carousel-duration': speed + 's' } },
						reviews.map( function ( review, idx ) {
							return el( 'div', { key: review.id, className: 'review-card' },
								el( 'div', { className: 'review-header' },
									el( 'div', { className: 'review-title' }, review.name ),
									el( 'div', { className: 'review-time' }, review.time )
								),
								el( 'div', { className: 'review-rating' }, renderStars( review.rating ) ),
								el( 'div', { className: 'review-text' }, review.text )
							);
						} )
					),
					el( 'div', { className: 'review-editor-list' },
						reviews.map( function ( review, idx ) {
							return el( Card, { key: review.id, className: 'review-edit-card' },
								el( CardBody,
									null,
									el( TextControl, {
										label: __( 'Author Name', 'frost-child' ),
										value: review.name,
										onChange: function ( value ) { updateReview( idx, 'name', value ); },
									} ),
									el( TextControl, {
										label: __( 'Time', 'frost-child' ),
										value: review.time,
										placeholder: '1 vecka sedan',
										onChange: function ( value ) { updateReview( idx, 'time', value ); },
									} ),
									el( RangeControl, {
										label: __( 'Rating', 'frost-child' ),
										min: 1,
										max: 5,
										value: review.rating,
										onChange: function ( value ) { updateReview( idx, 'rating', value ); },
									} ),
									el( TextareaControl, {
										label: __( 'Review Text', 'frost-child' ),
										value: review.text,
										onChange: function ( value ) { updateReview( idx, 'text', value ); },
									} ),
									el( Button, { isDestructive: true, isSmall: true, onClick: function () { removeReview( idx ); } }, __( 'Remove Review', 'frost-child' ) )
								)
							);
						} )
					)
				)
				: el( 'div', { className: 'review-placeholder' },
					el( 'p', null, __( 'No reviews yet. Add your first review!', 'frost-child' ) )
				);

			return el(
				Fragment,
				null,
				inspector,
				reviewsList,
				el( Button, { isPrimary: true, onClick: addReview }, __( '+ Add Review', 'frost-child' ) )
			);
		},

			save: function ( props ) {
			var reviews = props.attributes.reviews || [];
			var speed = props.attributes.speed || 8;
			var visibleCards = props.attributes.visibleCards || 3;

			var renderStars = function ( rating ) {
				var colors = [ '#F9C63C', '#3096D0', '#ED2281', '#C3DA4A', '#F9C63C' ];
				var stars = [];
				for ( var i = 0; i < 5; i++ ) {
					var color = i < rating ? colors[ i ] : '#e0e0e0';
					stars.push(
						el(
							'svg',
							{ key: i, className: 'star-svg', width: 16, height: 16, viewBox: '0 0 16 16' },
							el( 'circle', { cx: 8, cy: 8, r: 6, fill: color } )
						)
					);
				}
				return stars;
			};

			return el(
				'div',
				{ className: 'review-carousel-wrapper', style: { '--carousel-duration': speed + 's', '--visible-cards': visibleCards }, 'data-visible-cards': visibleCards },
				el( 'div', { className: 'review-carousel' },
					reviews.map( function ( review, idx ) {
						return el( 'div', { key: review.id, className: 'review-card' },
							el( 'div', { className: 'review-header' },
								el( 'div', { className: 'review-title' }, review.name ),
								el( 'div', { className: 'review-time' }, review.time )
							),
							el( 'div', { className: 'review-rating' }, renderStars( review.rating ) ),
							el( 'div', { className: 'review-text' }, review.text )
						);
					} )
				),
				el( 'div', { className: 'review-controls' },
					el( 'button', { className: 'review-nav review-nav-prev' }, '<' ),
					el( 'button', { className: 'review-nav review-nav-next' }, '>' )
				)
			);
		},
	} );
} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );

