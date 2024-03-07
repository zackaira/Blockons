const { addFilter } = wp.hooks;
const { useState, useEffect } = wp.element;
const { assign, merge } = lodash;
const { __ } = wp.i18n;
const {
	registerFormatType,
	unregisterFormatType,
	applyFormat,
	removeFormat,
	getActiveFormat,
} = wp.richText;
const { BlockControls } = wp.blockEditor;
const {
	ToolbarGroup,
	Dropdown,
	ToolbarButton,
	ToggleControl,
	TextControl,
	TextareaControl,
	SelectControl,
	Button,
	ColorPicker,
	ColorIndicator,
} = wp.components;
const { useSelect, dispatch } = wp.data;
const isPremium = Boolean(blockonsEditorObj.isPremium);
const tooltipDefaults = blockonsEditorObj.blockonsOptions?.tooltips;

const BlockonsInlineBlockTooltip = ({ isActive, onChange, value }) => {
	const selectedBlock = useSelect((select) => {
		return select("core/block-editor").getSelectedBlock();
	}, []);

	const allowedBlocks = [
		"core/paragraph",
		"core/heading",
		"blockons/line-heading",
	];
	if (!selectedBlock || !allowedBlocks.includes(selectedBlock.name)) {
		return null;
	}

	const activeFormat = getActiveFormat(value, "blockons/inline-tooltip");
	const [selectedTooltip, setSelectedTooltip] = useState({
		style: tooltipDefaults.style,
		theme: tooltipDefaults.theme,
		title: "",
		text: "",
		icon: "",
		color: "",
		fcolor: "",
	});

	// console.log("selectedTooltip", selectedTooltip);

	useEffect(() => {
		if (activeFormat) {
			const attributes =
				Object.keys(activeFormat.attributes).length > 0
					? activeFormat.attributes
					: Object.keys(activeFormat.unregisteredAttributes).length > 0
					? activeFormat.unregisteredAttributes
					: "";

			setSelectedTooltip({
				style: attributes["data-style"] || tooltipDefaults.style,
				theme: attributes["data-theme"] || tooltipDefaults.theme,
				title: attributes["data-title"] || "",
				text: attributes["data-text"] || "",
				icon: attributes["data-icon"] || "",
				color: attributes["data-color"] || "",
				fcolor: attributes["data-color"] || "",
			});
		} else {
			setSelectedTooltip({
				style: tooltipDefaults.style,
				theme: tooltipDefaults.theme,
				title: "",
				text: "",
				icon: "",
				color: "",
				fcolor: "",
			});
		}
	}, [activeFormat]);

	const handleStyleChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, style: newValue }));
	};

	const handleThemeChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, theme: newValue }));
	};

	const handleTitleChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, title: newValue }));
	};

	const handleTextChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, text: newValue }));
	};

	const handleIconChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, icon: newValue }));
	};

	const handleColorChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, color: newValue }));
	};

	const handleFontColorChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, fcolor: newValue }));
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						className="blockons-tooltip-settings-dropdown"
						contentClassName="blockons-tooltip-settings-popover"
						popoverProps={{ placement: "bottom-start" }}
						renderToggle={({ isOpen, onToggle }) => (
							<ToolbarButton
								icon={<span className="dashicons dashicons-info"></span>}
								title="Blockons Tooltip"
								onClick={onToggle}
								isActive={isActive}
							/>
						)}
						renderContent={() => (
							<div className="blockons-tooltip-settings">
								<TextControl
									label={__("Tooltip Title", "blockons")}
									value={selectedTooltip.title}
									onChange={handleTitleChange}
								/>
								<TextareaControl
									label={__("Tooltip Text", "blockons")}
									value={selectedTooltip.text}
									onChange={handleTextChange}
								/>
								<div className="blockons-divider"></div>

								<div className="blockons-tooltip-extra">
									<div className="blockons-tooltip-color-wrap">
										{isPremium && activeFormat && (
											<Dropdown
												className="blockons-tooltip-color"
												contentClassName="blockons-tooltip-color-picker"
												renderToggle={({ isOpen, onToggle }) => (
													<ToolbarButton
														icon={
															<span className="dashicons dashicons-admin-appearance"></span>
														}
														title="Blockons Tooltip"
														onClick={onToggle}
														isActive={isOpen}
													/>
												)}
												renderContent={() => (
													<>
														<SelectControl
															label={__("Tooltip Link Style", "blockons")}
															value={selectedTooltip.style}
															options={[
																{ label: "Underlined", value: "underlined" },
																{ label: "Underline Dashed", value: "dashed" },
																{ label: "Highlighted", value: "highlight" },
															]}
															onChange={handleStyleChange}
														/>
														<SelectControl
															label={__("Tooltip Popup Theme", "blockons")}
															value={selectedTooltip.theme}
															options={[
																{ label: "Dark", value: "one" },
																{ label: "Light", value: "two" },
															]}
															onChange={handleThemeChange}
														/>
														<div className="blockons-divider"></div>

														<TextControl
															label={__("Font Awesome Icon", "blockons")}
															value={selectedTooltip.icon}
															onChange={handleIconChange}
															help={__(
																"Add the name of the Font Awesome icon you want to add to the Tooltip",
																"blockons"
															)}
														/>
														<p>
															<a href="#" target="_blank">
																{__("How to add Tooltip Icons", "blockons")}
															</a>
														</p>
														<div className="blockons-divider"></div>

														<div className="blockons-tooltip-clrs">
															<Dropdown
																className="blockons-tooltip-color"
																contentClassName="blockons-tooltip-color-picker"
																renderToggle={({ isOpen, onToggle }) => (
																	<Button
																		variant="link"
																		onClick={onToggle}
																		className="blockons-colorpicker-btn"
																	>
																		<ColorIndicator
																			colorValue={selectedTooltip.color}
																		/>
																		<span>
																			{__("Primary Color", "blockons")}
																		</span>
																	</Button>
																)}
																renderContent={() => (
																	<>
																		<ColorPicker
																			color={selectedTooltip.color}
																			onChange={handleColorChange}
																			defaultValue="#f4f4f4"
																		/>
																	</>
																)}
															/>
															{(selectedTooltip.theme !== "one" ||
																selectedTooltip.theme !== "two") && (
																<Dropdown
																	className="blockons-tooltip-color"
																	contentClassName="blockons-tooltip-color-picker"
																	renderToggle={({ isOpen, onToggle }) => (
																		<Button
																			variant="link"
																			onClick={onToggle}
																			className="blockons-colorpicker-btn"
																		>
																			<ColorIndicator
																				colorValue={selectedTooltip.fcolor}
																			/>
																			<span>
																				{__("Font Color", "blockons")}
																			</span>
																		</Button>
																	)}
																	renderContent={() => (
																		<>
																			<ColorPicker
																				color={selectedTooltip.fcolor}
																				onChange={handleFontColorChange}
																				defaultValue="#f4f4f4"
																			/>
																		</>
																	)}
																/>
															)}
														</div>
													</>
												)}
											/>
										)}
									</div>

									<div
										className={`blockons-tooltip-preview  ${selectedTooltip.theme}`}
									>
										{selectedTooltip.style === "highlight" ? (
											<mark
												className={`blockons-tooltip-style ${selectedTooltip.style}`}
												style={{ backgroundColor: selectedTooltip.color }}
											>
												Tooltip Preview
											</mark>
										) : (
											<span
												className={`blockons-tooltip-style ${selectedTooltip.style}`}
												{...(selectedTooltip.color !== ""
													? {
															style: {
																borderBottomColor: selectedTooltip.color,
															},
													  }
													: {})}
											>
												Tooltip Preview
											</span>
										)}
										{selectedTooltip.icon && (
											<span
												className={`blockons-icon ${selectedTooltip.icon}`}
												style={{ color: selectedTooltip.color }}
											></span>
										)}
										<div className={`blockons-tooltip-preview-tooltip`}>
											<h6 className="preview-title">Tooltip Title</h6>
											<p className="preview-text">Some tooltip text</p>

											<span className="blockons-tooltip-arrow"></span>
										</div>
									</div>
								</div>
								<div
									className={`blockons-tooltip-btns ${
										activeFormat ? "active" : ""
									}`}
								>
									<Button
										variant="secondary"
										className="blockons-tooltip-button"
										onClick={() => {
											onChange(
												applyFormat(value, {
													type: "blockons/inline-tooltip",
													attributes: {
														"data-style": selectedTooltip.style,
														"data-theme": selectedTooltip.theme,
														"data-title": selectedTooltip.title,
														"data-text": selectedTooltip.text,
														"data-icon": selectedTooltip.icon,
														"data-color": selectedTooltip.color,
														"data-fcolor": selectedTooltip.fcolor,
													},
												})
											);
										}}
										disabled={!selectedTooltip.title && !selectedTooltip.text}
									>
										{activeFormat &&
										(selectedTooltip.title || selectedTooltip.text)
											? __("Update Tooltip", "blockons")
											: __("Add Tooltip", "blockons")}
									</Button>
									{activeFormat && (
										<Button
											variant="secondary"
											className="blockons-tooltip-button remove"
											onClick={() => {
												onChange(
													removeFormat(value, "blockons/inline-tooltip")
												);
											}}
											icon="no-alt"
											title={__("Remove Tooltip", "blockons")}
										></Button>
									)}
								</div>
							</div>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

if (tooltipDefaults.enabled) {
	registerFormatType("blockons/inline-tooltip", {
		title: "Blockons Tooltip",
		tagName: "span",
		className: "blockons-inline-tooltip",
		edit: BlockonsInlineBlockTooltip,
	});
}
