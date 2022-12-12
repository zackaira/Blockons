<?php
/**
 * All of the parameters passed to the function where this file is being required are accessible in this scope:
 *
 * @param array    $attributes     The array of attributes for this block.
 * @param string   $content        Rendered block output. ie. <InnerBlocks.Content />.
 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
 *
 * @package blockons
 */
$custom_classes = 'align-' . $attributes['alignment'];
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes(['class' => $custom_classes]) ); ?>>
	<div class="blockons-gallery" id="<?php echo esc_attr($attributes['uniqueId']); ?>">
		image gallery
	</div>
</div>
