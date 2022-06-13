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
import parse from "html-react-parser";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const site_url = siteObj.apiUrl;
	const {
		isSelected,
		attributes: {
			alignment,
			selectedProduct,
			padding,
			innerPadding,
			layout,
			layoutSwitch,
			layoutTwoOverlay,
			overlayOpacity,
			showDesc,
			showPrice,
			showButton,
			blockBgColor,
			blockFontColor,
			buttonText,
			detailWidth,
			imgHeight,
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
						<br />
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
						{layout === "one" && (
							<RangeControl
								label={__("Inner Block Padding", "blockons")}
								value={innerPadding}
								onChange={(value) =>
									props.setAttributes({
										innerPadding: value === undefined ? 30 : value,
									})
								}
								min={0}
								max={120}
							/>
						)}

						<ToggleControl
							label={__("Show Description", "blockons")}
							checked={showDesc}
							onChange={(newValue) => {
								props.setAttributes({
									showDesc: newValue,
								});
							}}
						/>
						<ToggleControl
							label={__("Show Price", "blockons")}
							checked={showPrice}
							onChange={(newValue) => {
								props.setAttributes({
									showPrice: newValue,
								});
							}}
						/>
						<ToggleControl
							label={__("Show Button", "blockons")}
							checked={showButton}
							onChange={(newValue) => {
								props.setAttributes({
									showButton: newValue,
								});
							}}
						/>
					</PanelBody>
					<PanelBody
						title={__("Featured Product Design", "blockons")}
						initialOpen={false}
					>
						{layout === "two" && (
							<RangeControl
								label={__("Overlay Opacity", "blockons")}
								value={overlayOpacity}
								onChange={(value) =>
									props.setAttributes({
										overlayOpacity: value === undefined ? 35 : value,
									})
								}
								min={0}
								max={100}
							/>
						)}

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
									blockFontColor: newColor === undefined ? "#444" : newColor,
								})
							}
						/>

						{layout === "one" && (
							<RangeControl
								label={__("Product Info Width", "blockons")}
								value={detailWidth}
								onChange={(value) =>
									props.setAttributes({
										detailWidth: value === undefined ? 50 : value,
									})
								}
								min={20}
								max={80}
							/>
						)}
						<RangeControl
							label={__("Product Image Height", "blockons")}
							value={imgHeight}
							onChange={(value) =>
								props.setAttributes({
									imgHeight: value === undefined ? "auto" : value,
								})
							}
							min={100}
							max={1000}
							allowReset
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
							layout === "one" && layoutSwitch ? "switch" : "noswitch"
						}`}
						style={{ backgroundColor: blockBgColor, padding }}
					>
						<div
							className="blockons-featured-product-detail"
							style={{
								color:
									layout === "two" && blockFontColor === "inherit"
										? "#FFF"
										: blockFontColor,
								width: layout === "one" ? detailWidth + "%" : "auto",
								padding: innerPadding / 2 + "px " + innerPadding + "px",
							}}
						>
							<h2 className="blockons-featured-product-title">
								{selectedProductDetails.title}
							</h2>

							{showPrice && (
								<div className="blockons-featured-product-price">
									{selectedProductDetails.price
										? parse(selectedProductDetails.price)
										: ""}
								</div>
							)}

							{showDesc && <p>{selectedProductDetails.short_desc}</p>}

							{showButton && (
								<div className="blockons-featured-product-btn">
									<RichText
										placeholder={__("View Product")}
										value={buttonText}
										onChange={(value) =>
											props.setAttributes({
												buttonText:
													value === undefined ? "View Product" : value,
											})
										}
										// withoutInteractiveFormatting
										className={"wp-block-button__link"}
									/>
								</div>
							)}
						</div>
						<div
							className="blockons-featured-product-image"
							style={{
								...(selectedProductDetails.featured_media
									? {
											backgroundImage:
												"url(" + selectedProductDetails.featured_media + ")",
									  }
									: ""),
							}}
						>
							{layout === "two" && layoutTwoOverlay && (
								<div
									className="img-overlay"
									style={{
										opacity: overlayOpacity + "%",
									}}
								></div>
							)}
							<img
								src={selectedProductDetails.featured_media}
								alt={selectedProductDetails.title}
								style={{
									height: imgHeight !== "auto" ? imgHeight : "auto",
								}}
							/>
						</div>
					</div>
				))}
		</div>
	);
};

export default Edit;
