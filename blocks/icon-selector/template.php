<?php
/**
 * Icon Selector Block Template
 * 
 * All attributes passed via the render function are available in the $attributes array.
 * This template replaces the JavaScript save.js functionality.
 */

defined( 'ABSPATH' ) || exit;

// Extract attributes with defaults
$alignment = isset( $attributes['alignment'] ) ? $attributes['alignment'] : 'left';
$icon = isset( $attributes['icon'] ) ? $attributes['icon'] : 'leaf';
$prefix = isset( $attributes['prefix'] ) ? $attributes['prefix'] : 'fas';
$icon_library = isset( $attributes['iconLibrary'] ) ? $attributes['iconLibrary'] : 'fontawesome';
$custom_icon_url = isset( $attributes['customIconUrl'] ) ? $attributes['customIconUrl'] : '';
$icon_size = isset( $attributes['iconSize'] ) ? $attributes['iconSize'] : 88;
$url = isset( $attributes['url'] ) ? $attributes['url'] : '';
$link_target = isset( $attributes['linkTarget'] ) ? $attributes['linkTarget'] : '';
$rel = isset( $attributes['rel'] ) ? $attributes['rel'] : '';
$icon_border = isset( $attributes['iconBorder'] ) ? $attributes['iconBorder'] : false;
$border_width = isset( $attributes['borderWidth'] ) ? $attributes['borderWidth'] : 2;
$border_color = isset( $attributes['borderColor'] ) ? $attributes['borderColor'] : '#000000';
$border_radius = isset( $attributes['borderRadius'] ) ? $attributes['borderRadius'] : 0;

// Build icon wrapper styles
$icon_wrapper_styles = array();

if ( $icon_library === 'fontawesome' && $icon ) {
	$icon_wrapper_styles[] = 'width: ' . $icon_size . 'px';
	$icon_wrapper_styles[] = 'height: ' . $icon_size . 'px';
	$icon_wrapper_styles[] = 'font-size: ' . $icon_size . 'px';
	$icon_wrapper_styles[] = 'display: flex';
	$icon_wrapper_styles[] = 'align-items: center';
	$icon_wrapper_styles[] = 'justify-content: center';
	$icon_wrapper_styles[] = 'aspect-ratio: 1/1';
	$icon_wrapper_styles[] = 'box-sizing: content-box';
}

if ( $icon_library === 'custom' ) {
	$icon_wrapper_styles[] = 'width: ' . $icon_size . 'px';
	$icon_wrapper_styles[] = 'height: ' . $icon_size . 'px';
	$icon_wrapper_styles[] = 'font-size: ' . $icon_size . 'px';
	$icon_wrapper_styles[] = 'display: flex';
	$icon_wrapper_styles[] = 'align-items: center';
	$icon_wrapper_styles[] = 'justify-content: center';
	$icon_wrapper_styles[] = 'aspect-ratio: 1/1';
	$icon_wrapper_styles[] = 'box-sizing: content-box';
}

$icon_wrapper_styles[] = 'border-radius: ' . $border_radius . 'px';

if ( $icon_border ) {
	$icon_wrapper_styles[] = 'border: ' . $border_width . 'px solid ' . $border_color;
} else {
	$icon_wrapper_styles[] = 'border: none';
}

$icon_wrapper_style_attr = implode( '; ', $icon_wrapper_styles );

