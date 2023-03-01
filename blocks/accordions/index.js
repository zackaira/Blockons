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
import "./single-accordion.js";

const { name } = json;
import { accordionIcon as svg } from "../svgIcons";

/**
 * Register the Block
 */
registerBlockType(name, {
	icon: svg,
	edit: Edit,
	save,
});
