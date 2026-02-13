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

/**
 * Register Flexible Nav Link block (no build step).
 */
function frost_child_register_flexible_nav_link_block() {
	$block_dir  = get_stylesheet_directory() . '/blocks/flexible-nav-link';

	if ( ! file_exists( $block_dir . '/block.json' ) ) {
		return;
	}

	register_block_type( $block_dir );
}
add_action( 'init', 'frost_child_register_flexible_nav_link_block' );

/**
 * Register Simple Dropdown block (no build step).
 */
function frost_child_register_simple_dropdown_block() {
	$block_dir  = get_stylesheet_directory() . '/blocks/simple-dropdown';

	if ( ! file_exists( $block_dir . '/block.json' ) ) {
		return;
	}

	register_block_type( $block_dir );
}
add_action( 'init', 'frost_child_register_simple_dropdown_block' );
/**
 * Register Customer Reviews block (no build step).
 */
function frost_child_register_customer_reviews_block() {
	$block_dir  = get_stylesheet_directory() . '/blocks/review-carousel';
	$block_uri  = get_stylesheet_directory_uri() . '/blocks/review-carousel';

	if ( ! file_exists( $block_dir . '/block.json' ) ) {
		return;
	}

	wp_register_script(
		'frost-child-customer-reviews-editor',
		$block_uri . '/edit.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		filemtime( $block_dir . '/edit.js' ),
		true
	);

	wp_register_style(
		'frost-child-customer-reviews-editor',
		$block_uri . '/editor.css',
		array( 'wp-edit-blocks' ),
		filemtime( $block_dir . '/editor.css' )
	);

	wp_register_style(
		'frost-child-customer-reviews-style',
		$block_uri . '/style.css',
		array(),
		filemtime( $block_dir . '/style.css' )
	);

	wp_register_script(
		'frost-child-customer-reviews-view',
		$block_uri . '/view.js',
		array(),
		filemtime( $block_dir . '/view.js' ),
		true
	);

	register_block_type( $block_dir, array(
		'editor_script' => 'frost-child-customer-reviews-editor',
		'editor_style'  => 'frost-child-customer-reviews-editor',
		'style'         => 'frost-child-customer-reviews-style',
		'script'        => 'frost-child-customer-reviews-view',
		'view_script'   => 'frost-child-customer-reviews-view',
	) );
}
add_action( 'init', 'frost_child_register_customer_reviews_block' );

/**
 * Alphabet Filter: REST endpoint + helper WHERE clause.
 */
function frost_child_alphabet_filter_posts_where_starts_with( $where, $query ) {
	global $wpdb;

	$starts_with = $query->get( 'frost_child_starts_with' );
	if ( ! is_string( $starts_with ) || $starts_with === '' ) {
		return $where;
	}

	// Expect a single letter (A-Z, Å, Ä, Ö). Keep it strict.
	$starts_with = trim( $starts_with );
	if ( $starts_with === '' ) {
		return $where;
	}

	// Use a LIKE prefix match.
	$like = $wpdb->esc_like( $starts_with ) . '%';
	$where .= $wpdb->prepare( " AND {$wpdb->posts}.post_title LIKE %s ", $like );

	return $where;
}
add_filter( 'posts_where', 'frost_child_alphabet_filter_posts_where_starts_with', 10, 2 );

