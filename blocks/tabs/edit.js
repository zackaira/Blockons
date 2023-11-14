import { useState, useEffect } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	TextControl,
	Button,
} from "@wordpress/components";

const ALLOWED_BLOCKS = ["blockons/tab"];

const Edit = (props) => {
	const {
		isSelected,
		attributes: { sideTabLayout },
		setAttributes,
		clientId,
	} = props;

	const [activeTab, setActiveTab] = useState(0);
	const { moveBlockToPosition, selectBlock, updateBlockAttributes } =
		useDispatch(blockEditorStore);

	const blockProps = useBlockProps({
		className: `tab-${clientId} ${sideTabLayout ? "side-layout" : ""}`,
	});

	const innerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlock(clientId).innerBlocks,
		[clientId]
	);

	useEffect(() => {
		if (innerBlocks.length && activeTab >= innerBlocks.length) {
			setActiveTab(0);
		}
	}, [innerBlocks.length, activeTab]);

	const onChangeTabLayout = (toggle) => {
		setAttributes({ sideTabLayout: toggle });
	};

	const moveTab = (currentIndex, newIndex) => {
		if (newIndex >= 0 && newIndex < innerBlocks.length) {
			setTimeout(() => {
				moveBlockToPosition(
					innerBlocks[currentIndex].clientId,
					clientId,
					clientId,
					newIndex
				);
			}, 300);
			setActiveTab(newIndex);
			selectBlock(innerBlocks[currentIndex].clientId);
		}
	};

	const selectTab = (index) => {
		setActiveTab(index);
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody title={__("Tabs Settings", "blockons")} initialOpen={true}>
						<ToggleControl
							label={__("Switch to side tab layout", "blockons")}
							checked={sideTabLayout}
							onChange={onChangeTabLayout}
						/>
					</PanelBody>
				</InspectorControls>
			)}

			<div className="blockons-tabs">
				{innerBlocks.map((block, index) => (
					<div
						key={index}
						className={`blockons-tab ${
							index === activeTab ? "active" : ""
						} tab-${block.clientId}}`}
						onClick={() => selectTab(index)}
					>
						<TextControl
							value={block.attributes.tabLabel}
							placeholder="Tab Title"
							className="blockons-tab-label"
							onChange={(newTitle) =>
								updateBlockAttributes(block.clientId, { tabLabel: newTitle })
							}
						/>
						<div className="blockons-tab-controls">
							<Button
								isSmall
								onClick={() => moveTab(index, index - 1)}
								disabled={index === 0}
							>
								←
							</Button>
							<Button
								isSmall
								onClick={() => moveTab(index, index + 1)}
								disabled={index === innerBlocks.length - 1}
							>
								→
							</Button>
						</div>
					</div>
				))}
			</div>
			<div className="blockons-tabs-innerblocks">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					renderAppender={InnerBlocks.ButtonBlockAppender}
					templateLock={false}
				/>
			</div>
		</div>
	);
};

export default Edit;
