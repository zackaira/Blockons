<?php
/**
 * Plugin Name: Blockons
 * Version: 1.0.1
 * Plugin URI: https://blockons.com/
 * Description: WordPress editor blocks for you to build your website
 * Author: Kaira
 * Author URI: https://kairaweb.com/
 * Requires at least: 5.0
 * Tested up to: 6.1
 * WC requires at least: 3.2
 * WC tested up to: 7.0
 * Text Domain: blockons
 * Domain Path: /lang/
 * 
 * @fs_premium_only /dist/pro/, /assets/blocks/search/pro/, /assets/blocks/wc-mini-cart/pro/
 *
 * @package blockons
 */
defined( 'ABSPATH' ) || exit;

if ( !defined( 'BLOCKONS_PLUGIN_VERSION' ) ) {
	define('BLOCKONS_PLUGIN_VERSION', '1.0.1');
}
if ( !defined( 'BLOCKONS_PLUGIN_URL' ) ) {
	define('BLOCKONS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}
if ( !defined( 'BLOCKONS_PLUGIN_DIR' ) ) {
	define('BLOCKONS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
}

if ( function_exists( 'blockons_fs' ) ) {
	blockons_fs()->set_basename( true, __FILE__ );
} else {
	if ( ! function_exists( 'blockons_fs' ) ) {
		// Create a helper function for easy SDK access.
		function blockons_fs() {
			global $blockons_fs;
	
			if ( ! isset( $blockons_fs ) ) {
				// Include Freemius SDK.
				require_once dirname(__FILE__) . '/freemius/start.php';
	
				$blockons_fs = fs_dynamic_init( array(
					'id'                  => '10882',
					'slug'                => 'blockons',
					'premium_slug'        => 'blockons-pro',
					'type'                => 'plugin',
					'public_key'          => 'pk_8cdb47fdecf5c0742694da12b7b0e',
					'is_premium'          => true,
					'premium_suffix'      => 'Pro',
					// If your plugin is a serviceware, set this option to false.
					'has_premium_version' => true,
					'has_addons'          => false,
					'has_paid_plans'      => true,
					'menu'                => array(
						'slug'           => 'blockons-settings',
						'contact'        => false,
						'support'        => false,
						'parent'         => array(
							'slug' => 'options-general.php',
						),
					),
					// Set the SDK to work in a sandbox mode (for development & testing).
					// IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
					'secret_key'          => 'sk_m$~kLYwaQ;nO{{y[Q.KW8+g8#^)Gy',
				) );
			}
	
			return $blockons_fs;
		}

		// Init Freemius.
		blockons_fs();
		// Signal that SDK was initiated.
		do_action( 'blockons_fs_loaded' );
	}

	require_once 'classes/class-scripts.php';
	require_once 'classes/class-rest-api.php';
	require_once 'classes/class-admin.php';
	require_once 'classes/class-notices.php';
	require_once 'classes/class-frontend.php';

	$blockonsDefaults = json_decode( get_option('blockons_default_options') );
	$blockonsOptions = json_decode( get_option('blockons_options') );
	$blockonsBlocks = $blockonsOptions ? (array)$blockonsOptions->blocks : (array)$blockonsDefaults->blocks;

	/**
	 * Loop through settings and included enabled blocks files
	 */
	if ($blockonsBlocks) :
		// Loop out by name and if is enabled / boolean
		foreach ($blockonsBlocks as $blockName => $exists) {
			$prefix = substr($blockName, 0, 3);

			if ($prefix != 'wc_' && $exists) {
				if ( file_exists(BLOCKONS_PLUGIN_DIR . 'build/' . str_replace("_", "-", $blockName) . '/index.php') ) {
					require BLOCKONS_PLUGIN_DIR . 'build/' . str_replace("_", "-", $blockName) . '/index.php';
				}
			}
			if ($prefix == 'wc_' && Blockons_Admin::blockons_is_plugin_active( 'woocommerce.php' ) && $exists) {
				if ( file_exists(BLOCKONS_PLUGIN_DIR . 'build/' . str_replace("_", "-", $blockName) . '/index.php') ) {
					require BLOCKONS_PLUGIN_DIR . 'build/' . str_replace("_", "-", $blockName) . '/index.php';
				}
			}
		}
	endif;

	/**
	 * Main instance of Blockons_Admin to prevent the need to use globals
	 *
	 * @since  1.0.0
	 * @return object Blockons_Admin
	 */
	function blockons() {
		$instance = Blockons::instance( __FILE__, BLOCKONS_PLUGIN_VERSION ); 
		return $instance;
	}
	blockons();
}
