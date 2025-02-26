/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import json from './block.json';
import Edit from './edit';

import './editor.css';
import './style.css';
import { mapsIcon as svg } from '../svgIcons';

const { name } = json;

/**
 * Register the Block
 */
registerBlockType(name, {
	icon: svg,
	edit: Edit,
	/**
	 * No save: defaults to: save: () => null
	 */
});
