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

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * No save: defaults to: save: () => null
	 */
});
