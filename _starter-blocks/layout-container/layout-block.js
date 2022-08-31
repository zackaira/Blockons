import {
	RichText,
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
import {
	Dropdown,
	TextControl,
	ToggleControl,
	PanelBody,
	SelectControl,
	RangeControl,
} from "@wordpress/components";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { elementTags, colorPickerPalette } from "../block-global";

// Registering Child Innerblock for the Accordionbed Content block
registerBlockType("blockons/layout-block", {
	title: __("layout-block", "blockons"),
	icon: "welcome-add-page",
	parent: ["blockons/layout-block"],
	// category: "design",
	attributes: {
		labelTag: {
			type: "string",
			default: "h4",
		},
	},
	/**
	 *
	 * Edit function for Child Accordion Block
	 *
	 */
	edit: (props) => {
		const {
			isSelected,
			className,
			attributes: { labelTag },
			setAttributes,
		} = props;

		const DEFAULT = [["core/paragraph", {}]];

		return (
			<div className={`custom-classes`}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__("Accordion Settings", "blockons")}
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
						</PanelBody>
						<PanelBody
							title={__("Accordion Design", "blockons")}
							initialOpen={false}
						>
							EMPTY
						</PanelBody>
					</InspectorControls>
				)}
				<div className={`layout-block-wrap`}>
					<InnerBlocks renderAppender={InnerBlocks.ButtonBlockAppender} />
				</div>
			</div>
		);
	},
	/**
	 *
	 * Save function for Child Accordion Block
	 *
	 */
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `custom-classes`,
		});

		return (
			<div {...blockProps}>
				<div className={`layout-block-wrap`}>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
