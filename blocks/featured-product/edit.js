/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import axios from "axios";
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	BaseControl,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
} from "@wordpress/components";
import GetPostsSelect from "../_components/GetPostsSelect";
import BlockonsLoader from "../_components/BlockonsLoader";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const site_url = siteObj.apiUrl;
	const {
		isSelected,
		attributes: {
			alignment,
			selectedProduct,
			padding,
			layout,
			layoutSwitch,
			layoutTwoOverlay,
			blockBgColor,
			blockFontColor,
		},
	} = props;

	const blockProps = useBlockProps({
		className: `${alignment} layout-${layout}`,
	});

	const onChangeAlignment = (newAlignment) => {
		props.setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};

	const [loadingProductDetails, setLoadingProductDetails] = useState(false);
	const [selectedProductDetails, setSelectedProductDetails] = useState([]);

	// Load Product Details by product ID
	useEffect(async () => {
		const id = selectedProduct ? selectedProduct.value : "";
		if (!id) return;

		setLoadingProductDetails(true);
		await axios.get(site_url + "/blcns/v1/product/" + id).then((res) => {
			setSelectedProductDetails(res.data);
			setLoadingProductDetails(false);
		});
	}, [selectedProduct]);

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Featured Product Settings", "blockons")}
						initialOpen={true}
					>
						<GetPostsSelect
							label={__("Select a product to display", "blockons")}
							value={selectedProduct}
							onChange={(value) => {
								props.setAttributes({ selectedProduct: value });
							}}
							siteurl={site_url}
						/>

						<SelectControl
							label={__("Featured Product Layout", "blockons")}
							value={layout}
							options={[
								{ label: __("2 Column", "blockons"), value: "one" },
								{ label: __("Overlayed Layout", "blockons"), value: "two" },
							]}
							onChange={(value) =>
								props.setAttributes({
									layout: value === undefined ? "one" : value,
								})
							}
							__nextHasNoMarginBottom
						/>
						{layout === "one" && (
							<ToggleControl
								label={__("Switch Layout", "blockons")}
								checked={layoutSwitch}
								onChange={(newValue) => {
									props.setAttributes({
										layoutSwitch: newValue,
									});
								}}
							/>
						)}

						{layout === "two" && (
							<ToggleControl
								label={__("Image Overlay", "blockons")}
								checked={layoutTwoOverlay}
								onChange={(newValue) => {
									props.setAttributes({
										layoutTwoOverlay: newValue,
									});
								}}
							/>
						)}

						<RangeControl
							label={__("Block Padding", "blockons")}
							value={padding}
							onChange={(value) =>
								props.setAttributes({
									padding: value === undefined ? 15 : value,
								})
							}
							min={0}
							max={120}
						/>
					</PanelBody>
					<PanelBody
						title={__("Featured Product Design", "blockons")}
						initialOpen={false}
					>
						<p>{__("Background Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={blockBgColor}
							onChange={(newColor) =>
								props.setAttributes({
									blockBgColor: newColor === undefined ? "#FFF" : newColor,
								})
							}
						/>

						<p>{__("Font Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={blockFontColor}
							onChange={(newColor) =>
								props.setAttributes({
									blockFontColor: newColor === undefined ? "#FFF" : newColor,
								})
							}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			{!selectedProduct && (
				<div className="no-selected-product">
					{__("Select a product to display", "blockons")}
				</div>
			)}

			{selectedProduct &&
				(loadingProductDetails ? (
					<div className="loading-product">
						{loadingProductDetails && <BlockonsLoader />}
					</div>
				) : (
					<div
						className={`blockons-featured-product-block ${
							layout === "one" && layoutSwitch ? "switch" : ""
						}`}
						style={{ backgroundColor: blockBgColor, padding }}
					>
						<div
							className="blockons-featured-product-detail"
							style={{ backgroundColor: blockFontColor }}
						>
							<h3>
								<a href="#">{selectedProductDetails.title}</a>
							</h3>
							<p>{selectedProductDetails.short_desc}</p>
							<div className="blockons-featured-product-btn">
								<a href="">View Product</a>
							</div>
						</div>
						<div
							className="blockons-featured-product-image"
							style={{
								backgroundImage:
									"url(" + selectedProductDetails.featured_media + ")",
							}}
						>
							{layout === "two" && layoutTwoOverlay && (
								<div className="img-overlay"></div>
							)}
							<a href="#">
								<img
									src={selectedProductDetails.featured_media}
									alt={selectedProductDetails.title}
								/>
							</a>
						</div>
					</div>
				))}
		</div>
	);
};

export default Edit;
