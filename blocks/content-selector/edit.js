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
	Dropdown,
	ToolbarButton,
	ToggleControl,
	TextControl,
	SelectControl,
	RangeControl,
	Button,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const ALLOWED_BLOCKS = ["blockons/ds-content"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			emptyFirstOption,
			emptyFirstText,
			options,
			selectedOption,
			selectMinWidth,
			selectVertPadding,
			selectHorizPadding,
			selectBorderRadius,
			selectBgColor,
			selectFontColor,
			selectBorder,
			selectBorderColor,
		},
		setAttributes,
		clientId,
	} = props;

	const {
		moveBlockToPosition,
		selectBlock,
		updateBlockAttributes,
		removeBlock,
	} = useDispatch(blockEditorStore);

	const blockProps = useBlockProps({
		className: `ds-contents`,
		id: uniqueId,
	});
	const [showOptions, setShowOptions] = useState(false);
	// console.log("options", options);

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId).innerBlocks,
		[clientId]
	);

	useEffect(() => {
		if (!uniqueId) setAttributes({ uniqueId: uuidv4() });
	}, []);

	useEffect(() => {
		if (innerBlocks && innerBlocks.length > 0) {
			const filteredOptions = innerBlocks.map((block) => ({
				clientId: block.clientId,
				attributes: block.attributes,
			}));
			setAttributes({ options: filteredOptions });

			if (!emptyFirstOption && innerBlocks?.length > 0) {
				setAttributes({ selectedOption: filteredOptions[0].clientId });
			}
		}
	}, [innerBlocks]);

	useEffect(() => {
		if (!emptyFirstOption) {
			document.querySelector(".blockons-ds-select").value = options[0].clientId;
			setAttributes({ selectedOption: options[0].clientId });
		}
	}, [emptyFirstOption]);

	const moveOptionPosition = (currentIndex, newIndex) => {
		if (newIndex >= 0 && newIndex < innerBlocks.length) {
			setTimeout(() => {
				moveBlockToPosition(
					innerBlocks[currentIndex].clientId,
					clientId,
					clientId,
					newIndex
				);
			}, 100);
			setAttributes({ options: innerBlocks });
		}
	};

	const selectContentSection = (e) => {
		const selectedOption = e.target.value
			? options.find((option) => option.clientId === e.target.value)
			: { clientId: "" };

		setAttributes({
			selectedOption: selectedOption.clientId,
		});
	};

	const deleteTab = (index) => {
		if (innerBlocks[index]) {
			removeBlock(innerBlocks[index].clientId);
			setAttributes({ options: innerBlocks });
		}
		selectBlock(clientId);
	};

	const CustomOptionAppender = ({ buttonText, clientId }) => {
		const { insertBlock } = useDispatch(blockEditorStore);

		const addBlock = () => {
			const block = wp.blocks.createBlock("blockons/ds-content");
			insertBlock(block, undefined, clientId);
			selectBlock(clientId);
		};

		return (
			<Button
				onClick={addBlock}
				variant="primary"
				title={__("Add New Option", "blockons")}
			>
				{buttonText || "+"}
			</Button>
		);
	};

	return (
		<div {...blockProps} id={uniqueId}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Dynamic Content Settings", "blockons")}
						initialOpen={true}
					>
						<ToggleControl
							label={__("Empty First Option", "blockons")}
							checked={emptyFirstOption}
							onChange={(value) => setAttributes({ emptyFirstOption: value })}
						/>
						{emptyFirstOption && (
							<TextControl
								label={__("Empty First Option Text", "blockons")}
								value={emptyFirstText}
								onChange={(value) => setAttributes({ emptyFirstText: value })}
							/>
						)}
						<div className="blockons-divider"></div>

						<div className={`blockons-ds-repeatable-settings`}>
							{options.map((option, index) => (
								<div
									key={option.clientId}
									className="blockons-content-option-setting"
								>
									<TextControl
										label={__("Select Option Label", "blockons")}
										value={option.attributes.contentLabel}
										onChange={(value) =>
											updateBlockAttributes(option.clientId, {
												contentLabel: value,
											})
										}
									/>
									<div className="blockons-content-selector-extras">
										<div className="blockons-cs-select">
											<SelectControl
												label={__("Display", "blockons")}
												value={option.attributes.type}
												options={[
													{
														label: __("Content Section", "blockons"),
														value: "content",
													},
													{
														label: __("Redirect Page", "blockons"),
														value: "redirect",
													},
												]}
												onChange={(value) =>
													updateBlockAttributes(option.clientId, {
														type: value,
													})
												}
											/>
										</div>
										{option.attributes.type === "redirect" && (
											<div className="blockons-cs-edits">
												<Dropdown
													className="blockons-content-selector-edits"
													contentClassName="blockons-content-selector-editor"
													renderToggle={({ isOpen, onToggle }) => (
														<ToolbarButton
															icon={
																<span className="dashicons dashicons-edit"></span>
															}
															title={__("Edit", "blockons")}
															onClick={onToggle}
															isActive={isOpen}
														/>
													)}
													renderContent={() => (
														<>
															<TextControl
																label={__("Redirect To", "blockons")}
																value={option.attributes.redirectUrl}
																onChange={(value) =>
																	updateBlockAttributes(option.clientId, {
																		redirectUrl: value,
																	})
																}
															/>

															{option.attributes.redirectUrl && (
																<>
																	<div className="blockons-divider"></div>
																	<TextControl
																		label={__(
																			"Pre Count Down Text",
																			"blockons"
																		)}
																		value={option.attributes.preText}
																		onChange={(value) =>
																			updateBlockAttributes(option.clientId, {
																				preText: value,
																			})
																		}
																	/>
																	<div className="blockons-divider"></div>

																	<TextControl
																		label={__("Count Down from", "blockons")}
																		type="number"
																		value={option.attributes.countDown}
																		onChange={(value) =>
																			updateBlockAttributes(option.clientId, {
																				countDown: value,
																			})
																		}
																		help={__(
																			"Add 0 to remove the countdown",
																			"blockons"
																		)}
																	/>
																</>
															)}
														</>
													)}
												/>
											</div>
										)}
									</div>

									{isSelected && options.length > 1 && (
										<div className="blockons-ds-controls">
											<Button
												isSmall
												onClick={() => moveOptionPosition(index, index - 1)}
												disabled={index === 0}
											>
												↑
											</Button>
											<Button
												isSmall
												onClick={() => moveOptionPosition(index, index + 1)}
												disabled={index === options.length - 1}
											>
												↓
											</Button>
											{options.length > 1 && (
												<Button isSmall onClick={() => deleteTab(index)}>
													x
												</Button>
											)}
										</div>
									)}
								</div>
							))}

							{!options.length && (
								<p>{__("No options added yet.", "blockons")}</p>
							)}

							{options.length > 0 && (
								<CustomOptionAppender
									buttonText={__("Add Option +", "blockons")}
									clientId={clientId}
								/>
							)}
						</div>

						<div className="blockons-divider"></div>
						<ToggleControl
							label={__("Show All Content Sections", "blockons")}
							checked={showOptions}
							onChange={() => setShowOptions((state) => !state)}
							help={__(
								"Show all content sections in the editor, for easier building for each option.",
								"blockons"
							)}
						/>
					</PanelBody>
					<PanelBody title={__("Dynamic Content Design Settings", "blockons")}>
						<UnitControl
							label={__("Search Min-Width", "blockons")}
							value={selectMinWidth}
							onChange={(value) => setAttributes({ selectMinWidth: value })}
							units={[
								{ value: "px", label: "px", default: 280 },
								{ value: "%", label: "%", default: 50 },
							]}
							isResetValueOnUnitChange
						/>
						<div className="blockons-divider"></div>

						<RangeControl
							label={__("Select Vertical Padding", "blockons")}
							value={selectVertPadding}
							onChange={(value) => setAttributes({ selectVertPadding: value })}
							min={0}
							max={50}
						/>
						<RangeControl
							label={__("Select Horizontal Padding", "blockons")}
							value={selectHorizPadding}
							onChange={(value) => setAttributes({ selectHorizPadding: value })}
							min={5}
							max={50}
						/>
						<div className="blockons-divider"></div>

						<BlockonsColorpicker
							label={__("Select Background Color", "blockons")}
							value={selectBgColor}
							onChange={(color) => setAttributes({ selectBgColor: color })}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Select Font Color", "blockons")}
							value={selectFontColor}
							onChange={(color) => setAttributes({ selectFontColor: color })}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Select Border", "blockons")}
							checked={selectBorder}
							onChange={(value) => setAttributes({ selectBorder: value })}
						/>
						{selectBorder && (
							<BlockonsColorpicker
								label={__("Select Border Color", "blockons")}
								value={selectBorderColor}
								onChange={(color) =>
									setAttributes({ selectBorderColor: color })
								}
								paletteColors={colorPickerPalette}
							/>
						)}

						<RangeControl
							label={__("Select Border Radius", "blockons")}
							value={selectBorderRadius}
							onChange={(value) => setAttributes({ selectBorderRadius: value })}
							min={0}
							max={100}
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

			{options && options.length > 0 && (
				<div className={`blockons-content-select align-${alignment}`}>
					<div
						className="blockons-content-select-select"
						style={{
							minWidth: selectMinWidth,
						}}
					>
						<select
							className={`blockons-ds-select ${
								!selectBorder ? "noborder" : ""
							}`}
							onChange={selectContentSection}
							style={{
								padding: `${selectVertPadding}px ${
									selectHorizPadding * 2
								}px ${selectVertPadding}px ${selectHorizPadding}px`,
								borderRadius: `${selectBorderRadius}px`,
								backgroundColor: selectBgColor,
								color: selectFontColor,
								borderColor: selectBorderColor,
							}}
						>
							{emptyFirstOption && <option value="">{emptyFirstText}</option>}
							{options.map((option, index) => (
								<option key={index} value={option.clientId}>
									{option.attributes.contentLabel}
								</option>
							))}
						</select>
					</div>
				</div>
			)}

			<div
				className={`blockons-ds-contents ${
					!options || options.length < 1 ? "none" : ""
				} ${showOptions ? "show-all" : ""}`}
			>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					{...(options.length < 1
						? {
								renderAppender: () => (
									<CustomOptionAppender
										buttonText={__(
											"Add the First Dynamic Content Option +",
											"blockons"
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
