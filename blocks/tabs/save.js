import { RichText, InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${
			attributes.tabsSideLayout ? "side-layout" : "top-layout"
		} design-${attributes.tabDesign} load-content`,
	});

	return (
		<div {...blockProps} id={attributes.uniqueId}>
			<div
				className={`blockons-tabs ${
					!attributes.tabsSideLayout && attributes.tabsJustified ? "full" : ""
				}`}
				style={{
					...(attributes.tabsSideLayout
						? {
								width: attributes.tabWidth,
						  }
						: {}),
					...(attributes.tabDesign === "two"
						? {
								...(attributes.tabsSideLayout
									? {
											boxShadow: `#000 0px 0px, #000 0px 0px, #000 0px 0px, ${attributes.tabSelectedColor} -4px 0px inset`,
									  }
									: {
											boxShadow: `0 0 #000, 0 3px ${attributes.tabSelectedColor}, 0 0 #000, 0 0 #000`,
									  }),
						  }
						: {}),
				}}
			>
				{attributes.tabs.map((block, index) => (
					<div
						key={index}
						className={`blockons-tab ${index === 0 ? "active" : "na"} align-${
							attributes.alignment
						}`}
						id={`tab-${block.clientId}`}
						style={{
							padding: `${attributes.tabVertPadding}px ${attributes.tabHorizPadding}px`,
							...(!attributes.tabsSideLayout
								? {
										minWidth: attributes.tabMinWidth,
								  }
								: {}),
							...(attributes.tabDesign === "one"
								? {
										"--tab-color": attributes.tabColor,
										"--tab-font-color": attributes.tabFontColor,
										"--tab-active-color": attributes.tabActiveColor,
										"--tab-active-font-color": attributes.tabActiveFontColor,
										...(!attributes.tabsSideLayout
											? {
													borderRadius: `${attributes.tabBorderRadius}px ${attributes.tabBorderRadius}px 0 0`,
											  }
											: {}),
								  }
								: {}),
							...(attributes.tabDesign === "two"
								? {
										"--tab-color": "transparent",
										"--tab-font-color": attributes.tabFontColor,
										"--tab-selected-color": attributes.tabSelectedColor,
										"--tab-selected-font-color":
											attributes.tabSelectedFontColor,
										...(!attributes.tabsSideLayout
											? {
													borderRadius: `${attributes.tabBorderRadius}px ${attributes.tabBorderRadius}px 0 0`,
											  }
											: {}),
								  }
								: {}),
							...(attributes.tabDesign === "three"
								? {
										"--tab-color": "transparent",
										"--tab-font-color": attributes.tabFontColor,
										"--content-other-color": attributes.contentOtherColor,
										"--tab-active-font-color": attributes.tabActiveFontColor,
										"--tab-selected-color": attributes.tabSelectedColor,
								  }
								: {}),
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
					padding: `${attributes.contentVertPadding}px ${attributes.contentHorizPadding}px`,
					...(attributes.tabs.length > 0
						? { minHeight: attributes.contentMinHeight }
						: {}),
					...(attributes.tabDesign === "three"
						? {
								backgroundColor: attributes.contentOtherColor,
						  }
						: {
								backgroundColor: attributes.contentColor,
						  }),
					...(attributes.contentFontColor
						? {
								color: attributes.contentFontColor,
						  }
						: {}),
				}}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
