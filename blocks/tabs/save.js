/**
 * WordPress dependencies
 */
import { RichText, InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${attributes.tabsSideLayout ? "side-layout" : "top-layout"}`,
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-tabs ${
					!attributes.tabsSideLayout && attributes.tabsJustified ? "full" : ""
				} ${!attributes.tabHasBg ? "nobg" : ""}`}
				{...(attributes.tabsSideLayout
					? {
							style: {
								width: attributes.tabWidth,
							},
					  }
					: {})}
			>
				{attributes.tabs.map((block, index) => (
					<div
						key={index}
						className={`blockons-tab ${index === 0 ? "active" : "na"} align-${
							attributes.alignment
						}`}
						id={`tab-${block.clientId}`}
						style={{
							backgroundColor:
								index === 0 ? attributes.bgTabColor : attributes.tabColor,
							color:
								index === 0
									? attributes.activeTabFontColor
									: attributes.tabFontColor,
							padding: `${attributes.tabVertPadding}px ${attributes.tabHorizPadding}px`,
							...(attributes.tabsSideLayout
								? {
										...(index === 0
											? { borderRightColor: attributes.bgTabColor }
											: {}),
										...(index === 0 ? { marginRight: "-1px" } : {}),
								  }
								: {
										borderBottomColor:
											index === 0 ? attributes.bgTabColor : attributes.tabColor,
										borderRadius: `${attributes.tabBorderRadius}px ${attributes.tabBorderRadius}px 0 0`,
										minWidth: attributes.tabMinWidth,
								  }),
						}}
					>
						<RichText.Content
							tagName="div"
							value={block.attributes.tabLabel}
							className="blockons-tab-label"
						/>
					</div>
				))}
			</div>
			<div
				className={`blockons-tabs-innerblocks ${
					attributes.tabs.length > 0 ? "blockons-nbb" : ""
				}`}
				style={{
					backgroundColor: attributes.bgTabColor,
					color: attributes.bgFontColor,
					padding: `${attributes.contentVertPadding}px ${attributes.contentHorizPadding}px`,
					...(attributes.tabs.length > 0
						? { minHeight: attributes.contentMinHeight }
						: {}),
				}}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
