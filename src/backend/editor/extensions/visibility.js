import classnames from 'classnames';
import BlockonsNote from '../../settings/components/UI/BlockonsNote';
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { assign, merge } = window.lodash;
const { createHigherOrderComponent } = wp.compose;

const isPremium = Boolean(blockonsEditorObj.isPremium);
const visibilityEnabled =
	Boolean(blockonsEditorObj.blockonsOptions?.blockvisibility?.enabled) ||
	false;

const allowedVisibilityBlockTypes = [
	'core/group',
	'core/columns',
	'core/column',
];

/**
 * Add New Attributes to all blocks
 */
function blockonsAddVisibilityAttributes(settings, name) {
	if (!isPremium || !visibilityEnabled) return settings;

	// console.log({ settings, name });
	const showVisibilitySettings = allowedVisibilityBlockTypes.includes(name);

	const blockVisibilityAtts = showVisibilitySettings
		? {
				blockonsHideOnDesktop: {
					type: 'boolean',
					default: false,
				},
				blockonsHideOnTablet: {
					type: 'boolean',
					default: false,
				},
				blockonsHideOnMobile: {
					type: 'boolean',
					default: false,
				},
			}
		: {};

	return assign({}, settings, {
		attributes: merge(settings.attributes, blockVisibilityAtts),
	});
}
/**
 * Add New Controls to all blocks
 */
const blockonsAddInspectorVisibilityControls = createHigherOrderComponent(
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
					blockonsHideOnDesktop,
					blockonsHideOnTablet,
					blockonsHideOnMobile,
				},
				setAttributes,
				name,
			} = props;

			const showVisibilitySettings =
				allowedVisibilityBlockTypes.includes(name);

			if (!isPremium || !visibilityEnabled) {
				return <BlockEdit {...props} />;
			}

			return (
				<Fragment>
					<BlockEdit {...props} />

					{showVisibilitySettings && (
						<InspectorControls>
							<PanelBody
								title={__('Block Visibility', 'blockons')}
								initialOpen={false}
							>
								<BlockonsNote
									imageUrl=""
									title={__(
										'Using Block Visibility',
										'blockons',
									)}
									text={__(
										'Hide certain blocks by device screen size. For more information, click the link below.',
										'blockons',
									)}
									docLink="https://blockons.com/documentation/block-visibility-per-device/"
								/>

								<ToggleControl
									checked={blockonsHideOnDesktop}
									label={__('Hide on desktop', 'blockons')}
									onChange={(newValue) =>
										setAttributes({
											blockonsHideOnDesktop: newValue,
										})
									}
								/>
								<ToggleControl
									checked={blockonsHideOnTablet}
									label={__('Hide on tablet', 'blockons')}
									onChange={(newValue) =>
										setAttributes({
											blockonsHideOnTablet: newValue,
										})
									}
								/>
								<ToggleControl
									checked={blockonsHideOnMobile}
									label={__('Hide on mobile', 'blockons')}
									onChange={(newValue) =>
										setAttributes({
											blockonsHideOnMobile: newValue,
										})
									}
								/>
							</PanelBody>
						</InspectorControls>
					)}
				</Fragment>
			);
		};
	},
	'blockonsAddInspectorVisibilityControls',
);
/**
 * Add CSS Classes to the blocks in the editor
 */
const blockonsAddEditorVisibilityAttributes = createHigherOrderComponent(
	(BlockListBlock) => {
		return (props) => {
			const {
				attributes: {
					blockonsHideOnDesktop,
					blockonsHideOnTablet,
					blockonsHideOnMobile,
				},
				className,
				name,
			} = props;
			const showVisibilitySettings =
				allowedVisibilityBlockTypes.includes(name);

			if (!isPremium || !visibilityEnabled) {
				return <BlockListBlock {...props} />;
			}

			const newClassnames = showVisibilitySettings
				? classnames(
						className,
						`${blockonsHideOnDesktop ? 'hide-on-desktop' : ''} ${
							blockonsHideOnTablet ? 'hide-on-tablet' : ''
						} ${blockonsHideOnMobile ? 'hide-on-mobile' : ''}`,
					)
				: className;

			return <BlockListBlock {...props} className={newClassnames} />;
		};
	},
	'blockonsAddEditorVisibilityAttributes',
);
/**
 * Add Classes to the blocks on the Frontend
 */
const blockonsAddFrontendVisibilityAttributes = (
	extraProps,
	blockType,
	attributes,
) => {
	const {
		blockonsHideOnDesktop,
		blockonsHideOnTablet,
		blockonsHideOnMobile,
	} = attributes;
	const { name } = blockType;
	const showVisibilitySettings = allowedVisibilityBlockTypes.includes(name);

	if (!isPremium || !visibilityEnabled) {
		return extraProps;
	}

	if (showVisibilitySettings) {
		extraProps.className = classnames(extraProps.className, {
			'hide-on-desktop': blockonsHideOnDesktop,
			'hide-on-tablet': blockonsHideOnTablet,
			'hide-on-mobile': blockonsHideOnMobile,
		});
	}

	return extraProps;
};

/**
 * WP Editor Hooks
 */
addFilter(
	'blocks.registerBlockType',
	'blockons/block-visibility-attributes',
	blockonsAddVisibilityAttributes,
);
addFilter(
	'editor.BlockEdit',
	'blockons/block-visibility-controls',
	blockonsAddInspectorVisibilityControls,
);
addFilter(
	'blocks.getSaveContent.extraProps',
	'blockons/block-visibility-frontend-clases',
	blockonsAddFrontendVisibilityAttributes,
);
addFilter(
	'editor.BlockListBlock',
	'blockons/block-visibility-editor-clases',
	blockonsAddEditorVisibilityAttributes,
);
