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
	Button,
} = wp.components;
const { useSelect, dispatch } = wp.data;
const isPremium = Boolean(blockonsEditorObj.isPremium);
const tooltipsEnabled = Boolean(
	blockonsEditorObj.blockonsOptions?.tooltips?.enabled
);

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
		title: "",
		text: "",
	});

	useEffect(() => {
		if (activeFormat) {
			const attributes =
				Object.keys(activeFormat.attributes).length > 0
					? activeFormat.attributes
					: Object.keys(activeFormat.unregisteredAttributes).length > 0
					? activeFormat.unregisteredAttributes
					: "";

			// console.log("ATTRIBUTES: ", attributes);

			setSelectedTooltip({
				title: attributes["data-title"] || "",
				text: attributes["data-text"] || "",
			});
		} else {
			setSelectedTooltip({ title: "", text: "" });
		}
	}, [activeFormat]);

	const handleTitleChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, title: newValue }));
	};

	const handleTextChange = (newValue) => {
		setSelectedTooltip((prevState) => ({ ...prevState, text: newValue }));
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						className="my-container-class-name"
						contentClassName="my-popover-content-classname"
						popoverProps={{ placement: "bottom-start" }}
						renderToggle={({ isOpen, onToggle }) => (
							<ToolbarButton
								icon={<span class="dashicons dashicons-info"></span>}
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
														"data-title": selectedTooltip.title,
														"data-text": selectedTooltip.text,
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

if (tooltipsEnabled) {
	registerFormatType("blockons/inline-tooltip", {
		title: "Blockons Tooltip",
		tagName: "span",
		className: "blockons-inline-tooltip",
		edit: BlockonsInlineBlockTooltip,
	});
}
