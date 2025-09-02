import { useEffect } from "@wordpress/element";
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
			cartLink,
			alignment,
			cartType,
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
			isPremium,
		},
		setAttributes,
	} = props;
	const isPro = Boolean(wcCartObj.isPremium);

	useEffect(() => {
		setAttributes({ isPremium: isPro }); // SETS PREMIUM

		if (!cartLink) {
			setAttributes({ cartLink: wcCartObj.wcCartUrl });
		}
	}, []);

	const blockProps = useBlockProps({
		className: `align-${alignment} cart-${cartType}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};
	const onChangeCustomIcon = (newValue) => {
		setAttributes({ customIcon: newValue });
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Mini Cart Settings", "blockons")}
						initialOpen={true}
					>
						<TextControl
							label="Cart Page Url"
							value={cartLink}
							onChange={(newValue) =>
								setAttributes({
									cartLink:
										newValue === undefined ? wcCartObj.wcCartUrl : newValue,
								})
							}
							help={__(
								"If not set, this defaults to the WooCommerce cart page",
								"blockons"
							)}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Switch Layout", "blockons")}
							checked={layoutSwitch}
							onChange={(newValue) => setAttributes({ layoutSwitch: newValue })}
							__nextHasNoMarginBottom={true}
						/>
						<ToggleControl
							label={__("Remove Cart Amount", "blockons")}
							checked={noAmount}
							onChange={(newValue) => setAttributes({ noAmount: newValue })}
							__nextHasNoMarginBottom={true}
						/>
						<ToggleControl
							label={__("Remove Items Count", "blockons")}
							checked={noItems}
							onChange={(newValue) => setAttributes({ noItems: newValue })}
							__nextHasNoMarginBottom={true}
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
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
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
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
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
					</PanelBody>

					<PanelBody
						title={__("Full Cart Settings", "blockons")}
						initialOpen={false}
					>
						<SelectControl
							label={__("Display Full Cart", "blockons")}
							value={cartType}
							options={[
								{ label: __("None", "blockons"), value: "none" },
								{ label: __("Drop Down Cart", "blockons"), value: "dropdown" },
								{
									label: __("WooCommerce Side Cart", "blockons"),
									value: "sidecart",
									disabled: !isPremium ? true : false,
								},
							]}
							onChange={(newValue) =>
								setAttributes({
									cartType: newValue === undefined ? "none" : newValue,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						{cartType === "dropdown" && (
							<>
								<div className="blockons-divider"></div>
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
										{
											label: __("Top Center", "blockons"),
											value: "top-center",
										},
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
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
							</>
						)}

						{cartType === "sidecart" && (
							<div className="helplink">
								{isPremium
									? __(
											"Side Cart is added in the main settings area. Click to enable and edit the Side Cart settings.",
											"blockons"
									  )
									: __(
											"Side Cart (Pro feature) is added in the main settings area. Click to enable and edit the Side Cart settings.",
											"blockons"
									  )}
								<br />
								<br />
								<a
									href={
										wcCartObj.adminUrl +
										"options-general.php?page=blockons-settings"
									}
									target="_blank"
								>
									{__("Enable Side Cart", "blockons")}
								</a>
							</div>
						)}
					</PanelBody>

					<PanelBody
						title={__("Mini Cart Design Settings", "blockons")}
						initialOpen={false}
					>
						<RangeControl
							label={__("Icon Size", "blockons")}
							value={iconSize}
							onChange={(newValue) =>
								setAttributes({
									iconSize: newValue === undefined ? 17 : parseInt(newValue),
								})
							}
							min={14}
							max={50}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<RangeControl
							label={__("Cart Padding", "blockons")}
							value={iconPadding}
							onChange={(newValue) =>
								setAttributes({
									iconPadding: newValue === undefined ? 5 : parseInt(newValue),
								})
							}
							min={0}
							max={50}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<div className="blockons-divider"></div>

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

						{cartType === "dropdown" && (
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
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
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
					className={`blockons-wc-mini-cart-block-icon ${
						cartType === "sidecart" ? "blockons-opencart" : ""
					}`}
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
				{cartType === "dropdown" && (
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
