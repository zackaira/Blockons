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

		add_filter('admin_body_class', array($this, 'blockons_admin_body_classes'));

		// Add Quickview to WooCommerce Blocks
		add_filter('woocommerce_blocks_product_grid_item_html', array( $this, 'blockons_add_quickview' ), 10, 3);
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
					"title" => __("Blockons Blocks", "blockons"),
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
	 * Function to check for active plugins
	 */
	public function blockons_admin_body_classes($admin_classes) {
		$blockonsSavedOptions = get_option('blockons_options');
		$blockonsOptions = $blockonsSavedOptions ? json_decode($blockonsSavedOptions) : '';
		
		// Pro / Free
		if ( blockons_fs()->can_use_premium_code__premium_only() ) {
			$admin_classes .= ' ' . sanitize_html_class('blockons-pro');
		} else {
			$admin_classes .= ' ' . sanitize_html_class('blockons-free');
		}

		// Tooltips
		if (isset($blockonsOptions->tooltips->enabled) && $blockonsOptions->tooltips->enabled == true) {
			$admin_classes .= ' ' . sanitize_html_class('blockons-tooltips');

			if ( blockons_fs()->can_use_premium_code__premium_only() ) {
				if (isset($blockonsOptions->tooltips->style)) {
					$admin_classes .= ' ' . sanitize_html_class('blstyle-' . $blockonsOptions->tooltips->style);
				}
			}
		}

		// Image Lightbox
		if (isset($blockonsOptions->imagepopups->enabled) && $blockonsOptions->imagepopups->enabled == true) {
			$admin_classes .= ' ' . sanitize_html_class('blockons-imgpopup');
			if (isset($blockonsOptions->imagepopups->enable_all) && $blockonsOptions->imagepopups->enable_all == true) {
				$admin_classes .= ' ' . sanitize_html_class('global');
			}

			if (isset($blockonsOptions->imagepopups->popuptheme)) {
				$admin_classes .= ' ' . sanitize_html_class('popup-' . $blockonsOptions->imagepopups->popuptheme);
			}
		}

		return $admin_classes;
	}

	function blockons_add_quickview( $html, $data, $product ) {
		$blockonsSavedOptions = get_option('blockons_options');
		$blockonsOptions = $blockonsSavedOptions ? json_decode($blockonsSavedOptions) : '';
		$quickview = isset($blockonsOptions->quickview) ? $blockonsOptions->quickview : '';

		if ( isset($quickview->enabled) && $quickview->enabled == false) return $html;

		$position = isset($quickview->position) ? $quickview->position : 'one';
		$text = isset($quickview->text) ? $quickview->text : __("Quick View", "blockons");
		$oneclass = "one" == $position ? "wp-block-button__link wp-element-button add_to_cart_button" : "";
	
		$search = '</li>';
		if ( 'three' == $position || 'four' == $position ) {
			$search = '<img';
		}
	
		// $add = 'three' == $position || 'four' == $position ? $search : '';
		$add = '<div class="blockons-quickview ' . sanitize_html_class($position) . '">';
		$add .=     '<div class="blockons-quickview-btn blockons-venobox ' . esc_attr($oneclass) . '" data-id="' . esc_attr( $product->get_id() ) . '">';
		$add .=         esc_html($text);
		$add .=     '</div>';
		$add .= '</div>' . $search;
		// $add .= 'one' == $position || 'two' == $position ? $search : '';
	
		$output = str_replace($search, $add, $html);
	
		return $output;
	}
	
}
new Blockons_Admin();
