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
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const ALLOWED_BLOCKS = ["blockons/ds-content"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: { uniqueId, alignment, options },
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
		className: ``,
	});

	console.log("options", options);

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId).innerBlocks,
		[clientId]
	);

	useEffect(() => {
		setAttributes({
			uniqueId: uuidv4(),
		});
	}, []);

	useEffect(() => {
		if (innerBlocks.length) setAttributes({ options: innerBlocks });
	}, [innerBlocks]);

	const moveOptionPosition = (currentIndex, newIndex) => {
		if (newIndex >= 0 && newIndex < innerBlocks.length) {
			setTimeout(() => {
				moveBlockToPosition(
					innerBlocks[currentIndex].clientId,
					clientId,
					clientId,
					newIndex
				);
				// selectContentSection(newIndex);
			}, 100);
			// selectBlock(innerBlocks[currentIndex].clientId);
			setAttributes({ options: innerBlocks });
		}
	};

	const selectContentSection = (value) => {
		const selectedOption = options.find(
			(option) => option.clientId === value.value
		);

		setAttributes({
			selectedOption: selectedOption.clientId,
		});
	};

	const deleteTab = (index) => {
		if (innerBlocks[index]) {
			removeBlock(innerBlocks[index].clientId);
			setAttributes({ options: innerBlocks });
		}
	};

	const CustomOptionAppender = ({ buttonText, clientId }) => {
		const { insertBlock } = useDispatch(blockEditorStore);

		const addBlock = () => {
			const block = wp.blocks.createBlock("blockons/ds-content");
			insertBlock(block, undefined, clientId);
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
																		label={__("Count Down", "blockons")}
																		type="number"
																		value={option.attributes.countDown}
																		onChange={(value) =>
																			updateBlockAttributes(option.clientId, {
																				countDown: parseInt(value),
																			})
																		}
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

			{options.length > 0 && (
				<>
					<div className={`blockons-content-select align-${alignment}`}>
						<div className="blockons-content-select-select">
							<Select
								defaultValue=""
								options={options.map((option, index) => ({
									value: option.clientId,
									label: option.attributes.contentLabel,
								}))}
								placeholder={__("Select...", "blockons")}
								isSearchable={false}
								onChange={(value) => selectContentSection(value)}
								styles={{
									control: (base) => ({
										...base,
										minWidth: "280px",
									}),
								}}
							/>
						</div>
					</div>
				</>
			)}

			<div
				className={`blockons-ds-contents ${
					innerBlocks?.length < 1 ? "none" : ""
				}`}
			>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					{...(innerBlocks?.length < 1
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