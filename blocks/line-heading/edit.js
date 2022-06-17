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
			hTag,
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
		className: `align-${alignment} headalign-${headVertAlign} ${headElementAlign}-align`,
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
							options={[
								{ label: "H1", value: "h1" },
								{ label: "H2", value: "h2" },
								{ label: "H3", value: "h3" },
								{ label: "H4", value: "h4" },
								{ label: "H5", value: "h5" },
								{ label: "H6", value: "h6" },
								{ label: "div", value: "div" },
							]}
							onChange={(value) =>
								setAttributes({
									hTag: value === undefined ? "h3" : value,
								})
							}
							__nextHasNoMarginBottom
						/>

						<SelectControl
							label={__("Heading Width", "blockons")}
							value={headWidthSet}
							options={[
								{ label: "Outer Width by percentage", value: "outer" },
								{ label: "Line Width by pixels", value: "line" },
							]}
							onChange={(value) =>
								setAttributes({
									headWidthSet: value === undefined ? "outer" : value,
								})
							}
							__nextHasNoMarginBottom
						/>
						{headWidthSet === "outer" && (
							<RangeControl
								label={__("Outer Width", "blockons")}
								value={headOuterWidth}
								onChange={(value) => setAttributes({ headOuterWidth: value })}
								min={10}
								max={100}
								help={__(
									"The width set will be the percentage of it's container",
									"blockons"
								)}
							/>
						)}
						{headWidthSet === "line" && (
							<RangeControl
								label={__("Width", "blockons")}
								value={headLineWidth}
								onChange={(value) => setAttributes({ headLineWidth: value })}
								min={10}
								max={1000}
								help={__(
									"This will set the pixel width of the heading lines",
									"blockons"
								)}
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
							onChange={(value) =>
								setAttributes({
									headVertAlign: value === undefined ? "solid" : value,
								})
							}
							__nextHasNoMarginBottom
						/>
					</PanelBody>
					<PanelBody
						title={__("Line Heading Design", "blockons")}
						initialOpen={false}
					>
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
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__("Line Thickness", "blockons")}
							value={lineWidth}
							onChange={(value) => setAttributes({ lineWidth: value })}
							min={1}
							max={40}
						/>

						<p>{__("Heading Font Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={fontColor}
							onChange={(colorValue) =>
								setAttributes({
									fontColor: colorValue === undefined ? "inherit" : colorValue,
								})
							}
						/>
						<p>{__("Line Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={lineColor}
							onChange={(colorValue) =>
								setAttributes({
									lineColor: colorValue === undefined ? "#444" : colorValue,
								})
							}
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
						onChange={(value) => {
							setAttributes({ headElementAlign: value });
						}}
					/>
				</BlockControls>
			}
			<div
				className={`blockons-lheading-wrap`}
				style={{
					...(headWidthSet === "outer" ? { width: headOuterWidth + "%" } : ""),
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
					keepPlaceholderOnFocus
					value={headingTitle}
					className="blockons-lheading-text"
					onChange={(value) => setAttributes({ headingTitle: value })}
					style={{
						color: fontColor,
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
