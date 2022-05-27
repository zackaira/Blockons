<?php
/**
 * Plugin Name: Cart Icon Block
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: An Cart Icon Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package blockons
 */

defined( 'ABSPATH' ) || exit;

/**
 * Load all translations for our plugin from the MO file.
 */
function blockons_cart_icon_load_textdomain() {
	load_plugin_textdomain( 'blockons', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'blockons_cart_icon_load_textdomain' );

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function blockons_cart_icon_register_block() {

	// Register the block by passing the location of block.json.
	register_block_type( __DIR__ );
	// register_block_type(
	// 	__DIR__,
	// 	array(
	// 		'render_callback' => 'blockons_cart_icon_render_callback',
	// 	)
	// );

}
add_action( 'init', 'blockons_cart_icon_register_block' );

/**
 * This function is called when the block is being rendered on the front end of the site
 *
 * @param array    $attributes     The array of attributes for this block.
 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
 */
// function blockons_cart_icon_render_callback( $attributes, $content, $block_instance ) {
// 	ob_start();
// 	require plugin_dir_path( __FILE__ ) . 'template.php';
// 	return ob_get_clean();
// }

/**
 * Add Cart Items and Mini Cart to footer (hidden)
 */
function blockons_add_footer_wc_minicart() {
	$allowed_html = array(
		'div' => array('class' => array(), 'id' => array()),
		'a' => array('class' => array(), 'href' => array()),
		'span' => array('class' => array()),
	);
	$html = '<div class="blockons-hidden">' . blockons_wc_minicart_item() . '</div>';

	// Add Cart & Mini Cart to site footer
	echo wp_kses($html ,$allowed_html);
	the_widget( 'WC_Widget_Cart', array( 'title' => ''), array( 'before_widget' => '<div class="blockons-hidden"><div class="blockons-mini-crt">', 'after_widget' => '</div></div>' ) );
}
add_action('wp_footer', 'blockons_add_footer_wc_minicart' );

/**
 * Update Cart Item AJAX
 */
function blockons_woocommerce_cart_fragments( $fragments ) {
	$fragments['a.blockons-cart-amnt'] = blockons_wc_minicart_item();
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'blockons_woocommerce_cart_fragments' );

/**
 * Create Cart Item html
 */
function blockons_wc_minicart_item() {
	$cart_itemno = WC()->cart->get_cart_contents_count();
	$item_count_text = sprintf(
		/* translators: number of items in the mini cart. */
		_n( '%d item', '%d items', $cart_itemno, 'blockons' ), $cart_itemno
	);
	$has_items = $cart_itemno > 0 ? 'has-items' : 'no-items';

	$mini_cart = '<a class="blockons-cart-amnt ' . sanitize_html_class( $has_items ) . '" href="' . esc_url( wc_get_cart_url() ) . '">
						<span class="amount">' . wp_kses_data( WC()->cart->get_cart_subtotal() ) . '</span>
						<span class="count">' . esc_html( '(' . $item_count_text . ')' ) . '</span>
					</a>';
	return $mini_cart;
}
