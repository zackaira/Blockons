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
	ColorPalette,
} from "@wordpress/components";

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
	} = props;

	const [showSearch, setShowSearch] = useState(false);

	const blockProps = useBlockProps({
		className: `${alignment} ${
			isSelected && showSearch ? "blockons-show" : ""
		}`,
	});

	const onChangeAlignment = (newAlignment) => {
		props.setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};
	const onChangeInputText = (value) => {
		props.setAttributes({ textInput: value });
	};
	const onChangeButtonText = (value) => {
		props.setAttributes({ textButton: value });
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
								props.setAttributes({
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
								props.setAttributes({
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
								props.setAttributes({
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
								props.setAttributes({
									iconPadding: value === undefined ? 5 : value,
								})
							}
							min={0}
							max={50}
						/>

						<p>{__("Icon Background Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={iconBgColor}
							onChange={(newColor) =>
								props.setAttributes({
									iconBgColor: newColor === undefined ? "#FFF" : newColor,
								})
							}
						/>

						<p>{__("Icon Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={iconColor}
							onChange={(newColor) =>
								props.setAttributes({
									iconColor: newColor === undefined ? "#000" : newColor,
								})
							}
						/>

						{searchDisplay === "popup" && (
							<>
								<p>{__("Search Background Color", "blockons")}</p>
								<ColorPalette
									colors={colorPickerPalette}
									value={searchBgColor}
									onChange={(newColor) =>
										props.setAttributes({
											searchBgColor: newColor === undefined ? "#FFF" : newColor,
										})
									}
								/>
							</>
						)}

						<p>{__("Search Button Background Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={searchBtnBgColor}
							onChange={(newColor) =>
								props.setAttributes({
									searchBtnBgColor: newColor === undefined ? "#000" : newColor,
								})
							}
						/>
						<p>{__("Search Button Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={searchBtnColor}
							onChange={(newColor) =>
								props.setAttributes({
									searchBtnColor: newColor === undefined ? "#FFF" : newColor,
								})
							}
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
