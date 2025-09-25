<?php
// Extract attributes.
$alignment        = isset( $attributes['alignment'] ) ? esc_attr( $attributes['alignment'] ) : 'left';
$search_display   = isset( $attributes['searchDisplay'] ) ? esc_attr( $attributes['searchDisplay'] ) : 'default';
$search_id        = isset( $attributes['searchId'] ) ? esc_attr( $attributes['searchId'] ) : '';
// Get multilingual-friendly home URL
$home_url = home_url('/');

// Override for specific translation plugins that need special handling
if (function_exists('pll_current_language')) {
    // Polylang: manually construct URL to avoid /home/ issue
    $current_lang = pll_current_language();
    $default_lang = function_exists('pll_default_language') ? pll_default_language() : '';
    
    if ($current_lang && $current_lang !== $default_lang) {
        // Only add language prefix if it's not the default language
        $base_url = rtrim(home_url(), '/');
        $home_url = $base_url . '/' . $current_lang . '/';
    }
    // For default language, keep the original home_url without language prefix
} elseif (function_exists('icl_get_home_url')) {
    // WPML: use their function
    $home_url = icl_get_home_url();
} elseif (class_exists('TRP_Translate_Press')) {
    // TranslatePress: use their URL manager
    global $TRP_LANGUAGE;
    if (!empty($TRP_LANGUAGE)) {
        $trp = TRP_Translate_Press::get_trp_instance();
        $url_manager = $trp->get_component('url_manager');
        $home_url = $url_manager->get_url_for_language($TRP_LANGUAGE);
    }
}
// Apply searchform_url filter as final step (some plugins may still use this)
$home_url = apply_filters('searchform_url', esc_url($home_url));

$is_premium       = ! empty( $attributes['isPremium'] );
$has_placeholder  = ! empty( $attributes['hasPlaceholder'] );
$search_value     = isset( $attributes['searchValue'] ) ? esc_attr( $attributes['searchValue'] ) : '';
$search_width_default = isset( $attributes['searchWidthDefault'] ) ? esc_attr( $attributes['searchWidthDefault'] ) : '300px';
$search_width_dropdown = isset( $attributes['searchWidthDropdown'] ) ? esc_attr( $attributes['searchWidthDropdown'] ) : '';
$search_width_popup = isset( $attributes['searchWidthPopup'] ) ? esc_attr( $attributes['searchWidthPopup'] ) : '';
$text_button      = isset( $attributes['textButton'] ) ? esc_html( $attributes['textButton'] ) : '';
$icon_color       = isset( $attributes['iconColor'] ) ? esc_attr( $attributes['iconColor'] ) : '#000';
$icon_bg_color    = isset( $attributes['iconBgColor'] ) ? esc_attr( $attributes['iconBgColor'] ) : '#fff';
$icon_size        = isset( $attributes['iconSize'] ) ? esc_attr( $attributes['iconSize'] ) : '17px';
$icon_padding     = isset( $attributes['iconPadding'] ) ? esc_attr( $attributes['iconPadding'] ) : '5px';
$search_bg_color  = isset( $attributes['searchBgColor'] ) ? esc_attr( $attributes['searchBgColor'] ) : '#fff';
$search_align     = isset( $attributes['searchAlign'] ) ? esc_attr( $attributes['searchAlign'] ) : 'bottomleft';
$search_input_bg_color = isset( $attributes['searchInputBgColor'] ) ? esc_attr( $attributes['searchInputBgColor'] ) : '#fff';
$search_input_border_color = isset( $attributes['searchInputBorderColor'] ) ? esc_attr( $attributes['searchInputBorderColor'] ) : '#000';
$search_input_color = isset( $attributes['searchInputColor'] ) ? esc_attr( $attributes['searchInputColor'] ) : '#000';
$has_button       = ! empty( $attributes['hasBtn'] );
$search_btn_bg_color = isset( $attributes['searchBtnBgColor'] ) ? esc_attr( $attributes['searchBtnBgColor'] ) : '#000';
$search_btn_color = isset( $attributes['searchBtnColor'] ) ? esc_attr( $attributes['searchBtnColor'] ) : '#fff';

$custom_classes = 'align-' . $alignment . ' ' . esc_attr( $search_display === 'default' ? 'default-search' : 'icon-search' );

