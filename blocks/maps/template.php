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
$markerClass     = 'marker-style-' . $attributes['markerStyle'] ?? 'one';
$mapLatitude     = $attributes['mapLatitude'] ?? '';
$mapLongitude    = $attributes['mapLongitude'] ?? '';
$zoom            = $attributes['zoom'] ?? '10';
$height          = $attributes['height'] ?? '400';
$markers         = $attributes['markers'] ?? [];
$selectedMarker  = $attributes['selectedMarker'] ?? null;
$showMarkerInfo  = !empty($attributes['showMarkerInfo']);
$showMarkerIcons = !empty($attributes['showMarkerIcons']);
$showControls    = !empty($attributes['showControls']);
$markersColor    = $attributes['markersColor'] ?? '#000';
$markersBgColor    = $attributes['markersBgColor'] ?? '#000';
$isPremium       = $attributes['isPremium'];

// If not premium and markers exist, only keep the first marker.
if ( ! $isPremium && ! empty( $markers ) ) {
    $markers = array_slice( $markers, 0, 1 );
}

// Encode markers JSON safely
$markers_json = esc_attr(wp_json_encode($markers, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
?>

<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<div class="blockons-mapbox loading <?php echo esc_attr($markerClass); ?>"
		data-latitude="<?php echo esc_attr($mapLatitude); ?>"
		data-longitude="<?php echo esc_attr($mapLongitude); ?>"
		data-zoom="<?php echo esc_attr($zoom); ?>"
		data-markercolor="<?php echo esc_attr($markersColor); ?>"
		data-markerbgcolor="<?php echo esc_attr($markersBgColor); ?>"
		data-markers="<?php echo $markers_json; ?>"
		data-selectedmarker="<?php echo esc_attr($selectedMarker); ?>"
		style="height: <?php echo esc_attr($height); ?>px;">
		
		<!-- Map Container -->
		<div class="blockons-map-container" style="height: 100%; width: 100%;"></div>

		<?php if (!empty($markers)) : ?>
			<div class="blockons-map-marker-info">
				<?php if ($showMarkerIcons) : ?>
					<div class="blockons-map-icons">
						<?php foreach ($markers as $index => $marker) : ?>
							<div class="blockons-map-icon <?php echo ($selectedMarker == $index) ? 'selected' : ''; ?>" data-marker-index="<?php echo esc_attr($index); ?>">
								<span class="<?php echo esc_attr($marker['icon'] ?? 'fas fa-map-marker-alt'); ?>"></span>
							</div>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

				<!-- Marker Info Block -->
				<div class="blockons-marker-infoblock <?php echo !$showMarkerInfo ? 'off' : ''; ?>">
					<?php if ($showMarkerInfo && $selectedMarker !== null && isset($markers[$selectedMarker])) : ?>
						<h6><?php echo esc_html($markers[$selectedMarker]['title'] ?? ''); ?></h6>
						<p><?php echo esc_html($markers[$selectedMarker]['description'] ?? ''); ?></p>
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ($showControls) : ?>
			<div class="blockons-map-controls">
				<?php if (!empty($markers)) : ?>
					<div class="blockons-map-icon fitbounds">
						<span class="fas fa-expand"></span>
					</div>
				<?php endif; ?>
			</div>
		<?php endif; ?>
	</div>
</div>
