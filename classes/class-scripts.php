<?php
/**
 * Scripts & Styles file
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Main plugin class.
 */
class Blockons {
	/**
	 * The single instance of Blockons
	 */
	private static $_instance = null; //phpcs:ignore

	/**
	 * The version number
	 */
	public $_version; //phpcs:ignore

	/**
	 * The main plugin file.
	 */
	public $file;

	/**
	 * Constructor funtion
	 */
	public function __construct($file = '', $version = BLOCKONS_PLUGIN_VERSION) {
		$this->file     = $file;
		$this->_version = $version;

		register_activation_hook( $this->file, array( $this, 'install' ) );

		// Register Scripts for plugin.
		add_action( 'init', array( $this, 'blockons_register_scripts' ), 10 );

		// Update/fix defaults on plugins_loaded hook
		add_action( 'plugins_loaded', array( $this, 'blockons_update_plugin_defaults' ) );

		// Load frontend JS & CSS.
		add_action( 'wp_enqueue_scripts', array( $this, 'blockons_frontend_scripts' ), 10 );

		// Load admin JS & CSS.
		add_action( 'admin_enqueue_scripts', array( $this, 'blockons_admin_scripts' ), 10, 1 );

		$this->blockons_load_plugin_textdomain();
		add_action( 'init', array( $this, 'blockons_load_localisation' ), 0 );
	} // End __construct ()

	/**
	 * Register Scripts & Styles
	 */
	public function blockons_register_scripts() {
		// Font Awesome Free
		wp_register_style( 'blockons-fontawesome', BLOCKONS_PLUGIN_URL . 'assets/font-awesome/css/all.min.css', array(), BLOCKONS_PLUGIN_VERSION );

		// JS URLs file/object for featured product, video slider, image carousel
		wp_register_script( 'blockons-file', BLOCKONS_PLUGIN_URL . 'assets/blocks/featured-product/file.js', array(), BLOCKONS_PLUGIN_VERSION );
		wp_localize_script( 'blockons-file', 'siteObj', array(
			'apiUrl' => esc_url( home_url('/wp-json') ),
			'pluginUrl' => esc_url(BLOCKONS_PLUGIN_URL),
		));

		// Cart Icon Block JS
		wp_register_script( 'blockons-wc-mini-cart', BLOCKONS_PLUGIN_URL . 'assets/blocks/wc-mini-cart/cart.js', array(), BLOCKONS_PLUGIN_VERSION );
		if ( Blockons_Admin::blockons_is_plugin_active( 'woocommerce.php' ) ) {
			wp_localize_script( 'blockons-wc-mini-cart', 'cartIconObj', array(
				'wcCartUrl' => esc_url( get_permalink( wc_get_page_id( 'cart' ) ) ),
			));
		}
		// Progress Bars JS
		wp_register_script( 'blockons-waypoint', BLOCKONS_PLUGIN_URL . 'assets/blocks/progress-bars/waypoints.min.js', array(), BLOCKONS_PLUGIN_VERSION );
		wp_register_script( 'blockons-waypoint-inview', BLOCKONS_PLUGIN_URL . 'assets/blocks/progress-bars/inview.min.js', array(), BLOCKONS_PLUGIN_VERSION );
		wp_register_script( 'blockons-progress-bars', BLOCKONS_PLUGIN_URL . 'assets/blocks/progress-bars/progress-bars.js', array( 'blockons-waypoint', 'blockons-waypoint-inview' ), BLOCKONS_PLUGIN_VERSION );

		// Testimonials
		wp_register_style( 'blockons-splidecss', BLOCKONS_PLUGIN_URL . 'assets/slider/splide.min.css', array(), BLOCKONS_PLUGIN_VERSION );
		wp_register_script( 'blockons-splidejs', BLOCKONS_PLUGIN_URL . 'assets/slider/splide.min.js', array(), BLOCKONS_PLUGIN_VERSION );
	} // End blockons_frontend_scripts ()

	/**
	 * Load frontend Scripts & Styles
	 */
	public function blockons_frontend_scripts() {
		
	} // End blockons_frontend_scripts ()

