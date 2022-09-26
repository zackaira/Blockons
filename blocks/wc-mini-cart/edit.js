/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
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
	TextControl,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			cartLinkTo,
			cartLink,
			cartLinkNewTab,
			alignment,
			hasDropdown,
			dropPosition,
			noItems,
			noAmount,
			icon,
			iconSize,
			layoutSwitch,
			iconPadding,
			customIcon,
			iconBgColor,
			textColor,
			iconColor,
			dropBgColor,
			dropColor,
			dropBtns,
		},
		setAttributes,
	} = props;
	const isPremium = wcCartObj.isPremium === "1" ? true : false;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};
	const onChangeCustomIcon = (value) => {
		setAttributes({ customIcon: value });
	};

	// console.log(isPremium);

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("WC Mini Cart Settings", "blockons")}
						initialOpen={true}
					>
						{isPremium ? (
							<>
								<div>premium features EXPLAINED here</div>
								<br />
							</>
						) : (
							<>
								<div>A NOTE ABOUT premium features here</div>
								<br />
							</>
						)}

						<TextControl
							label="Cart Page Url"
							value={cartLink}
							onChange={(newValue) => {
								setAttributes({
									cartLink:
										newValue === undefined ? wcCartObj.wcCartUrl : newValue,
								});
							}}
							help={__(
								"If not set, this defaults to the WooCommerce cart page",
								"blockons"
							)}
						/>
						<ToggleControl
							label={__("Open in a new tab", "blockons")}
							checked={cartLinkNewTab}
							onChange={(newValue) => {
								setAttributes({
									cartLinkNewTab: newValue,
								});
							}}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Switch Layout", "blockons")}
							checked={layoutSwitch}
							onChange={(newValue) => {
								setAttributes({
									layoutSwitch: newValue,
								});
							}}
						/>
						<ToggleControl
							label={__("Remove Cart Amount", "blockons")}
							checked={noAmount}
							onChange={(newValue) => {
								setAttributes({
									noAmount: newValue,
								});
							}}
						/>
						<ToggleControl
							label={__("Remove Items Count", "blockons")}
							checked={noItems}
							onChange={(newValue) => {
								setAttributes({
									noItems: newValue,
								});
							}}
						/>
					</PanelBody>
					<PanelBody
						title={__("WC Mini Cart Design", "blockons")}
						initialOpen={false}
					>
						<ToggleControl
							label={__("Add Drop Down Cart", "blockons")}
							help={__(
								"Add a drop down cart to display cart items",
								"blockons"
							)}
							checked={hasDropdown}
							onChange={(newValue) => {
								setAttributes({
									hasDropdown: newValue,
								});
							}}
						/>
						<div className="blockons-divider"></div>

						<SelectControl
							label={__("Select an Icon", "blockons")}
							value={icon}
							options={[
								{
									label: __("Shopping Cart", "blockons"),
									value: "cart-shopping",
								},
								{
									label: __("Cart Arrow Down", "blockons"),
									value: "cart-arrow-down",
								},
								{
									label: __("Shopping Basket", "blockons"),
									value: "basket-shopping",
								},
								{
									label: __("Shopping Bag", "blockons"),
									value: "bag-shopping",
								},
								{
									label: __("Shopping Suitcase", "blockons"),
									value: "suitcase",
								},
								{
									label: __("Bucket", "blockons"),
									value: "bucket",
								},
								{
									label: __("Custom Icon", "blockons"),
									value: "custom",
								},
							]}
							onChange={(newIcon) =>
								setAttributes({
									icon: newIcon === undefined ? "cart-shopping" : newIcon,
								})
							}
						/>
						{icon === "custom" && (
							<>
								<TextControl
									label="Custom Icon Name"
									value={customIcon}
									onChange={onChangeCustomIcon}
									help={__(
										"Add your own custom icon by adding the Font Awesome icon name",
										"blockons"
									)}
								/>
								<div className="helplink fixmargin">
									<a
										href="https://blockons.com/documentation/adding-a-custom-font-awesome-icon-to-the-block/"
										target="_blank"
									>
										{__("Read More")}
									</a>
								</div>
							</>
						)}

						{hasDropdown && (
							<SelectControl
								label={__("Drop Down Cart Position", "blockons")}
								value={dropPosition}
								options={[
									{
										label: __("Bottom Left", "blockons"),
										value: "bottom-left",
									},
									{
										label: __("Bottom Center", "blockons"),
										value: "bottom-center",
									},
									{
										label: __("Bottom Right", "blockons"),
										value: "bottom-right",
									},
									{ label: __("Top Left", "blockons"), value: "top-left" },
									{ label: __("Top Center", "blockons"), value: "top-center" },
									{ label: __("Top Right", "blockons"), value: "top-right" },
									{ label: __("Left Top", "blockons"), value: "left-top" },
									{
										label: __("Left Bottom", "blockons"),
										value: "left-bottom",
									},
									{ label: __("Right Top", "blockons"), value: "right-top" },
									{
										label: __("Right Bottom", "blockons"),
										value: "right-bottom",
									},
								]}
								onChange={(newPosition) =>
									setAttributes({
										dropPosition:
											newPosition === undefined ? "bottom-left" : newPosition,
									})
								}
							/>
						)}

						<RangeControl
							label={__("Icon Size", "blockons")}
							value={iconSize}
							onChange={(value) =>
								setAttributes({
									iconSize: value === undefined ? 17 : value,
								})
							}
							min={14}
							max={50}
						/>
						<RangeControl
							label={__("Cart Padding", "blockons")}
							value={iconPadding}
							onChange={(value) =>
								setAttributes({
									iconPadding: value === undefined ? 5 : value,
								})
							}
							min={0}
							max={50}
						/>

						<BlockonsColorpicker
							label={__("Background Color", "blockons")}
							value={iconBgColor}
							onChange={(colorValue) => {
								setAttributes({
									iconBgColor: colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Text Color", "blockons")}
							value={textColor}
							onChange={(colorValue) => {
								setAttributes({
									textColor: colorValue === undefined ? "#444" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Icon Color", "blockons")}
							value={iconColor}
							onChange={(colorValue) => {
								setAttributes({
									iconColor: colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						{hasDropdown && (
							<>
								<div className="blockons-divider"></div>
								<BlockonsColorpicker
									label={__("Drop Down Background Color", "blockons")}
									value={dropBgColor}
									onChange={(colorValue) => {
										setAttributes({
											dropBgColor:
												colorValue === undefined ? "#FFF" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<BlockonsColorpicker
									label={__("Drop Down Font Color", "blockons")}
									value={dropColor}
									onChange={(colorValue) => {
										setAttributes({
											dropColor: colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<SelectControl
									label={__("Button Colors", "blockons")}
									value={dropBtns}
									options={[
										{ label: __("Dark", "blockons"), value: "dark" },
										{ label: __("Light", "blockons"), value: "light" },
									]}
									onChange={(newValue) =>
										setAttributes({
											dropBtns: newValue === undefined ? "dark" : newValue,
										})
									}
								/>
							</>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-wc-mini-cart-block ${noItems ? "noitems" : ""} ${
					noAmount ? "noamount" : ""
				} ${layoutSwitch ? "switch" : ""} ${dropPosition}`}
				style={{
					backgroundColor: iconBgColor,
				}}
			>
				<a
					// {...(cartLink ? { href: cartLink } : { href: wcCartObj.wcCartUrl })}
					{...(cartLinkNewTab ? { target: "_blank" } : "")}
					className="blockons-wc-mini-cart-block-icon"
					style={{
						fontSize: iconSize,
						padding: iconPadding,
						color: textColor,
					}}
				>
					<span
						className={`icon fa-solid fa-${
							customIcon && icon == "custom" ? customIcon : icon
						}`}
						style={{
							color: iconColor,
						}}
					></span>
					<div className="blockons-cart-amnt">
						<span className="amount">$34,00</span>{" "}
						<span className="count">(2 items)</span>
					</div>
				</a>
				{hasDropdown && (
					<div
						className={`blockons-wc-mini-cart-dropdown btns-${dropBtns}`}
						style={{
							backgroundColor: dropBgColor,
							color: dropColor,
						}}
					>
						<div className="blockons-wc-mini-cart-inner">
							{__(
								"This will display all the items that have been added to cart",
								"blockons"
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
