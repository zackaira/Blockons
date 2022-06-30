/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			searchDisplay,
			textInput,
			textButton,
			iconSize,
			iconPadding,
			iconBgColor,
			iconColor,
			searchAlign,
			searchBgColor,
			searchBtnBgColor,
			searchBtnColor,
		},
		setAttributes,
	} = props;

	const [showSearch, setShowSearch] = useState(false);

	const blockProps = useBlockProps({
		className: `${alignment} ${
			isSelected && showSearch ? "blockons-show" : ""
		}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};
	const onChangeInputText = (value) => {
		setAttributes({ textInput: value });
	};
	const onChangeButtonText = (value) => {
		setAttributes({ textButton: value });
	};

	const closePopup = () => {
		setShowSearch(false);
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Search Settings", "blockons")}
						initialOpen={true}
					>
						<SelectControl
							label={__("Search Display", "blockons")}
							value={searchDisplay}
							options={[
								{ label: __("Drop Down", "blockons"), value: "dropdown" },
								{ label: __("Popup", "blockons"), value: "popup" },
							]}
							onChange={(newDisplay) =>
								setAttributes({
									searchDisplay:
										newDisplay === undefined ? "dropdown" : newDisplay,
								})
							}
							__nextHasNoMarginBottom
						/>

						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Search", "blockons")}
							checked={showSearch}
							help={__(
								"This will always display the search ONLY in the editor",
								"blockons"
							)}
							onChange={() => {
								setShowSearch((state) => !state);
							}}
						/>

						<SelectControl
							label={__("Align Drop Down Search", "blockons")}
							value={searchAlign}
							options={[
								{ label: __("Right", "blockons"), value: "right" },
								{ label: __("Left", "blockons"), value: "left" },
								{ label: __("Center", "blockons"), value: "center" },
							]}
							onChange={(value) =>
								setAttributes({
									searchAlign: value === undefined ? "right" : value,
								})
							}
							__nextHasNoMarginBottom
						/>
					</PanelBody>
					<PanelBody
						title={__("Search Design", "blockons")}
						initialOpen={false}
					>
						<RangeControl
							label={__("Icon Size", "blockons")}
							value={iconSize}
							onChange={(value) =>
								setAttributes({
									iconSize: value === undefined ? 17 : value,
								})
							}
							min={14}
							max={50}
						/>
						<RangeControl
							label={__("Icon Padding", "blockons")}
							value={iconPadding}
							onChange={(value) =>
								setAttributes({
									iconPadding: value === undefined ? 5 : value,
								})
							}
							min={0}
							max={50}
						/>

						<BlockonsColorpicker
							label={__("Icon Background Color", "blockons")}
							value={iconBgColor}
							onChange={(colorValue) => {
								setAttributes({
									iconBgColor: colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						<BlockonsColorpicker
							label={__("Icon Color", "blockons")}
							value={iconColor}
							onChange={(colorValue) => {
								setAttributes({
									iconColor: colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						{searchDisplay === "popup" && (
							<BlockonsColorpicker
								label={__("Search Background Color", "blockons")}
								value={searchBgColor}
								onChange={(colorValue) => {
									setAttributes({
										searchBgColor:
											colorValue === undefined ? "#FFF" : colorValue,
									});
								}}
								paletteColors={colorPickerPalette}
							/>
						)}

						<BlockonsColorpicker
							label={__("Search Button Background Color", "blockons")}
							value={searchBtnBgColor}
							onChange={(colorValue) => {
								setAttributes({
									searchBtnBgColor:
										colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						<BlockonsColorpicker
							label={__("Search Button Color", "blockons")}
							value={searchBtnColor}
							onChange={(colorValue) => {
								setAttributes({
									searchBtnColor:
										colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-search-block ${
					searchDisplay === "dropdown" && searchAlign ? searchAlign : ""
				}`}
				style={{
					backgroundColor: iconBgColor,
					fontSize: iconSize,
					padding: iconPadding,
				}}
			>
				<span
					className="fa-solid fa-magnifying-glass"
					style={{
						color: iconColor,
					}}
				></span>

				{searchDisplay === "dropdown" && (
					<div className="blockons-search-dropdown">
						<div className="blockons-search-inner">
							<RichText
								tagName="div"
								value={textInput}
								className="blockons-search-input"
								onChange={onChangeInputText}
							/>
							<RichText
								tagName="div"
								value={textButton}
								className="blockons-search-button"
								onChange={onChangeButtonText}
								style={{
									backgroundColor: searchBtnBgColor,
									color: searchBtnColor,
								}}
							/>
						</div>
					</div>
				)}
			</div>

			{searchDisplay === "popup" && (
				<>
					<div
						className="blockons-search-popup-overlay"
						onClick={closePopup}
					></div>
					<div className="blockons-search-popup-wrapper">
						<div
							className="blockons-search-popup"
							style={{
								backgroundColor: searchBgColor,
							}}
						>
							<div
								className="blockons-close fas fa-x"
								onClick={closePopup}
							></div>
							<div className="blockons-search-inner">
								<RichText
									tagName="div"
									value={textInput}
									className="blockons-search-input"
									onChange={onChangeInputText}
								/>
								<RichText
									tagName="div"
									value={textButton}
									className="blockons-search-button"
									onChange={onChangeButtonText}
									style={{
										backgroundColor: searchBtnBgColor,
										color: searchBtnColor,
									}}
								/>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Edit;
