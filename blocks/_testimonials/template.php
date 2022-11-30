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

	<div class="blockons-testimonials-slider" id="<?php echo esc_attr($attributes['uniqueId']); ?>">
		<div class="blockons-slider-wrap <?php echo isset($attributes['controlsOnHover']) ? sanitize_html_class("on-hover") : ""; ?> arrow-style-<?php echo esc_attr($attributes['arrowStyle']); ?> pagination-<?php echo esc_attr($attributes['sliderPagDesign']); ?>">
			<section class="splide">
				<div class="splide__track">
						<ul class="splide__list">
							<li class="splide__slide">Slide 01</li>
							<li class="splide__slide">Slide 02</li>
							<li class="splide__slide">Slide 03</li>
						</ul>
				</div>
			</section>
		</div>
	</div>

</div>
