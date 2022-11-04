import "./editor.css";
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = lodash;
import classnames from "classnames";
const { createHigherOrderComponent } = wp.compose;
const isPremium = Boolean(blockonsEditorObj.isPremium);

/**
 * Add New Attributes to all blocks
 */
function blockonsAddCustomAttributes(settings, name) {
	// console.log({ settings, name });

	// if (name === "core/button") {
	return assign({}, settings, {
		attributes: merge(settings.attributes, {
			hideOnDesktop: {
				type: "boolean",
				default: false,
			},
			hideOnTablet: {
				type: "boolean",
				default: false,
			},
			hideOnMobile: {
				type: "boolean",
				default: false,
			},
		}),
	});
	// }

	return settings;
}
/**
 * Add New Controls to all blocks
 */
const blockonsAddInspectorControls = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const { Fragment } = wp.element;
		const { InspectorControls } = wp.blockEditor;
		const { PanelBody, ToggleControl } = wp.components;
		const {
			attributes: { hideOnDesktop, hideOnTablet, hideOnMobile },
			setAttributes,
			name,
		} = props;
		//   if (name !== 'core/button') { return <BlockEdit {...props} /> }
		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody
						// icon="visibility"
						title={__("Blockons Visibility", "blockons")}
						initialOpen={false}
					>
						<ToggleControl
							checked={hideOnDesktop}
							label={__("Hide on desktop", "blockons")}
							onChange={() => setAttributes({ hideOnDesktop: !hideOnDesktop })}
						/>
						<ToggleControl
							checked={hideOnTablet}
							label={__("Hide on tablet", "blockons")}
							onChange={() => setAttributes({ hideOnTablet: !hideOnTablet })}
						/>
						<ToggleControl
							checked={hideOnMobile}
							label={__("Hide on mobile", "blockons")}
							onChange={() => setAttributes({ hideOnMobile: !hideOnMobile })}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "blockonsAddInspectorControls");
/**
 * Add CSS Classes to the blocks in the editor
 */
const blockonsAddFrontendClasses = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const {
				attributes: { hideOnDesktop, hideOnTablet, hideOnMobile },
				className,
				name,
			} = props;

			//   if (name !== 'core/button') {
			// 	return <BlockListBlock {...props} />;
			//   }

			return (
				<BlockListBlock
					{...props}
					className={classnames(
						className,
						`${hideOnDesktop ? "hide-on-desktop" : ""} ${
							hideOnTablet ? "hide-on-tablet" : ""
						} ${hideOnMobile ? "hide-on-mobile" : ""}`
					)}
					// wrapperProps={{ "data-teeeeest": "yesssssssss" }} // TO ADD AOS SCROLL ANIMATIONS
				/>
			);
		};
	},
	"blockonsAddFrontendClasses"
);
/**
 * Add Classes to the blocks on the Frontend
 */
const blockonsAddVisibilityClasses = (extraProps, blockType, attributes) => {
	const { hideOnDesktop, hideOnTablet, hideOnMobile } = attributes;

	extraProps.className = classnames(extraProps.className, {
		"hide-on-desktop": hideOnDesktop,
		"hide-on-tablet": hideOnTablet,
		"hide-on-mobile": hideOnMobile,
	});

	return extraProps;
};

/**
 * WP Editor Hooks
 */
if (isPremium) {
	addFilter(
		// blockonsAddCustomAttributes
		"blocks.registerBlockType",
		"blockons/block-visibility",
		blockonsAddCustomAttributes
	);
	addFilter(
		// blockonsAddInspectorControls
		"editor.BlockEdit",
		"blockons/block-visibility-controls",
		blockonsAddInspectorControls
	);
	addFilter(
		// blockonsAddFrontendClasses
		"editor.BlockListBlock",
		"blockons/block-visibility-editor-clases",
		blockonsAddFrontendClasses
	);
	addFilter(
		// blockonsAddVisibilityClasses
		"blocks.getSaveContent.extraProps",
		"blockons/block-visibility-frontend-clases",
		blockonsAddVisibilityClasses
	);
}
