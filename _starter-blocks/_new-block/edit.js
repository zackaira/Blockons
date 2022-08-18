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
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
} from "@wordpress/components";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: { alignment, title, subText },
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Marketing Button Settings", "blockons")}
						initialOpen={true}
					>
						empty
					</PanelBody>
					<PanelBody
						title={__("Marketing Button Design", "blockons")}
						initialOpen={false}
					>
						empty
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div className={`blockons-marketing-button-block`}>
				<div>
					<RichText
						tagName={"h4"}
						placeholder={title}
						keepPlaceholderOnFocus
						value={title}
						className="blockons-marketing-button-title"
						onChange={(value) => setAttributes({ title: value })}
					/>
					<RichText
						tagName={"p"}
						placeholder={subText}
						keepPlaceholderOnFocus
						value={subText}
						className="blockons-marketing-button-text"
						onChange={(value) => setAttributes({ subText: value })}
					/>
				</div>
			</div>
		</div>
	);
};

export default Edit;
