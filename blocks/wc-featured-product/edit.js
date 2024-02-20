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
	ToggleControl,
	SelectControl,
	RangeControl,
} from "@wordpress/components";
import GetPostsSelect from "../_components/GetPostsSelect";
import BlockonsLoader from "../_components/BlockonsLoader";
import parse from "html-react-parser";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";
import "./editor.css";

const Edit = (props) => {
	const site_url = blockonsObj.apiUrl;
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
			titleSize,
			titleColor,
			priceSize,
			priceColor,
			buttonType,
			buttonTarget,
			blockBgColor,
			blockDetailColor,
			blockFontColor,
			buttonText,
			detailWidth,
			imgHeight,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} layout-${layout}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	const [loadingProductDetails, setLoadingProductDetails] = useState(false);
	const [selectedProductDetails, setSelectedProductDetails] = useState([]);

	// Load Product Details by product ID
	useEffect(async () => {
		const id = selectedProduct ? selectedProduct.value : "";
		if (!id) return;

		setLoadingProductDetails(true);
		await axios.get(site_url + "blcns/v1/product/" + id).then((res) => {
			setSelectedProductDetails(res.data);
			setLoadingProductDetails(false);
		});
	}, [selectedProduct]);

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("WC Featured Product Settings", "blockons")}
						initialOpen={true}
					>
						<GetPostsSelect
							label={__("Select a product to display", "blockons")}
							value={selectedProduct}
							onChange={(newValue) =>
								setAttributes({ selectedProduct: newValue })
							}
							siteurl={site_url}
						/>
						<br />
						<SelectControl
							label={__("WC Featured Product Layout", "blockons")}
							value={layout}
							options={[
								{ label: __("2 Column", "blockons"), value: "one" },
								{ label: __("Overlayed Layout", "blockons"), value: "two" },
							]}
							onChange={(newValue) =>
								setAttributes({
									layout: newValue === undefined ? "one" : newValue,
								})
							}
						/>
						{layout === "one" && (
							<ToggleControl
								label={__("Switch Layout", "blockons")}
								checked={layoutSwitch}
								onChange={(newValue) =>
									setAttributes({ layoutSwitch: newValue })
								}
							/>
						)}

						{layout === "two" && (
							<ToggleControl
								label={__("Image Overlay", "blockons")}
								checked={layoutTwoOverlay}
								onChange={(newValue) =>
									setAttributes({ layoutTwoOverlay: newValue })
								}
							/>
						)}

						<RangeControl
							label={__("Block Padding", "blockons")}
							value={padding}
							onChange={(newValue) =>
								setAttributes({
									padding: newValue === undefined ? 15 : parseInt(newValue),
								})
							}
							min={0}
							max={120}
						/>
						{layout === "one" && (
							<RangeControl
								label={__("Product Padding", "blockons")}
								value={innerPadding}
								onChange={(newValue) =>
									setAttributes({
										innerPadding:
											newValue === undefined ? 30 : parseInt(newValue),
									})
								}
								min={0}
								max={120}
							/>
						)}

						<ToggleControl
							label={__("Show Description", "blockons")}
							checked={showDesc}
							onChange={(newValue) => setAttributes({ showDesc: newValue })}
						/>
						<ToggleControl
							label={__("Show Price", "blockons")}
							checked={showPrice}
							onChange={(newValue) => setAttributes({ showPrice: newValue })}
						/>

						<ToggleControl
							label={__("Show Button", "blockons")}
							checked={showButton}
							onChange={(newValue) => setAttributes({ showButton: newValue })}
						/>
						{/* {showButton && (
							<>
								<SelectControl
									label={__("Button Type", "blockons")}
									value={buttonType}
									options={[
										{ label: __("Link to Product", "blockons"), value: "link" },
										{ label: __("Add to Cart", "blockons"), value: "atc" },
									]}
									onChange={(newValue) =>
										setAttributes({
											buttonType: newValue === undefined ? "link" : newValue,
										})
									}
								/>
								{buttonType === "link" && (
									<ToggleControl
										label={__("Open in new window", "blockons")}
										checked={buttonTarget}
										onChange={(newValue) =>
											setAttributes({ buttonTarget: newValue })
										}
									/>
								)}
							</>
						)} */}
					</PanelBody>
					<PanelBody
						title={__("WC Featured Product Design", "blockons")}
						initialOpen={false}
					>
						{layout === "two" && (
							<RangeControl
								label={__("Overlay Opacity", "blockons")}
								value={overlayOpacity}
								onChange={(value) =>
									setAttributes({
										overlayOpacity: value === undefined ? 0.35 : value,
									})
								}
								min={0}
								max={1}
								step={0.01}
							/>
						)}

						<BlockonsColorpicker
							label={__("Block Background Color", "blockons")}
							value={blockBgColor}
							onChange={(colorValue) => {
								setAttributes({
									blockBgColor: colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Product Background Color", "blockons")}
							value={blockDetailColor}
							onChange={(colorValue) => {
								setAttributes({
									blockDetailColor:
										colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						<RangeControl
							label={__("Product Title Size", "blockons")}
							value={titleSize}
							onChange={(newValue) =>
								setAttributes({
									titleSize: newValue === undefined ? "" : parseInt(newValue),
								})
							}
							min={12}
							max={68}
							allowReset
						/>
						<BlockonsColorpicker
							label={__("Product Title Color", "blockons")}
							value={titleColor}
							onChange={(colorValue) => {
								setAttributes({
									titleColor: colorValue === undefined ? "#444" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						{showPrice && (
							<>
								<RangeControl
									label={__("Price Size", "blockons")}
									value={priceSize}
									onChange={(newValue) =>
										setAttributes({
											priceSize:
												newValue === undefined ? "inherit" : parseInt(newValue),
										})
									}
									min={12}
									max={44}
									allowReset
								/>
								<BlockonsColorpicker
									label={__("Price Color", "blockons")}
									value={priceColor}
									onChange={(colorValue) =>
										setAttributes({
											priceColor:
												colorValue === undefined ? "#444" : colorValue,
										})
									}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}

						{showDesc && (
							<BlockonsColorpicker
								label={__("Description Font Color", "blockons")}
								value={blockFontColor}
								onChange={(colorValue) => {
									setAttributes({
										blockFontColor:
											colorValue === undefined ? "#444" : colorValue,
									});
								}}
								paletteColors={colorPickerPalette}
							/>
						)}

						{layout === "one" && (
							<RangeControl
								label={__("Product Info Width", "blockons")}
								value={detailWidth}
								onChange={(newValue) =>
									setAttributes({
										detailWidth:
											newValue === undefined ? 50 : parseInt(newValue),
									})
								}
								min={20}
								max={80}
							/>
						)}
						<RangeControl
							label={__("Product Image Height", "blockons")}
							value={imgHeight}
							onChange={(newValue) =>
								setAttributes({
									imgHeight:
										newValue === undefined ? "auto" : parseInt(newValue),
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

			{Object.keys(selectedProduct).length < 1 && (
				<div className="no-selected-product">
					{__("Select a product to display", "blockons")}
				</div>
			)}

			{Object.keys(selectedProduct).length > 0 &&
				(loadingProductDetails ? (
					<div className="loading-product">
						{loadingProductDetails && <BlockonsLoader />}
					</div>
				) : (
					<div
						className={`blockons-wc-featured-product-block ${
							layout === "one" && layoutSwitch ? "switch" : "noswitch"
						}`}
						style={{ backgroundColor: blockBgColor, padding }}
					>
						<div
							className="blockons-wc-featured-product-detail"
							style={{
								backgroundColor: blockDetailColor,
								color:
									layout === "two" && blockFontColor === "inherit"
										? "#FFF"
										: blockFontColor,
								width: layout === "one" ? detailWidth + "%" : "auto",
								padding: innerPadding / 2 + "px " + innerPadding + "px",
							}}
						>
							<h2
								className="blockons-wc-featured-product-title"
								style={{
									...(titleSize ? { fontSize: titleSize } : ""),
									...(titleColor ? { color: titleColor } : ""),
								}}
							>
								{selectedProductDetails.title}
							</h2>

							{showPrice && (
								<div
									className="blockons-wc-featured-product-price"
									style={{
										...(priceSize ? { fontSize: priceSize } : ""),
										...(priceColor ? { color: priceColor } : ""),
									}}
								>
									{selectedProductDetails.price
										? parse(selectedProductDetails.price)
										: ""}
								</div>
							)}

							{showDesc && <p>{selectedProductDetails.short_desc}</p>}

							{showButton && (
								<div className="blockons-wc-featured-product-btn">
									{buttonType === "atc" ? (
										<div className="wc-fproduct-btn">
											{__("Add To Cart", "blockons")}
										</div>
									) : (
										<RichText
											placeholder={__("View Product")}
											value={buttonText}
											onChange={(value) =>
												setAttributes({
													buttonText:
														value === undefined ? "View Product" : value,
												})
											}
											// withoutInteractiveFormatting
											className={"wc-fproduct-btn"}
										/>
									)}
								</div>
							)}
						</div>
						<div
							className="blockons-wc-featured-product-image"
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
										opacity: overlayOpacity,
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
