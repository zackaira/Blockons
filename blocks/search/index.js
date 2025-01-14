/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import json from './block.json';
import Edit from './edit';
// import save from "./save";

import './editor.css';
import './style.css';

const { name } = json;
import { searchIcon as svg } from '../svgIcons';

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
