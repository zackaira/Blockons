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
$alignment = $attributes['layout'] == "two" ? ' alignment-' . $attributes['alignment'] : "";
$custom_classes = 'align-' . $attributes['align'] . ' layout-' . $attributes['layout'] . $alignment . ' design-' . $attributes['design'];
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes(['class' => $custom_classes]) ); ?>>
	<?php if ($attributes['linkType'] == "full") : ?>
		<a class="blockons-count-timer-block">
	<?php else : ?>
		<div class="blockons-count-timer-block">
	<?php endif; ?>
		

		The Front-end


	<?php if ($attributes['linkType'] == "full") : ?>
		</a>
	<?php else : ?>
		</div>
	<?php endif; ?>
	</div>
</div>
