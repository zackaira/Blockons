import { useState, useEffect, useRef } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	AlignmentToolbar,
	RichText,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import { v4 as uuidv4 } from 'uuid';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import { colorPickerPalette } from '../block-global';

const ALLOWED_BLOCKS = ['blockons/tab'];

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			tabs,
			tabDesign,
			alignment,
			tabsSideLayout,
			contentMinHeight,
			tabWidth,
			tabMinWidth,
			tabsJustified,
			tabVertPadding,
			tabHorizPadding,
			tabBorderRadius,
			contentVertPadding,
			contentHorizPadding,
			tabColor,
			tabFontColor,
			tabActiveColor,
			tabSelectedColor,
			tabSelectedFontColor,
			tabActiveFontColor,
			contentColor,
			contentOtherColor,
			contentFontColor,
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

	const blockRef = useRef(null);
	const blockProps = useBlockProps({
		className: `${
			tabsSideLayout ? 'side-layout' : 'top-layout'
		} design-${tabDesign} load-content`,
		ref: blockRef,
	});

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId).innerBlocks,
		[clientId],
	);

	useEffect(() => {
		setAttributes({
			uniqueId: uuidv4(),
		});
	}, []);

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
					newIndex,
				);
				selectTab(newIndex);
			}, 300);
			selectBlock(innerBlocks[currentIndex].clientId);
			setAttributes({ tabs: innerBlocks });
		}
		setTimeout(() => {
			tabChange();
		}, 300); // Temp Fix
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
			const block = wp.blocks.createBlock('blockons/tab');
			insertBlock(block, undefined, clientId);
		};

		return (
			<Button
				className="blockons-new-button"
				onClick={addBlock}
				title={__('Add New Tab', 'blockons')}
			>
				{buttonText || '+'}
			</Button>
		);
	};

	function tabChange() {
		if (!blockRef.current) return;

		const block = blockRef.current;
		const selectedTab = block.querySelector('.blockons-tab.active');

		if (selectedTab) {
			const selectedClass = 'content-' + selectedTab.id.slice(4);

			if (innerBlocks.length > 1) {
				const allContent = block.querySelectorAll('.blockons-content');
				if (allContent) {
					allContent.forEach((content) => {
						content.style.display = 'none';
					});
				}
				const selectedContent = block.querySelector(
					`.${selectedClass}`,
				);
				if (selectedContent) {
					selectedContent.style.display = 'block';
				} else {
					const firstContent =
						block.querySelector('.blockons-content');
					if (firstContent) {
						firstContent.style.display = 'block';
					}
				}
			} else {
				const allContent =
					block.getElementsByClassName('blockons-content');
				if (allContent) {
					for (const content of allContent) {
						content.style.display = 'block';
					}
				}
			}
		}
	}

	return (
		<div {...blockProps} id={uniqueId}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__('Tabs Settings', 'blockons')}
						initialOpen={true}
					>
						<SelectControl
							label={__('Tab Design', 'blockons')}
							value={tabDesign}
							options={[
								{
									label: __('Normal Tab Design', 'blockons'),
									value: 'one',
								},
								{
									label: __(
										'Underlined & Selected',
										'blockons',
									),
									value: 'two',
								},
								{
									label: __(
										'Top Line & Subtle Background',
										'blockons',
									),
									value: 'three',
								},
							]}
							onChange={(newValue) =>
								setAttributes({
									tabDesign:
										newValue === undefined
											? 'one'
											: newValue,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__('Switch to side tab layout', 'blockons')}
							checked={tabsSideLayout}
							onChange={(newValue) => {
								setAttributes({ tabsSideLayout: newValue });
							}}
							__nextHasNoMarginBottom={true}
						/>

						{!tabsSideLayout && innerBlocks.length > 1 && (
							<>
								<div className="blockons-divider"></div>
								<ToggleControl
									label={__(
										'Set Tabs Full Width',
										'blockons',
									)}
									checked={tabsJustified}
									onChange={(newValue) => {
										setAttributes({
											tabsJustified: newValue,
										});
									}}
									__nextHasNoMarginBottom={true}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{tabsSideLayout && (
							<>
								<RangeControl
									label={__('Tab Width', 'blockons')}
									value={tabWidth}
									onChange={(newValue) =>
										setAttributes({
											tabWidth:
												newValue === undefined
													? 200
													: parseInt(newValue),
										})
									}
									min={0}
									max={500}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<div className="blockons-divider"></div>
							</>
						)}
						{!tabsSideLayout && !tabsJustified && (
							<>
								<RangeControl
									label={__('Tab Min Width', 'blockons')}
									value={tabMinWidth}
									onChange={(newValue) =>
										setAttributes({
											tabMinWidth:
												newValue === undefined
													? 120
													: parseInt(newValue),
										})
									}
									min={0}
									max={300}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<div className="blockons-divider"></div>
							</>
						)}
						<RangeControl
							label={__('Content Min Height', 'blockons')}
							value={contentMinHeight}
							onChange={(newValue) =>
								setAttributes({
									contentMinHeight:
										newValue === undefined
											? 100
											: parseInt(newValue),
								})
							}
							min={10}
							max={800}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
					</PanelBody>
					<PanelBody
						title={__('Tabs Design', 'blockons')}
						initialOpen={true}
					>
						<RangeControl
							label={__('Tab Vertical Padding', 'blockons')}
							value={tabVertPadding}
							onChange={(newValue) =>
								setAttributes({
									tabVertPadding:
										newValue === undefined
											? 8
											: parseInt(newValue),
								})
							}
							min={2}
							max={50}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						{!tabsJustified && (
							<>
								<RangeControl
									label={__(
										'Tab Horizontal Padding',
										'blockons',
									)}
									value={tabHorizPadding}
									onChange={(newValue) =>
										setAttributes({
											tabHorizPadding:
												newValue === undefined
													? 16
													: parseInt(newValue),
										})
									}
									min={2}
									max={50}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{!tabsSideLayout &&
							(tabDesign === 'one' || tabDesign === 'two') && (
								<>
									<RangeControl
										label={__(
											'Tab Border Radius',
											'blockons',
										)}
										value={tabBorderRadius}
										onChange={(newValue) =>
											setAttributes({
												tabBorderRadius:
													newValue === undefined
														? 4
														: parseInt(newValue),
											})
										}
										min={0}
										max={50}
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
									<div className="blockons-divider"></div>
								</>
							)}

						<RangeControl
							label={__('Content Vertical Padding', 'blockons')}
							value={contentVertPadding}
							onChange={(newValue) =>
								setAttributes({
									contentVertPadding:
										newValue === undefined
											? 20
											: parseInt(newValue),
								})
							}
							min={1}
							max={300}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<RangeControl
							label={__('Content Horizontal Padding', 'blockons')}
							value={contentHorizPadding}
							onChange={(newValue) =>
								setAttributes({
									contentHorizPadding:
										newValue === undefined
											? 20
											: parseInt(newValue),
								})
							}
							min={1}
							max={300}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<div className="blockons-divider"></div>

						{tabDesign === 'one' && (
							<BlockonsColorpicker
								label={__('Tab Color', 'blockons')}
								value={tabColor}
								onChange={(colorValue) =>
									setAttributes({
										tabColor:
											colorValue === undefined
												? '#ececec'
												: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}

						<BlockonsColorpicker
							label={__('Tab Font Color', 'blockons')}
							value={tabFontColor}
							onChange={(colorValue) =>
								setAttributes({
									tabFontColor: colorValue,
								})
							}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>

						{tabDesign === 'one' && (
							<BlockonsColorpicker
								label={__('Tab Active Color', 'blockons')}
								value={tabActiveColor}
								onChange={(colorValue) =>
									setAttributes({
										tabActiveColor:
											colorValue === undefined
												? '#FFF'
												: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}
						{tabDesign !== 'one' && (
							<BlockonsColorpicker
								label={__('Tab Active Color', 'blockons')}
								value={tabSelectedColor}
								onChange={(colorValue) =>
									setAttributes({
										tabSelectedColor:
											colorValue === undefined
												? '#000'
												: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}

						{tabDesign !== 'two' && (
							<BlockonsColorpicker
								label={__('Tab Active Font Color', 'blockons')}
								value={tabActiveFontColor}
								onChange={(colorValue) =>
									setAttributes({
										tabActiveFontColor: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}
						{tabDesign === 'two' && (
							<BlockonsColorpicker
								label={__('Tab Active Font Color', 'blockons')}
								value={tabSelectedFontColor}
								onChange={(colorValue) =>
									setAttributes({
										tabSelectedFontColor: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}

						<div className="blockons-divider"></div>

						{tabDesign !== 'three' && (
							<BlockonsColorpicker
								label={__(
									'Content Background Color',
									'blockons',
								)}
								value={contentColor}
								onChange={(colorValue) =>
									setAttributes({
										contentColor:
											colorValue === undefined
												? 'inherit'
												: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}
						{tabDesign === 'three' && (
							<BlockonsColorpicker
								label={__(
									'Content Background Color',
									'blockons',
								)}
								value={contentOtherColor}
								onChange={(colorValue) =>
									setAttributes({
										contentOtherColor:
											colorValue === undefined
												? '#f7f7f7'
												: colorValue,
									})
								}
								paletteColors={colorPickerPalette}
							/>
						)}

						<BlockonsColorpicker
							label={__('Content Font Color', 'blockons')}
							value={contentFontColor}
							onChange={(colorValue) =>
								setAttributes({
									contentFontColor:
										colorValue === undefined
											? 'inherit'
											: colorValue,
								})
							}
							paletteColors={colorPickerPalette}
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
					!tabsSideLayout && tabsJustified ? 'full' : ''
				}`}
				style={{
					...(tabsSideLayout
						? {
								width: tabWidth,
							}
						: {}),
					...(tabDesign === 'two'
						? {
								...(tabsSideLayout
									? {
											boxShadow: `#000 0px 0px, #000 0px 0px, #000 0px 0px, ${tabSelectedColor} -4px 0px inset`,
										}
									: {
											boxShadow: `0 0 #000, 0 3px ${tabSelectedColor}, 0 0 #000, 0 0 #000`,
										}),
							}
						: {}),
				}}
			>
				{tabs.map((block, index) => (
					<div
						key={index}
						className={`blockons-tab ${
							index === activeTab ? 'active' : 'na'
						} align-${alignment}`}
						id={`tab-${block.clientId}`}
						onClick={() => selectTab(index)}
						style={{
							padding: `${tabVertPadding}px ${tabHorizPadding}px`,
							...(!tabsSideLayout
								? {
										minWidth: tabMinWidth,
									}
								: {}),
							...(tabDesign === 'one'
								? {
										'--tab-color': tabColor,
										'--tab-font-color': tabFontColor,
										'--tab-active-color': tabActiveColor,
										'--tab-active-font-color':
											tabActiveFontColor,
										...(!tabsSideLayout
											? {
													borderRadius: `${tabBorderRadius}px ${tabBorderRadius}px 0 0`,
												}
											: {}),
									}
								: {}),
							...(tabDesign === 'two'
								? {
										'--tab-color': 'transparent',
										'--tab-font-color': tabFontColor,
										'--tab-selected-color':
											tabSelectedColor,
										'--tab-selected-font-color':
											tabSelectedFontColor,
										...(!tabsSideLayout
											? {
													borderRadius: `${tabBorderRadius}px ${tabBorderRadius}px 0 0`,
												}
											: {}),
									}
								: {}),
							...(tabDesign === 'three'
								? {
										'--tab-color': 'transparent',
										'--tab-font-color': tabFontColor,
										'--content-other-color':
											contentOtherColor,
										'--tab-active-font-color':
											tabActiveFontColor,
										'--tab-selected-color':
											tabSelectedColor,
									}
								: {}),
						}}
					>
						<RichText
							tagName="div"
							value={block.attributes.tabLabel}
							className="blockons-tab-label"
							onChange={(newTitle) =>
								updateBlockAttributes(block.clientId, {
									tabLabel: newTitle,
								})
							}
							allowedFormats={['core/bold', 'core/italic']}
							placeholder={__('Tab Title', 'blockons')}
							disableLineBreaks
						/>
						{isSelected && tabs.length > 0 && (
							<div className="blockons-tab-controls">
								<Button
									isSmall
									onClick={() => moveTab(index, index - 1)}
									disabled={index === 0}
								>
									{tabsSideLayout ? '↑' : '←'}
								</Button>
								<Button
									isSmall
									onClick={() => moveTab(index, index + 1)}
									disabled={index === tabs.length - 1}
								>
									{tabsSideLayout ? '↓' : '→'}
								</Button>
								{tabs.length > 1 && (
									<Button
										isSmall
										onClick={() => deleteTab(index)}
									>
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
					tabs.length > 0 ? 'blockons-nbb' : ''
				}`}
				style={{
					padding: `${contentVertPadding}px ${contentHorizPadding}px`,
					...(tabs.length > 0 ? { minHeight: contentMinHeight } : {}),
					...(tabDesign === 'three'
						? {
								backgroundColor: contentOtherColor,
							}
						: {
								backgroundColor: contentColor,
							}),
					...(contentFontColor
						? {
								color: contentFontColor,
							}
						: {}),
				}}
			>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					{...(innerBlocks?.length < 1
						? {
								renderAppender: () => (
									<CustomAppender
										buttonText={__(
											'Add New Tab',
											'blockons',
										)}
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
