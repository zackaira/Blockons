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
$custom_classes = '';

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
	<div class="blockons-slider slider adv-slider <?php echo isset($attributes['showOnHover']) && $attributes['showOnHover'] == true ? sanitize_html_class("controlsOnHover") : ""; ?> navigation-<?php echo sanitize_html_class($attributes['navigationStyle']); ?> navigation-<?php echo sanitize_html_class($attributes['navigationColor']); ?> pagination-<?php echo sanitize_html_class($attributes['paginationStyle']); ?> pagination-<?php echo sanitize_html_class($attributes['paginationColor']); ?> <?php echo isset($attributes['navigationArrow']) && $attributes['navigationArrow'] == "ban" ? sanitize_html_class("default-icon") : sanitize_html_class("custom-icon"); ?> arrows-<?php echo sanitize_html_class($attributes['navigationArrow']); ?>" id="<?php echo esc_attr($attributes['uniqueId']); ?>" data-settings="<?php echo esc_attr(json_encode((object)$sliderOptions)); ?>">
		<div class="swiper">
			<div class="swiper-wrapper">
				<?php foreach ($attributes['sliderSlides'] as $i => $slide) { ?>
					<div class="swiper-slide">

						<div class="swiper-slide-inner style-<?php echo isset($slide['style']) ? sanitize_html_class($slide['style']) : sanitize_html_class($attributes['sliderStyle']); ?> <?php echo (isset($attributes['forceFullWidth']) && $attributes['forceFullWidth'] == true) || (isset($attributes['imageProportion']) && $attributes['imageProportion'] != 'actual') ? 'imgfull' : ''; ?>">
							<div class="blockons-slider-image" style="background-image: url(<?php echo (isset($slide['image']) && isset($slide['image']['url']) && $slide['image']['url'] != "") ? esc_url($slide['image']['url']) : esc_url(BLOCKONS_PLUGIN_URL . 'assets/images/placeholder.png'); ?>);">
								<?php if (isset($attributes['imageOverlay']) && $attributes['imageOverlay'] == true) : ?>
									<div class="blockons-slider-imgoverlay" style="<?php echo isset($attributes['imageOverlayColor']) ? 'background-color:' . esc_attr($attributes['imageOverlayColor']) . '; ' : ''; ?> <?php echo isset($attributes['imageOverlayOpacity']) ? 'opacity:' . esc_attr($attributes['imageOverlayOpacity']) . '; ' : ''; ?>"></div>
								<?php endif; ?>
								
								<?php if (isset($attributes['imageProportion']) && $attributes['imageProportion'] == "actual") : ?>

									<?php if (isset($slide['image']) && isset($slide['image']['url']) && $slide['image']['url'] != "") : ?>
										<img src="<?php echo esc_url($slide['image']['url']); ?>" alt="<?php echo isset($slide['image']) && isset($slide['image']['alt']) ? esc_attr($slide['image']['alt']) : ''; ?>" />
									<?php else : ?>
										<img src="<?php echo esc_url(BLOCKONS_PLUGIN_URL . 'assets/images/placeholder.png'); ?>" />
									<?php endif; ?>

								<?php else : ?>

									<img src="<?php echo esc_url(BLOCKONS_PLUGIN_URL . 'assets/images/' . $attributes['imageProportion'] . '.png'); ?>" />

								<?php endif; ?>
							</div>

							<div class="blockons-slider-inner align-<?php echo isset($attributes['alignment']) ? sanitize_html_class($attributes['alignment']) : ''; ?>">
								<div class="blockons-slider-inner-slide">
									<?php if (isset($attributes['infoBg']) && $attributes['infoBg'] == true) : ?>
										<div class="blockons-slider-content-bg" style="<?php echo isset($attributes['infoBgColor']) ? 'background-color:' . esc_attr($attributes['infoBgColor']) . '; ' : ''; ?> <?php echo isset($attributes['infoBgOpacity']) ? 'opacity:' . esc_attr($attributes['infoBgOpacity']) . '; ' : ''; ?>"></div>
									<?php endif; ?>
									
									<?php if ((isset($attributes['showTitle']) && $attributes['showTitle'] == true) || (isset($attributes['showDesc']) && $attributes['showDesc'] == true)) : ?>
										<div class="blockons-slider-content">
											
											<?php if (isset($attributes['showTitle']) && $attributes['showTitle'] == true) : ?>
												<h4 class="slider-title" style="<?php echo isset($attributes['defaultTitleSize']) ? 'font-size:' . esc_attr($attributes['defaultTitleSize']) . 'px; ' : ''; ?> <?php echo isset($attributes['defaultTitleColor']) ? 'color:' . esc_attr($attributes['defaultTitleColor']) . '; ' : ''; ?>">
													<?php esc_html_e($slide['title']); ?>
												</h4>
											<?php endif; ?>
											
											<?php if (isset($attributes['showDesc']) && $attributes['showDesc'] == true) : ?>
												<p class="slider-desc" style="<?php echo isset($attributes['defaultDescSize']) ? 'font-size:' . esc_attr($attributes['defaultDescSize']) . 'px; ' : ''; ?> <?php echo isset($attributes['defaultDescColor']) ? 'color:' . esc_attr($attributes['defaultDescColor']) . '; ' : ''; ?>">
													<?php esc_html_e($slide['subtitle']); ?>
												</p>
											<?php endif; ?>
											
											<?php if (isset($slide['link']) && isset($slide['link']['type']) && $slide['link']['type'] == "button") : ?>
												<div class="slider-btns">
													
													<?php
													if (isset($slide['buttons']) && isset($slide['buttons']['buttons'])) :
														foreach ($slide['buttons']['buttons'] as $button) : ?>
															
															<?php if (isset($button['link']) && isset($button['link']['url'])) : ?>
																<a href="<?php esc_url($button['link']['url']); ?>" class="slider-btn" <?php echo isset($button['link']) && isset($button['link']['opensInNewTab']) && $button['link']['opensInNewTab'] == true ? esc_attr('target="_blank"') : ''; ?>>
																	<?php esc_html_e($button['text']); ?>
																</a>
															<?php endif; ?>

														<?php
														endforeach;
													endif; ?>

												</div>
											<?php endif; ?>
										</div>
									<?php endif; ?>
								</div><!-- .blockons-slider-inner-slide -->
							</div><!-- .blockons-slider-image -->
						</div><!-- .swiper-slide-inner -->

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
