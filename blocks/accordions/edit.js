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
		attributes: { labelTag, accordionDesign, closeAll },
		setAttributes,
	} = props;

	// Block Props
	const blockProps = useBlockProps({
		className: `design-${accordionDesign} ${closeAll ? "close-all" : ""}`,
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

						<ToggleControl
							label={__("Only 1 Accordion open at a time", "blockons")}
							checked={closeAll}
							help={__(
								"Close all other accordions when one is clicked open. This will only work on the front-end and not in the editor.",
								"blockons"
							)}
							onChange={(newValue) => {
								setAttributes({ closeAll: newValue });
							}}
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<div className="accordions-wrap">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					renderAppender={InnerBlocks.ButtonBlockAppender}
				/>
			</div>
		</div>
	);
};

export default Edit;
