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
import './input-file-upload';

const { name } = json;

/**
 * Register the Block
 */
registerBlockType(name, {
	edit: Edit,
	save,
});
