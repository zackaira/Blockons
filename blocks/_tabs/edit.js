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
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const ALLOWED_BLOCKS = ["blockons/tab"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: { alignment, tabLabelsArray, updateChild, sideTabLayout },
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `${alignment} ${isSelected ? "selected" : ""}`,
	});

	const buildTabLabelsArray = () => {
		//function gets child block attributes and saves as an array to parent attributes
		const parentBlockID = props.clientId;
		const { innerBlockCount } = useSelect((select) => ({
			innerBlockCount: select("core/block-editor").getBlockCount(parentBlockID),
		}));

		var tabLabels = [];

		for (let block = 0; block < innerBlockCount; block++) {
			let tabLabel = wp.data
				.select("core/block-editor")
				.getBlocks(parentBlockID)[block].attributes.tabLabel;
			tabLabels.push(tabLabel);
		}

		return tabLabels;
	};

	var labelsArray = buildTabLabelsArray();
	var labelLengthChange = labelsArray.length !== tabLabelsArray.length;

	if (labelLengthChange || updateChild) {
		setAttributes({ tabLabelsArray: labelsArray });
		setAttributes({ updateChild: false });
	}

	const onChangeTabLayout = (toggle) => {
		setAttributes({ sideTabLayout: toggle });
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody title={__("Tabs Settings", "blockons")} initialOpen={true}>
						<ToggleControl
							label="Switch to side tab layout"
							help={
								sideTabLayout ? "Side tab layout selected" : "Defoult layout"
							}
							checked={sideTabLayout}
							onChange={onChangeTabLayout}
						/>
					</PanelBody>
					<PanelBody
						title={__("Tabs Design", "blockons")}
						initialOpen={false}
					></PanelBody>
				</InspectorControls>
			)}
			<h2>Tabbed Layout Block</h2>

			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				renderAppender={InnerBlocks.ButtonBlockAppender}
			/>
		</div>
	);
};

export default Edit;
