import { InnerBlocks } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
import { TextControl } from "@wordpress/components";
import { subscribe } from "@wordpress/data";

// Registering Child Innerblock for the Tabbed Content block
registerBlockType("blockons/tab", {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __("Tab"),
	icon: "welcome-add-page",
	parent: ["blockons/tabs"],
	category: "design", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	attributes: {
		tabLabel: {
			type: "string",
			default: "",
		},
		blockIndex: {
			type: "number",
			default: "",
		},
	},
	keywords: [__("tab")],

	/**
	 *
	 * Edit function for Child Slide Block
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: (props) => {
		const {
			attributes: { tabLabel, blockIndex },
			setAttributes,
		} = props;

		const parentBlockID = wp.data
			.select("core/block-editor")
			.getBlockParentsByBlockName(props.clientId, ["blockons/tabs"]);
		var savedBlockIndex = blockIndex;
		const getBlockIndex = wp.data
			.select("core/block-editor")
			.getBlockOrder(parentBlockID)
			.indexOf(props.clientId);

		const unsubscribe = subscribe(() => {
			var newBlockIndex = wp.data
				.select("core/block-editor")
				.getBlockOrder(parentBlockID)
				.indexOf(props.clientId);
			var blockIndexChange = newBlockIndex !== savedBlockIndex;

			if (blockIndexChange) {
				// Update attributes when blocks move up or down
				unsubscribe();
				setAttributes({ blockIndex: newBlockIndex });
				wp.data
					.dispatch("core/block-editor")
					.updateBlockAttributes(parentBlockID, { updateChild: true });
			}
		});

		const onChangeTabLabel = (newTabLabel) => {
			setAttributes({ tabLabel: newTabLabel });
			setAttributes({ blockIndex: getBlockIndex });
			wp.data
				.dispatch("core/block-editor")
				.updateBlockAttributes(parentBlockID, { updateChild: true });
		};

		return (
			<div className={`${props.className}`}>
				<TextControl
					className={"tab-label_input"}
					value={tabLabel}
					onChange={onChangeTabLabel}
					placeholder="Tab Label"
					type="text"
				/>
				<InnerBlocks />
			</div>
		);
	},

	/**
	 *
	 * Save function for Child Slide Block
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: (props) => {
		const {
			attributes: { tabLabel },
		} = props;

		return (
			<div className="tab-panel" role="tabpanel" tabindex="0">
				<InnerBlocks.Content />
			</div>
		);
	},
});
