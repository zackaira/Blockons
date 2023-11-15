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
	const {
		moveBlockToPosition,
		selectBlock,
		updateBlockAttributes,
		removeBlock,
	} = useDispatch(blockEditorStore);

	const blockProps = useBlockProps({
		className: `${sideTabLayout ? "side-layout" : ""}`,
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

	useEffect(() => {
		const selectedTab = document.querySelector(".blockons-tab.active");

		if (selectedTab) {
			const selectedTabId = "content-" + selectedTab.id.slice(4);

			if (innerBlocks.length > 1) {
				const allContent = document.querySelectorAll(".blockons-content");
				allContent.forEach((content) => {
					content.style.display = "none";
				});
				const selectedTabContent = document.querySelector(`.${selectedTabId}`);
				selectedTabContent.style.display = "block";
			} else {
				const allContent = document.querySelectorAll(".blockons-content");
				allContent.forEach((content) => {
					content.style.display = "block";
				});
			}
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
				selectTab(newIndex);
			}, 300);
			selectBlock(innerBlocks[currentIndex].clientId);
		}
	};

	const selectTab = (index) => {
		setActiveTab(index);
	};

	const deleteTab = (index) => {
		if (innerBlocks[index]) {
			removeBlock(innerBlocks[index].clientId);
		}
	};

	const CustomAppender = ({ buttonText, clientId }) => {
		const { insertBlock } = useDispatch(blockEditorStore);

		const addBlock = () => {
			const block = wp.blocks.createBlock("blockons/tab");
			insertBlock(block, undefined, clientId);
		};

		return (
			<Button className="blockons-new-button" onClick={addBlock}>
				{buttonText || "+"}
			</Button>
		);
	};

	console.log(innerBlocks);

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
						className={`blockons-tab ${index === activeTab ? "active" : ""}`}
						id={`tab-${block.clientId}`}
						onClick={() => selectTab(index)}
					>
						<TextControl
							value={block.attributes.tabLabel}
							// value={block.clientId}
							placeholder="Tab Title"
							className="blockons-tab-label"
							onChange={(newTitle) =>
								updateBlockAttributes(block.clientId, { tabLabel: newTitle })
							}
						/>
						{innerBlocks.length > 0 && (
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
								{innerBlocks.length > 1 && (
									<Button isSmall onClick={() => deleteTab(index)}>
										x
									</Button>
								)}
							</div>
						)}
					</div>
				))}
				{isSelected && innerBlocks.length > 0 && (
					<CustomAppender clientId={clientId} />
				)}
			</div>
			<div
				className={`blockons-tabs-innerblocks ${
					innerBlocks.length > 0 ? "blockons-nbb" : ""
				}`}
			>
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					{...(innerBlocks?.length < 1
						? {
								renderAppender: () => (
									<CustomAppender
										buttonText={__("Add A Tab", "blockons")}
										clientId={clientId}
									/>
								),
						  }
						: { renderAppender: false })}
					templateLock={false}
				/>
			</div>
		</div>
	);
};

export default Edit;
