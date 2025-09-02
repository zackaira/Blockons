import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

const ALLOWED_BLOCKS = ["blockons/accordion"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: { accordionDesign, iconFirst, closeAll, centeredLabel },
		setAttributes,
	} = props;

	// Block Props
	const blockProps = useBlockProps({
		className: `design-${accordionDesign} ${closeAll ? "close-all" : ""} ${
			iconFirst ? "icon-start" : "icon-end"
		} ${centeredLabel ? "centered" : ""}`,
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
							label={__("Accordion Design", "blockons")}
							value={accordionDesign}
							options={[
								{ label: __("Plain", "blockons"), value: "one" },
								{ label: __("Underlined", "blockons"), value: "two" },
								{ label: __("Outlined", "blockons"), value: "three" },
								{ label: __("Side Line", "blockons"), value: "four" },
							]}
							onChange={(newValue) => {
								setAttributes({
									accordionDesign: newValue === undefined ? "one" : newValue,
								});
							}}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						<ToggleControl
							label={__("Icon First", "blockons")}
							checked={iconFirst}
							onChange={(newValue) => {
								setAttributes({ iconFirst: newValue });
							}}
							__nextHasNoMarginBottom={true}
						/>

						<ToggleControl
							label={__("Centered Label", "blockons")}
							checked={centeredLabel}
							onChange={(newValue) => {
								setAttributes({ centeredLabel: newValue });
							}}
							__nextHasNoMarginBottom={true}
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
							__nextHasNoMarginBottom={true}
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
