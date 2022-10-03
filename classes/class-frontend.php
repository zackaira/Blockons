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
		$blockonsSavedOptions = get_option('blockons_options');
		$blockonsOptions = $blockonsSavedOptions ? json_decode($blockonsSavedOptions) : '';

		if (isset($blockonsOptions->sidecart->enabled) && $blockonsOptions->sidecart->enabled == true) {
			add_action('wp_footer', array( $this, 'blockons_pro_add_footer_sidecart' ), 10, 1);
		}
		if (isset($blockonsOptions->bttb->enabled) && $blockonsOptions->bttb->enabled == true) {
			add_action('wp_footer', array( $this, 'blockons_add_footer_bttb' ), 10, 1);
		}
	}

	/**
	 * Add Back to Top Button
	 */
	public function blockons_add_footer_bttb() {
		// Add Side Cart Element
		echo '<div id="blockons-bttb"></div>';
	}

	/**
	 * PREMIUM: Side Cart Elements
	 */
	public function blockons_pro_add_footer_sidecart() {
		if (!has_block('blockons/wc-mini-cart')) {
			$allowed_html = array(
				'div' => array('class' => array(), 'id' => array(), 'style' => array()),
				'a' => array('class' => array(), 'href' => array()),
				'span' => array('class' => array()),
			);
			$html = '<div class="blockons-hidden" style="width: 0; height: 0; overflow: hidden;">' . blockons_wc_minicart_item() . '</div>';
		
			// Add Cart & Mini Cart to site footer
			echo wp_kses($html ,$allowed_html);
		
			echo '<div class="blockons-hidden" style="width: 0; height: 0; overflow: hidden;"><div class="blockons-mini-crt">';
				echo '<div class="widget_shopping_cart_content">';
					woocommerce_mini_cart();
				echo '</div>';
			echo '</div></div>';
		}
		
		// Add Side Cart Element
		echo '<div id="blockons-side-cart" class="blockons-side-cart-wrap"></div>';
	}

}
new Blockons_Frontend();
