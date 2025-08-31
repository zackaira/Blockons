<?php
/**
 * Plugin Name: Icon Selector Block
 * Plugin URI: https://github.com/WordPress/blockons
 * Description: An Icon Selector Block.
 * Version: 1.1.0
 * Author: Kaira
 *
 * @package blockons
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function blockons_icon_selector_register_block() {

	// Register the block by passing the location of block.json.
	register_block_type(
		__DIR__,
		array(
			'render_callback' => 'blockons_icon_selector_render_callback',
		)
	);

	if ( function_exists( 'wp_set_script_translations' ) ) {
		/**
		 * May be extended to wp_set_script_translations( 'my-handle', 'my-domain',
		 * plugin_dir_path( MY_PLUGIN ) . 'languages' ) ). For details see
		 * https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/
		 */
		wp_set_script_translations( 'blockons-icon-selector', 'blockons' );
	}

}
add_action( 'init', 'blockons_icon_selector_register_block' );

/**
 * This function is called when the block is being rendered on the front end of the site
 *
 * @param array    $attributes     The array of attributes for this block.
 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
 */
function blockons_icon_selector_render_callback( $attributes, $content, $block_instance ) {
	ob_start();
	/**
	 * All of passed parameters are still accessible in the file.
	 */
	require plugin_dir_path( __FILE__ ) . 'template.php';
	return ob_get_clean();
}
