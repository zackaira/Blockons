<?php
/**
 * Add Cart Items and Mini Cart to footer (hidden)
 */
function blockons_add_footer_wc_minicart() {
	$allowed_html = array(
		'div' => array('class' => array(), 'id' => array()),
		'a' => array('class' => array(), 'href' => array()),
		'span' => array('class' => array()),
	);

	// $html = '<div class="blockons-cart-amnt">FUCK!</div>';
	$html = blockons_wc_minicart_item();

	echo wp_kses($html ,$allowed_html);
	the_widget( 'WC_Widget_Cart', array( 'title' => ''), array( 'before_widget' => '<div class="blockons-mini-crt blockons-hidden">', 'after_widget' => '</div>' ) );
}
add_action('wp_footer', 'blockons_add_footer_wc_minicart' );

/**
 * Update Cart Item AJAX
 */
function blockons_woocommerce_cart_fragments( $fragments ) {
	ob_start();
	blockons_wc_minicart_item();
	$fragments['a.blockons-cart-amnt'] = ob_get_clean();
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
		_n( '%d item', '%d items', $cart_itemno, 'blockons' ),
		$cart_itemno
	);
	$has_items = $cart_itemno > 0 ? 'has-items' : 'no-items';

	$mini_cart = '<div class="blockons-hidden">
					<a class="blockons-cart-amnt ' . sanitize_html_class( $has_items ) . '" href="' . esc_url( wc_get_cart_url() ) . '">
						<span class="amount">' . wp_kses_data( WC()->cart->get_cart_subtotal() ) . '</span>
						<span class="count">' . esc_html( '(' . $item_count_text . ')' ) . '</span>
					</a>
				</div>';
	return $mini_cart;
}