import BlockonsNote from "../../settings/components/UI/BlockonsNote";
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
import classnames from "classnames";
const { createHigherOrderComponent } = wp.compose;

const isPremium = Boolean(blockonsEditorObj.isPremium);
const imgPopupEnabled =
	Boolean(blockonsEditorObj.blockonsOptions?.imagepopups?.enabled) || false;

const allowedImgPopupBlockTypes = [
	"core/image",
	// "core/gallery",
	// "blockons/image-gallery",
	// "blockons/image-carousel",
];

/**
 * Add New Attributes to all blocks
 */
function blockonsAddImgPopupAttributes(settings, name) {
	// console.log({ settings, name });
	const showImgPopupSettings = allowedImgPopupBlockTypes.includes(name);

	const blockImgPopupAtts =
		showImgPopupSettings && imgPopupEnabled === true
			? {
					blockonsPopupEnabled: {
						type: "boolean",
						default: false,
					},
					blockonsPopupIcon: {
						type: "string",
						default: "one",
					},
					blockonsPopupIconPos: {
						type: "string",
						default: "topleft",
					},
					blockonsPopupIconColor: {
						type: "string",
						default: "dark",
					},
					blockonsPopupTheme: {
						type: "string",
						default: "one",
					},
					blockonsCaptionPos: {
						type: "string",
						default: "top",
					},
					blockonsGalleryId: {
						type: "string",
						default: "",
					},
			  }
			: {};

	return assign({}, settings, {
		attributes: merge(settings.attributes, blockImgPopupAtts),
	});
}
/**
 * Add New Controls to all blocks
 */
const blockonsAddInspectorImgPopupControls = createHigherOrderComponent(
	(BlockEdit) => {
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
					blockonsPopupEnabled,
					blockonsPopupIcon,
					blockonsPopupIconPos,
					blockonsPopupIconColor,
					blockonsPopupTheme,
					blockonsCaptionPos,
					blockonsGalleryId,
				},
				setAttributes,
				name,
			} = props;

			const showImgPopupSettings = allowedImgPopupBlockTypes.includes(name);

			return (
				<Fragment>
					<BlockEdit {...props} />

					{imgPopupEnabled === true && showImgPopupSettings && (
						<InspectorControls>
							<PanelBody
								title={__("Image Lightbox Settings", "blockons")}
								initialOpen={false}
							>
								<BlockonsNote
									imageUrl=""
									title={__("Using Image Popups", "blockons")}
									text={__(
										"Enable this option to show the image in a popup when clicked.",
										"blockons"
									)}
									docLink="https://blockons.com/documentation/block-visibility"
								/>

								<ToggleControl
									checked={blockonsPopupEnabled}
									label={__("Enable Image Popup", "blockons")}
									onChange={(newValue) =>
										setAttributes({ blockonsPopupEnabled: newValue })
									}
								/>

								{blockonsPopupEnabled && (
									<>
										<div className="blockons-divider"></div>
										<SelectControl
											label={__("Icon", "blockons")}
											value={blockonsPopupIcon}
											options={[
												{ label: "Magnifying Glass", value: "one" },
												{ label: "Expand", value: "two" },
												{ label: "Diagonal Arrows", value: "three" },
												{ label: "Maximize", value: "four" },
												{ label: "Plus", value: "five" },
												{ label: "Cross Arrows", value: "six" },
											]}
											onChange={(newValue) =>
												setAttributes({
													blockonsPopupIcon: newValue,
												})
											}
											__nextHasNoMarginBottom
										/>
										<SelectControl
											label={__("Icon Position", "blockons")}
											value={blockonsPopupIconPos}
											options={[
												{ label: "Top Left", value: "topleft" },
												{ label: "Top Right", value: "topright" },
												{ label: "Bottom Left", value: "bottomleft" },
												{ label: "Bottom Right", value: "bottomright" },
												{ label: "Center Center", value: "center" },
											]}
											onChange={(newValue) =>
												setAttributes({
													blockonsPopupIconPos: newValue,
												})
											}
											__nextHasNoMarginBottom
										/>
										<SelectControl
											label={__("Icon Theme", "blockons")}
											value={blockonsPopupIconColor}
											options={[
												{ label: "Dark", value: "dark" },
												{ label: "Light", value: "light" },
											]}
											onChange={(newValue) =>
												setAttributes({
													blockonsPopupIconColor: newValue,
												})
											}
											__nextHasNoMarginBottom
										/>

										<div className="blockons-divider"></div>
										<SelectControl
											label={__("Popup Theme", "blockons")}
											value={blockonsPopupTheme}
											options={[
												{ label: "Dark", value: "one" },
												{ label: "Light", value: "two" },
											]}
											onChange={(newValue) =>
												setAttributes({
													blockonsPopupTheme: newValue,
												})
											}
											__nextHasNoMarginBottom
										/>

										{isPremium && (
											<>
												<SelectControl
													label={__("Popup Caption Position", "blockons")}
													value={blockonsCaptionPos}
													options={[
														{ label: "No Caption", value: "none" },
														{ label: "Top", value: "top" },
														{ label: "Bottom", value: "bottom" },
													]}
													onChange={(newValue) =>
														setAttributes({
															blockonsCaptionPos: newValue,
														})
													}
													__nextHasNoMarginBottom
												/>
												<TextControl
													label={__("Gallery ID", "blockons")}
													value={blockonsGalleryId}
													onChange={(newValue) =>
														setAttributes({
															blockonsGalleryId: newValue,
														})
													}
													help={__(
														"Enter a unique ID for the gallery. All images with the same ID will be grouped together.",
														"blockons"
													)}
												/>
											</>
										)}
									</>
								)}
							</PanelBody>
						</InspectorControls>
					)}
				</Fragment>
			);
		};
	},
	"blockonsAddInspectorImgPopupControls"
);
/**
 * Add CSS Classes to the blocks in the editor
 */
