<?php
/**
 * Plugin Name: Account Icon Block
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: An Account Icon Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package blockons
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load all translations for our plugin from the MO file.
 */
function blockons_featured_product_load_textdomain() {
	load_plugin_textdomain( 'blockons', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'blockons_featured_product_load_textdomain' );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function blockons_featured_product_register_block() {

	// Register the block by passing the location of block.json.
	register_block_type( __DIR__);

	if ( function_exists( 'wp_set_script_translations' ) ) {
		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( 'blockons-featured-product', 'blockons' );
	}

}
add_action( 'init', 'blockons_featured_product_register_block' );
