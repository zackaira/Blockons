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
import { ContentSelectorIcon as svg } from "../svgIcons";

/**
 * Register the Block
 */
registerBlockType(name, {
	icon: svg,
	edit: Edit,
	save,
});
