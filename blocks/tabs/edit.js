import { useState, useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
	BlockControls,
	AlignmentToolbar,
	RichText,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	Button,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const ALLOWED_BLOCKS = ["blockons/tab"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			tabs,
			alignment,
			tabsSideLayout,
			contentMinHeight,
			tabWidth,
			tabMinWidth,
			tabsJustified,
			tabHasBg,
			tabColor,
			bgTabColor,
			tabVertPadding,
			tabHorizPadding,
			tabBorderRadius,
			tabFontColor,
			activeTabFontColor,
			bgFontColor,
			contentVertPadding,
			contentHorizPadding,
		},
		setAttributes,
		clientId,
	} = props;

	const [activeTab, setActiveTab] = useState(0);
	const {
		moveBlockToPosition,
		selectBlock,
		updateBlockAttributes,
		removeBlock,
	} = useDispatch(blockEditorStore);

	const blockProps = useBlockProps({
		className: `${tabsSideLayout ? "side-layout" : "top-layout"}`,
	});

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId).innerBlocks,
		[clientId]
	);

	useEffect(() => {
		if (innerBlocks.length && activeTab >= innerBlocks.length) {
			setActiveTab(0);
		}
		if (innerBlocks.length) setAttributes({ tabs: innerBlocks });

		tabChange();
	}, [innerBlocks.length, activeTab]);

	const moveTab = (currentIndex, newIndex) => {
		if (newIndex >= 0 && newIndex < innerBlocks.length) {
			setTimeout(() => {
				moveBlockToPosition(
					innerBlocks[currentIndex].clientId,
					clientId,
					clientId,
					newIndex
				);
				selectTab(newIndex);
			}, 300);
			selectBlock(innerBlocks[currentIndex].clientId);
			setAttributes({ tabs: innerBlocks });
		}
		// tabChange();
	};

	const selectTab = (index) => {
		setActiveTab(index);
	};

	const deleteTab = (index) => {
		if (innerBlocks[index]) {
			removeBlock(innerBlocks[index].clientId);
			setAttributes({ tabs: innerBlocks });
		}
	};

	const CustomAppender = ({ buttonText, clientId }) => {
		const { insertBlock } = useDispatch(blockEditorStore);

		const addBlock = () => {
			const block = wp.blocks.createBlock("blockons/tab");
			insertBlock(block, undefined, clientId);
		};

		return (
			<Button
				className="blockons-new-button"
				onClick={addBlock}
				title={__("Add New Tab", "blockons")}
			>
				{buttonText || "+"}
			</Button>
		);
	};

	function tabChange() {
		const selectedTab = document.querySelector(".blockons-tab.active");

		if (selectedTab) {
			const selectedClass = "content-" + selectedTab.id.slice(4);

			console.log("tab changed", selectedClass);

			if (innerBlocks.length > 1) {
				const allContent = document.querySelectorAll(".blockons-content");
				if (allContent) {
					allContent.forEach((content) => {
						content.style.display = "none";
					});
				}
				const selectedContent = document.querySelector(`.${selectedClass}`);
				if (selectedContent) {
					selectedContent.style.display = "block";
				} else {
					const firstContent = document.querySelector(".blockons-content");
					if (firstContent) {
						firstContent.style.display = "block";
					}
				}
			} else {
				const allContent = document.querySelectorAll(".blockons-content");
				if (allContent) {
					allContent.forEach((content) => {
						content.style.display = "block";
					});
				}
			}
		}
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody title={__("Tabs Settings", "blockons")} initialOpen={true}>
						<ToggleControl
							label={__("Switch to side tab layout", "blockons")}
							checked={tabsSideLayout}
							onChange={(newValue) => {
								setAttributes({ tabsSideLayout: newValue });
							}}
						/>

						{!tabsSideLayout && innerBlocks.length > 1 && (
							<>
								<div className="blockons-divider"></div>
								<ToggleControl
									label={__("Set Tabs Full Width", "blockons")}
									checked={tabsJustified}
									onChange={(newValue) => {
										setAttributes({ tabsJustified: newValue });
									}}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{tabsSideLayout && (
							<>
								<RangeControl
									label={__("Tab Width", "blockons")}
									value={tabWidth}
									onChange={(newValue) =>
										setAttributes({
											tabWidth:
												newValue === undefined ? 200 : parseInt(newValue),
										})
									}
									min={0}
									max={500}
								/>
								<div className="blockons-divider"></div>
							</>
						)}
						{!tabsSideLayout && !tabsJustified && (
							<>
								<RangeControl
									label={__("Tab Min Width", "blockons")}
									value={tabMinWidth}
									onChange={(newValue) =>
										setAttributes({
											tabMinWidth:
												newValue === undefined ? 120 : parseInt(newValue),
										})
									}
									min={0}
									max={300}
								/>
								<div className="blockons-divider"></div>
							</>
						)}
						<RangeControl
							label={__("Content Min Height", "blockons")}
							value={contentMinHeight}
							onChange={(newValue) =>
								setAttributes({
									contentMinHeight:
										newValue === undefined ? 100 : parseInt(newValue),
								})
							}
							min={10}
							max={800}
						/>
					</PanelBody>
					<PanelBody title={__("Tabs Design", "blockons")} initialOpen={true}>
						<RangeControl
							label={__("Tab Vertical Padding", "blockons")}
							value={tabVertPadding}
							onChange={(newValue) =>
								setAttributes({
									tabVertPadding:
										newValue === undefined ? 8 : parseInt(newValue),
								})
							}
							min={2}
							max={50}
						/>
						{!tabsJustified && (
							<>
								<RangeControl
									label={__("Tab Horizontal Padding", "blockons")}
									value={tabHorizPadding}
									onChange={(newValue) =>
										setAttributes({
											tabHorizPadding:
												newValue === undefined ? 16 : parseInt(newValue),
										})
									}
									min={2}
									max={50}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{!tabsSideLayout && (
							<>
								<RangeControl
									label={__("Tab Border Radius", "blockons")}
									value={tabBorderRadius}
									onChange={(newValue) =>
										setAttributes({
											tabBorderRadius:
												newValue === undefined ? 4 : parseInt(newValue),
										})
									}
									min={0}
									max={50}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						<RangeControl
							label={__("Content Vertical Padding", "blockons")}
							value={contentVertPadding}
							onChange={(newValue) =>
								setAttributes({
									contentVertPadding:
										newValue === undefined ? 8 : parseInt(newValue),
								})
							}
							min={1}
							max={300}
						/>
						<RangeControl
							label={__("Content Horizontal Padding", "blockons")}
							value={contentHorizPadding}
							onChange={(newValue) =>
								setAttributes({
									contentHorizPadding:
										newValue === undefined ? 8 : parseInt(newValue),
								})
							}
							min={2}
							max={300}
						/>
						<div className="blockons-divider"></div>

						{innerBlocks.length > 1 && (
							<>
								<ToggleControl
									label={__("Tab Has Background Color", "blockons")}
									checked={tabHasBg}
									onChange={(newValue) => {
										setAttributes({ tabHasBg: newValue });
									}}
								/>
								{tabHasBg && (
									<BlockonsColorpicker
										label={__("Tab Color", "blockons")}
										value={tabColor}
										onChange={(colorValue) => {
											setAttributes({
												tabColor:
													colorValue === undefined ? "#ececec" : colorValue,
											});
										}}
										paletteColors={colorPickerPalette}
									/>
								)}
								<BlockonsColorpicker
									label={__("Tab Font Color", "blockons")}
									value={tabFontColor}
									onChange={(colorValue) => {
										setAttributes({
											tabFontColor:
												colorValue === undefined ? "#4f4f4f" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<div className="blockons-divider"></div>
							</>
						)}
						<BlockonsColorpicker
							label={__("Active Tab & Content Background Color", "blockons")}
							value={bgTabColor}
							onChange={(colorValue) => {
								setAttributes({
									bgTabColor: colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Active Tab Font Color", "blockons")}
							value={activeTabFontColor}
							onChange={(colorValue) => {
								setAttributes({
									activeTabFontColor:
										colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>

						<BlockonsColorpicker
							label={__("Content Font Color", "blockons")}
							value={bgFontColor}
							onChange={(colorValue) => {
								setAttributes({
									bgFontColor: colorValue === undefined ? "" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
							help={__(
								"This will add a font color for all content, but depending on the inner blocks, you might need to adjust the font colors within the blocks added.",
								"blockons"
							)}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={(newAlignment) =>
							setAttributes({
								alignment: newAlignment,
							})
						}
					/>
				</BlockControls>
			}

			<div
				className={`blockons-tabs ${
					!tabsSideLayout && tabsJustified ? "full" : ""
				} ${!tabHasBg ? "nobg" : ""}`}
				{...(tabsSideLayout
					? {
							style: {
								width: tabWidth,
							},
					  }
					: {})}
			>
				{tabs.map((block, index) => (
					<div
						key={index}
						className={`blockons-tab ${
							index === activeTab ? "active" : "na"
						} align-${alignment}`}
						id={`tab-${block.clientId}`}
						onClick={() => selectTab(index)}
						style={{
							backgroundColor: index === activeTab ? bgTabColor : tabColor,
							color: index === activeTab ? activeTabFontColor : tabFontColor,
							padding: `${tabVertPadding}px ${tabHorizPadding}px`,
							...(tabsSideLayout
								? {
										...(index === activeTab
											? { borderRightColor: bgTabColor }
											: {}),
										...(index === activeTab ? { marginRight: "-1px" } : {}),
								  }
								: {
										borderBottomColor:
											index === activeTab ? bgTabColor : tabColor,
										borderRadius: `${tabBorderRadius}px ${tabBorderRadius}px 0 0`,
										minWidth: tabMinWidth,
								  }),
						}}
					>
						<RichText
							tagName="div"
							// value={block.attributes.tabLabel}
							value={block.clientId}
							className="blockons-tab-label"
							onChange={(newTitle) =>
								updateBlockAttributes(block.clientId, { tabLabel: newTitle })
							}
							// allowedFormats={["core/bold", "core/italic"]}
							placeholder={__("Tab Title", "blockons")}
							disableLineBreaks
						/>
						{isSelected && tabs.length > 0 && (
							<div className="blockons-tab-controls">
								<Button
									isSmall
									onClick={() => moveTab(index, index - 1)}
									disabled={index === 0}
								>
									{tabsSideLayout ? "↑" : "←"}
								</Button>
								<Button
									isSmall
									onClick={() => moveTab(index, index + 1)}
									disabled={index === tabs.length - 1}
								>
									{tabsSideLayout ? "↓" : "→"}
								</Button>
								{tabs.length > 1 && (
									<Button isSmall onClick={() => deleteTab(index)}>
										x
									</Button>
								)}
							</div>
						)}
					</div>
				))}
				{tabs.length > 0 && <CustomAppender clientId={clientId} />}
			</div>
			<div
				className={`blockons-tabs-innerblocks ${
					tabs.length > 0 ? "blockons-nbb" : ""
				}`}
				style={{
					backgroundColor: bgTabColor,
					color: bgFontColor,
					padding: `${contentVertPadding}px ${contentHorizPadding}px`,
					...(tabs.length > 0 ? { minHeight: contentMinHeight } : {}),
				}}
			>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					{...(innerBlocks?.length < 1
						? {
								renderAppender: () => (
									<CustomAppender
										buttonText={__("Add New Tab", "blockons")}
										clientId={clientId}
									/>
								),
						  }
						: { renderAppender: false })}
					templateLock={false}
				/>
			</div>
		</div>
	);
};

export default Edit;
