/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	RangeControl,
	ColorPalette,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { elementTags, colorPickerPalette } from "../block-global";

const ALLOWED_BLOCKS = ["blockons/accordion"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			labelTag,
			accordionDesign,
			accordionStyle,
			itemSpacing,
			itemLabelBgColor,
			labelFontSize,
			itemLabelFontColor,
			labelIconSize,
			itemLabelIconColor,
			itemContentBgColor,
		},
		setAttributes,
	} = props;

	// Block Props
	const blockProps = useBlockProps({
		className: `design-${accordionDesign} style-${accordionStyle}`,
	});

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Accordions Settings", "blockons")}
						initialOpen={true}
					>
						<SelectControl
							label={__("Label Element", "blockons")}
							value={labelTag}
							options={elementTags}
							onChange={(value) =>
								setAttributes({
									labelTag: value === undefined ? "h4" : value,
								})
							}
						/>
						<SelectControl
							label={__("Accordion Design", "blockons")}
							value={accordionDesign}
							options={[
								{ label: __("One", "blockons"), value: "one" },
								{ label: __("Two", "blockons"), value: "two" },
								{ label: __("Three", "blockons"), value: "three" },
								{ label: __("Four", "blockons"), value: "four" },
							]}
							onChange={(value) => {
								setAttributes({
									accordionDesign: value === undefined ? "one" : value,
								});
							}}
						/>
						<SelectControl
							label={__("Accordion Style", "blockons")}
							value={accordionStyle}
							options={[
								{
									label: __("Open Each Accordion Separately", "blockons"),
									value: "one",
								},
								{
									label: __("Open Accordion, Close Others", "blockons"),
									value: "two",
								},
							]}
							onChange={(value) => {
								setAttributes({
									accordionStyle: value === undefined ? "one" : value,
								});
							}}
							help={__(
								"This will animate nicely on the front-end. For loading and functionlaity, it does not animate in the back-end editor.",
								"blockons"
							)}
						/>
					</PanelBody>
					<PanelBody
						title={__("Accordions Design", "blockons")}
						initialOpen={false}
					>
						<p>{__("Accordion Spacing", "blockons")}</p>
						<RangeControl
							value={itemSpacing}
							onChange={(value) => setAttributes({ itemSpacing: value })}
							min={0}
							max={100}
						/>

						<h4>{__("Accordion Labels", "blockons")}</h4>
						<BlockonsColorpicker
							label={__("Background Color", "blockons")}
							value={itemLabelBgColor}
							onChange={(value) => setAttributes({ itemLabelBgColor: value })}
							paletteColors={colorPickerPalette}
						/>
						<p>{__("Font Size", "blockons")}</p>
						<RangeControl
							value={labelFontSize}
							onChange={(value) => setAttributes({ labelFontSize: value })}
							min={11}
							max={44}
						/>
						<BlockonsColorpicker
							label={__("Font Color", "blockons")}
							value={itemLabelFontColor}
							onChange={(value) => setAttributes({ itemLabelFontColor: value })}
							paletteColors={colorPickerPalette}
						/>
						<p>{__("Icon Size", "blockons")}</p>
						<RangeControl
							value={labelIconSize}
							onChange={(value) => setAttributes({ labelIconSize: value })}
							min={11}
							max={44}
						/>
						<BlockonsColorpicker
							label={__("Font Color", "blockons")}
							value={itemLabelIconColor}
							onChange={(value) => setAttributes({ itemLabelIconColor: value })}
							paletteColors={colorPickerPalette}
						/>

						<h4>{__("Accordion Content", "blockons")}</h4>
						<BlockonsColorpicker
							label={__("Background Color", "blockons")}
							value={itemContentBgColor}
							onChange={(value) => setAttributes({ itemContentBgColor: value })}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				renderAppender={InnerBlocks.ButtonBlockAppender}
			/>
		</div>
	);
};

export default Edit;
