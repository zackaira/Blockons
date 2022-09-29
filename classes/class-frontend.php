<?php
/**
 * Frontend functions.
 */
if (!defined('ABSPATH')) { exit; }

/**
 * Frontend class.
 */
class Blockons_Frontend {
	/**
	 * Constructor function.
	 */
	public function __construct() {
		// add_action('wp_footer', array( $this, 'blockons_add_footer_sidecart' ), 10, 1);
	}

	/**
	 * Create a footer Sidecart div
	 */
	// public function blockons_add_footer_sidecart() {
	// 	echo '<div class="blockons-side-cart-wrapper"></div>';
	// }
}
new Blockons_Frontend();
