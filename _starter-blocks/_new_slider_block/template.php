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

$sliderOptions = array(
	"autoHeight" => true,
	"effect" => $attributes['transition'],
	"slidesPerView" => $attributes['transition'] === "slide" ? $attributes['perView'] : 1,
	"spaceBetween" => $attributes['spaceBetween'],
	"loop" => $attributes['mode'] === "loop" ? true : false,
	"rewind" => $attributes['mode'] === "rewind" ? true : false,
	"navigation" => isset($attributes['navigation']) && $attributes['navigation'] == true ? array(
		"prevEl" => ".swiper-button-prev",
		"nextEl" => ".swiper-button-next",
	) : false,
	"pagination" => isset($attributes['pagination']) && $attributes['pagination'] == true ? array(
		"el" => ".swiper-pagination",
		"type" => $attributes['paginationStyle'] == "fraction" ? "fraction" : "bullets",
		"dynamicBullets" => $attributes['paginationStyle'] == "dynamicBullets" ? true : false,
		"clickable" => true,
	) : false,
);
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes(['class' => $custom_classes]) ); ?>>
	<div class="blockons-slider <?php echo isset($attributes['showOnHover']) && $attributes['showOnHover'] == true ? sanitize_html_class("controlsOnHover") : ""; ?> navigation-<?php echo sanitize_html_class($attributes['navigationStyle']); ?> navigation-<?php echo sanitize_html_class($attributes['navigationColor']); ?> pagination-<?php echo sanitize_html_class($attributes['paginationStyle']); ?> pagination-<?php echo sanitize_html_class($attributes['paginationColor']); ?> <?php echo isset($attributes['navigationArrow']) && $attributes['navigationArrow'] == "ban" ? sanitize_html_class("default-icon") : sanitize_html_class("custom-icon"); ?> arrows-<?php echo sanitize_html_class($attributes['navigationArrow']); ?>" id="<?php echo esc_attr($attributes['uniqueId']); ?>" data-settings="<?php echo esc_attr(json_encode((object)$sliderOptions)); ?>">
		<div class="swiper">
			<div class="swiper-wrapper">
				<?php foreach ($attributes['sliderSlides'] as $i => $slide) { ?>
					<div class="swiper-slide">
						<div className="swiper-slide-inner">
							<h4><?php echo esc_html($slide['title']); ?></h4>
						</div>
					</div>
				<?php } ?>
			</div>
			
			<?php if (isset($attributes['navigation']) && $attributes['navigation'] == true) : ?>
				<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>
			<?php endif; ?>
			
			<?php if (isset($attributes['pagination']) && $attributes['pagination'] == true) : ?>
				<div class="swiper-pagination"></div>
			<?php endif; ?>
		</div>
	</div>
</div>
