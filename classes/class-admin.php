<?php
/**
 * Admin Settings & Setup file.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * Admin class.
 */
class Blockons_Admin {
	/**
	 * Constructor function.
	 */
	public function __construct() {
		// register_activation_hook( $this->file, array( $this, 'install' ) );

		add_action('admin_menu', array( $this, 'blockons_create_admin_menu' ), 10, 1);
		// add_filter('plugin_action_links_kaira-site-chat/kaira-site-chat.php', array($this, 'blockons_add_plugins_settings_link'));
		// add_filter('plugin_row_meta', array($this, 'blockons_add_plugins_row_link'), 10, 2);

		// Add a first time, dismissable notice
		// add_action('admin_init', array($this, 'blockons_install_notice_ignore'), 0);
		// add_action('admin_notices', array($this, 'blockons_installed_notice'));

		add_filter('block_categories_all', array($this, 'blockons_blocks_custom_category'), 10, 2);

		// Register Post/Page level options
		// add_action('init', array( $this, 'blockons_register_plugin_elements'), 11);

		// add_filter('body_class', array( $this, 'blockons_custom_body_class'));
	}

	/**
	 * Create an Admin Sub-Menu under WooCommerce
	 */
	public function blockons_create_admin_menu() {
		$capability = 'manage_options';
		$slug = 'blockons-settings';

		add_submenu_page(
			'options-general.php',
			__('Blockons Settings', 'blockons'),
			__('Blockons Settings', 'blockons'),
			$capability,
			$slug,
			array($this, 'blockons_menu_page_template')
		);
	}

	/**
	 * Create a Setting link on Plugins.php page
	 */
	// public function blockons_add_plugins_settings_link($links) {
	// 	$settings_link = '<a href="admin.php?page=blockons-settings">' . esc_html__('Settings', 'blockons') . '</a>';
	// 	array_push( $links, $settings_link );
		
  	// 	return $links;
	// }

	/**
	 * Create a Setting link on Plugins.php page
	 */
	// public function blockons_add_plugins_row_link($plugin_meta, $plugin_file) {
	// 	if ( strpos( $plugin_file, 'kaira-site-chat.php' ) !== false ) {
	// 		$new_links = array(
	// 			'Documentation' => '<a href="' . esc_url( 'https://blockons.com/documentation/' ) . '" target="_blank" aria-label="' . esc_attr__( 'View Site Chat documentation', 'blockons' ) . '">' . esc_html__( 'Documentation', 'blockons' ) . '</a>',
	// 			'FAQs' => '<a href="' . esc_url( 'https://blockons.com/support/faqs/' ) . '" target="_blank" aria-label="' . esc_attr__( 'Go to Site Chat FAQ\'s', 'blockons' ) . '">' . esc_html__( 'FAQ\'s', 'blockons' ) . '</a>'
	// 		);
	// 		$plugin_meta = array_merge( $plugin_meta, $new_links );
	// 	}
		 
	// 	return $plugin_meta;
	// }
	

	/**
	 * Create the Page Template html for React
	 * Settings created in ../src/backend/settings/admin.js
	 */
	public function blockons_menu_page_template() {
		$allowed_html = array(
			'div' => array('class' => array(), 'id' => array()),
			'h2' => array(),
		);

		$html  = '<div class="wrap">' . "\n";
		$html .= '<h2> </h2>' . "\n";
		$html .= '<div id="blockons-root"></div>' . "\n";
		$html .= '</div>' . "\n";

		echo wp_kses($html ,$allowed_html);
	}

