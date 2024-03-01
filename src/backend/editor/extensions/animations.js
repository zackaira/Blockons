import BlockonsNote from "../../../../assets/blocks/notes/BlockonsNote";
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
const { createHigherOrderComponent } = wp.compose;

const isPremium = Boolean(blockonsEditorObj.isPremium);
const animationsEnabled =
	Boolean(blockonsEditorObj.blockonsOptions?.blockanimation?.enabled) || false;
const animationsSettings = blockonsEditorObj.blockonsOptions?.blockanimation;

const allowedAnimationBlockTypes = [
	"core/group",
	"core/columns",
	"core/column",
];

/**
 * Add New Attributes to all blocks
 */
function blockonsAddAnimationAttributes(settings, name) {
	// console.log({ settings, name });
	const showAnimationSettings = allowedAnimationBlockTypes.includes(name);

	const blockAnimationAtts =
		showAnimationSettings && animationsEnabled === true
			? {
					blockonsEnableAnimation: {
						type: "boolean",
						default: false,
					},
					blockonsAnimation: {
						type: "string",
						default: animationsSettings?.default_style || "fade",
					},
					blockonsAnimationDirection: {
						type: "string",
						default: animationsSettings?.default_direction || "-up",
					},
					blockonsAnimationDuration: {
						type: "number",
						default: animationsSettings?.default_duration || 850,
					},
					blockonsAnimationDelay: {
						type: "number",
						default: animationsSettings?.default_delay || 50,
					},
					blockonsAnimationOffset: {
						type: "number",
						default: animationsSettings?.default_offset || 80,
					},
					blockonsAnimationOnce: {
						type: "boolean",
						default: animationsSettings?.default_animate_once || false,
					},
					blockonsAnimationMirror: {
						type: "boolean",
						default: animationsSettings?.default_mirror || false,
					},
			  }
			: {};

	return assign({}, settings, {
		attributes: merge(settings.attributes, blockAnimationAtts),
	});
}
/**
 * Add New Controls to all blocks
 */
const blockonsAddAnimationInspectorControls = createHigherOrderComponent(
	(BlockEdit) => {
		return (props) => {
			const { Fragment } = wp.element;
			const { InspectorControls, BlockControls } = wp.blockEditor;
			const { PanelBody, ToggleControl, RangeControl, SelectControl } =
				wp.components;
			const {
				attributes: {
					blockonsEnableAnimation,
					blockonsAnimation,
					blockonsAnimationDirection,
					blockonsAnimationDuration,
					blockonsAnimationDelay,
					blockonsAnimationOffset,
					blockonsAnimationOnce,
					blockonsAnimationMirror,
				},
				setAttributes,
				name,
			} = props;

			const showAnimationSettings = allowedAnimationBlockTypes.includes(name);

			return (
				<Fragment>
					<BlockEdit {...props} />

					{animationsEnabled === true && showAnimationSettings && (
						<InspectorControls>
							<PanelBody
								title={__("Block Animations", "blockons")}
								initialOpen={false}
							>
								<BlockonsNote
									imageUrl=""
									title={__("Using Block Animations", "blockons")}
									text={__(
										"Add scroll animations for layout blocks in your WordPress editor. For more information, click the link below.",
										"blockons"
									)}
									link="https://blockons.com/documentation/block-scroll-animations"
								/>

								<ToggleControl
									checked={blockonsEnableAnimation}
									label={__("Enable Block Animations", "blockons")}
									onChange={(newValue) => {
										setAttributes({ blockonsEnableAnimation: newValue });
									}}
								/>

								{blockonsEnableAnimation && (
									<>
										<SelectControl
											label="Style"
											value={blockonsAnimation}
											options={[
												{ label: "Fade", value: "fade" },
												{ label: "Slide", value: "slide" },
												{ label: "Flip", value: "flip" },
												{ label: "Zoom In", value: "zoom-in" },
												{ label: "Zoom Out", value: "zoom-out" },
											]}
											onChange={(newAnimationStyle) => {
												setAttributes({
													blockonsAnimation: newAnimationStyle,
												});
											}}
											__nextHasNoMarginBottom
										/>
										<SelectControl
											label="Direction"
											value={blockonsAnimationDirection}
											options={[
												{ label: "Up", value: "-up" },
												{ label: "Down", value: "-down" },
												{ label: "Left", value: "-left" },
												{ label: "Right", value: "-right" },
												// Zoom Extra Options
												...(blockonsAnimation === "zoom-in" ||
												blockonsAnimation === "zoom-out"
													? [{ label: "None", value: "" }]
													: []),
												// Fade Extra Options
												...(blockonsAnimation === "fade"
													? [
															{ label: "Up Right", value: "-up-right" },
															{ label: "Up Left", value: "-up-left" },
															{ label: "Down Right", value: "-down-right" },
															{ label: "Down Left", value: "-down-left" },
													  ]
													: []),
											]}
											onChange={(newAnimationDirection) => {
												setAttributes({
													blockonsAnimationDirection: newAnimationDirection,
												});
											}}
											__nextHasNoMarginBottom
										/>
										<RangeControl
											label={__("Duration", "blockons")}
											value={parseInt(blockonsAnimationDuration)}
											onChange={(newDurationValue) =>
												setAttributes({
													blockonsAnimationDuration: parseInt(newDurationValue),
												})
											}
											min={50}
											max={3000}
											step={50}
											help={__(
												"How long the animation takes - 1000 = 1 second",
												"blockons"
											)}
										/>
										<RangeControl
											label={__("Delay", "blockons")}
											value={parseInt(blockonsAnimationDelay)}
											onChange={(newDelayValue) =>
												setAttributes({
													blockonsAnimationDelay: parseInt(newDelayValue),
												})
											}
											min={0}
											max={3000}
											step={50}
											help={__(
												"The milliseconds before the animation starts - 1000 = 1 second",
												"blockons"
											)}
										/>
										<RangeControl
											label={__("Offset", "blockons")}
											value={parseInt(blockonsAnimationOffset)}
											onChange={(newOffsetValue) =>
												setAttributes({
													blockonsAnimationOffset: parseInt(newOffsetValue),
												})
											}
											min={0}
											max={600}
											step={5}
											help={__(
												"The offset in pixels from the bottom of the window",
												"blockons"
											)}
										/>
										<ToggleControl
											checked={blockonsAnimationOnce}
											label={__("Animate Once", "blockons")}
											onChange={(newValue) => {
												setAttributes({ blockonsAnimationOnce: newValue });
											}}
											help={__(
												"Whether animation should happen only once - while scrolling down",
												"blockons"
											)}
										/>
										<ToggleControl
											checked={blockonsAnimationMirror}
											label={__("Mirror Animations", "blockons")}
											onChange={(newValue) => {
												setAttributes({ blockonsAnimationMirror: newValue });
											}}
											help={__(
												"Whether elements should animate out while scrolling past them",
												"blockons"
											)}
										/>
									</>
								)}
							</PanelBody>
						</InspectorControls>
					)}
				</Fragment>
			);
		};
	},
	"blockonsAddAnimationInspectorControls"
);
/**
 * Add CSS Classes to the blocks in the editor
 */