const blockonsAddEditorImgPopupAttributes = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const {
				attributes: {
					caption,
					url,
					blockonsPopupEnabled,
					blockonsPopupIcon,
					blockonsPopupIconPos,
					blockonsPopupIconColor,
					blockonsPopupTheme,
					blockonsCaptionPos,
					blockonsGalleryId,
				},
				className,
				name,
			} = props;
			const showImgPopupSettings = allowedImgPopupBlockTypes.includes(name);
			// console.log("attributes", showImgPopupSettings ? props : "");

			const newWrapperProps =
				imgPopupEnabled && showImgPopupSettings && blockonsPopupEnabled
					? {
							"data-href": url,
							"data-popup": JSON.stringify({
								theme: `theme-${isPremium ? blockonsPopupTheme : "one"}`,
								caption: caption,
								captionpos: isPremium ? blockonsCaptionPos : "none",
								infinite: isPremium ? blockonsGalleryId : false,
							}),
							...(isPremium ? { "data-gall": blockonsGalleryId } : {}),
					  }
					: {};

			const newClassnames =
				showImgPopupSettings && imgPopupEnabled === true && blockonsPopupEnabled
					? classnames(
							className,
							`blockons-venobox icon-${blockonsPopupIcon} ${blockonsPopupIconPos} ${blockonsPopupIconColor}`
					  )
					: className;

			return (
				<BlockListBlock
					{...props}
					className={newClassnames}
					wrapperProps={newWrapperProps}
				/>
			);
		};
	},
	"blockonsAddEditorImgPopupAttributes"
);
/**
 * Add Classes to the blocks on the Frontend
 */
const blockonsAddFrontendImgPopupAttributes = (
	extraProps,
	blockType,
	attributes
) => {
	const {
		caption,
		url,
		blockonsPopupEnabled,
		blockonsPopupIcon,
		blockonsPopupIconPos,
		blockonsPopupIconColor,
		blockonsPopupTheme,
		blockonsCaptionPos,
		blockonsGalleryId,
	} = attributes;
	const { name } = blockType;
	const showImgPopupSettings = allowedImgPopupBlockTypes.includes(name);

	// console.log("frontend-attribs", extraProps, blockType, attributes);

	if (imgPopupEnabled && showImgPopupSettings && blockonsPopupEnabled) {
		const newClasses = `blockons-venobox icon-${blockonsPopupIcon} ${blockonsPopupIconPos} ${blockonsPopupIconColor}`;

		extraProps.className = classnames(extraProps.className, {
			[newClasses]: true,
		});
		extraProps["data-href"] = url;
		extraProps["data-popup"] = JSON.stringify({
			theme: `theme-${isPremium ? blockonsPopupTheme : "one"}`,
			caption: caption,
			captionpos: isPremium ? blockonsCaptionPos : "none",
			infinite: isPremium ? blockonsGalleryId : false,
		});
		if (isPremium) {
			extraProps["data-gall"] = blockonsGalleryId;
		}
	}

	return extraProps;
};

/**
 * WP Editor Hooks
 */
if (imgPopupEnabled === true) {
	addFilter(
		"blocks.registerBlockType",
		"blockons/block-imagepopups-attributes",
		blockonsAddImgPopupAttributes
	);
	addFilter(
		"editor.BlockEdit",
		"blockons/block-imagepopups-controls",
		blockonsAddInspectorImgPopupControls
	);
	addFilter(
		"blocks.getSaveContent.extraProps",
		"blockons/block-imagepopups-frontend-classes",
		blockonsAddFrontendImgPopupAttributes
	);
	addFilter(
		"editor.BlockListBlock",
		"blockons/block-imagepopups-editor-classes",
		blockonsAddEditorImgPopupAttributes
	);
}
