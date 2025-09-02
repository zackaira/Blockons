import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";

registerBlockType("blockons/tab", {
	apiVersion: 2,
	title: __("Tab", "blockons"),
	icon: "welcome-add-page",
	parent: ["blockons/tabs"],
	category: "design",

	attributes: {
		tabLabel: {
			type: "string",
			default: "Tab Title",
		},
		clientId: {
			type: "string",
			default: "",
		},
	},

	edit: ({ attributes: { tabLabel }, setAttributes, clientId }) => {
		const blockProps = useBlockProps({
			className: `blockons-content content-${clientId}`,
		});

		useEffect(() => {
			setAttributes({ clientId: clientId });
		}, []);

		// Default template for InnerBlocks
		const TEMPLATE = [["core/paragraph", { content: "Tab Content" }]];

		return (
			<div {...blockProps}>
				<TextControl
					value={tabLabel}
					onChange={(newLabel) => setAttributes({ tabLabel: newLabel })}
					placeholder={__("Tab Label", "blockons")}
					className="blockons-inner-tab-label"
					__next40pxDefaultSize={true}
					__nextHasNoMarginBottom={true}
				/>
				<InnerBlocks template={TEMPLATE} templateLock={false} />
			</div>
		);
	},

	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `blockons-content content-${attributes.clientId}`,
		});
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
