/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
	RichText,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	TextControl,
	SelectControl,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			btnStyle,
			toggleTextClosed,
			toggleTextOpen,
			closedHeight,
			gradHeight,
			toggleWithin,
			toggleBgColor,
			toggleTextSize,
			toggleTextColor,
			toggleGradColor,
		},
		setAttributes,
	} = props;

	// Block Props
	const blockProps = useBlockProps({
		className: `style-${btnStyle}`,
	});
	const [forceClosed, setForcedClosed] = useState(false);

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Content Toggler Settings", "blockons")}
						initialOpen={true}
					>
						<ToggleControl
							label={__("Force Closed", "blockons")}
							checked={forceClosed}
							onChange={(newValue) => setForcedClosed(newValue)}
							help={__(
								"This is to display and edit the closed version while the block is still selected.",
								"blockons"
							)}
						/>
						{forceClosed && (
							<>
								<RangeControl
									label={__("Closed Height", "blockons")}
									value={closedHeight}
									onChange={(newValue) =>
										setAttributes({
											closedHeight:
												newValue === undefined ? 80 : parseInt(newValue),
										})
									}
									min={20}
									max={500}
								/>
								<div className="blockons-divider"></div>

								{(btnStyle === "one" || btnStyle === "two") && (
									<ToggleControl
										label={__("Place Toggle Within Hidden Content", "blockons")}
										checked={toggleWithin}
										onChange={(newValue) =>
											setAttributes({ toggleWithin: newValue })
										}
									/>
								)}
								<RangeControl
									label={__("Fade / Gradient Height", "blockons")}
									value={gradHeight}
									onChange={(newValue) =>
										setAttributes({
											gradHeight:
												newValue === undefined ? 60 : parseInt(newValue),
										})
									}
									min={0}
									max={closedHeight}
								/>
							</>
						)}

						<div className="blockons-divider"></div>

						<TextControl
							label={__("Toggle Closed Text", "blockons")}
							value={toggleTextClosed}
							onChange={(newValue) => {
								setAttributes({
									toggleTextClosed: newValue,
								});
							}}
						/>
						<TextControl
							label={__("Toggle Open Text", "blockons")}
							value={toggleTextOpen}
							onChange={(newValue) => {
								setAttributes({
									toggleTextOpen: newValue,
								});
							}}
						/>
					</PanelBody>
					<PanelBody
						title={__("Design Settings", "blockons")}
						initialOpen={false}
					>
						<SelectControl
							label={__("Toggle Text Style", "blockons")}
							value={btnStyle}
							options={[
								{ label: __("Plain Text", "blockons"), value: "one" },
								{ label: __("Button", "blockons"), value: "two" },
								{ label: __("Banner", "blockons"), value: "three" },
							]}
							onChange={(newValue) =>
								setAttributes({
									btnStyle: newValue === undefined ? "one" : newValue,
								})
							}
						/>
						<div className="blockons-divider"></div>

						{(btnStyle === "two" || btnStyle === "three") && (
							<>
								<BlockonsColorpicker
									label={__("Background Color", "blockons")}
									value={toggleBgColor}
									onChange={(colorValue) => {
										setAttributes({
											toggleBgColor:
												colorValue === undefined ? "#8B8B8B" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<div className="blockons-divider"></div>
							</>
						)}
						<RangeControl
							label={__("Font Size", "blockons")}
							value={toggleTextSize}
							onChange={(newValue) =>
								setAttributes({
									toggleTextSize: parseInt(newValue),
								})
							}
							min={11}
							max={38}
						/>
						<BlockonsColorpicker
							label={__("Text Color", "blockons")}
							value={toggleTextColor}
							onChange={(colorValue) => {
								setAttributes({
									toggleTextColor:
										colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>

						<BlockonsColorpicker
							label={__("Fade / Gradient Color", "blockons")}
							value={toggleGradColor}
							onChange={(colorValue) => {
								setAttributes({
									toggleGradColor:
										colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			<div
				className={`blockons-content-toggle-container ${
					isSelected && !forceClosed ? "isopen" : "isclosed"
				} ${
					(btnStyle === "one" || btnStyle === "two") && toggleWithin
						? "btn-inside"
						: ""
				}`}
			>
				<div className="blockons-content-toggle-block">
					<div
						className="blockons-content-toggle-inner"
						style={{
							...(closedHeight !== 100 ? { minHeight: closedHeight } : {}),
							...((btnStyle === "one" || btnStyle === "two") && toggleWithin
								? { paddingBottom: toggleTextSize * 2 }
								: {}),
						}}
					>
						<InnerBlocks renderAppender={InnerBlocks.ButtonBlockAppender} />
					</div>
				</div>
				<div
					className="blockons-content-toggle"
					{...(btnStyle === "three" && toggleBgColor !== "#8B8B8B"
						? { style: { backgroundColor: toggleBgColor } }
						: {})}
				>
					<div
						className="blockons-content-toggle-grad"
						style={{
							...(gradHeight !== 80 ? { height: gradHeight } : {}),
							...(toggleGradColor !== "#FFF"
								? {
										backgroundImage: `linear-gradient(to bottom, rgb(255 255 255 / 0%) 8%, ${toggleGradColor} 92%)`,
								  }
								: {}),
						}}
					></div>

					<div className="blockons-toggle-button">
						<RichText
							tagName="p"
							className="blockons-toggle-btn open"
							placeholder={__("Show less +", "blockons")}
							value={toggleTextOpen}
							onChange={(value) => setAttributes({ toggleTextOpen: value })}
							style={{
								...(toggleTextSize ? { fontSize: toggleTextSize } : {}),
								...(toggleTextColor !== "#000"
									? { color: toggleTextColor }
									: {}),
								...(btnStyle === "two" && toggleBgColor !== "#8B8B8B"
									? { backgroundColor: toggleBgColor }
									: {}),
							}}
						/>
						<RichText
							tagName="p"
							className="blockons-toggle-btn closed"
							placeholder={__("Show more +", "blockons")}
							value={toggleTextClosed}
							onChange={(value) => setAttributes({ toggleTextClosed: value })}
							style={{
								...(toggleTextSize ? { fontSize: toggleTextSize } : {}),
								...(toggleTextColor !== "#000"
									? { color: toggleTextColor }
									: {}),
								...(btnStyle === "two" && toggleBgColor !== "#8B8B8B"
									? { backgroundColor: toggleBgColor }
									: {}),
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Edit;