	/**
	 * ADMIN NOTICES
	 * 
	 * Create an Error Notice if no WooCommerce
	 */
	public function blockons_installed_notice() {
		global $pagenow;
		global $current_user;
        $blockons_user_id = $current_user->ID;
        $blockons_page = isset( $_GET['page'] ) ? $pagenow . '?page=' . sanitize_text_field($_GET['page']) . '&' : sanitize_text_field($pagenow) . '?';

		if ( current_user_can( 'manage_options' ) && !get_user_meta( $blockons_user_id, 'blockons_install_notice_dismiss', true ) ) : ?>
			<div class="notice notice-info blockons-admin-notice">
                <h3><?php esc_html_e( 'Thank you for trying out Site Chat !', 'blockons' ); ?></h3>

				<?php if ( ! blockons_fs()->can_use_premium_code__premium_only() ) : ?>
					<p class="blockons-admin-txt"><?php
						/* translators: 1: 'great launch specials'. */
						printf( esc_html__( 'We\'ve just released Site Chat so we\'re running %1$s on Site Chat Pro.', 'blockons' ), wp_kses( '<a href="https://blockons.com/purchase/" target="_blank">great launch specials</a>', array( 'a' => array( 'href' => array (), 'target' => array() ) ) ) ); ?>
					</p>
				<?php endif; ?>
				
				<div class="blockons-notice-cols">
					<div class="blockons-notice-col">
						<h5><?php esc_html_e( 'Let\'s set up your Site Chat', 'blockons' ); ?></h5>
						<p>
							<?php
							/* translators: 1: 'Site Chat Settings'. */
							printf( esc_html__( 'Go to the %1$s page to easily set up your WhatsApp chat box.', 'blockons' ), wp_kses( '<a href="' . esc_url(admin_url('/options-general.php?page=blockons-settings')) . '">Site Chat Settings</a>', array( 'a' => array( 'href' => array () ) ) ) ); ?>
						</p>
						<a href="<?php echo esc_url(admin_url('/options-general.php?page=blockons-settings')); ?>" class="blockons-link">
							<?php esc_html_e( 'Set up Site Chat', 'blockons' ); ?>
						</a>
					</div>
					<div class="blockons-notice-col">
						<h5><?php esc_html_e( 'Is something not working?', 'blockons' ); ?></h5>
						<p>
							<?php
							/* translators: 1: 'Read our documentation'. */
							printf( esc_html__( 'Have you found a bug? Are you not sure on how to set it up? %1$s or get help on setting up Site Chat.', 'blockons' ), wp_kses( '<a href="https://blockons.com/documentation/" target="_blank">Read our documentation</a>', array( 'a' => array( 'href' => array (), 'target' => array() ) ) ) ); ?>
						</p>
						<a href="https://blockons.com/support/" class="blockons-link" target="_blank">
							<?php esc_html_e( 'Contact our Support', 'blockons' ); ?>
						</a>
					</div>
					<div class="blockons-notice-col">
						<h5><?php esc_html_e( 'Help Site Chat', 'blockons' ); ?></h5>
						<p>
							<?php esc_html_e( 'If you\'re willing to, please consider giving us a 5 star rating... It\'ll really help us improve Site Chat and gain users trust.', 'blockons' ); ?>
						</p>
						<span class="blockons-link blockons-rating-click"><?php esc_html_e( 'Sure, I\'ll rate Site Chat', 'blockons' ); ?></span>
						<div class="blockons-notice-rate">
							<p><?php esc_html_e( 'If you\'re not happy, please get in contact and let us help you fix the issue right away.', 'blockons' ); ?></p>
							<a href="https://wordpress.org/support/plugin/site-chat/reviews/#new-post" class="blockons-link" target="_blank"><?php esc_html_e( 'I\'m happy to give you 5 stars', 'blockons' ); ?></a><br />
							<a href="https://blockons.com/support/contact/" class="blockons-link" target="_blank"><?php esc_html_e( 'I\'m not happy. Please help!', 'blockons' ); ?></a>
						</div>
					</div>
				</div>
				<a href="<?php echo esc_url(admin_url($blockons_page . 'blockons_install_notice_ignore')); ?>" class="blockons-notice-close"></a>
			</div><?php
		endif;
	}
	// Make Notice Dismissable
	public function blockons_install_notice_ignore() {
		global $current_user;
		$blockons_user_id = $current_user->ID;
	
		if (isset($_GET['blockons_install_notice_ignore'])) {
			update_user_meta( $blockons_user_id, 'blockons_install_notice_dismiss', true );
		}
    }

	/**
	 * Create Blockons blocks Category
	 */
	public function blockons_blocks_custom_category($categories, $post) {
		return array_merge(
			$categories,
			array(
				array(
					"slug" => "blockons-category",
					"title" => __("Blockons Blocks", "arcane"),
					// "icon" => "wordpress",
				)
			)
		);
	}

	/**
	 * Function to check for active plugins
	 */
	public function blockons_is_plugin_active($plugin_name) {
		// Get Active Plugin Setting
		$active_plugins = (array) get_option('active_plugins', array());
		if (is_multisite()) {
			$active_plugins = array_merge($active_plugins, array_keys(get_site_option( 'active_sitewide_plugins', array())));
		}

		$plugin_filenames = array();
		foreach ($active_plugins as $plugin) {
			if (false !== strpos( $plugin, '/') ) {
				// normal plugin name (plugin-dir/plugin-filename.php)
				list(, $filename ) = explode( '/', $plugin);
			} else {
				// no directory, just plugin file
				$filename = $plugin;
			}
			$plugin_filenames[] = $filename;
		}
		return in_array($plugin_name, $plugin_filenames);
	}

