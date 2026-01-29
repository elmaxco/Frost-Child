<?php
/**
 * Frost Child Theme Functions
 */

if ( ! function_exists( 'frost_child_setup' ) ) {
	function frost_child_setup() {
		// Enqueue parent theme stylesheet
		wp_enqueue_style( 'frost-parent-style', get_template_directory_uri() . '/style.css' );
		
		// Enqueue child theme stylesheet
		wp_enqueue_style( 'frost-child-style', get_stylesheet_uri() );

		// Ensure styles load in the block editor
		add_theme_support( 'editor-styles' );
		add_editor_style( 'style.css' );
	}
}
add_action( 'wp_enqueue_scripts', 'frost_child_setup' );

/**
 * Register Review Carousel block (no build step).
 */
function frost_child_register_review_carousel_block() {
	$block_dir  = get_stylesheet_directory() . '/blocks/slide-image';
	$block_uri  = get_stylesheet_directory_uri() . '/blocks/slide-image';

	wp_register_script(
		'frost-child-review-carousel-editor',
		$block_uri . '/edit.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		filemtime( $block_dir . '/edit.js' ),
		true
	);

	wp_register_style(
		'frost-child-review-carousel',
		$block_uri . '/style.css',
		array(),
		filemtime( $block_dir . '/style.css' )
	);

	wp_register_style(
		'frost-child-review-carousel-editor',
		$block_uri . '/editor.css',
		array( 'wp-edit-blocks' ),
		filemtime( $block_dir . '/editor.css' )
	);

	// Register frontend carousel script
	wp_register_script(
		'frost-child-review-carousel-script',
		$block_uri . '/carousel.js',
		array(),
		filemtime( $block_dir . '/carousel.js' ),
		true
	);

	register_block_type( $block_dir, array(
		'script' => 'frost-child-review-carousel-script',
	) );
}
add_action( 'init', 'frost_child_register_review_carousel_block' );

/**
 * Register Dropdown Menu block (no build step).
 */
function frost_child_register_dropdown_menu_block() {
	$block_dir  = get_stylesheet_directory() . '/blocks/dropdown-menu';
	$block_uri  = get_stylesheet_directory_uri() . '/blocks/dropdown-menu';

	wp_register_script(
		'frost-child-dropdown-menu-editor',
		$block_uri . '/edit.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		filemtime( $block_dir . '/edit.js' ),
		true
	);

	wp_register_style(
		'frost-child-dropdown-menu',
		$block_uri . '/style.css',
		array(),
		filemtime( $block_dir . '/style.css' )
	);

	wp_register_style(
		'frost-child-dropdown-menu-editor',
		$block_uri . '/editor.css',
		array( 'wp-edit-blocks' ),
		filemtime( $block_dir . '/editor.css' )
	);

	wp_register_script(
		'frost-child-dropdown-menu-script',
		$block_uri . '/dropdown.js',
		array(),
		filemtime( $block_dir . '/dropdown.js' ),
		true
	);

	register_block_type( $block_dir, array(
		'editor_script' => 'frost-child-dropdown-menu-editor',
		'editor_style'  => 'frost-child-dropdown-menu-editor',
		'style'         => 'frost-child-dropdown-menu',
		'script'        => 'frost-child-dropdown-menu-script',
	) );
}
add_action( 'init', 'frost_child_register_dropdown_menu_block' );

/**
 * Register Flexible Navigation block (no build step).
 */
function frost_child_register_flexible_navigation_block() {
	$block_dir  = get_stylesheet_directory() . '/blocks/flexible-navigation';

	if ( ! file_exists( $block_dir . '/block.json' ) ) {
		return;
	}

	register_block_type( $block_dir );
}
add_action( 'init', 'frost_child_register_flexible_navigation_block' );
