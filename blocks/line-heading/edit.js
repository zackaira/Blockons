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
	BlockAlignmentToolbar,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
} from "@wordpress/components";

import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			headingWidth,
			hTag,
			headingTitle,
			lineStyle,
			lineWidth,
			lineColor,
			headElementAlign,
			headVertAlign,
			fontSize,
			fontColor,
		},
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} headalign-${headVertAlign} ${headElementAlign}-align`,
	});

	const onChangeAlignment = (newAlignment) => {
		props.setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};
	const onChangeCustomIcon = (value) => {
		props.setAttributes({ customIcon: value });
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
							label={__("Heading Level", "blockons")}
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
								props.setAttributes({
									hTag: value === undefined ? "h3" : value,
								})
							}
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={__("Heading Alignment", "blockons")}
							value={headElementAlign}
							options={[
								{ label: "Left", value: "left" },
								{ label: "Center", value: "center" },
								{ label: "Right", value: "right" },
							]}
							onChange={(value) =>
								props.setAttributes({
									headElementAlign: value === undefined ? "center" : value,
								})
							}
							__nextHasNoMarginBottom
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
								props.setAttributes({
									lineStyle: value === undefined ? "solid" : value,
								})
							}
							__nextHasNoMarginBottom
						/>
						<RangeControl
							label={__("Line Thickness", "blockons")}
							value={lineWidth}
							onChange={(value) => props.setAttributes({ lineWidth: value })}
							min={1}
							max={40}
							clearable
						/>
						<RangeControl
							label={__("Width", "blockons")}
							value={headingWidth}
							onChange={(value) => props.setAttributes({ headingWidth: value })}
							min={10}
							max={100}
							clearable
						/>

						<SelectControl
							label={__("Text & Line Alignment", "blockons")}
							value={headVertAlign}
							options={[
								{ label: "Top", value: "topalign" },
								{ label: "Center", value: "centeralign" },
								{ label: "Base", value: "basealign" },
								{ label: "Bottom", value: "bottomalign" },
							]}
							onChange={(value) =>
								props.setAttributes({
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
						<p>{__("Heading Font Color", "blockons")}</p>
						<ColorPalette
							value={fontColor}
							onChange={(colorValue) =>
								props.setAttributes({
									fontColor: colorValue === undefined ? "inherit" : colorValue,
								})
							}
						/>
						<p>{__("Line Color", "blockons")}</p>
						<ColorPalette
							value={lineColor}
							onChange={(colorValue) =>
								props.setAttributes({
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
							props.setAttributes({ headElementAlign: value });
						}}
					/>
				</BlockControls>
			}
			<div
				className={`blockons-lheading-wrap`}
				style={{
					width: headingWidth + "%",
				}}
			>
				{(alignment === "right" || alignment === "center") && (
					<div
						className="blockons-lheading-before"
						style={{
							borderBottom: `${lineWidth}px ${lineStyle} ${lineColor}`,
						}}
					/>
				)}
				<RichText
					tagName={hTag}
					placeholder={__("Heading Title", "blockons")}
					keepPlaceholderOnFocus
					value={headingTitle}
					className="blockons-lheading-text"
					onChange={(value) => props.setAttributes({ headingTitle: value })}
					style={{
						color: fontColor,
						fontSize: fontSize,
					}}
				/>
				{(alignment === "left" || alignment === "center") && (
					<div
						className="blockons-lheading-after"
						style={{
							borderBottom: `${lineWidth}px ${lineStyle} ${lineColor}`,
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Edit;
