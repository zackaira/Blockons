/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import json from "./block.json";
import Edit from "./edit";

import "./editor.css";
import "./style.css";

const { name } = json;

/**
 * Register the Block
 */
registerBlockType(name, {
	edit: Edit,
	/**
	 * No save: defaults to: save: () => null
	 */
});
