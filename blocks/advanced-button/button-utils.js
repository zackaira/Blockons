import { __ } from '@wordpress/i18n';

export const MODAL_TEMPLATE = [
	[
		'core/group',
		{
			tagName: 'div',
			style: {
				spacing: {
					margin: '0',
					padding: '30px',
				},
			},
			metadata: {
				name: 'Popup Modal Content',
			},
		},
		[
			[
				'core/paragraph',
				{
					content: 'Build your modal content here',
					align: 'center',
					focus: true,
				},
			],
		],
	],
];

export const VIEWCONTENT_TEMPLATE = [
	[
		'core/group',
		{
			tagName: 'div',
			style: {
				spacing: {
					margin: '0',
					padding: '20px',
				},
			},
			metadata: {
				name: 'View Content Section',
			},
		},
		[
			[
				'core/paragraph',
				{
					content: 'Build your expandable content here',
					align: 'left',
					focus: true,
				},
			],
		],
	],
];

export const BUTTON_ANIMATION_OPTIONS = [
	{
		label: __('None', 'blockons'),
		value: 'none',
	},
	{
		label: __('Animate Up', 'blockons'),
		value: 'one',
	},
	{
		label: __('Grow', 'blockons'),
		value: 'two',
	},
	{
		label: __('Grow Shadow', 'blockons'),
		value: 'eight',
	},
	{
		label: __('Bounce', 'blockons'),
		value: 'three',
	},
	{
		label: __('Shine', 'blockons'),
		value: 'four',
	},
	{
		label: __('Grow & Skew', 'blockons'),
		value: 'seven',
	},
	{
		label: __('Rotate & Scale', 'blockons'),
		value: 'ten',
	},
	{
		label: __('Pulse Glow', 'blockons'),
		value: 'nine',
	},
];
