<?php
/**
 * Plugin Name: Blockons
 * Version: 1.0.0
 * Plugin URI: https://blockons.com/
 * Description: WordPress editor blocks for you to build your website
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
					'type'                => 'plugin',
					'public_key'          => 'pk_8cdb47fdecf5c0742694da12b7b0e',
					'is_premium'          => false,
					'has_addons'          => false,
					'has_paid_plans'      => false,
					'menu'                => array(
						'slug'           => 'blockons-settings',
						'contact'        => false,
						'support'        => false,
						'parent'         => array(
							'slug' => 'options-general.php',
						),
					),
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

	// Site Blocks
	require BLOCKONS_PLUGIN_DIR . 'build/accordions/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/search/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/icon-list/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/line-heading/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/image-carousel/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/progress-bars/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/marketing-button/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/testimonials/index.php';
	require BLOCKONS_PLUGIN_DIR . 'build/video-slider/index.php';

	// WooCommerce Blocks
	if ( Blockons_Admin::blockons_is_plugin_active( 'woocommerce.php' ) ) {
		require BLOCKONS_PLUGIN_DIR . 'build/wc-account-icon/index.php';
		require BLOCKONS_PLUGIN_DIR . 'build/wc-mini-cart/index.php';
		require BLOCKONS_PLUGIN_DIR . 'build/wc-featured-product/index.php';
	}

	/**
	 * Main instance of Blockons_Admin to prevent the need to use globals.
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
