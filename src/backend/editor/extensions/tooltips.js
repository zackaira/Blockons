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

	// console.log("selectedBlock", selectedBlock);

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
		style: tooltipDefaults.style || "underlined",
		theme: tooltipDefaults.theme || "one",
		title: "",
		text: "",
		icon: "",
		color: "",
		fcolor: "",
		pcolor: "#d6c0ff",
		pfcolor: "#000",
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
				fcolor: attributes["data-fcolor"] || "",
				pcolor: attributes["data-pcolor"] || "#d6c0ff",
				pfcolor: attributes["data-pfcolor"] || "#000",
			});
		} else {
			setSelectedTooltip({
				style: tooltipDefaults.style || "underlined",
				theme: tooltipDefaults.theme || "one",
				title: "",
				text: "",
				icon: "",
				color: "",
				fcolor: "",
				pcolor: "#d6c0ff",
				pfcolor: "#000",
			});
		}
	}, [activeFormat]);

	const handleTooltipChange = (property) => (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, [property]: newValue }));
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
								icon={
									<span className="dashicons dashicons-format-status"></span>
								}
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
									onChange={handleTooltipChange("title")}
								/>
								<TextareaControl
									label={__("Tooltip Text", "blockons")}
									value={selectedTooltip.text}
									onChange={handleTooltipChange("text")}
								/>
								<div className="blockons-divider"></div>

								<div className="blockons-tooltip-extra">
									<div className="blockons-tooltip-color-wrap">
										{!isPremium && (
											<Dropdown
												className="blockons-tooltip-color disabled"
												contentClassName="blockons-tooltip-color-picker"
												renderToggle={({ isOpen, onToggle }) => (
													<ToolbarButton
														icon={
															<span className="dashicons dashicons-admin-appearance"></span>
														}
														title={__("Blockons Tooltip", "blockons")}
														onClick={onToggle}
														isActive={isOpen}
														className="btn-disabled"
													/>
												)}
												renderContent={() => (
													<>
														<p>
															{__(
																"Blockons Pro offers more advanced Tooltips with more customization options.",
																"blockons"
															)}
														</p>
													</>
												)}
											/>
										)}
										{isPremium && activeFormat && (
											<Dropdown
												className="blockons-tooltip-color"
												contentClassName="blockons-tooltip-color-picker"
												renderToggle={({ isOpen, onToggle }) => (
													<ToolbarButton
														icon={
															<span className="dashicons dashicons-admin-appearance"></span>
														}
														title={__("Blockons Tooltip", "blockons")}
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
															onChange={handleTooltipChange("style")}
														/>
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
																			{__("Tooltip Link Color", "blockons")}
																		</span>
																	</Button>
																)}
																renderContent={() => (
																	<>
																		<ColorPicker
																			color={selectedTooltip.color}
																			onChange={handleTooltipChange("color")}
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
																				onChange={handleTooltipChange("fcolor")}
																				defaultValue="#f4f4f4"
																			/>
																		</>
																	)}
																/>
															)}
														</div>
														<div className="blockons-divider"></div>

														<SelectControl
															label={__("Tooltip Popup Theme", "blockons")}
															value={selectedTooltip.theme}
															options={[
																{ label: "Dark", value: "one" },
																{ label: "Light", value: "two" },
																{ label: "Custom Color", value: "custom" },
															]}
															onChange={handleTooltipChange("theme")}
														/>
														<div className="blockons-divider"></div>

														{selectedTooltip.theme === "custom" && (
															<>
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
																					colorValue={selectedTooltip.pcolor}
																				/>
																				<span>
																					{__("Popup Color", "blockons")}
																				</span>
																			</Button>
																		)}
																		renderContent={() => (
																			<>
																				<ColorPicker
																					color={selectedTooltip.pcolor}
																					onChange={handleTooltipChange(
																						"pcolor"
																					)}
																					defaultValue="#d6c0ff"
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
																						colorValue={selectedTooltip.pfcolor}
																					/>
																					<span>
																						{__("Popup Font Color", "blockons")}
																					</span>
																				</Button>
																			)}
																			renderContent={() => (
																				<>
																					<ColorPicker
																						color={selectedTooltip.pfcolor}
																						onChange={handleTooltipChange(
																							"pfcolor"
																						)}
																						defaultValue="#000"
																					/>
																				</>
																			)}
																		/>
																	)}
																</div>
																<div className="blockons-divider"></div>
															</>
														)}

														<TextControl
															label={__("Font Awesome Icon", "blockons")}
															value={selectedTooltip.icon}
															onChange={handleTooltipChange("icon")}
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
												style={{
													backgroundColor: selectedTooltip.color,
													...(selectedTooltip.fcolor
														? { color: selectedTooltip.fcolor }
														: {}),
												}}
											>
												Tooltip Preview
											</mark>
										) : (
											<span
												className={`blockons-tooltip-style ${selectedTooltip.style}`}
												style={{
													...(selectedTooltip.color
														? { borderBottomColor: selectedTooltip.color }
														: {}),
													...(selectedTooltip.fcolor
														? { color: selectedTooltip.fcolor }
														: {}),
												}}
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
										<div
											className={`blockons-tooltip-preview-tooltip`}
											{...(selectedTooltip.theme === "custom"
												? {
														style: {
															backgroundColor: selectedTooltip.pcolor,
															color: selectedTooltip.pfcolor,
														},
												  }
												: {})}
										>
											<h6 className="preview-title">Tooltip Title</h6>
											<p className="preview-text">Some tooltip text</p>

											<span
												className="blockons-tooltip-arrow"
												{...(selectedTooltip.theme === "custom"
													? {
															style: {
																borderTopColor: selectedTooltip.pcolor,
															},
													  }
													: {})}
											></span>
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
														"data-pcolor": selectedTooltip.pcolor,
														"data-pfcolor": selectedTooltip.pfcolor,
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
