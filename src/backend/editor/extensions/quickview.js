const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody } = wp.components;
const { createHigherOrderComponent } = wp.compose;
import BlockonsNote from '../../settings/components/UI/BlockonsNote';

const wcAllowedProducts = [
	'woocommerce/handpicked-products',
	'woocommerce/product-best-sellers',
	'woocommerce/product-category',
	'woocommerce/product-new',
	'woocommerce/product-on-sale',
	'woocommerce/product-tag',
	'woocommerce/product-top-rated',
	'woocommerce/products',
];
const isPremium = Boolean(blockonsEditorObj.isPremium);
const qvEnabled =
	blockonsEditorObj?.blockonsOptions?.quickview?.enabled || false;

// 1. Create a Higher Order Component to add the controls in the Inspector Sidebar
const blockonsQuickviewSettings = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		const showOnBlock = wcAllowedProducts.includes(props.name);

		if (!isPremium || !qvEnabled || !showOnBlock)
			return <BlockEdit {...props} />; // Return if not the desired block

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title="Product Quick View" initialOpen={true}>
						<BlockonsNote
							text={__(
								'Configure Quick View for these products.',
								'blockons',
							)}
							upgradeLink={`${blockonsEditorObj.adminUrl}options-general.php?page=blockons-settings`}
							upgradeText={__('Go to Settings', 'blockons')}
							noline
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'blockonsQuickviewSettings');

/**
 * WP Editor Hooks
 */
addFilter(
	'editor.BlockEdit',
	'blockons/quickview-settings',
	blockonsQuickviewSettings,
);
