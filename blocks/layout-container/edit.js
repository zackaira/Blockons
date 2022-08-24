/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	__experimentalBlockVariationPicker as BlockVariationPicker,
} from "@wordpress/block-editor";
import { PanelBody, ToggleControl, SelectControl } from "@wordpress/components";

const ALLOWED_BLOCKS = ["blockons/layout-block"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: { blahBlah },
		setAttributes,
	} = props;

	// Block Props
	const blockProps = useBlockProps({
		className: `name-${blahBlah}`,
	});

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Layout Container Settings", "blockons")}
						initialOpen={true}
					>
						EMPTY
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
