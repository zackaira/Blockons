import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	TextControl,
	RangeControl,
} from "@wordpress/components";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import {
	colorPickerPalette,
	minimalRichText,
	marketingButtonIcons,
} from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			buttonAlign,
			mbMinWidth,
			mbMinHeight,
			layout,
			hasIcon,
			theIcon,
			customIcon,
			customIconName,
			iconPosition,
			iconSize,
			iconSpacing,
			linkTo,
			linkTarget,
			title,
			showSubText,
			subText,
			bRadius,
			vertPad,
			horizPad,
			bgColor,
			borderColor,
			iconColor,
			textColor,
			titleColor,
			titleSize,
			textSize,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} ${buttonAlign}-align design-${layout} icon-pos-${iconPosition}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : newAlignment,
		});
	};

	const onChangeIcon = (newIcon) => {
		setAttributes({
			theIcon: newIcon,
		});
	};

	function MarketingButtonIcon() {
		return (
			<div
				className="blockons-mb-icon"
				style={{
					...(iconPosition === "one" || iconPosition === "three"
						? { marginRight: iconSpacing }
						: { marginLeft: iconSpacing }),
					color: iconColor,
				}}
			>
				<Dropdown
					className="blockons-icon-selecter"
					contentClassName="blockons-editor-popup marketing-button"
					popoverProps={{ placement: "bottom-end" }}
					renderToggle={({ isOpen, onToggle }) => (
						<FontAwesomeIcon
							icon={customIcon && customIconName ? customIconName : theIcon}
							iconSize={iconSize}
							onClick={onToggle}
						/>
					)}
					renderContent={() =>
						Object.keys(marketingButtonIcons).map((icon) => (
							<FontAwesomeIcon
								icon={icon}
								iconSize={20}
								onClick={() => onChangeIcon(icon)}
							/>
						))
					}
				/>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Marketing Button Settings", "blockons")}
						initialOpen={true}
					>
						<TextControl
							label="Link URL"
							value={linkTo}
							onChange={(newValue) => {
								setAttributes({
									linkTo: newValue,
								});
							}}
						/>
						<ToggleControl
							label={__("Open in new window", "blockons")}
							checked={linkTarget}
							onChange={(newValue) => {
								setAttributes({
									linkTarget: newValue,
								});
							}}
						/>
						<br />

						<SelectControl
							label={__("Design", "blockons")}
							value={layout}
							options={[
								{ label: __("Bordered", "blockons"), value: "one" },
								{ label: __("Plain", "blockons"), value: "two" },
							]}
							onChange={(newValue) =>
								setAttributes({
									layout: newValue === undefined ? "one" : newValue,
								})
							}
							__nextHasNoMarginBottom
						/>

						<RangeControl
							label={__("Min Width", "blockons")}
							value={mbMinWidth}
							onChange={(newValue) =>
								setAttributes({
									mbMinWidth: newValue === undefined ? 200 : parseInt(newValue),
								})
							}
							min={200}
							max={1000}
						/>
						<RangeControl
							label={__("Min Height", "blockons")}
							value={mbMinHeight}
							onChange={(newValue) =>
								setAttributes({
									mbMinHeight: newValue === undefined ? 50 : parseInt(newValue),
								})
							}
							min={50}
							max={500}
						/>

						<ToggleControl
							label={__("Show Sub Text", "blockons")}
							checked={showSubText}
							onChange={(newValue) => {
								setAttributes({
									showSubText: newValue,
								});
							}}
						/>

						<ToggleControl
							label={__("Add an Icon", "blockons")}
							checked={hasIcon}
							onChange={(newValue) => {
								setAttributes({
									hasIcon: newValue,
								});
							}}
							help={__(
								"Change the icon by clicking on the Icon within the editor",
								"blockons"
							)}
						/>
						{hasIcon && (
							<>
								<ToggleControl
									label={__("Add a custom Icon", "blockons")}
									checked={customIcon}
									onChange={(newValue) => {
										setAttributes({
											customIcon: newValue,
										});
									}}
								/>
								{customIcon && (
									<>
										<TextControl
											label="Custom Icon Name"
											value={customIconName}
											onChange={(newValue) => {
												setAttributes({
													customIconName: newValue,
												});
											}}
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
								<SelectControl
									label={__("Icon Position", "blockons")}
									value={iconPosition}
									options={[
										{ label: __("Before Title", "blockons"), value: "one" },
										{ label: __("After Title", "blockons"), value: "two" },
										{ label: __("Button Left", "blockons"), value: "three" },
										{ label: __("Button Right", "blockons"), value: "four" },
									]}
									onChange={(newValue) =>
										setAttributes({
											iconPosition: newValue === undefined ? "one" : newValue,
										})
									}
									__nextHasNoMarginBottom
								/>
								<RangeControl
									label={__("Icon Size", "blockons")}
									value={iconSize}
									onChange={(newValue) =>
										setAttributes({
											iconSize:
												newValue === undefined ? 16 : parseInt(newValue),
										})
									}
									min={10}
									max={62}
								/>
								<RangeControl
									label={__("Icon Spacing", "blockons")}
									value={iconSpacing}
									onChange={(newValue) =>
										setAttributes({
											iconSpacing:
												newValue === undefined ? 8 : parseInt(newValue),
										})
									}
									min={0}
									max={200}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Marketing Button Design", "blockons")}
						initialOpen={false}
					>
						<RangeControl
							label={__("Button Roundness", "blockons")}
							value={bRadius}
							onChange={(newValue) =>
								setAttributes({
									bRadius: newValue === undefined ? 3 : parseInt(newValue),
								})
							}
							min={0}
							max={200}
						/>

						<RangeControl
							label={__("Vertical Padding", "blockons")}
							value={vertPad}
							onChange={(newValue) =>
								setAttributes({
									vertPad: newValue === undefined ? 15 : parseInt(newValue),
								})
							}
							min={0}
							max={240}
						/>
						<RangeControl
							label={__("Horizontal Padding", "blockons")}
							value={horizPad}
							onChange={(newValue) =>
								setAttributes({
									horizPad: newValue === undefined ? 18 : parseInt(newValue),
								})
							}
							min={0}
							max={240}
						/>

						<BlockonsColorpicker
							label={__("Background Color", "blockons")}
							value={bgColor}
							onChange={(colorValue) => {
								setAttributes({
									bgColor: colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						{layout === "one" && (
							<BlockonsColorpicker
								label={__("Border Color", "blockons")}
								value={borderColor}
								onChange={(colorValue) => {
									setAttributes({
										borderColor:
											colorValue === undefined ? "#a223a1" : colorValue,
									});
								}}
								paletteColors={colorPickerPalette}
							/>
						)}

						<BlockonsColorpicker
							label={__("Icon Color", "blockons")}
							value={iconColor}
							onChange={(colorValue) => {
								setAttributes({
									iconColor: colorValue === undefined ? "#a223a1" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Title Color", "blockons")}
							value={titleColor}
							onChange={(colorValue) => {
								setAttributes({
									titleColor: colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__("Text Color", "blockons")}
							value={textColor}
							onChange={(colorValue) => {
								setAttributes({
									textColor: colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
					<BlockAlignmentToolbar
						value={buttonAlign}
						controls={["left", "center", "right"]}
						onChange={(newValue) => {
							setAttributes({
								buttonAlign: newValue === undefined ? "left" : newValue,
							});
						}}
					/>
				</BlockControls>
			}
			<div className="blockons-marketing-button-block">
				<a
					// {...(linkTo ? { href: linkTo } : "")}
					// {...(linkTarget ? { target: "_blank" } : "")}
					className="blockons-marketing-button"
					style={{
						paddingLeft: horizPad,
						paddingRight: hasIcon ? horizPad + 4 : horizPad,
						paddingTop: vertPad,
						paddingBottom: vertPad,
						minWidth: mbMinWidth,
						minHeight: mbMinHeight,
						borderRadius: bRadius,
						backgroundColor: bgColor,
						borderColor: borderColor,
					}}
					rel="noopener"
				>
					{hasIcon && iconPosition === "three" && <MarketingButtonIcon />}
					<div className="blockons-marketing-button-inner">
						<div className="blockons-marketing-button-title-wrap">
							{hasIcon && iconPosition === "one" && <MarketingButtonIcon />}
							<RichText
								tagName={"div"}
								placeholder={__("Button Title", "blockons")}
								keepPlaceholderOnFocus
								value={title}
								className="blockons-marketing-button-title"
								onChange={(value) => setAttributes({ title: value })}
								allowedFormats={minimalRichText}
								multiline={false}
								style={{ color: titleColor, fontSize: titleSize }}
							/>
							{hasIcon && iconPosition === "two" && <MarketingButtonIcon />}
						</div>
						{showSubText && (
							<div className="blockons-marketing-button-text-wrap">
								<RichText
									tagName={"p"}
									placeholder={__("Some extra text", "blockons")}
									keepPlaceholderOnFocus
									value={subText}
									className="blockons-marketing-button-text"
									onChange={(value) => setAttributes({ subText: value })}
									allowedFormats={minimalRichText}
									style={{ color: textColor, fontSize: textSize }}
								/>
							</div>
						)}
					</div>
					{hasIcon && iconPosition === "four" && <MarketingButtonIcon />}
				</a>
			</div>
		</div>
	);
};

export default Edit;