const blockonsAddEditorAnimationAttributes = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const {
				attributes: {
					blockonsEnableAnimation,
					blockonsAnimation,
					blockonsAnimationDirection,
					blockonsAnimationDuration,
					blockonsAnimationDelay,
					blockonsAnimationOffset,
					blockonsAnimationOnce,
					blockonsAnimationMirror,
				},
				className,
				name,
			} = props;
			const showAnimationSettings = allowedAnimationBlockTypes.includes(name);

			const newWrapperProps =
				isPremium && showAnimationSettings && blockonsEnableAnimation === true
					? {
							"data-aos": `${blockonsAnimation}${blockonsAnimationDirection}`,
							"data-aos-easing": "ease-in-out",
							"data-aos-duration": blockonsAnimationDuration,
							"data-aos-delay": blockonsAnimationDelay,
							"data-aos-offset": blockonsAnimationOffset,
							"data-aos-once": blockonsAnimationOnce,
							"data-aos-mirror": blockonsAnimationMirror,
					  }
					: {};

			return (
				<BlockListBlock
					{...props}
					wrapperProps={newWrapperProps} // ANIMATIONS
				/>
			);
		};
	},
	"blockonsAddEditorAnimationAttributes"
);
/**
 * Add Classes to the blocks on the Frontend
 */
const blockonsAddFrontendAnimationAttributes = (
	extraProps,
	blockType,
	attributes
) => {
	const {
		blockonsEnableAnimation,
		blockonsAnimation,
		blockonsAnimationDirection,
		blockonsAnimationDuration,
		blockonsAnimationDelay,
		blockonsAnimationOffset,
		blockonsAnimationOnce,
		blockonsAnimationMirror,
	} = attributes;
	const { name } = blockType;
	const showAnimationSettings = allowedAnimationBlockTypes.includes(name);

	if (
		showAnimationSettings &&
		blockonsEnableAnimation &&
		animationsEnabled === true
	) {
		extraProps[
			"data-aos"
		] = `${blockonsAnimation}${blockonsAnimationDirection}`;
		extraProps["data-aos-easing"] = "ease-in-out";
		extraProps["data-aos-duration"] = blockonsAnimationDuration;
		extraProps["data-aos-delay"] = blockonsAnimationDelay;
		extraProps["data-aos-offset"] = blockonsAnimationOffset;
		extraProps["data-aos-once"] = blockonsAnimationOnce;
		extraProps["data-aos-mirror"] = blockonsAnimationMirror;
	}

	return extraProps;
};

/**
 * WP Editor Hooks
 */
if (isPremium && animationsEnabled === true) {
	addFilter(
		"blocks.registerBlockType",
		"blockons/block-animations-attributes",
		blockonsAddAnimationAttributes
	);
	addFilter(
		"editor.BlockEdit",
		"blockons/block-animations-controls",
		blockonsAddAnimationInspectorControls
	);
	addFilter(
		"blocks.getSaveContent.extraProps",
		"blockons/block-animations-frontend-classes",
		blockonsAddFrontendAnimationAttributes
	);
	addFilter(
		"editor.BlockListBlock",
		"blockons/block-animations-editor-classes",
		blockonsAddEditorAnimationAttributes
	);
}
