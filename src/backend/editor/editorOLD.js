import BlockonsNote from "../../../assets/blocks/notes/BlockonsNote";
import "./editor.css";
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
import classnames from "classnames";
const { createHigherOrderComponent } = wp.compose;

const isPremium = Boolean(blockonsEditorObj.isPremium);
const addVisibility =
	blockonsEditorObj.blockonsOptions?.blockvisibility?.enabled || false;
const addAnimations =
	blockonsEditorObj.blockonsOptions?.blockanimation?.enabled || false;
const animationsSettings = blockonsEditorObj.blockonsOptions?.blockanimation;

const allowedBlockTypes = ["core/group", "core/columns", "core/column"];
const allowedVisibilityBlockTypes = [...allowedBlockTypes, "core/cover"];
const allowedAnimationBlockTypes = [...allowedBlockTypes];

const allowedTooltipBlockTypes = ["core/paragraph", "core/heading"];

/**
 * Add New Attributes to all blocks
 */
function blockonsAddCustomAttributes(settings, name) {
	// console.log({ settings, name });
	const showVisibilitySettings = allowedVisibilityBlockTypes.includes(name);
	const showAnimationSettings = allowedAnimationBlockTypes.includes(name);
	const showTooltipSettings = allowedTooltipBlockTypes.includes(name);

	const blockVisibilityAtts =
		showVisibilitySettings && addVisibility === true
			? {
					blockonsHideOnDesktop: {
						type: "boolean",
						default: false,
					},
					blockonsHideOnTablet: {
						type: "boolean",
						default: false,
					},
					blockonsHideOnMobile: {
						type: "boolean",
						default: false,
					},
			  }
			: {};

	const blockAnimationAtts =
		showAnimationSettings && addAnimations === true
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

	const tooltipAtts = showTooltipSettings
		? {
				blockonsEnableTooltip: {
					type: "boolean",
					default: false,
				},
				blockonsTooltipHeading: {
					type: "string",
					default: "",
				},
				blockonsTooltip: {
					type: "string",
					default: "",
				},
		  }
		: {};

	const newAttributes = {
		...blockVisibilityAtts,
		...blockAnimationAtts,
		...tooltipAtts,
	};

	return assign({}, settings, {
		attributes: merge(settings.attributes, newAttributes),
	});
}
/**
 * Add New Controls to all blocks
 */
const blockonsAddInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { Fragment } = wp.element;
		const { InspectorControls, BlockControls } = wp.blockEditor;
		const {
			PanelBody,
			ToggleControl,
			RangeControl,
			SelectControl,
			TextControl,
			ToolbarGroup,
			DropdownMenu,
		} = wp.components;
		const {
			attributes: {
				blockonsHideOnDesktop,
				blockonsHideOnTablet,
				blockonsHideOnMobile,
				blockonsEnableAnimation,
				blockonsAnimation,
				blockonsAnimationDirection,
				blockonsAnimationDuration,
				blockonsAnimationDelay,
				blockonsAnimationOffset,
				blockonsAnimationOnce,
				blockonsAnimationMirror,
				blockonsEnableTooltip,
				blockonsTooltipHeading,
				blockonsTooltip,
			},
			setAttributes,
			name,
		} = props;

		const showVisibilitySettings = allowedVisibilityBlockTypes.includes(name);
		const showAnimationSettings = allowedAnimationBlockTypes.includes(name);
		const showTooltipSettings = allowedTooltipBlockTypes.includes(name);

		const isTextHighlighted = isSelectedTextHighlighted();

		return (
			<Fragment>
				<BlockEdit {...props} />

				{addVisibility === true && showVisibilitySettings && (
					<InspectorControls>
						<PanelBody
							title={__("Block Visibility", "blockons")}
							initialOpen={false}
						>
							<BlockonsNote
								imageUrl=""
								title={__("Using Block Visibility", "blockons")}
								text={__(
									"Hide certain blocks by device screen size. For more information, click the link below.",
									"blockons"
								)}
								link="https://blockons.com/documentation/block-visibility"
							/>

							<ToggleControl
								checked={blockonsHideOnDesktop}
								label={__("Hide on desktop", "blockons")}
								onChange={(newValue) =>
									setAttributes({ blockonsHideOnDesktop: newValue })
								}
							/>
							<ToggleControl
								checked={blockonsHideOnTablet}
								label={__("Hide on tablet", "blockons")}
								onChange={(newValue) =>
									setAttributes({ blockonsHideOnTablet: newValue })
								}
							/>
							<ToggleControl
								checked={blockonsHideOnMobile}
								label={__("Hide on mobile", "blockons")}
								onChange={(newValue) =>
									setAttributes({ blockonsHideOnMobile: newValue })
								}
							/>
						</PanelBody>
					</InspectorControls>
				)}

				{addAnimations === true && showAnimationSettings && (
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

				{showTooltipSettings && (
					<BlockControls group="block">
						<ToolbarGroup>
							<DropdownMenu
								icon={<span class="dashicons dashicons-info"></span>}
								label={__("Add a ToolTip", "blockons")}
							>
								{({ onClose }) => (
									<>
										{isTextHighlighted ? (
											<>
												<ToggleControl
													checked={blockonsEnableTooltip}
													label={__("Enable ToolTip", "blockons")}
													onChange={(newValue) => {
														setAttributes({ blockonsEnableTooltip: newValue });
													}}
												/>
												{blockonsEnableTooltip && (
													<>
														<TextControl
															label={__("Tooltip Heading", "blockons")}
															value={blockonsTooltipHeading}
															onChange={(newValue) => {
																setAttributes({
																	blockonsTooltipHeading: newValue,
																});
															}}
														/>
														<TextControl
															label={__("Tooltip", "blockons")}
															value={blockonsTooltip}
															onChange={(newValue) => {
																setAttributes({ blockonsTooltip: newValue });
															}}
														/>
													</>
												)}
											</>
										) : (
											<p>
												{__(
													"Please highlight some text to use the ToolTip",
													"blockons"
												)}
											</p>
										)}
									</>
								)}
							</DropdownMenu>
						</ToolbarGroup>
					</BlockControls>
				)}
			</Fragment>
		);
	};
}, "blockonsAddInspectorControls");
/**
 * Add CSS Classes to the blocks in the editor
 */
