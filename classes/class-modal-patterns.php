<?php
/**
 * PopupModal Patterns Setup.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * PopupModal Patterns.
 */
class Blockons_Modal_Patterns {
	/**
	 * Constructor function.
	 */
	public function __construct() {
		add_action( 'init', array($this, 'blockons_register_pattern_categories'));
	}

	/**
	 * Register Blockons PopupModal Pattern Categories
	 */
	public function blockons_register_pattern_categories() {
		if ( function_exists( 'register_block_pattern_category' ) ) {
			register_block_pattern_category(
				'blockons-popup-modals',
				array(
					'label'       => __( 'Popup Modals', 'blockons' ),
					'description' => __( 'A collection of Popup Modals provided by the Blockons plugin.', 'blockons' ),
				)
			);
		}
	}
}
new Blockons_Modal_Patterns();