$search_pro_options = $is_premium && ! empty( $attributes['searchPro'] ) ? json_encode( [
	'searchProId'          => $attributes['searchProId'] ?? '',
	'searchPro'            => $attributes['searchPro'] ?? '',
	'searchProTypes'       => $attributes['searchProTypes'] ?? '',
	'searchProAmnt'        => $attributes['searchProAmnt'] ?? '',
	'searchProCats'        => $attributes['searchProCats'] ?? '',
	'searchProCatsTitle'   => $attributes['searchProCatsTitle'] ?? '',
	'searchProCatsAmnt'    => $attributes['searchProCatsAmnt'] ?? '',
	'searchProTags'        => $attributes['searchProTags'] ?? '',
	'searchProTagsTitle'   => $attributes['searchProTagsTitle'] ?? '',
	'searchProTagsAmnt'    => $attributes['searchProTagsAmnt'] ?? '',
	'searchProImage'       => $attributes['searchProImage'] ?? '',
	'searchProDesc'        => $attributes['searchProDesc'] ?? '',
	'searchProPrice'       => $attributes['searchProPrice'] ?? '',
	'searchProHasPreview'  => $attributes['searchProHasPreview'] ?? false,
] ) : null;
?>
<div <?php echo wp_kses_data( get_block_wrapper_attributes(['class' => $custom_classes, 'id' => esc_attr( $search_id )]) ); ?>>
	<div 
		class="blockons-search-block 
		<?php 
			echo esc_attr( $search_display ) . ' ';
			echo ( 'dropdown' === $search_display && $search_align ) ? esc_attr( $search_align ) . ' ' : ''; 
			echo ( 'default' === $search_display ) ? esc_attr('nopad ') : ''; 
			echo $has_button ? 'hasBtn' : 'noBtn'; 
		?>" 
		style="<?php
			if ( 'dropdown' === $search_display || 'popup' === $search_display ) {
				echo 'background-color: ' . esc_attr( $icon_bg_color ) . '; ';
				echo 'padding: ' . esc_attr( $icon_padding ) . 'px; ';
				echo 'font-size: ' . esc_attr( $icon_size ) . 'px; ';
			} ?>">
		<?php if ( 'default' === $search_display ) : ?>
			<div class="blockons-search-default" style="width: <?php echo esc_attr( $search_width_default ); ?>;">
				<form role="search" method="get" class="blockons-search-inner <?php echo $has_placeholder ? 'hasph' : 'noph'; ?>" action="<?php echo esc_url( $home_url ); ?>">
					<input type="text" name="s" class="blockons-search-input" <?php echo $has_placeholder ? 'placeholder="' . esc_attr( $search_value ) . '"' : ''; ?> required autocomplete="off" style="background-color: <?php echo esc_attr( $search_input_bg_color ); ?>; border-color: <?php echo esc_attr( $search_input_border_color ); ?>; color: <?php echo esc_attr( $search_input_color ); ?>;">
					<?php if ( $has_button ) : ?>
						<button type="submit" class="blockons-search-button" style="background-color: <?php echo esc_attr( $search_btn_bg_color ); ?>; color: <?php echo esc_attr( $search_btn_color ); ?>;">
							<?php echo esc_html( $text_button ); ?>
						</button>
					<?php endif; ?>
				</form>
				<?php if ( $search_pro_options ) : ?>
					<div class="blockons-search-results-wrap" id="<?php echo esc_attr( $attributes['searchProId'] ); ?>" data-settings='<?php echo esc_attr( $search_pro_options ); ?>'></div>
				<?php endif; ?>
			</div>
		<?php endif; ?>

		<?php if ( 'dropdown' === $search_display || 'popup' === $search_display ) : ?>
			<span
				class="fa-solid fa-magnifying-glass"
				style="color: <?php echo esc_attr( $icon_color ); ?>;"
			></span>
		<?php endif; ?>

		<?php if ( 'dropdown' === $search_display ) : ?>
			<div class="blockons-search-dropdown" style="width: <?php echo esc_attr( $search_width_dropdown ); ?>px; <?php echo ( 'bottomcenter' === $search_align || 'topcenter' === $search_align ) ? 'margin-left: -' . ( $search_width_dropdown / 2 ) . 'px;' : ''; ?>">
				<form role="search" method="get" class="blockons-search-inner <?php echo $has_placeholder ? 'hasph' : 'noph'; ?>" action="<?php echo esc_url( $home_url ); ?>">
					<input type="text" name="s" class="blockons-search-input" <?php echo $has_placeholder ? 'placeholder="' . esc_attr( $search_value ) . '"' : ''; ?> required autocomplete="off" style="background-color: <?php echo esc_attr( $search_input_bg_color ); ?>; border-color: <?php echo esc_attr( $search_input_border_color ); ?>; color: <?php echo esc_attr( $search_input_color ); ?>;">
					<?php if ( $has_button ) : ?>
						<button type="submit" class="blockons-search-button" style="background-color: <?php echo esc_attr( $search_btn_bg_color ); ?>; color: <?php echo esc_attr( $search_btn_color ); ?>;">
							<?php echo esc_html( $text_button ); ?>
						</button>
					<?php endif; ?>
				</form>
				<?php if ( $search_pro_options ) : ?>
					<div class="blockons-search-results-wrap" id="<?php echo esc_attr( $attributes['searchProId'] ); ?>" data-settings='<?php echo esc_attr( $search_pro_options ); ?>'></div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>

	<?php if ( 'popup' === $search_display ) : ?>
		<div class="blockons-search-popup-wrap">
			<div class="blockons-search-popup-overlay"></div>
			<div class="blockons-search-popup-wrapper">
				<div class="blockons-search-popup" style="width: <?php echo esc_attr( $search_width_popup ); ?>px; background-color: <?php echo esc_attr( $search_bg_color ); ?>;">
					<div class="blockons-close fas fa-x"></div>
					<form role="search" method="get" class="blockons-search-inner <?php echo $has_placeholder ? 'hasph' : 'noph'; ?>" action="<?php echo esc_url( $home_url ); ?>">
						<input type="text" name="s" class="blockons-search-input" <?php echo $has_placeholder ? 'placeholder="' . esc_attr( $search_value ) . '"' : ''; ?> required autocomplete="off" style="background-color: <?php echo esc_attr( $search_input_bg_color ); ?>; border-color: <?php echo esc_attr( $search_input_border_color ); ?>; color: <?php echo esc_attr( $search_input_color ); ?>;">
						<?php if ( $has_button ) : ?>
							<button type="submit" class="blockons-search-button" style="background-color: <?php echo esc_attr( $search_btn_bg_color ); ?>; color: <?php echo esc_attr( $search_btn_color ); ?>;">
								<?php echo esc_html( $text_button ); ?>
							</button>
						<?php endif; ?>
					</form>
					<?php if ( $search_pro_options ) : ?>
						<div class="blockons-search-results-wrap" id="<?php echo esc_attr( $attributes['searchProId'] ); ?>" data-settings='<?php echo esc_attr( $search_pro_options ); ?>'></div>
					<?php endif; ?>
				</div>
			</div>
		</div>
	<?php endif; ?>
</div>
