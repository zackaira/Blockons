<?php
/**
 * Plugin Name: WooCommerce Account Icon Block
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: An WooCommerce Account Icon Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package blockons
 */
defined( 'ABSPATH' ) || exit;

/**
 * Register Block Assets
 */
function blockons_wc_account_icon_register_block() {
	// Register the block by passing the location of block.json.
	register_block_type( __DIR__ );

	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'blockons-wc-account-icon-editor-script', 'blockons', BLOCKONS_PLUGIN_DIR . 'lang' );
	}

}
add_action( 'init', 'blockons_wc_account_icon_register_block' );