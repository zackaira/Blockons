<?php
/**
 * Plugin Name: Block-Ons (WORKING)
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: This is a plugin demonstrating how to register new blocks for the Gutenberg editor.
 * Version: 1.1.0
 * Author: the Gutenberg Team
 *
 * @package blockons
 */

defined( 'ABSPATH' ) || exit;

if ( !defined( 'BLOCKONS_PLUGIN_VERSION' ) ) {
	define('BLOCKONS_PLUGIN_VERSION', '1.0.0');
}

if (has_block('blockons/cart-icon')) {
	require plugin_dir_path( __FILE__ ) . 'assets/blocks/cart-icon/cart.php';
}

require plugin_dir_path( __FILE__ ) . 'build/blocks/account-icon/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/cart-icon/index.php';
require plugin_dir_path( __FILE__ ) . 'build/blocks/search/index.php';
// require plugin_dir_path( __FILE__ ) . 'build/blocks/05-recipe-card-esnext/index.php';
// require plugin_dir_path( __FILE__ ) . 'build/blocks/10-dynamic-block/index.php';

/**
 * Register scripts to be called by Block.json script/style
 */
function blockons_register_theme_scripts() {
	// Font Awesome Free
	wp_register_style( 'blockons-fontawesome', plugin_dir_url( __FILE__ ) . '/assets/font-awesome/css/all.min.css', array(), BLOCKONS_PLUGIN_VERSION );
	// Cart Icon Block JS
	wp_register_script( 'blockons-cart-icon', plugin_dir_url( __FILE__ ) . '/assets/blocks/cart-icon/cart.js', array(), BLOCKONS_PLUGIN_VERSION );
}
add_action('init', 'blockons_register_theme_scripts');

/**
 * Custom Blocks Category
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
