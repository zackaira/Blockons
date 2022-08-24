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
		add_action('admin_menu', array( $this, 'blockons_create_admin_menu' ), 10, 1);
		add_filter('plugin_action_links_blockons/blockons.php', array($this, 'blockons_add_plugins_settings_link'));
		add_filter('plugin_row_meta', array($this, 'blockons_add_plugins_row_link'), 10, 2);

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
	public function blockons_add_plugins_settings_link($links) {
		$settings_link = '<a href="options-general.php?page=blockons-settings">' . esc_html__('Settings', 'blockons') . '</a>';
		array_push( $links, $settings_link );
		
  		return $links;
	}

	/**
	 * Create a Setting link on Plugins.php page
	 */
	public function blockons_add_plugins_row_link($plugin_meta, $plugin_file) {
		if ( strpos( $plugin_file, 'kaira-site-chat.php' ) !== false ) {
			$new_links = array(
				'Documentation' => '<a href="' . esc_url( 'https://blockons.com/documentation/' ) . '" target="_blank" aria-label="' . esc_attr__( 'View Blockons documentation', 'blockons' ) . '">' . esc_html__( 'Documentation', 'blockons' ) . '</a>',
				'FAQs' => '<a href="' . esc_url( 'https://blockons.com/support/faqs/' ) . '" target="_blank" aria-label="' . esc_attr__( 'Go to Blockons FAQ\'s', 'blockons' ) . '">' . esc_html__( 'FAQ\'s', 'blockons' ) . '</a>'
			);
			$plugin_meta = array_merge( $plugin_meta, $new_links );
		}
		 
		return $plugin_meta;
	}
	

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
	public static function blockons_is_plugin_active($plugin_name) {
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
}
new Blockons_Admin();
