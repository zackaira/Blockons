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

		// Load Frontend JS & CSS.
		add_action( 'wp_enqueue_scripts', array( $this, 'blockons_frontend_scripts' ), 10 );

		// Load Admin JS & CSS.
		add_action( 'admin_enqueue_scripts', array( $this, 'blockons_admin_scripts' ), 10, 1 );

		// Load Editor JS & CSS.
		add_action( 'enqueue_block_editor_assets', array( $this, 'blockons_block_editor_scripts' ), 10, 1 );

		$this->blockons_load_plugin_textdomain();
		add_action( 'init', array( $this, 'blockons_load_localisation' ), 0 );
	} // End __construct ()

	/**
	 * Register Scripts & Styles
	 */
	public function blockons_register_scripts() {
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';
		$blockonsSavedOptions = get_option('blockons_options');
		$blockonsOptions = $blockonsSavedOptions ? json_decode($blockonsSavedOptions) : '';
		$isPro = (boolean)blockons_fs()->can_use_premium_code__premium_only();
		global $blockons_fs;
		$blockonsDefaults = get_option('blockons_default_options');

		// Font Awesome Free
		wp_register_style('blockons-fontawesome', esc_url(BLOCKONS_PLUGIN_URL . 'assets/font-awesome/css/all.min.css'), array('dashicons'), BLOCKONS_PLUGIN_VERSION);

		// Frontend
		wp_register_style('blockons-frontend-style', esc_url(BLOCKONS_PLUGIN_URL . 'dist/frontend' . $suffix . '.css'), array('blockons-fontawesome'), BLOCKONS_PLUGIN_VERSION);
		wp_register_script('blockons-frontend-script', esc_url(BLOCKONS_PLUGIN_URL . 'dist/frontend' . $suffix . '.js'), array('wp-i18n'), BLOCKONS_PLUGIN_VERSION, true);

		// JS URLs file/object for featured product, video slider, image carousel
		wp_register_script('blockons-js', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/blockons.js'), array(), BLOCKONS_PLUGIN_VERSION);
		wp_localize_script('blockons-js', 'blockonsDetails', array(
			'apiUrl' => esc_url(get_rest_url()),
			'pluginUrl' => esc_url(BLOCKONS_PLUGIN_URL),
			'siteUrl' => esc_url(get_home_url('/')),
			'isPremium' => (boolean)$isPro,
		));
		
		if ( Blockons_Admin::blockons_is_plugin_active('woocommerce.php') ) {
			// WC Account Icon Block JS
			wp_register_script('blockons-wc-account-icon', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/wc-account-icon/account.js'), array(), BLOCKONS_PLUGIN_VERSION);
			wp_localize_script('blockons-wc-account-icon', 'wcAccObj', array(
				'wcAccountUrl' => esc_url(wc_get_page_permalink('myaccount')),
			));

			// WC Cart Icon Block JS
			if (blockons_fs()->can_use_premium_code__premium_only()) {
				wp_register_script('blockons-wc-mini-cart', esc_url(BLOCKONS_PLUGIN_URL . 'dist/pro/cart-pro.min.js'), array(), BLOCKONS_PLUGIN_VERSION);
			} else {
				wp_register_script('blockons-wc-mini-cart', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/wc-mini-cart/cart.js'), array(), BLOCKONS_PLUGIN_VERSION);
			}
			wp_localize_script('blockons-wc-mini-cart', 'wcCartObj', array(
				'adminUrl' => esc_url(admin_url()),
				'isPremium' => $isPro,
				'wcCartUrl' => esc_url(get_permalink(wc_get_page_id('cart'))),
				'sidecart' => isset($blockonsOptions->sidecart) ? $blockonsOptions->sidecart : null,
			));
		}
		
		// Search JS - FREE & PREMIUM
		if (blockons_fs()->can_use_premium_code__premium_only()) {
			wp_register_script('blockons-search', esc_url(BLOCKONS_PLUGIN_URL . 'dist/pro/search-pro.min.js'), array(), BLOCKONS_PLUGIN_VERSION);
		} else {
			wp_register_script('blockons-search', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/search/search.js'), array(), BLOCKONS_PLUGIN_VERSION);
		}
		wp_localize_script('blockons-search', 'searchObj', array(
			'isPremium' => $isPro,
			'apiUrl' => esc_url(get_rest_url()),
			'adminUrl' => esc_url(admin_url()),
			'wcActive' => Blockons_Admin::blockons_is_plugin_active('woocommerce.php'),
		));
		
		// Progress Bars JS
		wp_register_script('blockons-waypoint', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/progress-bars/waypoints.min.js'), array(), BLOCKONS_PLUGIN_VERSION, true);
		wp_register_script('blockons-waypoint-inview', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/progress-bars/inview.min.js'), array('blockons-waypoint'), BLOCKONS_PLUGIN_VERSION, true);
		wp_register_script('blockons-progress-bars', esc_url(BLOCKONS_PLUGIN_URL . 'assets/blocks/progress-bars/progress-bars.js'), array('blockons-waypoint', 'blockons-waypoint-inview' ), BLOCKONS_PLUGIN_VERSION, true);

		// Sliders
		wp_register_style('blockons-swiper-css', esc_url(BLOCKONS_PLUGIN_URL . 'assets/slider/swiper.min.css'), array(), BLOCKONS_PLUGIN_VERSION);
		wp_register_script('blockons-swiper-js', esc_url(BLOCKONS_PLUGIN_URL . 'assets/slider/swiper.min.js'), array(), BLOCKONS_PLUGIN_VERSION, true);
		wp_register_script('blockons-slider', esc_url(BLOCKONS_PLUGIN_URL . 'assets/slider/swiper.js'), array('blockons-swiper-js'), BLOCKONS_PLUGIN_VERSION, true);
		wp_register_script('blockons-slider-video', esc_url(BLOCKONS_PLUGIN_URL . 'dist/swiper-video.min.js'), array('blockons-swiper-js'), BLOCKONS_PLUGIN_VERSION, true);

		wp_register_script('blockons-img-comparison', esc_url(BLOCKONS_PLUGIN_URL . 'assets/slider/image-comparison.min.js'), array(), BLOCKONS_PLUGIN_VERSION, true);

		// AOS Animations & Venobox Popup
		if (blockons_fs()->can_use_premium_code__premium_only()) {
			wp_register_style('blockons-aos-style', esc_url(BLOCKONS_PLUGIN_URL . 'assets/aos/aos.css'), array(), BLOCKONS_PLUGIN_VERSION);
			wp_register_script('blockons-aos-script', esc_url(BLOCKONS_PLUGIN_URL . 'assets/aos/aos.js'), array(), BLOCKONS_PLUGIN_VERSION, true);

			wp_register_style('blockons-venobox-style', esc_url(BLOCKONS_PLUGIN_URL . 'assets/venobox/venobox.min.css'), array(), BLOCKONS_PLUGIN_VERSION);
			wp_register_script('blockons-venobox-script', esc_url(BLOCKONS_PLUGIN_URL . 'assets/venobox/venobox.min.js'), array(), BLOCKONS_PLUGIN_VERSION, true);
		}
		// Image Gallery - FREE & PREMIUM
		if (blockons_fs()->can_use_premium_code__premium_only()) {
			wp_register_script('blockons-image-gallery', esc_url(BLOCKONS_PLUGIN_URL . 'dist/pro/imagegallery-pro.min.js'), array('blockons-venobox-script', 'blockons-js'), BLOCKONS_PLUGIN_VERSION, true);
		} else {
			wp_register_script('blockons-image-gallery', esc_url(BLOCKONS_PLUGIN_URL . 'dist/imagegallery.min.js'), array('blockons-js'), BLOCKONS_PLUGIN_VERSION, true);
		}

		// Settings JS
		wp_register_script('blockons-admin-settings-script', esc_url(BLOCKONS_PLUGIN_URL . 'dist/settings' . $suffix . '.js'), array('wp-i18n'), BLOCKONS_PLUGIN_VERSION, true);
		wp_localize_script('blockons-admin-settings-script', 'blockonsObj', array(
			'apiUrl' => esc_url(get_rest_url()),
			'pluginUrl' => esc_url(BLOCKONS_PLUGIN_URL),
			'nonce' => wp_create_nonce('wp_rest'),
			'blockonsDefaults' => json_decode($blockonsDefaults),
			'accountUrl' => esc_url($blockons_fs->get_account_url()),
			'wcActive' => Blockons_Admin::blockons_is_plugin_active('woocommerce.php'),
			'isPremium' => $isPro,
			// 'upgradeUrl' => esc_url($blockons_fs->get_upgrade_url()),
		));
	} // End blockons_register_scripts ()

	/**
	 * Load frontend Scripts & Styles
	 */
	public function blockons_frontend_scripts() {
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';
		$blockonsSavedOptions = get_option('blockons_options');
		$blockonsOptions = $blockonsSavedOptions ? json_decode($blockonsSavedOptions) : '';
		$isPro = (boolean)blockons_fs()->can_use_premium_code__premium_only();

		// Frontend CSS
		wp_enqueue_style('blockons-frontend-style');
		
		// Frontend JS
		wp_enqueue_script('blockons-frontend-script');
		wp_localize_script('blockons-frontend-script', 'blockObj', array(
			'siteUrl' => esc_url(get_home_url('/')),
			'blockonsOptions' => $blockonsOptions,
			'isPremium' => $isPro,
		));

		if (blockons_fs()->can_use_premium_code__premium_only()) {
			if ( Blockons_Admin::blockons_is_plugin_active('woocommerce.php') ) {
				if (isset($blockonsOptions->sidecart->enabled) && $blockonsOptions->sidecart->enabled == true) {
					wp_register_style('blockons-sidecart-pro', esc_url(BLOCKONS_PLUGIN_URL . 'dist/pro/cart-pro.min.css'), array('blockons-fontawesome'), BLOCKONS_PLUGIN_VERSION);
					wp_enqueue_style('blockons-sidecart-pro');

					wp_enqueue_script('blockons-wc-mini-cart');
				}
			}

			// Block Extension - Visibility CSS
			if (isset($blockonsOptions->blockvisibility->enabled) && $blockonsOptions->blockvisibility->enabled == true) {
				$blockons_tablet = isset($blockonsOptions->blockvisibility->tablet) ? $blockonsOptions->blockvisibility->tablet : '980';
				$blockons_mobile = isset($blockonsOptions->blockvisibility->mobile) ? $blockonsOptions->blockvisibility->mobile : '767';

				$blockons_visibility_css = "@media only screen and (min-width: " . $blockons_tablet . "px) { body.blockons-pro .hide-on-desktop { display: none !important; } }
				@media all and (min-width: " . $blockons_mobile . "px) and (max-width: " . $blockons_tablet . "px) { body.blockons-pro .hide-on-tablet { display: none !important; } }
				@media screen and (max-width: " . $blockons_mobile . "px) { body.blockons-pro .hide-on-mobile { display: none !important; } }";
				wp_add_inline_style('blockons-frontend-style', $blockons_visibility_css );
			}

			// Block Extension - AOS Animations
			if (isset($blockonsOptions->blockanimation->enabled) && $blockonsOptions->blockanimation->enabled == true) {
				wp_enqueue_style('blockons-aos-style');
				wp_enqueue_script('blockons-aos-script');
				wp_add_inline_script('blockons-aos-script', 'AOS.init();');
			}
		}
	} // End blockons_frontend_scripts ()

	/**
	 * Admin enqueue Scripts & Styles
	 */
	public function blockons_admin_scripts( $hook = '') {
		$adminPage = isset($_GET['page']) ? sanitize_text_field($_GET['page']) : '';
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';

		// Admin CSS
		wp_register_style('blockons-admin-style', esc_url(BLOCKONS_PLUGIN_URL . 'dist/admin' . $suffix . '.css'), array(), BLOCKONS_PLUGIN_VERSION);
		wp_enqueue_style('blockons-admin-style');

		// Admin JS
		wp_register_script('blockons-admin-script', esc_url(BLOCKONS_PLUGIN_URL . 'dist/admin' . $suffix . '.js'), array(), BLOCKONS_PLUGIN_VERSION, true);
		wp_localize_script('blockons-admin-script', 'blockonsObj', array(
			'apiUrl' => esc_url( get_rest_url() ),
			'pluginUrl' => esc_url(BLOCKONS_PLUGIN_URL),
			'nonce' => wp_create_nonce('wp_rest'),
			'wcActive' => Blockons_Admin::blockons_is_plugin_active('woocommerce.php'),
		));
		wp_enqueue_script('blockons-admin-script');

		wp_set_script_translations('blockons-admin-script', 'blockons', BLOCKONS_PLUGIN_DIR . 'lang');

		// Return if not on Settings Page
		if ('blockons-settings' !== $adminPage) return;

		// Settings CSS
		wp_register_style('blockons-admin-settings-style', esc_url(BLOCKONS_PLUGIN_URL . 'dist/settings' . $suffix . '.css'), array(), BLOCKONS_PLUGIN_VERSION);
		wp_enqueue_style('blockons-admin-settings-style');
		// wp_enqueue_media();

		// Settings JS
		wp_enqueue_script('blockons-admin-settings-script');

		// Addons Style called again for Previews
		wp_enqueue_style('blockons-frontend-style');

		// Update the language file with this line in the terminal - "wp i18n make-pot ./ lang/blockons.pot"
		wp_set_script_translations('blockons-admin-settings-script', 'blockons', BLOCKONS_PLUGIN_DIR . 'lang');
	} // End blockons_admin_scripts ()

	/**
	 * Load Block Editor Scripts & Styles
	 */
	public function blockons_block_editor_scripts() {
		$suffix = (defined('WP_DEBUG') && true === WP_DEBUG) ? '' : '.min';
		$blockonsSavedOptions = get_option('blockons_options');
		$blockonsOptions = $blockonsSavedOptions ? json_decode($blockonsSavedOptions) : '';
		
		wp_register_style('blockons-admin-editor-style', esc_url(BLOCKONS_PLUGIN_URL . 'dist/editor' . $suffix . '.css'), array('blockons-fontawesome'), BLOCKONS_PLUGIN_VERSION);
		wp_enqueue_style('blockons-admin-editor-style');

		wp_register_script('blockons-admin-editor-script', esc_url(BLOCKONS_PLUGIN_URL . 'dist/editor' . $suffix . '.js'), array('wp-edit-post', 'wp-rich-text'), BLOCKONS_PLUGIN_VERSION, true);
		wp_localize_script('blockons-admin-editor-script', 'blockonsEditorObj', array(
			'isPremium' => blockons_fs()->can_use_premium_code(),
			'blockonsOptions' => $blockonsOptions,
		));
		wp_enqueue_script('blockons-admin-editor-script');
	} // End blockons_block_editor_scripts ()

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
	public static function instance( $file = '', $version = BLOCKONS_PLUGIN_VERSION) {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self( $file, $version );
		}

		return self::$_instance;
	} // End instance ()

	public static function blockonsDefaults() {
		$initialSettings = array(
			"blocks" => array( // For adding a new block, update this AND ../src/backend/helpers.js AND class-notices.php newblocks number
				// "table_of_contents" => true, // 19
				"tabs" => true, // 18
				"count_down_timer" => true, // 17
				"content_toggler" => true, // 16
				"slider" => true, // 15
				"image_comparison" => true, // 14
				"image_gallery" => true, // 13
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
			"blockvisibility" => array(
				"enabled" => false,
				"tablet" => "980",
				"mobile" => "767",
			),
			"blockanimation" => array(
				"enabled" => false,
				"default_style" => "fade",
				"default_direction" => "-up",
				"default_duration" => "850",
				"default_delay" => "50",
				"default_offset" => "80",
				"default_animate_once" => false,
				"default_mirror" => false,
			),
			"tooltips" => array(
				"enabled" => false,
				"theme" => "one",
			),
			"pageloader" => array(
				"enabled" => false,
				"style" => "one",
				"has_text" => false,
				"text" => "Loading Website...",
				"text_position" => "one",
			),
			"bttb" => array(
				"enabled" => false,
				"position" => "right",
				"type" => "plain",
				"has_bg" => true,
			),
			"scrollindicator" => array(
				"enabled" => false,
				"position" => "top",
				"height" => 6,
				"has_bg" => true,
			),
			"sidecart" => array(
				"enabled" => false,
				"position" => "right",
				"has_icon" => true,
				"icon" => "cart-shopping",
				"icon_size" => 24,
				"icon_bgcolor" => "#FFF",
				"icon_color" => "#333",
				"icon_padding" => 60,
				"has_amount" => true,
				"header_title" => __("Your Shopping Cart", "blockons"),
				"header_text" => __("Spend $100 to get FREE shipping!", "blockons"),
				"bgcolor" => "#FFF",
				"color" => "#000",
				"overlay_color" => "#000",
				"overlay_opacity" => 0.60,
			)
		);
		return $initialSettings;
	}

	/**
	 * Update/Save the plugin version, defaults and settings if none exist | Run on 'plugins_loaded' hook
	 */
	public function blockons_update_plugin_defaults() {
		$defaultOptions = (object)$this->blockonsDefaults();
		$objDefaultOptions = json_encode($defaultOptions);

		// Saved current Plugin Version if no version is saved
		if (!get_option('blockons_plugin_version') || (get_option('blockons_plugin_version') != BLOCKONS_PLUGIN_VERSION)) {
			update_option('blockons_plugin_version', BLOCKONS_PLUGIN_VERSION);
		}
		// Fix/Update Defaults if no defaults are saved or if defaults are different to previous version defaults
		if (!get_option('blockons_default_options') || (get_option('blockons_default_options') != $defaultOptions)) {
			update_option('blockons_default_options', $objDefaultOptions);
		}
		// Save new Plugin Settings from defaults if no settings are saved
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
