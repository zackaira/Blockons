/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
	Icon,
	Button,
	ToolbarButton,
} from "@wordpress/components";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import {
	colorPickerPalette,
	minimalRichText,
	iconListIcons,
} from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			buttonAlign,
			layout,
			hasIcon,
			theIcon,
			iconPosition,
			iconSize,
			linkTo,
			title,
			subText,
			vertPad,
			horizPad,
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

	const onChangeLinkUrl = (newValue) => {
		setAttributes({
			linkTo: newValue,
		});
	};

	const onChangeIcon = (newIcon) => {
		setAttributes({
			theIcon: newIcon,
		});
	};

	//console.log(linkTo);

	function MarketingButtonIcon() {
		return (
			<div className="blockons-mb-icon">
				<Dropdown
					className="blockons-icon-selecter"
					contentClassName="blockons-editor-popup"
					position="bottom right"
					renderToggle={({ isOpen, onToggle }) => (
						<FontAwesomeIcon
							icon={theIcon}
							iconSize={iconSize}
							onClick={onToggle}
						/>
					)}
					renderContent={() =>
						Object.keys(iconListIcons).map((icon) => (
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
						<SelectControl
							label={__("Design", "blockons")}
							value={layout}
							options={[
								{ label: __("Plain", "blockons"), value: "one" },
								{ label: __("Bordered", "blockons"), value: "two" },
							]}
							onChange={(value) =>
								setAttributes({
									layout: value === undefined ? "one" : value,
								})
							}
							__nextHasNoMarginBottom
						/>

						<ToggleControl
							label={__("Add an Icon", "blockons")}
							checked={hasIcon}
							onChange={(newValue) => {
								setAttributes({
									hasIcon: newValue,
								});
							}}
						/>
						{hasIcon && (
							<>
								<SelectControl
									label={__("Icon Position", "blockons")}
									value={iconPosition}
									options={[
										{ label: __("Before Title", "blockons"), value: "one" },
										{ label: __("After Title", "blockons"), value: "two" },
										{ label: __("Button Left", "blockons"), value: "three" },
										{ label: __("Button Right", "blockons"), value: "four" },
									]}
									onChange={(value) =>
										setAttributes({
											iconPosition: value === undefined ? "one" : value,
										})
									}
									__nextHasNoMarginBottom
								/>
								<RangeControl
									label={__("Icon Size", "blockons")}
									value={iconSize}
									onChange={(value) =>
										setAttributes({
											iconSize: value === undefined ? 16 : value,
										})
									}
									min={10}
									max={50}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Marketing Button Design", "blockons")}
						initialOpen={false}
					>
						<RangeControl
							label={__("Vertical Padding", "blockons")}
							value={vertPad}
							onChange={(value) =>
								setAttributes({
									vertPad: value === undefined ? 15 : value,
								})
							}
							min={0}
							max={200}
						/>
						<RangeControl
							label={__("Horizontal Padding", "blockons")}
							value={horizPad}
							onChange={(value) =>
								setAttributes({
									horizPad: value === undefined ? 18 : value,
								})
							}
							min={0}
							max={200}
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
						onChange={(value) => {
							setAttributes({
								buttonAlign: value === undefined ? "none" : value,
							});
						}}
					/>
					<Dropdown
						className="blockons-item-level-settings blockons-marketing-button"
						contentClassName="blockons-editor-popup"
						position="bottom right"
						renderToggle={({ isOpen, onToggle }) => (
							<ToolbarButton
								icon="admin-links"
								label={__("Button Link", "blockons")}
								onClick={onToggle}
							/>
						)}
						renderContent={() => (
							<LinkControl
								searchInputPlaceholder={__("Search or type url", "blockons")}
								value={linkTo}
								onChange={onChangeLinkUrl}
								withCreateSuggestion={false}
							/>
						)}
					/>
				</BlockControls>
			}
			<div className="blockons-marketing-button-block">
				<div
					className="blockons-marketing-button"
					style={{
						paddingLeft: horizPad,
						paddingRight: horizPad,
						paddingTop: vertPad,
						paddingBottom: vertPad,
					}}
				>
					{hasIcon && iconPosition === "three" && <MarketingButtonIcon />}
					<div className="blockons-marketing-button-inner">
						<div className="blockons-marketing-button-title-wrap">
							{hasIcon && iconPosition === "one" && <MarketingButtonIcon />}
							<RichText
								tagName={"h3"}
								placeholder={title}
								keepPlaceholderOnFocus
								value={title}
								className="blockons-marketing-button-title"
								onChange={(value) => setAttributes({ title: value })}
								allowedFormats={minimalRichText}
							/>
							{hasIcon && iconPosition === "two" && <MarketingButtonIcon />}
						</div>
						<div className="blockons-marketing-button-text-wrap">
							<RichText
								tagName={"p"}
								placeholder={subText}
								keepPlaceholderOnFocus
								value={subText}
								className="blockons-marketing-button-text"
								onChange={(value) => setAttributes({ subText: value })}
								allowedFormats={minimalRichText}
							/>
						</div>
					</div>
					{hasIcon && iconPosition === "four" && <MarketingButtonIcon />}
				</div>
			</div>
		</div>
	);
};

export default Edit;
