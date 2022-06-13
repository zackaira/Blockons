<?php
/**
 * Plugin Name: Block-Ons
 * Version: 1.0.0
 * Plugin URI: https://blockons.com/
 * Description: WordPress editor blocks for you to build your website.
 * Author: Kaira
 * Author URI: https://kairaweb.com/
 * Requires at least: 5.0
 * Tested up to: 6.0
 * WC requires at least: 7.3
 * WC tested up to: 7.8
 * Text Domain: blockons
 * Domain Path: /lang/
 *
 * @package blockons
 */
defined( 'ABSPATH' ) || exit;

if ( !defined( 'BLOCKONS_PLUGIN_VERSION' ) ) {
	define('BLOCKONS_PLUGIN_VERSION', '1.0.0');
}

/**
 * Include Plugin Files
 */
// Plugin API settings setup
require_once 'classes/class-admin-settings.php';
// Include Block Styles for External blocks
require plugin_dir_path( __FILE__ ) . '/inc/block-styles.php';

/**
 * Include Blockons blocks
 */
// Site Blocks
require plugin_dir_path( __FILE__ ) . 'build/blocks/account-icon/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/cart-icon/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/search/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/icon-list/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/line-heading/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/progress-bars/index.php';
// WooCommerce Blocks
require plugin_dir_path( __FILE__ ) . 'build/blocks/featured-product/index.php';

/**
 * Register scripts to be called by Block.json script/style
 */
function blockons_register_theme_scripts() {
	// Font Awesome Free
	wp_register_style( 'blockons-fontawesome', plugin_dir_url( __FILE__ ) . '/assets/font-awesome/css/all.min.css', array(), BLOCKONS_PLUGIN_VERSION );
	// Cart Icon Block JS
	wp_register_script( 'blockons-cart-icon', plugin_dir_url( __FILE__ ) . '/assets/blocks/cart-icon/cart.js', array(), BLOCKONS_PLUGIN_VERSION );
	// Progress Bars JS
	wp_register_script( 'blockons-waypoint', plugin_dir_url( __FILE__ ) . '/assets/blocks/progress-bars/waypoints.min.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_register_script( 'blockons-waypoint-inview', plugin_dir_url( __FILE__ ) . '/assets/blocks/progress-bars/inview.min.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_register_script( 'blockons-progress-bars', plugin_dir_url( __FILE__ ) . '/assets/blocks/progress-bars/progress-bars.js', array( 'blockons-waypoint', 'blockons-waypoint-inview' ), BLOCKONS_PLUGIN_VERSION );

	wp_register_script( 'blockons-file', plugin_dir_url( __FILE__ ) . '/assets/blocks/product-slider/file.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_localize_script('blockons-file', 'siteObj', array(
		'apiUrl' => esc_url(home_url('/wp-json')),
	));
}
add_action('init', 'blockons_register_theme_scripts');

// File to include Cart & Mini Cart for the cart icon block
if (has_block('blockons/cart-icon')) {
	require plugin_dir_path( __FILE__ ) . 'assets/blocks/cart-icon/cart.php';
}

/**
 * Create Blockons blocks Category
 */
function blockons_blocks_custom_category($categories, $post) {
	return array_merge(
		$categories,
		array(
			array(
				"slug" => "blockons-category",
				"title" => __("Block-Ons Blocks", "arcane"),
				// "icon" => "wordpress",
			)
		)
	);
}
add_filter('block_categories_all', 'blockons_blocks_custom_category', 10, 2);