function frost_child_register_alphabet_filter_rest_route() {
	register_rest_route(
		'frost-child/v1',
		'/alphabet-filter',
		array(
			'methods'             => 'GET',
			'permission_callback' => '__return_true',
			'callback'            => 'frost_child_alphabet_filter_rest_callback',
			'args'                => array(
				'postType' => array(
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_key',
					'default'           => 'post',
				),
				's' => array(
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
					'default'           => '',
				),
				'letter' => array(
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_text_field',
					'default'           => '',
				),
				'perPage' => array(
					'type'              => 'integer',
					'required'          => false,
					'sanitize_callback' => 'absint',
					'default'           => 100,
				),
				'page' => array(
					'type'              => 'integer',
					'required'          => false,
					'sanitize_callback' => 'absint',
					'default'           => 1,
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'frost_child_register_alphabet_filter_rest_route' );

function frost_child_alphabet_filter_rest_callback( WP_REST_Request $request ) {
	$post_type = $request->get_param( 'postType' );
	$search    = $request->get_param( 's' );
	$letter    = $request->get_param( 'letter' );
	$per_page  = (int) $request->get_param( 'perPage' );
	$page      = (int) $request->get_param( 'page' );

	if ( ! $post_type ) {
		$post_type = 'post';
	}

	$per_page = max( 1, min( 200, $per_page ) );
	$page     = max( 1, $page );

	$starts_with = '';
	if ( is_string( $letter ) ) {
		$letter = trim( $letter );
		// Treat "ALLA" as no filter.
		if ( $letter !== '' && mb_strtoupper( $letter ) !== 'ALLA' ) {
			// Only first character matters.
			$starts_with = mb_substr( $letter, 0, 1 );
		}
	}

	$args = array(
		'post_type'              => $post_type,
		'post_status'            => 'publish',
		'posts_per_page'         => $per_page,
		'paged'                  => $page,
		'ignore_sticky_posts'    => true,
		'no_found_rows'          => false,
		'orderby'                => 'title',
		'order'                  => 'ASC',
		's'                      => is_string( $search ) ? $search : '',
		'frost_child_starts_with'=> $starts_with,
	);

	$query = new WP_Query( $args );

	$items = array();
	foreach ( $query->posts as $post ) {
		$items[] = array(
			'id'    => (int) $post->ID,
			'title' => get_the_title( $post ),
			'url'   => get_permalink( $post ),
		);
	}

	return rest_ensure_response(
		array(
			'items'      => $items,
			'total'      => (int) $query->found_posts,
			'totalPages' => (int) $query->max_num_pages,
			'page'       => $page,
			'perPage'    => $per_page,
			'postType'   => $post_type,
			'letter'     => $starts_with,
			's'          => is_string( $search ) ? $search : '',
		)
	);
}

/**
 * Register Image Carousel block (no build step).
 */
function frost_child_register_image_carousel_block() {
	$block_dir = get_stylesheet_directory() . '/blocks/image-carousel';
	$block_uri = get_stylesheet_directory_uri() . '/blocks/image-carousel';

	if ( ! file_exists( $block_dir . '/block.json' ) ) {
		return;
	}

	wp_register_script(
		'frost-child-image-carousel-editor',
		$block_uri . '/edit.js',
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n' ),
		filemtime( $block_dir . '/edit.js' ),
		true
	);

	wp_register_style(
		'frost-child-image-carousel-editor',
		$block_uri . '/editor.css',
		array( 'wp-edit-blocks' ),
		filemtime( $block_dir . '/editor.css' )
	);

	wp_register_style(
		'frost-child-image-carousel-style',
		$block_uri . '/style.css',
		array(),
		filemtime( $block_dir . '/style.css' )
	);

	wp_register_script(
		'frost-child-image-carousel-view',
		$block_uri . '/view.js',
		array(),
		filemtime( $block_dir . '/view.js' ),
		true
	);

	register_block_type( $block_dir, array(
		'editor_script' => 'frost-child-image-carousel-editor',
		'editor_style'  => 'frost-child-image-carousel-editor',
		'style'         => 'frost-child-image-carousel-style',
		'script'        => 'frost-child-image-carousel-view',
		'view_script'   => 'frost-child-image-carousel-view',
	) );
}
add_action( 'init', 'frost_child_register_image_carousel_block' );

/**
 * Register Alphabet Filter block (no build step).
 */
function frost_child_register_alphabet_filter_block() {
	$block_dir = get_stylesheet_directory() . '/blocks/alphabet-filter';

	if ( ! file_exists( $block_dir . '/block.json' ) ) {
		return;
	}

	register_block_type( $block_dir );
}
add_action( 'init', 'frost_child_register_alphabet_filter_block' );