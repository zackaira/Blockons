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
	SelectControl,
	RangeControl,
	TextControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { elementTags, colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			hTag,
			headFontSize,
			headWidthSet,
			headElementAlign,
			headOuterWidth,
			headLineWidth,
			headingTitle,
			lineStyle,
			lineWidth,
			lineColor,
			headVertAlign,
			fontColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} headalign-${headVertAlign} ${headElementAlign}-align width-${headWidthSet}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Line Heading Settings", "blockons")}
						initialOpen={true}
					>
						<SelectControl
							label={__("Heading Tag Element", "blockons")}
							value={hTag}
							options={elementTags}
							onChange={(newValue) =>
								setAttributes({
									hTag: newValue === undefined ? "h3" : newValue,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						<SelectControl
							label={__("Set Heading width by", "blockons")}
							value={headWidthSet}
							options={[
								{ label: "Outer Width", value: "outer" },
								{ label: "Line Width by pixels", value: "line" },
							]}
							onChange={(newValue) =>
								setAttributes({
									headWidthSet: newValue === undefined ? "outer" : newValue,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						{headWidthSet === "outer" && (
							<UnitControl
								label={__("Outer Width", "blockons")}
								value={headOuterWidth}
								onChange={(value) =>
									setAttributes({
										headOuterWidth: value,
									})
								}
								units={[
									{ value: "%", label: "%", default: 100 },
									{ value: "px", label: "px", default: 600 },
								]}
								isResetValueOnUnitChange
								__next40pxDefaultSize={true}
							/>
						)}
						{headWidthSet === "line" && (
							<RangeControl
								label={__("Line Width", "blockons")}
								value={headLineWidth}
								onChange={(newValue) =>
									setAttributes({ headLineWidth: parseInt(newValue) })
								}
								min={10}
								max={1000}
								help={__(
									"This will set the pixel width of the heading lines",
									"blockons"
								)}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}

						<SelectControl
							label={__("Text & Line Vertical Alignment", "blockons")}
							value={headVertAlign}
							options={[
								{ label: "Top", value: "topalign" },
								{ label: "Center", value: "centeralign" },
								{ label: "Base", value: "basealign" },
								{ label: "Bottom", value: "bottomalign" },
							]}
							onChange={(newValue) =>
								setAttributes({
									headVertAlign: newValue === undefined ? "solid" : newValue,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
					</PanelBody>
					<PanelBody
						title={__("Line Heading Design", "blockons")}
						initialOpen={false}
					>
						<TextControl
							label={__("Font Size", "blockons")}
							value={headFontSize}
							onChange={(newValue) =>
								setAttributes({ headFontSize: parseInt(newValue) })
							}
							type="number"
							help={__(
								"Clear this setting to take on the heading sizes set by the theme or page builders.",
								"blockons"
							)}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<SelectControl
							label={__("Line Style", "blockons")}
							value={lineStyle}
							options={[
								{ label: "Solid", value: "solid" },
								{ label: "Dotted", value: "dotted" },
								{ label: "Dashed", value: "dashed" },
							]}
							onChange={(value) =>
								setAttributes({
									lineStyle: value === undefined ? "solid" : value,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<RangeControl
							label={__("Line Thickness", "blockons")}
							value={lineWidth}
							onChange={(value) => setAttributes({ lineWidth: value })}
							min={1}
							max={40}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						<BlockonsColorpicker
							label={__("Heading Font Color", "blockons")}
							value={fontColor}
							onChange={(colorValue) => {
								setAttributes({
									fontColor: colorValue === undefined ? "inherit" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Line Color", "blockons")}
							value={lineColor}
							onChange={(colorValue) => {
								setAttributes({
									lineColor: colorValue === undefined ? "#444" : colorValue,
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
					<BlockAlignmentToolbar
						value={headElementAlign}
						controls={["left", "center", "right"]}
						onChange={(newValue) => {
							setAttributes({ headElementAlign: newValue });
						}}
					/>
				</BlockControls>
			}
			<div
				className={`blockons-lheading-wrap`}
				style={{
					...(headWidthSet === "outer" ? { width: headOuterWidth } : ""),
				}}
			>
				{(alignment === "right" || alignment === "center") && (
					<div
						className="blockons-lheading-before"
						style={{
							borderBottom: `${lineWidth}px ${lineStyle} ${lineColor}`,
							...(headWidthSet === "line" ? { width: headLineWidth } : ""),
						}}
					/>
				)}
				<RichText
					tagName={hTag}
					placeholder={__("Heading Title", "blockons")}
					value={headingTitle}
					className="blockons-lheading-text"
					onChange={(value) => setAttributes({ headingTitle: value })}
					style={{
						color: fontColor,
						...(headFontSize ? { fontSize: headFontSize + "px" } : ""),
					}}
				/>
				{(alignment === "left" || alignment === "center") && (
					<div
						className="blockons-lheading-after"
						style={{
							borderBottom: `${lineWidth}px ${lineStyle} ${lineColor}`,
							...(headWidthSet === "line" ? { width: headLineWidth } : ""),
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Edit;
