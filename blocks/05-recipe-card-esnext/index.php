<?php
/**
 * Plugin Name: Gutenberg Examples Recipe Card EsNext
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: This is a plugin demonstrating how to register new blocks for the Gutenberg editor.
 * Version: 1.1.0
 * Author: the Gutenberg Team
 *
 * @package blockons
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load all translations for our plugin from the MO file.
 */
function gutenberg_examples_05_esnext_load_textdomain() {
	load_plugin_textdomain( 'blockons', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'gutenberg_examples_05_esnext_load_textdomain' );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function gutenberg_examples_05_esnext_register_block() {

	// Register the block by passing the location of block.json to register_block_type.
	register_block_type( __DIR__ );

	if ( function_exists( 'wp_set_script_translations' ) ) {
		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( 'blockons-05-esnext', 'blockons' );
	}

}
add_action( 'init', 'gutenberg_examples_05_esnext_register_block' );