	/**
	 * Admin enqueue Scripts & Styles
	 */
	public function blockons_admin_scripts( $hook = '' ) {
		$adminPage = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
		// $suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';

		// Admin CSS
		wp_register_style( 'blockons-admin-script', esc_url(BLOCKONS_PLUGIN_URL . '/dist/admin.css'), array(), BLOCKONS_PLUGIN_VERSION );
		wp_enqueue_style( 'blockons-admin-script' );

		// Admin JS
		wp_register_script( 'blockons-admin-script', esc_url(BLOCKONS_PLUGIN_URL . '/dist/admin.js'), array(), BLOCKONS_PLUGIN_VERSION, true );
		wp_localize_script('blockons-admin-script', 'blockonsObj', array(
			'apiUrl' => esc_url(home_url('/wp-json')),
			'nonce' => wp_create_nonce('wp_rest'),
		));
		wp_enqueue_script( 'blockons-admin-script');

		wp_set_script_translations('blockons-admin-script', 'blockons', BLOCKONS_PLUGIN_DIR . 'lang');


		// Return if not on Settings Page
		if ('blockons-settings' !== $adminPage) return;

		global $blockons_fs;
		// $blockonsOptions = get_option('blockons_options');
		$blockonsDefaults = get_option('blockons_default_options');

		// Settings CSS
		wp_register_style( 'blockons-admin-settings-style', esc_url(BLOCKONS_PLUGIN_URL . '/dist/settings.css'), array(), BLOCKONS_PLUGIN_VERSION );
		wp_enqueue_style( 'blockons-admin-settings-style' );

		// wp_enqueue_media();

		// Settings JS
		wp_register_script( 'blockons-admin-settings-script', esc_url(BLOCKONS_PLUGIN_URL . '/dist/settings.js'), array('wp-i18n'), BLOCKONS_PLUGIN_VERSION, true );
		wp_localize_script('blockons-admin-settings-script', 'blockonsObj', array(
			'apiUrl' => esc_url(home_url('/wp-json')),
			'nonce' => wp_create_nonce('wp_rest'),
			// 'blockonsOptions' => $blockonsOptions,
			'blockonsDefaults' => json_decode($blockonsDefaults),
			'accountUrl' => esc_url($blockons_fs->get_account_url()),
			'wcActive' => defined('WC_VERSION') ? true : false,
			// 'upgradeUrl' => esc_url($blockons_fs->get_upgrade_url()),
			'can_use_premium_code' => blockons_fs()->can_use_premium_code(),
		));
		wp_enqueue_script('blockons-admin-settings-script');

		wp_set_script_translations('blockons-admin-settings-script', 'blockons', BLOCKONS_PLUGIN_DIR . 'lang');
	} // End blockons_admin_scripts ()

	/**
	 * Load plugin localisation
	 *
	 * @access  public
	 * @return  void
	 * @since   1.0.0
	 */
	public function blockons_load_localisation() {
		load_plugin_textdomain('blockons', false, BLOCKONS_PLUGIN_DIR . 'languages/');
	} // End blockons_load_localisation ()

	/**
	 * Load plugin textdomain
	 *
	 * @access  public
	 * @return  void
	 * @since   1.0.0
	 */
	public function blockons_load_plugin_textdomain() {
		$domain = 'blockons';
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain($domain, BLOCKONS_PLUGIN_DIR . 'lang/' . $domain . '-' . $locale . '.mo');
		load_plugin_textdomain($domain, false, BLOCKONS_PLUGIN_DIR . 'lang/');
	} // End blockons_load_plugin_textdomain ()

	/**
	 * Main Blockons Instance
	 * Ensures only one instance of Blockons is loaded or can be loaded.
	 */
	public static function instance( $file = '', $version = BLOCKONS_PLUGIN_VERSION ) {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self( $file, $version );
		}

		return self::$_instance;
	} // End instance ()

	public static function blockonsDefaults() {
		$initialSettings = array(
			"blocks" => array( // For adding a new block, update this AND class-notices.php newblocks number
				"accordions" => true, // 12
				"icon_list" => true, // 11
				"image_carousel" => true, // 10
				"line_heading" => true, // 9
				"marketing_button" => true, // 8
				"progress_bars" => true, // 7
				"search" => true, // 6
				"testimonials" => true, // 5
				"video_slider" => true, // 4
				"wc_account_icon" => true, // 3
				"wc_featured_product" => true, // 2
				"wc_mini_cart" => true, // 1
			),
			// "delete_all_settings" => false,
		);
		return $initialSettings;
	}

	/**
	 * Update the plugin defaults setting if they change
	 */
	public function blockons_update_plugin_defaults() {
		$defaultOptions = (object)$this->blockonsDefaults();
		$objDefaultOptions = json_encode($defaultOptions);

		// Fix saved plugin version if no setting saved
		if (!get_option('blockons_plugin_version') || (get_option('blockons_plugin_version') != BLOCKONS_PLUGIN_VERSION)) {
			update_option('blockons_plugin_version', BLOCKONS_PLUGIN_VERSION);
		}
		// Fix/Update Defaults if no setting saved or defaults are different
		if (!get_option('blockons_default_options') || (get_option('blockons_default_options') != $defaultOptions)) {
			update_option('blockons_default_options', $objDefaultOptions);
		}
		// Fix saved plugin version if no setting saved
		if (!get_option('blockons_options')) {
			update_option('blockons_options', $objDefaultOptions);
		}
	}

	/**
	 * Installation. Runs on activation.
	 */
	public function install() {
		$this->_update_default_settings();
		$this->_log_version_number();
	}

	/**
	 * Save Initial Default Settings.
	 */
	private function _update_default_settings() { //phpcs:ignore
		$defaultOptions = (object)$this->blockonsDefaults();

		// $blocksCount = count($initialSettings['blocks']);
		// update_option('blockons_blocks_count', $blocksCount);
		
		update_option('blockons_options', json_encode($defaultOptions));
		update_option('blockons_default_options', json_encode($defaultOptions));
	}
	/**
	 * Log the plugin version number.
	 */
	private function _log_version_number() { //phpcs:ignore
		update_option('blockons_plugin_version', BLOCKONS_PLUGIN_VERSION);
	}
}
