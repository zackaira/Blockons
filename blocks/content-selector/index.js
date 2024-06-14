/**
 * WordPress dependencies
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import json from "./block.json";
import Edit from "./edit";
import save from "./save";

import "./editor.css";
import "./style.css";
import "./content.js";

const { name } = json;

/**
 * Register the Block
 */
registerBlockType(name, {
	edit: Edit,
	// save,
});
