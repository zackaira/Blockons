/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";
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
	TextControl,
	ColorPalette,
} from "@wordpress/components";

import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			hasDropdown,
			icon,
			iconSize,
			iconPadding,
			customIcon,
			iconBgColor,
			iconColor,
			dropBgColor,
			dropColor,
		},
		setAttributes,
	} = props;

	const [showMiniCart, setShowMiniCart] = useState(false);

	const blockProps = useBlockProps({
		className: alignment,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};
	const onChangeCustomIcon = (value) => {
		setAttributes({ customIcon: value });
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Cart Icon Settings", "blockons")}
						initialOpen={true}
					>
						<ToggleControl
							label={__("Add Mini Cart", "blockons")}
							help={__(
								"Add a drop down mini cart to display cart items",
								"blockons"
							)}
							checked={hasDropdown}
							onChange={(newValue) => {
								setAttributes({
									hasDropdown: newValue,
								});
							}}
						/>
						{hasDropdown && (
							<>
								<ToggleControl // This setting is just for displaying the drop down, value is not saved.
									label={__("Always Show Drop Down", "blockons")}
									checked={showMiniCart}
									help={__(
										"This will always display the drop down ONLY in the editor",
										"blockons"
									)}
									onChange={() => {
										setShowMiniCart((state) => !state);
									}}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Cart Icon Design", "blockons")}
						initialOpen={false}
					>
						<SelectControl
							label={__("Select an Icon", "blockons")}
							value={icon}
							options={[
								{
									label: __("Shopping Cart", "blockons"),
									value: "fa-solid fa-cart-shopping",
								},
								{
									label: __("Cart Arrow Down", "blockons"),
									value: "fa-solid fa-cart-arrow-down",
								},
								{
									label: __("Shopping Basket", "blockons"),
									value: "fa-solid fa-basket-shopping",
								},
								{
									label: __("Shopping Bag", "blockons"),
									value: "fa-solid fa-bag-shopping",
								},
								{
									label: __("Shopping Suitcase", "blockons"),
									value: "fa-solid fa-suitcase",
								},
								{
									label: __("Bucket", "blockons"),
									value: "fa-solid fa-bucket",
								},
								{
									label: __("Custom Icon", "blockons"),
									value: "custom",
								},
							]}
							onChange={(newIcon) =>
								setAttributes({
									icon:
										newIcon === undefined
											? "fa-solid fa-cart-shopping"
											: newIcon,
								})
							}
							__nextHasNoMarginBottom
						/>
						{icon === "custom" && (
							<>
								<TextControl
									label="Custom Icon Name"
									value={customIcon}
									onChange={onChangeCustomIcon}
									help={__(
										"Add your own custom icon by adding the Font Awesome icon full name",
										"blockons"
									)}
								/>
								<div className="helplink fixmargin">
									<a href="#" target="_blank">
										{__("Read More")}
									</a>
								</div>
							</>
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
							label={__("Icon Padding", "blockons")}
							value={iconPadding}
							onChange={(value) =>
								setAttributes({
									iconPadding: value === undefined ? 5 : value,
								})
							}
							min={0}
							max={50}
						/>

						<p>{__("Icon Background Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={iconBgColor}
							onChange={(newColor) =>
								setAttributes({
									iconBgColor: newColor === undefined ? "#FFF" : newColor,
								})
							}
						/>

						<p>{__("Icon Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={iconColor}
							onChange={(newColor) =>
								setAttributes({
									iconColor: newColor === undefined ? "#000" : newColor,
								})
							}
						/>

						<p>{__("Drop Down Background Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={dropBgColor}
							onChange={(newColor) =>
								setAttributes({
									dropBgColor: newColor === undefined ? "#FFF" : newColor,
								})
							}
						/>

						<p>{__("Drop Down Font Color", "blockons")}</p>
						<ColorPalette
							colors={colorPickerPalette}
							value={dropColor}
							onChange={(newColor) =>
								setAttributes({
									dropColor: newColor === undefined ? "#747474" : newColor,
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
			<div
				className={`blockons-cart-icon-block ${
					isSelected && showMiniCart ? "show" : ""
				}`}
				style={{
					backgroundColor: iconBgColor,
				}}
			>
				<div
					className="blockons-cart-icon-block-icon"
					style={{
						fontSize: iconSize,
						padding: iconPadding,
					}}
				>
					<span
						className={customIcon && icon == "custom" ? customIcon : icon}
						style={{
							color: iconColor,
						}}
					></span>
					<div className="blockons-cart-amnt">
						<span>$34,00</span> <span>(2 items)</span>
					</div>
				</div>
				{hasDropdown && (
					<div
						className="blockons-cart-icon-dropdown"
						style={{
							backgroundColor: dropBgColor,
							color: dropColor,
						}}
					>
						<div className="blockons-cart-icon-inner">
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
