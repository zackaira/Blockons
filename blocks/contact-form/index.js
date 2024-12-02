/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import json from './block.json';
import Edit from './edit';
import save from './save';

import './editor.css';
import './style.css';

// Import Form Blocks
import './input-text';
import './input-textarea';
import './input-select';
import './input-acceptance';
import './input-checkbox';
import './input-radio';
import './input-file-upload';
import './input-datepicker';

const { name } = json;
import { formsIcon as svg } from '../svgIcons';

/**
 * Register the Block
 */
registerBlockType(name, {
	icon: svg,
	edit: Edit,
	save,
});
