/**
 * Registers a new block provided a unique name and an object defining its behavior.
 */
import { registerBlockType } from "@wordpress/blocks";

/**
 * Internal dependencies
 */
import json from "./block.json";
import Edit from "./edit";

import "./style.css";

const { name } = json;
import { wcFeaturedProductIcon as svg } from "../svgIcons";

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(name, {
	icon: svg,
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * No save: defaults to: save: () => null
	 */
});
