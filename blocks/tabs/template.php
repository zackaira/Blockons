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
$custom_classes = $attributes['tabsSideLayout'] ? 'side-layout' : 'top-layout';
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes(['class' => $custom_classes]) ); ?>>
	<div class="blockons-tabs <?php echo ((isset($attributes['tabsSideLayout']) && $attributes['tabsSideLayout'] == false) && (isset($attributes['tabsJustified']) && $attributes['tabsJustified'] == true)) ? sanitize_html_class('full') : ''; ?> <?php echo isset($attributes['tabHasBg']) && $attributes['tabHasBg'] == false ? sanitize_html_class('nobg') : ''; ?>" <?php echo (isset($attributes['tabsSideLayout']) && $attributes['tabsSideLayout'] == false && isset($attributes['tabWidth'])) ? 'style="width: ' . esc_attr($attributes['tabWidth']) . 'px"' : ''; ?>>
	
		<?php foreach ($attributes['tabs'] as $i => $tab) : ?>

			<div
				class="blockons-tab <?php echo isset($attributes['alignment']) ? 'align-' . esc_attr($attributes['alignment']) : ''; ?>"
				id="tab-<?php echo $tab->clientId ? esc_attr($tab->clientId) : ''; ?>"
				style="
					background-color: <?php echo isset($attributes['tabColor']) ? esc_attr($attributes['tabColor']) : ''; ?>;
					color: <?php echo isset($attributes['tabFontColor']) ? esc_attr($attributes['tabFontColor']) : ''; ?>;
					padding: <?php echo isset($attributes['tabVertPadding']) ? esc_attr($attributes['tabVertPadding']) : '0'; ?>px <?php echo isset($attributes['tabHorizPadding']) ? esc_attr($attributes['tabHorizPadding']) : '0'; ?>px;">
				<?php echo $tab->attributes->tabTitle ? $tab->attributes->tabTitle : ''; ?>
			</div>

		<?php endforeach; ?>
	
	</div>
	<div class="blockons-tabs-innerblocks <?php echo count($attributes['tabs']) > 0 ? 'blockons-nbb' : ''; ?>" style="background-color: <?php echo isset($attributes['bgTabColor']) ? esc_attr($attributes['bgTabColor']) : ''; ?>; color: <?php echo isset($attributes['bgFontColor']) ? esc_attr($attributes['bgFontColor']) : ''; ?>; padding: <?php echo isset($attributes['contentVertPadding']) ? esc_attr($attributes['contentVertPadding']) : '0'; ?>px <?php echo isset($attributes['contentHorizPadding']) ? esc_attr($attributes['contentHorizPadding']) : '0'; ?>px; <?php echo count($attributes['tabs']) > 0 ? 'min-height: ' . esc_attr($attributes['contentMinHeight']) . 'px;' : ''; ?>">
		<InnerBlocks />
	</div>
</div>