	/**
	 * Register Post/Page Options
	 */
	// public function blockons_register_plugin_elements() {
	// 	// Page Meta for Page Sidebar Settings
	// 	register_meta(
	// 		'post', 
	// 		'blockons_post_remove',
	// 		array(
	// 			'type'		=> 'boolean', // checkbox
	// 			'single'	=> true,
	// 			'show_in_rest'	=> true,
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);
	// 	register_meta(
	// 		'post',
	// 		'blockons_post_excl_users',
	// 		array(
	// 			'object_subtype' => 'page',
	// 			'type'           => 'string',
	// 			'single'         => true,
	// 			'show_in_rest'   => true,
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);
	// 	register_meta(
	// 		'post', // object type, can be 'post', 'comment', 'term', 'user'
	// 		'blockons_post_intro', // meta key
	// 		array(
	// 			'object_subtype' => 'page', // or post type
	// 			'type'           => 'string', // 'string', 'boolean', 'integer', 'number', 'array', and 'object'
	// 			'single'         => true, // one value per object or an array of values
	// 			'show_in_rest'   => true, // accessible in REST
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);
	// 	register_meta(
	// 		'post',
	// 		'blockons_post_description',
	// 		array(
	// 			'type'		=> 'string',
	// 			'single'	=> true,
	// 			'show_in_rest'	=> true,
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);
	// 	register_meta(
	// 		'post',
	// 		'blockons_post_reply_time',
	// 		array(
	// 			'type'		=> 'string',
	// 			'single'	=> true,
	// 			'show_in_rest'	=> true,
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);
	// 	register_meta(
	// 		'post',
	// 		'blockons_post_message_placeholder',
	// 		array(
	// 			'type'		=> 'string',
	// 			'single'	=> true,
	// 			'show_in_rest'	=> true,
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);
	// 	register_meta(
	// 		'post',
	// 		'blockons_post_call_to_action',
	// 		array(
	// 			'type'		=> 'string',
	// 			'single'	=> true,
	// 			'show_in_rest'	=> true,
	// 			'auth_callback' => function() {
	// 				return current_user_can( 'edit_posts' );
	// 			}
	// 		)
	// 	);

	// 	// Register Blocks
	// 	// blockons_register_block_type('blockons-button');
	// }

	/**
	 * Custom Body Classes to remove on devices
	 */
	// public function blockons_custom_body_class( $classes ) {
	// 	$blockonsOptions = get_option('kaira_sitechat_options');
	// 	$blockonsChatOptions = $blockonsOptions ? json_decode($blockonsOptions['blockonsOptions']) : '';
		
	// 	if (isset($blockonsChatOptions->remove_on_desktop) && $blockonsChatOptions->remove_on_desktop === true) {
	// 		$classes[] = sanitize_html_class('blockons-remdesktop');
	// 	}
	// 	if (isset($blockonsChatOptions->remove_on_tablet) && $blockonsChatOptions->remove_on_tablet === true) {
	// 		$classes[] = sanitize_html_class('blockons-remtablet');
	// 	}
	// 	if (isset($blockonsChatOptions->remove_on_mobile) && $blockonsChatOptions->remove_on_mobile === true) {
	// 		$classes[] = sanitize_html_class('blockons-remmobile');
	// 	}
	
	// 	return $classes;
	// }

	/**
	 * Installation. Runs on activation.
	 */
	public function install() {
		// $this->_save_initial_settings();
		$this->_log_version_number();
	}

	/**
	 * Save Initial Settings.
	 */
	private function _save_initial_settings() { //phpcs:ignore
		$settings = '{
			blocks: {
				accordions: true,
				icon_list: true,
				image_carousel: true,
				line_heading: true,
				marketing_button: true,
				progress_bars: true,
				search: true,
				testimonials: true,
				video_slider: true,
				wc_account_icon: true,
				wc_featured_product: true,
				wc_mini_cart: true,
			},
		}';
		update_option('blockons_options', json_encode($settings));
	}
	/**
	 * Log the plugin version number.
	 */
	private function _log_version_number() { //phpcs:ignore
		update_option('blockons_plugin_version', BLOCKONS_PLUGIN_VERSION);
	}
}
new Blockons_Admin();