// Generate icon content
$icon_content = '';
if ( $icon_library === 'fontawesome' ) {
	$icon_content = sprintf(
		'<i class="%s fa-%s blockons-icon" style="line-height: 1; width: 100%%; height: 100%%; display: flex; align-items: center; justify-content: center; font-size: 100%%;"></i>',
		esc_attr( $prefix ),
		esc_attr( $icon )
	);
} elseif ( $custom_icon_url ) {
	if ( substr( $custom_icon_url, -4 ) === '.svg' ) {
		// Handle SVG files - both local and external
		$svg_content = '';
		
		// Check if it's a local WordPress file
		$upload_dir = wp_upload_dir();
		$is_local_file = strpos( $custom_icon_url, $upload_dir['baseurl'] ) === 0;
		
		if ( $is_local_file ) {
			// Convert URL to local file path
			$file_path = str_replace( $upload_dir['baseurl'], $upload_dir['basedir'], $custom_icon_url );
			if ( file_exists( $file_path ) ) {
				$svg_content = file_get_contents( $file_path );
			}
		} else {
			// External URL - use wp_remote_get
			$response = wp_remote_get( $custom_icon_url );
			if ( ! is_wp_error( $response ) ) {
				$svg_content = wp_remote_retrieve_body( $response );
			}
		}
		
		if ( ! empty( $svg_content ) ) {
			// Process SVG to use currentColor (matching edit.js logic)
			$processed_svg = $svg_content;
			
			// Add currentColor to the SVG tag if it doesn't have fill/stroke
			$processed_svg = preg_replace_callback(
				'/<svg(.*?)>/',
				function( $matches ) {
					$attributes = $matches[1];
					if ( ! strpos( $attributes, 'fill=' ) && ! strpos( $attributes, 'stroke=' ) ) {
						return '<svg' . $attributes . ' fill="currentColor" stroke="currentColor">';
					}
					return $matches[0];
				},
				$processed_svg
			);
			
			// Replace any specific colors with currentColor
			$processed_svg = preg_replace('/fill="(?!none)[^"]+"/i', 'fill="currentColor"', $processed_svg);
			$processed_svg = preg_replace('/stroke="(?!none)[^"]+"/i', 'stroke="currentColor"', $processed_svg);
			
			// Replace any hex colors
			$processed_svg = preg_replace('/fill:#[0-9a-fA-F]{3,6}/i', 'fill:currentColor', $processed_svg);
			$processed_svg = preg_replace('/stroke:#[0-9a-fA-F]{3,6}/i', 'stroke:currentColor', $processed_svg);
			
			// Replace rgb/rgba colors
			$processed_svg = preg_replace('/fill:rgb\([^)]+\)/i', 'fill:currentColor', $processed_svg);
			$processed_svg = preg_replace('/stroke:rgb\([^)]+\)/i', 'stroke:currentColor', $processed_svg);
			$processed_svg = preg_replace('/fill:rgba\([^)]+\)/i', 'fill:currentColor', $processed_svg);
			$processed_svg = preg_replace('/stroke:rgba\([^)]+\)/i', 'stroke:currentColor', $processed_svg);
			
			// Enhanced SVG sanitization - allow more SVG elements and attributes
			$allowed_svg_tags = array(
				'svg' => array(
					'width' => array(),
					'height' => array(),
					'viewbox' => array(),
					'viewBox' => array(),
					'xmlns' => array(),
					'class' => array(),
					'style' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'xmlns:xlink' => array(),
				),
				'path' => array(
					'd' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'stroke-linecap' => array(),
					'stroke-linejoin' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
				),
				'g' => array(
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'class' => array(),
					'style' => array(),
					'transform' => array(),
					'opacity' => array(),
				),
				'circle' => array(
					'cx' => array(),
					'cy' => array(),
					'r' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
				),
				'rect' => array(
					'x' => array(),
					'y' => array(),
					'width' => array(),
					'height' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
					'rx' => array(),
					'ry' => array(),
				),
				'ellipse' => array(
					'cx' => array(),
					'cy' => array(),
					'rx' => array(),
					'ry' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
				),
				'line' => array(
					'x1' => array(),
					'y1' => array(),
					'x2' => array(),
					'y2' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'stroke-linecap' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
				),
				'polyline' => array(
					'points' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'stroke-linecap' => array(),
					'stroke-linejoin' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
				),
				'polygon' => array(
					'points' => array(),
					'fill' => array(),
					'stroke' => array(),
					'stroke-width' => array(),
					'stroke-linecap' => array(),
					'stroke-linejoin' => array(),
					'class' => array(),
					'style' => array(),
					'opacity' => array(),
					'transform' => array(),
				),
				'text' => array(
					'x' => array(),
					'y' => array(),
					'font-family' => array(),
					'font-size' => array(),
					'font-weight' => array(),
					'fill' => array(),
					'stroke' => array(),
					'class' => array(),
					'style' => array(),
					'text-anchor' => array(),
					'transform' => array(),
				),
				'defs' => array(),
				'use' => array(
					'href' => array(),
					'xlink:href' => array(),
					'x' => array(),
					'y' => array(),
					'width' => array(),
					'height' => array(),
					'transform' => array(),
				),
			);
			
			$svg_body = wp_kses( $processed_svg, $allowed_svg_tags );
			$icon_content = '<div class="blockons-icon-svg" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; aspect-ratio: 1/1; color: currentColor; overflow: hidden;">' . $svg_body . '</div>';
		}
	} else {
		$icon_content = sprintf(
			'<img src="%s" alt="%s" class="blockons-icon-img" style="width: 80%%; height: 80%%; object-fit: contain; aspect-ratio: 1/1;" />',
			esc_url( $custom_icon_url ),
			esc_attr__( 'Custom icon', 'blockons' )
		);
	}
}

