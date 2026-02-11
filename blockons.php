<?php
/**
 * Plugin Name: Blockons
 * Version: 1.2.16
 * Plugin URI: https://blockons.com/
 * Description: Enhanced WordPress editor blocks for Gutenberg, including core Block Extensions and Site Addons for your WordPress site and WooCommerce online store
 * Author: Kaira
 * Author URI: https://kairaweb.com/
 * Requires at least: 5.0
 * Tested up to: 6.9
 * WC requires at least: 3.2
 * WC tested up to: 10.5
 * Text Domain: blockons
 * Domain Path: /lang/
 * 
 * @fs_premium_only /dist/pro/, /assets/blocks/search/pro/, /assets/blocks/contact-form/flatpickr, /assets/blocks/wc-mini-cart/pro/, /assets/aos/, /assets/slider/swiper-video.js, /assets/popups/modal/, /assets/popups/quickview/, /assets/popups/viewcontent/
 *
 * @package blockons
 */
defined( 'ABSPATH' ) || exit;

if ( !defined( 'BLOCKONS_PLUGIN_VERSION' ) ) {
	define('BLOCKONS_PLUGIN_VERSION', '1.2.16');
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
				require_once dirname(__FILE__) . '/vendor/freemius/start.php';
	
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
	require_once 'classes/class-admin.php';
	require_once 'classes/class-notices.php';
	require_once 'classes/class-frontend.php';
	require_once 'classes/class-rest-api.php';
	require_once 'classes/class-blockons-security.php';
	require_once 'classes/class-modal-patterns.php';

	if (blockons_fs()->can_use_premium_code__premium_only()) {
		require_once 'classes/class-form-submissions.php';
	}

	// Declare Compatibility for HPOS
	add_action( 'before_woocommerce_init', function() {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
		}
	} );

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
