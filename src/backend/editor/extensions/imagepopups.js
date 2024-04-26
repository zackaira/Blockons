import classnames from "classnames";
import BlockonsNote from "../../settings/components/UI/BlockonsNote";
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
const { createHigherOrderComponent } = wp.compose;

const isPremium = Boolean(blockonsEditorObj.isPremium);
const defaultOptions = blockonsEditorObj.blockonsOptions?.imagepopups;
const defaultOptionImgEnabled = Boolean(defaultOptions?.enabled);

const allowedImgPopupBlockTypes = ["core/image"];

/**
 * Add New Attributes to all blocks
 */
function blockonsAddImgPopupAttributes(settings, name) {
	const showOnImageBlock = allowedImgPopupBlockTypes.includes(name);

	if (!showOnImageBlock) {
		return settings;
	}

	const blockImgPopupAtts = {
		blockonsPopupEnabled: {
			type: "boolean",
			default: false,
		},
		blockonsPopupIcon: {
			type: "string",
			default: defaultOptions?.icon || "one",
		},
		blockonsPopupIconPos: {
			type: "string",
			default: defaultOptions?.iconpos || "topleft",
		},
		blockonsPopupIconColor: {
			type: "string",
			default: defaultOptions?.iconcolor || "dark",
		},
		blockonsGalleryId: {
			type: "string",
			default: "",
		},
	};

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
			const { InspectorControls } = wp.blockEditor;
			const { PanelBody, ToggleControl, SelectControl, TextControl } =
				wp.components;
			const {
				attributes: {
					blockonsPopupEnabled,
					blockonsPopupIcon,
					blockonsPopupIconPos,
					blockonsPopupIconColor,
					blockonsGalleryId,
				},
				setAttributes,
				name,
			} = props;
			const showOnImageBlock = allowedImgPopupBlockTypes.includes(name);

			if (!showOnImageBlock || !defaultOptionImgEnabled) {
				return <BlockEdit {...props} />;
			}

			return (
				<Fragment>
					<BlockEdit {...props} />

					<InspectorControls>
						<PanelBody
							title={__("Image Lightbox Settings", "blockons")}
							initialOpen={false}
						>
							<ToggleControl
								checked={blockonsPopupEnabled}
								label={__("Enable Image Lightbox", "blockons")}
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
										label={__("Icon Color", "blockons")}
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

									{isPremium && (
										<>
											<div className="blockons-divider"></div>
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

									<div className="blockons-divider"></div>
									<BlockonsNote
										imageUrl=""
										title={__("Using Image Popups", "blockons")}
										text={__(
											"Enable this option to show the image in a popup when clicked.",
											"blockons"
										)}
										docLink="https://blockons.com/documentation/block-visibility"
										noline
									/>
								</>
							)}
						</PanelBody>
					</InspectorControls>
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
					blockonsGalleryId,
				},
				className,
				name,
			} = props;
			const showOnImageBlock = allowedImgPopupBlockTypes.includes(name);

			if (!showOnImageBlock) {
				return <BlockListBlock {...props} />;
			}

			const newWrapperProps =
				defaultOptionImgEnabled && blockonsPopupEnabled
					? {
							"data-href": url,
							"data-title": caption || "",
							"data-popup": JSON.stringify({
								enabled: blockonsPopupEnabled || false,
								iconpos: blockonsPopupIconPos || "topleft",
							}),
							...(isPremium && blockonsGalleryId !== ""
								? { "data-gall": blockonsGalleryId }
								: {}),
					  }
					: {};

			const newClasses =
				defaultOptionImgEnabled && blockonsPopupEnabled
					? `blockons-venobox icon-${blockonsPopupIcon} ${blockonsPopupIconPos} ${blockonsPopupIconColor}`
					: className;
			const newClassnames = classnames(className, newClasses);

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
		blockonsGalleryId,
	} = attributes;
	const { name } = blockType;
	const showOnImageBlock = allowedImgPopupBlockTypes.includes(name);

	if (!showOnImageBlock || !defaultOptionImgEnabled) {
		return extraProps;
	}

	if (blockonsPopupEnabled) {
		const newClasses = `blockons-venobox icon-${blockonsPopupIcon} ${blockonsPopupIconPos} ${blockonsPopupIconColor}`;
		extraProps.className = classnames(extraProps.className, {
			[newClasses]: true,
		});

		extraProps["data-href"] = url;
		extraProps["data-title"] = caption || "";
		extraProps["data-popup"] = JSON.stringify({
			enabled: blockonsPopupEnabled || false,
			iconpos: blockonsPopupIconPos || "topleft",
		});

		if (isPremium && blockonsGalleryId !== "") {
			extraProps["data-gall"] = blockonsGalleryId;
		}
	}

	return extraProps;
};

/**
 * WP Editor Hooks
 */
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