const blockonsAddEditorNewAttributes = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const {
				attributes: {
					blockonsHideOnDesktop,
					blockonsHideOnTablet,
					blockonsHideOnMobile,
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
			const showVisibilitySettings = allowedVisibilityBlockTypes.includes(name);
			const showAnimationSettings = allowedAnimationBlockTypes.includes(name);

			const newClassnames =
				isPremium && showVisibilitySettings && addVisibility === true
					? classnames(
							className,
							`${blockonsHideOnDesktop ? "hide-on-desktop" : ""} ${
								blockonsHideOnTablet ? "hide-on-tablet" : ""
							} ${blockonsHideOnMobile ? "hide-on-mobile" : ""}`
					  )
					: className;

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
					className={newClassnames}
					wrapperProps={newWrapperProps} // ANIMATIONS
				/>
			);
		};
	},
	"blockonsAddEditorNewAttributes"
);
/**
 * Add Classes to the blocks on the Frontend
 */
const blockonsAddFrontendNewAttributes = (
	extraProps,
	blockType,
	attributes
) => {
	const {
		blockonsHideOnDesktop,
		blockonsHideOnTablet,
		blockonsHideOnMobile,
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
	const showVisibilitySettings = allowedVisibilityBlockTypes.includes(name);
	const showAnimationSettings = allowedAnimationBlockTypes.includes(name);

	if (showVisibilitySettings && addVisibility === true) {
		extraProps.className = classnames(extraProps.className, {
			"hide-on-desktop": blockonsHideOnDesktop,
			"hide-on-tablet": blockonsHideOnTablet,
			"hide-on-mobile": blockonsHideOnMobile,
		});
	}

	if (
		showAnimationSettings &&
		blockonsEnableAnimation &&
		addAnimations === true
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
if (isPremium) {
	addFilter(
		"blocks.registerBlockType",
		"blockons/block-newsettings",
		blockonsAddCustomAttributes
	);
	addFilter(
		"editor.BlockEdit",
		"blockons/block-newsettings-controls",
		blockonsAddInspectorControls
	);
	addFilter(
		"blocks.getSaveContent.extraProps",
		"blockons/block-newsettings-frontend-clases",
		blockonsAddFrontendNewAttributes
	);
	addFilter(
		"editor.BlockListBlock",
		"blockons/block-newsettings-editor-clases",
		blockonsAddEditorNewAttributes
	);
}
