( function ( blocks, element, blockEditor, components, i18n ) {
	var el = element.createElement;
	var Fragment = element.Fragment;
	var InspectorControls = blockEditor.InspectorControls;
	var PanelBody = components.PanelBody;
	var TextControl = components.TextControl;
	var TextareaControl = components.TextareaControl;
	var Button = components.Button;
	var Card = components.Card;
	var CardBody = components.CardBody;
	var __ = i18n.__;

	blocks.registerBlockType( 'frost-child/dropdown-menu', {
		title: __( 'Dropdown Menu Button', 'frost-child' ),
		description: __( 'A button with a customizable dropdown menu with services and locations.', 'frost-child' ),
		icon: 'menu-alt',
		category: 'widgets',
		supports: {
			align: true,
		},
		attributes: {
			buttonText: { type: 'string', default: 'Tjänster' },
			menuItems: { 
				type: 'array', 
				default: [
					{
						title: 'Renovering',
						subtitle: 'T.ex. Badrum, kök eller större renovering',
						description: 'Vid en större renovering, som badrum, kök eller större del av hemmet, är noggrann planering, skickliga hantverkare och rätt stöd avgörande för att göra resan mot ditt drömboende smidig och inspirerande!',
						tags: ['Hantverkare', 'Material', 'Projektledning'],
						buttonText: 'Läs mer',
						buttonLink: '#'
					},
					{
						title: 'Mindre jobb eller småfix',
						subtitle: 'T.ex. Eluttag eller måla om några rum',
						description: '',
						tags: [],
						buttonText: '',
						buttonLink: '#'
					}
				]
			},
			locations: { 
				type: 'array', 
				default: ['Stockholm', 'Göteborg', 'Uppsala'] 
			},
			popularServices: { 
				type: 'array', 
				default: [
					'Badrumsrenovering',
					'Köksrenovering',
					'Måla om',
					'Lägga nytt golv',
					'Nya eluttag',
					'Tapetsera',
					'Sätta up tavlor'
				]
			},
			popularServicesTitle: { type: 'string', default: 'Populära tjänster' }
		},

		edit: function ( props ) {
			var attributes = props.attributes;
			var setAttributes = props.setAttributes;
			var buttonText = attributes.buttonText;
			var menuItems = attributes.menuItems;
			var locations = attributes.locations;
			var popularServices = attributes.popularServices;
			var popularServicesTitle = attributes.popularServicesTitle;

			function updateMenuItem( index, key, value ) {
				var newMenuItems = menuItems.slice();
				newMenuItems[index][key] = value;
				setAttributes( { menuItems: newMenuItems } );
			}

			function updateMenuItemTag( menuIndex, tagIndex, value ) {
				var newMenuItems = menuItems.slice();
				newMenuItems[menuIndex].tags[tagIndex] = value;
				setAttributes( { menuItems: newMenuItems } );
			}

			function addMenuItem() {
				setAttributes( {
					menuItems: menuItems.concat( [{
						title: 'New Item',
						subtitle: '',
						description: '',
						tags: [],
						buttonText: '',
						buttonLink: '#'
					}] )
				} );
			}

			function removeMenuItem( index ) {
				var newMenuItems = menuItems.filter( function ( item, i ) {
					return i !== index;
				} );
				setAttributes( { menuItems: newMenuItems } );
			}

			function addTag( menuIndex ) {
				var newMenuItems = menuItems.slice();
				if ( !newMenuItems[menuIndex].tags ) {
					newMenuItems[menuIndex].tags = [];
				}
				newMenuItems[menuIndex].tags.push( 'New Tag' );
				setAttributes( { menuItems: newMenuItems } );
			}

			function removeTag( menuIndex, tagIndex ) {
				var newMenuItems = menuItems.slice();
				newMenuItems[menuIndex].tags = newMenuItems[menuIndex].tags.filter( function ( tag, i ) {
					return i !== tagIndex;
				} );
				setAttributes( { menuItems: newMenuItems } );
			}

			function updateLocation( index, value ) {
				var newLocations = locations.slice();
				newLocations[index] = value;
				setAttributes( { locations: newLocations } );
			}

			function addLocation() {
				setAttributes( { locations: locations.concat( ['New Location'] ) } );
			}

			function removeLocation( index ) {
				var newLocations = locations.filter( function ( loc, i ) {
					return i !== index;
				} );
				setAttributes( { locations: newLocations } );
			}

			function updatePopularService( index, value ) {
				var newServices = popularServices.slice();
				newServices[index] = value;
				setAttributes( { popularServices: newServices } );
			}

			function addPopularService() {
				setAttributes( { popularServices: popularServices.concat( ['New Service'] ) } );
			}

			function removePopularService( index ) {
				var newServices = popularServices.filter( function ( service, i ) {
					return i !== index;
				} );
				setAttributes( { popularServices: newServices } );
			}

			return el(
				Fragment,
				{},
				el(
					InspectorControls,
					{},
					el(
						PanelBody,
						{ title: __( 'Button Settings', 'frost-child' ), initialOpen: true },
						el( TextControl, {
							label: __( 'Button Text', 'frost-child' ),
							value: buttonText,
							onChange: function ( value ) {
								setAttributes( { buttonText: value } );
							}
						} )
					),
					el(
						PanelBody,
						{ title: __( 'Menu Items', 'frost-child' ), initialOpen: true },
						menuItems.map( function ( item, menuIndex ) {
							return el(
								Card,
								{ key: menuIndex, style: { marginBottom: '20px' } },
								el(
									CardBody,
									{},
									el( 'h3', { style: { marginTop: 0 } }, __( 'Menu Item ', 'frost-child' ) + ( menuIndex + 1 ) ),
									el( TextControl, {
										label: __( 'Title', 'frost-child' ),
										value: item.title,
										onChange: function ( value ) {
											updateMenuItem( menuIndex, 'title', value );
										}
									} ),
									el( TextControl, {
										label: __( 'Subtitle', 'frost-child' ),
										value: item.subtitle,
										onChange: function ( value ) {
											updateMenuItem( menuIndex, 'subtitle', value );
										}
									} ),
									el( TextareaControl, {
										label: __( 'Description', 'frost-child' ),
										value: item.description,
										onChange: function ( value ) {
											updateMenuItem( menuIndex, 'description', value );
										}
									} ),
									el( 'h4', {}, __( 'Tags', 'frost-child' ) ),
									( item.tags || [] ).map( function ( tag, tagIndex ) {
										return el(
											'div',
											{ key: tagIndex, style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
											el( TextControl, {
												value: tag,
												onChange: function ( value ) {
													updateMenuItemTag( menuIndex, tagIndex, value );
												}
											} ),
											el( Button, {
												isDestructive: true,
												onClick: function () {
													removeTag( menuIndex, tagIndex );
												}
											}, __( 'Remove', 'frost-child' ) )
										);
									} ),
									el( Button, {
										isSecondary: true,
										onClick: function () {
											addTag( menuIndex );
										},
										style: { marginBottom: '10px' }
									}, __( 'Add Tag', 'frost-child' ) ),
									el( TextControl, {
										label: __( 'Button Text', 'frost-child' ),
										value: item.buttonText,
										onChange: function ( value ) {
											updateMenuItem( menuIndex, 'buttonText', value );
										}
									} ),
									el( TextControl, {
										label: __( 'Button Link', 'frost-child' ),
										value: item.buttonLink,
										onChange: function ( value ) {
											updateMenuItem( menuIndex, 'buttonLink', value );
										}
									} ),
									el( Button, {
										isDestructive: true,
										onClick: function () {
											removeMenuItem( menuIndex );
										}
									}, __( 'Remove Menu Item', 'frost-child' ) )
								)
							);
						} ),
						el( Button, {
							isPrimary: true,
							onClick: addMenuItem
						}, __( 'Add Menu Item', 'frost-child' ) )
					),
					el(
						PanelBody,
						{ title: __( 'Locations', 'frost-child' ) },
						locations.map( function ( location, index ) {
							return el(
								'div',
								{ key: index, style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
								el( TextControl, {
									value: location,
									onChange: function ( value ) {
										updateLocation( index, value );
									}
								} ),
								el( Button, {
									isDestructive: true,
									onClick: function () {
										removeLocation( index );
									}
								}, __( 'Remove', 'frost-child' ) )
							);
						} ),
						el( Button, {
							isSecondary: true,
							onClick: addLocation
						}, __( 'Add Location', 'frost-child' ) )
					),
					el(
						PanelBody,
						{ title: __( 'Popular Services', 'frost-child' ) },
						el( TextControl, {
							label: __( 'Section Title', 'frost-child' ),
							value: popularServicesTitle,
							onChange: function ( value ) {
								setAttributes( { popularServicesTitle: value } );
							}
						} ),
						popularServices.map( function ( service, index ) {
							return el(
								'div',
								{ key: index, style: { display: 'flex', gap: '8px', marginBottom: '8px' } },
								el( TextControl, {
									value: service,
									onChange: function ( value ) {
										updatePopularService( index, value );
									}
								} ),
								el( Button, {
									isDestructive: true,
									onClick: function () {
										removePopularService( index );
									}
								}, __( 'Remove', 'frost-child' ) )
							);
						} ),
						el( Button, {
							isSecondary: true,
							onClick: addPopularService
						}, __( 'Add Service', 'frost-child' ) )
					)
				),
				el(
					'div',
					{ className: 'wp-block-frost-child-dropdown-menu' },
					el(
						'div',
						{ className: 'dropdown-menu-wrapper', style: { padding: '20px', border: '1px dashed #ccc' } },
						el(
							'button',
							{ className: 'dropdown-menu-button', type: 'button' },
							buttonText,
							' ',
							el( 'span', { className: 'dropdown-arrow' }, '▼' )
						),
						el(
							'div',
							{ className: 'dropdown-menu-preview' },
							el(
								'p',
								{ style: { padding: '10px', background: '#f0f0f0', textAlign: 'center' } },
								__( 'Dropdown Menu (Preview in editor - see sidebar to edit)', 'frost-child' )
							)
						)
					)
				)
			);
		},

		save: function () {
			return null; // Dynamic block rendered via PHP
		}
	} );

} )( window.wp.blocks, window.wp.element, window.wp.blockEditor, window.wp.components, window.wp.i18n );
