import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";

registerBlockType("blockons/tab", {
	title: __("Tab", "blockons"),
	icon: "welcome-add-page",
	parent: ["blockons/tabs"],
	category: "design",

	attributes: {
		tabLabel: {
			type: "string",
			default: "Tab Title",
		},
	},

	edit: ({ attributes: { tabLabel }, setAttributes, clientId }) => {
		const blockProps = useBlockProps({
			className: `blockons-content content-${clientId}`,
		});

		// Default template for InnerBlocks
		const TEMPLATE = [
			["core/paragraph", { content: "Tab Content - " + clientId }],
		];

		return (
			<div {...blockProps}>
				<TextControl
					value={tabLabel}
					onChange={(newLabel) => setAttributes({ tabLabel: newLabel })}
					placeholder={__("Tab Label", "blockons")}
					className="blockons-inner-tab-label"
				/>
				<InnerBlocks template={TEMPLATE} templateLock={false} />
			</div>
		);
	},

	save: () => {
		const blockProps = useBlockProps.save();
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
