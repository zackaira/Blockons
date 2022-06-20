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
if ( !defined( 'BLOCKONS_PLUGIN_URL' ) ) {
	define('BLOCKONS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}
if ( !defined( 'BLOCKONS_PLUGIN_DIR' ) ) {
	define('BLOCKONS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

/**
 * Include Plugin Files
 */
// Plugin API settings setup
require_once 'classes/class-admin-settings.php';
// Include Block Styles for External blocks
require BLOCKONS_PLUGIN_DIR . '/inc/block-styles.php';

/**
 * Include Blockons blocks
 */
// Site Blocks
require BLOCKONS_PLUGIN_DIR . 'build/blocks/search/index.php';
require BLOCKONS_PLUGIN_DIR . 'build/blocks/icon-list/index.php';
require BLOCKONS_PLUGIN_DIR . 'build/blocks/line-heading/index.php';
require BLOCKONS_PLUGIN_DIR . 'build/blocks/progress-bars/index.php';
require BLOCKONS_PLUGIN_DIR . 'build/blocks/marketing-button/index.php';
require BLOCKONS_PLUGIN_DIR . 'build/blocks/testimonials/index.php';
// WooCommerce Blocks
if ( blockons_is_plugin_active( 'woocommerce.php' ) ) {
	require BLOCKONS_PLUGIN_DIR . 'build/blocks/account-icon/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/blocks/cart-icon/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/blocks/featured-product/index.php';
}

/**
 * Register scripts to be called by Block.json script/style
 */
function blockons_register_theme_scripts() {
	// Font Awesome Free
	wp_register_style( 'blockons-fontawesome', BLOCKONS_PLUGIN_URL . '/assets/font-awesome/css/all.min.css', array(), BLOCKONS_PLUGIN_VERSION );
	// Cart Icon Block JS
	wp_register_script( 'blockons-cart-icon', BLOCKONS_PLUGIN_URL . '/assets/blocks/cart-icon/cart.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_localize_script( 'blockons-cart-icon', 'cartIconObj', array(
		'wcCartUrl' => esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ),
	));
	// Progress Bars JS
	wp_register_script( 'blockons-waypoint', BLOCKONS_PLUGIN_URL . '/assets/blocks/progress-bars/waypoints.min.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_register_script( 'blockons-waypoint-inview', BLOCKONS_PLUGIN_URL . '/assets/blocks/progress-bars/inview.min.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_register_script( 'blockons-progress-bars', BLOCKONS_PLUGIN_URL . '/assets/blocks/progress-bars/progress-bars.js', array( 'blockons-waypoint', 'blockons-waypoint-inview' ), BLOCKONS_PLUGIN_VERSION );
	
	wp_register_script( 'blockons-file', BLOCKONS_PLUGIN_URL . '/assets/blocks/featured-product/file.js', array(), BLOCKONS_PLUGIN_VERSION );
	wp_localize_script( 'blockons-file', 'siteObj', array(
		'apiUrl' => esc_url(home_url('/wp-json') ),
	));
}
add_action('init', 'blockons_register_theme_scripts');

// File to include Cart & Mini Cart for the cart icon block
// if ( has_block( 'blockons/cart-icon' ) ) {
// 	require BLOCKONS_PLUGIN_DIR . 'assets/blocks/cart-icon/cart.php';
// }

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

function blockons_is_plugin_active( $plugin_name ) {
	// Get Active Plugin Setting
	$active_plugins = (array) get_option('active_plugins', array());
	if (is_multisite()) {
		$active_plugins = array_merge($active_plugins, array_keys(get_site_option( 'active_sitewide_plugins', array())));
	}

	$plugin_filenames = array();
	foreach ($active_plugins as $plugin) {
		if (false !== strpos( $plugin, '/') ) {
			// normal plugin name (plugin-dir/plugin-filename.php)
			list(, $filename ) = explode( '/', $plugin);
		} else {
			// no directory, just plugin file
			$filename = $plugin;
		}
		$plugin_filenames[] = $filename;
	}
	return in_array($plugin_name, $plugin_filenames);
}