// Wrapper props
$wrapper_class = 'blockons-icon-selector align-' . esc_attr( $alignment );

// If no content, return empty wrapper with same structure
if ( empty( $icon_content ) ) {
	$empty_wrapper_attributes = get_block_wrapper_attributes( array(
		'class' => 'blockons-icon-wrap',
	) );
	
	// Combine styles for empty wrapper too
	$empty_combined_style = $icon_wrapper_style_attr;
	if ( strpos( $empty_wrapper_attributes, 'style="' ) !== false ) {
		preg_match('/style="([^"]*)"/', $empty_wrapper_attributes, $matches);
		if ( ! empty( $matches[1] ) ) {
			$empty_combined_style = $matches[1] . '; ' . $icon_wrapper_style_attr;
		}
		$empty_wrapper_attributes = preg_replace('/\s*style="[^"]*"/', '', $empty_wrapper_attributes);
	}
	
	echo '<div class="' . esc_attr( $wrapper_class ) . '">';
		echo '<div ' . $empty_wrapper_attributes . ' style="' . esc_attr( $empty_combined_style ) . '"></div>';
	echo '</div>';
	return;
}

// Handle link rel attribute
$link_rel = '';
if ( $rel || $link_target === '_blank' ) {
	$rel_array = array();
	
	if ( $rel ) {
		$rel_parts = explode( ' ', $rel );
		$rel_array = array_filter( $rel_parts, function( $r ) {
			return $r !== 'nofollow' && $r !== 'noopener';
		});
	}
	
	// Add nofollow first if present
	if ( $rel && strpos( $rel, 'nofollow' ) !== false ) {
		array_unshift( $rel_array, 'nofollow' );
	}
	
	// Add noopener if opening in new tab
	if ( $link_target === '_blank' ) {
		$rel_array[] = 'noopener';
	}
	
	$link_rel = ! empty( $rel_array ) ? implode( ' ', $rel_array ) : '';
}

// Get block wrapper attributes for the inner wrapper (matches useBlockProps in edit.js)
$block_wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'blockons-icon-wrap',
) );

// Combine WordPress block styles with icon wrapper styles
$combined_style = $icon_wrapper_style_attr;
if ( strpos( $block_wrapper_attributes, 'style="' ) !== false ) {
	// Extract existing style attribute from block wrapper
	preg_match('/style="([^"]*)"/', $block_wrapper_attributes, $matches);
	if ( ! empty( $matches[1] ) ) {
		$combined_style = $matches[1] . '; ' . $icon_wrapper_style_attr;
	}
	// Remove style attribute from block wrapper attributes
	$block_wrapper_attributes = preg_replace('/\s*style="[^"]*"/', '', $block_wrapper_attributes);
}

// Render the block - structure matches edit.js exactly
echo '<div class="' . esc_attr( $wrapper_class ) . '">';
	echo '<div ' . $block_wrapper_attributes . ' style="' . esc_attr( $combined_style ) . '">';
		if ( $url ) {
			printf(
				'<a href="%s"%s%s>%s</a>',
				esc_url( $url ),
				$link_target ? ' target="' . esc_attr( $link_target ) . '"' : '',
				$link_rel ? ' rel="' . esc_attr( $link_rel ) . '"' : '',
				$icon_content
			);
		} else {
			echo $icon_content;
		}
	echo '</div>';
echo '</div>';
