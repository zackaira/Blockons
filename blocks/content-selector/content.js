import { __ } from "@wordpress/i18n";
import { useEffect } from "@wordpress/element";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

registerBlockType("blockons/ds-content", {
	title: __("Content", "blockons"),
	icon: "welcome-add-page",
	parent: ["blockons/content-selector"],
	category: "design",

	attributes: {
		contentLabel: {
			type: "string",
			default: "Option Label",
		},
		type: {
			type: "string",
			default: "content",
		},
		redirectUrl: {
			type: "string",
			default: "",
		},
		preText: {
			type: "string",
			default: "The page will redirect in: ",
		},
		countDown: {
			type: "number",
			default: 5,
		},
		clientId: {
			type: "string",
			default: "",
		},
	},
	usesContext: ["blockons/selectedContent"],

	edit: ({
		attributes: { contentLabel, type, redirectUrl, preText, countDown },
		setAttributes,
		clientId,
		context,
	}) => {
		const blockProps = useBlockProps({
			className: `blockons-ds-content content-ds-${clientId} ${
				context["blockons/selectedContent"] === clientId ? "active" : ""
			}`,
		});

		useEffect(() => {
			setAttributes({ clientId: clientId });
		}, []);

		const TEMPLATE = [["core/paragraph", { content: "Tab Content" }]];

		return (
			<div {...blockProps}>
				{type === "redirect" ? (
					<div className="blockons-ds-countdown">
						{countDown && countDown > 0 && (
							<div className="blockons-ds-countdown-txt">
								<p>
									{preText}
									<span className="blockons-dscount">{countDown}</span>
								</p>
							</div>
						)}
					</div>
				) : (
					<InnerBlocks template={TEMPLATE} templateLock={false} />
				)}
			</div>
		);
	},

	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `blockons-ds-content content-ds-${attributes.clientId}`,
		});
		return (
			<div {...blockProps}>
				{attributes.type === "redirect" ? (
					<div className="blockons-ds-countdown">
						{attributes.redirectUrl ? (
							<div className="blockons-ds-countdown-txt">
								<p>
									{attributes.preText}
									<span className="blockons-dscount">
										{attributes.countDown}
									</span>
								</p>
							</div>
						) : (
							<p className="blockons-ds-countdown-notxt">
								{__("Please add a valid url", "blockons")}
							</p>
						)}
					</div>
				) : (
					<InnerBlocks.Content />
				)}
			</div>
		);
	},
});
