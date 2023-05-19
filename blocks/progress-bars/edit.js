/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	BlockAlignmentToolbar,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	RangeControl,
	ColorPalette,
	Button,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";
import { slugify } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			pbDesign,
			alignment,
			pbMaxWidth,
			pbElementAlign,
			listItems,
			pbItemSpacing,
			pbItemHeight,
			pbShowPercent,
			pbShowLabel,
			pbItemDescSize,
			pbBarColor,
			pbBarBgColor,
			pbDescFontColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `back ${alignment} ${pbElementAlign}-align`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};

	const handleItemTextChange = (pbText, pbId) => {
		const newListItems = [...listItems];
		// Edit the item text and ID (this prevent the edit from editing all instances if the block is duplicated)
		const editedListItems = newListItems.map((obj) => {
			if (obj.pbId === pbId)
				return {
					...obj,
					pbId:
						!obj.pbText || obj.pbText === ""
							? Math.floor(Math.random() * 800)
							: slugify(pbText),
					pbText: pbText,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemWidthChange = (pbWidth, pbId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.pbId === pbId)
				return {
					...obj,
					pbWidth: pbWidth,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemPbColorChange = (pbColor, pbId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.pbId === pbId)
				return {
					...obj,
					pbColor: pbColor,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemPbBgColorChange = (pbBgColor, pbId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.pbId === pbId)
				return {
					...obj,
					pbBgColor: pbBgColor,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};

	const handleAddItem = () => {
		const newListItems = [...listItems];
		newListItems.push({
			pbId: Math.floor(Math.random() * 800),
			pbText: "",
			pbWidth: 50,
			pbColor: "",
			pbBgColor: "",
		});
		setAttributes({ listItems: newListItems });
	};

	const handleRemoveItem = (index) => {
		const newListItems = [...listItems];
		newListItems.splice(index, 1);
		setAttributes({ listItems: newListItems });
	};

	const handleDuplicateItem = (index, pbText, pbWidth, pbColor, pbBgColor) => {
		const newListItems = [...listItems];
		newListItems.splice(index + 1, 0, {
			pbId: newListItems.length + 1,
			pbText,
			pbWidth,
			pbColor,
			pbBgColor,
		});
		setAttributes({ listItems: newListItems });
	};

	// Progress Bars Items
	let listItemDisplay;

	if (listItems.length) {
		listItemDisplay = listItems.map((listItem, index) => {
			return (
				<li
					className={`blockons-progressbar-item`}
					style={{
						marginBottom: pbItemSpacing + "px",
					}}
				>
					{pbShowLabel && (
						<div className="blockons-progressbar-desc">
							<RichText
								tagName="div"
								placeholder={__("Progress Bar Description", "blockons")}
								value={listItem.pbText}
								className="blockons-progressbar-item-txt"
								onChange={(pbText) =>
									handleItemTextChange(pbText, listItem.pbId)
								}
								style={{
									fontSize: listItem.textNewSize
										? listItem.textNewSize + "px"
										: pbItemDescSize + "px",
									color: listItem.textNewColor
										? listItem.textNewColor
										: pbDescFontColor,
								}}
							/>
						</div>
					)}

					<div
						className="blockons-progressbar-bar"
						ref={props.innerRef}
						style={{
							height: pbItemHeight + "px",
							backgroundColor: listItem.pbBgColor
								? listItem.pbBgColor
								: pbBarBgColor,
						}}
					>
						<div
							className="blockons-progressbar-bar-inner"
							style={{
								width: listItem.pbWidth + "%",
								backgroundColor: listItem.pbColor
									? listItem.pbColor
									: pbBarColor,
							}}
						>
							{pbShowPercent ? listItem.pbWidth + "%" : ""}
						</div>
					</div>

					<div className="blockons-item-btns">
						<Dropdown
							className="blockons-item-level-settings"
							contentClassName="blockons-editor-popup"
							popoverProps={{ placement: "bottom-end" }}
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									icon="art"
									label={__("List Item Colors", "blockons")}
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							)}
							renderContent={() => (
								<>
									<RangeControl
										value={listItem.pbWidth}
										min={1}
										max={100}
										onChange={(newWidth) =>
											handleItemWidthChange(newWidth, listItem.pbId)
										}
									/>
									<BlockonsColorpicker
										label={__("Progress Bar Color", "blockons")}
										value={listItem.pbColor ? listItem.pbColor : pbBarColor}
										onChange={(newColor) =>
											handleItemPbColorChange(newColor, listItem.pbId)
										}
										paletteColors={colorPickerPalette}
									/>
									<BlockonsColorpicker
										label={__("Background Color", "blockons")}
										value={
											listItem.pbBgColor ? listItem.pbBgColor : pbBarBgColor
										}
										onChange={(newColor) =>
											handleItemPbBgColorChange(newColor, listItem.pbId)
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}
						/>
						<Button
							className="blockons-duplicate-item"
							icon="admin-page"
							label="Duplicate Item"
							onClick={() =>
								handleDuplicateItem(
									index,
									listItem.pbText,
									listItem.pbWidth,
									listItem.pbColor,
									listItem.pbBgColor
								)
							}
						/>
						<Button
							className="blockons-remove-item"
							icon="no-alt"
							label="Delete Item"
							onClick={() => handleRemoveItem(index)}
						/>
					</div>
				</li>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Progress Bars Settings", "blockons")}
						initialOpen={true}
					>
						<RangeControl
							label={__("Progress Bar Container Width", "blockons")}
							value={pbMaxWidth}
							min={1}
							max={100}
							onChange={(value) => setAttributes({ pbMaxWidth: value })}
						/>

						<ToggleControl
							label={__("Display Labels", "blockons")}
							checked={pbShowLabel}
							onChange={(value) => setAttributes({ pbShowLabel: value })}
						/>
						{pbShowLabel && (
							<RangeControl
								label={__("Label Font Size", "blockons")}
								value={pbItemDescSize}
								onChange={(newFontSize) => {
									setAttributes({ pbItemDescSize: newFontSize });
								}}
								min={11}
								max={48}
								clearable
							/>
						)}

						<RangeControl
							label={__("Item Spacing", "blockons")}
							value={pbItemSpacing}
							onChange={(value) => setAttributes({ pbItemSpacing: value })}
							min={0}
							max={100}
							clearable
						/>
						{"six" !== pbDesign && (
							<RangeControl
								label={__("Height of Progress Bars", "blockons")}
								value={pbItemHeight}
								onChange={(value) => setAttributes({ pbItemHeight: value })}
								min={4}
								max={140}
								clearable
							/>
						)}
						{"six" !== pbDesign && (
							<ToggleControl
								label={__("Display Percentage", "blockons")}
								checked={pbShowPercent}
								onChange={(value) => setAttributes({ pbShowPercent: value })}
							/>
						)}
					</PanelBody>
					<PanelBody
						title={__("Progress Bars Design", "blockons")}
						initialOpen={false}
					>
						<SelectControl
							label="Progress Bar Design"
							value={pbDesign}
							options={[
								{ label: "Plain Raised", value: "one" },
								{ label: "Plain Flat", value: "two" },
								{ label: "Two Shade", value: "three" },
								{ label: "Pattern Lines", value: "four" },
								{ label: "Border Bottom Line", value: "five" },
								{ label: "Thin Line", value: "six" },
							]}
							onChange={(value) => setAttributes({ pbDesign: value })}
						/>
						<BlockonsColorpicker
							label={__("Bar Color", "blockons")}
							value={pbBarColor}
							onChange={(colorValue) =>
								setAttributes({
									pbBarColor: colorValue === undefined ? "#22b0ea" : colorValue,
								})
							}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Bar Background Color", "blockons")}
							value={pbBarBgColor}
							onChange={(colorValue) =>
								setAttributes({
									pbBarBgColor:
										colorValue === undefined ? "#F7F7F7" : colorValue,
								})
							}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Text Color", "blockons")}
							value={pbDescFontColor}
							onChange={(colorValue) =>
								setAttributes({
									pbDescFontColor:
										colorValue === undefined ? "#404040" : colorValue,
								})
							}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
					{pbMaxWidth !== 100 && (
						<BlockAlignmentToolbar
							value={pbElementAlign}
							controls={["left", "center", "right"]}
							onChange={(value) => {
								setAttributes({ pbElementAlign: value });
							}}
						/>
					)}
				</BlockControls>
			}
			<div
				className={`blockons-progressbar-wrap blockons-progressbar-${pbDesign}`}
				style={{
					maxWidth: pbMaxWidth + "%",
				}}
			>
				<ul className="blockons-progressbar pb-start">{listItemDisplay}</ul>
				{isSelected && (
					<div
						className={`blockons-add-new ${
							listItemDisplay === undefined ? "no-items" : "has-items"
						}`}
					>
						<Button variant="secondary" onClick={handleAddItem}>
							{__("Add a New Progress Bar", "Blockons")}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
