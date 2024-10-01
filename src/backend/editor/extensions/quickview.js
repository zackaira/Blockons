const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, ToggleControl, TextControl } = wp.components;
const { createHigherOrderComponent } = wp.compose;
import BlockonsNote from "../../settings/components/UI/BlockonsNote";

const wcAllowedProducts = [
	"woocommerce/handpicked-products",
	"woocommerce/product-best-sellers",
	"woocommerce/product-category",
	"woocommerce/product-new",
	"woocommerce/product-on-sale",
	"woocommerce/product-tag",
	"woocommerce/product-top-rated",
	"woocommerce/products",
];
const isPremium = Boolean(blockonsEditorObj.isPremium);
const quickview = blockonsEditorObj?.blockonsOptions?.quickview;

// 2. Create a Higher Order Component to add the controls in the Inspector Sidebar
const blockonsQuickviewSettings = createHigherOrderComponent((BlockEdit) => {
	return (props) => {
		if (
			!isPremium ||
			!quickview.enabled ||
			!wcAllowedProducts.includes(props.name)
		)
			return <BlockEdit {...props} />; // Return if not the desired block
		// const { attributes, setAttributes } = props;

		return (
			<Fragment>
				<BlockEdit {...props} />
				<InspectorControls>
					<PanelBody title="Product Quick View" initialOpen={true}>
						<BlockonsNote
							text={__("Configure Quick View for these products.", "blockons")}
							upgradeLink={`${blockonsEditorObj.adminUrl}options-general.php?page=blockons-settings`}
							upgradeText={__("Go to Settings", "blockons")}
							noline
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, "blockonsQuickviewSettings");

addFilter(
	"editor.BlockEdit",
	"blockons/quickview-settings",
	blockonsQuickviewSettings
);
