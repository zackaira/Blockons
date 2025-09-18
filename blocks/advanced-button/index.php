<?php
/**
 * Plugin Name: Advanced Button Block
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: An Advanced Button Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package blockons
 */
defined( 'ABSPATH' ) || exit;

/**
 * Register Block Assets
 */
function blockons_advanced_button_register_block() {
	// Register the block by passing the location of block.json.
	register_block_type(__DIR__, array(
		'render_callback' => 'blockons_advanced_button_render_callback',
	));

	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'blockons-advanced-button-editor-script', 'blockons', BLOCKONS_PLUGIN_DIR . 'lang' );
	}
}

/**
 * Render callback for Advanced Button block
 * Handles dynamic URL replacement for WooCommerce collections and query blocks
 */
function blockons_advanced_button_render_callback( $attributes, $content, $block ) {
	// Check if we need to replace placeholder URLs
	if ( isset( $attributes['buttonUrl'] ) && $attributes['buttonAction'] === 'link' ) {
		$button_url = $attributes['buttonUrl'];
		
		// Replace product permalink placeholder
		if ( $button_url === '{{product_permalink}}' ) {
			global $product;
			if ( $product && is_a( $product, 'WC_Product' ) ) {
				$product_url = get_permalink( $product->get_id() );
				$content = str_replace( 'href="{{product_permalink}}"', 'href="' . esc_url( $product_url ) . '"', $content );
			} else {
				// Fallback: try to get product from global $post
				global $post;
				if ( $post && $post->post_type === 'product' ) {
					$product_url = get_permalink( $post->ID );
					$content = str_replace( 'href="{{product_permalink}}"', 'href="' . esc_url( $product_url ) . '"', $content );
				}
			}
		}
		
		// Replace post permalink placeholder
		if ( $button_url === '{{post_permalink}}' ) {
			global $post;
			if ( $post ) {
				$post_url = get_permalink( $post->ID );
				$content = str_replace( 'href="{{post_permalink}}"', 'href="' . esc_url( $post_url ) . '"', $content );
			}
		}
	}
	
	// Replace product ID placeholder for quickview functionality
	if ( strpos( $content, '{{product_id}}' ) !== false ) {
		global $product;
		$product_id = '';
		
		if ( $product && is_a( $product, 'WC_Product' ) ) {
			$product_id = $product->get_id();
		} else {
			// Fallback: try to get product from global $post
			global $post;
			if ( $post && $post->post_type === 'product' ) {
				$product_id = $post->ID;
			}
		}
		
		if ( $product_id ) {
			$content = str_replace( '{{product_id}}', $product_id, $content );
		}
	}
	
	return $content;
}
add_action( 'init', 'blockons_advanced_button_register_block' );
