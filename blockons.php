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
 * WC requires at least: 3.2
 * WC tested up to: 6.8
 * Text Domain: blockons
 * Domain Path: /lang/
 *
 * @package blockons
 */
defined( 'ABSPATH' ) || exit;

if ( !defined( 'BLOCKONS_PLUGIN_VERSION' ) ) {
	define('BLOCKONS_PLUGIN_VERSION', '1.0.0');
}
if ( !defined( 'BLOCKONS_BLOCKS_COUNT' ) ) { // Update this when ADDING blocks
	define('BLOCKONS_BLOCKS_COUNT', '12');
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

	$blockonsDefaults = json_decode( get_option('blockons_default_options') );
	$blockonsOptions = json_decode( get_option('blockons_options') );
	$blockonsBlocks = $blockonsOptions ? $blockonsOptions->blocks : $blockonsDefaults->blocks;

	// Site Blocks
	if ($blockonsBlocks) {
		// For adding a new block, update here, BLOCKONS_BLOCK_COUNT at the top, AND class-scripts.php -> function '_update_default_settings'

		// if (isset($blockonsBlocks->layout_container)) {
		// 	require BLOCKONS_PLUGIN_DIR . 'build/layout-container/index.php';
		// }
		if (isset($blockonsBlocks->accordions)) {
			require BLOCKONS_PLUGIN_DIR . 'build/accordions/index.php';
		}
		if (isset($blockonsBlocks->search)) {
			require BLOCKONS_PLUGIN_DIR . 'build/search/index.php';
		}
		if (isset($blockonsBlocks->icon_list)) {
			require BLOCKONS_PLUGIN_DIR . 'build/icon-list/index.php';
		}
		if (isset($blockonsBlocks->line_heading)) {
			require BLOCKONS_PLUGIN_DIR . 'build/line-heading/index.php';
		}
		if (isset($blockonsBlocks->image_carousel)) {
			require BLOCKONS_PLUGIN_DIR . 'build/image-carousel/index.php';
		}
		if (isset($blockonsBlocks->progress_bars)) {
			require BLOCKONS_PLUGIN_DIR . 'build/progress-bars/index.php';
		}
		if (isset($blockonsBlocks->marketing_button)) {
			require BLOCKONS_PLUGIN_DIR . 'build/marketing-button/index.php';
		}
		if (isset($blockonsBlocks->testimonials)) {
			require BLOCKONS_PLUGIN_DIR . 'build/testimonials/index.php';
		}
		if (isset($blockonsBlocks->video_slider)) {
			require BLOCKONS_PLUGIN_DIR . 'build/video-slider/index.php';
		}

		// WooCommerce Blocks
		if ( Blockons_Admin::blockons_is_plugin_active( 'woocommerce.php' ) ) {
			if ($blockonsBlocks->wc_account_icon) {
				require BLOCKONS_PLUGIN_DIR . 'build/wc-account-icon/index.php';
			}
			if ($blockonsBlocks->wc_mini_cart) {
				require BLOCKONS_PLUGIN_DIR . 'build/wc-mini-cart/index.php';
			}
			if ($blockonsBlocks->wc_featured_product) {
				require BLOCKONS_PLUGIN_DIR . 'build/wc-featured-product/index.php';
			}
		}
	}

	/**
     * Function to delete all StoreCustomizer data IF set
     */
    function blockons_fs_uninstall_cleanup( $section ) {
		global $wpdb;
		// Delete all data if setting to delete data is checked
		if ( $blockonsOptions->delete_all_settings ) {
			// Delete all Linkt db options.
			$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'blockons_%';" );
			// Clear any cached data that has been removed.
			wp_cache_flush();
		}
	}
    if ( isset($blockonsOptions->delete_all_settings) ) {
        blockons_fs()->add_action('after_uninstall', 'blockons_fs_uninstall_cleanup');
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
