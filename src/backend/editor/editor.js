import "./editor.css";
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
import classnames from "classnames";
const { createHigherOrderComponent } = wp.compose;
const isPremium = Boolean(blockonsEditorObj.isPremium);
const blockOptions = blockonsEditorObj.blockonsOptions;

/**
 * Add New Attributes to all blocks
 */
function blockonsAddCustomAttributes(settings, name) {
	// console.log({ settings, name });

	const blockVisibilityAtts =
		blockOptions.blockvisibility?.enabled === true
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
		blockOptions.blockanimation?.enabled === true
			? {
					blockonsEnableAnimation: {
						type: "boolean",
						default: false,
					},
					blockonsAnimation: {
						type: "string",
						default: "fade",
					},
					blockonsAnimationDirection: {
						type: "string",
						default: "-up",
					},
					blockonsAnimationDuration: {
						type: "number",
						default: 400,
					},
					blockonsAnimationDelay: {
						type: "number",
						default: 50,
					},
					blockonsAnimationOffset: {
						type: "number",
						default: 120,
					},
					blockonsAnimationOnce: {
						type: "boolean",
						default: false,
					},
					blockonsAnimationMirror: {
						type: "boolean",
						default: false,
					},
			  }
			: {};

	const newAttributes = {
		...blockVisibilityAtts,
		...blockAnimationAtts,
	};

	return assign({}, settings, {
		attributes: merge(settings.attributes, newAttributes),
	});

	// return settings;
}
/**
 * Add New Controls to all blocks
 */
const blockonsAddInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { Fragment } = wp.element;
		const { InspectorControls } = wp.blockEditor;
		const { PanelBody, ToggleControl, RangeControl, SelectControl } =
			wp.components;
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
			setAttributes,
			name,
		} = props;

		return (
			<Fragment>
				<BlockEdit {...props} />

				{blockOptions.blockvisibility?.enabled === true && (
					<InspectorControls>
						<PanelBody
							title={__("Block Visibility", "blockons")}
							initialOpen={false}
						>
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

				{blockOptions.blockanimation?.enabled === true && (
					<InspectorControls>
						<PanelBody
							title={__("Block Animations", "blockons")}
							initialOpen={false}
						>
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
										value={blockonsAnimationDuration}
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
										value={blockonsAnimationDelay}
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
										value={blockonsAnimationOffset}
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

			const newClassnames =
				isPremium && blockOptions.blockvisibility?.enabled === true
					? classnames(
							className,
							`${blockonsHideOnDesktop ? "hide-on-desktop" : ""} ${
								blockonsHideOnTablet ? "hide-on-tablet" : ""
							} ${blockonsHideOnMobile ? "hide-on-mobile" : ""}`
					  )
					: className;

			const newWrapperProps =
				isPremium && blockonsEnableAnimation && blockonsEnableAnimation === true
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

	if (blockOptions.blockvisibility?.enabled === true) {
		extraProps.className = classnames(extraProps.className, {
			"hide-on-desktop": blockonsHideOnDesktop,
			"hide-on-tablet": blockonsHideOnTablet,
			"hide-on-mobile": blockonsHideOnMobile,
		});
	}

	if (
		blockOptions.blockanimation?.enabled === true &&
		blockonsEnableAnimation
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
