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
