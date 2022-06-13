<?php
/**
 * Register Block Styles for external blocks.
 */
/**
 * Contact Form 7
 */
register_block_style(
	'contact-form-7/contact-form-selector',
	array(
		'name'  => 'styleone',
		'label' => __('Style One', 'arcane'),
		'inline_style' => '.is-style-styleone {
			background-color: "red"
		}',
	),
);
